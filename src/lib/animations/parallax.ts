"use client";

import { gsap } from "./gsap";

export type ParallaxOptions = {
  /**
   * Scroll speed relative to the page: 1 moves with the content, 0.15 lags
   * far behind (a distant background), 1.2 runs slightly ahead.
   */
  speed: number;
  trigger?: Element;
  /** Multiplier from parallaxScale() so small screens move less. */
  scale?: number;
  axis?: "x" | "y";
  start?: string;
  end?: string;
};

/**
 * Offsets an element as its trigger crosses the viewport. The travel is
 * derived from the viewport height so "speed" means the same thing on every
 * section, and it is centred so the element sits at its layout position
 * when the trigger is mid-screen.
 */
export function parallax(el: Element, { speed, trigger, scale = 1, axis = "y", start = "top bottom", end = "bottom top" }: ParallaxOptions) {
  const travel = (1 - speed) * scale;
  if (travel === 0) return;
  const prop = axis === "y" ? "y" : "x";
  return gsap.fromTo(
    el,
    { [prop]: () => -travel * window.innerHeight * 0.5 },
    {
      [prop]: () => travel * window.innerHeight * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: trigger ?? el,
        start,
        end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** Applies parallax to every [data-speed] element inside a scope. */
export function parallaxAll(scope: Element, scale = 1, trigger?: Element) {
  scope.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
    const speed = Number(el.dataset.speed);
    if (!Number.isFinite(speed)) return;
    parallax(el, { speed, scale, trigger: trigger ?? scope, axis: el.dataset.axis === "x" ? "x" : "y" });
  });
}
