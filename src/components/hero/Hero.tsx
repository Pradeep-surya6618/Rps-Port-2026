import { PillLink } from "@/components/ui/PillLink";
import { profile } from "@/data/profile";
import { brandAccentAttr } from "@/data/theme";
import { HeroBackground } from "./HeroBackground";
import { HeroInfoRail } from "./HeroInfoRail";
import { HeroPortrait } from "./HeroPortrait";
import { HeroScene } from "./HeroScene";
import { HeroSocial } from "./HeroSocial";
import styles from "./Hero.module.css";

export function Hero() {
  const first = profile.firstName.toUpperCase().split("");

  return (
    <HeroScene className={styles.hero} accent={brandAccentAttr}>
      <HeroBackground />

      <HeroPortrait />

      <div className={styles.content}>
        <h1 className={styles.name} data-hero="name">
          <span className="sr-only">
            {profile.fullName}, {profile.title}
          </span>
          <span className={styles.first} aria-hidden="true">
            {first.map((l, i) => (
              <span key={i} className={styles.firstMask}>
                <span className={styles.firstLetter} data-hero-in="letter">
                  {l}
                </span>
              </span>
            ))}
          </span>
          <span className={styles.last} aria-hidden="true" data-hero-in="script">
            {profile.lastName}
          </span>
        </h1>

        <div className={styles.meta} data-hero="meta">
          <p className={styles.role} data-hero-in="role">
            {profile.title}
          </p>
          <p className={styles.statement} data-hero-in="statement">
            Building scalable digital experiences,
            <br /> from interface to backend.
          </p>
          <div className={styles.ctas} data-hero-in="cta">
            <PillLink href="#work" variant="solid">
              See selected work
            </PillLink>
            <PillLink href={profile.cv} download>
              Download CV
            </PillLink>
          </div>
        </div>
      </div>

      <HeroInfoRail />
      <HeroSocial />

      <div className={styles.scrollCue} data-hero="cue" aria-hidden="true">
        <span className={styles.scrollLine} />
        <span>Scroll</span>
      </div>

      <div className={styles.veil} data-hero="veil" aria-hidden="true" />
    </HeroScene>
  );
}
