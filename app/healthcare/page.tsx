import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { DomiMark } from "@/components/landing/DomiMark";
import { JsonLd } from "@/components/JsonLd";
import { AISearchDemo, type AnswerPart, type ResultRow } from "@/components/verticals/AISearchDemo";
import { PromptBoard, type PromptRow } from "@/components/verticals/PromptBoard";
import { PromptTicker, type TickerPrompt } from "@/components/verticals/PromptTicker";
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
  TERRITORIES_CAPACITY,
  territoriesTaken,
  type TerritoryIndustry,
} from "@/components/verticals/territoryData";
import { site } from "@/lib/site";
import { formatMonthYear, lastUpdated } from "@/lib/last-updated";

/**
 * Healthcare vertical landing page, for UK private clinics and practices.
 * Structurally the twin of /recruitment — same sections, same components, same
 * commercial model — with these deliberate differences:
 *
 *  1. No in-vertical proof yet, and the page says so. Taxd carries the proof,
 *     with a short "what transfers" block answering why a tax result should
 *     mean anything to a clinic.
 *  2. One founder, as on /accountants. There is no healthcare insider to pair
 *     Ben with, so the page does not pretend there is one.
 *  3. Compliance is a first-class objection. Health marketing sits under the
 *     CAP Code and each clinician's regulator, and prescription-only medicines
 *     cannot be advertised to the public, so both get their own FAQ.
 *  4. No patient survey statistics. The B2B buyer figures on the other pages do
 *     not apply to patients, and there is no patient figure yet we can stand
 *     behind, so the problem section uses descriptive numbers instead.
 *
 * Distinct from /aesthetics, which is a paid-traffic report funnel with no nav.
 */

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
  // The root layout's title template appends " · DomiSearch" itself.
  title: "AI Search Visibility for Healthcare Clinics",
  description:
    "Patients now ask ChatGPT and Gemini which clinic to trust before they book. DomiSearch works to make your practice the one AI names, for your treatments and your towns.",
  alternates: { canonical: "/healthcare" },
  openGraph: {
    title: "Be the clinic AI recommends",
    description:
      "When a patient asks ChatGPT where to go for treatment, one or two clinics get named. We work to make it yours.",
    url: `${site.url}/healthcare`,
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
 * set NEXT_PUBLIC_SHOW_TERRITORIES=true on that environment only.
 */
const SHOW_TERRITORIES =
  process.env.NEXT_PUBLIC_SHOW_TERRITORIES === "true" ||
  process.env.NODE_ENV === "development";

/** PLACEHOLDER — invented. Healthcare specialties and the regions held in each. */
const SPECIALTIES: TerritoryIndustry[] = [
  {
    id: "dental",
    name: "Dental",
    subSectors: {
      "Implants and restorative": ["north-west", "yorkshire"],
      "Orthodontics and aligners": ["london"],
      "Cosmetic dentistry": [],
    },
  },
  {
    id: "aesthetics",
    name: "Aesthetics",
    subSectors: {
      "Injectables and skin": ["north-west", "london"],
      "Laser and body": ["yorkshire"],
      "Cosmetic surgery": [],
    },
  },
  {
    id: "physio",
    name: "Physiotherapy & MSK",
    subSectors: {
      "Sports injury": ["north-west"],
      "Back and spine": ["west-midlands"],
      "Pelvic health": [],
    },
  },
  {
    id: "private-gp",
    name: "Private GP & screening",
    subSectors: {
      "Same day GP": ["london"],
      "Health screening": ["north-west", "scotland"],
      "Menopause and women's health": [],
    },
  },
  {
    id: "specialist",
    name: "Specialist clinics",
    subSectors: {
      Fertility: ["north-west"],
      "Hearing care": ["east-midlands"],
      "Eye care": ["north-east"],
    },
  },
];

const TERRITORIES_TAKEN = territoriesTaken(SPECIALTIES);

const TICKER = [
  "Google Partner agency",
  "Be the clinic AI recommends",
  "Built for UK private healthcare",
  "Tracking ChatGPT · Gemini · Perplexity · Copilot · Google AI",
  "Manchester based, working UK-wide",
];

/**
 * Every figure here is one we can evidence today. None of them is a healthcare
 * result, and none is labelled as one.
 */
const STATS = [
  { value: "£3M+", label: "Ad spend managed", note: "Across live Google Ads accounts" },
  {
    value: "600+",
    label: "AI mentions a month",
    note: "Taxd, across every major engine",
  },
  { value: "5.0", label: "Trustpilot rating", note: "Verified client reviews" },
  { value: "5", label: "AI engines tracked", note: "Monthly, prompt by prompt" },
];

/* --- The hero demo, in patient language ----------------------------------- */

const DEMO_QUERY = "best private dentist for implants in Manchester";

const DEMO_ANSWER: AnswerPart[] = [
  {
    text: "For dental implants in Manchester, the practice that comes up most consistently is",
  },
  { text: "Your Clinic", brand: true },
  {
    text: ". They are CQC registered, publish their implant pricing and aftercare clearly, and patients repeatedly mention how thoroughly the clinicians explain every option before treatment.",
  },
];

const DEMO_SOURCES = ["yourclinic.co.uk", "cqc.org.uk", "doctify.com"];

/** Rows 2 and 3 stay generic on purpose — we are not ranking real rivals. */
const DEMO_RESULTS: ResultRow[] = [
  // Kept short: row 1 also carries the "Cited" chip, so it has the least room.
  { name: "Your Clinic", meta: "Implants · Manchester", you: true },
  { name: "A regional dental group", meta: "General dentistry · North West", you: false },
  { name: "A national clinic chain", meta: "Multi-site · UK-wide", you: false },
];

const TICKER_PROMPTS: TickerPrompt[] = [
  { q: "best private dentist for implants in Manchester", engine: "ChatGPT" },
  { q: "private physio for a knee injury near me", engine: "Perplexity" },
  { q: "most trusted aesthetics clinic in Leeds", engine: "Gemini" },
  { q: "private GP same day appointment Manchester", engine: "ChatGPT" },
];

const BOARD_TABS = ["All", "Dental", "Aesthetics", "Specialist"];

const BOARD_ROWS: PromptRow[] = [
  {
    prompt: "best private dentist for implants in Manchester",
    sector: "Dental",
    engine: "ChatGPT",
    named: "2 dental groups, 1 directory",
  },
  {
    prompt: "clear aligner providers near me with good reviews",
    sector: "Dental",
    engine: "Perplexity",
    named: "1 aligner brand, 2 practices",
  },
  {
    prompt: "emergency dentist open on Saturday in Stockport",
    sector: "Dental",
    engine: "Gemini",
    named: "2 directories",
  },
  {
    prompt: "most trusted aesthetics clinic in Leeds",
    sector: "Aesthetics",
    engine: "ChatGPT",
    named: "2 national chains",
  },
  {
    prompt: "laser hair removal clinic reviews Liverpool",
    sector: "Aesthetics",
    engine: "Google AI",
    named: "1 chain, 1 directory",
  },
  {
    prompt: "private physio for back pain near me",
    sector: "Specialist",
    engine: "Perplexity",
    named: "1 national chain, 1 directory",
  },
  {
    prompt: "private GP same day appointment Manchester",
    sector: "Specialist",
    engine: "Copilot",
    named: "2 national providers",
  },
  {
    prompt: "best fertility clinic in the North West",
    sector: "Specialist",
    engine: "ChatGPT",
    named: "2 hospital groups",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Prompt audit",
    summary: "What every engine answers about your patch today.",
    body: "We map the questions your patients actually type, by treatment, by concern and by town, then check what every major AI engine answers today. You see exactly who gets named instead of you.",
  },
  {
    n: "02",
    title: "Entity foundations",
    summary: "The plumbing that decides whether a model can cite you.",
    body: "Schema, llms.txt, and consistent entity data across your CQC registration, NHS profile where you have one, Google Business Profile and the review platforms patients check, plus clinician profiles that show who is qualified to do what. Health is where the engines are most careful about who they trust, and most clinic websites give them too little to go on.",
  },
  {
    n: "03",
    title: "Citable content",
    summary: "Pages written to be quoted, not ranked.",
    body: "Treatment and town pages written to be quoted, not ranked: what a procedure involves, recovery, costs, and the questions patients ask before they book. Reviewed by your clinicians, and specific enough that a model reaches for you over a national chain.",
  },
  {
    n: "04",
    title: "Tracked monthly",
    summary: "Movement reported every month, engine by engine.",
    body: "The Territory Engine dashboard monitors your prompts across ChatGPT, Gemini, Perplexity, Copilot and Google AI, and reports movement every month. Visibility, share of voice, and which sources the models pulled from. You see the same screen we do.",
  },
];

/** Verbatim from the live site. None is from a healthcare client, and none claims to be. */
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
      "It's been great to work with DomiSearch. Their level of competence in ads and understanding of wider SEO keeps us coming back month after month!",
    name: "Sam Barraclough",
    role: "CEO, Rooftop Saunas",
    photo: "/testimonials/sam-barraclough.png",
  },
];

