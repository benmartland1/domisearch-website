import type { Metadata } from "next";
import Image from "next/image";
import { DomiMark } from "@/components/landing/DomiMark";
import { CaseStudyGate } from "@/components/landing/CaseStudyGate";
import { CaseStudyStack } from "@/components/landing/CaseStudyStack";
import { LinkedInCard } from "@/components/landing/LinkedInCard";
import { UnlockCards } from "@/components/landing/UnlockCards";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Taxd became the name AI recommends · DomiSearch",
  description:
    "The full blueprint behind how Taxd went from 0 to 200+ AI recommendations every week: the technical work, the content and the strategy. Unlock the case study free.",
  alternates: { canonical: "/taxd-case-study" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "How Taxd became the name AI recommends",
    description:
      "0 to 200+ AI recommendations every week. The exact AEO method, the winning prompts and why Taxd moved early. Unlock it free.",
    url: `${site.url}/taxd-case-study`,
    images: [{ url: "/brand/taxd-founders.png", width: 1080, height: 1080, alt: "Taxd founders" }],
  },
};

const UNLOCK_LIST = [
  {
    title: "The invisible starting point",
    body: "Where Taxd actually ranked in AI answers before we started, and why buyers never saw them.",
  },
  {
    title: "The turnaround",
    body: "0 to 200+ AI mentions every week. The growth curve, engine by engine.", // PLACEHOLDER stat
  },
  {
    title: "The exact AEO method",
    body: "What we actually did: the technical foundations, content and authority work behind it.",
  },
  {
    title: "The prompts they now win",
    body: "The real buyer questions where ChatGPT, Gemini and Perplexity now name Taxd.",
  },
  {
    title: "Why Taxd moved early",
    body: "Why Eamon and the team bet on AI search before their competitors did, and what it changed.",
  },
  {
    title: "The 90-day playbook",
    body: "The repeatable system behind the result, laid out phase by phase.",
  },
];

/** 5-star Trustpilot cue — mirrors the roadmap page. */
function TrustpilotCue() {
  return (
    <div className="flex justify-center">
      <a
        href={site.trustpilot}
        target="_blank"
        rel="noopener"
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/70 px-3.5 py-1.5 text-sm text-[color:var(--color-ink-2)] transition-colors hover:text-[color:var(--color-ink)]"
      >
        <span className="flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="#00b67a">
              <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 9.5l6.9-.6z" />
            </svg>
          ))}
        </span>
        <span className="font-semibold">Rated 5 stars on Trustpilot</span>
      </a>
    </div>
  );
}

/**
 * Taxd wordmark set inline in the headline — the white Taxd logo inside a
 * Taxd-blue chip so it sits at text size and reads as a brand, not an image.
 */
function TaxdChip() {
  return (
    <span className="mx-[0.06em] inline-flex translate-y-[0.05em] rotate-[-4deg] items-center rounded-[0.28em] bg-[#1f6feb] px-[0.36em] py-[0.16em] align-baseline shadow-[0_5px_14px_-4px_rgba(31,111,235,0.65)]">
      <Image
        src="/clients/taxd-white.png"
        alt="Taxd"
        width={500}
        height={184}
        className="h-[0.82em] w-auto"
      />
    </span>
  );
}

