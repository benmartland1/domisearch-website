import type { Metadata } from "next";
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
import { Testimonials } from "@/components/Testimonials";
import { GooglePartnerBadge } from "@/components/ui/GooglePartnerBadge";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { getCaseStudiesByService } from "@/lib/case-studies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Google Ads Management - More Revenue. Less Wasted Spend.",
  description:
    "Senior Google Ads management by a Google Partner managing £3M+ in spend across e-commerce and service-business accounts. Clear numbers, real optimisation, transparent reporting.",
  alternates: { canonical: "/services/google-ads" },
  openGraph: {
    title: "Google Ads Management - DomiSearch",
    url: "/services/google-ads",
  },
};

const pillars = [
  {
    title: "Restructure",
    body: "We rebuild messy accounts from the ground up — clear campaign structure, proper bidding signals, and keywords that match buyer intent. Fewer moving parts. Sharper numbers.",
  },
  {
    title: "Create",
    body: "Ad copy, creative and landing pages tested as one system. If the click is wasted on a weak page, that's what we fix first.",
  },
  {
    title: "Scale",
    body: "Performance Max, Demand Gen, YouTube and Shopping — layered on top of Search only when they earn their place in the mix.",
  },
  {
    title: "Optimise",
    body: "Daily account monitoring supported by AI-assisted tooling, weekly reviews with Ben, monthly strategy calls. Continuous iteration — no set-and-forget.",
  },
];

const metrics = [
  { value: 3, prefix: "£", suffix: "M+", label: "Managed ad spend" },
  { value: 4.1, suffix: "×", decimals: 1, label: "Average ROAS improvement" },
  { value: 23, suffix: "%", label: "Avg CPA reduction in Q1" },
  { value: 14, suffix: " days", label: "Typical time to first wins" },
];

const faqs = [
  {
    question: "What account sizes do you work with?",
    answer:
      "Accounts from £3k/month spend upwards. Below that, we offer audits and strategy sprints rather than full management.",
  },
  {
    question: "Do you work on a contract?",
    answer:
      "We agree an initial 3-month term to give the work time to compound — the first month is usually rebuild, the second is tuning, the third is where performance starts to pull. After that, you're on a 30-day rolling notice.",
  },
  {
    question: "How is your pricing structured?",
    answer:
      "Fixed monthly fees based on scope and spend — never a percentage of spend. Our incentives align with your profit, not your budget.",
  },
  {
    question: "Who actually works on my account?",
    answer:
      "Ben, personally. Every account has a senior Google Ads lead — no junior pool. Monthly strategy calls and quarterly business reviews.",
  },
  {
    question: "Do you handle landing page and CRO work?",
    answer:
      "Yes. Great ads on a weak page is lit money. We audit and rebuild landing pages where the numbers justify it.",
  },
];

export default function GoogleAdsPage() {
  const relatedCaseStudies = getCaseStudiesByService("Google Ads", 2);
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Google Ads Management",
            description:
              "End-to-end Google Ads management for e-commerce, SaaS and service brands — run by a Google Partner managing £3M+ in spend.",
            url: `${site.url}/services/google-ads`,
            serviceType: "Pay-per-click advertising management",
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Services", url: `${site.url}/services/google-ads` },
            { name: "Google Ads", url: `${site.url}/services/google-ads` },
          ]),
        ]}
      />

      {/* -------------------- HERO -------------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div
          aria-hidden
          className="glow"
          style={{ width: 560, height: 560, background: "var(--color-domigreen)", top: -160, right: -120 }}
        />
        <div
          aria-hidden
          className="glow"
          style={{ width: 440, height: 440, background: "var(--color-pine)", bottom: -200, left: -140, opacity: 0.5 }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal>
            <GooglePartnerBadge className="w-[165px]! sm:w-[195px]!" />
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="display mt-10 text-balance text-[clamp(2.5rem,6vw,5rem)]">
              More revenue from Google Ads.
              <br />
              <span className="text-[color:var(--color-domigreen)]">Without wasting budget.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              A Google Partner managing £3M+ in ad spend across e-commerce and service-business
              accounts. Clear numbers, real optimisation, no performance theatre.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Book a call
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Ask a question
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* -------------------- METRICS STRIP -------------------- */}
      <section className="mx-auto mt-10 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-6 border-y border-white/5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 80}>
              <div>
                <div className="display text-4xl text-[color:var(--color-domigreen)] sm:text-5xl">
                  <Counter
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                  />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                  {m.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* -------------------- PILLARS + CONSULTATION RAIL -------------------- */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div>
            <SectionHeader
              eyebrow="What we actually do"
              title="Four pillars. Zero fluff."
              description="Every engagement moves through the same four capabilities. How aggressively we dial each up depends on your account state and growth stage."
            />
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 80}>
                  <SpotlightCard as="article" className="card h-full p-8">
                    <h3 className="text-2xl font-[700] text-[color:var(--color-glacier)]">{p.title}</h3>
                    <div className="hairline mt-4" />
                    <p className="mt-5 text-[color:var(--color-fog)]/85">{p.body}</p>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ConsultationRail
            eyebrow="Arrange a call about Google Ads"
            ctaLabel="Book a free audit"
            founderQuote="You'll speak to me — not a sales pod. If Google Ads isn't the right fit I'll say so on the call."
            className="lg:sticky lg:top-28 lg:self-start"
          />
        </div>
      </section>

      {/* -------------------- WHY COMBINE WITH AEO -------------------- */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="The compounding move"
          title="Paid today. Compounding tomorrow."
          description="Google Ads captures the demand that exists today. Pairing with AEO builds the demand forming inside ChatGPT, Gemini and Perplexity — which means every AEO citation lowers your branded-search CPC over time."
        />
        <ScrollReveal>
          <div className="mt-10">
            <Link
              href="/services/aeo"
              className="inline-flex items-center gap-2 text-[color:var(--color-domigreen)]"
            >
              Explore AEO →
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* -------------------- CASE STUDIES -------------------- */}
      {relatedCaseStudies.length > 0 && (
        <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
          <SectionHeader
            eyebrow="Proof"
            title="What it looks like when it's working."
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

      <FAQ items={faqs} heading="Google Ads — FAQs" />
      <CTA
        heading="Ready to stop wasting ad spend?"
        sub="Book a free audit with Ben. You'll walk away with a short, honest assessment of what's working, what's leaking, and what to do next — whether we work together or not."
      />
    </>
  );
}
