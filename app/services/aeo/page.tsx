import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SiteNav } from "@/components/SiteNav";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { Ticker } from "@/components/home/Ticker";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { aeoPricingSentence } from "@/lib/pricing";
import { getTrustpilotReviewCount, trustpilotReviews } from "@/lib/trustpilot";

/*
 * The AEO service page, built in the homepage's design: the same ticker, nav,
 * footer, page class (.ds-site.ds-home .ds-page) and section components, so
 * type, spacing and colour come from components/home/approved.css. It is a
 * bare route in components/LayoutChrome.tsx for that reason.
 *
 * Copy is grounded in AEO audience VoC research (content/research).
 */

export const viewport: Viewport = {
  themeColor: "#f8f7f1",
  width: "device-width",
  initialScale: 1,
};

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

const STATS = [
  { value: "−61%", label: "Organic CTR on AI Overview queries", source: "Dataslayer, 2026" },
  { value: "60%+", label: "Of searches end without a click", source: "Digital Bloom, 2025" },
  { value: "−80%", label: "HubSpot’s traffic loss", source: "Digital Bloom, 2025" },
  { value: "47%", label: "B2B buyers research in ChatGPT first", source: "Position Digital, 2026" },
];

const ENGINES = [
  { name: "ChatGPT", icon: "/engines/openai.svg" },
  { name: "Gemini", icon: "/engines/gemini.svg" },
  { name: "Perplexity", icon: "/engines/perplexity.svg" },
  { name: "Claude", icon: "/engines/claude.svg" },
  { name: "Google AI\nOverviews", icon: "/engines/google.svg" },
];

const LOSING = [
  "ChatGPT recommends a competitor for a query your brand should own.",
  "Buyers mention your competitor by name before they’ve ever visited your site.",
  "Your board asks why you’re not showing up in AI answers, and you don’t have an answer either.",
];

const WORKING = [
  "Buyers arrive having already seen your name in the answer, before the first call.",
  "Your services, markets and evidence are described accurately, alongside the competitors you are measured against.",
  "You can see, month by month, how often you are named and which sources the answers rely on.",
];

// The six deliverables of the programme as it is sold today. Keep in step with
// components/ProgrammeSection.tsx and the "What does an AEO agency do?" post.
const WHAT_WE_DO = [
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
    title: "Daily tracking, change reviews and monthly reporting",
    body:
      "We track the agreed questions daily. When content goes live or a technical fix is completed, we record the date in Domi Studio, our own software, and review what happened to visibility on the questions that work targeted, comparing the weeks before with the weeks after. Those reviews guide what we deliver next. Each month you get a report and strategy call covering how often you are named, which sources are cited, how you compare with tracked competitors, how AI describes you, the work completed, what we observed and the next priorities. Where tracking allows, we also review AI referral traffic and relevant enquiries.",
  },
];

const SECTORS = [
  {
    label: "Recruitment agencies",
    note: "Hiring managers now ask AI which agencies specialise in their sector and region. Our core focus.",
    href: "/recruitment",
  },
  {
    label: "Accountancy and professional services",
    note: "Considered, often regulated decisions where clear evidence and specialisms matter.",
    href: "/accountants",
  },
  {
    label: "Healthcare and clinics",
    note: "Patients research treatments and providers in AI before they book.",
    href: "/healthcare",
  },
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
      "At three levels. Daily, we track the same agreed questions across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. After each significant change, such as a new piece of content or a technical fix, we record the live date in Domi Studio, our own software, and review subsequent visibility on the questions it targeted against the weeks before. Monthly, you get a report and strategy call covering how often you are named, which sources the answers cite, your share of voice against tracked competitors, how AI describes you, the work completed and what we observed. The benefit is clearer priorities, visibility into the work done and decisions informed by observed results rather than assumptions. The figures describe the tracked set of questions and platforms, not every AI conversation.",
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
      "Some of it, yes. Clear service pages, FAQs and structured data are all within reach of a capable in-house team. The research, the daily cross-platform tracking, the review of each change against what happened next and the discipline of acting on that evidence is where most clients want help, and we will tell you on the discovery call if we think you do not need us.",
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

/** Axiforma draws "·" as a full stop, so separators use a fallback face. */
function Dotted({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={p}>
          {i > 0 && <span className="ds-result-sep"> · </span>}
          {p}
        </Fragment>
      ))}
    </>
  );
}

function Arrow() {
  return (
    <span className="ds-arrow" aria-hidden="true">
      <ArrowUpRight />
    </span>
  );
}

