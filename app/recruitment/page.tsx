import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { DomiMark } from "@/components/landing/DomiMark";
import { JsonLd } from "@/components/JsonLd";
import { AISearchDemo } from "@/components/verticals/AISearchDemo";
import { PromptBoard } from "@/components/verticals/PromptBoard";
import { PromptTicker } from "@/components/verticals/PromptTicker";
import { VerticalNav } from "@/components/verticals/VerticalNav";
import { VerticalFaq, type FaqItem } from "@/components/verticals/VerticalFaq";
import { Cta, CtaBlock } from "@/components/verticals/Cta";
import {
  Carousel,
  ClampedText,
  MobileCollapse,
  StepsAccordion,
  StickyCta,
} from "@/components/verticals/Mobile";
import { Signature } from "@/components/verticals/Signature";
import { TerritoryMap } from "@/components/verticals/TerritoryMap";
import {
  TERRITORIES_TAKEN,
  TERRITORIES_CAPACITY,
} from "@/components/verticals/territoryData";
import { site } from "@/lib/site";

/**
 * The root layout declares a charcoal theme-color for the dark site. This page
 * is a cream surface, so on mobile that showed as a black browser chrome and a
 * black overscroll area behind the hero. Overridden per route.
 */
export const viewport: Viewport = {
  themeColor: "#f5f2ec",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Search Visibility for Recruitment Agencies · DomiSearch",
  description:
    "Hiring managers now ask ChatGPT and Gemini which recruitment agency to use. DomiSearch makes your firm the one AI names, for your sectors and your cities.",
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

/**
 * Territory availability.
 *
 * PLACEHOLDER DATA — every row below is invented. Replace with real signed
 * territories before launch.
 *
 * The flag defaults to OFF everywhere except local development, so placeholder
 * rows can never reach production by accident. To review on a deployed preview,
 * set NEXT_PUBLIC_SHOW_TERRITORIES=true on that environment only. Once real
 * clients are signed, replace TERRITORIES and enable the flag in production.
 */
/**
 * The client quote below is written copy, not a real client statement. It is
 * kept out of production for the same reason as the territory placeholders:
 * a named endorsement that nobody actually gave is a fake review, which the
 * Digital Markets, Competition and Consumers Act 2024 prohibits outright.
 * Replace the quote, name and firm with a real, permissioned client testimonial
 * and this can be published.
 */
const SHOW_PLACEHOLDER_TESTIMONIAL =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIAL === "true" ||
  process.env.NODE_ENV === "development";

const SHOW_TERRITORIES =
  process.env.NEXT_PUBLIC_SHOW_TERRITORIES === "true" ||
  process.env.NODE_ENV === "development";

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
    summary: "What every engine answers about your patch today.",
    body: "We map the questions your buyers actually type, by sector, by discipline and by city, then check what every major AI engine answers today. You see exactly who gets named instead of you.",
  },
  {
    n: "02",
    title: "Entity foundations",
    summary: "The plumbing that decides whether a model can cite you.",
    body: "Schema, llms.txt, consistent entity data and a site structure AI can parse. This is the plumbing that decides whether a model can cite you at all. Most recruitment sites fail here.",
  },
  {
    n: "03",
    title: "Citable content",
    summary: "Pages written to be quoted, not ranked.",
    body: "Sector and city pages written to be quoted, not ranked: salary data, hiring guides, market commentary. Specific enough that a model reaches for you over a national generalist.",
  },
  {
    n: "04",
    title: "Tracked monthly",
    summary: "Movement reported every month, engine by engine.",
    body: "The Territory Engine dashboard monitors your prompts across ChatGPT, Gemini, Perplexity, Copilot and Google AI, and reports movement every month. Visibility, share of voice, and which sources the models pulled from. You see the same screen we do.",
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
 * Two programmes at one price each, sold on territory rather than deliverable
 * volume. The scarce thing is the exclusivity slot, so it leads both cards.
 *
 * The second tier is not really a bigger version of the first — it is the same
 * engine pointed at three territories instead of one. That is what makes it
 * cheap for us to deliver and what makes it work as an anchor: a buyer reading
 * the entry card now knows someone else could take their other patches.
 *
 * The entry tier carries the accent border. The anchor does its work by
 * existing and by its price, so it sits quiet: no badge, no glow.
 */
const PROGRAMMES = [
  {
    name: "AI Search for Recruitment",
    /** Rendered as a pill floating over the card's top edge, not inside it. */
    label: "Most firms start here.",
    price: "£2,995",
    cadence: "per month",
    term: "3 month initial term, then rolling monthly",
    tagline: "One firm per sub-sector, per region.",
    primary: true,
    blocks: [
      {
        heading: "Your first month",
        items: [
          "Full prompt audit, visibility scorecard and 90 day roadmap",
          "Baseline capture and competitor citation benchmark",
          "Technical foundations: schema, llms.txt and an AI-readable site structure",
          "Entity and directory pass across the sources AI actually reads",
        ],
      },
      {
        heading: "Every month after",
        items: [
          // PLACEHOLDER — new/refresh split is indicative, adjust to how you deliver.
          "10 content pieces built to be cited (6 new, 4 refreshed)",
          "4 third-party citation actions: directory, listicle and press placements pitched on your behalf",
          "Review engine to turn client wins into visible proof",
          "Visibility tracked across 6 engines, monthly report and call, quarterly re-audit",
        ],
      },
    ],
    territory:
      "Covers one exclusive territory (your sub-sector and region). Additional territories agreed on the call.",
  },
  {
    name: "AI Search: Market Leader",
    label: null,
    price: "£5,995",
    cadence: "per month",
    term: "3 month initial term, then rolling monthly",
    tagline: null,
    primary: false,
    blocks: [
      {
        heading: "Everything in AI Search for Recruitment, plus",
        items: [
          "20 content pieces built to be cited (12 new, 8 refreshed)",
          "Digital PR and authority campaign: 8+ third-party citation actions, press placements pitched monthly",
          "Weekly visibility tracking across 6 engines",
          "Quarterly strategy session with your senior team",
        ],
      },
    ],
    territory:
      "For firms who want to own the AI answer across their whole market, not just one patch.",
  },
] as const;

/**
 * The technical detail, moved off the card into a collapsed panel. Buyers who
 * want it open it; everyone else scans past.
 */
const ENGINE_SPEC = [
  {
    area: "AI crawler access",
    detail:
      "llms.txt, robots and crawler access configured so the engines can reach you, then crawler log monitoring and a monthly fix cycle.",
  },
  {
    area: "Schema markup",
    detail:
      "Organization, WebSite, Service and FAQ to start, then JobPosting, Person, Review and Breadcrumb, maintained monthly.",
  },
  {
    area: "Entity data",
    detail:
      "Consistency pass across your site and the directories AI reads, building into a full sector and location entity architecture.",
  },
  {
    area: "Site structure",
    detail:
      "Core pages restructured for extraction, with an internal linking graph mapped to your sub-sector and region.",
  },
  {
    area: "Content",
    detail:
      "10 pieces a month written to be quoted rather than ranked: salary data, hiring guides and market commentary. 20 a month on Market Leader.",
  },
  {
    area: "Citations",
    detail:
      "4 third-party actions a month, or 8+ and a running digital PR campaign on Market Leader. Directory listings, listicle inclusion and press placements pitched on your behalf, because AI answers cite sources, not you.",
  },
  {
    area: "Reviews",
    detail:
      "A review engine that turns client wins into public proof the engines can read and quote back.",
  },
  {
    area: "Reporting",
    detail:
      "Territory Engine dashboard across 6 engines, a monthly report and call, and a full re-audit every quarter. Market Leader tracks weekly and adds a quarterly session with your senior team.",
  },
];

/**
 * The two people on an engagement. Headshots come from different shoots, so
 * they are cropped to one ratio and share a saturation/contrast treatment;
 * combined with the gradient overlay, they read as one set.
 */
const TEAM = [
  {
    name: "Ben Martland",
    role: "Founder",
    variant: "ben" as const,
    // Ben is already warm/candid; pull saturation back a touch so he meets
    // Jake in the middle rather than Jake having to travel the whole way.
    filter: "saturate(0.88) contrast(1.03) brightness(1.01)",
    photo: "/brand/founder.png",
    focus: "50% 22%",
    bio: "Three years scaling a service business, with £3M+ of managed search spend behind him. Ben builds the visibility engine: the technical foundations, the content that earns citations, and the monthly number that either moved or it did not.",
  },
  {
    name: "Jake Duffy",
    role: "Director",
    variant: "jake" as const,
    // Grey studio shot: sepia adds the warmth, saturate restores the colour
    // sepia flattens, hue-rotate steers it away from yellow toward Ben's amber.
    filter: "sepia(0.30) saturate(1.45) hue-rotate(-12deg) brightness(1.02) contrast(1.02)",
    photo: "/brand/jake-duffy.jpg",
    focus: "50% 28%",
    bio: "Five years inside UK recruitment before DomiSearch. Jake knows the BD grind: the cold calls, the PSLs you cannot crack, the clients who cannot tell you from four other agencies. He maps your disciplines, your patch and your buyers.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What is AEO, and how is it different from SEO?",
    a: "SEO gets you a blue link on a results page. AEO, or Answer Engine Optimisation, gets your firm named inside the answer itself, when someone asks ChatGPT, Gemini or Perplexity which recruitment agency to use. The buyer never sees a list of ten options; they see one recommendation. AEO is the work of becoming that recommendation.",
  },
  {
    q: "Do hiring managers really use AI to find recruitment agencies?",
    // SOURCE CHECK — verify the Forrester figures and the two survey stats
    // below before launch. They are stated with attribution, so they need to be
    // right.
    a: "The hard numbers are about B2B buying generally, and the people hiring you are B2B buyers. Forrester surveyed 18,000 of them and found 94% used AI somewhere in their most recent purchase. More than half now begin their research with an AI chatbot rather than Google, and around a third have bought from a vendor they had never heard of because AI put it in front of them. Rather than quote industry averages at you, we would rather run your own prompts on a call and show you what the engines say about your firm today.",
  },
  {
    q: "Our clients come through PSLs and referrals. Does this still matter?",
    // SOURCE CHECK — verify the 63% figure before launch.
    a: "Yes, because PSLs leak. Roughly 63% of hiring managers regularly engage agencies outside their preferred supplier list, usually for urgent or niche roles, and that is exactly the moment they go looking. Referred buyers check you out before they call, too. AI answers are part of that silent research whether the introduction came from a person or not.",
  },
  {
    q: "How long does it take to appear in AI answers?",
    a: "The foundations land in the first month. Movement on real buyer prompts typically starts showing between month two and month four, depending on how competitive your sub-sector is and how much authority your site already carries. It is slower than paid and faster than traditional SEO. That is why the programme runs a three month initial term and then rolls monthly: AI visibility compounds, and a single month proves nothing either way.",
  },
  {
    q: "Which sectors does this work best for?",
    a: "Specialist recruitment beats generalist recruitment in AI answers, consistently. Construction, engineering, M&E, healthcare, legal, tech. Anywhere a buyer describes a discipline and a location, a specialist firm with clear entity data can outrank a national generalist. If you place across everything with no clear focus, that is a positioning problem before it is an AEO problem, and we will say so.",
  },
  {
    q: "Do you work with more than one agency in the same sector and region?",
    a: "No. Competing prompts are a zero-sum fight, so we will not take two firms chasing the same sub-sector in the same region. One firm per sub-sector, per region. A firm holding commercial build in the North West does not block a firm working civils there, but it does block another commercial build firm. First in holds the slot.",
  },
  {
    q: "How do you prove it is working?",
    a: "Monthly tracking across ChatGPT, Gemini, Perplexity, Copilot and Google AI on your specific prompts, showing whether you were mentioned, where you ranked in the answer, and which sources the model cited. It is the Territory Engine dashboard, and you see the same screen we do.",
  },
];

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                 */
/* -------------------------------------------------------------------------- */

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="hidden overflow-hidden bg-[color:var(--color-ink)] py-2.5 sm:block">
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
      data-surface="paper"
      className="min-h-screen overflow-x-hidden bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]"
    >
      <JsonLd data={[faqSchema]} />
      <PromptTicker />
      <StickyCta href={site.calendly} />
      <Ticker />
      <VerticalNav
        calendly={site.calendly}
        territories={
          SHOW_TERRITORIES
            ? { taken: TERRITORIES_TAKEN, total: TERRITORIES_CAPACITY }
            : undefined
        }
      />

      {/* ===================== 1 · HERO ===================== */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        {/* minmax(0,1fr) rather than 1fr: grid tracks default to min-width:auto,
            which lets the demo's content widen the column as the answer streams
            in. Capping the minimum at 0 keeps the window a constant width. */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-7 px-5 pb-10 pt-5 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[1.02fr_minmax(0,1fr)] lg:gap-14 lg:pb-24">
          {/* Copy */}
          <div>
            <SectionLabel>AEO for recruitment</SectionLabel>

            <h1 className="mt-3.5 text-balance text-[clamp(1.85rem,7.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[color:var(--color-ink)] sm:mt-5">
              Be the recruitment firm{" "}
              <span className="text-[color:var(--color-ink-3)]">AI recommends</span>
            </h1>

            <p className="mt-3.5 max-w-xl text-pretty text-[15px] leading-relaxed text-[color:var(--color-ink-2)] sm:mt-6 sm:text-[19px]">
              When a hiring manager asks ChatGPT for the best construction recruiter in Manchester,
              one firm gets named. Right now it isn&apos;t yours. We fix that.
            </p>

            {/* One button on mobile so the CTA clears the fold; the secondary
                action drops to a text link and only becomes a button at sm. */}
            <div className="mt-5 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Cta href={site.calendly} className="w-full sm:w-auto" />
              <a
                href="#problem"
                className="text-[14px] font-semibold text-[color:var(--color-pine)] underline underline-offset-4 sm:rounded-full sm:border sm:border-black/[0.12] sm:bg-white/70 sm:px-6 sm:py-3.5 sm:text-[15px] sm:text-[color:var(--color-ink)] sm:no-underline sm:transition-colors sm:hover:bg-white"
              >
                See the free visibility audit
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 sm:mt-8">
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
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 py-6 sm:px-6 sm:py-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-2.5 sm:px-6 sm:py-4 ${
                i % 2 === 1 ? "border-l border-black/[0.07] pl-3 sm:pl-6" : ""
              } ${i > 1 ? "mt-3 border-t border-black/[0.07] pt-4 sm:mt-6 sm:pt-8 lg:mt-0 lg:border-t-0 lg:pt-4" : ""} ${
                i > 0 ? "lg:border-l lg:border-black/[0.07]" : ""
              }`}
            >
              <div className="text-[clamp(1.6rem,6vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] font-semibold tracking-tight text-[color:var(--color-ink)] sm:mt-3 sm:text-[14px]">
                {s.label}
              </div>
              <div className="mt-0.5 text-[11px] leading-snug text-[color:var(--color-ink-3)] sm:mt-1 sm:text-[12px]">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 3 · THE PROBLEM ===================== */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left column carries the headline and the two stats, so it is not a
              headline sitting over empty space beside six paragraphs. */}
          <div>
            <h2 className="text-balance text-[clamp(1.7rem,4.4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
              Your next client is asking an AI which agency to use{" "}
              <span className="text-[color:var(--color-ink-3)]">and you never see the question</span>
            </h2>

            {/* SOURCE CHECK — verify the 70-80% and 95% figures before launch. */}
            <div className="mt-7 grid grid-cols-2 gap-x-4 border-t border-black/[0.08] pt-6 sm:mt-12 sm:gap-x-10 sm:pt-8">
              <div>
                <div className="text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                  70 to 80%
                </div>
                <div className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-2)] sm:mt-3 sm:text-[14px]">
                  of buyer research happens before anyone gets contacted
                </div>
              </div>
              <div className="border-l border-black/[0.08] pl-4 sm:pl-10">
                <div className="text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                  95%
                </div>
                <div className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-2)] sm:mt-3 sm:text-[14px]">
                  of the time, the firm already on the shortlist wins
                </div>
              </div>
            </div>
          </div>

          <div className="text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
            <div className="space-y-4 sm:space-y-5">
              <p>
                By the time an employer picks up the phone, the shortlist is already written. The
                research that built it happened weeks earlier, without you.
              </p>
              <p>
                Referrals still open doors, and they always will. What a referral cannot reach is the
                research that happens underneath it, when someone types &ldquo;we need a QS in
                Salford, who should we call&rdquo; and acts on the two or three firms that come back.
              </p>
              <p>
                No impressions, no click data, nothing in your analytics, and a pipeline that quietly
                stops filling. If you are tired of agencies reporting rankings and traffic while your
                buyers have stopped clicking links at all, this is the fix.
              </p>
            </div>

            <p className="mt-8 text-[17px] font-semibold leading-snug text-[color:var(--color-ink)] sm:text-[18px]">
              The firms getting named aren&apos;t always the biggest. They&apos;re the ones an AI can
              read, verify and confidently recommend.
            </p>
          </div>
        </div>

        <div className="mt-7 sm:mt-14">
          <PromptBoard />
        </div>

        <div className="hidden sm:block">
          <CtaBlock href={site.calendly} line="Want to see this run on your prompts instead of ours? We will do it live on the call." />
        </div>
      </section>

      {/* ============ 3b · CLIENT QUOTE (dark) ============
          Its own surface so the quote lands as a beat of its own rather than a
          footnote to the problem section. */}
      {/* TODO: replace with real client quote before launch. */}
      {SHOW_PLACEHOLDER_TESTIMONIAL ? (
        <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
          <div className="mx-auto max-w-3xl px-5 py-9 text-center sm:px-6 sm:py-16">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-9 w-9 text-[color:var(--color-domigreen)]/55"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.5 6C6.5 7 5 9.5 5 13v5h6v-6H8c0-2 .8-3.4 2.6-4L9.5 6Zm9 0c-3 1-4.5 3.5-4.5 7v5h6v-6h-3c0-2 .8-3.4 2.6-4L18.5 6Z" />
            </svg>
            <blockquote className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.2rem,2.6vw,1.75rem)] font-bold leading-[1.35] tracking-[-0.025em] text-[color:var(--color-paper)]">
              &ldquo;A hiring manager rang about an urgent data centre role and said ChatGPT had given
              him three names, and ours was first. No PSL, no cold call, a client we would never have
              met. It is the first marketing spend I can tie to an actual fee.&rdquo;
            </blockquote>
            <div className="mt-7 flex items-center justify-center gap-4">
              {/* Drawn, not photographed. A real face attached to an invented name
                  would be using someone's likeness to fake an endorsement. */}
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Illustrated placeholder portrait">
                  <rect width="48" height="48" fill="#cfc7ba" />
                  <path d="M7 48c0-7.8 6.4-12 17-12s17 4.2 17 12Z" fill="#2c313a" />
                  <path d="M19.4 36.4 24 43.5l4.6-7.1-2.2-1.1h-4.8Z" fill="#f3f1ed" />
                  <path d="M24 43.5 21.8 36h4.4Z" fill="#01634c" />
                  <path d="M20.9 30.5h6.2v6.1l-3.1 2-3.1-2Z" fill="#cf9d78" />
                  <ellipse cx="24" cy="21.6" rx="8.4" ry="9.9" fill="#e3b892" />
                  <path d="M15.6 21.4c0-6.2 3.9-9.4 8.4-9.4s8.4 3.2 8.4 9.4c-.5-2.9-1.9-4.4-3.8-5-2.6 1.6-8.9 1.1-11 2.6-1.2 1-1.9 1.6-2 2.4Z" fill="#4b4b52" />
                  <path d="M15.9 23.4c-.5-1.6-.4-3 0-4.1l1.2.7c-.3 1-.4 2.1-.2 3.3Z" fill="#93939a" />
                  <path d="M32.1 23.4c.5-1.6.4-3 0-4.1l-1.2.7c.3 1 .4 2.1.2 3.3Z" fill="#93939a" />
                </svg>
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[15px] font-bold text-[color:var(--color-paper)]">
                  Mark Ellison
                </span>
                <span className="block text-[13px] text-[color:var(--color-paper)]/55">
                  Managing Director, Calder Rose Recruitment
                </span>
                <span className="block text-[13px] text-[color:var(--color-paper)]/55">
                  Construction &amp; Infrastructure, Leeds
                </span>
              </span>
            </div>
          </div>
        </section>
      ) : null}

      {/* ===================== 4 · THE SYSTEM ===================== */}
      <section id="system" className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
            The Territory Engine.{" "}
            <span className="text-[color:var(--color-ink-3)]">
              Four moves, run every month until you&apos;re the answer.
            </span>
          </h2>

          <div className="mt-5 sm:mt-14">
            <StepsAccordion steps={STEPS} />
          </div>

          <div className="hidden sm:block">
            <CtaBlock href={site.calendly} line="Thirty minutes to see what the Territory Engine would work on first for your firm." />
          </div>
        </div>
      </section>

      {/* ============ 4b · TERRITORY CHECK (white) ============
          Its own surface, above the proof and pricing: this is a qualifying
          question, so it belongs before a visitor invests in reading further.
          Hidden entirely unless SHOW_TERRITORIES is on. */}
      {SHOW_TERRITORIES ? (
        <section id="territories" className="border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-5xl px-5 py-7 sm:px-6 sm:py-24">
            <SectionLabel>Availability</SectionLabel>
            <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
              Can we work with your firm?{" "}
              <span className="text-[color:var(--color-ink-3)]">Check the map.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
              We take one firm per sub-sector, per region. Pick where you place and what you place,
              and we will show you what is still open. If your patch is held, we will tell you on the
              first call rather than waste your time.
            </p>
            <div className="mt-7 sm:mt-12">
              <TerritoryMap />
            </div>

            <CtaBlock
              href={site.calendly}
              line="Your patch still open? Get on a call before someone in your sector takes it."
            />
          </div>
        </section>
      ) : null}

      {/* ===================== 5 · PROOF ===================== */}
      <section id="proof" className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
        <SectionLabel>Proof</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
          We&apos;ve done this outside recruitment{" "}
          <span className="text-[color:var(--color-ink-3)]">and we&apos;ll show you the work</span>
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
          Straight answer: recruitment is a new vertical for us. The method isn&apos;t. Here is what it
          did for a UK tax platform competing against far larger, far older brands.
        </p>

        {/* Featured case study */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] sm:mt-12 border border-black/[0.08] bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
          <div className="grid gap-6 p-6 sm:gap-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
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
        <div className="mt-5 sm:mt-12">
          <Carousel>
            {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-[1.5rem] border border-black/[0.08] bg-white p-5 sm:p-7"
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
          </Carousel>
        </div>

        <div className="hidden sm:block">
          <CtaBlock href={site.calendly} line="We will show you the same numbers for your firm, live, on a 30 minute call." />
        </div>
      </section>

      {/* ===================== 6 · TEAM ===================== */}
      <section id="team" className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6 sm:py-28">
          <SectionLabel>Who you&apos;ll work with</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
            Two of us.{" "}
            <span className="text-[color:var(--color-ink-3)]">Both on every account.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
            DomiSearch is small and deliberately so. You get both of us on the work: the search side
            that gets you named inside AI answers, and the recruitment side that knows which
            conversations are worth winning. Not an account manager relaying it back a week late.
          </p>

          <div className="mt-8 grid gap-9 sm:mt-12 sm:grid-cols-2 sm:gap-10">
            {TEAM.map((m) => (
              <div key={m.name}>
                {/* Deliberately small. The source headshots are 400px and 800px
                    square, so anything wider than ~200px is upscaled on a retina
                    screen and goes soft. The shared saturation/contrast
                    treatment is what makes two photos from different shoots read
                    as one set. */}
                {/* This wrapper is deliberately NOT overflow-hidden: the card
                    inside clips the photo for the hover zoom, while the
                    signature hangs past the bottom edge. */}
                <div className="relative w-[150px] sm:w-[200px]">
                  <div className="group relative overflow-hidden rounded-[1.1rem] border border-black/[0.08] bg-[color:var(--color-ink)] shadow-[0_18px_40px_-24px_rgba(20,17,13,0.5)]">
                    <Image
                      src={m.photo}
                      alt={`${m.name}, ${m.role} at DomiSearch`}
                      width={400}
                      height={500}
                      sizes="200px"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{ objectPosition: m.focus, filter: m.filter }}
                    />
                    {/* Fades the foot of the photo into the section background.
                        The signature crosses this edge, so it needs one ink
                        colour that reads on both halves; fading to paper gives
                        that, where the old black gradient could not. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[13%] bg-gradient-to-t from-[color:var(--color-paper-2)]/0 to-transparent"
                    />
                  </div>
                  {/* Bottom-right, hanging past the lower edge, dark ink: the
                      placement Solar on Steroids uses. Offset with a negative
                      `bottom` rather than a translate utility, because the mark
                      sets its own rotate/skew transform. */}
                  <Signature
                    variant={m.variant}
                    className="absolute right-2 text-[color:var(--color-ink)]/90"
                  />
                </div>

                <div className="mt-9">
                  <p className="text-[16px] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[color:var(--color-ink-3)]">{m.role}</p>
                </div>

                <div className="mt-5">
                  <ClampedText>{m.bio}</ClampedText>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 border-l-2 border-[color:var(--color-pine)] pl-4 text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[19px]">
            One of us has spent £3M+ making brands findable. One of us has sat in your seat. Most
            agencies bring neither.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={site.calendly} />
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
      </section>

      {/* ===================== 7 · PRICING (dark) =====================
          The page runs continuous light beige from hero to footer, so pricing
          is inverted to the footer/Taxd palette. It gives the page a rhythm
          break and makes the commercial section read as a destination. The
          cards stay light so they lift off the dark ground. */}
      <section id="pricing" className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
        {/* One container for every block below — header, proof box, cards,
            engine panel, guarantee and footnote all share these edges.
            1100px: wide enough for two comfortable cards, narrow enough
            that the full-width boxes do not run long. */}
        <div className="mx-auto max-w-[68.75rem] px-5 py-7 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
            Pricing
          </span>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-paper)]">
            Two programmes. One goal.{" "}
            <span className="text-[color:var(--color-paper)]/55">Your patch held exclusively.</span>
          </h2>

          {/* Buyer maths, promoted out of body copy into a stat block so the
              price is read against the value of one placement. */}
          <div className="mt-10 sm:mt-16 grid gap-3 rounded-[1.5rem] border border-[color:var(--color-domigreen)]/25 bg-[color:var(--color-domigreen)]/[0.07] p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-8">
            <div>
              {/* PLACEHOLDER — £8k to £12k is a typical construction perm fee at
                  roughly 20% of salary; adjust to the disciplines you target. */}
              <div className="text-[clamp(2rem,5vw,2.9rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                £8k to £12k
              </div>
              <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-paper)]/60">
                One construction placement
              </div>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-8">
              <p className="text-[16px] leading-relaxed text-[color:var(--color-paper)]/85 sm:text-[17px]">
Either programme pays for itself if it wins you a single extra client a
                quarter. Everything after that is margin.
              </p>
              {/* SOURCE CHECK — verify the £25 CPC figure before launch. */}
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-paper)]/55">
                Recruitment firms already pay up to £25 a click fighting over these buyers on Google.
                AI answers reach the same buyers, and there is no auction.
              </p>
            </div>
          </div>

          {/* Two cards, side by side from md, entry tier first so it also leads
              on a stacked mobile view.

              The accent belongs to the £2,995 card: it is the option we expect
              most firms to take, and a buyer should not have to work out which
              one is the normal one. Market Leader anchors purely on its price
              and its scope, so it stays white and quiet — a second badge
              competing for attention would flatten both. */}
          <div className="mt-10 sm:mt-16 grid items-stretch gap-6 sm:gap-7 md:grid-cols-2">
            {PROGRAMMES.map((prog) => (
              <div
                key={prog.name}
                /* Not overflow-hidden: the floating label hangs past the top edge. */
                className={`group/card relative flex h-full flex-col rounded-2xl bg-white p-8 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-10 ${
                  prog.primary
                    ? "border-2 border-[color:var(--color-domigreen)] shadow-[0_34px_70px_-30px_rgba(1,232,144,0.45)]"
                    : "border border-black/[0.08] shadow-[0_24px_60px_-34px_rgba(20,17,13,0.55)]"
                }`}
              >
                {prog.label ? (
                  <span className="absolute top-0 left-8 inline-flex -translate-y-1/2 items-center rounded-full bg-[color:var(--color-domigreen)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-charcoal)] shadow-[0_6px_18px_-6px_rgba(1,232,144,0.9)] sm:left-10">
                    {prog.label}
                  </span>
                ) : null}

                <h3 className="text-[19px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[21px]">
                  {prog.name}
                </h3>

                {/* Price block, closed off with a hairline so the feature list
                    below reads as a separate thing to scan. */}
                <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span
                    className={`font-bold leading-none tracking-[-0.05em] text-[color:var(--color-ink)] ${
                      prog.primary
                        ? "text-[clamp(2.6rem,6vw,3.4rem)]"
                        : "text-[clamp(2.4rem,5.4vw,3.1rem)]"
                    }`}
                  >
                    {prog.price}
                  </span>
                  <span className="text-[14px] font-semibold text-[color:var(--color-ink-3)]">
                    {prog.cadence}
                  </span>
                </div>
                <p className="mt-2.5 text-[12px] font-semibold text-[color:var(--color-ink-3)]">
                  {prog.term}
                </p>
                <div aria-hidden className="mt-6 border-t border-black/[0.07]" />

                {prog.tagline ? (
                  <p className="mt-5 text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-pine)]">
                    {prog.tagline}
                  </p>
                ) : null}

                <MobileCollapse
                  label="See what&apos;s included"
                  closeLabel="Hide details"
                  className="md:!flex md:flex-1 md:flex-col"
                >
                  {prog.blocks.map((block, bi) => (
                    <div
                      key={block.heading}
                      /* No tagline above it, so the first group takes the
                         tagline's own offset and both cards' first line after
                         the divider sits at the same height. */
                      className={bi === 0 ? (prog.tagline ? "mt-6" : "mt-5") : "mt-7"}
                    >
                      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]"
                        />
                        {block.heading}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {block.items.map((f) => (
                          <li
                            key={f}
                            className="flex gap-2.5 text-[14px] leading-[1.45] text-[color:var(--color-ink-2)]"
                          >
                            <span
                              aria-hidden
                              className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[color:var(--color-domigreen)]/15"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-[11px] w-[11px] text-[color:var(--color-pine)]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m5 13 4 4L19 7" />
                              </svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div aria-hidden className="hidden grow md:block" />
                  <p className="mt-6 rounded-xl bg-[color:var(--color-pine)]/[0.08] px-3.5 py-3 text-[13px] font-semibold leading-relaxed text-[color:var(--color-pine)]">
                    {prog.territory}
                  </p>
                </MobileCollapse>

                {/* The content region above grows, so both buttons land on the
                    same baseline without a dead band above either. Same wording
                    on both — every route off this page is the call, never a
                    checkout. */}
                <Cta href={site.calendly} className="mt-8 w-full" />
              </div>
            ))}
          </div>

          {/* The plumbing, collapsed. Native details/summary so it needs no JS
              and works on touch without a handler. */}
          <details className="group mt-10 sm:mt-16 overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.04] [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8">
              <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-paper)] sm:text-[17px]">
                What&apos;s inside the engine
              </span>
              <span className="flex items-center gap-2 text-[13px] text-[color:var(--color-paper)]/50">
                <span className="hidden sm:inline">Full technical breakdown, both tiers</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>

            <div className="border-t border-white/10 px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
              {ENGINE_SPEC.map((row) => (
                <div
                  key={row.area}
                  className="grid gap-x-6 gap-y-1 border-b border-white/[0.07] py-4 last:border-0 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
                >
                  <span className="text-[13px] font-bold tracking-tight text-[color:var(--color-paper)] sm:text-[14px]">
                    {row.area}
                  </span>
                  <span className="text-[13px] leading-relaxed text-[color:var(--color-paper)]/60 sm:text-[14px]">
                    {row.detail}
                  </span>
                </div>
              ))}
            </div>
          </details>

          {/* Risk reversal. Deliberately loud: it is the strongest thing on the
              page and should not read as small print. */}
          <div className="mt-10 sm:mt-16 rounded-[1.5rem] border-2 border-[color:var(--color-domigreen)]/45 bg-[color:var(--color-domigreen)]/[0.09] p-5 text-center sm:p-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
              Our guarantee
            </span>
            <p className="mx-auto mt-3 max-w-2xl text-balance text-[clamp(1.15rem,2.6vw,1.6rem)] font-bold leading-snug tracking-tight text-[color:var(--color-paper)]">
              Cited on your priority prompts by month four, or we work free until you are.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[color:var(--color-paper)]/60">
              We agree the priority prompts with you in writing before we start, so there is no
              argument later about what counted.
            </p>
          </div>

          <p className="mt-10 sm:mt-16 text-[13px] text-[color:var(--color-paper)]/45">
            Both programmes are pure AI search, on a 3 month initial term and rolling monthly after
            that. Exclusivity means one firm per sub-sector, per region: Market Leader simply holds
            up to three of those slots rather than one. AI visibility compounds, so we do not take
            clients for a single month. Not ready to commit? We will run the visibility audit free on
            a call so you can see where you stand first.
          </p>
        </div>
      </section>


      {/* ===================== 8 · FAQ ===================== */}
      <section className="border-t border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6 sm:py-28">
          <h2 className="text-balance text-center text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[color:var(--color-ink)]">
            Questions recruitment owners ask
          </h2>
          <div className="mt-5 sm:mt-10">
            <VerticalFaq items={FAQS} />
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-[16px] font-semibold tracking-tight text-[color:var(--color-ink)]">
              Still got a question? Ask it on the call.
            </p>
            <Cta href={site.calendly} />
          </div>
        </div>
      </section>

      {/* ===================== 9 · FINAL CTA ===================== */}
      <section className="relative bg-[color:var(--color-paper)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-3xl px-5 py-10 text-center sm:px-6 sm:py-32">
          <h2 className="mx-auto max-w-2xl text-balance text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[color:var(--color-ink)]">
            Find out what AI says about your firm{" "}
            <span className="text-[color:var(--color-ink-3)]">before your competitor does</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[color:var(--color-ink-2)]">
            Thirty minutes. We run your real buyer prompts live on the call, no deck, and you see
            exactly where you stand today.
          </p>
          <Cta href={site.calendly} className="cta-pulse mt-9 px-8 py-4 text-[16px]" />
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
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
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
