import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { FounderSection } from "@/components/FounderSection";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { PricingTable } from "@/components/PricingTable";
import { SectionHeader } from "@/components/SectionHeader";
import { FAQ } from "@/components/FAQ";
import {
  organizationSchema,
  professionalServiceSchema,
  faqSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Google Ads & AEO Agency | DomiSearch - Manchester",
  description:
    "Google Ads + AI Engine Optimisation (AEO). DomiSearch is the Google Partner and Shopify Partner agency helping brands win across Google, ChatGPT, Gemini and Perplexity.",
  alternates: { canonical: "/" },
};

const homeFaqs = [
  {
    question: "What is AI Engine Optimisation (AEO)?",
    answer:
      "AEO is the practice of optimising your brand's content and technical setup so AI assistants like ChatGPT, Gemini, and Perplexity extract, cite, and recommend your brand in their responses.",
  },
  {
    question: "What does DomiSearch do?",
    answer:
      "DomiSearch is a Manchester-based search agency offering Google Ads management and AI Engine Optimisation (AEO). We help brands capture demand that exists today through Google Ads, and engineer demand forming inside AI search through AEO.",
  },
  {
    question: "How much does DomiSearch charge?",
    answer:
      "Google Ads management starts from £1,500/month. AEO / AI Search starts from £1,950/month. The combined Search Revenue Ownership package starts from £2,950/month. All retainers are monthly with a three-month minimum and no setup fees.",
  },
  {
    question: "Is DomiSearch a Google Partner?",
    answer:
      "Yes. DomiSearch is a certified Google Partner and Shopify Partner, with over £3M in personally managed Google Ads spend.",
  },
  {
    question: "Who runs DomiSearch?",
    answer:
      "DomiSearch was founded in 2023 by Ben Martland, a Manchester-based search specialist with 5 years of Google Ads experience across e-commerce and service brands.",
  },
];

function stripContext<T extends { "@context"?: unknown }>(obj: T) {
  const { "@context": _context, ...rest } = obj;
  return rest;
}

const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    stripContext(organizationSchema),
    stripContext(professionalServiceSchema),
    stripContext(faqSchema(homeFaqs)),
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeGraph) }}
      />
      <Hero />
      <div className="mt-16">
        <ClientMarquee />
      </div>
      <ServicesGrid />
      <CaseStudiesSection />
      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="Pricing"
          title="Senior work. Plain pricing."
          description="Monthly retainers, three-month minimum, no setup fees. Published starting rates so you can qualify yourself before the call."
        />
        <div className="mt-14">
          <PricingTable />
        </div>
      </section>
      <FounderSection />
      <Testimonials showBookCall />
      <FAQ items={homeFaqs} heading="Common questions." />
      <CTA
        heading="Own every surface your buyers search."
        sub="Book a free 30-minute call with Ben. We'll walk through your Google Ads account and how you're showing up across ChatGPT, Gemini and Perplexity - then tell you the three highest-leverage moves you can make next."
      />
    </>
  );
}
