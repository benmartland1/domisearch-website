/*
 * Inline SVG icons for the site. They replace the arrow, asterisk, pause,
 * star and menu glyphs the mockup used as text, which phones render as
 * colour emoji. All draw in currentColor at 1em so they sit in running text.
 */
type P = { className?: string; size?: number | string };
const base = (size: P["size"]) => ({
  width: size ?? "1em",
  height: size ?? "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  style: { display: "inline-block", verticalAlign: "-0.12em", flexShrink: 0 },
});

export function ArrowUpRight({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
export function ArrowRight({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function ArrowLeft({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
export function ArrowDown({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}
export function Pause({ className, size }: P) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
export function Play({ className, size }: P) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
export function Menu({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function Star({ className, size }: P) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M12 2.5l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.8l1.6-6.8L2.2 9.4l6.9-.6z" />
    </svg>
  );
}
export function Reply({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 14 4 9l5-5M4 9h9a7 7 0 0 1 7 7v3" />
    </svg>
  );
}
export function Forward({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m15 14 5-5-5-5M20 9h-9a7 7 0 0 0-7 7v3" />
    </svg>
  );
}
