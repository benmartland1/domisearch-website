import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { HowItWorks } from "@/components/HowItWorks";
import { ProofSection } from "@/components/ProofSection";
import { FounderSection } from "@/components/FounderSection";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { aeoPricingSentence } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AI Search Visibility (AEO) Agency for Service Businesses | DomiSearch",
  description:
    "DomiSearch helps service businesses get discovered, mentioned and cited in ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. Research-led AEO, tracked daily.",
  alternates: { canonical: "/" },
};

const platforms = site.platforms.join(", ");

/*
 * Written to support an AI search buying decision. Every answer is qualified:
 * no promised rankings, recommendations, leads or results timeline.
 */
const homeFaqs = [
  {
    question: "What is Answer Engine Optimisation (AEO)?",
    answer:
      "Answer Engine Optimisation is work that improves how a business is discovered, mentioned and cited in AI-generated answers, on platforms such as ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. It overlaps with established SEO fundamentals, such as accessible pages, clear business information and useful content, and adds research into the questions buyers ask AI and the sources those answers reference.",
  },
  {
    question: "What does DomiSearch do?",
    answer:
      "DomiSearch is an AI search visibility agency for service businesses, with recruitment agencies a core focus. We research the questions your potential clients ask AI tools, examine which brands and sources appear in those answers, and use that evidence to guide website improvements, content and ongoing measurement. We also manage Google Ads for a smaller number of clients.",
  },
  {
    question: "Which AI platforms do you track?",
    answer: `We track an agreed set of buyer questions daily across ${platforms}. We add platforms as they earn real usage among the buyers our clients care about.`,
  },
  {
    question: "What does the programme involve?",
    answer:
      "It starts with an AI visibility and competitor baseline and research into relevant buyer questions and cited sources. We then work through technical foundations and structured data, service-page improvements and content that answers the questions in the research, with your team's expertise and approval. Throughout, we track the agreed questions daily and review progress in a monthly report and strategy call.",
  },
  {
    question: "How do you measure progress?",
    answer:
      "Against the baseline, on the same tracked questions. We report how often your business is named, which sources the answers cite, how you compare with tracked competitors and how AI describes you, alongside the work completed. Domi Studio, our own software, connects that completed work with the visibility data so we can review what changed and what happened next. The figures describe the tracked set, not every AI conversation.",
  },
  {
    question: "What does DomiSearch charge?",
    answer: `${aeoPricingSentence} Google Ads management is scoped and quoted separately on a call.`,
  },
  {
    question: "How quickly might we see results?",
    answer:
      "There is no reliable date we can promise for a particular AI recommendation. Our standard initial programme runs for 90 days, which gives a defined period to deliver the agreed work, track changes and review what the evidence shows. Your starting position, competition and the pace of approvals all affect how quickly visibility moves.",
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
      description: `${site.description} Based in Manchester, UK.`,
      slogan: "Be the brand AI recommends.",
      knowsAbout: [
        "Answer Engine Optimisation",
        "AI search visibility",
        "Generative Engine Optimisation",
        "Google Ads management",
      ],
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
      sameAs: [site.social.linkedin, site.trustpilot],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "DomiSearch Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Search Visibility (Answer Engine Optimisation)",
              url: `${site.url}/services/aeo`,
              description: `AI visibility and competitor baseline, buyer-question and cited-source research, technical foundations and structured data, service-page improvements, content, and daily tracking with monthly reporting across ${platforms}.`,
              provider: { "@id": `${site.url}/#organization` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Google Ads Management",
              url: `${site.url}/services/google-ads`,
              description:
                "Google Ads account management for existing clients and suitable inbound enquiries: account restructure, Search, PMax, Demand Gen, landing page CRO and transparent reporting.",
              provider: { "@id": `${site.url}/#organization` },
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
            "We brought Ben in to support not just with Google Ads, but also landing pages, copy, and AEO. This helped boost conversions at every stage of the funnel - more clicks from ads and more customers converting. What we value most is his ability to provide clear insights, suggest improvements, and execute independently.",
          author: {
            "@type": "Person",
            name: "Arjun Kumar",
            jobTitle: "Founder, Taxd",
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
      description: "AI search visibility (AEO) agency for service businesses. Manchester, UK.",
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
      name: "AI Search Visibility (AEO) Agency for Service Businesses | DomiSearch",
      description: `DomiSearch helps service businesses get discovered, mentioned and cited across ${platforms}. Be the brand AI recommends. Based in Manchester, UK.`,
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
      <div className="mt-6 lg:mt-16">
        <ClientMarquee />
      </div>
      <HowItWorks />
      <ProofSection />
      <FounderSection />
      <Testimonials showBookCall only={["Eamon Shahir", "Arjun Kumar", "Sam Barraclough"]} />
      <FAQ items={homeFaqs} heading="Common questions." />
      <CTA
        heading="Find out where you stand in AI search."
        sub="Request a free AI visibility check, or book a 30-minute call to talk through an AI search roadmap for your business. We'll show you where you appear today, who is being recommended instead, and what we would work on first."
        secondary={{ label: "Check my AI visibility", href: "/#visibility-check" }}
      />
    </>
  );
}