/**
 * Why a tax platform's result should mean anything to a clinic. The objection
 * lands the moment a reader sees the Taxd card, so it is answered right under it.
 */
const TRANSFERS = [
  {
    h: "Trust decides it",
    b: "Tax and health are the two areas where the engines are most careful about who they name. Taxd got named by giving them facts they could verify, not louder claims. That is the same work a clinic needs.",
  },
  {
    h: "Accuracy is the job",
    b: "People act on tax content, so every line has to be right, and the client signs off every word. Clinical content is held to the same standard, and we write to it from day one.",
  },
  {
    h: "Ready-to-book searches",
    b: "Most patients search for a treatment and a town. We have spent £3M+ of search budget on exactly that kind of high-intent query, and we know what a real enquiry looks like.",
  },
];

/**
 * Two programmes at one price each, sold on territory rather than deliverable
 * volume. Same shape and prices as /recruitment; see the note there.
 */
const PROGRAMMES = [
  {
    name: "AI Search for Healthcare",
    /** Rendered as a pill floating over the card's top edge, not inside it. */
    label: "Most clinics start here.",
    price: "£2,995",
    cadence: "per month",
    term: "3 month minimum term (6 recommended), then rolling monthly",
    tagline: "One clinic per specialty, per region.",
    primary: true,
    blocks: [
      {
        heading: "Your first month",
        items: [
          "Full prompt audit, visibility scorecard and 90 day roadmap",
          "Baseline capture and competitor citation benchmark",
          "Technical foundations: schema, llms.txt and an AI-readable site structure",
          "Entity pass across your regulator listings, review platforms and the directories AI reads",
        ],
      },
      {
        heading: "Every month after",
        items: [
          "Content built to be cited, new pieces and refreshes, agreed with you each month",
          "Third-party citation actions: directory, listicle and press placements pitched on your behalf",
          "Review engine to turn patient feedback into visible proof",
          "Visibility tracked across 5 engines, monthly report and call, quarterly re-audit",
        ],
      },
    ],
    territory:
      "Covers one exclusive territory (your specialty and region). We will never work with a competitor chasing the same prompts. Additional territories agreed on the call.",
  },
  {
    name: "AI Search: Market Leader",
    label: null,
    price: "£5,995",
    cadence: "per month",
    term: "3 month minimum term (6 recommended), then rolling monthly",
    tagline: null,
    primary: false,
    blocks: [
      {
        heading: "Everything in AI Search for Healthcare, plus",
        items: [
          "A larger monthly content programme, built to be cited",
          "Digital PR and authority campaign: an expanded citation push, press placements pitched monthly",
          "Weekly visibility tracking across 5 engines",
          "Quarterly strategy session with your senior team",
        ],
      },
    ],
    territory:
      "For multi-site groups who want to own the AI answer across their whole market, not just one patch. Every territory you hold is still exclusive: we will never take on a competitor chasing the same prompts.",
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
      "Organization, WebSite, Service and FAQ to start, then MedicalClinic or Dentist, Physician, MedicalProcedure, Review and Breadcrumb, maintained monthly.",
  },
  {
    area: "Entity data",
    detail:
      "Consistency pass across your site, your CQC registration, NHS profile where you have one, the professional registers your clinicians sit on, Google Business Profile and the healthcare review platforms, building into a full treatment and location entity architecture.",
  },
  {
    area: "Site structure",
    detail:
      "Treatment and location pages restructured for extraction, with clinician profiles linked to the treatments they perform and an internal linking graph mapped to your specialty and region.",
  },
  {
    area: "Content",
    detail:
      "A monthly programme of pieces written to be quoted rather than ranked: treatment explainers, recovery and aftercare, costs and finance, and the questions patients ask before booking. Signed off by your clinicians before anything publishes. A larger volume on Market Leader.",
  },
  {
    area: "Citations",
    detail:
      "Third-party actions every month, expanded into a running digital PR campaign on Market Leader. Healthcare directory listings, listicle inclusion and press placements pitched on your behalf, because AI answers cite sources, not you.",
  },
  {
    area: "Reviews",
    detail:
      "A review engine that turns patient feedback into public proof the engines can read and quote back, run within your regulator's guidance.",
  },
  {
    area: "Reporting",
    detail:
      "Territory Engine dashboard across 5 engines, a monthly report and call, and a full re-audit every quarter. Market Leader tracks weekly and adds a quarterly session with your senior team.",
  },
];

