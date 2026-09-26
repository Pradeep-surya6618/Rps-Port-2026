"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA, parallaxScale } from "@/lib/animations/media";
import { parallax } from "@/lib/animations/parallax";

type ParallaxProps = {
  /** 0.15 = distant background, 1 = content, 1.2 = foreground running ahead. */
  speed: number;
  axis?: "x" | "y";
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
  children?: React.ReactNode;
};

/** A layer that moves at its own speed while its parent section scrolls past. */
export function Parallax({ speed, axis = "y", className, style, children, ...rest }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MEDIA.desktop, tablet: MEDIA.tablet, mobile: MEDIA.mobile }, (ctx) => {
        const c = ctx.conditions as { desktop: boolean; tablet: boolean };
        const el = ref.current!;
        parallax(el, { speed, axis, scale: parallaxScale(c), trigger: el.parentElement ?? el });
      });
    },
    { scope: ref, dependencies: [speed, axis] },
  );

  return (
    // Own GPU layer: moving it on scroll must not repaint the section behind it.
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }} {...rest}>
      {children}
    </div>
  );
}
