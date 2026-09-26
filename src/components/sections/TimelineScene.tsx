"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import styles from "./Experience.module.css";

/**
 * Drives the experience timeline: the rail draws itself with scroll, a
 * glowing marker travels down it, and each entry assembles as it arrives.
 */
export function TimelineScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // Rail and marker follow a reading line 65% down the screen. Progress
        // is measured live from the list's on-screen position on every scroll,
        // not from positions stored up front, so it stays right even if the
        // layout above changes after load (images, fonts, resizing).
        const line = q("[data-tl='line']")[0] as HTMLElement;
        const marker = q("[data-tl='marker']")[0] as HTMLElement;
        gsap.set(line, { scaleY: 0 });
        const fillTo = gsap.quickTo(line, "scaleY", { duration: 0.4, ease: "power2.out" });
        const markTo = gsap.quickTo(marker, "y", { duration: 0.4, ease: "power2.out" });

        let frame = 0;
        const update = () => {
          frame = 0;
          const r = el.getBoundingClientRect();
          const p = gsap.utils.clamp(0, 1, (window.innerHeight * 0.65 - r.top) / r.height);
          fillTo(p);
          markTo(p * r.height);
        };
        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);

        q("[data-tl='item']").forEach((item) => {
          const iq = gsap.utils.selector(item);
          gsap
            .timeline({
              scrollTrigger: {
                trigger: item,
                start: "top 68%",
                toggleClass: { targets: item, className: styles.lit },
              },
              defaults: { ease: "power3.out" },
            })
            .from(iq("[data-tl='period']"), { yPercent: 100, opacity: 0, duration: 0.9 })
            .from(iq("[data-tl='company']"), { x: -24, opacity: 0, duration: 0.8 }, 0.1)
            .from(iq("[data-tl='role']"), { y: 24, opacity: 0, duration: 0.9 }, 0.18)
            .from(iq("[data-tl='point']"), { y: 18, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.3)
            .from(iq("[data-tl='chip']"), { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.5);
        });

        return () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
        };
      });

      // Reduced motion: show the rail complete and hide the travelling marker.
      mm.add(MEDIA.reduced, () => {
        gsap.set(q("[data-tl='marker']"), { autoAlpha: 0 });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className={styles.timeline}>
      <span className={styles.rail} aria-hidden="true">
        <span className={styles.railFill} data-tl="line" />
      </span>
      <span className={styles.marker} data-tl="marker" aria-hidden="true" />
      {children}
    </ol>
  );
}
