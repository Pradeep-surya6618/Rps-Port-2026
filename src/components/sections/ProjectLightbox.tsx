"use client";

import { useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import styles from "./ProjectLightbox.module.css";

type Props = {
  project: Project;
  /** The framed screenshot shown in the scene; it becomes the open button. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Opens a project's screenshot full size in a modal viewer. Uses the native
 * <dialog>, so Esc closes it and focus stays inside while it is open; a click
 * on the dimmed backdrop or the × button also closes it.
 */
export function ProjectLightbox({ project, children, className }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className={className}
        data-cursor="project"
        data-cursor-label="View"
        data-pj="visual"
        onClick={() => dialog.current?.showModal()}
      >
        <span className="sr-only">View the {project.title} screenshot full size</span>
        {children}
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={`${project.title} screenshot`}
        // Lenis must not hijack wheel/touch scrolling inside the viewer.
        data-lenis-prevent
        // A click on the backdrop lands on the dialog element itself.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className={styles.frame}>
          <header className={styles.bar}>
            <div className={styles.title}>
              <span className={styles.number}>{project.number}</span>
              <span>{project.title}</span>
              <span className={styles.category}>{project.category}</span>
            </div>
            <div className={styles.actions}>
              {project.link ? (
                <a href={project.link.href} target="_blank" rel="noopener noreferrer" className={styles.visit}>
                  {project.link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              <button type="button" className={styles.close} onClick={close} aria-label="Close">
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </header>
          <div className={styles.imageWrap}>
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt={project.image.alt}
              sizes="(max-width: 900px) 96vw, 80vw"
              className={styles.image}
              quality={90}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
