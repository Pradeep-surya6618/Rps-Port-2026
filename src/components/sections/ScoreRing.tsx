"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import styles from "./Education.module.css";

type ScoreRingProps = { score: string };

/** A ring that fills to the score's percentage the first time it scrolls into view. */
export function ScoreRing({ score }: ScoreRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const percent = Math.min(100, Math.max(0, parseFloat(score)));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from(ref.current!.querySelector("[data-ring]"), {
          strokeDashoffset: 100,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={styles.ring} role="img" aria-label={`Scored ${score}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="28" pathLength={100} className={styles.ringTrack} />
        <circle
          cx="32"
          cy="32"
          r="28"
          pathLength={100}
          className={styles.ringFill}
          style={{ strokeDashoffset: 100 - percent }}
          data-ring
        />
      </svg>
      <span className={styles.ringValue} aria-hidden="true">
        {score}
      </span>
    </div>
  );
}