/** Moves with the last commit to this file. See lib/last-updated.ts. */
const UPDATED = lastUpdated("app/healthcare/page.tsx");

/**
 * The answer-first summary under the hero. Kept as one plain sentence pair with
 * no inline markup, so an engine can lift it verbatim. Every figure in it must
 * match the pricing cards and stats below.
 */
const SUMMARY =
  "DomiSearch is an AI search (AEO) agency for UK private healthcare providers, based in Manchester. We work to make clinics and practices the ones ChatGPT, Gemini and Perplexity name when patients ask where to go for treatment - tracked monthly across five AI engines, priced from £2,995/month.";

const FAQS: FaqItem[] = [
  {
    q: "What is AEO, and how is it different from SEO?",
    a: "SEO gets you a blue link on a results page. AEO, or Answer Engine Optimisation, gets your clinic named inside the answer itself, when a patient asks ChatGPT, Gemini or Perplexity where to go for treatment. The patient never sees a list of ten clinics; they see two or three recommendations. AEO is the work of becoming one of them.",
  },
  {
    q: "Do patients really use AI to choose a clinic?",
    // SOURCE CHECK — OpenAI has publicly described health as one of the most
    // common things people use ChatGPT for. Confirm the wording against their
    // own announcement before quoting any figure alongside it.
    a: "More every month, and it is hard to see because it leaves no trace in your analytics. OpenAI has said health is one of the most common things people use ChatGPT for, and where to go for treatment is the natural next question. We are not going to quote you an industry average we cannot stand behind. We would rather run your own patient prompts on a call and show you what the engines say about your clinic today.",
  },
  {
    q: "Most of our patients come from word of mouth. Does this still matter?",
    a: "Yes, because a recommendation now ends in a search. A friend mentions your clinic, and the patient checks you against two or three alternatives before they book, increasingly by asking an AI rather than Google. If the engines cannot say what you specialise in, who your clinicians are and what patients think of you, the recommendation arrives at a clinic that looks interchangeable with the chain down the road.",
  },
  {
    q: "Will this cause problems with the CQC, GDC, GMC or the ASA?",
    a: "It should not, and we work to make sure it does not. Health marketing in the UK sits under the CAP Code, which the ASA applies to your own website as well as your ads, and under the guidance of whichever regulator your clinicians answer to. Everything we publish is factual and evidence-based, we do not promise outcomes or make comparative claims about other clinics, and nothing goes live without sign-off from you and, where it touches treatment, your clinical lead. Your regulator's rules are your call, not ours, so anything you are unsure about goes past your compliance contact before it publishes rather than after.",
  },
  {
    q: "Can you promote Botox and other prescription-only treatments?",
    a: "Not by name to the public, and nobody should. Prescription-only medicines cannot be advertised to the public in the UK, and the ASA and MHRA actively enforce that against aesthetics clinics. What we can do is make your clinic the one AI names when a patient describes the concern and asks where to go, with content built around the consultation and the clinician rather than the medicine. That is the compliant route, and it is also how patients actually phrase the question.",
  },
  {
    q: "How long does it take to appear in AI answers?",
    a: "The foundations land in the first month. Movement on real patient prompts typically starts showing between month two and month four, depending on how competitive your specialty is and how much authority your site already carries. It is slower than paid and faster than traditional SEO. That is why the programme runs a three month minimum term, six months recommended, and then rolls monthly: AI visibility compounds, and a single month proves nothing either way.",
  },
  {
    q: "Which clinics does this work best for?",
    a: "Specialist clinics tend to beat generalist ones in AI answers. Dental implants and orthodontics, aesthetics, physiotherapy and MSK, private GP and screening, fertility, hearing and eye care. Anywhere a patient describes a treatment and a town, a clinic with clear entity data and clinicians the engines can verify can outrank a national chain. If you offer everything to everyone with no clear focus, that is a positioning problem before it is an AEO problem, and we will say so.",
  },
  {
    q: "Do you work with more than one clinic in the same specialty and region?",
    a: "No. Competing prompts are a zero-sum fight, so we will not take two clinics chasing the same specialty in the same region. One clinic per specialty, per region. A practice holding dental implants in the North West does not block a physio clinic there, but it does block another implant practice. First in holds the slot.",
  },
  {
    q: "How do you prove it is working?",
    a: "Monthly tracking across ChatGPT, Gemini, Perplexity, Copilot and Google AI on your specific prompts, showing whether you were mentioned, where you ranked in the answer, and which sources the model cited. It is the Territory Engine dashboard, and you see the same screen we do.",
  },
  {
    q: "Do you work with care homes?",
    a: "Yes, through DomiCare, our sister brand built specifically for UK care homes and care groups, at domicare.ai. Care is bought very differently from private treatment, usually by a family member under time pressure, so it has its own team and its own approach.",
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

export default function HealthcarePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${site.url}/healthcare`,
    dateModified: UPDATED.toISOString(),
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
      className="min-h-screen overflow-x-clip bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]"
    >
      <JsonLd data={[faqSchema]} />
      <PromptTicker
        prompts={TICKER_PROMPTS}
        storageKey="domi-prompt-ticker-healthcare"
        note="someone is choosing a clinic right now"
      />
      <StickyCta href={site.calendly} line="One clinic per specialty, per region." />
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
            <SectionLabel>AEO for healthcare</SectionLabel>

            <h1 className="mt-3.5 text-balance text-[clamp(1.85rem,7.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[color:var(--color-ink)] sm:mt-5">
              Be the clinic{" "}
              <span className="text-[color:var(--color-ink-3)]">AI recommends</span>
            </h1>

            <p className="mt-3.5 max-w-xl text-pretty text-[15px] leading-relaxed text-[color:var(--color-ink-2)] sm:mt-6 sm:text-[19px]">
              When a patient asks ChatGPT for the best implant dentist in Manchester, one or two
              clinics get named. Right now it isn&apos;t yours. We fix that.
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
                Google Partner
              </span>
            </div>
          </div>

          {/* The demo */}
          <div className="min-w-0 lg:pl-2">
            <AISearchDemo
              query={DEMO_QUERY}
              answerParts={DEMO_ANSWER}
              sources={DEMO_SOURCES}
              results={DEMO_RESULTS}
            />
          </div>
        </div>
      </section>

      {/* ============ 1b · ANSWER-FIRST SUMMARY ============
          The page's one-paragraph answer to "who are you and what do you do",
          straight after the hero so it is the first prose an engine reaches.
          Plain text on purpose: no links or spans inside the paragraph. */}
      <section aria-label="About DomiSearch for healthcare" className="border-t border-black/[0.06]">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-10">
          <p className="max-w-3xl border-l-2 border-[color:var(--color-pine)] pl-4 text-pretty text-[15px] leading-relaxed text-[color:var(--color-ink)] sm:text-[17px]">
            {SUMMARY}
          </p>
          <p className="mt-3 pl-[18px] text-[12px] text-[color:var(--color-ink-3)] sm:text-[13px]">
            Last updated:{" "}
            <time dateTime={UPDATED.toISOString()}>{formatMonthYear(UPDATED)}</time>
          </p>
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
              <div className="mt-0.5 text-[11px] leading-snug text-[color:var(--color-ink-3)] sm:mt-1 sm:text-[12px]">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 3 · THE PROBLEM ===================== */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left column carries the headline and the two figures, so it is not
              a headline sitting over empty space beside six paragraphs. */}
          <div>
            <h2 className="text-balance text-[clamp(1.7rem,4.4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
              Your next patient is asking an AI where to go{" "}
              <span className="text-[color:var(--color-ink-3)]">and you never see the question</span>
            </h2>

            {/* Descriptive, not survey figures: what an AI answer looks like and
                what it leaves in your analytics. The other verticals quote B2B
                buyer research, which does not apply to patients. */}
            <div className="mt-7 grid grid-cols-2 gap-x-4 border-t border-black/[0.08] pt-6 sm:mt-12 sm:gap-x-10 sm:pt-8">
              <div>
                <div className="text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                  2 or 3
                </div>
                <div className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-2)] sm:mt-3 sm:text-[14px]">
                  clinics named in a typical AI answer, not a page of ten
                </div>
              </div>
              <div className="border-l border-black/[0.08] pl-4 sm:pl-10">
                <div className="text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                  Zero
                </div>
                <div className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-2)] sm:mt-3 sm:text-[14px]">
                  trace in your analytics when you are the clinic left out
                </div>
              </div>
            </div>
          </div>

          <div className="text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
            <div className="space-y-4 sm:space-y-5">
              <p>
                By the time a patient books a consultation, the shortlist is already written. The
                research that built it happened in the evenings, on a phone, without you.
              </p>
              <p>
                Word of mouth still fills diaries, and it always will. What it cannot reach is the
                check that happens underneath it, when someone types &ldquo;I have a missing tooth
                and live in Stockport, where should I go for an implant&rdquo; and acts on the two or
                three clinics that come back.
              </p>
              <p>
                No impressions, no click data, nothing in your analytics, and a consultation diary
                that quietly thins out. Meanwhile the national chains and the directories are being
                named in answers you have never seen, to patients who would have stayed with you for
                years.
              </p>
            </div>

            <p className="mt-8 text-[17px] font-semibold leading-snug text-[color:var(--color-ink)] sm:text-[18px]">
              The clinics getting named aren&apos;t always the biggest. They&apos;re the ones an AI
              can read, verify and confidently recommend.
            </p>
          </div>
        </div>

        <div className="mt-7 sm:mt-14">
          <PromptBoard rows={BOARD_ROWS} tabs={BOARD_TABS} />
        </div>

        <div className="hidden sm:block">
          <CtaBlock
            href={site.calendly}
            line="Want to see this run on your prompts instead of ours? We will do it live on the call."
          />
        </div>
      </section>

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
            <CtaBlock
              href={site.calendly}
              line="Thirty minutes to see what the Territory Engine would work on first for your clinic."
            />
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
              Can we work with your clinic?{" "}
              <span className="text-[color:var(--color-ink-3)]">Check the map.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
              We take one clinic per specialty, per region. Pick where you practise and what you
              specialise in, and we will show you what is still open. If your patch is held, we will
              tell you on the first call rather than waste your time.
            </p>
            <div className="mt-7 sm:mt-12">
              <TerritoryMap industries={SPECIALTIES} noun="specialty" />
            </div>

            <CtaBlock
              href={site.calendly}
              line="Your specialty still open? Get on a call before another local clinic takes it."
            />
          </div>
        </section>
      ) : null}

      {/* ===================== 5 · PROOF ===================== */}
      <section id="proof" className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
        <SectionLabel>Proof</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
          We&apos;ve done this outside healthcare{" "}
          <span className="text-[color:var(--color-ink-3)]">and we&apos;ll show you the work</span>
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
          Straight answer: we do not have a healthcare case study to put in front of you yet. The
          method is the same one. Here is what it did for a UK tax platform competing against far
          larger, far older brands.
        </p>

        {/* Featured case study */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] sm:mt-12">
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
              <div>
                <div className="text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                  600+
                </div>
                <div className="mt-2 text-[13px] text-[color:var(--color-paper)]/60">
                  AI mentions a month
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

        {/* Why another sector's result should mean anything to this reader. */}
        <div className="mt-5 grid gap-px overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-black/[0.06] sm:mt-6 sm:grid-cols-3">
          {TRANSFERS.map((c) => (
            <div key={c.h} className="bg-[color:var(--color-paper)] p-5 sm:p-7">
              <p className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[16px]">
                {c.h}
              </p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[15px]">
                {c.b}
              </p>
            </div>
          ))}
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
                    <span className="block text-[12px] text-[color:var(--color-ink-3)]">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>

        <div className="hidden sm:block">
          <CtaBlock
            href={site.calendly}
            line="We will show you where your clinic stands against those numbers, live, on a 30 minute call."
          />
        </div>
      </section>

      {/* ===================== 6 · FOUNDER ===================== */}
      <section id="team" className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6 sm:py-28">
          <SectionLabel>Who you&apos;ll work with</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
            You work with me.{" "}
            <span className="text-[color:var(--color-ink-3)]">Not an account manager.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
            DomiSearch is small and deliberately so. The person who audits your prompts is the person
            who builds the foundations, writes the brief and sits on the monthly call. Nothing gets
            relayed back to you a week late by someone who has never opened your account.
          </p>

          <div className="mt-8 sm:mt-12 sm:flex sm:items-start sm:gap-10">
            {/* Deliberately small. The source headshot is 400px square, so
                anything wider than ~200px is upscaled on a retina screen and
                goes soft. This wrapper is deliberately NOT overflow-hidden: the
                card inside clips the photo for the hover zoom, while the
                signature hangs past the bottom edge. */}
            <div className="relative w-[150px] shrink-0 sm:w-[200px]">
              <div className="group relative overflow-hidden rounded-[1.1rem] border border-black/[0.08] bg-[color:var(--color-ink)] shadow-[0_18px_40px_-24px_rgba(20,17,13,0.5)]">
                <Image
                  src="/brand/founder.png"
                  alt="Ben Martland, Founder of DomiSearch"
                  width={400}
                  height={500}
                  sizes="200px"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{
                    objectPosition: "50% 22%",
                    filter: "saturate(0.88) contrast(1.03) brightness(1.01)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[13%] bg-gradient-to-t from-[color:var(--color-paper-2)]/0 to-transparent"
                />
              </div>
              <Signature
                variant="ben"
                className="absolute right-2 text-[color:var(--color-ink)]/90"
              />
            </div>

            <div className="mt-9 min-w-0 sm:mt-0">
              <p className="text-[16px] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
                Ben Martland
              </p>
              <p className="mt-0.5 text-[13px] text-[color:var(--color-ink-3)]">
                Founder, DomiSearch
              </p>
              <div className="mt-5">
                <ClampedText>
                  £3M+ of managed search spend across service businesses, including three years
                  running search acquisition for Taxd, a UK accountancy and tax firm, in one of the
                  most tightly scrutinised categories there is. Ben builds the visibility engine: the
                  technical foundations, the content that earns citations, and the monthly number that
                  either moved or it did not.
                </ClampedText>
              </div>
            </div>
          </div>

          <p className="mt-12 border-l-2 border-[color:var(--color-pine)] pl-4 text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[19px]">
            If your regulator would not sign it off, we will not publish it.
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
          Inverted to the footer/Taxd palette for a rhythm break, as on the
          other verticals. The cards stay light so they lift off the ground. */}
      <section id="pricing" className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
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
              price is read against the value of one patient. */}
          <div className="mt-10 grid gap-3 rounded-[1.5rem] border border-[color:var(--color-domigreen)]/25 bg-[color:var(--color-domigreen)]/[0.07] p-5 sm:mt-16 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-8">
            <div>
              {/* PLACEHOLDER — £2k to £3k is the commonly quoted UK private
                  price for a single dental implant. Swap for a figure from your
                  own treatment mix if you have one. */}
              <div className="text-[clamp(2rem,5vw,2.9rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                £2k to £3k
              </div>
              <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-paper)]/60">
                One private dental implant
              </div>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-8">
              <p className="text-[16px] leading-relaxed text-[color:var(--color-paper)]/85 sm:text-[17px]">
                And that is one treatment, for one patient, before the check-ups, the hygienist and
                the family they bring with them. In most specialties a handful of extra patients a
                month covers either programme. We will do the maths on your own treatment mix on the
                call.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-paper)]/55">
                Clinics already pay for every click fighting over these patients on Google. AI
                answers reach the same patients, and there is no auction.
              </p>
            </div>
          </div>

          {/* Two cards, side by side from md, entry tier first so it also leads
              on a stacked mobile view. The accent belongs to the entry card. */}
          <div className="mt-10 grid items-stretch gap-6 sm:mt-16 sm:gap-7 md:grid-cols-2">
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
                  <span className="absolute left-8 top-0 inline-flex -translate-y-1/2 items-center rounded-full bg-[color:var(--color-domigreen)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-charcoal)] shadow-[0_6px_18px_-6px_rgba(1,232,144,0.9)] sm:left-10">
                    {prog.label}
                  </span>
                ) : null}

                <h3 className="text-[19px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[21px]">
                  {prog.name}
                </h3>

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

                <Cta href={site.calendly} className="mt-8 w-full" />
              </div>
            ))}
          </div>

          {/* The plumbing, collapsed. Native details/summary so it needs no JS
              and works on touch without a handler. */}
          <details className="group mt-10 overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.04] sm:mt-16 [&_summary::-webkit-details-marker]:hidden">
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
          <div className="mt-10 rounded-[1.5rem] border-2 border-[color:var(--color-domigreen)]/45 bg-[color:var(--color-domigreen)]/[0.09] p-5 text-center sm:mt-16 sm:p-8">
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

          {/* Sits directly under the guarantee because the two are the same
              promise from opposite ends: we back the result, and we will not
              sell the same result to the clinic you are competing with. */}
          <div className="mt-5 flex items-start gap-4 rounded-[1.5rem] border border-white/12 bg-white/[0.04] p-5 sm:mt-6 sm:p-8">
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-domigreen)]/15"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px] text-[color:var(--color-domigreen)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l7.5 3v5.5c0 4.4-3 8.3-7.5 9.5-4.5-1.2-7.5-5.1-7.5-9.5V6z" />
              </svg>
            </span>
            <div>
              <p className="text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-paper)] sm:text-[18px]">
                We will never work with a competitor competing for the same prompts.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-paper)]/60">
                Once your territory is held, that is it: we turn away any clinic chasing the same
                specialty and region, on either programme, for as long as you are with us. Winning
                the answer is zero-sum, and we are not going to sell both sides of it.
              </p>
            </div>
          </div>

          <p className="mt-10 text-[13px] text-[color:var(--color-paper)]/45 sm:mt-16">
            Both programmes are pure AI search, on a 3 month minimum term (6 months recommended) and
            rolling monthly after that. Exclusivity means one clinic per specialty, per region:
            Market Leader simply holds up to three of those slots rather than one. AI visibility
            compounds, so we do not take clients for a single month. Not ready to commit? We will run
            the visibility audit free on a call so you can see where you stand first.
          </p>
        </div>
      </section>

      {/* ===================== 8 · FAQ ===================== */}
      <section className="border-t border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6 sm:py-28">
          <h2 className="text-balance text-center text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[color:var(--color-ink)]">
            Questions clinic owners ask
          </h2>
          <div className="mt-5 sm:mt-10">
            <VerticalFaq items={FAQS} />
          </div>

          <p className="mt-6 text-center text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
            <span className="font-semibold text-[color:var(--color-ink)]">Further reading:</span>{" "}
            <a
              href="/blog/how-local-businesses-get-cited-by-ai"
              className="font-semibold text-[color:var(--color-pine)] underline underline-offset-4"
            >
              how local businesses get cited by AI
            </a>
          </p>

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
            Find out what AI says about your clinic{" "}
            <span className="text-[color:var(--color-ink-3)]">before your competitor does</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[color:var(--color-ink-2)]">
            Thirty minutes. We run your real patient prompts live on the call, no deck, and you see
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
              <a href="/case-studies/taxd" className="hover:text-[color:var(--color-paper)]">
                Case study
              </a>
              <a href="/contact" className="hover:text-[color:var(--color-paper)]">
                Contact
              </a>
            </div>
          </div>
          <p className="mx-auto mt-9 max-w-3xl text-center text-[11px] leading-relaxed text-[color:var(--color-paper)]/40">
            The ChatGPT interface shown on this page is an illustration of how AI answers are
            presented, not a screenshot of a live result. Not endorsed by or affiliated with OpenAI,
            Google, Microsoft or any AI provider. Results shown are based on real client work outside
            healthcare and are not typical or guaranteed. AI visibility outcomes depend on industry,
            competition, existing web presence and execution. DomiSearch is a marketing agency and
            does not provide medical or clinical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
