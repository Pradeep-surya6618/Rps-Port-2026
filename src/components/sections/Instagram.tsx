import Image from "next/image";
import { Heart, Lightbulb, Link2, Rocket, Wrench, Zap } from "lucide-react";
import avatar from "../../../public/images/Profile Circle.png";
import { Parallax } from "@/components/animation/Parallax";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { Icon } from "@/components/ui/Icon";
import { PillLink } from "@/components/ui/PillLink";
import { instagram, type BioIcon } from "@/data/instagram";
import { InstagramScene } from "./InstagramScene";
import styles from "./Instagram.module.css";

const bioIcons: Record<BioIcon, typeof Rocket> = {
  rocket: Rocket,
  wrench: Wrench,
  bulb: Lightbulb,
  zap: Zap,
};

// Abstract tiles for the post grid: typographic stand-ins, not screenshots.
const tiles = ["<div>", "flex", ":hover", "() =>", "@media", "grid", "var()", "async", "z-index"];

// Floating code chips around the phone: [label, parallax speed, position class].
const chips = [
  { label: "<html>", speed: 0.7, pos: "chipA" },
  { label: "{ css }", speed: 1.25, pos: "chipB" },
  { label: "js()", speed: 0.85, pos: "chipC" },
  { label: "#TeamIncrix", speed: 1.35, pos: "chipD" },
] as const;

export function Instagram() {
  const followers = `${instagram.followersK}K`;

  return (
    <InstagramScene className={styles.instagram}>
      <Parallax speed={0.3} className={styles.at} aria-hidden>
        @
      </Parallax>
      <div className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Instagram</p>
          <RevealText
            as="h2"
            id="instagram-title"
            lines={["Coding", "in public"]}
            className={`display ${styles.title}`}
            lineClassNames={[undefined, styles.titleAccent]}
          />

          <div className={styles.stat}>
            <span className={styles.statValue} data-ig="count" data-target={instagram.followersK}>
              {followers}
            </span>
            <span className={styles.statLabel}>
              developers follow along for bite-size HTML, CSS and JavaScript tips.
            </span>
          </div>

          <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={styles.handle}>
            @{instagram.handle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <Reveal stagger className={styles.bio}>
            {instagram.bio.map((b) => {
              const B = bioIcons[b.icon];
              return (
                <p key={b.text} className={styles.bioLine}>
                  <B size={16} strokeWidth={1.8} aria-hidden="true" />
                  {b.text}
                </p>
              );
            })}
          </Reveal>

          <Reveal className={styles.cta}>
            <PillLink href={instagram.url} variant="solid" external>
              Follow on Instagram
            </PillLink>
          </Reveal>
        </div>

        <div className={styles.stage} data-ig="stage">
          {chips.map((c) => (
            <Parallax key={c.label} speed={c.speed} className={`${styles.chip} ${styles[c.pos]}`} aria-hidden>
              <span className={styles.chipInner}>{c.label}</span>
            </Parallax>
          ))}

          <div className={styles.phoneScroll} data-ig="phone">
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.phone}
              data-ig="tilt"
              data-cursor-label="Follow"
              aria-label={`Instagram profile @${instagram.handle}: ${followers} followers (opens in a new tab)`}
            >
              <span className={styles.notch} aria-hidden="true" />
              <span className={styles.screen} aria-hidden="true">
                <span className={styles.igTop}>
                  <Icon name="instagram" size={15} />
                  <span className={styles.igHandle}>{instagram.handle}</span>
                </span>

                <span className={styles.profileRow}>
                  <span className={styles.avatarRing}>
                    <Image src={avatar} alt="" sizes="72px" className={styles.avatar} />
                  </span>
                  <span className={styles.counts}>
                    <span>
                      <b>{instagram.posts}</b>posts
                    </span>
                    <span>
                      <b>{followers}</b>followers
                    </span>
                    <span>
                      <b>{instagram.following}</b>following
                    </span>
                  </span>
                </span>

                <span className={styles.igName}>{instagram.name}</span>
                <span className={styles.igCategory}>{instagram.category}</span>
                {instagram.bio.map((b) => {
                  const B = bioIcons[b.icon];
                  return (
                    <span key={b.text} className={styles.igBio}>
                      <B size={11} strokeWidth={2} />
                      {b.text}
                    </span>
                  );
                })}
                <span className={styles.igLink}>
                  <Link2 size={11} strokeWidth={2} />
                  {instagram.link}
                </span>

                <span className={styles.igButtons}>
                  <span className={styles.igFollow}>Follow</span>
                  <span className={styles.igMessage}>Message</span>
                </span>

                <span className={styles.grid}>
                  {tiles.map((t, i) => (
                    <span key={t} className={styles.tile} data-ig="tile" style={{ "--i": i } as React.CSSProperties}>
                      {t}
                    </span>
                  ))}
                </span>
              </span>
            </a>

            {/* Likes drifting up from the phone. */}
            <span className={styles.hearts} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Heart key={i} className={styles.heart} style={{ "--d": i } as React.CSSProperties} size={18} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((k) => (
            <span key={k} className={styles.trackGroup}>
              {instagram.topics.map((t) => (
                <span key={t} className={styles.topic}>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </InstagramScene>
  );
}
