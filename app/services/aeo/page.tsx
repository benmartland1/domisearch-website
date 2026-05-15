import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Counter } from "@/components/Counter";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { ConsultationRail } from "@/components/ConsultationRail";
import { BookCallCTA } from "@/components/BookCallCTA";
import { Testimonials } from "@/components/Testimonials";
import { AIEnginesBadge } from "@/components/ui/AIEnginesBadge";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { getCaseStudiesByService } from "@/lib/case-studies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "AEO - Become the Brand AI Recommends | DomiSearch",
  description:
    "Get your brand cited in ChatGPT, Gemini, Perplexity, Copilot, Claude and Google AI Overviews. Prompt-level tracking, weekly reports, no jargon.",
  alternates: { canonical: "/services/aeo" },
  openGraph: {
    title: "AEO - Become the Brand AI Recommends · DomiSearch",
    url: "/services/aeo",
  },
};

/* -------------------------------------------------------------------------- */
/*  Copy is grounded in AEO audience VoC research (content/research)          */
/*  - pain points, platform names, numbers, anti-hype tone, measurement.      */
/* -------------------------------------------------------------------------- */

const trafficStats = [
  { stat: "−61%", label: "Organic CTR on AI Overview queries", source: "Dataslayer, 2026" },
  { stat: "60%+", label: "Of searches end without a click", source: "Digital Bloom, 2025" },
  { stat: "70–80%", label: "Organic traffic loss at HubSpot", source: "Digital Bloom, 2025" },
  { stat: "47%", label: "Of B2B buyers start research in ChatGPT", source: "Position Digital, 2026" },
];

// 6 deliverables straight from the DomiSearch AEO package.
const whatWeDo = [
  {
    tag: "Pages",
    title: "Service page optimisation",
    body:
      "Most sites have one vague page listing everything. When a buyer asks ChatGPT about a specific service, there's nothing targeted to cite. We build one dedicated page per service - clear H1, summary, structured body, FAQ - so AI can extract you by name.",
  },
  {
    tag: "Technical",
    title: "Schema implementation",
    body:
      "Invisible code that tells ChatGPT exactly who you are, where you are and what you do. Most sites have none. It's one of the highest-leverage fixes we make - permanent, and it takes effect quickly.",
  },
  {
    tag: "Entity",
    title: "About page & entity clarity",
    body:
      "AI won't recommend what it can't identify. If your About page doesn't clearly state your name, location, who you help and what you specialise in, you're anonymous to ChatGPT. We make it unambiguous - and consistent across every page.",
  },
  {
    tag: "Questions",
    title: "FAQ & buying-question content",
    body:
      "We research 20–30 of the exact questions your buyers ask AI, then build structured Q&A across your pages. If someone asks ChatGPT a question you should be the answer to, your site will actually answer it.",
  },
  {
    tag: "Content",
    title: "AI-citable content",
    body:
      "There's a specific way to write content AI extracts and cites - and most site copy isn't written like that. Two to four pieces a month, engineered to be picked up in AI answers about your sector and location.",
  },
  {
    tag: "Local",
    title: "Google Business Profile optimisation",
    body:
      "Your GBP isn't just for Maps anymore - Google AI pulls from it when someone asks for a recommendation in your area. Wrong categories, empty Q&A, missing services = invisible. We fix the profile and run a monthly post cadence from the same content pipeline.",
  },
];

const measurement = [
  { label: "Prompts tracked / mo", value: "80–150" },
  { label: "Engines covered", value: "6" },
  { label: "Re-runs per prompt", value: "20+" },
  { label: "Sentiment scoring", value: "Per cite" },
];

const engines = [
  { name: "ChatGPT", src: "/engines/chatgpt.png" },
  { name: "Gemini", src: "/engines/gemini.png" },
  { name: "Perplexity", src: "/engines/perplexity.png" },
  { name: "Claude", src: "/engines/claude.png" },
  { name: "Copilot", src: "/engines/copilot.png" },
  { name: "Google AI Overviews", src: "/engines/google.png" },
];

