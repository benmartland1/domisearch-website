import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PricingTable } from "@/components/PricingTable";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { aeoPricingSentence } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing · DomiSearch",
  description:
    "AI search visibility programme pricing: £2,995 a month on a 3-month minimum, or £7,500 for the first 3 months paid upfront. No setup fees. Google Ads is scoped separately.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing · DomiSearch",
    description:
      "One AI search programme, two ways to pay. £2,995 a month or £7,500 for the first three months upfront.",
    url: "/pricing",
  },
};

const faqs = [
  {
    question: "What does the programme cost?",
    answer: aeoPricingSentence,
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "Three months, and we recommend six. The first 90 days is a defined delivery period: baseline, audit, technical foundations, service-page work and the agreed content, with daily tracking throughout. After the minimum term it is rolling monthly, with 30 days' notice either way.",
  },
  {
    question: "What is not included?",
    answer:
      "Ad spend of any kind, third-party tools you already pay for, and any outreach, original research or paid placements. If any of those are relevant to your plan, they are scoped and priced separately so nothing is implied that is not in the proposal.",
  },
  {
    question: "What does the price cover?",
    answer:
      "One business, its agreed services and the markets we research and track for it. A group of companies, or a second territory with its own buyer questions and competitors, is agreed on the call.",
  },
  {
    question: "Do you publish Google Ads pricing?",
    answer:
      "No. Google Ads management is a secondary service for existing clients and suitable inbound enquiries, and the fee depends on the account. If you want to talk about it, book a call and we will scope it with you.",
  },
  {
    question: "Can we talk to you before committing?",
    answer:
      "Yes, and everyone does. The first step is a free discovery call. If there is a fit, we research your current AI visibility and walk you through an audit and a proposed 90-day roadmap before you decide anything.",
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
              One programme.{" "}
              <span className="text-[color:var(--color-domigreen)]">
                Plain pricing.
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              The AI search visibility programme, priced in full so you can qualify
              yourself before the call. Pay monthly, or pay the first three months
              upfront and save. No setup fees.
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
            <span>3-month minimum, 6 recommended</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>No setup fees</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>Daily tracking, monthly review</span>
            <span className="hidden h-1 w-1 rounded-full bg-[color:var(--color-fog)]/30 sm:block" />
            <span>Rolling after the minimum term</span>
          </div>
        </ScrollReveal>
      </section>

      {/* Custom quote nudge */}
      <section className="relative mx-auto mt-32 max-w-4xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-domigreen)]">
              Outside the standard programme
            </div>
            <h2 className="display mt-4 text-balance text-2xl sm:text-3xl">
              A group of businesses, several territories, or Google Ads as well?
            </h2>
            <p className="mt-5 text-[color:var(--color-fog)]/80">
              We scope those on a call rather than publishing a figure that would be
              wrong for half the people reading it. Tell us about the business and we
              will come back within two working days with a realistic scope and fee.
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

      <FAQ items={faqs} heading="The practical questions." />

      <div className="pb-32" />
    </>
  );
}
