"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/media";
import { drawGlowingBolt, fitCanvas } from "@/lib/effects/lightning";
import { useSite } from "@/components/providers/SiteProvider";
import { profile } from "@/data/profile";
import { brandAccentAttr, brandPalette } from "@/data/theme";
import styles from "./IntroLoader.module.css";

const SEEN_KEY = "ps-intro-seen";

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the full intro simply plays again */
  }
}

/**
 * Loki-style entrance: the name forges in the dark while lightning strikes
 * around it. On click (or after a short wait) a final bolt hits the name, the
 * letters implode into the impact point, and a glowing ring bursts outward,
 * opening a portal through which the site appears.
 */
export function IntroLoader() {
  const { finishIntro } = useSite();
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<SVGSVGElement>(null);
  const boltsRef = useRef<HTMLCanvasElement>(null);
  const leaveRef = useRef<() => void>(() => {});
  // Decided once per mount, so Strict Mode's double effect run cannot flip it.
  const quickRef = useRef<boolean | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const overlay = root.current!;
      const mark = markRef.current!;
      const q = gsap.utils.selector(overlay);
      const reduced = prefersReducedMotion();
      if (quickRef.current === null) {
        quickRef.current = readSeen();
        markSeen();
      }
      const quick = quickRef.current;

      let leaving = false;
      const timers: number[] = [];
      const cleanups: Array<() => void> = [];

      const done = () => setGone(true);

      // ── Reduced motion: a short, calm fade and nothing else. ──
      if (reduced) {
        gsap.set(q("[data-letter], [data-script], [data-line], [data-hint]"), { opacity: 1 });
        const leave = () => {
          if (leaving) return;
          leaving = true;
          finishIntro();
          gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power1.out", onComplete: done });
        };
        leaveRef.current = leave;
        timers.push(window.setTimeout(leave, 700));
        return () => timers.forEach(clearTimeout);
      }

      // ── Lightning strikes on the bolt canvas. ──
      const boltCanvas = boltsRef.current!;
      const bctx = boltCanvas.getContext("2d")!;
      fitCanvas(boltCanvas, bctx);

      // Draws one bolt for a dozen frames. `final` is the big strike that
      // opens the portal, so it runs even while leaving.
      const bolt = (from: { x: number; y: number }, to: { x: number; y: number }, final = false) => {
        let frames = 0;
        const draw = () => {
          bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (frames++ < (final ? 16 : 12) && (final || !leaving)) {
            drawGlowingBolt(
              bctx,
              from,
              to,
              { displace: final ? 140 : 100, branchProb: final ? 0.55 : 0.4, width: final ? 3.5 : 2.5 },
              brandPalette.bolt,
            );
            requestAnimationFrame(draw);
          }
        };
        draw();
      };

      const strike = () => {
        if (leaving) return;
        const r = mark.getBoundingClientRect();
        bolt(
          { x: r.left + Math.random() * r.width, y: -10 },
          { x: r.left + r.width * (0.15 + Math.random() * 0.7), y: r.top + r.height * (0.2 + Math.random() * 0.6) },
        );
        gsap.to(q("[data-flash]"), { opacity: 0.7, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
        gsap.to(mark, {
          x: () => (Math.random() - 0.5) * 6,
          y: () => (Math.random() - 0.5) * 6,
          duration: 0.08,
          repeat: 3,
          yoyo: true,
          onComplete: () => void gsap.to(mark, { x: 0, y: 0, duration: 0.3 }),
        });
      };

      // ── Forge the name. ──
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(q("[data-line]"), { scaleX: 0, opacity: 1 }, { scaleX: 0.18, duration: quick ? 0.25 : 0.45 })
        .fromTo(
          q("[data-letter]"),
          { opacity: 0, yPercent: 60, rotateX: -70, filter: "blur(12px)" },
          { opacity: 1, yPercent: 0, rotateX: 0, filter: "blur(0px)", duration: quick ? 0.6 : 0.9, stagger: quick ? 0.03 : 0.055 },
          quick ? 0.1 : 0.2,
        )
        .fromTo(
          q("[data-script]"),
          { clipPath: "inset(-20% 100% -20% 0%)", opacity: 1 },
          { clipPath: "inset(-20% 0% -20% 0%)", duration: quick ? 0.6 : 1, ease: "power2.inOut" },
          quick ? 0.35 : 0.65,
        )
        .to(q("[data-line]"), { scaleX: 1, duration: 0.8, ease: "expo.inOut" }, quick ? 0.5 : 0.95)
        .fromTo(q("[data-hint]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, quick ? 0.6 : 1.3);

      if (!quick) {
        timers.push(window.setTimeout(strike, 750));
        timers.push(
          window.setTimeout(() => {
            strike();
            if (Math.random() > 0.4) timers.push(window.setTimeout(strike, 320));
          }, 1650),
        );
      }

      // ── Hand over to the site: final strike → implode → portal. ──
      const leave = contextSafe!(() => {
        if (leaving) return;
        leaving = true;
        intro.progress(1);

        const r = mark.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Far enough to clear the farthest corner from the impact point.
        const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 40;

        bolt({ x: cx + (Math.random() - 0.5) * 120, y: -10 }, { x: cx, y: cy }, true);

        const backdrop = backdropRef.current!;
        const portal = portalRef.current!;
        const rings = portal.querySelectorAll("circle");
        gsap.set(rings, { attr: { cx, cy, r: 0 } });
        gsap.set(backdrop, { "--cx": `${cx}px`, "--cy": `${cy}px`, "--r": "0px" });

        const tl = gsap.timeline({ onComplete: done });
        tl.to(q("[data-hint]"), { opacity: 0, duration: 0.25 }, 0)
          .to(q("[data-flash]"), { opacity: 1, duration: 0.12, ease: "power2.out" }, 0)
          .to(q("[data-flash]"), { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.12)
          // The letters collapse into the point of impact.
          .to(mark, { scale: 0.15, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power3.in" }, 0.08)
          .to(q("[data-stage]"), { autoAlpha: 0, duration: 0.25 }, 0.45)
          // Portal: the backdrop is cut away inside a growing circle while the
          // glowing ring rides its edge. The hero's entrance starts inside it.
          .set(backdrop, { attr: { "data-portal": "" } }, 0.5)
          .set(portal, { autoAlpha: 1 }, 0.5)
          .call(finishIntro, undefined, 0.5)
          .set(overlay, { pointerEvents: "none" }, 0.5)
          .to(backdrop, { "--r": `${maxR}px`, duration: 1.05, ease: "power3.in" }, 0.5)
          .to(rings, { attr: { r: maxR }, duration: 1.05, ease: "power3.in" }, 0.5)
          .to(portal, { autoAlpha: 0, duration: 0.3 }, 1.3);
      });
      leaveRef.current = leave;

      timers.push(window.setTimeout(leave, quick ? 1300 : 3000));

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") leave();
      };
      const onResize = () => fitCanvas(boltCanvas, bctx);
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", onResize);
      cleanups.push(() => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      });

      return () => {
        timers.forEach(clearTimeout);
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: root },
  );

  if (gone) return null;

  const letters = profile.firstName.toUpperCase().split("");

  return (
    <div ref={root} className={styles.intro} data-intro data-accent={brandAccentAttr}>
      <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />
      <div className={styles.stage} data-stage>
        <div className={styles.flash} data-flash aria-hidden="true" />
        <button
          ref={markRef}
          type="button"
          className={styles.mark}
          onClick={() => leaveRef.current()}
          aria-label={`Enter ${profile.fullName}'s portfolio`}
        >
          <span className={styles.first} aria-hidden="true">
            {letters.map((l, i) => (
              <span key={i} className={styles.letter} data-letter>
                {l}
              </span>
            ))}
          </span>
          <span className={styles.script} data-script aria-hidden="true">
            {profile.lastName}
          </span>
          <span className={styles.line} data-line aria-hidden="true" />
        </button>
        <p className={styles.hint} data-hint>
          Click to enter
        </p>
      </div>
      <canvas ref={boltsRef} className={styles.bolts} aria-hidden="true" />
      <svg ref={portalRef} className={styles.portal} aria-hidden="true">
        <circle className={styles.ringGlow} r="0" />
        <circle className={styles.ringCore} r="0" />
      </svg>
    </div>
  );
}
