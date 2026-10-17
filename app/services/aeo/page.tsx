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
import { aeoPricingSentence } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AI Search Visibility (AEO) for Service Businesses | DomiSearch",
  description:
    "Research-led AEO for service businesses: a visibility baseline, buyer-question research, technical foundations, service pages, content and daily tracking across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews.",
  alternates: { canonical: "/services/aeo" },
  openGraph: {
    title: "AI Search Visibility (AEO) for Service Businesses · DomiSearch",
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

// The six deliverables of the programme as it is sold today. Keep in step with
// components/ProgrammeSection.tsx and the "What does an AEO agency do?" post.
const whatWeDo = [
  {
    tag: "Baseline",
    title: "AI visibility and competitor baseline",
    body:
      "During onboarding we agree the buyer questions to track and record where you, your competitors and the cited sources appear today across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. We include questions that do not name you, so we can measure discovery as well as how you are described. If visibility has never been tracked, the starting point is unknown until measured, not zero.",
  },
  {
    tag: "Research",
    title: "Buyer-question and cited-source research",
    body:
      "We research the questions your potential clients ask before choosing a provider, in the words they use, and which websites the AI answers reference. That evidence decides the priorities for the website, content and credibility work.",
  },
  {
    tag: "Technical",
    title: "Technical foundations and structured data",
    body:
      "We audit access, indexing, page structure and business information, then agree the fixes. Structured data is implemented where it is appropriate and matches the visible content. It is one part of the work, not a shortcut: Google says no special markup is required for its AI features.",
  },
  {
    tag: "Pages",
    title: "Service-page improvements",
    body:
      "A potential client, or an AI answer, should be able to understand who you help, where you operate, the services you cover and the evidence behind your claims. We improve priority service and sector pages so that is unambiguous, and review the enquiry journey so the next step is easy.",
  },
  {
    tag: "Content",
    title: "Content that answers buyer questions",
    body:
      "Our standard 90-day programme includes 36 new or refreshed content pieces, with the mix agreed after the audit. Guides, service explanations, specialist market content and case studies built on evidence you can share. Your team supplies the expertise and approves everything before publication.",
  },
  {
    tag: "Tracking",
    title: "Daily tracking and monthly review",
    body:
      "We track the agreed questions daily and review progress in a monthly report and strategy call: how often you are named, which sources are cited, how you compare with tracked competitors and how AI describes you. Where tracking allows, we also review AI referral traffic and relevant enquiries.",
  },
];

const engines = [
  { name: "ChatGPT", src: "/engines/chatgpt.png" },
  { name: "Gemini", src: "/engines/gemini.png" },
  { name: "Perplexity", src: "/engines/perplexity.png" },
  { name: "Claude", src: "/engines/claude.png" },
  { name: "Google AI Overviews", src: "/engines/google.png" },
];

const faqs = [
  {
    question: "Is this just SEO with a new name?",
    answer:
      "There is real overlap: accessible pages, clear business information and useful content matter for both, and Google says its established guidance still applies to its AI features. What is different is the research and measurement: tracking the questions buyers ask AI, seeing which brands and sources appear in the answers, and using that evidence to decide the work. If you have an SEO provider, we agree responsibilities with them rather than duplicating effort.",
  },
  {
    question: "How do you measure progress?",
    answer:
      "Against the baseline, on the same agreed questions, tracked daily across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. The monthly report covers how often you are named, which sources the answers cite, your share of voice against tracked competitors and how AI describes you, alongside the work completed. The figures describe the tracked set of questions and platforms, not every AI conversation.",
  },
  {
    question: "How quickly might we see results?",
    answer:
      "We cannot promise a date for a particular AI recommendation, and we would be wary of anyone who does. The standard initial programme runs for 90 days, which gives a defined period to deliver the agreed work, track changes against the baseline and review what the evidence shows. Your starting position, competition, website condition and the pace of approvals all affect how quickly visibility moves.",
  },
  {
    question: "Which AI platforms do you track?",
    answer:
      "ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. We add platforms as they earn real usage among the buyers our clients care about.",
  },
  {
    question: "What happens when the AI platforms change?",
    answer:
      "They change often, which is why the work is built on fundamentals: clear business information, pages that answer real buyer questions, evidence of your track record and presence in the sources AI already cites. Daily tracking means we see changes as they happen and can adjust the priorities rather than guess.",
  },
  {
    question: "Can we do this ourselves?",
    answer:
      "Some of it, yes. Clear service pages, FAQs and structured data are all within reach of a capable in-house team. The research, the daily cross-platform tracking and the discipline of acting on the evidence each month is where most clients want help, and we will tell you on the discovery call if we think you do not need us.",
  },
  {
    question: "Do you also manage Google Ads?",
    answer:
      "Yes, for a smaller number of clients. It is a separate service with its own objectives, not a default part of the AI search programme. If paid search is relevant to your plan we will say so, and the two pieces of work are coordinated rather than bundled.",
  },
  {
    question: "How is this different from ranking on Google?",
    answer:
      "Ranking puts a page on a results list. AI search visibility is about whether your business is named, and how it is described, inside the answer a buyer reads. A brand mention and a source citation are different things: an answer can name you while citing a third-party page, so we track and report both.",
  },
  {
    question: "What does it cost?",
    answer: `${aeoPricingSentence} Pricing covers one business and its agreed services and markets; additional territories are agreed on the call. Full details are on the pricing page.`,
  },
  {
    question: "Which businesses do you work with?",
    answer:
      "Service businesses whose clients research before they buy. Recruitment agencies are a core focus, and we also work with accountancy practices, healthcare providers and other professional services. If we are not a fit we will say so on the first call.",
  },
];

export default function AEOPage() {
  const relatedCaseStudies = getCaseStudiesByService("AEO", 2);
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "AI Search Visibility (Answer Engine Optimisation)",
            description:
              "Research-led AEO for service businesses: visibility baseline, buyer-question research, technical foundations, service-page improvements, content and daily tracking across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews.",
            url: `${site.url}/services/aeo`,
            serviceType: "AI search optimisation",
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Services", url: `${site.url}/services/aeo` },
            { name: "AI Search Visibility", url: `${site.url}/services/aeo` },
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
              We help service businesses get discovered, mentioned and cited across{" "}
              <strong className="text-[color:var(--color-glacier)]">
                ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews
              </strong>
              . Research-led, tracked daily, reported monthly in plain English.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Book a call
                <span aria-hidden>→</span>
              </Link>
              <Link href="/pricing" className="btn btn-ghost">
                See pricing
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={260}>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
              UK-built · For service businesses · Recruitment a core focus
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
                    <span>Buyers arrive having already seen your name in the answer, before the first call.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>Your services, markets and evidence are described accurately, alongside the competitors you are measured against.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>You can see, month by month, how often you are named and which sources the answers rely on.</span>
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
          <div className="eyebrow">Platforms we track daily</div>
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
              eyebrow="The programme"
              title="We don't guess. We reverse engineer."
              description="We examine which brands and sources appear in the AI answers your potential clients read, then use that evidence to guide six areas of work. Each is named, scoped and agreed before we start."
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
            founderQuote="You'll speak to me, not a sales pod. If AI search isn't the right priority for you yet, I'll say so on the call."
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
              Service businesses whose clients research before they buy.
            </h2>
            <p className="mt-5 text-[color:var(--color-fog)]/85">
              The work pays off where a buyer compares providers before making contact, and where
              your expertise and track record give an AI answer something real to cite.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <ul className="space-y-5">
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">
                  <Link href="/recruitment" className="hover:text-[color:var(--color-domigreen)]">Recruitment agencies</Link>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  Hiring managers now ask AI which agencies specialise in their sector and region. Our core focus.
                </p>
              </li>
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">
                  <Link href="/accountants" className="hover:text-[color:var(--color-domigreen)]">Accountancy and professional services</Link>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  Considered, often regulated decisions where clear evidence and specialisms matter.
                </p>
              </li>
              <li>
                <div className="text-lg font-[600] text-[color:var(--color-glacier)]">
                  <Link href="/healthcare" className="hover:text-[color:var(--color-domigreen)]">Healthcare and clinics</Link>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fog)]/80">
                  Patients research treatments and providers in AI before they book.
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
            title="AI search work for a client."
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

      <Testimonials showBookCall only={["Eamon Shahir", "Arjun Kumar", "Sam Barraclough"]} />

      <FAQ items={faqs} heading="AI search visibility, frequently asked" />
      <CTA
        heading="Find out where you stand in AI search."
        sub="Book a free discovery call. If there is a fit, we research your current AI visibility and walk you through an audit and a proposed 90-day roadmap: the buyer questions, who is being recommended today, the gaps and the work we would do first."
        secondary={{ label: "Request a visibility check", href: "/#visibility-check" }}
      />
    </>
  );
}
