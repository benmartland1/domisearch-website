import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { site } from "@/lib/site";

/**
 * Domi Studio: our in-house software that connects the work we deliver with
 * each client's AI-search performance. The preview is a simplified, public
 * presentation of the real workflow: a dated change timeline and one expanded
 * review. Illustrative content only. No client data, internal identifiers,
 * sync logs or administrative controls, and no performance figures.
 */
const timeline = [
  { date: "02 Oct", kind: "Technical fix", title: "AI crawler access and sitemap corrected", state: "Reviewed" },
  { date: "09 Oct", kind: "Service page", title: "Engineering recruitment page rewritten", state: "Reviewed", open: true },
  { date: "14 Oct", kind: "New content", title: "Guide: hiring engineers in the North West", state: "Day 6 of 28" },
  { date: "16 Oct", kind: "New content", title: "FAQ: how recruitment agency fees work", state: "Baseline recorded" },
];

const review = [
  {
    label: "What changed",
    body: "The engineering recruitment page was rewritten to state the sectors, regions and roles covered, with placement evidence the client approved. Live on 9 October; the 14 days before were recorded as the baseline.",
  },
  {
    label: "What we observed",
    body: "Over the 14-day window the page was cited for the target questions on Perplexity and Google AI Overviews. ChatGPT answers still named two competitors and not the client. One overlapping change on 14 October is flagged, so the two are reviewed together.",
  },
  {
    label: "What we'll do next",
    body: "Add an FAQ block answering the fee and timescale questions buyers ask, and strengthen the sources those ChatGPT answers rely on. Review again at day 28 and set the next priorities from what that shows.",
  },
];

export function StudioSection() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10" id="domi-studio">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow="Domi Studio"
            title="See what we changed. Understand what happened next."
          />
          <ScrollReveal delay={200}>
            <div className="mt-6 max-w-xl space-y-4 text-pretty text-base leading-relaxed text-[color:var(--color-fog)]/85 sm:text-lg">
              <p>Our in-house Domi Studio connects the work we deliver with your AI-search performance.</p>
              <p>
                We record when content goes live and technical fixes are completed, review subsequent
                changes in visibility, and use those findings to guide your next priorities.
              </p>
              <p>
                You get a clearer picture of what we&apos;re doing, what we&apos;re learning and why we
                recommend the next step.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <ul className="mt-8 space-y-3 text-sm text-[color:var(--color-fog)]/80">
              {[
                "Every change is logged with its live date, the pages affected and the buyer questions it targets.",
                "Each change gets a baseline from the 14 days before and reviews at 7, 14 and 28 days after.",
                "Reviews are written in plain language: what changed, what we observed, what we'll do next.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={340}>
            <p className="mt-6 max-w-xl text-sm text-[color:var(--color-fog)]/60">
              Domi Studio is our own software, built to support the managed service. It reads
              performance data from the AI visibility tracking platform we use; it does not replace it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Talk about your AI visibility
                <span aria-hidden>→</span>
              </Link>
              <Link href="/services/aeo" className="btn btn-ghost">
                How the programme works
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Product preview */}
        <ScrollReveal delay={160}>
          <figure>
            <div className="card relative overflow-hidden p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-domigreen)]" aria-hidden />
                  <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--color-glacier)]">
                    Domi Studio
                  </span>
                  <span className="hidden whitespace-nowrap text-[11px] text-[color:var(--color-fog)]/45 sm:inline">· Change &amp; impact</span>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-fog)]/60">
                  Illustrative
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                {/* Timeline */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-[0.62rem]">Change timeline</span>
                    <span className="text-[11px] text-[color:var(--color-fog)]/50">October</span>
                  </div>
                  <ol className="relative mt-3 space-y-2">
                    <span aria-hidden className="absolute left-[5px] top-3 bottom-3 w-px bg-white/10" />
                    {timeline.map((t) => (
                      <li key={t.date + t.title} className="relative pl-6">
                        <span
                          aria-hidden
                          className={`absolute left-0 top-[14px] h-[11px] w-[11px] rounded-full border ${
                            t.open
                              ? "border-[color:var(--color-domigreen)] bg-[color:var(--color-domigreen)]"
                              : "border-white/30 bg-[color:var(--color-charcoal)]"
                          }`}
                        />
                        <div
                          className={`rounded-xl border p-3 ${
                            t.open
                              ? "border-[color:var(--color-domigreen)]/50 bg-[color:var(--color-domigreen)]/[0.06]"
                              : "border-white/10 bg-white/[0.02]"
                          }`}
                          aria-current={t.open ? "true" : undefined}
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-medium text-[color:var(--color-glacier)]">{t.date}</span>
                            <span className="text-[color:var(--color-fog)]/55">{t.kind}</span>
                          </div>
                          <p className="mt-1 text-xs leading-snug text-[color:var(--color-fog)]/90">{t.title}</p>
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                              t.state === "Reviewed"
                                ? "bg-[color:var(--color-domigreen)]/15 text-[color:var(--color-domigreen)]"
                                : "bg-white/[0.06] text-[color:var(--color-fog)]/65"
                            }`}
                          >
                            {t.state}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Expanded review */}
                <div className="rounded-2xl border border-[color:var(--color-domigreen)]/35 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="eyebrow text-[0.62rem]">Review · 9 Oct change</span>
                    <span className="text-[11px] text-[color:var(--color-fog)]/55">Baseline 14d · Review 7 / 14 / 28d</span>
                  </div>
                  <p className="mt-2 text-sm font-[600] leading-snug text-[color:var(--color-glacier)]">
                    Engineering recruitment page rewritten
                  </p>
                  <dl className="mt-4 space-y-4">
                    {review.map((r) => (
                      <div key={r.label} className="border-t border-white/10 pt-3">
                        <dt className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-domigreen)]">
                          {r.label}
                        </dt>
                        <dd className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-fog)]/85 sm:text-[13px]">
                          {r.body}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["Overlapping change flagged", "Same questions, same platforms"].map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[color:var(--color-fog)]/65"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-[color:var(--color-fog)]/55">
              Simplified preview of a Domi Studio change record. Illustrative content; no client data
              or performance figures are shown.
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
