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

/**
 * Accountancy vertical landing page. Structurally the twin of /recruitment —
 * same sections, same components, same commercial model — with three
 * deliberate differences:
 *
 *  1. The Taxd work is the centrepiece rather than a supporting proof point.
 *     Taxd competes in the UK tax market against accountancy practices, so it
 *     is the closest thing we have to in-vertical evidence.
 *  2. One founder, not two. The recruitment page pairs Ben with a recruitment
 *     insider; here the insider credential is Ben's own three years in tax.
 *  3. The guarantee is 90 days and payment-linked, not month-four and
 *     work-free.
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
  title: "AI Search Visibility for Accountants · DomiSearch",
  description:
    "Business owners now ask ChatGPT and Gemini which accountant to use. DomiSearch makes your practice the one AI names, for your niches and your towns.",
  alternates: { canonical: "/accountants" },
  openGraph: {
    title: "Be the accountancy firm AI recommends",
    description:
      "When someone asks ChatGPT for an accountant, your competitors get named. We make it your practice instead.",
    url: `${site.url}/accountants`,
    images: [{ url: "/brand/logo.png", width: 1200, height: 630, alt: "DomiSearch" }],
  },
};

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Length of the Taxd engagement, in one place because it appears six times.
 * Three, to match content/case-studies/taxd.mdx (from August 2023) and Eamon's
 * published testimonial. Bump both together when it rolls over.
 */
const TAXD_YEARS = "three";
const TAXD_YEARS_CAP = "Three";

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

/** PLACEHOLDER — invented. Accountancy niches and the regions held in each. */
const NICHES: TerritoryIndustry[] = [
  {
    id: "small-business",
    name: "Small business & owner managed",
    subSectors: {
      "Limited companies": ["north-west", "yorkshire"],
      "Contractors and freelancers": ["north-west", "london"],
      "Startups and early stage": ["london"],
    },
  },
  {
    id: "tax-advisory",
    name: "Tax advisory",
    subSectors: {
      "R&D tax credits": ["north-west", "london", "ireland"],
      "Capital gains and property tax": ["london"],
      "HMRC enquiries and disputes": [],
    },
  },
  {
    id: "property",
    name: "Property & landlords",
    subSectors: {
      "Portfolio landlords": ["north-west", "london"],
      "Property developers": ["yorkshire"],
      "Serviced accommodation": [],
    },
  },
  {
    id: "ecommerce",
    name: "Ecommerce & digital",
    subSectors: {
      "Ecommerce sellers": ["north-west", "california"],
      "Agencies and SaaS": ["london"],
      "Creators and influencers": [],
    },
  },
  {
    id: "professional",
    name: "Medical & professional",
    subSectors: {
      "Dentists and GPs": ["west-midlands"],
      "Solicitors and barristers": [],
      "Locums and consultants": ["north-east"],
    },
  },
  {
    id: "construction",
    name: "Construction & trades",
    subSectors: {
      "CIS and subcontractors": ["north-west", "scotland"],
      "Trades and sole traders": ["yorkshire"],
      "Housebuilders": [],
    },
  },
];

const TERRITORIES_TAKEN = territoriesTaken(NICHES);

const TICKER = [
  "Google Partner & Shopify Partner agency",
  "Be the practice AI recommends",
  `${TAXD_YEARS_CAP} years inside UK accountancy`,
  "Tracking ChatGPT · Gemini · Perplexity · Copilot · Google AI",
  "Manchester based, working UK-wide",
];

/**
 * Every figure here is one we can evidence today.
 * PLACEHOLDER markers flag anything to re-verify before this page goes live.
 */
const STATS = [
  {
    value: "3 yrs",
    label: "Inside UK accountancy",
    note: "Running search for Taxd, a UK accountancy firm",
  },
  { value: "£3M+", label: "Ad spend managed", note: "Across live Google Ads accounts" },
  {
    // PLACEHOLDER — confirm the current Taxd figure before publishing.
    value: "200+",
    label: "AI recommendations a week",
    note: "Taxd, from a standing start",
  },
  { value: "5.0", label: "Trustpilot rating", note: "Verified client reviews" },
];

