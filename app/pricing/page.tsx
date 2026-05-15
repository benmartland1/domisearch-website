import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PricingTable } from "@/components/PricingTable";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing · DomiSearch",
  description:
    "Transparent monthly retainers for Google Ads, AEO, and combined Search Revenue Ownership engagements. Three-month minimum. No setup fees.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing · DomiSearch",
    description:
      "Monthly retainers from £1,500. Google Ads, AEO, or both under one strategy.",
    url: "/pricing",
  },
};

const faqs = [
  {
    question: "Is there a minimum commitment?",
    answer:
      "Three months. That's how long it takes to restructure, learn your market, and show meaningful uplift. After month three, it's rolling — 30 days' notice either way.",
  },
  {
    question: "What's not included?",
    answer:
      "Ad spend (paid directly to Google), third-party tools you already use (GA4, Looker, Ahrefs, etc.), and paid media outside Google. If a client wants Meta or LinkedIn ads, we partner - we don't pretend to do it ourselves.",
  },
  {
    question: "Do prices scale with ad spend?",
    answer:
      "Yes. The 'from' price covers accounts up to ~£15k/month ad spend. Above that, fees scale with account complexity - typically £3,500–£6,000/month for mid-sized accounts, custom for anything above £50k/month. No percentage-of-spend pricing: it's a conflict of interest.",
  },
  {
    question: "Why bundle Google Ads and AEO?",
    answer:
      "Because search is one behaviour now. Buyers start in ChatGPT or Google, click a paid result, compare in Gemini, search your brand, then convert. Running both channels under one strategy compounds - you capture demand that exists today and engineer the demand forming inside AI answers, with a single reporting view.",
  },
  {
    question: "Can I talk to you before committing?",
    answer:
      "Yes - and most clients do. Book a 30-minute call with Ben and we'll walk through your account, your AI visibility position, and whether we're the right fit. No pressure, no proposal deck.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Pricing", url: `${site.url}/pricing` },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-x-clip">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div
          aria-hidden
          className="glow"
          style={{
            width: 520,
            height: 520,
            background: "var(--color-domigreen)",
            top: -180,
            left: "-10%",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">
            Pricing
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 text-balance text-[clamp(2.5rem,6vw,5rem)]">
              Senior work.{" "}
              <span className="text-[color:var(--color-domigreen)]">
                Plain pricing.
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              Monthly retainers, three-month minimum, no setup fees.
              Published starting rates so you can qualify yourself before
              the call.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing table */}
      <section className="relative mx-auto mt-10 max-w-7xl px-6 pb-6 lg:px-10">
        <PricingTable />
      </section>

      {/* Trust strip under the table */}
      <section className="relative mx-auto mt-6 max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
            <span>3-month minimum</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>No setup fees</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>No % of ad spend</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>Rolling after month 3</span>
          </div>
        </ScrollReveal>
      </section>

      {/* Custom quote nudge */}
      <section className="relative mx-auto mt-32 max-w-4xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-domigreen)]">
              Beyond the ranges
            </div>
            <h2 className="display mt-4 text-balance text-2xl sm:text-3xl">
              Ad spend above £50k/month, multi-region, or AEO-only mandates?
            </h2>
            <p className="mt-5 text-[color:var(--color-fog)]/80">
              We custom-scope any engagement that doesn't fit the standard
              brackets above. Tell us about the account - we'll come back
              within 48 hours with a realistic scope and fee.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
              >
                Book a call
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Ask a question
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <FAQ items={faqs} heading="The practical stuff." />

      <div className="pb-32" />
    </>
  );
}
