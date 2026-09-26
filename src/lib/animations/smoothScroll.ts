"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * One scroll system: Lenis drives the scroll position, GSAP's ticker drives
 * Lenis, and every Lenis scroll event updates ScrollTrigger.
 */
export function createSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
    autoRaf: false,
    // In-page links (#work, #contact…) glide instead of jumping.
    anchors: { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) },
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}
