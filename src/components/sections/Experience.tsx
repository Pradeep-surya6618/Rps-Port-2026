import { Parallax } from "@/components/animation/Parallax";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { experience } from "@/data/experience";
import { TimelineScene } from "./TimelineScene";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section id="experience" className={styles.experience} aria-label="Experience">
      <div className={styles.gridBg} aria-hidden="true" />
      <Parallax speed={0.3} className={styles.year} aria-hidden>
        2025
      </Parallax>

      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <p className="eyebrow">Career</p>
          <RevealText as="h2" lines={["Experience"]} className={`display ${styles.title}`} />
          <Reveal>
            <p className={styles.intro}>
              1.9 years and 10+ projects shipped end to end, from the component on screen to the API and the data
              behind it. The rest of the time, I build my own.
            </p>
          </Reveal>
        </header>

        <TimelineScene>
          {experience.map((job) => (
            <li key={job.company} className={styles.item} data-tl="item">
              <span className={styles.node} aria-hidden="true" />
              <p className={styles.periodMask}>
                <span className={styles.period} data-tl="period">
                  {job.period}
                  {job.current ? <span className={styles.now}>Now</span> : null}
                </span>
              </p>
              <p className={styles.company} data-tl="company">
                {job.company}
                <span className={styles.place}> / {job.place}</span>
              </p>
              <h3 className={styles.role} data-tl="role">
                {job.role}
              </h3>
              <ul className={styles.points}>
                {job.points.map((p) => (
                  <li key={p} data-tl="point">
                    {p}
                  </li>
                ))}
              </ul>
              <ul className={styles.chips} aria-label="Technologies used">
                {job.tech.map((t) => (
                  <li key={t} className={styles.chip} data-tl="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </TimelineScene>
      </div>
    </section>
  );
}
