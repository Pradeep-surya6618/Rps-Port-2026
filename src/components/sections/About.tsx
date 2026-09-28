import Image from "next/image";
import aboutPhoto from "../../../public/images/15.jpg";
import { Fingerprint } from "lucide-react";
import { Parallax } from "@/components/animation/Parallax";
import { BackgroundIcon } from "@/components/ui/BackgroundIcon";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { about, profile } from "@/data/profile";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} data-accent="orange" aria-labelledby="about-title">
      {/* Atmosphere: slow layers behind the copy. */}
      <Parallax speed={0.15} className={styles.orb} aria-hidden />
      {/* Static on purpose: moving these three hairlines needed a layer the
          height of the whole section, costly on slower GPUs for no visible gain. */}
      <div className={styles.lines} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <BackgroundIcon className={styles.bgIcon} speed={0.65}>
        <Fingerprint />
      </BackgroundIcon>
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