/* --- The hero demo, in accountancy language ------------------------------- */

const DEMO_QUERY = "best accountant for a limited company in Manchester";

const DEMO_ANSWER: AnswerPart[] = [
  {
    text: "For limited company accounting in Manchester, the firm that comes up most consistently is",
  },
  { text: "Your Practice", brand: true },
  {
    text: ". They handle year end accounts, corporation tax and self assessment for owner managed businesses across the North West, and are repeatedly rated for how quickly they come back to clients.",
  },
];

const DEMO_SOURCES = ["yourpractice.co.uk", "trustpilot.com", "accountingweb.co.uk"];

/** Rows 2 and 3 stay generic on purpose — we are not ranking real rivals. */
const DEMO_RESULTS: ResultRow[] = [
  // Kept short: row 1 also carries the "Cited" chip, so it has the least room.
  { name: "Your Practice", meta: "Limited company · Manchester", you: true },
  { name: "A regional practice", meta: "Small business · North West", you: false },
  { name: "A national online accountant", meta: "Multi-sector · UK-wide", you: false },
];

const TICKER_PROMPTS: TickerPrompt[] = [
  { q: "best accountant for a limited company in Manchester", engine: "ChatGPT" },
  { q: "who can sort my self assessment before the deadline", engine: "Perplexity" },
  { q: "accountant for contractors and freelancers UK", engine: "Gemini" },
  { q: "R&D tax credit specialists near me", engine: "ChatGPT" },
];

const BOARD_TABS = ["All", "Small business", "Tax advisory", "Specialist"];

const BOARD_ROWS: PromptRow[] = [
  {
    prompt: "best accountant for a limited company in Manchester",
    sector: "Small business",
    engine: "ChatGPT",
    named: "2 national online accountants",
  },
  {
    prompt: "who can do my self assessment tax return near me",
    sector: "Small business",
    engine: "Perplexity",
    named: "1 directory, 2 online firms",
  },
  {
    prompt: "best accountant for contractors and freelancers UK",
    sector: "Small business",
    engine: "Gemini",
    named: "3 online accountants",
  },
  {
    prompt: "R&D tax credit specialists UK",
    sector: "Tax advisory",
    engine: "ChatGPT",
    named: "2 large advisory firms",
  },
  {
    prompt: "accountant for capital gains tax on a property sale",
    sector: "Tax advisory",
    engine: "Copilot",
    named: "1 directory, 1 practice",
  },
  {
    prompt: "who can help with an HMRC enquiry",
    sector: "Tax advisory",
    engine: "Google AI",
    named: "2 national firms",
  },
  {
    prompt: "best accountant for landlords with multiple properties",
    sector: "Specialist",
    engine: "ChatGPT",
    named: "2 online firms",
  },
  {
    prompt: "crypto tax accountant UK",
    sector: "Specialist",
    engine: "Perplexity",
    named: "1 national, 1 specialist",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Prompt audit",
    summary: "What every engine answers about your patch today.",
    body: "We map the questions your clients actually type, by service line, by niche and by town, then check what every major AI engine answers today. You see exactly who gets named instead of you.",
  },
  {
    n: "02",
    title: "Entity foundations",
    summary: "The plumbing that decides whether a model can cite you.",
    body: "Schema, llms.txt, consistent entity data across Companies House, your professional body listing, the software advisor directories and Google, plus a site structure AI can parse. This is the plumbing that decides whether a model can cite you at all. Most practice websites fail here.",
  },
  {
    n: "03",
    title: "Citable content",
    summary: "Pages written to be quoted, not ranked.",
    body: "Niche and town pages written to be quoted, not ranked: deadline guidance, allowable expenses, Making Tax Digital, sector specific tax notes. Specific enough that a model reaches for you over a national online accountant.",
  },
  {
    n: "04",
    title: "Tracked monthly",
    summary: "Movement reported every month, engine by engine.",
    body: "The Territory Engine dashboard monitors your prompts across ChatGPT, Gemini, Perplexity, Copilot and Google AI, and reports movement every month. Visibility, share of voice, and which sources the models pulled from. You see the same screen we do.",
  },
];

