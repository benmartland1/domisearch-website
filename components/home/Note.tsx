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

/** Long curve that swoops down and to the right (hero). */
export function ArrowSwoop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={`ds-note-arrow ${className}`} aria-hidden="true" focusable="false" {...stroke}>
      <path d="M6 8c20 4 46 16 62 34 13 15 22 27 28 39" />
      <path d="M86 70l10 12 5-15" />
    </svg>
  );
}

/** Short hook curving up and to the right (enquiry). */
export function ArrowHook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 60" className={`ds-note-arrow ${className}`} aria-hidden="true" focusable="false" {...stroke}>
      <path d="M6 54c6-18 16-32 36-40 7-3 13-4 20-4" />
      <path d="M52 4l12 5-7 11" />
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
