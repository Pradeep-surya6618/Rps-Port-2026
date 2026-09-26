/** Shared gsap.matchMedia conditions so every scene degrades the same way. */
export const MEDIA = {
  desktop: "(min-width: 1200px) and (prefers-reduced-motion: no-preference)",
  tablet: "(min-width: 768px) and (max-width: 1199.98px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export type MediaConditions = { [K in keyof typeof MEDIA]: boolean };

export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MEDIA.reduced).matches;
}

/** Parallax is reduced on smaller screens rather than removed. */
export function parallaxScale(c: Pick<MediaConditions, "desktop" | "tablet">) {
  if (c.desktop) return 1;
  if (c.tablet) return 0.6;
  return 0.35;
}