/**
 * Quotes are verbatim from the live site. Eamon's runs on its own dark band
 * above; these three sit in the carousel. Two of the four are from Taxd, which
 * is the point of this page.
 */
const TESTIMONIALS = [
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
  {
    quote:
      "It's been great to work with DomiSearch. Their level of competence in ads and understanding of wider SEO keeps us coming back month after month!",
    name: "Sam Barraclough",
    role: "CEO, Rooftop Saunas",
    photo: "/testimonials/sam-barraclough.png",
  },
];

/**
 * The Taxd numbers, split by how well we can evidence them.
 *
 * PAID is verified against the account and already published in the case study.
 * AI is the AEO result and still carries a PLACEHOLDER on the headline figure.
 * Keeping the two visibly separate is the whole credibility play: an accountant
 * reading this will spot a blended number immediately, and the honest-limit
 * panel further down depends on the split being real.
 */
const TAXD_PAID = [
  { value: "26 → 607", label: "Monthly conversions", note: "Aug 2023 to Aug 2025" },
  { value: "1.34% → 4.52%", label: "Conversion rate", note: "3.4×, compounded" },
  { value: "−35%", label: "Cost per acquisition", note: "While spend scaled 15×" },
  { value: "1.9K → 8.3K", label: "Monthly clicks", note: "Bought at a lower cost each" },
];

const TAXD_AI = [
  // PLACEHOLDER — re-verify both figures against Searchable before publishing.
  { value: "200+", label: "AI recommendations a week", note: "From a standing start" },
  { value: "2.7×", label: "Daily AI mentions", note: "Within a month of the work landing" },
];

/**
 * Two programmes at one price each, sold on territory rather than deliverable
 * volume. The scarce thing is the exclusivity slot, so it leads both cards.
 *
 * The second tier is not really a bigger version of the first — it is the same
 * engine pointed at three territories instead of one. That is what makes it
 * cheap for us to deliver and what makes it work as an anchor: a buyer reading
 * the entry card now knows someone else could take their other patches.
 */
