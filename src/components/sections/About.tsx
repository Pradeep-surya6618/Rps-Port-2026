import Image from "next/image";
import aboutPhoto from "../../../public/images/15.jpg";
import { Parallax } from "@/components/animation/Parallax";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { about, profile } from "@/data/profile";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} data-accent="rose" aria-labelledby="about-title">
      {/* Atmosphere: slow layers behind the copy. */}
      <Parallax speed={0.15} className={styles.orb} aria-hidden />
      <Parallax speed={0.35} className={styles.lines} aria-hidden>
        <span />
        <span />
        <span />
      </Parallax>
      <Parallax speed={0.55} className={styles.ghost} aria-hidden>
        Build
      </Parallax>

      <div className={`container ${styles.grid}`}>
        <header className={styles.head}>
          <p className="eyebrow">About</p>
          <RevealText
            as="h2"
            id="about-title"
            lines={["A developer", "who builds"]}
            className={`display ${styles.title}`}
            lineClassNames={[undefined, styles.titleIndent]}
          />
        </header>

        {/* Photo and caption drift together, so the caption never slips behind the frame. */}
        <Parallax speed={0.85} className={styles.photo}>
          <figure className={styles.figure}>
            <div className={styles.photoInner}>
              <Image
                src={aboutPhoto}
                alt={`${profile.fullName} in a white T-shirt and sunglasses on a beach, waves breaking behind him`}
                sizes="(max-width: 767px) 88vw, (max-width: 1199px) 42vw, 30vw"
                placeholder="blur"
                className={styles.photoImg}
              />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.captionDot} aria-hidden="true" />
              {profile.location}
            </figcaption>
          </figure>
        </Parallax>

        <div className={styles.copy}>
          <Reveal>
            <p className={styles.lead}>{about.lead}</p>
          </Reveal>
          <Reveal stagger className={styles.body}>
            {about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>

        <Reveal as="dl" stagger className={styles.facts}>
          {about.facts.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
