"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";

/**
 * Motion for the Instagram section:
 * - the phone turns in 3D as the section scrolls past, and tilts to the pointer
 * - the follower count climbs to its value on first view
 * - looping CSS effects (hearts, marquee) run only while the section is on screen
 */
export function InstagramScene({ className, children }: { className?: string; children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);

      // Pause CSS loops off screen.
      const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-inview", e.isIntersecting));
      io.observe(el);

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // Count up to the real follower figure (server renders the final value).
        const counter = q("[data-ig='count']")[0] as HTMLElement | undefined;
        if (counter) {
          const target = Number(counter.dataset.target);
          const value = { v: 0 };
          gsap.to(value, {
            v: target,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: counter, start: "top 85%", once: true },
            onUpdate: () => {
              counter.textContent = `${value.v.toFixed(1)}K`;
            },
          });
        }

        // The phone swings from a side angle to facing the viewer.
        gsap.fromTo(
          q("[data-ig='phone']"),
          { rotateY: 24, rotateX: 10, y: 70 },
          {
            rotateY: -10,
            rotateX: -4,
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );

        // Post tiles pop in once.
        gsap.from(q("[data-ig='tile']"), {
          scale: 0.6,
          opacity: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: q("[data-ig='stage']")[0], start: "top 70%", once: true },
        });
      });

      mm.add(`${FINE_POINTER} and ${MEDIA.motion}`, () => {
        const card = q("[data-ig='tilt']")[0] as HTMLElement;
        const stage = q("[data-ig='stage']")[0] as HTMLElement;
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.9, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.9, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });

      return () => io.disconnect();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="instagram" className={className} data-accent="pink" aria-labelledby="instagram-title">
      {children}
    </section>
  );
}
