"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";

/**
 * The large emerald light behind the closing call to action. It swells as the
 * section arrives and leans toward the pointer.
 */
export function ContactGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const section = el.parentElement!;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          el,
          { scale: 0.55, opacity: 0.4 },
          { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 20%", scrub: 0.6 } },
        );
      });

      mm.add(`${FINE_POINTER} and ${MEDIA.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 2, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.25);
        };
        section.addEventListener("pointermove", move);
        return () => section.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <span />
    </div>
  );
}