const faqs = [
  {
    question: "Is this just organic search work with a new name?",
    answer:
      "About 70–80% overlaps with classic organic work - clean architecture, helpful content, real authority. The new 20–30% - prompt tracking, llms.txt, citation ops, model-specific content patterns - is where the new leverage sits. We'll tell you exactly what each of your problems actually is.",
  },
  {
    question: "How do you measure success?",
    answer:
      "80–150 prompts tracked weekly across six engines. Reporting covers citation share of voice, sentiment, new placements and AI-referred traffic that converts. Benchmarked against your three closest competitors - not a vanity number.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Early citation movement in 60–90 days. Meaningful share of voice in 3–6 months. If you're running Ads alongside, you'll see wins there inside two weeks.",
  },
  {
    question: "Which platforms do you optimise for?",
    answer:
      "Google Search + AI Overviews, Gemini, ChatGPT, Perplexity, Microsoft Copilot and Claude. We add new engines as they earn real user share.",
  },
  {
    question: "What happens when the LLMs change?",
    answer:
      "They change weekly. Our method focuses on fundamentals that survive every update - entity clarity, structured answers, source coverage, authority. Tactics that depend on gaming a specific model rarely survive the next release.",
  },
  {
    question: "Can I do this myself?",
    answer:
      "Some of it. Schema, FAQ formatting and llms.txt are all DIY-able. The cross-platform prompt tracking, entity graph work, citation ops and measurement stack is where most clients come to us.",
  },
  {
    question: "Do you also manage Google Ads?",
    answer:
      "Yes. Ads + AEO is how most of our clients work with us. Ads captures demand that exists today; AEO captures demand forming inside AI answers. Running both means today's numbers and tomorrow's moat.",
  },
  {
    question: "How does AEO compare to ranking on Google?",
    answer:
      "Ranking aims to put your page on a results list. AEO ensures your brand appears inside the conversational answer - where faster decisions get made. We target citations and share-of-voice, not just clicks.",
  },
  {
    question: "Do you work with any industry?",
    answer:
      "We're strongest in e-commerce, B2B SaaS and professional services. The principles work anywhere buyers search online. If we're not a fit we'll say so in the first call.",
  },
];

