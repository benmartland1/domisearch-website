import type { Metadata } from "next";
import Image from "next/image";
import { DomiMark } from "@/components/landing/DomiMark";
import { JsonLd } from "@/components/JsonLd";
import { AISearchDemo } from "@/components/recruitment/AISearchDemo";
import { PromptBoard } from "@/components/recruitment/PromptBoard";
import { PromptTicker } from "@/components/recruitment/PromptTicker";
import { RecruitmentNav } from "@/components/recruitment/RecruitmentNav";
import { RecruitmentFaq, type FaqItem } from "@/components/recruitment/RecruitmentFaq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Search Visibility for Recruitment Agencies · DomiSearch",
  description:
    "Hiring managers now ask ChatGPT and Gemini which recruitment agency to use. DomiSearch makes your firm the one AI names — for your sectors, in your cities.",
  alternates: { canonical: "/recruitment" },
  openGraph: {
    title: "Be the recruitment firm AI recommends",
    description:
      "When a hiring manager asks ChatGPT for the best construction recruiter in Manchester, one firm gets named. We make it yours.",
    url: `${site.url}/recruitment`,
    images: [{ url: "/brand/logo.png", width: 1200, height: 630, alt: "DomiSearch" }],
  },
};

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

const TICKER = [
  "Google Partner & Shopify Partner agency",
  "Be the brand AI recommends",
  "Built for UK recruitment firms",
  "Tracking ChatGPT · Gemini · Perplexity · Copilot · Google AI",
  "Manchester based, working UK-wide",
];

/**
 * Every figure here is one we can evidence today.
 * PLACEHOLDER markers flag anything to re-verify before this page goes live.
 */
const STATS = [
  { value: "£3M+", label: "Ad spend managed", note: "Across live Google Ads accounts" },
  {
    // PLACEHOLDER — confirm the current Taxd figure before publishing.
    value: "200+",
    label: "AI recommendations a week",
    note: "Taxd, from a standing start",
  },
  { value: "5.0", label: "Trustpilot rating", note: "Verified client reviews" },
  { value: "6", label: "AI engines tracked", note: "Monthly, prompt by prompt" },
];

const STEPS = [
  {
    n: "01",
    title: "Prompt audit",
    body: "We map the questions your buyers actually type — by sector, by discipline, by city — then check what every major AI engine answers today. You see exactly who gets named instead of you.",
  },
  {
    n: "02",
    title: "Entity foundations",
    body: "Schema, llms.txt, consistent entity data and a site structure AI can parse. This is the plumbing that decides whether a model can cite you at all. Most recruitment sites fail here.",
  },
  {
    n: "03",
    title: "Citable content",
    body: "Sector and city pages written to be quoted, not ranked: salary data, hiring guides, market commentary. Specific enough that a model reaches for you over a national generalist.",
  },
  {
    n: "04",
    title: "Tracked monthly",
    body: "We monitor your prompts across ChatGPT, Gemini, Perplexity, Copilot and Google AI, and report movement every month. Visibility, share of voice, and which sources the models pulled from.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We have been working with Ben and DomiSearch for nearly 3 years. A true expert in his space. Taxd has grown a phenomenal customer base thanks to our fantastic search acquisition strategy.",
    name: "Eamon Shahir",
    role: "Co-Founder, Taxd",
    photo: "/testimonials/eamon-shahir.png",
  },
  {
    quote:
      "We brought Ben in to support not just with Google Ads, but also landing pages, copy, and AEO. This helped boost conversions at every stage of the funnel. What we value most is his ability to provide clear insights, suggest improvements, and execute independently.",
    name: "Arjun Kumar",
    role: "Co-Founder, Taxd",
    photo: "/testimonials/arjun-kumar.png",
  },
  {
    quote:
      "Ben from DomiSearch has made my life easy. Anything to do with Google Ads, this guy knows. No over complication, not focusing on 'getting you to buy'. The guy tells you what works, makes it work and over delivers.",
    name: "Angellos Koulli",
    role: "CEO, Alphaveata",
    photo: "/testimonials/angellos-koulli.png",
  },
];

