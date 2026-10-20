import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

/*
 * Homepage proof. The figures are taken from Searchable, the tracking tool
 * used on the Taxd account, for the 30 days to 16 October 2026:
 *   - 689 Taxd brand mentions across 1,080 AI answers checked
 *   - tracked on ChatGPT, Perplexity and Google AI Overviews
 * They describe the tracked prompt set only. Re-verify before changing them,
 * and never present Google Ads results here as evidence of AI search work.
 *
 * The four-step record below is supported by:
 *   - the crawler/indexability SOP (sitemap on the API subdomain, llms.txt
 *     pointing at a missing sitemap path) and the schema + llms.txt work
 *     already published on the gated case study page
 *   - Searchable daily data for April 2026: 12-16 brand mentions a day in
 *     the first week (30-36 answers checked daily), high twenties to high
 *     thirties in the last week, on the same 11 unbranded questions
 *   - Searchable prompt data (Oct 2026): sole-trader, expat and partnership
 *     filing questions still return no Taxd mention
 * Do not attribute the April rise to a single change; content work overlapped.
 */
const TAXD_BLUE = "#1E40FF";

const record = [
  {
    label: "What we found",
    body: "Taxd's sitemap lived on an API subdomain while the canonical site was on www, and its llms.txt pointed at a sitemap path that did not exist, so AI crawlers could not read the site consistently. In the first week of April 2026, Taxd was named in 12 to 16 of the 30 to 36 answers checked each day.",
  },
  {
    label: "What we changed",
    body: "Fixed crawler access, the sitemap and llms.txt as one consistent set, added Organisation and FAQ structured data, and then published content answering the self-assessment questions in the research, approved by the Taxd team.",
  },
  {
    label: "What we observed",
    body: "By the last week of April, daily mentions on the same questions were in the high twenties to high thirties, and 689 in the 30 days to 16 October 2026. A small tracked set on three platforms, so we read the trend, not any single day.",
  },
  {
    label: "What we did next",
    body: "Kept tracking the same questions daily and moved the priorities to where Taxd is still absent: sole-trader, expat and partnership filing questions where the answers name other providers.",
  },
];

const figures = [
  { value: "689", label: "Times Taxd was named in AI answers" },
  { value: "1,080", label: "AI answers checked over the period" },
  { value: "3", label: "Platforms tracked for this account" },
];

export function ProofSection() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="Proof"
        title="Taxd: named in 600+ AI answers a month."
        description="A verified AI search result, with the measurement context attached."
      />

      <ScrollReveal className="mt-14 block">
        <div className="relative">
          <span
            aria-hidden
            className="glow"
            style={{ width: 720, height: 520, background: TAXD_BLUE, top: -80, left: "50%", transform: "translateX(-50%)", opacity: 0.18 }}
          />
          <article
            className="card relative overflow-hidden p-8 sm:p-10"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, ${TAXD_BLUE} 10%, transparent) 0%, color-mix(in oklab, var(--color-glacier) 3%, transparent) 55%)`,
              borderColor: `color-mix(in oklab, ${TAXD_BLUE} 35%, transparent)`,
            }}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[5px]"
              style={{ background: `linear-gradient(to bottom, ${TAXD_BLUE}, transparent)` }}
            />
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-glacier)]">
                  <span>AI search visibility</span>
                  <span className="text-[color:var(--color-fog)]/40">·</span>
                  <span>UK tax software</span>
                </div>
                <h3 className="display mt-5 text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] tracking-tight">
                  When UK taxpayers ask AI about self-assessment, Taxd is one of the names that comes back.
                </h3>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--color-fog)]/80 sm:text-lg">
                  Taxd works with DomiSearch on AI search visibility. Across the buyer questions we
                  track for them, Taxd was named 689 times in AI answers in the 30 days to 16 October
                  2026, on ChatGPT, Perplexity and Google AI Overviews.
                </p>
                <p className="mt-4 max-w-2xl text-sm text-[color:var(--color-fog)]/60">
                  Measured in Searchable. The figures describe the tracked set of questions and
                  platforms, not every AI conversation, and are not a guarantee of what another
                  business would see.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/taxd-case-study" className="btn btn-primary">
                    How Taxd did it
                    <span aria-hidden>→</span>
                  </Link>
                  <Link href="/services/aeo" className="btn btn-ghost">
                    The programme behind it
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-white/10 lg:pl-10">
                {figures.map((f) => (
                  <div key={f.label}>
                    <div className="display text-4xl sm:text-5xl" style={{ color: TAXD_BLUE }}>
                      {f.value}
                    </div>
                    <div className="mt-2 max-w-[14rem] text-xs uppercase tracking-[0.16em] text-[color:var(--color-fog)]/70">
                      {f.label}
                    </div>
                  </div>
                ))}
                <div className="flex items-end">
                  <Image
                    src="/clients/taxd.png"
                    alt="Taxd"
                    width={96}
                    height={32}
                    className="h-7 w-auto opacity-75 brightness-0 invert"
                    sizes="96px"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </ScrollReveal>

      {/* The record behind the figure: found → changed → observed → next */}
      <ScrollReveal delay={120}>
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px w-10 bg-[color:var(--color-domigreen)]/70" />
          <span className="eyebrow">The record behind the figure</span>
        </div>
      </ScrollReveal>
      <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {record.map((r, i) => (
          <ScrollReveal key={r.label} as="li" delay={160 + i * 80} className="relative">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-[11px] font-semibold text-[color:var(--color-fog)]/80">
                  {i + 1}
                </span>
                <h4
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: `color-mix(in oklab, ${TAXD_BLUE} 45%, var(--color-glacier))` }}
                >
                  {r.label}
                </h4>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fog)]/85">{r.body}</p>
            </div>
            {i < record.length - 1 && (
              <span
                aria-hidden
                className="absolute right-[-10px] top-1/2 hidden -translate-y-1/2 text-[color:var(--color-fog)]/40 lg:block"
              >
                →
              </span>
            )}
          </ScrollReveal>
        ))}
      </ol>
      <ScrollReveal delay={480}>
        <p className="mt-6 max-w-3xl text-sm text-[color:var(--color-fog)]/60">
          Technical and content work overlapped during April, so no single change explains the
          rise. Monthly mentions have since stayed in a range of roughly 600 to 1,050 on the same
          tracked questions, and the questions where Taxd is still not named are the ones we are
          working on now. Recorded from the tracking tool&apos;s daily data; Domi Studio now logs each
          change date so reviews like this compare the same questions before and after.
        </p>
      </ScrollReveal>
    </section>
  );
}
