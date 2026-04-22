import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ScorecardTool } from "@/components/ScorecardTool";
import { SpotlightCard } from "@/components/SpotlightCard";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Audit - AI Visibility + Google Ads · DomiSearch",
  description:
    "Run an instant AI visibility check on your brand, then get the full 48-hour audit: the top 20 prompts your buyers ask AI, how often you're cited, and the three highest-leverage next moves - reviewed by Ben personally.",
  alternates: { canonical: "/scorecard" },
  openGraph: {
    title: "Free Audit - DomiSearch",
    description:
      "A 48-hour AI visibility audit - free, delivered by the founder. See where you're cited across ChatGPT, Perplexity, Gemini, Copilot and Google AI Overviews.",
    url: "/scorecard",
  },
};

const deliverables = [
  {
    tag: "01 · Audit",
    title: "20-prompt AI visibility audit",
    body:
      "The 20 prompts your buyers actually ask, run against ChatGPT, Perplexity, Gemini, Copilot and Google AI Overviews. We log every answer verbatim and flag whether you were named, linked, or invisible.",
  },
  {
    tag: "02 · Benchmark",
    title: "Share of voice vs. your three competitors",
    body:
      "We run the same prompts for your top three competitors and score the gap - citation rate, sentiment, and which engines favour which brand. You'll know exactly who's winning which prompt and why.",
  },
  {
    tag: "03 · Moves",
    title: "Three highest-leverage next moves",
    body:
      "The three things you should do next - ranked by impact, realistically doable in the next 30 days, with effort estimates. Whether you work with us or not.",
  },
];

const qualification = {
  fitFor: [
    "You've started researching AEO and want a real baseline before a decision.",
    "Your buyers use ChatGPT, Perplexity or Google AI Overviews before they reach you.",
    "You run B2B SaaS, considered-purchase e-commerce, or professional services.",
  ],
  notFor: [
    "Pre-revenue startups looking for free advice to self-implement forever.",
    "Industries we won't work in - adult, gambling, get-rich-quick, crypto pump coins.",
    "Teams who want a chatbot-generated PDF over a human review.",
  ],
};

export default function ScorecardPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "The AI Visibility audit",
            description:
              "A free 48-hour AI visibility audit: the 20 prompts your buyers ask ChatGPT, Perplexity, Gemini, Copilot and Google AI Overviews, benchmarked against three competitors, delivered by the DomiSearch founder.",
            url: `${site.url}/scorecard`,
            serviceType: "Free AEO audit",
          }),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "audit", url: `${site.url}/scorecard` },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div
          aria-hidden
          className="glow"
          style={{ width: 520, height: 520, background: "var(--color-domigreen)", top: -160, left: -120 }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">
            Free diagnostic · 48 hours
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 text-balance text-[clamp(2.5rem,6vw,5.5rem)]">
              Your free
              <br />
              <span className="text-[color:var(--color-domigreen)]">visibility audit.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              The 20 prompts your buyers ask AI, run across ChatGPT, Perplexity, Gemini, Copilot and
              Google AI Overviews - benchmarked against three competitors and reviewed by Ben
              personally in 48 hours. Not a PDF template, not a chatbot. A real audit, for free,
              because the best way to prove we're useful is to be useful first.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Instant AI Visibility Check */}
      <section className="relative mx-auto mt-8 max-w-7xl px-6 lg:px-10">
        <ScorecardTool />
      </section>

      {/* What's inside */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="What you get"
          title="Three things. Forty-eight hours."
          description="We don't start audits we can't finish. Each one is bounded, focused and ships real recommendations."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {deliverables.map((d, i) => (
            <ScrollReveal key={d.title} delay={i * 100}>
              <SpotlightCard as="article" className="card h-full p-8">
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                  {d.tag}
                </div>
                <h3 className="mt-4 text-xl font-[600] text-[color:var(--color-glacier)]">
                  {d.title}
                </h3>
                <div className="hairline mt-4" />
                <p className="mt-4 text-[color:var(--color-fog)]/85">{d.body}</p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Qualification */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="card h-full p-10">
              <div className="eyebrow">Good fit if</div>
              <ul className="mt-6 space-y-4 text-[color:var(--color-fog)]/85">
                {qualification.fitFor.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="card h-full p-10">
              <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-fog)]/60">
                Not for
              </div>
              <ul className="mt-6 space-y-4 text-[color:var(--color-fog)]/80">
                {qualification.notFor.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-fog)]/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why free */}
      <section className="relative mx-auto mt-32 max-w-4xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
            Why free?
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h2 className="display mt-5 text-balance text-3xl sm:text-4xl lg:text-5xl">
            Most agencies sell you a proposal. We'd rather show up with the work.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={140}>
          <p className="mt-6 text-lg text-[color:var(--color-fog)]/85">
            The best sales pitch we know is a genuinely useful audit. If we can't find three
            things worth doing in your account, we probably weren't the right agency anyway. If
            we can, you'll know within 48 hours - and you can ship the fixes with us or without
            us. Either is a good outcome.
          </p>
          <p className="mt-4 text-[color:var(--color-fog)]/75">
            We cap audits at 4 per week. When slots are full, we say so - rather than take on
            work we can't finish to the standard that makes the audit useful in the first place.
          </p>
        </ScrollReveal>
      </section>

      <div className="pb-32" />
    </>
  );
}
