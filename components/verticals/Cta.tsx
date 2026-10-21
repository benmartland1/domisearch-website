/**
 * The page's call to action, in one place so wording and styling cannot drift
 * apart across sections. Every instance reads "Book a call".
 *
 * Hover flips the button to the brand green and nudges the arrow, which makes
 * it read as invitation rather than a flat block of ink.
 */

type Props = {
  href: string;
  /** solid sits on light surfaces; outline pairs with a solid alongside it. */
  variant?: "solid" | "outline";
  className?: string;
  children?: React.ReactNode;
};

const BASE =
  "group inline-flex items-center justify-center gap-3 rounded-[3px] px-6 py-3.5 text-[14px] font-medium transition-all duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const VARIANTS = {
  solid:
    "border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white hover:border-[color:var(--color-forest)] hover:bg-[color:var(--color-forest)]",
  outline:
    "border border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]",
} as const;

export function Cta({ href, variant = "solid", className = "", children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      {children ?? "Book a call"}
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
    </a>
  );
}

/**
 * A CTA with a supporting line above it, for closing out a section. Keeps the
 * button wording identical while letting each section set its own lead-in.
 */
export function CtaBlock({ href, line }: { href: string; line: string }) {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 border-t border-black/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="max-w-xl text-[16px] font-semibold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[17px]">
        {line}
      </p>
      <Cta href={href} className="w-full shrink-0 sm:w-auto" />
    </div>
  );
}
