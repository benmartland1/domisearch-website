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
 */
const TAXD_BLUE = "#1E40FF";

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
    </section>
  );
}
