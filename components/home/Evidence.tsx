import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Arrow, pillGhostDark, pillGreen } from "@/components/light/Primitives";

/*
 * The verified result. Figures come from Searchable, the tracking tool used on
 * the Taxd account, for the 30 days to 16 October 2026:
 *   - 689 Taxd brand mentions across 1,080 AI answers checked
 *   - tracked on ChatGPT, Perplexity and Google AI Overviews
 * They describe the tracked prompt set only. Re-verify before changing them,
 * and never present Google Ads results here as evidence of AI search work.
 */
const PERIOD = "30 days to 16 October 2026";

const figures = [
  {
    value: "689",
    label: "Times Taxd was named in AI answers",
    measures: `Brand mentions across the questions we track for Taxd, ${PERIOD}.`,
  },
  {
    value: "1,080",
    label: "AI answers checked in that period",
    measures: `Every answer we collected for those questions, ${PERIOD}.`,
  },
  {
    value: "3",
    label: "AI platforms the figures cover",
    measures: "ChatGPT, Perplexity and Google AI Overviews. Other platforms are not included in these numbers.",
  },
];

/**
 * Anonymised results, for clients who have not agreed to be named. Sector
 * description only: no name, logo or link. Add an entry only with verified
 * figures, a stated measurement and a date range. Empty until a second
 * client programme has a reviewed result.
 */
type AnonymisedResult = {
  sector: string;
  value: string;
  label: string;
  measures: string;
};
const anonymised: AnonymisedResult[] = [];

export function Evidence() {
  return (
    <section className="mt-24 bg-[color:var(--color-ink)] text-[color:var(--color-paper)] lg:mt-32">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
            Verified result
          </span>
          <h2 className="mt-4 max-w-3xl text-balance text-[clamp(1.85rem,4.2vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            Taxd: named in 689 AI answers in a month.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-[16px] leading-relaxed text-[color:var(--color-paper)]/75 sm:text-[18px]">
            Taxd, a UK tax software company, works with DomiSearch on AI search visibility. The
            figures below are from Searchable, the tracking tool we use, for the buyer questions
            we track for them. Each number says what it measures and the period it covers.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3">
          {figures.map((f, i) => (
            <ScrollReveal key={f.label} delay={i * 80}>
              <div className="h-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <div className="text-[clamp(2.6rem,5vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                  {f.value}
                </div>
                <div className="mt-3 text-[15px] font-bold tracking-tight text-[color:var(--color-paper)]">
                  {f.label}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-paper)]/60">
                  {f.measures}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={120}>
          <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/clients/taxd-white.png"
                alt="Taxd"
                width={500}
                height={184}
                className="h-6 w-auto"
                sizes="100px"
              />
              <p className="text-[13px] leading-snug text-[color:var(--color-paper)]/55">
                The figures describe the tracked set of questions, not every AI conversation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/taxd-case-study" className={pillGreen}>
                How Taxd did it
                <Arrow />
              </Link>
              <Link href="/services/aeo" className={pillGhostDark}>
                The programme behind it
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {anonymised.length > 0 ? (
          <div className="mt-14">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-paper)]/60">
              Other client results, anonymised
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {anonymised.map((r) => (
                <div key={r.sector + r.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="text-[12px] font-semibold text-[color:var(--color-paper)]/60">{r.sector}</div>
                  <div className="mt-3 text-[2.4rem] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                    {r.value}
                  </div>
                  <div className="mt-2 text-[14px] font-bold text-[color:var(--color-paper)]">{r.label}</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-paper)]/60">{r.measures}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
