"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type Lenis from "lenis";
import { createSmoothScroll } from "@/lib/animations/smoothScroll";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/media";
import { isLite, LITE_EVENT, watchPerformance } from "@/lib/perf";

type SiteContextValue = {
  /** True once the intro has handed the screen over to the page. */
  introDone: boolean;
  finishIntro: () => void;
  scrollTo: (target: string | number) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Lite mode (slower machines) keeps the browser's native scrolling: it
    // runs off the main thread, so it stays smooth when the page is busy.
    if (prefersReducedMotion() || isLite()) return;
    const smooth = createSmoothScroll();
    smooth.lenis.stop();
    lenisRef.current = smooth.lenis;

    const dropToNative = () => {
      smooth.destroy();
      lenisRef.current = null;
      ScrollTrigger.refresh();
    };
    window.addEventListener(LITE_EVENT, dropToNative, { once: true });
    return () => {
      window.removeEventListener(LITE_EVENT, dropToNative);
      if (lenisRef.current) smooth.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Without Lenis (lite mode / reduced motion), in-page links still glide.
  // Done here rather than with CSS scroll-behavior, which would also smooth
  // ScrollTrigger's own internal scroll jumps and make scenes lag.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (lenisRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const target = link && link.hash.length > 1 ? document.querySelector(link.hash) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!introDone) return;
    document.documentElement.classList.remove("intro-active");
    lenisRef.current?.start();
    // Layout may have shifted while the intro held the page (fonts, images),
    // and the hero pin was only just created: re-sort and re-measure.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, [introDone]);

  // Watch the frame rate from the start (during the intro); slow machines switch to lite.
  useEffect(() => watchPerformance(), []);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    if (typeof target === "number") window.scrollTo({ top: target, behavior });
    else document.querySelector(target)?.scrollIntoView({ behavior });
  }, []);

  const value = useMemo(() => ({ introDone, finishIntro, scrollTo }), [introDone, finishIntro, scrollTo]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
