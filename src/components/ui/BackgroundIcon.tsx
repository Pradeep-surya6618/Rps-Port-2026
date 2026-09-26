import { Parallax } from "@/components/animation/Parallax";
import styles from "./BackgroundIcon.module.css";

type BackgroundIconProps = {
  /** A lucide icon element, e.g. <GraduationCap />. */
  children: React.ReactNode;
  /** Positions and sizes it within the section (set by the section's CSS). */
  className?: string;
  /** Parallax speed; lower drifts more slowly behind the content. */
  speed?: number;
};

/**
 * Giant hairline icon drifting behind a section, like the outlined "@" in the
 * Instagram section. It takes the section's accent colour.
 */
export function BackgroundIcon({ children, className, speed = 0.3 }: BackgroundIconProps) {
  return (
    <Parallax speed={speed} className={`${styles.icon} ${className ?? ""}`} aria-hidden>
      {children}
    </Parallax>
  );
}
