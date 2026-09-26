import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { BackgroundIcon } from "@/components/ui/BackgroundIcon";
import { education } from "@/data/profile";
import { ScoreRing } from "./ScoreRing";
import styles from "./Education.module.css";

export function Education() {
  return (
    <section id="education" className={styles.education} data-accent="blue" aria-label="Education">
      {/* Giant outlined graduation cap drifting slowly behind the content. */}
      <BackgroundIcon className={styles.cap}>
        <GraduationCap />
      </BackgroundIcon>
      <div className={`container ${styles.layout}`}>
        <p className="eyebrow">Education</p>

        <div className={styles.main}>
          <RevealText as="h2" lines={[education.degree]} className={styles.degree} />
          <Reveal className={styles.detail}>
            <p className={styles.field}>{education.field}</p>
            <p className={styles.school}>
              {education.school}, {education.city}
            </p>
          </Reveal>
          <Reveal as="dl" stagger className={styles.meta}>
            <div>
              <dt>Years</dt>
              <dd>{education.years}</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>{education.score}</dd>
            </div>
          </Reveal>

          <h3 className={styles.subTitle}>The road here</h3>
          {/* Oldest first: SSLC leads to HSC, which leads to the degree above. */}
          <Reveal as="ol" stagger className={styles.path}>
            {[...education.schooling].reverse().map((s) => (
              <li key={s.level} className={styles.stop} data-tone={s.level.toLowerCase()}>
                <span className={styles.stopYearClip} aria-hidden="true">
                  <span className={styles.stopYear}>{s.year}</span>
                </span>
                <div className={styles.stopHead}>
                  <ScoreRing score={s.score} />
                  <p className={styles.stopWhen}>{s.year}</p>
                </div>
                <h4 className={styles.stopLevel}>
                  {s.level}
                  <span className={styles.stopName}>{s.name}</span>
                </h4>
                <p className={styles.stopSchool}>
                  {s.school}, {s.city}
                </p>
              </li>
            ))}
          </Reveal>
        </div>

        <div className={styles.certs}>
          <h3 className={styles.subTitle}>Certifications</h3>
          <Reveal as="ul" stagger className={styles.certList}>
            {education.certifications.map((c) => (
              <li key={c.title}>
                <span className={styles.certTop}>
                  <span className={styles.certName}>{c.title}</span>
                  <span className={styles.certYear}>{c.year}</span>
                </span>
                <span className={styles.certIssuer}>{c.issuer}</span>
                <span className={styles.certDetail}>{c.detail}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
