import { Icon } from "@/components/ui/Icon";
import { profile } from "@/data/profile";
import { socials } from "@/data/social";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.name}>{profile.fullName}</p>
          <p className={styles.role}>{profile.title}</p>
        </div>
        <ul className={styles.social} aria-label="Social links">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                className={styles.icon}
                data-brand={s.id}
                aria-label={s.id === "email" ? `Email ${profile.email}` : `${s.label} (opens in a new tab)`}
                {...(s.id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <Icon name={s.id === "email" ? "gmail" : s.id} size={18} />
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.copy}>&copy; 2026 {profile.fullName}</p>
      </div>
    </footer>
  );
}
