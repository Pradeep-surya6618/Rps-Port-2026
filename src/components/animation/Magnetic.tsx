"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import { magnetic } from "@/lib/animations/magnetic";

type MagneticProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

/** Wrapper that lets its child drift toward the pointer (desktop only). */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER} and ${MEDIA.motion}`, () => magnetic(ref.current!, strength));
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
