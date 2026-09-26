"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import { drawGlowingBolt, fitCanvas } from "@/lib/effects/lightning";
import styles from "./LightningCursor.module.css";

type Strike = { x1: number; y1: number; x2: number; y2: number; life: number; displace: number; branchProb: number };

const INTERACTIVE = "a, button, [data-cursor], input, textarea, select, label";

/**
 * Green-magic cursor: a glowing, jittering core that leaves short-lived
 * lightning along the pointer's path. Stronger bolts while over something
 * interactive; `data-cursor-label` shows a caption such as "View project".
 * Desktop-only; touch and reduced-motion users keep the native cursor.
 */
export function LightningCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const query = window.matchMedia(`${FINE_POINTER} and ${MEDIA.motion}`);
    if (!query.matches) return;

    const html = document.documentElement;
    const dot = dotRef.current!;
    const label = labelRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    fitCanvas(canvas, ctx);
    html.classList.add("has-custom-cursor");

    const xTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });

    let lastX = -1;
    let lastY = -1;
    let hovered = false;
    let running = false;
    const strikes: Strike[] = [];

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = strikes.length - 1; i >= 0; i--) {
        const s = strikes[i];
        if (s.life <= 0) {
          strikes.splice(i, 1);
          continue;
        }
        drawGlowingBolt(
          ctx,
          { x: s.x1, y: s.y1 },
          { x: s.x2, y: s.y2 },
          { displace: s.displace, branchProb: s.branchProb, alpha: s.life, width: hovered ? 2 : 1.4 },
        );
        s.life -= 0.04;
      }
      // Stop the loop once every bolt has faded; the next move restarts it.
      if (strikes.length) requestAnimationFrame(render);
      else running = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = e;
      if (lastX < 0) {
        gsap.set(dot, { x, y, opacity: 1 });
        lastX = x;
        lastY = y;
      }
      xTo(x);
      yTo(y);

      if (Math.hypot(x - lastX, y - lastY) > 8) {
        strikes.push({
          x1: lastX,
          y1: lastY,
          x2: x,
          y2: y,
          life: 1,
          displace: hovered ? 16 : 9,
          branchProb: hovered ? 0.35 : 0.2,
        });
        lastX = x;
        lastY = y;
        if (!running) {
          running = true;
          requestAnimationFrame(render);
        }
      }
    };

    const setHover = (target: Element | null) => {
      const el = target?.closest<HTMLElement>(INTERACTIVE) ?? null;
      const next = Boolean(el);
      const text = el?.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "";
      label.textContent = text;
      dot.dataset.label = text ? "true" : "false";
      if (next === hovered && !text) return;
      hovered = next;
      gsap.to(dot, { scale: text ? 1 : hovered ? 1.8 : 1, duration: 0.4, ease: "power3.out" });
    };

    const onOver = (e: PointerEvent) => setHover(e.target as Element);
    const onLeaveWindow = () => gsap.to(dot, { opacity: 0, duration: 0.3 });
    const onEnterWindow = () => gsap.to(dot, { opacity: 1, duration: 0.3 });
    const onResize = () => fitCanvas(canvas, ctx);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.documentElement.addEventListener("pointerenter", onEnterWindow);
    window.addEventListener("resize", onResize);

    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.removeEventListener("pointerenter", onEnterWindow);
      window.removeEventListener("resize", onResize);
      strikes.length = 0;
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.trail} aria-hidden="true" />
      <div ref={dotRef} className={styles.cursor} data-label="false" aria-hidden="true">
        <span className={styles.core} />
        <span ref={labelRef} className={styles.label} />
      </div>
    </>
  );
}
