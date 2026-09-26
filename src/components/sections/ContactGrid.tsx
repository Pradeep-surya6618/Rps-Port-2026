"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { instagram } from "@/data/instagram";
import { socialById, type SocialId } from "@/data/social";
import styles from "./Contact.module.css";

const notes: Record<Exclude<SocialId, "email">, string> = {
  linkedin: "Let’s connect",
  github: "Code & side projects",
  instagram: `${instagram.followersK}K followers`,
};

// Shown in the tile instead of the raw handle where that reads badly.
const displayHandle: Partial<Record<SocialId, string>> = {
  linkedin: "Pradeep Surya",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/**
 * Bento grid of ways to get in touch: a wide email tile with copy-to-clipboard,
 * then LinkedIn, GitHub and Instagram. A soft spotlight follows the pointer
 * across each tile (CSS variables, no re-render).
 */
export function ContactGrid() {
  const email = socialById("email");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>("[data-tile]");
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
    tile.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email.handle);
    } catch {
      // Clipboard blocked (permissions/insecure context): fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = email.handle;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <ul className={styles.grid} onPointerMove={spotlight}>
      <li className={`${styles.tile} ${styles.emailTile}`} data-tile data-brand="email">
        <span className={styles.tileIcon}>
          <Icon name="gmail" size={24} brand />
        </span>
        <p className={styles.tileLabel}>Email</p>
        <p className={styles.emailAddress}>{email.handle}</p>
        <div className={styles.emailActions}>
          <button type="button" className={styles.copyButton} onClick={copy}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a href={email.href} className={styles.writeLink}>
            Write to me
            <Arrow />
          </a>
        </div>
        <span className="sr-only" aria-live="polite">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </li>

      {(["linkedin", "github", "instagram"] as const).map((id) => {
        const s = socialById(id);
        return (
          <li key={id} className={styles.tileCell}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.tile} ${styles.socialTile}`}
              data-tile
              data-brand={id}
            >
              <span className={styles.tileTop}>
                <span className={styles.tileIcon}>
                  <Icon name={id} size={22} />
                </span>
                <span className={styles.tileArrow}>
                  <Arrow />
                </span>
              </span>
              <span className={styles.tileLabel}>{s.label}</span>
              <span className={styles.tileHandle}>{displayHandle[id] ?? s.handle}</span>
              <span className={styles.tileNote}>{notes[id]}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
