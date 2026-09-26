"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { FINE_POINTER, MEDIA } from "@/lib/animations/media";
import { useSite } from "@/components/providers/SiteProvider";

type HeroSceneProps = { className?: string; accent?: string; children: React.ReactNode };

/**
 * Motion for the hero. Markup stays server-rendered; this wrapper finds the
 * layers by data attributes:
 *   data-hero="…"     outer layers moved by the scroll timeline
 *   data-hero-in="…"  inner elements animated by the entrance
 *   data-depth="n"    layers nudged by the pointer (desktop)
 */
export function HeroScene({ className, accent, children }: HeroSceneProps) {
  const root = useRef<HTMLElement>(null);
  const { introDone } = useSite();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: MEDIA.desktop, tablet: MEDIA.tablet, mobile: MEDIA.mobile, reduced: MEDIA.reduced },
        (ctx) => {
          const { desktop, tablet, mobile, reduced } = ctx.conditions as Record<string, boolean>;
          if (reduced) return;

          // Before the intro hands over, hold everything in its pre-entrance state.
          const entrance = gsap.timeline({ paused: !introDone, defaults: { ease: "power4.out" } });
          entrance
            .from(q("[data-hero='glow'] > *"), { opacity: 0, scale: 1.25, duration: 2.2, ease: "power2.out" }, 0)
            .from(q("[data-hero='mountains']"), { yPercent: 6, opacity: 0, duration: 2.4, ease: "power3.out" }, 0)
            .from(q("[data-hero='shapes'] > *"), { xPercent: -30, opacity: 0, duration: 1.8, stagger: 0.12 }, 0.1)
            .from(q("[data-hero-in='circle']"), { scale: 0.55, opacity: 0, duration: 1.8, ease: "expo.out" }, 0.15)
            // The orbit spins via CSS, so its entrance only fades it in.
            .from(q("[data-hero-in='orbit']"), { opacity: 0, duration: 2, ease: "power2.out" }, 0.3)
            // The portrait materialises from the feet up behind a sweeping scan
            // line, starting while the intro's portal is still opening so it is
            // on screen almost immediately.
            .fromTo(
              q("[data-hero-in='portrait']"),
              { clipPath: "inset(100% -10% -2% -10%)", yPercent: 6 },
              { clipPath: "inset(-10% -10% -2% -10%)", yPercent: 0, duration: 1.1, ease: "power2.inOut", clearProps: "clipPath" },
              0.3,
            )
            .fromTo(
              q("[data-hero-in='scan']"),
              { y: 0 },
              {
                y: () => -(q("[data-hero-in='portrait']")[0] as HTMLElement).offsetHeight,
                duration: 1.1,
                ease: "power2.inOut",
              },
              0.3,
            )
            .fromTo(q("[data-hero-in='scan']"), { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, 0.3)
            .to(q("[data-hero-in='scan']"), { opacity: 0, duration: 0.3 }, 1.3)
            .from(q("[data-hero-in='aura']"), { opacity: 0, duration: 1 }, 1.1)
            .from(q("[data-hero-in='letter']"), { yPercent: 110, duration: 1.2, stagger: 0.05 }, 0.35)
            .from(
              q("[data-hero-in='script']"),
              { clipPath: "inset(-30% 100% -30% 0%)", duration: 1.1, ease: "power2.inOut", clearProps: "clipPath" },
              0.8,
            )
            .from(q("[data-hero-in='role'], [data-hero-in='statement']"), { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.95)
            .from(q("[data-hero-in='cta']"), { y: 18, opacity: 0, duration: 0.9 }, 1.3)
            .from(q("[data-hero='rail'] > *"), { x: 40, opacity: 0, duration: 1.1, stagger: 0.06 }, 1)
            .from(q("[data-hero='social'] > *, [data-hero='cue'] > *"), { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 1.4);

          if (!introDone) return;

          // Once settled, the portrait floats gently (y, separate from the entrance's yPercent).
          gsap.to(q("[data-hero-in='portrait']"), {
            y: -12,
            duration: 3.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.6,
          });

          // ── Scroll: the camera pushes through the scene into About. ──
          const s = desktop ? 1 : tablet ? 0.7 : 0.45;
          const scroll = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: mobile ? "bottom top" : "+=110%",
              scrub: 0.6,
              pin: !mobile,
              anticipatePin: 1,
              // The pin adds spacing that shifts every section below; measure it first.
              refreshPriority: 1,
            },
          });
          // On phones the copy sits below the portrait and is still being read
          // while the hero scrolls, so only the scenery moves there.
          if (!mobile) {
            scroll
              .to(q("[data-hero='name']"), { xPercent: -28 * s, opacity: 0, duration: 0.6 }, 0)
              .to(q("[data-hero='meta']"), { y: -80 * s, opacity: 0, duration: 0.45 }, 0.05)
              .to(q("[data-hero='veil']"), { opacity: 0.8, duration: 0.35 }, 0.65);
          }
          scroll
            .to(q("[data-hero='portrait']"), { yPercent: -9 * s, scale: 1 + 0.05 * s, duration: 1 }, 0)
            .to(q("[data-hero='circle']"), { scale: 1 + 0.9 * s, opacity: 0.35, duration: 1 }, 0)
            .to(q("[data-ridge='far']"), { yPercent: -8 * s, duration: 1 }, 0)
            .to(q("[data-hero='shapes']"), { xPercent: 14 * s, yPercent: -18 * s, duration: 1 }, 0)
            .to(q("[data-hero='particles']"), { yPercent: -20 * s, duration: 1 }, 0);

          const rails = q("[data-hero='rail']");
          rails.forEach((el, i) => scroll.to(el, { y: -(90 + i * 60) * s, opacity: 0, duration: 0.6 }, 0.05 + i * 0.04));
          scroll
            .to(q("[data-hero='social'], [data-hero='cue']"), { y: 40, opacity: 0, duration: 0.3 }, 0);

          // ── Pointer depth (desktop). ──
          if (!desktop || !window.matchMedia(FINE_POINTER).matches) return;
          const layers = q("[data-depth]").map((el) => {
            const depth = Number((el as HTMLElement).dataset.depth) || 0;
            return {
              depth,
              x: gsap.quickTo(el, "x", { duration: 1.8, ease: "power2.out" }),
              y: gsap.quickTo(el, "y", { duration: 1.8, ease: "power2.out" }),
            };
          });
          const onMove = (e: PointerEvent) => {
            const rx = e.clientX / window.innerWidth - 0.5;
            const ry = e.clientY / window.innerHeight - 0.5;
            for (const l of layers) {
              l.x(rx * 26 * l.depth);
              l.y(ry * 16 * l.depth);
            }
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        },
      );
    },
    { scope: root, dependencies: [introDone], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" className={className} data-accent={accent} aria-label="Introduction">
      {children}
    </section>
  );
}