/**
 * Two AEO packages. Both are pure AI-search — no Google Ads line items.
 *
 * The technical/schema depth split below is a PLACEHOLDER built on what
 * actually moves the needle for a recruitment firm (JobPosting markup, sector
 * and location entities). Tune the specifics before publishing.
 */
const PLANS = [
  {
    name: "AI Search Foundations",
    price: "£1,995",
    cadence: "per month",
    blurb:
      "The core AEO engine. Enough content and technical depth to start winning your primary discipline and city prompts.",
    inherits: null,
    features: [
      // PLACEHOLDER — new/refresh split is indicative, adjust to how you deliver.
      "10 content pieces a month — a mix of brand-new articles and rewrites of existing pages (typically 6 new, 4 refreshed)",
      "Core technical AEO: llms.txt, AI crawler access and page structure built for extraction",
      "Foundation schema: Organization, WebSite, Service and FAQ markup",
      "Entity consistency pass across your site and the directories AI reads",
      "Visibility tracking across 6 engines",
      "Monthly reporting call",
    ],
    cta: "Book a call",
    featured: false,
  },
  {
    name: "AI Search Authority",
    price: "£3,495",
    cadence: "per month",
    blurb:
      "For firms going after several disciplines and cities at once. More content, deeper technical work, and monthly conversion work on the pages already pulling traffic.",
    inherits: "Everything in Foundations, plus:",
    features: [
      "16 content pieces a month — new articles and rewrites (typically 10 new, 6 refreshed)",
      "Landing page optimisation on your existing pages, every month",
      "Deep schema layer: JobPosting, Person, Review and Breadcrumb markup, maintained monthly",
      "Sector and location entity architecture, with the internal linking graph to match",
      "AI crawler log monitoring and a monthly fix cycle",
      "Multi-discipline and multi-city prompt coverage",
    ],
    cta: "Book a call",
    featured: true,
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What is AEO, and how is it different from SEO?",
    a: "SEO gets you a blue link on a results page. AEO — Answer Engine Optimisation — gets your firm named inside the answer itself, when someone asks ChatGPT, Gemini or Perplexity which recruitment agency to use. The buyer never sees a list of ten options; they see one recommendation. AEO is the work of becoming that recommendation.",
  },
  {
    q: "Do hiring managers really use AI to find recruitment agencies?",
    a: "Increasingly, yes — particularly for building a shortlist before anyone picks up the phone. The behaviour mirrors what happened with Google: a buyer asks a natural-language question, gets back a short answer naming two or three firms, and contacts those. The difference is that there is no page two. If you are not in the answer, you are not in the process. Rather than quote industry averages at you, we would rather run your own prompts on a call and show you what the engines say about your firm today.",
  },
  {
    q: "How long does it take to appear in AI answers?",
    a: "Foundations land in the first month. Movement on real buyer prompts typically starts showing between month two and month four, depending on how competitive your sectors are and how much authority your site already carries. It is slower than paid and faster than traditional SEO.",
  },
  {
    q: "Which sectors does this work best for?",
    a: "Specialist recruitment beats generalist recruitment in AI answers, consistently. Construction, engineering, M&E, healthcare, legal, tech — anywhere a buyer describes a discipline and a location, a specialist firm with clear entity data can outrank a national generalist. If you place across everything with no clear focus, that is a positioning problem before it is an AEO problem, and we will say so.",
  },
  {
    q: "Do you work with more than one agency in the same sector and city?",
    a: "No. Competing prompts are a zero-sum fight — we will not take two firms competing for the same discipline in the same region. First in holds the slot.",
  },
  {
    q: "How do you prove it is working?",
    a: "Monthly tracking across ChatGPT, Gemini, Perplexity, Copilot and Google AI on your specific prompts, showing whether you were mentioned, where you ranked in the answer, and which sources the model cited. You see the same dashboard we do.",
  },
];

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                 */
/* -------------------------------------------------------------------------- */

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden bg-[color:var(--color-ink)] py-2.5">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-8 whitespace-nowrap px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-paper)]/70"
          >
            {t}
            <span className="text-[color:var(--color-domigreen)]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TrustpilotCue() {
  return (
    <a
      href={site.trustpilot}
      target="_blank"
      rel="noopener"
      className="inline-flex flex-wrap items-center gap-2 rounded-full border border-black/[0.07] bg-white/70 px-3.5 py-1.5 text-[13px] text-[color:var(--color-ink-2)] transition-colors hover:text-[color:var(--color-ink)]"
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
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-pine)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-pine)]" />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function RecruitmentPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]"
    >
      <JsonLd data={[faqSchema]} />
      <PromptTicker />
      <Ticker />
      <RecruitmentNav calendly={site.calendly} />

      {/* ===================== 1 · HERO ===================== */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        {/* minmax(0,1fr) rather than 1fr: grid tracks default to min-width:auto,
            which lets the demo's content widen the column as the answer streams
            in. Capping the minimum at 0 keeps the window a constant width. */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.02fr_minmax(0,1fr)] lg:gap-14 lg:pb-24">
          {/* Copy */}
          <div>
            <SectionLabel>AEO for recruitment</SectionLabel>

            <h1 className="mt-5 text-balance text-[clamp(2.3rem,4.6vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[color:var(--color-ink)]">
              The AI search partner for{" "}
              <span className="text-[color:var(--color-ink-3)]">UK recruitment firms</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[19px]">
              When a hiring manager asks ChatGPT for the best construction recruiter in Manchester,
              one firm gets named. Right now it isn&apos;t yours. We fix that.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className="rounded-full bg-[color:var(--color-ink)] px-6 py-3.5 text-[15px] font-bold tracking-tight text-[color:var(--color-paper)] shadow-[0_16px_36px_-18px_rgba(20,17,13,0.8)] transition-transform hover:-translate-y-px"
              >
                Book a discovery call
              </a>
              <a
                href="#problem"
                className="rounded-full border border-black/[0.12] bg-white/70 px-6 py-3.5 text-[15px] font-semibold tracking-tight text-[color:var(--color-ink)] transition-colors hover:bg-white"
              >
                See what AI says about you
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <TrustpilotCue />
              <span className="text-[13px] text-[color:var(--color-ink-3)]">
                Google Partner · Shopify Partner
              </span>
            </div>
          </div>

          {/* The demo */}
          <div className="min-w-0 lg:pl-2">
            <AISearchDemo />
          </div>
        </div>
      </section>

      {/* ===================== 2 · STATS ===================== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 py-10 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-4 sm:px-6 ${
                i % 2 === 1 ? "border-l border-black/[0.07]" : ""
              } ${i > 1 ? "mt-6 border-t border-black/[0.07] pt-8 lg:mt-0 lg:border-t-0 lg:pt-4" : ""} ${
                i > 0 ? "lg:border-l lg:border-black/[0.07]" : ""
              }`}
            >
              <div className="text-[clamp(2rem,4.4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                {s.value}
              </div>
              <div className="mt-3 text-[14px] font-semibold tracking-tight text-[color:var(--color-ink)]">
                {s.label}
              </div>
              <div className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 3 · THE PROBLEM ===================== */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <h2 className="text-balance text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
            Your next client is asking an AI which agency to use{" "}
            <span className="text-[color:var(--color-ink-3)]">and you never see the question</span>
          </h2>

          <div className="space-y-5 text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
            <p>
              Hiring managers used to search, scan ten results, and shortlist three. Now a growing
              share of them describe the problem to ChatGPT — &ldquo;we need a QS in Salford, who
              should we call&rdquo; — and act on the two or three firms it names.
            </p>
            <p>
              There is no page two. No impressions, no click data, nothing in your analytics. The
              first you know about it is a pipeline that quietly stops filling.
            </p>
            <p className="font-semibold text-[color:var(--color-ink)]">
              The firms getting named aren&apos;t always the biggest. They&apos;re the ones an AI can
              read, verify and confidently recommend.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <PromptBoard />
        </div>
      </section>

      {/* ===================== 4 · THE SYSTEM ===================== */}
      <section id="system" className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
            Four moves, run every month{" "}
            <span className="text-[color:var(--color-ink-3)]">until you&apos;re the answer</span>
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-black/[0.06] sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-[color:var(--color-paper)] p-7 sm:p-9">
                <span className="text-[12px] font-bold tracking-[0.2em] text-[color:var(--color-pine)]">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[20px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[22px]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 5 · PROOF ===================== */}
      <section id="proof" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <SectionLabel>Proof</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
          We&apos;ve done this outside recruitment{" "}
          <span className="text-[color:var(--color-ink-3)]">and we&apos;ll show you the work</span>
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
          Straight answer: recruitment is a new vertical for us. The method isn&apos;t. Here is what it
          did for a UK tax platform competing against far larger, far older brands.
        </p>

        {/* Featured case study */}
        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Image
                src="/clients/taxd-white.png"
                alt="Taxd"
                width={500}
                height={184}
                className="h-7 w-auto"
              />
              <p className="mt-6 text-balance text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.03em]">
                From invisible in AI answers to the name ChatGPT gives when someone asks for tax
                help.
              </p>
              <a
                href="/taxd-case-study"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-domigreen)] px-5 py-3 text-[14px] font-bold tracking-tight text-[color:var(--color-charcoal)] transition-transform hover:-translate-y-px"
              >
                Read the full blueprint
                <span aria-hidden>→</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:w-72 lg:grid-cols-1 lg:gap-7 lg:border-l lg:border-white/10 lg:pl-12">
              {/* PLACEHOLDER — re-verify both figures against Searchable before publishing. */}
              <div>
                <div className="text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                  200+
                </div>
                <div className="mt-2 text-[13px] text-[color:var(--color-paper)]/60">
                  AI recommendations a week
                </div>
              </div>
              <div>
                <div className="text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                  2.7×
                </div>
                <div className="mt-2 text-[13px] text-[color:var(--color-paper)]/60">
                  Daily AI mentions, within a month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-[1.5rem] border border-black/[0.08] bg-white p-7"
            >
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="#00b67a">
                    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 9.5l6.9-.6z" />
                  </svg>
                ))}
              </span>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-black/[0.07] pt-5">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <span className="leading-tight">
                  <span className="block text-[14px] font-bold tracking-tight text-[color:var(--color-ink)]">
                    {t.name}
                  </span>
                  <span className="block text-[12px] text-[color:var(--color-ink-3)]">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===================== 6 · FOUNDER ===================== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="mx-auto w-52 shrink-0 lg:mx-0 lg:w-64">
            <Image
              src="/brand/ben-warm.jpg"
              alt="Ben Martland, founder of DomiSearch"
              width={640}
              height={800}
              className="h-auto w-full rounded-[1.5rem] object-cover shadow-[0_30px_70px_-36px_rgba(20,17,13,0.55)]"
            />
          </div>
          <div>
            <SectionLabel>Who you&apos;ll work with</SectionLabel>
            <h2 className="mt-5 text-balance text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[color:var(--color-ink)]">
              You deal with me, not an account manager
            </h2>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-[color:var(--color-ink-2)]">
              <p>
                I&apos;m Ben Martland. I&apos;ve spent years running search for UK businesses —
                £3M+ of managed ad spend — and the last stretch of it watching buyer behaviour move
                into AI answers faster than most agencies were willing to admit.
              </p>
              <p>
                DomiSearch is small and deliberately so. You get the person doing the thinking, a
                plain-English explanation of what we&apos;re doing and why, and a monthly number that
                either moved or didn&apos;t.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className="rounded-full bg-[color:var(--color-ink)] px-5 py-3 text-[14px] font-bold tracking-tight text-[color:var(--color-paper)] transition-transform hover:-translate-y-px"
              >
                Book 30 minutes with me
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener"
                className="text-[14px] font-semibold text-[color:var(--color-pine)] hover:underline"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 7 · PRICING ===================== */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <SectionLabel>Pricing</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
          Two packages.{" "}
          <span className="text-[color:var(--color-ink-3)]">
            The difference is depth and volume.
          </span>
        </h2>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-[1.5rem] border p-7 sm:p-8 ${
                p.featured
                  ? "border-[color:var(--color-pine)]/40 bg-white shadow-[0_30px_70px_-40px_rgba(1,99,76,0.5)]"
                  : "border-black/[0.08] bg-white/60"
              }`}
            >
              {/* Both cards render this row so the two prices stay on the same
                  baseline; the unfeatured one is an invisible spacer. Keeping
                  it in flow means the badge can never overlap the title. */}
              <span
                aria-hidden={!p.featured}
                className={`mb-4 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  p.featured
                    ? "bg-[color:var(--color-pine)] text-white"
                    : "invisible bg-transparent"
                }`}
              >
                {p.featured ? "For competitive sectors" : " "}
              </span>
              <h3 className="text-[19px] font-bold tracking-tight text-[color:var(--color-ink)]">
                {p.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                  {p.price}
                </span>
                <span className="text-[13px] text-[color:var(--color-ink-3)]">{p.cadence}</span>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
                {p.blurb}
              </p>
              {p.inherits ? (
                <p className="mt-6 text-[13px] font-bold tracking-tight text-[color:var(--color-ink)]">
                  {p.inherits}
                </p>
              ) : null}
              <ul className={`flex-1 space-y-2.5 ${p.inherits ? "mt-3" : "mt-6"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px] text-[color:var(--color-ink-2)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-[3px] h-4 w-4 shrink-0 text-[color:var(--color-pine)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className={`mt-7 rounded-full px-5 py-3 text-center text-[14px] font-bold tracking-tight transition-transform hover:-translate-y-px ${
                  p.featured
                    ? "bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
                    : "border border-black/[0.12] bg-white text-[color:var(--color-ink)]"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-[13px] text-[color:var(--color-ink-3)]">
          Both packages are pure AI search. One firm per discipline, per region — we won&apos;t take
          your competitor. Not ready to commit? We&apos;ll run the visibility audit free on a
          discovery call so you can see where you stand first.
        </p>
      </section>

      {/* ===================== 8 · FAQ ===================== */}
      <section className="border-t border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-28">
          <h2 className="text-balance text-center text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[color:var(--color-ink)]">
            Questions recruitment owners ask
          </h2>
          <div className="mt-10">
            <RecruitmentFaq items={FAQS} />
          </div>
        </div>
      </section>

      {/* ===================== 9 · FINAL CTA ===================== */}
      <section className="relative bg-[color:var(--color-paper)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-6 sm:py-32">
          <h2 className="mx-auto max-w-2xl text-balance text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[color:var(--color-ink)]">
            Find out what AI says about your firm{" "}
            <span className="text-[color:var(--color-ink-3)]">before your competitor does</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[color:var(--color-ink-2)]">
            Thirty minutes. We run your real buyer prompts live on the call and you see exactly where
            you stand. No deck.
          </p>
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener"
            className="cta-pulse mt-9 inline-block rounded-full bg-[color:var(--color-ink)] px-8 py-4 text-[16px] font-bold tracking-tight text-[color:var(--color-paper)] shadow-[0_18px_40px_-18px_rgba(20,17,13,0.8)]"
          >
            Book a discovery call
          </a>
          <p className="mt-5 text-[13px] text-[color:var(--color-ink-3)]">
            Or email{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-[color:var(--color-pine)]">
              {site.email}
            </a>
          </p>
        </div>
      </section>

      {/* ===================== 10 · FOOTER ===================== */}
      <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]/55">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <DomiMark className="h-5 w-5" />
              <span className="text-[13px] font-semibold text-[color:var(--color-paper)]/80">
                DomiSearch {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px]">
              <a href="/" className="hover:text-[color:var(--color-paper)]">
                Home
              </a>
              <a href="/services/aeo" className="hover:text-[color:var(--color-paper)]">
                AI Search
              </a>
              <a href="/case-studies" className="hover:text-[color:var(--color-paper)]">
                Case studies
              </a>
              <a href="/contact" className="hover:text-[color:var(--color-paper)]">
                Contact
              </a>
            </div>
          </div>
          <p className="mx-auto mt-9 max-w-3xl text-center text-[11px] leading-relaxed text-[color:var(--color-paper)]/40">
            The ChatGPT interface shown on this page is an illustration of how AI answers are
            presented, not a screenshot of a live result. Not endorsed by or affiliated with OpenAI,
            Google, Microsoft or any AI provider. Results shown are based on real client work and are
            not typical or guaranteed. AI visibility outcomes depend on industry, competition,
            existing web presence and execution.
          </p>
        </div>
      </footer>
    </div>
  );
}
