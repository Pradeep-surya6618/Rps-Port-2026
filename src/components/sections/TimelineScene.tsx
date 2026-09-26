"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import styles from "./Experience.module.css";

/**
 * Drives the experience timeline: the rail draws itself with scroll, a green
 * marker travels down it, and each entry assembles as the marker arrives.
 */
export function TimelineScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const track = { trigger: el, start: "top 65%", end: "bottom 65%", scrub: 0.5 };
        gsap.fromTo(q("[data-tl='line']"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: track });
        gsap.fromTo(
          q("[data-tl='marker']"),
          { y: 0 },
          { y: () => el.offsetHeight, ease: "none", scrollTrigger: { ...track, invalidateOnRefresh: true } },
        );

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
