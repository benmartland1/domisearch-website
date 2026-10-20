import Link from "next/link";
import { Arrow, pillGhostDark, pillGreen } from "@/components/light/Primitives";
import { site } from "@/lib/site";

/** Full-bleed dark close. The footer follows it with no gap on paper routes. */
export function FinalCta() {
  return (
    <section className="mt-24 bg-[color:var(--color-ink)] text-[color:var(--color-paper)] lg:mt-32">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 lg:py-28">
        <h2 className="mx-auto max-w-2xl text-balance text-[clamp(2rem,5vw,3.3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
          Find out where you stand in AI search.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-[color:var(--color-paper)]/75 sm:text-[18px]">
          Request a free AI visibility check, or book a 30-minute call. We&apos;ll show you where
          you appear today, who is being recommended instead, and what we would work on first.
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a href={site.calendly} target="_blank" rel="noopener" className={pillGreen}>
            Book a call
            <Arrow />
          </a>
          <Link href="/#visibility-check" className={pillGhostDark}>
            Check my AI visibility
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-[color:var(--color-paper)]/55">
          Or email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-[color:var(--color-domigreen)]">
            {site.email}
          </a>
        </p>
      </div>
    </section>
  );
}
