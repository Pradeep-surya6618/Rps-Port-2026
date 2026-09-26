"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import { Icon } from "@/components/ui/Icon";
import type { OrbitLayout, PlacedSkill, SkillGroup } from "@/data/skills";
import styles from "./TechStack.module.css";

const CENTER = { x: 50, y: 52 };
const ORBIT_CENTER = { x: 50, y: 50 };

/** Desktop (x, y) and phone (xm, ym) positions as CSS variables; CSS picks one. */
const pos = (x: number, y: number, xm: number, ym: number) =>
  ({ "--x": `${x}%`, "--y": `${y}%`, "--xm": `${xm}%`, "--ym": `${ym}%` }) as React.CSSProperties;

type Props = { groups: SkillGroup[]; skills: PlacedSkill[]; orbit: OrbitLayout };

/**
 * The stack as a small network: a centre node, one hub per category and the
 * skills fanned around each hub (on phones: an oval orbit of the same network). Hovering a skill lights its path back to
 * the centre and nudges its neighbours aside.
 */
export function StackConstellation({ groups, skills, orbit }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ group: string; skill?: string } | null>(null);

  // Idle float only while the stage is on screen.
  useEffect(() => {
    const el = stage.current!;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-inview", e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const q = gsap.utils.selector(stage);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: stage.current, start: "top 70%" },
          defaults: { ease: "power3.out" },
        });
        // Core and hubs are centred with CSS translate, so animate them without transforms.
        tl.from(q("[data-st='core']"), { opacity: 0, filter: "blur(12px)", duration: 0.9 })
          .fromTo(q("[data-st='line']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.03 }, 0.2)
          .from(q("[data-st='hub']"), { opacity: 0, filter: "blur(8px)", duration: 0.8, stagger: 0.1 }, 0.35)
          .from(q("[data-st='skill'] > span"), { scale: 0.5, opacity: 0, duration: 0.7, stagger: 0.04 }, 0.6);
      });
    },
    { scope: stage },
  );

  const hovered = hover?.skill ? skills.find((s) => s.name === hover.skill && s.group === hover.group) : undefined;

  const nudge = (s: PlacedSkill) => {
    if (!hovered || s === hovered) return undefined;
    const dx = s.x - hovered.x;
    const dy = s.y - hovered.y;
    const d = Math.hypot(dx, dy);
    if (d > 22) return undefined;
    const push = (22 - d) / 22;
    return `${((dx / d) * push * 14).toFixed(1)}px ${((dy / d) * push * 14).toFixed(1)}px`;
  };

  return (
    <div ref={stage} className={styles.stage} data-active={hover ? "true" : undefined} onPointerLeave={() => setHover(null)}>
      {/* Connections, drawn once for the wide layout and once for the phone orbit. */}
      {(
        [
          ["wide", CENTER, (id: string) => groups.find((g) => g.id === id)!.hub, (sk: PlacedSkill) => sk],
          ["orbit", ORBIT_CENTER, (id: string) => orbit.hubs[id], (sk: PlacedSkill) => orbit.skills[`${sk.group}:${sk.name}`]],
        ] as const
      ).map(([kind, c, hubAt, skillAt]) => (
        <svg
          key={kind}
          className={`${styles.lines} ${kind === "wide" ? styles.linesWide : styles.linesOrbit}`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {groups.map((g) => (
            <line
              key={g.id}
              x1={c.x}
              y1={c.y}
              x2={hubAt(g.id).x}
              y2={hubAt(g.id).y}
              pathLength={1}
              data-st="line"
              className={hover?.group === g.id ? styles.lineOn : undefined}
            />
          ))}
          {skills.map((sk) => {
            const on = hover?.group === sk.group && (!hover.skill || hover.skill === sk.name);
            const h = hubAt(sk.group);
            const p = skillAt(sk);
            return (
              <line
                key={`${sk.group}-${sk.name}`}
                x1={h.x}
                y1={h.y}
                x2={p.x}
                y2={p.y}
                pathLength={1}
                data-st="line"
                className={on ? styles.lineOn : undefined}
              />
            );
          })}
        </svg>
      ))}

      <div className={styles.core} style={pos(CENTER.x, CENTER.y, ORBIT_CENTER.x, ORBIT_CENTER.y)} data-st="core">
        <span className={styles.coreRing} aria-hidden="true" />
        Full
        <br />
        stack
      </div>

      {groups.map((g) => (
        <div key={g.id} className={styles.group}>
          <h3
            className={`${styles.hub} ${hover?.group === g.id ? styles.on : ""}`}
            style={pos(g.hub.x, g.hub.y, orbit.hubs[g.id].x, orbit.hubs[g.id].y)}
            data-st="hub"
            onPointerEnter={() => setHover({ group: g.id })}
          >
            {g.label}
          </h3>
          <ul className={styles.skills}>
            {skills
              .filter((s) => s.group === g.id)
              .map((s, i) => (
                <li
                  key={s.name}
                  className={`${styles.skill} ${hovered === s ? styles.on : ""}`}
                  style={
                    {
                      ...pos(s.x, s.y, orbit.skills[`${g.id}:${s.name}`].x, orbit.skills[`${g.id}:${s.name}`].y),
                      translate: nudge(s),
                      "--float-delay": `${(i * 0.7 + g.hub.x / 20).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                  data-st="skill"
                  onPointerEnter={() => setHover({ group: g.id, skill: s.name })}
                >
                  <span className={styles.skillInner}>
                    <Icon name={s.icon} size={20} brand />
                    {s.name}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