export default function AEOPage() {
  const relatedCaseStudies = getCaseStudiesByService("AEO", 2);
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "AI Engine Optimisation (AEO)",
            description:
              "Prompt-level AEO so brands get cited in ChatGPT, Google AI Overviews, Perplexity, Gemini, Copilot and Claude.",
            url: `${site.url}/services/aeo`,
            serviceType: "AI search optimisation",
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Services", url: `${site.url}/services/aeo` },
            { name: "AEO", url: `${site.url}/services/aeo` },
          ]),
        ]}
      />

      {/* -------------------- HERO -------------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div
          aria-hidden
          className="glow"
          style={{ width: 520, height: 520, background: "var(--color-domigreen)", top: -160, left: -120 }}
        />
        <div
          aria-hidden
          className="glow"
          style={{
            width: 480,
            height: 480,
            background: "var(--color-pine)",
            bottom: -220,
            right: -140,
            opacity: 0.45,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal>
            <AIEnginesBadge className="w-[240px]! sm:w-[280px]!" />
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="display mt-10 text-balance text-[clamp(2.5rem,6vw,5rem)]">
              Be the brand
              <br />
              <span className="text-[color:var(--color-domigreen)]">AI recommends.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              Get your brand cited in <strong className="text-[color:var(--color-glacier)]">ChatGPT,
              Gemini, Perplexity, Copilot, Claude and Google AI Overviews</strong>. Tracked weekly.
              Reported without jargon.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Book a call
                <span aria-hidden>→</span>
              </Link>
              <Link href="/blog/how-to-measure-aeo-metrics-that-matter" className="btn btn-ghost">
                How we measure it
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={260}>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
              Google Partner · Shopify Partner · UK-built
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* -------------------- TRAFFIC COLLAPSE STATS -------------------- */}
      <section className="relative mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[color:var(--color-domigreen)]/70" />
            <span className="eyebrow">The zero-click era is already here</span>
          </div>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 border-t border-white/5 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: 61, prefix: "−", suffix: "%", label: "Organic CTR on AI Overview queries", source: "Dataslayer, 2026" },
            { value: 60, suffix: "%+", label: "Of searches end without a click", source: "Digital Bloom, 2025" },
            { value: 80, prefix: "−", suffix: "%", label: "HubSpot's traffic loss", source: "Digital Bloom, 2025" },
            { value: 47, suffix: "%", label: "B2B buyers research in ChatGPT first", source: "Position Digital, 2026" },
          ].map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80}>
              <div>
                <div className="display text-4xl text-[color:var(--color-domigreen)] sm:text-5xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-sm text-[color:var(--color-fog)]/85">{s.label}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fog)]/50">
                  {s.source}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* -------------------- CLIENT PAIN vs DREAM BLOCK -------------------- */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="card relative overflow-hidden p-10 sm:p-14">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-[3px]"
            style={{ background: "linear-gradient(to bottom, var(--color-domigreen), transparent)" }}
          />
          <ScrollReveal delay={60}>
            <h2 className="display text-balance text-3xl sm:text-4xl lg:text-5xl">
              Your buyers ask ChatGPT first.
              <br />
              Right now, the answer isn't you.
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <ScrollReveal delay={120}>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-fog)]/60">
                  The quiet deals you're already losing
                </div>
                <ul className="mt-4 space-y-3 text-[color:var(--color-fog)]/85">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-fog)]/60" />
                    <span>ChatGPT recommends a competitor for a query your brand should own.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-fog)]/60" />
                    <span>Buyers mention your competitor by name before they've ever visited your site.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-fog)]/60" />
                    <span>Your board asks why you're not showing up in AI answers - you don't have an answer either.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                  What it looks like with AEO working
                </div>
                <ul className="mt-4 space-y-3 text-[color:var(--color-fog)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>Buyers arrive pre-sold - already recommended to you by AI before the first call.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>You're cited alongside - or ahead of - the competitors that used to beat you.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>AI-referred visitors convert at 3–4× the rate of classic organic traffic.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <BookCallCTA label="Book a 30-minute AEO call with Ben" />

      {/* -------------------- ENGINES -------------------- */}
      <section className="relative mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="eyebrow">Engines we optimise for</div>
        </ScrollReveal>
        <div className="mt-8 flex flex-wrap gap-3">
          {engines.map((e, i) => (
            <ScrollReveal key={e.name} delay={i * 60}>
              <div
                className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-2 pr-5 transition-colors hover:border-[color:var(--color-domigreen)]/40"
                title={e.name}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
                  <Image
                    src={e.src}
                    alt={e.name}
                    width={32}
                    height={32}
                    sizes="32px"
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="whitespace-nowrap text-sm font-medium text-[color:var(--color-glacier)]">
                  {e.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* -------------------- WHAT WE ACTUALLY DO (with consultation rail) -------------------- */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div>
            <SectionHeader
              eyebrow="The deliverables"
              title="Six disciplines. One retainer."
              description="Every activity we ship each month. Named, scoped, and in the contract."
            />
            <div className="mt-14 grid gap-4">
              {whatWeDo.map((c, i) => (
                <ScrollReveal key={c.title} delay={i * 60}>
                  <SpotlightCard as="article" className="card h-full p-8">
                    <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                      {c.tag}
                    </div>
                    <h3 className="mt-4 text-xl font-[600] text-[color:var(--color-glacier)]">{c.title}</h3>
                    <div className="hairline mt-4" />
                    <p className="mt-4 text-[color:var(--color-fog)]/85">{c.body}</p>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ConsultationRail
            eyebrow="Arrange a call about AEO"
            ctaLabel="Book a 30-min AEO call"
            founderQuote="You'll speak to me - not a sales pod. If AEO isn't right for you I'll say so on the call."
            className="lg:sticky lg:top-28 lg:self-start"
          />
        </div>
      </section>

      {/* -------------------- WHO IT'S FOR -------------------- */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="card grid gap-10 p-10 lg:grid-cols-[1fr_1fr] lg:p-14">
          <ScrollReveal>
            <div className="eyebrow">Who we work best with</div>
            <h2 className="display mt-4 text-3xl sm:text-4xl">
              High-consideration buyers. Category authority at stake.
            </h2>
            <p className="mt-5 text-[color:var(--color-fog)]/85">
              AEO works hardest when buyers research before they buy.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <ul className="space-y-5">
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">B2B SaaS</div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  89% of B2B buyers research with AI before a sales call. Every invisible prompt is a deal already lost.
                </p>
              </li>
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">
                  Professional & financial services
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  Regulated categories reward the brand AI deems trustworthy.
                </p>
              </li>
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">
                  Considered e-commerce
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  DTC, premium and technical categories where buyers compare before checkout.
                </p>
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {relatedCaseStudies.length > 0 && (
        <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
          <SectionHeader
            eyebrow="Proof"
            title="AEO in the wild."
          />
          <div
            className={
              relatedCaseStudies.length === 1
                ? "mt-14"
                : "mt-14 grid gap-6 lg:grid-cols-2"
            }
          >
            {relatedCaseStudies.map((cs, i) => (
              <ScrollReveal key={cs.slug} delay={i * 120}>
                <CaseStudyCard
                  caseStudy={cs}
                  variant={relatedCaseStudies.length === 1 ? "featured" : "default"}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <Testimonials showBookCall />

      <FAQ items={faqs} heading="AEO - frequently asked" />
      <CTA
        heading="See where you rank in ChatGPT today."
        sub="Free prompt-level audit: we run 20 queries your buyers ask AI and show you exactly where you're cited, where your competitors are, and the three highest-leverage fixes in your account."
      />
    </>
  );
}
