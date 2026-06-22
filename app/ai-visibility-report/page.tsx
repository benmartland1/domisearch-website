import type { Metadata } from "next";
import Image from "next/image";
import { ReportFunnelProvider, DomainCaptureForm } from "@/components/landing/ReportFunnel";
import { DomiMark } from "@/components/landing/DomiMark";
import { EngineStrip } from "@/components/landing/EngineStrip";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free AI Visibility Report - Are You in the Answer? · DomiSearch",
  description:
    "Your customers are asking ChatGPT, Perplexity and Google AI for recommendations. Find out whether your brand shows up - get a free AI Visibility Report.",
  alternates: { canonical: "/ai-visibility-report" },
  openGraph: {
    title: "Are you in the answer? Free AI Visibility Report",
    description:
      "See where your brand shows up across ChatGPT, Google AI and Perplexity - and where competitors are winning the answer.",
    url: `${site.url}/ai-visibility-report`,
  },
};

/* Brand logos to show as social proof (real DomiSearch clients). */
const PROOF_LOGOS = [
  { name: "Taxd", src: "/clients/taxd.png" },
  { name: "Rooftop Saunas", src: "/clients/rooftop_saunas.png" },
  { name: "Fueled", src: "/clients/fueled.png" },
  { name: "Netil360", src: "/clients/netil360.png" },
  { name: "Garside Waddingham", src: "/clients/garside_waddingham.png" },
];

const PROBLEMS = [
  {
    title: "Buyers ask AI now - not just Google",
    body: "People type “best accountant in Manchester” or “which CRM should I use” straight into ChatGPT, Perplexity and Google’s AI - and act on whatever it tells them.",
  },
  {
    title: "Most brands are invisible in the answer",
    body: "These tools name only a handful of brands per response. If you’re not one of them, you simply don’t exist at the moment the buyer is deciding.",
  },
  {
    title: "The winner is picked before the click",
    body: "The brand the AI recommends gets the trust, the visit and the sale - often before the buyer ever reaches a single website. Your competitor wins by default.",
  },
];

const REPORT_BULLETS = [
  "Which AI platforms mention you - ChatGPT, Google AI Overviews, Perplexity and Gemini",
  "The exact buyer questions you show up for - and the ones where you’re missing",
  "Which competitors the AI recommends instead of you, and how often",
  "The specific gaps to fix first to start appearing in the answers that matter",
];

const STEPS = [
  {
    n: "1",
    title: "Enter your domain",
    body: "Tell us your website and where to send the report. Takes ten seconds.",
  },
  {
    n: "2",
    title: "We run live AI visibility tracking",
    body: "We check your brand across the major AI search engines using real buyer prompts - not guesswork.",
  },
  {
    n: "3",
    title: "Get the report + a walkthrough call",
    body: "You receive your AI Visibility Report and a short call to walk through your gaps and what to fix first.",
  },
];

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 shrink-0"
      fill="none"
    >
      <circle cx="10" cy="10" r="10" fill="var(--color-pine)" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="var(--color-paper)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AiVisibilityReportPage() {
  return (
    <ReportFunnelProvider>
      <div className="min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]">
        {/* Minimal brand bar - no nav, no links */}
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
          <DomiMark className="h-7 w-7" />
          <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">
            DomiSearch
          </span>
          <span className="ml-2 hidden border-l border-black/15 pl-2.5 text-[13px] text-[color:var(--color-ink-3)] sm:inline">
            Search Growth Partner
          </span>
        </div>

        {/* ============================ HERO ============================ */}
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 text-center sm:pt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.06] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-pine)]">
            AI Search Visibility
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.1rem,6vw,3.6rem)] font-bold leading-[1.05] tracking-tight text-[color:var(--color-ink)]">
            Your customers are asking ChatGPT for recommendations.{" "}
            <span className="text-[color:var(--color-pine)]">Are you in the answer?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
            More and more buying decisions now start - and finish - inside ChatGPT, Perplexity and
            Google’s AI, not a page of blue links. If those answers don’t mention you, you&apos;re
            invisible at the exact moment people choose.
          </p>

          <div className="mt-9">
            <DomainCaptureForm id="domain-hero" />
            <p className="mt-4 text-sm text-[color:var(--color-ink-3)]">
              Free report · No credit card · Takes ten seconds
            </p>
          </div>

          <div className="mt-12">
            <EngineStrip label="We check every engine your buyers ask" />
          </div>
        </section>

        {/* ========================== PROBLEM ========================== */}
        <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <h2 className="mx-auto max-w-2xl text-center text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
              Search has quietly changed. Most brands haven&apos;t noticed yet.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROBLEMS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-black/[0.07] bg-[color:var(--color-paper)] p-7"
                >
                  <h3 className="text-lg font-bold tracking-tight text-[color:var(--color-ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== WHAT THE REPORT SHOWS ===================== */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
                Your free report
              </div>
              <h2 className="mt-4 text-[clamp(1.7rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
                Exactly where you stand inside AI search
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                A plain-English snapshot of how visible your brand is when buyers ask AI for
                recommendations - and the quickest ways to start showing up.
              </p>
            </div>

            <ul className="space-y-4 rounded-2xl border border-black/[0.07] bg-[color:var(--color-paper-2)] p-7 sm:p-8">
              {REPORT_BULLETS.map((b) => (
                <li key={b} className="flex gap-3.5">
                  <Check />
                  <span className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================= HOW IT WORKS ========================= */}
        <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <h2 className="text-center text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
              How it works
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border border-black/[0.07] bg-[color:var(--color-paper)] p-7">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--color-pine)] text-lg font-bold text-[color:var(--color-paper)]">
                    {s.n}
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-[color:var(--color-ink)]">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== PROOF =========================== */}
        <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
          {/* Placeholder stat - swap for a real, defensible number */}
          <p className="mx-auto max-w-2xl text-[clamp(1.3rem,3.2vw,1.9rem)] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
            “[Placeholder stat - e.g. We&apos;ve checked AI visibility for 50+ UK brands and found
            most are invisible for their highest-intent buyer questions.]”
          </p>
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
            Trusted by brands like
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {PROOF_LOGOS.map((logo) => (
              <Image
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                width={132}
                height={40}
                className="h-7 w-auto opacity-60 grayscale sm:h-8"
              />
            ))}
          </div>
        </section>

        {/* ========================= FINAL CTA ========================= */}
        <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-2xl text-balance text-[clamp(1.8rem,4.6vw,2.8rem)] font-bold leading-[1.1] tracking-tight">
              Find out if AI is recommending you - or your competitor
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-paper)]/70">
              Get your free AI Visibility Report and see exactly where you stand. It takes ten
              seconds to start.
            </p>
            <div className="mt-9">
              <DomainCaptureForm id="domain-final" />
            </div>
          </div>
        </section>

        {/* ===================== Minimal footer ====================== */}
        <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]/55">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 px-6 py-7 text-[13px] sm:flex-row">
            <span>© {new Date().getFullYear()} DomiSearch · Search Growth Partner</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="text-[color:var(--color-paper)]/55 underline-offset-4 hover:text-[color:var(--color-paper)] hover:underline"
            >
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </ReportFunnelProvider>
  );
}
