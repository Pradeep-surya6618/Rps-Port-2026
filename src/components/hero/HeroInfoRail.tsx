import { Code2, Lightbulb, Rocket } from "lucide-react";
import styles from "./Hero.module.css";

const blocks = [
  { icon: Code2, lines: ["Clean code", "Better apps"] },
  { icon: Lightbulb, lines: ["Learn", "Build", "Grow"] },
  { icon: Rocket, lines: ["Full stack", "Developer"] },
];

export function HeroInfoRail() {
  return (
    <ul className={styles.rail} aria-label="What I stand for">
      {blocks.map(({ icon: IconCmp, lines }, i) => (
        <li key={i} className={styles.railItem} data-hero="rail">
          <IconCmp className={styles.railIcon} size={30} strokeWidth={1.4} aria-hidden="true" />
          <span className={styles.railRule} aria-hidden="true" />
          <span className={styles.railText}>
            {lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
