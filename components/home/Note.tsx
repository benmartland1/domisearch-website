import type { CSSProperties, ReactNode } from "react";

/*
 * Handwritten margin notes. The text is real, selectable text in the Caveat
 * face; the arrows are decorative SVGs hidden from assistive tech, drawn as
 * single wobbly strokes with rounded ends.
 */
export function Note({
  children,
  rotate = -2,
  tone = "ink",
  className = "",
  style,
}: {
  children: ReactNode;
  rotate?: number;
  tone?: "ink" | "paper";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`ds-note ds-note-${tone} ${className}`}
      style={{ "--rot": `${rotate}deg`, ...style } as CSSProperties}
    >
      {children}
    </span>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Curve that runs right and bends down, ending just above the central phone (hero). */
export function ArrowSwoop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 76" className={`ds-note-arrow ${className}`} aria-hidden="true" focusable="false" {...stroke}>
      <path d="M4 10c26-6 52 2 68 20 8 9 13 20 16 34" />
      <path d="M79 54l9 12 6-14" />
    </svg>
  );
}

/** Short hook rising from the note back up to the illustration above (enquiry). */
export function ArrowHook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 64" className={`ds-note-arrow ${className}`} aria-hidden="true" focusable="false" {...stroke}>
      <path d="M8 60c-3-16 2-32 16-46" />
      <path d="M13 18l12-6 1 13" />
    </svg>
  );
}

/** Gently wavering arrow pointing straight down (form). */
export function ArrowDownWobble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 60" className={`ds-note-arrow ${className}`} aria-hidden="true" focusable="false" {...stroke}>
      <path d="M14 4c2 10-2 20 1 30 2 7 1 13 2 20" />
      <path d="M7 45l10 11 9-12" />
    </svg>
  );
}
