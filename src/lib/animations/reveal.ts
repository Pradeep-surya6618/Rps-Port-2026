"use client";

import { gsap } from "./gsap";

type RevealOptions = {
  trigger?: Element;
  start?: string;
  delay?: number;
  stagger?: number;
};

/** Masked word-by-word rise. Targets are the inner spans of <RevealText>. */
export function revealWords(targets: gsap.TweenTarget, { trigger, start = "top 82%", delay = 0, stagger = 0.06 }: RevealOptions = {}) {
  return gsap.from(targets, {
    yPercent: 115,
    rotate: 4,
    duration: 1.1,
    ease: "power4.out",
    stagger,
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Soft upward fade for paragraphs and small groups. */
export function revealUp(targets: gsap.TweenTarget, { trigger, start = "top 85%", delay = 0, stagger = 0.08 }: RevealOptions = {}) {
  return gsap.from(targets, {
    y: 36,
    opacity: 0,
    duration: 1.1,
    stagger,
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}
