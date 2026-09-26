"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import { revealUp } from "@/lib/animations/reveal";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the block as a whole. */
  stagger?: boolean;
  delay?: number;
  as?: "div" | "dl" | "ul" | "ol";
};

/** Fades its content upward the first time it scrolls into view. */
export function Reveal({ children, className, stagger = false, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const el = ref.current!;
        revealUp(stagger ? el.children : el, { trigger: el, delay });
      });
    },
    { scope: ref },
  );

  // Typed as div for the ref; the rendered tag still follows `as`.
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
