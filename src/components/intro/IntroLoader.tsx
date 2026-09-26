"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/media";
import { createMagicWipe, type MagicWipe } from "@/lib/effects/magicShader";
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
 * Loki-style entrance: the name forges in the dark, green lightning strikes
 * around it, and a click (or a short wait) sends a noise-warped wave of green
 * magic over the screen that recedes to reveal the site.
 */
export function IntroLoader() {
  const { finishIntro } = useSite();
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLButtonElement>(null);
  const shaderRef = useRef<HTMLCanvasElement>(null);
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
      let wipe: MagicWipe | null = null;
      const timers: number[] = [];
      const cleanups: Array<() => void> = [];

      const done = () => {
        wipe?.destroy();
        wipe = null;
        setGone(true);
      };

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

      const strike = () => {
        if (leaving) return;
        const r = mark.getBoundingClientRect();
        const from = { x: r.left + Math.random() * r.width, y: -10 };
        const to = {
          x: r.left + r.width * (0.15 + Math.random() * 0.7),
          y: r.top + r.height * (0.2 + Math.random() * 0.6),
        };
        let frames = 0;
        const draw = () => {
          bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (frames++ < 12 && !leaving) {
            drawGlowingBolt(bctx, from, to, { displace: 100, branchProb: 0.4 }, brandPalette.bolt);
            requestAnimationFrame(draw);
          }
        };
        draw();
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

      // ── Hand over to the site. ──
      const leave = contextSafe!(() => {
        if (leaving) return;
        leaving = true;
        intro.progress(1);
        bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const shader = shaderRef.current!;
        wipe = createMagicWipe(shader, brandPalette.wipe);
        const progress = { value: 0 };
        const render = () => wipe?.render(progress.value);

        if (!wipe) {
          // No WebGL: dissolve the overlay instead of the shader wipe.
          finishIntro();
          gsap.to(overlay, { opacity: 0, duration: 0.8, onComplete: done });
          return;
        }

        gsap.ticker.add(render);
        cleanups.push(() => gsap.ticker.remove(render));

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.ticker.remove(render);
            done();
          },
        });
        tl.to(mark, {
          scale: 1.25,
          opacity: 0,
          filter: "drop-shadow(0 0 60px rgba(0, 255, 136, 0.95)) blur(10px)",
          duration: 1.5,
          ease: "power2.out",
        })
          .to(q("[data-hint]"), { opacity: 0, duration: 0.3 }, 0)
          .to(progress, { value: 0.5, duration: 1.5, ease: "power2.inOut" }, 0.25)
          // Start the hero's entrance while the wave still hides it, so the
          // retreating magic uncovers a scene already coming to life.
          .call(finishIntro, undefined, 1.05)
          // Fully covered: drop the dark overlay.
          .set(overlay, { backgroundColor: "transparent", pointerEvents: "none" }, 1.75)
          .set(q("[data-stage]"), { autoAlpha: 0 }, 1.75)
          .to(progress, { value: 0, duration: 1.7, ease: "power2.out" }, 1.8);
      });
      leaveRef.current = leave;

      timers.push(window.setTimeout(leave, quick ? 1300 : 3000));

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") leave();
      };
      const onResize = () => {
        fitCanvas(boltCanvas, bctx);
        wipe?.resize();
      };
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", onResize);
      cleanups.push(() => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      });

      return () => {
        timers.forEach(clearTimeout);
        cleanups.forEach((fn) => fn());
        wipe?.destroy();
      };
    },
    { scope: root },
  );

  if (gone) return null;

  const letters = profile.firstName.toUpperCase().split("");

  return (
    <div ref={root} className={styles.intro} data-intro data-accent={brandAccentAttr}>
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
      <canvas ref={shaderRef} className={styles.shader} aria-hidden="true" />
    </div>
  );
}
