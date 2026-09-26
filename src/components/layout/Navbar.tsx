"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import siteIcon from "@/app/icon.svg";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { Icon } from "@/components/ui/Icon";
import { navigation, type SectionId } from "@/data/navigation";
import { profile } from "@/data/profile";
import { socials } from "@/data/social";
import { brandAccentAttr } from "@/data/theme";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { scrollTo, introDone } = useSite();
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!introDone) return;
      // clearProps: a leftover transform would make the header the containing
      // block for the full-screen mobile menu and clip it.
      gsap.from(root.current, { y: -30, opacity: 0, duration: 1.2, delay: 0.9, ease: "power3.out", clearProps: "transform,opacity" });

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

  // Desktop: a glass pill in the active section's colour glides to the link,
  // then a streak of light sweeps across it.
  useGSAP(
    () => {
      const el = pill.current;
      if (!el) return;
      const item = navigation.find((n) => n.id === active);
      const link = item ? root.current?.querySelector<HTMLElement>(`[data-nav="${item.id}"]`) : null;
      if (!item || !link) {
        gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.35, ease: "power2.out" });
        return;
      }
      const shown = Number(gsap.getProperty(el, "opacity")) > 0.5;
      gsap.to(el, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        opacity: 1,
        scale: 1,
        "--pill-rgb": item.rgb,
        duration: shown ? 0.7 : 0.45,
        ease: shown ? "expo.out" : "power3.out",
      });
      gsap.fromTo(
        el.querySelector("[data-sweep]"),
        { xPercent: -120 },
        { xPercent: 260, duration: 0.9, ease: "power2.inOut", delay: 0.2 },
      );
    },
    { scope: root, dependencies: [active] },
  );

  // Mobile menu: the panel drops in, then its rows and footer rise one by one.
  useGSAP(
    () => {
      if (!open || !sheet.current) return;
      const q = gsap.utils.selector(sheet);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-menu='backdrop']"), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0)
        .fromTo(
          q("[data-menu='panel']"),
          { opacity: 0, y: -14, scale: 0.97, clipPath: "inset(0% 0% 100% 0% round 24px)" },
          { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 0.55 },
          0,
        )
        .fromTo(q("[data-menu='row']"), { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.05 }, 0.12)
        .fromTo(q("[data-menu='foot']"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35);
    },
    { scope: root, dependencies: [open] },
  );

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
        {/* The hero already shows the full name, so the navbar carries a logo instead. */}
        <a
          href="#top"
          className={styles.brand}
          aria-label={`${profile.fullName}, back to top`}
          onClick={(e) => go(e, "#top")}
        >
          {/* Same mark as the favicon (src/app/icon.svg). */}
          <Image src={siteIcon} alt="" width={34} height={34} className={styles.monogram} preload />
          <span aria-hidden="true">
            Portfolio
          </span>
        </a>

        <nav aria-label="Primary" className={styles.links}>
          <span ref={pill} className={styles.pill} aria-hidden="true">
            <span className={styles.sweep} data-sweep />
          </span>
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

      <div ref={sheet} className={styles.sheet} hidden={!open}>
        <div className={styles.backdrop} data-menu="backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
        <nav id="mobile-menu" aria-label="Mobile" className={styles.panel} data-menu="panel">
          <p className={styles.panelLabel}>Navigate</p>
          <ul className={styles.rows}>
            {navigation.map(({ id, label, rgb }, i) => (
              <li key={id} data-menu="row">
                <a
                  href={`#${id}`}
                  className={styles.row}
                  style={{ "--row-rgb": rgb } as React.CSSProperties}
                  aria-current={active === id ? "true" : undefined}
                  onClick={(e) => go(e, `#${id}`)}
                >
                  <span className={styles.rowIndex}>0{i + 1}</span>
                  <span className={styles.rowDot} aria-hidden="true" />
                  <span className={styles.rowLabel}>{label}</span>
                  <span className={styles.rowArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.panelFoot} data-menu="foot">
            <a href={`mailto:${profile.email}`} className={styles.panelEmail}>
              {profile.email}
            </a>
            <ul className={styles.panelSocial} aria-label="Social links">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    className={styles.panelIcon}
                    data-brand={s.id}
                    aria-label={s.id === "email" ? `Email ${profile.email}` : `${s.label} (opens in a new tab)`}
                    {...(s.id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <Icon name={s.id === "email" ? "gmail" : s.id} size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