export default function TaxdCaseStudyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]">
      {/* ===================== 1 · THIN TOP BAR ===================== */}
      <div className="bg-[color:var(--color-ink)] px-6 py-2.5 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-paper)]/85">
          For brands ready to own the AI answer
        </span>
      </div>

      {/* Brand bar — no nav, no competing links */}
      <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-6 py-6">
        <DomiMark className="h-7 w-7" />
        <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">DomiSearch</span>
        <span className="ml-2 hidden border-l border-black/15 pl-2.5 text-[13px] text-[color:var(--color-ink-3)] sm:inline">
          AEO Case Study
        </span>
      </div>

      {/* ===================== 2 · HERO ===================== */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-3xl px-6 pb-4 pt-4 text-center sm:pt-8">
          <TrustpilotCue />

          <h1 className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(2rem,5.4vw,3.1rem)] font-bold leading-[1.12] tracking-tight text-[color:var(--color-ink)]">
            How <TaxdChip /> went from{" "}
            <span className="whitespace-nowrap underline decoration-[color:var(--color-pine)] decoration-[3px] underline-offset-[6px]">
              0 to 200+
            </span>{" "}
            AI recommendations every week, and now gets found when customers ask{" "}
            <span className="text-[color:var(--color-pine)]">ChatGPT for tax help</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-[color:var(--color-ink-2)] sm:text-lg">
            Eamon Shahir, Co-Founder of Taxd, stopped waiting for Google to save them. We break down
            exactly how they became the name AI recommends.
          </p>

          {/* HERO IMAGE — Taxd founders */}
          <div className="mx-auto mt-9 w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-black/[0.08] shadow-[0_36px_80px_-32px_rgba(20,17,13,0.5)]">
              <Image
                src="/brand/taxd-founders.png"
                alt="Eamon and Arj, co-founders of Taxd"
                width={1748}
                height={1240}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-[12px] text-[color:var(--color-ink-3)]">
              Eamon &amp; Arj, co-founders of Taxd
            </p>
          </div>

          {/* CTA gate */}
          <div className="mx-auto mt-9 max-w-md">
            <CaseStudyGate id="gate-hero" />
          </div>
        </div>
      </section>

      {/* ===================== 3 · CREDIBILITY (LinkedIn card) ===================== */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-10">
        <LinkedInCard />
      </section>

      {/* ===================== 4 · WHAT'S INSIDE ===================== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.7rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
              What&apos;s inside?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[color:var(--color-ink-2)] sm:text-lg">
              See exactly how Taxd went from invisible in AI answers to 200+ recommendations every
              week: the technical work, the content and the strategy behind it.
            </p>
          </div>

          <div className="mt-12 sm:mt-16">
            <CaseStudyStack />
          </div>

          {/* CTA after the resource cards */}
          <div className="mx-auto mt-14 max-w-md sm:mt-16">
            <CaseStudyGate id="gate-cards" />
          </div>
        </div>
      </section>

      {/* ===================== 5 · WHAT YOU UNLOCK ===================== */}
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <h2 className="text-center text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
          What you unlock
        </h2>
        <p className="mt-3 text-center text-[14px] font-semibold text-[color:var(--color-ink-3)]">
          6 resources. Unlocked instantly.
        </p>
        <div className="mt-10 sm:mt-12">
          <UnlockCards items={UNLOCK_LIST} />
        </div>
      </section>

      {/* ===================== 6 · FOUNDER QUOTE BAND ===================== */}
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-10 w-10 text-[color:var(--color-sage)]/60"
            fill="currentColor"
            aria-hidden
          >
            <path d="M9.5 6C6.5 7 5 9.5 5 13v5h6v-6H8c0-2 .8-3.4 2.6-4L9.5 6Zm9 0c-3 1-4.5 3.5-4.5 7v5h6v-6h-3c0-2 .8-3.4 2.6-4L18.5 6Z" />
          </svg>
          {/* PLACEHOLDER quote — swap for the real one */}
          <blockquote className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.4rem,3.4vw,2.1rem)] font-semibold leading-[1.28] tracking-tight text-[color:var(--color-paper)]">
            “Everyone&apos;s still fighting over Google rankings while their customers have already moved
            to ChatGPT. We decided to be the answer instead of chasing the click, and it&apos;s been
            the best growth decision we&apos;ve made.”
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Image
              src="/testimonials/eamon-shahir.png"
              alt="Eamon Shahir"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-left leading-tight">
              <div className="text-[15px] font-bold text-[color:var(--color-paper)]">Eamon Shahir</div>
              <div className="text-[13px] text-[color:var(--color-paper)]/60">Co-Founder, Taxd</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 7 · FINAL CTA ===================== */}
      <section className="relative bg-[color:var(--color-paper)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="mx-auto max-w-xl text-balance text-[clamp(1.8rem,4.6vw,2.7rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--color-ink)]">
            Unlock the full blueprint
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
            The exact method behind Taxd going from invisible to the name AI recommends. Free, in
            full.
          </p>
          <div className="mx-auto mt-9 max-w-md">
            <CaseStudyGate id="gate-final" />
          </div>
        </div>
      </section>

      {/* ===================== 8 · FOOTER + DISCLAIMER ===================== */}
      <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]/55">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <div className="flex items-center gap-2">
              <DomiMark className="h-5 w-5" />
              <span className="text-[13px] font-semibold text-[color:var(--color-paper)]/80">
                DomiSearch 2026
              </span>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[11px] leading-relaxed text-[color:var(--color-paper)]/40">
            Not endorsed by or affiliated with OpenAI, Google, Meta or any AI provider. Results shown
            are based on a real client campaign and are not typical or guaranteed. AI visibility
            outcomes depend on factors including industry, competition, existing web presence, and
            execution. DomiSearch provides search and AI-visibility marketing services and does not
            provide financial or legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
