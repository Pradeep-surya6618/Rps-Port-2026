"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import styles from "./Projects.module.css";

/**
 * Each project is a full-viewport scene. On larger screens the scenes are
 * CSS-sticky, so every panel slides over the last while the previous one
 * recedes; inside a scene the backdrop, number, text and screenshot all
 * travel at different speeds.
 */
export function ProjectsScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>("[data-pj='panel']", root.current);

      mm.add({ big: "(min-width: 900px) and (prefers-reduced-motion: no-preference)", small: MEDIA.mobile }, (ctx) => {
        const { big } = ctx.conditions as { big: boolean };
        const s = big ? 1 : 0.4;

        panels.forEach((panel, i) => {
          const q = gsap.utils.selector(panel);
          const enter = { trigger: panel, start: "top bottom", end: "top top", scrub: 0.6 };

          // Layers settle into place as the scene arrives.
          gsap.fromTo(q("[data-pj='number']"), { yPercent: 40 * s }, { yPercent: -10 * s, ease: "none", scrollTrigger: enter });
          gsap.fromTo(q("[data-pj='media']"), { yPercent: 18 * s }, { yPercent: 0, ease: "none", scrollTrigger: enter });
          gsap.fromTo(q("[data-pj='text']"), { y: 140 * s }, { y: 0, ease: "none", scrollTrigger: enter });
          gsap.fromTo(q("[data-pj='backdrop']"), { opacity: 0.5, scale: 1.2 }, { opacity: 1, scale: 1, ease: "none", scrollTrigger: enter });

          gsap.from(q("[data-pj='tag']"), {
            y: 16,
            opacity: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: big ? "top 35%" : "top 70%" },
          });

          // While the next scene covers this one, push it back into the dark.
          const next = panels[i + 1];
          if (big && next) {
            gsap
              .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
              .to(q("[data-pj='scene']"), { scale: 0.9, yPercent: -4, ease: "none" }, 0)
              .to(q("[data-pj='dim']"), { opacity: 0.6, ease: "none" }, 0);
          }
        });
      });

      // Pointer tilt on the screenshots (desktop, fine pointer only).
      mm.add(`${FINE_POINTER} and ${MEDIA.desktop}`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-pj='visual']", root.current).map((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 6);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.stack}>
      {children}
    </div>
  );
}
