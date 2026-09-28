/**
 * Performance tiers. Capable machines get the full experience; slower ones
 * get "lite" mode (html.perf-lite): no backdrop blur, grain, lightning trail,
 * dust or looping decorative animations, and native scrolling instead of
 * Lenis. Layouts, colours and scroll-driven scenes are the same in both.
 *
 * Lite is chosen by, in order:
 *  1. ?lite=1 / ?full=1 in the URL (for testing), remembered for the tab
 *  2. a decision already made earlier in this tab (sessionStorage)
 *  3. a low-end device: 4 or fewer CPU threads, or 4 GB of memory or less
 *  4. a software / basic graphics driver (checked after load)
 *  5. a sustained low frame rate while the intro plays (checked after load)
 */

export const PERF_KEY = "ps-perf";
export const LITE_CLASS = "perf-lite";
export const LITE_EVENT = "perflite";

/** Runs in <head> before first paint (cheap checks only). */
export const perfInitScript = `(function(){try{var d=document.documentElement,q=location.search,k="${PERF_KEY}",s=null;
if(/[?&]lite=1/.test(q)){s="lite";sessionStorage.setItem(k,s)}else if(/[?&]full=1/.test(q)){s="full";sessionStorage.setItem(k,s)}else{s=sessionStorage.getItem(k)}
var lite=s?s==="lite":false;
if(!s){var n=navigator,m=n.deviceMemory,c=n.hardwareConcurrency;lite=(m&&m<=4)||(c&&c<=4)}
if(lite)d.classList.add("${LITE_CLASS}")}catch(e){}})()`;

export function isLite() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(LITE_CLASS);
}

/** Switches the page to lite mode for the rest of this tab. */
export function enableLite() {
  if (isLite()) return;
  document.documentElement.classList.add(LITE_CLASS);
  try {
    sessionStorage.setItem(PERF_KEY, "lite");
  } catch {
    /* storage unavailable: lite lasts for this page view only */
  }
  window.dispatchEvent(new Event(LITE_EVENT));
}

function userChose() {
  try {
    return sessionStorage.getItem(PERF_KEY) !== null;
  } catch {
    return false;
  }
}

/** True when the browser is drawing with a software or basic graphics driver. */
function softwareGraphics() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * After load: check the graphics driver, then watch the frame rate for a few
 * seconds of real use. Sustained slow frames switch to lite mode.
 * Returns a cleanup function.
 */
export function watchPerformance() {
  if (isLite() || userChose()) return () => {};
  if (softwareGraphics()) {
    enableLite();
    return () => {};
  }

  let raf = 0;
  let last = 0;
  const frames: number[] = [];
  const tick = (t: number) => {
    if (last) frames.push(t - last);
    last = t;
    if (frames.length < 120) {
      raf = requestAnimationFrame(tick);
      return;
    }
    // Median frame time over ~2 s; above 28 ms is under ~35 fps.
    const sorted = [...frames].sort((a, b) => a - b);
    if (sorted[Math.floor(sorted.length / 2)] > 28) enableLite();
  };
  // Starts during the intro (already animating), so slow machines are known
  // before the hero appears; skip the first moment of loading work.
  const start = window.setTimeout(() => (raf = requestAnimationFrame(tick)), 500);
  return () => {
    window.clearTimeout(start);
    cancelAnimationFrame(raf);
  };
}
