import Image from "next/image";
import heroImage from "../../../public/images/profile/hero.png";
import { profile } from "@/data/profile";
import styles from "./Hero.module.css";

/** The portrait, set into the scene: light disc behind, rim light, ground haze in front. */
export function HeroPortrait() {
  return (
    <div className={styles.portraitWrap} data-hero="portrait" data-depth="0.8">
      <div className={styles.circleWrap} data-hero="circle">
        <div className={styles.circle} data-hero-in="circle">
          <span className={styles.circleRing} />
        </div>
      </div>
      <div className={styles.portraitDepth}>
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
      </div>
      <div className={styles.haze} />
    </div>
  );
}