export default async function AEOPage() {
  const reviewCount = await getTrustpilotReviewCount();
  const reviews = trustpilotReviews;
  const programme = [WHAT_WE_DO.slice(0, 3), WHAT_WE_DO.slice(3)];

  return (
    <div className="ds-site ds-home ds-aeo" data-surface="paper">
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

      <div className="ds-page">
        <Ticker />
        <SiteNav />
      </div>

      <main className="ds-page">
        {/* ===== Hero ===== */}
        <section className="ds-wrap ds-aeo-hero" aria-label="AI search visibility">
          <div className="ds-aeo-hero-copy">
            <span className="ds-eyebrow">AI search visibility (AEO)</span>
            <h1>
              Be the firm <br />
              AI <span className="ds-underlined">recommends.</span>
            </h1>
            <p className="ds-lead">
              We help service businesses get discovered, mentioned and cited across ChatGPT, Gemini,
              Perplexity, Claude and Google AI Overviews. Research-led, tracked daily, reported monthly
              in plain English.
            </p>
            <div className="ds-actions">
              <a className="ds-button" href={site.calendly} target="_blank" rel="noopener noreferrer">
                Book a call <Arrow />
              </a>
              <a className="ds-text-link" href="/pricing">
                See pricing{" "}
                <span className="ds-icon" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>
            <p className="ds-hero-note">
              <Dotted parts={["UK-built", "For service businesses"]} />
            </p>
          </div>

          <aside className="ds-aeo-stats" aria-label="The zero-click era is already here">
            <span className="ds-eyebrow">The zero-click era is already here</span>
            <dl>
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                  <dd className="ds-aeo-stat-source">{s.source}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <div className="ds-wrap">
          <div className="ds-engine-strip">
            <span>Platforms we track daily</span>
            <div className="ds-engines">
              {ENGINES.map((e) => (
                // Every tracked platform stays visible here, including on mobile.
                <span key={e.name} className="ds-engine">
                  <Image src={e.icon} alt="" width={23} height={23} />
                  {e.name.includes("\n") ? (
                    <>
                      {e.name.split("\n")[0]}
                      <br />
                      {e.name.split("\n")[1]}
                    </>
                  ) : (
                    e.name
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== The problem and the outcome ===== */}
        <section className="ds-section ds-wrap ds-aeo-shift" aria-labelledby="aeo-shift">
          <span className="ds-eyebrow">Why it matters</span>
          <h2 id="aeo-shift">
            Your buyers ask ChatGPT first. <br />
            Right now, the answer isn’t you.
          </h2>
          <div className="ds-aeo-compare">
            <div>
              <h3>The quiet deals you’re already losing</h3>
              <ul className="ds-aeo-list ds-aeo-list-muted">
                {LOSING.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>What it looks like with AEO working</h3>
              <ul className="ds-aeo-list">
                {WORKING.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== The programme ===== */}
        <section className="ds-plan ds-wrap" id="programme">
          <div className="ds-plan-header">
            <div>
              <span className="ds-eyebrow">The programme</span>
              <h2>We don’t guess. We reverse engineer.</h2>
            </div>
            <p className="ds-lead">
              We examine which brands and sources appear in the AI answers your potential clients read,
              then use that evidence to guide six areas of work. Each is named, scoped and agreed before
              we start.
            </p>
          </div>
          {programme.map((row, r) => (
            <div key={r} className={`ds-timeline${r > 0 ? " ds-aeo-timeline-next" : ""}`}>
              {row.map((c) => (
                <article key={c.title} className="ds-month">
                  <span className="ds-eyebrow">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
          ))}
          <div className="ds-plan-bottom">
            <p>
              “You’ll speak to me, not a sales pod. If AI search isn’t the right priority for you yet,
              I’ll say so on the call.” Ben Martland, Founder
            </p>
            <a className="ds-button" href={site.calendly} target="_blank" rel="noopener noreferrer">
              Book a 30-min AEO call <Arrow />
            </a>
          </div>
        </section>

        {/* ===== Who we work with ===== */}
        <section className="ds-sector ds-section ds-wrap">
          <div>
            <span className="ds-eyebrow">Who we work best with</span>
            <h2>Service businesses whose clients research before they buy.</h2>
            <p className="ds-lead">
              The work pays off where a buyer compares providers before making contact, and where your
              expertise and track record give an AI answer something real to cite.
            </p>
          </div>
          <div className="ds-sector-list">
            {SECTORS.map((s) => (
              <a key={s.label} href={s.href}>
                <span>
                  {s.label}
                  <small>{s.note}</small>
                </span>
                <Arrow />
              </a>
            ))}
          </div>
        </section>

        {/* ===== Reviews: every Trustpilot review, in full ===== */}
        <section className="ds-reviews ds-section ds-wrap" aria-labelledby="reviews-heading">
          <div className="ds-voices-header">
            <div>
              <span className="ds-eyebrow">In our clients’ words</span>
              <h2 id="reviews-heading">
                Don’t just take <br />
                our word for it.
              </h2>
            </div>
            <a className="ds-review-source" href={site.trustpilot} target="_blank" rel="noopener noreferrer">
              <strong>
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </strong>
              <span>
                Read them on Trustpilot <ArrowUpRight />
              </span>
            </a>
          </div>
          <ReviewsCarousel reviews={reviews} />
        </section>

        {/* ===== FAQ ===== */}
        <section className="ds-faq ds-section ds-wrap">
          <div className="ds-faq-intro">
            <span className="ds-eyebrow">Before we talk</span>
            <h2>AI search visibility, frequently asked.</h2>
            <p>What the work involves, how we measure it and what you can expect.</p>
          </div>
          <div className="ds-faq-list">
            {faqs.map((f, i) => (
              <details key={f.question} open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <CTA
          heading="Find out where you stand in AI search."
          sub="Book a free discovery call. If there is a fit, we research your current AI visibility and walk you through an audit and a proposed 90-day roadmap: the buyer questions, who is being recommended today, the gaps and the work we would do first."
        />
      </main>
      <Footer />
    </div>
  );
}
