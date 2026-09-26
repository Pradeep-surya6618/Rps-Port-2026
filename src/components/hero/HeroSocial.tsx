import { Magnetic } from "@/components/animation/Magnetic";
import { Icon } from "@/components/ui/Icon";
import { socialById } from "@/data/social";
import styles from "./Hero.module.css";

const links = [socialById("linkedin"), socialById("github")];

export function HeroSocial() {
  return (
    <div className={styles.social} data-hero="social">
      <ul className={styles.socialIcons}>
        {links.map((s) => (
          <li key={s.id}>
            <Magnetic strength={0.4}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${s.label} (opens in a new tab)`}>
                <Icon name={s.id === "linkedin" ? "linkedin" : "github"} size={22} />
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>
      <span className={styles.socialRule} aria-hidden="true" />
      <a href="#contact" className={styles.connect}>
        Let&rsquo;s connect
      </a>
    </div>
  );
}
