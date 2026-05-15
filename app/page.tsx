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
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

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
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/logo.png`,
        width: 200,
        height: 60,
      },
      image: `${site.url}/brand/logo.png`,
      description:
        "DomiSearch is a Google Partner and Shopify Partner agency combining Google Ads with AI Engine Optimisation (AEO) so brands win across Google, ChatGPT, Gemini and Perplexity. Based in Manchester, UK.",
      slogan: "Be the brand AI recommends.",
      founder: {
        "@type": "Person",
        name: site.founder,
        url: `${site.url}/about`,
        jobTitle: "Founder",
        worksFor: { "@id": `${site.url}/#organization` },
      },
      foundingDate: "2023",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 10,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Manchester",
        addressRegion: "Greater Manchester",
        addressCountry: "GB",
      },
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
        { "@type": "Place", name: "European Union" },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.email,
          telephone: "+44-7980-920-659",
          url: `${site.url}/contact`,
          availableLanguage: "en-GB",
          areaServed: ["GB", "US", "EU"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          url: site.calendly,
          availableLanguage: "en-GB",
        },
      ],
      sameAs: [
        "https://www.google.com/partners/agency",
        "https://www.shopify.com/partners",
        site.trustpilot,
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "DomiSearch Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Google Ads Management",
              url: `${site.url}/services/google-ads`,
              description:
                "End-to-end Google Ads management run by a Google Partner. Account restructure, Search, PMax, Demand Gen, landing page CRO, and transparent weekly reporting. From £1,500/month.",
              provider: { "@id": `${site.url}/#organization` },
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "1500",
              priceCurrency: "GBP",
              unitText: "month",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Engine Optimisation (AEO)",
              url: `${site.url}/services/aeo`,
              description:
                "Entity optimisation, AI-ready content, schema, citation ops and monthly AI visibility reporting across ChatGPT, Gemini, Perplexity, Copilot, Claude and Google AI Overviews. From £1,950/month.",
              provider: { "@id": `${site.url}/#organization` },
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "1950",
              priceCurrency: "GBP",
              unitText: "month",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Search Revenue Ownership",
              url: `${site.url}/services`,
              description:
                "Google Ads and AEO unified into one compounding search strategy. Single monthly report, unified strategy across both channels. From £2,950/month.",
              provider: { "@id": `${site.url}/#organization` },
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "2950",
              priceCurrency: "GBP",
              unitText: "month",
            },
          },
        ],
      },
      review: [
        {
          "@type": "Review",
          reviewBody:
            "We have been working with Ben and DomiSearch for nearly 3 years. A true expert in his space. Taxd has grown a phenomenal customer base thanks to our fantastic search acquisition strategy.",
          author: {
            "@type": "Person",
            name: "Eamon Shahir",
            jobTitle: "Co-Founder, Taxd",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
        },
        {
          "@type": "Review",
          reviewBody:
            "Ben from DomiSearch has made my life easy... Anything and I mean anything to do with Google Ads, this guy knows. The guy tells you what works, makes it work and over delivers.",
          author: {
            "@type": "Person",
            name: "Angellos Koulli",
            jobTitle: "CEO, Alphaveata",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        reviewCount: "2",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: "Google Ads and AI Engine Optimisation agency. Manchester, UK.",
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-GB",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${site.url}/blog?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: "Google Ads & AEO Agency | DomiSearch - Manchester",
      description:
        "DomiSearch is a Google Partner and Shopify Partner agency combining Google Ads with AEO. Be the brand AI recommends. Based in Manchester, UK.",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${site.url}/brand/logo.png`,
      },
      inLanguage: "en-GB",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
        ],
      },
    },
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
