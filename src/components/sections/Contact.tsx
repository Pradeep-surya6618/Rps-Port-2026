import { Magnetic } from "@/components/animation/Magnetic";
import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { Icon } from "@/components/ui/Icon";
import { PillLink } from "@/components/ui/PillLink";
import { profile } from "@/data/profile";
import { socials } from "@/data/social";
import { ContactGlow } from "./ContactGlow";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
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
              <PillLink href={`mailto:${profile.email}`} variant="solid">
                Email me
              </PillLink>
              <PillLink href={profile.cv} download>
                Download CV
              </PillLink>
            </div>
          </Reveal>

          <Reveal as="ul" stagger className={styles.links}>
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  className={styles.link}
                  {...(s.id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <Magnetic strength={0.35} className={styles.linkIcon}>
                    <Icon name={s.id} size={20} />
                  </Magnetic>
                  <span className={styles.linkLabel}>{s.label}</span>
                  <span className={styles.linkHandle}>{s.handle}</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                  {s.id === "email" ? null : <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
