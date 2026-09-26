import { philosophy } from "@/data/profile";
import { PhilosophyScene } from "./PhilosophyScene";
import styles from "./Philosophy.module.css";

export function Philosophy() {
  return (
    <PhilosophyScene className={styles.philosophy}>
      <div className={styles.sticky}>
        <div className={styles.glow} data-ph="glow" aria-hidden="true" />
        <p className={styles.glyph} data-ph="glyph" aria-hidden="true">
          &lt;/&gt;
        </p>
        <h2 className={styles.words}>
          <span className="sr-only">{philosophy.lines.join(", ")}</span>
          {philosophy.lines.map((line, i) => (
            <span key={line} className={styles.line} data-ph={`line-${i}`} aria-hidden="true">
              <span className={styles.outline}>{line}</span>
              <span className={styles.fill} data-ph={`fill-${i}`}>
                {line}
              </span>
            </span>
          ))}
        </h2>
        <p className={styles.text} data-ph="text">
          {philosophy.text}
        </p>
      </div>
    </PhilosophyScene>
  );
}
