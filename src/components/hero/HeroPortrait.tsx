import Image from "next/image";
import heroImage from "../../../public/images/profile/hero.png";
import { profile } from "@/data/profile";
import styles from "./Hero.module.css";

/**
 * The portrait, set into the scene: light disc with a slow orbit, a pulsing
 * aura behind the head, rim light and ground haze. On entrance a scan line
 * sweeps up as the portrait materialises; afterwards it floats gently.
 * Every looping effect animates only transform/opacity on its own layer.
 */
export function HeroPortrait() {
  return (
    <div className={styles.portraitWrap} data-hero="portrait" data-depth="0.8">
      <div className={styles.circleWrap} data-hero="circle">
        <div className={styles.circle} data-hero-in="circle" />
        <div className={styles.orbit} data-hero-in="orbit" aria-hidden="true">
          <span className={styles.orbitDot} />
        </div>
      </div>
      <div className={styles.portraitDepth}>
        <div className={styles.auraWrap} data-hero-in="aura" aria-hidden="true">
          <div className={styles.aura} />
        </div>
        <div className={styles.portraitIn} data-hero-in="portrait">
          <Image
            src={heroImage}
            alt={`${profile.fullName} in a denim shirt and sunglasses, smiling`}
            className={styles.portrait}
            sizes="(max-width: 767px) 92vw, (max-width: 1199px) 62vw, 52vw"
            quality={90}
            preload
            placeholder="blur"
          />
        </div>
        <span className={styles.scan} data-hero-in="scan" aria-hidden="true" />
      </div>
      <div className={styles.haze} />
    </div>
  );
}
