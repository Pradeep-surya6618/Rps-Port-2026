"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { MEDIA } from "@/lib/animations/media";
import { revealWords } from "@/lib/animations/reveal";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

type RevealTextProps = {
  as?: Tag;
  id?: string;
  /** Lines of text; each renders on its own line. */
  lines: readonly string[];
  className?: string;
  /** Optional class per line, by index. */
  lineClassNames?: readonly (string | undefined)[];
  delay?: number;
  start?: string;
};

/** Heading that rises into view word by word from behind a mask. */
export function RevealText({ as: Tag = "h2", id, lines, className, lineClassNames, delay = 0, start }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        revealWords(ref.current!.querySelectorAll(".word"), { trigger: ref.current!, delay, start });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className={lineClassNames?.[li]} style={{ display: "block" }} aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="word-mask">
              <span className="word">{word}</span>
              {wi < line.split(" ").length - 1 ? "\u00a0" : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
