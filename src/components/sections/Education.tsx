import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { education } from "@/data/profile";
import styles from "./Education.module.css";

export function Education() {
  return (
    <section id="education" className={styles.education} aria-label="Education">
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
        </div>

        <div className={styles.certs}>
          <h3 className={styles.certsTitle}>Certifications</h3>
          <Reveal as="ul" stagger className={styles.certList}>
            {education.certifications.map((c) => (
              <li key={c.title}>
                <span className={styles.certName}>{c.title}</span>
                <span className={styles.certIssuer}>{c.issuer}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