const PROGRAMMES = [
  {
    name: "AI Search for Accountants",
    /** Reassurance, not a "most popular" badge — the emphasis ring is on tier 2. */
    label: "Most firms start here.",
    price: "£2,995",
    cadence: "per month",
    term: "3 month initial term, then rolling monthly",
    tagline: "One practice per niche, per region.",
    featured: false,
    blocks: [
      {
        heading: "Your first month",
        items: [
          "Full prompt audit, visibility scorecard and 90 day roadmap",
          "Baseline capture and competitor citation benchmark, agreed in writing",
          "Technical foundations: schema, llms.txt and an AI-readable site structure",
          "Entity pass across Companies House, professional body and software advisor directories",
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
      "Covers one exclusive territory (your niche and region). Additional territories agreed on the call.",
  },
  {
    name: "AI Search: Market Leader",
    label: null,
    price: "£5,995",
    cadence: "per month",
    term: "3 month initial term, then rolling monthly",
    tagline: "Up to three niches or regions, held exclusively.",
    featured: true,
    blocks: [
      {
        heading: "Everything in AI Search for Accountants, plus",
        items: [
          "Coverage across up to 3 territories (niches or regions)",
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
      "Organization, WebSite, Service and FAQ to start, then AccountingService, Person, Review and Breadcrumb, maintained monthly.",
  },
  {
    area: "Entity data",
    detail:
      "Consistency pass across your site, Companies House, your professional body listing, the Xero, QuickBooks and FreeAgent advisor directories and Google Business Profile, building into a full niche and location entity architecture.",
  },
  {
    area: "Site structure",
    detail:
      "Service and town pages restructured for extraction, with an internal linking graph mapped to your niche and region.",
  },
  {
    area: "Content",
    detail:
      "10 pieces a month written to be quoted rather than ranked: deadline guidance, allowable expenses, Making Tax Digital, and the tax questions your specific clients ask. 20 a month on Market Leader.",
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

const FAQS: FaqItem[] = [
  {
    q: "What is AEO, and how is it different from SEO?",
    a: "SEO gets you a blue link on a results page. AEO, or Answer Engine Optimisation, gets your practice named inside the answer itself, when someone asks ChatGPT, Gemini or Perplexity which accountant to use. The business owner never sees a list of ten firms; they see one or two recommendations. AEO is the work of becoming one of them.",
  },
  {
    q: "Do business owners really use AI to find an accountant?",
    // SOURCE CHECK — verify the Forrester figures and the two survey stats
    // below before launch. They are stated with attribution, so they need to be
    // right.
    a: "The hard numbers are about B2B buying generally, and someone choosing an accountant is a B2B buyer. Forrester surveyed 18,000 of them and found 94% used AI somewhere in their most recent purchase. More than half now begin their research with an AI chatbot rather than Google, and around a third have bought from a supplier they had never heard of because AI put it in front of them. Rather than quote industry averages at you, we would rather run your own prompts on a call and show you what the engines say about your practice today.",
  },
  {
    q: "Almost all our clients come from referrals. Does this still matter?",
    a: "Yes, because a referral now ends in a search. Someone is given your name, then checks you against two or three alternatives before they call, and increasingly that check happens inside an AI answer rather than on Google. If the engines cannot describe what you specialise in, the referral arrives at a firm that looks interchangeable with an online accountant charging half your fee. The same applies at year end and around the self assessment deadline, when owners who are unhappy with their current accountant go looking.",
  },
  {
    q: "How long before we appear in AI answers?",
    a: "The foundations land in the first month. Movement on real client prompts typically starts showing between month two and month four, depending on how competitive your niche is and how much authority your site already carries. It is slower than paid and faster than traditional SEO. That is why the programme runs a three month initial term and then rolls monthly, and why the guarantee is measured at 90 days: AI visibility compounds, and a single month proves nothing either way.",
  },
  {
    q: "Which practices does this work best for?",
    a: "Specialist practices beat generalist practices in AI answers, consistently. Contractors and freelancers, portfolio landlords, ecommerce sellers, dentists, R&D claims, CIS and construction. Anywhere an owner describes their situation and a town, a specialist practice with clear entity data can outrank a national online accountant. If you take on anyone who walks through the door with no clear focus, that is a positioning problem before it is an AEO problem, and we will say so.",
  },
  {
    q: "Do you work with more than one practice in the same niche and region?",
    a: "No. Competing prompts are a zero-sum fight, so we will not take two practices chasing the same niche in the same region. One practice per niche, per region. A firm holding contractor accounting in the North West does not block a firm doing property tax there, but it does block another contractor specialist. First in holds the slot.",
  },
  {
    q: "Will this create a problem with ICAEW or ACCA advertising rules?",
    a: "It should not, and we work to make sure it does not. Everything we publish is factual, evidence-backed and written in your voice, we do not make comparative claims about other firms, and nothing goes live without your sign-off. Your professional body's rules on advertising are your call, not ours, so if there is anything you are unsure about it goes past your compliance contact before it publishes rather than after.",
  },
  {
    q: "How do you prove it is working?",
    a: "Monthly tracking across ChatGPT, Gemini, Perplexity, Copilot and Google AI on your specific prompts, showing whether you were mentioned, where you ranked in the answer, and which sources the model cited. It is the Territory Engine dashboard, and you see the same screen we do. The baseline is captured and agreed in writing before we start, so the 90 day guarantee is measured against a number we both signed off.",
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

export default function AccountantsPage() {
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
      <PromptTicker
        prompts={TICKER_PROMPTS}
        storageKey="domi-prompt-ticker-accountants"
        note="someone is choosing an accountant right now"
      />
      <StickyCta href={site.calendly} line="One practice per niche, per region." />
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
            <SectionLabel>AEO for accountants</SectionLabel>

            <h1 className="mt-3.5 text-balance text-[clamp(1.85rem,7.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[color:var(--color-ink)] sm:mt-5">
              Be the accountancy firm{" "}
              <span className="text-[color:var(--color-ink-3)]">AI recommends</span>
            </h1>

            <p className="mt-3.5 max-w-xl text-pretty text-[15px] leading-relaxed text-[color:var(--color-ink-2)] sm:mt-6 sm:text-[19px]">
              When someone asks ChatGPT for an accountant, your competitors get named. We fix that.
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
            <AISearchDemo
              query={DEMO_QUERY}
              answerParts={DEMO_ANSWER}
              sources={DEMO_SOURCES}
              results={DEMO_RESULTS}
            />
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
          {/* Left column carries the headline and the two stats, so it is not a
              headline sitting over empty space beside six paragraphs. */}
          <div>
            <h2 className="text-balance text-[clamp(1.7rem,4.4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
              Your next client is asking an AI which accountant to use{" "}
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
                By the time a business owner picks up the phone, the shortlist is already written.
                The research that built it happened weeks earlier, without you.
              </p>
              <p>
                Referrals still open doors, and they always will. What a referral cannot reach is the
                check that happens underneath it, when someone types &ldquo;we run a limited company
                in Salford, which accountant should we use&rdquo; and acts on the two or three firms
                that come back.
              </p>
              <p>
                No impressions, no click data, nothing in your analytics, and an enquiry list that
                quietly stops filling. Meanwhile the online accountants charging £99 a month are
                being named in answers you have never seen, to owners you would have kept for a
                decade.
              </p>
            </div>

            <p className="mt-8 text-[17px] font-semibold leading-snug text-[color:var(--color-ink)] sm:text-[18px]">
              The practices getting named aren&apos;t always the biggest. They&apos;re the ones an AI
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

      {/* ============ 3b · CLIENT QUOTE (dark) ============
          A real, already-published client quote rather than the illustrative
          one on /recruitment. It is from a tax business, which is the point. */}
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
            &ldquo;We have been working with Ben and DomiSearch for nearly 3 years. A true expert in
            his space. Taxd has grown a phenomenal customer base thanks to our fantastic search
            acquisition strategy.&rdquo;
          </blockquote>
          <div className="mt-7 flex items-center justify-center gap-4">
            <Image
              src="/testimonials/eamon-shahir.png"
              alt="Eamon Shahir"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
            <span className="text-left leading-tight">
              <span className="block text-[15px] font-bold text-[color:var(--color-paper)]">
                Eamon Shahir
              </span>
              <span className="block text-[13px] text-[color:var(--color-paper)]/55">
                Co-Founder, Taxd
              </span>
              <span className="block text-[13px] text-[color:var(--color-paper)]/55">
                UK accountancy &amp; tax
              </span>
            </span>
          </div>
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
              line="Thirty minutes to see what the Territory Engine would work on first for your practice."
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
              Can we work with your practice?{" "}
              <span className="text-[color:var(--color-ink-3)]">Check the map.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
              We take one practice per niche, per region. Pick where you work and who you work with,
              and we will show you what is still open. If your patch is held, we will tell you on the
              first call rather than waste your time.
            </p>
            <div className="mt-7 sm:mt-12">
              <TerritoryMap industries={NICHES} noun="niche" />
            </div>

            <CtaBlock
              href={site.calendly}
              line="Your niche still open? Get on a call before another local practice takes it."
            />
          </div>
        </section>
      ) : null}

      {/* ===================== 5 · PROOF =====================
          The heaviest section on the page. /recruitment has to open with "this
          is a new vertical for us"; here it is the opposite, because Taxd is an
          accountancy and tax firm and the longest engagement on the books. */}
      <section id="proof" className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
        <SectionLabel>Proof</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-ink)]">
          {TAXD_YEARS_CAP} years inside UK accountancy{" "}
          <span className="text-[color:var(--color-ink-3)]">and the numbers to show for it</span>
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
          Taxd is a UK accountancy and tax firm. We have run their search acquisition for{" "}
          {TAXD_YEARS} years, which means {TAXD_YEARS} years competing for the exact buyers you
          want, against HMRC, QuickBooks, FreeAgent and every other accountancy firm bidding on the
          same terms.
        </p>

        {/* The line that matters most to an accountant reading this page. */}
        <p className="mt-6 max-w-2xl border-l-2 border-[color:var(--color-pine)] pl-4 text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[19px]">
          Accountancy is not a new vertical we are guessing at. It is the one we have worked in
          longest, and we have three years of numbers to show for it.
        </p>

        {/* Featured case study */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] sm:mt-12">
          <div className="p-6 sm:p-12">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Image
                src="/clients/taxd-white.png"
                alt="Taxd"
                width={500}
                height={184}
                className="h-7 w-auto"
              />
              <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-paper)]/60">
                3 years · ongoing
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-balance text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.03em]">
              From invisible in AI answers to the name ChatGPT gives when someone asks for tax help.
            </p>

            {/* Paid search: verified, published, checkable. */}
            <div className="mt-9 border-t border-white/10 pt-7">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-domigreen)]">
                  Paid search
                </span>
                <span className="text-[13px] text-[color:var(--color-paper)]/50">
                  Verified against the account, Aug 2023 to Aug 2025
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
                {TAXD_PAID.map((m) => (
                  <div key={m.label}>
                    <div className="text-[clamp(1.3rem,2.6vw,1.9rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-paper)]">
                      {m.value}
                    </div>
                    <div className="mt-2 text-[13px] font-semibold tracking-tight text-[color:var(--color-paper)]/85">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-[12px] leading-snug text-[color:var(--color-paper)]/45">
                      {m.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI search: the newer work, kept visibly separate. */}
            <div className="mt-8 border-t border-white/10 pt-7">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-domigreen)]">
                  AI search
                </span>
                <span className="text-[13px] text-[color:var(--color-paper)]/50">
                  The same method, pointed at the engines
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:max-w-lg">
                {TAXD_AI.map((m) => (
                  <div key={m.label}>
                    <div className="text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                      {m.value}
                    </div>
                    <div className="mt-2 text-[13px] font-semibold tracking-tight text-[color:var(--color-paper)]/85">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-[12px] leading-snug text-[color:var(--color-paper)]/45">
                      {m.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">
              <a
                href="/taxd-case-study"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-domigreen)] px-5 py-3 text-[14px] font-bold tracking-tight text-[color:var(--color-charcoal)] transition-transform hover:-translate-y-px"
              >
                Read the full blueprint
                <span aria-hidden>→</span>
              </a>
              <a
                href="/case-studies/taxd"
                className="text-[14px] font-semibold text-[color:var(--color-paper)]/70 underline underline-offset-4 hover:text-[color:var(--color-paper)]"
              >
                Or the paid search case study
              </a>
            </div>
          </div>
        </div>

        {/* Why another firm's result should mean anything to this reader. The
            objection lands immediately, so it is answered immediately. */}
        <div className="mt-5 grid gap-px overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-black/[0.06] sm:mt-6 sm:grid-cols-3">
          {[
            {
              h: "Same buyer",
              b: "A sole trader worrying about their return, a director choosing who files the accounts. We have spent three years learning exactly what they type and when.",
            },
            {
              h: "Same competitors",
              b: "HMRC, QuickBooks, FreeAgent and the online accountants undercutting you on price. We know which signals move that fight because we have been in it.",
            },
            {
              h: "Same season",
              b: "January, the 31 July payment on account, year end. We have run three self assessment deadlines and we plan the content calendar around them.",
            },
          ].map((c) => (
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

        {/* Honest limit. An accountant will look for one, so we name it first
            rather than let them find it. */}
        <p className="mt-5 rounded-[1.25rem] border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.05] px-4 py-3.5 text-[14px] leading-relaxed text-[color:var(--color-ink-2)] sm:mt-6 sm:px-5 sm:py-4">
          <span className="font-bold text-[color:var(--color-ink)]">
            Straight answer on the evidence.
          </span>{" "}
          The paid search numbers above are three years old and verified against the account. The AI
          search numbers are newer, because the engines are newer. Anyone selling you a decade of AEO
          results is selling you something that did not exist. Ask us on the call which figures we
          can show you live, and we will show you those and no others.
        </p>

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
            line="We will show you the same numbers for your practice, live, on a 30 minute call."
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
                {/* Fades the foot of the photo into the section background. The
                    signature crosses this edge, so it needs one ink colour that
                    reads on both halves. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[13%] bg-gradient-to-t from-[color:var(--color-paper-2)]/0 to-transparent"
                />
              </div>
              {/* Bottom-right, hanging past the lower edge, dark ink. Offset
                  with a negative `bottom` rather than a translate utility,
                  because the mark sets its own rotate/skew transform. */}
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
                  {`${TAXD_YEARS_CAP} years running search acquisition for Taxd, a UK accountancy and tax firm, and £3M+ of managed search spend across service businesses. Which means ${TAXD_YEARS} years reading HMRC deadline traffic, watching what owners actually type when they need tax help, and losing and winning against accountancy firms in the same auctions. Ben builds the visibility engine: the technical foundations, the content that earns citations, and the monthly number that either moved or it did not.`}
                </ClampedText>
              </div>
            </div>
          </div>

          <p className="mt-12 border-l-2 border-[color:var(--color-pine)] pl-4 text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[19px]">
            Most agencies pitching your practice have never worked a day in tax. Ask them what
            changes in January.
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
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
            Pricing
          </span>
          <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.65rem,4.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[color:var(--color-paper)]">
            Two programmes. One goal.{" "}
            <span className="text-[color:var(--color-paper)]/55">Your patch held exclusively.</span>
          </h2>

          {/* Buyer maths, promoted out of body copy into a stat block so the
              price is read against the lifetime value of one client. */}
          <div className="mt-8 grid max-w-4xl gap-3 rounded-[1.5rem] border border-[color:var(--color-domigreen)]/25 bg-[color:var(--color-domigreen)]/[0.07] p-5 sm:mt-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-8">
            <div>
              {/* PLACEHOLDER — £1.5k to £3k a year is a typical owner-managed
                  limited company fee, and practices routinely hold those
                  clients for the best part of a decade. Adjust to your book. */}
              <div className="text-[clamp(2rem,5vw,2.9rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-domigreen)]">
                £1.5k to £3k
              </div>
              <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-paper)]/60">
                One limited company client, per year
              </div>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-8">
              <p className="text-[16px] leading-relaxed text-[color:var(--color-paper)]/85 sm:text-[17px]">
                Recurring, and rarely for one year. A practice that keeps a client seven years is
                looking at £10k to £20k of lifetime fees from a single answer going your way.
                Fifteen of them covers the programme twice over.
              </p>
              {/* SOURCE CHECK — verify the CPC range before launch. */}
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-paper)]/55">
                Practices already pay £8 to £20 a click fighting over these buyers on Google. AI
                answers reach the same buyers, and there is no auction.
              </p>
            </div>
          </div>

          {/* Two cards, side by side from md. The higher tier carries the ring:
              its job on this page is to anchor the £2,995 and to make the
              "someone else could hold my other patches" thought unavoidable.
              Swap `featured` in PROGRAMMES to move the emphasis. */}
          <div className="mx-auto mt-6 grid max-w-5xl items-stretch gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {PROGRAMMES.map((prog) => (
              <div
                key={prog.name}
                className={`relative flex h-full flex-col rounded-[1.5rem] bg-white p-5 sm:p-8 ${
                  prog.featured
                    ? "shadow-[0_30px_70px_-30px_rgba(1,232,144,0.35)] ring-2 ring-[color:var(--color-domigreen)]/60"
                    : "ring-1 ring-black/[0.08]"
                }`}
              >
                {prog.label ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-[color:var(--color-pine)]/[0.09] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-pine)]">
                    {prog.label}
                  </span>
                ) : null}

                <h3 className="text-[19px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[21px]">
                  {prog.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-[clamp(2rem,4vw,2.6rem)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-ink)]">
                    {prog.price}
                  </span>
                  <span className="text-[13px] text-[color:var(--color-ink-3)]">
                    {prog.cadence}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] font-semibold text-[color:var(--color-ink-3)]">
                  {prog.term}
                </p>
                <p className="mt-4 text-[16px] font-bold tracking-tight text-[color:var(--color-pine)]">
                  {prog.tagline}
                </p>

                <MobileCollapse label="See what&apos;s included" closeLabel="Hide details">
                  {prog.blocks.map((block, bi) => (
                    <div key={block.heading} className={bi === 0 ? "mt-6" : "mt-7"}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                        {block.heading}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {block.items.map((f) => (
                          <li
                            key={f}
                            className="flex gap-2.5 text-[14px] text-[color:var(--color-ink-2)]"
                          >
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
                    </div>
                  ))}
                  <p className="mt-6 rounded-xl bg-[color:var(--color-pine)]/[0.08] px-3.5 py-3 text-[13px] font-semibold leading-relaxed text-[color:var(--color-pine)]">
                    {prog.territory}
                  </p>
                </MobileCollapse>

                {/* mt-auto so both buttons sit on the same line whatever the
                    lists above do. Same wording on both: every route off this
                    page is the call, never a checkout. */}
                <Cta href={site.calendly} className="mt-7 w-full sm:mt-auto sm:pt-7" />
              </div>
            ))}
          </div>

          {/* The plumbing, collapsed. Native details/summary so it needs no JS
              and works on touch without a handler. */}
          <details className="group mx-auto mt-4 max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.04] sm:mt-5 [&_summary::-webkit-details-marker]:hidden">
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
              page and should not read as small print. The second paragraph is
              not softening — it is what makes the promise enforceable, and an
              accountant will want to see it defined before they believe it. */}
          <div className="mx-auto mt-4 max-w-4xl rounded-[1.5rem] border-2 border-[color:var(--color-domigreen)]/45 bg-[color:var(--color-domigreen)]/[0.09] p-5 text-center sm:mt-6 sm:p-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
              Our guarantee
            </span>
            <p className="mx-auto mt-3 max-w-2xl text-balance text-[clamp(1.15rem,2.6vw,1.6rem)] font-bold leading-snug tracking-tight text-[color:var(--color-paper)]">
              Your AI visibility improves within 90 days, or you don&apos;t pay us again until it
              does.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[color:var(--color-paper)]/60">
              We agree your prompt set in writing and capture the baseline before we start.
              Improvement means being named in more of those answers, across more engines, than you
              were on day one. No argument later about what counted.
            </p>
          </div>

          <p className="mx-auto mt-4 max-w-4xl text-[13px] text-[color:var(--color-paper)]/45 sm:mt-6">
            Both programmes are pure AI search, on a 3 month initial term and rolling monthly after
            that. Exclusivity means one practice per niche, per region: Market Leader simply holds up
            to three of those slots rather than one. AI visibility compounds, so we do not take
            clients for a single month. Not ready to commit? We will run the visibility audit free on
            a call so you can see where you stand first.
          </p>
        </div>
      </section>

      {/* ===================== 8 · FAQ ===================== */}
      <section className="border-t border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6 sm:py-28">
          <h2 className="text-balance text-center text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[color:var(--color-ink)]">
            Questions practice owners ask
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
            Find out what AI says about your practice{" "}
            <span className="text-[color:var(--color-ink-3)]">before your competitor does</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[color:var(--color-ink-2)]">
            Thirty minutes. We run your real client prompts live on the call, no deck, and you see
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
            existing web presence and execution. DomiSearch is a marketing agency and does not
            provide accountancy, tax or regulated financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
