"use client";

import { useEffect, useRef } from "react";
import { MEDIA } from "@/lib/animations/media";

type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };

/**
 * Slow-drifting green dust. Runs only while the hero is on screen, uses
 * fewer motes on small screens and draws a single still frame for
 * reduced-motion visitors.
 */
export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia(MEDIA.reduced).matches;
    let motes: Mote[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const seed = () => {
      // Soft dust needs no detail: draw at half resolution and let CSS scale it
      // up, a quarter of the pixels to upload to the GPU each frame.
      const dpr = 0.5;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 26 : 70;
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.22 + 0.05),
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.tw += 0.02;
        if (m.y < -4) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        const alpha = m.a * (0.65 + Math.sin(m.tw) * 0.35);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 255, 180, ${alpha})`;
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    seed();
    if (reduced) {
      draw();
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
}
