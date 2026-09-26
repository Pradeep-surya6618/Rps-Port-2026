import Image from "next/image";
import mountainImage from "../../../public/images/hero-mountains-fade.png";
import { HeroParticles } from "./HeroParticles";
import styles from "./Hero.module.css";

/**
 * Depth layers behind the hero. Performance note: only the mountains, the
 * shape group and the particles move on scroll, each as a single GPU layer.
 * The base, glow and grid are static so they are drawn once, not per frame.
 */
export function HeroBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      {/* 1 · base gradient */}
      <div className={styles.base} />

      {/* 2 · emerald glow (static) */}
      <div className={styles.glowLayer} data-hero="glow">
        <div className={styles.glow} />
      </div>

      {/* 3 · mountains; the left fade is baked into the image, no runtime mask */}
      <div className={styles.mountains} data-hero="mountains">
        <div className={styles.mountainScroll} data-ridge="far" data-depth="0.3">
          <Image
            src={mountainImage}
            alt=""
            fill
            sizes="100vw"
            quality={75}
            placeholder="blur"
            className={styles.mountainImg}
          />
        </div>
      </div>

      {/* 4 · diagonal geometry, moved as one layer */}
      <div className={styles.shapes} data-hero="shapes" data-depth="0.9">
        <div className={styles.bandA} />
        <div className={styles.bandB} />
        <div className={styles.wedge} />
      </div>

      {/* 5 · floating dust */}
      <div className={styles.particles} data-hero="particles">
        <HeroParticles />
      </div>

      {/* 6 · technical grid (static) */}
      <div className={styles.grid} />
    </div>
  );
}
