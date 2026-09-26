"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { navigation, type SectionId } from "@/data/navigation";
import { profile } from "@/data/profile";
import { brandAccentAttr } from "@/data/theme";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { scrollTo, introDone } = useSite();
  const root = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!introDone) return;
      gsap.from(root.current, { y: -30, opacity: 0, duration: 1.2, delay: 0.9, ease: "power3.out" });

      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => setScrolled(self.isActive),
      });

      navigation.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(id);
            else setActive((cur) => (cur === id ? null : cur));
          },
        });
      });
    },
    { scope: root, dependencies: [introDone] },
  );

  // Slide the green indicator under the active link.
  useGSAP(
    () => {
      const bar = indicator.current;
      if (!bar) return;
      const link = active ? root.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`) : null;
      if (!link) {
        gsap.to(bar, { opacity: 0, duration: 0.3 });
        return;
      }
      gsap.to(bar, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: root, dependencies: [active] },
  );

  const go = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(target);
  };

  return (
    <header
      ref={root}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${open ? styles.open : ""}`}
      data-accent={brandAccentAttr}
    >
      <div className={styles.bar}>
        <a href="#top" className={styles.brand} onClick={(e) => go(e, "#top")}>
          <span className={styles.brandMark} aria-hidden="true" />
          {profile.fullName}
        </a>

        <nav aria-label="Primary" className={styles.links}>
          <span ref={indicator} className={styles.indicator} aria-hidden="true" />
          {navigation.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              data-nav={id}
              className={styles.link}
              aria-current={active === id ? "true" : undefined}
              onClick={(e) => go(e, `#${id}`)}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={styles.burger} aria-hidden="true" />
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Mobile" className={styles.sheet} hidden={!open}>
        {navigation.map(({ id, label }, i) => (
          <a key={id} href={`#${id}`} className={styles.sheetLink} onClick={(e) => go(e, `#${id}`)}>
            <span className={styles.sheetIndex}>0{i + 1}</span>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
