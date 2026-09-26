"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";

/**
 * Scroll-driven type: the two lines slide past each other while green light
 * fills each outlined word, then the supporting sentence arrives.
 * The section is tall and its content CSS-sticky, so no pin is needed.
 */
export function PhilosophyScene({ className, children }: { className?: string; children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
          })
          .fromTo(q("[data-ph='line-0']"), { xPercent: 7 }, { xPercent: -5, duration: 1 }, 0)
          .fromTo(q("[data-ph='line-1']"), { xPercent: -7 }, { xPercent: 5, duration: 1 }, 0)
          .fromTo(q("[data-ph='fill-0']"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 }, 0.05)
          .fromTo(q("[data-ph='fill-1']"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 }, 0.35)
          .fromTo(q("[data-ph='glow']"), { scale: 0.6, opacity: 0.2 }, { scale: 1.2, opacity: 1, duration: 0.8 }, 0.1)
          .fromTo(q("[data-ph='glyph']"), { rotate: -12, yPercent: 30 }, { rotate: 8, yPercent: -30, duration: 1 }, 0)
          .fromTo(q("[data-ph='text']"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.72);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={className} aria-label="How I work">
      {children}
    </section>
  );
}
