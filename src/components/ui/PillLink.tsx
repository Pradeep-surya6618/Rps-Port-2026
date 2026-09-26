import { Magnetic } from "@/components/animation/Magnetic";
import styles from "./PillLink.module.css";

type PillLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
};

/** Pill button with a sliding arrow. External links open in a new tab. */
export function PillLink({ href, children, variant = "ghost", external, download, className }: PillLinkProps) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Magnetic strength={0.25} className={className}>
      <a href={href} className={`${styles.pill} ${styles[variant]}`} download={download || undefined} {...ext}>
        <span className={styles.label}>{children}</span>
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    </Magnetic>
  );
}
