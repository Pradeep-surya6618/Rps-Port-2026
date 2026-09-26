"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type Lenis from "lenis";
import { createSmoothScroll } from "@/lib/animations/smoothScroll";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/animations/media";

type SiteContextValue = {
  /** True once the intro has handed the screen over to the page. */
  introDone: boolean;
  finishIntro: () => void;
  scrollTo: (target: string | number) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) return;
    const smooth = createSmoothScroll();
    smooth.lenis.stop();
    lenisRef.current = smooth.lenis;
    return () => {
      smooth.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!introDone) return;
    document.documentElement.classList.remove("intro-active");
    lenisRef.current?.start();
    // Layout may have shifted while the intro held the page (fonts, images),
    // and the hero pin was only just created: re-sort and re-measure.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, [introDone]);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    if (typeof target === "number") window.scrollTo({ top: target });
    else document.querySelector(target)?.scrollIntoView();
  }, []);

  const value = useMemo(() => ({ introDone, finishIntro, scrollTo }), [introDone, finishIntro, scrollTo]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
