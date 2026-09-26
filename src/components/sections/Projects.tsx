import Image from "next/image";
import { RevealText } from "@/components/animation/RevealText";
import { Reveal } from "@/components/animation/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { projects, type Project } from "@/data/projects";
import { ProjectsScene } from "./ProjectsScene";
import styles from "./Projects.module.css";

function ProjectVisual({ project }: { project: Project }) {
  const image = (
    <Image
      src={project.image.src}
      width={project.image.width}
      height={project.image.height}
      alt={project.image.alt}
      sizes="(max-width: 899px) 92vw, 56vw"
      className={styles.shot}
    />
  );

  const frame =
    project.frame === "browser" ? (
      <div className={styles.browser}>
        <div className={styles.chrome} aria-hidden="true">
          <span />
          <span />
          <span />
          <em>{project.link ? project.link.href.replace("https://", "") : project.slug}</em>
        </div>
        <div className={styles.viewport}>{image}</div>
      </div>
    ) : (
      <div className={styles.board}>{image}</div>
    );

  const label = project.link ? "View project" : "View screens";
  const href = project.link?.href ?? project.image.src;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.visual}
      data-cursor="project"
      data-cursor-label={label}
      data-pj="visual"
    >
      <span className="sr-only">
        {project.link ? `Open ${project.title} (new tab)` : `Open the ${project.title} screenshot full size (new tab)`}
      </span>
      {frame}
    </a>
  );
}

export function Projects() {
  return (
    <section id="work" className={styles.projects} data-accent="gold" aria-labelledby="work-title">
      <header className={`container ${styles.head}`}>
        <p className="eyebrow">Selected work</p>
        <RevealText as="h2" id="work-title" lines={["Selected", "work"]} className={`display ${styles.title}`} lineClassNames={[undefined, styles.titleIndent]} />
        <Reveal>
          <p className={styles.headNote}>
            A live SaaS platform, a client website, and two apps I&rsquo;m building in my own time.
          </p>
        </Reveal>
      </header>

      <ProjectsScene>
        {projects.map((p) => (
          <article
            key={p.slug}
            className={styles.panel}
            data-pj="panel"
            style={{ "--tint": p.tint } as React.CSSProperties}
            aria-labelledby={`project-${p.slug}`}
          >
            <div className={styles.scene} data-pj="scene">
              <div className={styles.backdrop} data-pj="backdrop" aria-hidden="true" />
              <span className={styles.number} data-pj="number" aria-hidden="true">
                {p.number}
              </span>

              <div className={`container ${styles.panelGrid}`}>
                <div className={styles.text} data-pj="text">
                  <p className={styles.category}>
                    <span className={styles.index}>{p.number}</span>
                    {p.category}
                  </p>
                  <h3 id={`project-${p.slug}`} className={styles.name}>
                    {p.title}
                  </h3>
                  <p className={styles.desc}>{p.description}</p>
                  {p.features ? (
                    <ul className={styles.features}>
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                  <ul className={styles.tech} aria-label="Technologies">
                    {p.technologies.map((t) => (
                      <li key={t} data-pj="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.foot}>
                    <span className={styles.status}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      {p.status}
                    </span>
                    {p.link ? (
                      <PillLink href={p.link.href} external>
                        {p.link.label}
                      </PillLink>
                    ) : null}
                  </div>
                </div>

                <div className={styles.media} data-pj="media">
                  <ProjectVisual project={p} />
                </div>
              </div>
              <div className={styles.dim} data-pj="dim" aria-hidden="true" />
            </div>
          </article>
        ))}
      </ProjectsScene>
    </section>
  );
}
