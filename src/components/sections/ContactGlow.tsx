"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import styles from "./ContactHud.module.css";

const C = 300; // centre of the 600×600 viewBox

/** Tick marks around a circle: every `step` degrees, longer every `major`. */
function ticks(r: number, step: number, major: number, short: number, long: number) {
  const out: string[] = [];
  for (let a = 0; a < 360; a += step) {
    const len = a % major === 0 ? long : short;
    const t = (a * Math.PI) / 180;
    const x1 = C + Math.cos(t) * r;
    const y1 = C + Math.sin(t) * r;
    const x2 = C + Math.cos(t) * (r - len);
    const y2 = C + Math.sin(t) * (r - len);
    out.push(`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  return out.join("");
}

/** SVG arc path from angle a0 to a1 (degrees) at radius r. */
function arc(r: number, a0: number, a1: number) {
  const p = (a: number) => {
    const t = ((a - 90) * Math.PI) / 180;
    return `${(C + Math.cos(t) * r).toFixed(1)} ${(C + Math.sin(t) * r).toFixed(1)}`;
  };
  return `M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
}

/** Rings from outside in. Each has its own spin speed and direction (CSS). */
const RINGS = [
  { key: "dial", spin: "slowCw" },
  { key: "arcs", spin: "medCcw" },
  { key: "dots", spin: "slowCcw" },
  { key: "segments", spin: "fastCw" },
  { key: "inner", spin: "medCw" },
] as const;

/**
 * JARVIS-style HUD behind the closing call to action: counter-rotating dials,
 * arc segments, a radar sweep and a pulsing core. It boots up (rings unfold
 * from the centre) when the section arrives, grows with scroll, leans toward
 * the pointer, and pauses its loops while off screen.
 */
export function ContactGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const section = el.parentElement!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // Loops only run while the section is on screen.
      const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-live", e.isIntersecting));
      io.observe(section);

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          el,
          { scale: 0.7, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 20%", scrub: 0.6 } },
        );

        // Boot sequence: core ignites, rings unfold outward, then the readouts.
        gsap
          .timeline({ scrollTrigger: { trigger: section, start: "top 70%" }, defaults: { ease: "expo.out" } })
          .from(q("[data-hud='core']"), { scale: 0, opacity: 0, duration: 0.9, transformOrigin: "50% 50%" })
          .from(
            q("[data-hud='ring']").reverse(),
            { scale: 0.4, opacity: 0, rotate: -40, duration: 1.4, stagger: 0.12, transformOrigin: "50% 50%" },
            0.15,
          )
          .from(q("[data-hud='sweep']"), { opacity: 0, duration: 0.6 }, 0.8)
          .from(q("[data-hud='mark']"), { opacity: 0, scale: 0.6, duration: 0.6, stagger: 0.08, transformOrigin: "50% 50%" }, 1);
      });

      mm.add(`${FINE_POINTER} and ${MEDIA.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 2, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.2);
          yTo((e.clientY - r.top - r.height / 2) * 0.2);
        };
        section.addEventListener("pointermove", move);
        return () => section.removeEventListener("pointermove", move);
      });

      return () => io.disconnect();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`${className ?? ""} ${styles.hud}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" className={styles.svg}>
        <defs>
          <radialGradient id="hud-core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff4e0" stopOpacity="1" />
            <stop offset="0.25" stopColor="#ffb86b" stopOpacity="0.9" />
            <stop offset="0.6" style={{ stopColor: "rgb(var(--accent-rgb))", stopOpacity: 0.45 }} />
            <stop offset="1" style={{ stopColor: "rgb(var(--accent-rgb))", stopOpacity: 0 }} />
          </radialGradient>
          <linearGradient id="hud-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffb86b" stopOpacity="0" />
            <stop offset="1" stopColor="#ffb86b" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {RINGS.map(({ key, spin }) => (
          <g key={key} data-hud="ring">
            <g className={`${styles.spin} ${styles[spin]}`}>
              {key === "dial" && (
                <>
                  <circle cx={C} cy={C} r={290} className={styles.hair} />
                  <path d={ticks(290, 5, 30, 7, 16)} className={styles.tick} />
                  <path d={arc(276, 20, 70)} className={styles.bright} />
                  <path d={arc(276, 200, 235)} className={styles.bright} />
                </>
              )}
              {key === "arcs" && (
                <>
                  <path d={arc(252, 0, 62)} className={styles.thick} />
                  <path d={arc(252, 95, 128)} className={styles.thickDim} />
                  <path d={arc(252, 170, 262)} className={styles.thick} />
                  <path d={arc(252, 300, 330)} className={styles.thickDim} />
                  <circle cx={C} cy={C} r={238} className={styles.hair} />
                </>
              )}
              {key === "dots" && <circle cx={C} cy={C} r={218} className={styles.dotted} />}
              {key === "segments" && (
                <>
                  <circle cx={C} cy={C} r={186} className={styles.segments} />
                  <path d={ticks(166, 10, 90, 5, 12)} className={styles.tick} />
                </>
              )}
              {key === "inner" && (
                <>
                  <path d={arc(128, 10, 290)} className={styles.bright} />
                  <circle cx={C} cy={C} r={112} className={styles.dashed} />
                  <path d={ticks(96, 15, 45, 4, 9)} className={styles.tick} />
                </>
              )}
            </g>
          </g>
        ))}

        {/* Radar sweep */}
        <g data-hud="sweep">
          <g className={`${styles.spin} ${styles.sweep}`}>
            <path d={`M${C} ${C}L${C + 228} ${C}A228 228 0 0 0 ${C + 197.5} ${C - 114}Z`} fill="url(#hud-sweep)" />
          </g>
        </g>

        {/* Targeting marks on the cardinal points */}
        {[0, 90, 180, 270].map((a) => (
          <g key={a} data-hud="mark" transform={`rotate(${a} ${C} ${C})`}>
            <path d={`M${C - 6} ${C - 312}L${C} ${C - 302}L${C + 6} ${C - 312}`} className={styles.mark} />
          </g>
        ))}

        {/* Core */}
        <g data-hud="core">
          <circle cx={C} cy={C} r={70} fill="url(#hud-core)" className={styles.corePulse} />
          <circle cx={C} cy={C} r={34} className={styles.coreRing} />
          <circle cx={C} cy={C} r={10} className={styles.coreDot} />
        </g>

        {/* Status blips */}
        {[
          [C + 214, C - 150, 0],
          [C - 238, C + 92, 0.8],
          [C + 120, C + 228, 1.6],
        ].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r={3.2} className={styles.blip} style={{ animationDelay: `${d}s` }} />
        ))}
      </svg>
    </div>
  );
}
