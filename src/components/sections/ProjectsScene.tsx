"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import styles from "./Projects.module.css";

/**
 * Each project is a full-viewport scene. The scenes are CSS-sticky at every
 * width, so each panel slides over the last while the previous one recedes;
 * on desktop the number, text and screenshot inside a scene also travel at
 * different speeds. GPU layers are only promoted for panels near the view.
 */
export function ProjectsScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>("[data-pj='panel']", root.current);

      // Panels are sticky, so earlier ones stay "on screen" underneath later
      // ones. Track the current scene by position instead: it and its
      // neighbours get GPU layers ([data-near]); scenes two or more behind are
      // fully covered and are not drawn at all ([data-covered]).
      let frame = 0;
      let last = -2;
      const mark = () => {
        frame = 0;
        let current = 0;
        panels.forEach((p, i) => {
          if (p.getBoundingClientRect().top <= 1) current = i;
        });
        if (current === last) return;
        last = current;
        panels.forEach((p, i) => {
          p.toggleAttribute("data-near", Math.abs(i - current) <= 1);
          p.toggleAttribute("data-covered", i < current - 1);
        });
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(mark);
      };
      mark();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);

      mm.add(
        {
          big: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
          small: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { big } = ctx.conditions as { big: boolean };

          panels.forEach((panel, i) => {
            const q = gsap.utils.selector(panel);
            const enter = { trigger: panel, start: "top bottom", end: "top top", scrub: 0.6 };

            // Desktop: layers settle into place at different speeds as the
            // scene arrives. Phones skip this inner parallax: it needs several
            // extra GPU layers per scene, more than mobile browsers can hold.
            if (big) {
              gsap.fromTo(q("[data-pj='number']"), { yPercent: 40 }, { yPercent: -10, ease: "none", scrollTrigger: enter });
              gsap.fromTo(q("[data-pj='media']"), { yPercent: 18 }, { yPercent: 0, ease: "none", scrollTrigger: enter });
              gsap.fromTo(q("[data-pj='text']"), { y: 140 }, { y: 0, ease: "none", scrollTrigger: enter });
            }
            // The large backdrop gradient stays still: animating it (scale or
            // opacity) forced a full-screen repaint on every scroll frame.

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
            if (next) {
              gsap
                .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
                .to(q("[data-pj='scene']"), { scale: big ? 0.9 : 0.92, yPercent: big ? -4 : -2, ease: "none" }, 0)
                .to(q("[data-pj='dim']"), { opacity: 0.6, ease: "none" }, 0);
            }
          });
        },
      );

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

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.stack}>
      {children}
    </div>
  );
}
