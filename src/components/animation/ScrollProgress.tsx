"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import styles from "./ScrollProgress.module.css";

/** Hairline on the right edge that fills as the visitor moves through the page. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      },
    );
  });

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={bar} className={styles.bar} />
    </div>
  );
}
