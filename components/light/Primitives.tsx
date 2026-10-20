import type { ReactNode } from "react";

/*
 * Shared building blocks for the light (paper) surfaces: the homepage and the
 * sector pages. One source for the section label, heading scale, card style
 * and the "illustrative example" tag, so the two pages read as one design.
 */

/** White surface with a hairline and a restrained, low shadow. */
export const lightCard =
  "rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_24px_60px_-44px_rgba(20,17,13,0.4)]";

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-pine)] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-pine)]" />
      {children}
    </span>
  );
}

/** Label, heading and one-paragraph description that open every section. */
export function SectionIntro({
  label,
  title,
  description,
  align = "left",
  as: Heading = "h2",
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const centred = align === "center";
  return (
    <div className={centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <Heading
        className={`text-balance text-[clamp(1.85rem,4.2vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--color-ink)] ${
          label ? "mt-4" : ""
        }`}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-5 text-pretty text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[18px] ${
            centred ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Marks a mock-up as an example rather than a real result. */
export function IllustrationTag({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-black/[0.08] bg-[#fbfaf8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
      {children ?? (
        <>
          <span className="sm:hidden">Example</span>
          <span className="hidden sm:inline">Illustrative example</span>
        </>
      )}
    </span>
  );
}

/** Green highlight behind a phrase inside a mock-up. */
export function Mark({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-[0.3em] bg-[color:var(--color-domigreen)]/35 px-[0.2em] py-[0.05em] font-semibold text-[color:var(--color-ink)]">
      {children}
    </mark>
  );
}

/** Light browser or app window chrome for the illustrations. */
export function LightWindow({
  title,
  icon,
  tag = "Illustrative example",
  children,
  className = "",
}: {
  title: ReactNode;
  icon?: ReactNode;
  tag?: ReactNode | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${lightCard} overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#fbfaf8] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 text-[12px] font-semibold tracking-tight text-[color:var(--color-ink)]">
          {icon}
          <span className="block min-w-0 truncate">{title}</span>
        </span>
        {tag ? <span className="ml-auto shrink-0">{typeof tag === "string" ? <IllustrationTag>{tag}</IllustrationTag> : tag}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2.5l2.1 5.9 5.9 2.1-5.9 2.1L12 18.5l-2.1-5.9L4 10.5l5.9-2.1L12 2.5z"
        fill="currentColor"
      />
      <path d="M19 15l.9 2.4 2.4.9-2.4.9L19 21.6l-.9-2.4-2.4-.9 2.4-.9L19 15z" fill="currentColor" />
    </svg>
  );
}

/** Button classes shared by the light pages. Solid for the main action, outline beside it. */
export const pillSolid =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-6 py-3.5 text-[15px] font-bold tracking-tight text-[color:var(--color-paper)] shadow-[0_16px_36px_-18px_rgba(20,17,13,0.8)] transition-all duration-200 hover:-translate-y-px hover:bg-[color:var(--color-domigreen)] hover:text-[color:var(--color-charcoal)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
export const pillOutline =
  "group inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.14] bg-white px-6 py-3.5 text-[15px] font-bold tracking-tight text-[color:var(--color-ink)] transition-all duration-200 hover:-translate-y-px hover:border-[color:var(--color-pine)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
/** On the dark closing sections. */
export const pillGreen =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-domigreen)] px-6 py-3.5 text-[15px] font-bold tracking-tight text-[color:var(--color-charcoal)] transition-all duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0";
export const pillGhostDark =
  "group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-bold tracking-tight text-[color:var(--color-paper)] transition-all duration-200 hover:-translate-y-px hover:border-[color:var(--color-domigreen)] hover:text-[color:var(--color-domigreen)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}
