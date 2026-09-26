import { Reveal } from "@/components/animation/Reveal";
import { RevealText } from "@/components/animation/RevealText";
import { alsoWorkWith, placeSkills, skillGroups } from "@/data/skills";
import { StackConstellation } from "./StackConstellation";
import styles from "./TechStack.module.css";

export function TechStack() {
  const placed = placeSkills(skillGroups);

  return (
    <section id="stack" className={styles.stack} aria-label="The stack">
      <div className={`container ${styles.head}`}>
        <p className="eyebrow">Toolkit</p>
        <RevealText as="h2" lines={["The stack"]} className={`display ${styles.title}`} />
        <Reveal>
          <p className={styles.note}>
            The tools I reach for every day, from the interface down to the database. Hover a skill to trace it back.
          </p>
        </Reveal>
      </div>

      <div className="container">
        <StackConstellation groups={skillGroups} skills={placed} />
      </div>

      <div className={`container ${styles.also}`}>
        <p className={styles.alsoLabel}>Also working with</p>
        <Reveal as="ul" stagger className={styles.alsoList}>
          {alsoWorkWith.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
