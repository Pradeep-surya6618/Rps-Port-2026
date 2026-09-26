import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { PillLink } from "@/components/ui/PillLink";
import { profile } from "@/data/profile";
import { ContactGlow } from "./ContactGlow";
import { ContactGrid } from "./ContactGrid";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.contact} data-accent="red" aria-labelledby="contact-title">
      <ContactGlow className={styles.glow} />

      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Contact</p>
        <RevealText
          as="h2"
          id="contact-title"
          lines={["Let’s build", "something", "useful."]}
          className={`display ${styles.title}`}
          lineClassNames={[undefined, undefined, styles.accent]}
        />

        <div className={styles.row}>
          <Reveal className={styles.intro}>
            <p>Have an idea, product or project in mind?</p>
            <p className={styles.introStrong}>Let&rsquo;s talk.</p>
            <div className={styles.ctas}>
              <PillLink href={`mailto:${profile.email}`} variant="solid" className={styles.emailButton}>
                Email me
              </PillLink>
              <PillLink href={profile.cv} download className={styles.cvButton}>
                Download CV
              </PillLink>
            </div>
          </Reveal>

          <Reveal className={styles.gridWrap}>
            <ContactGrid />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
