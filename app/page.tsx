import type { Metadata, Viewport } from "next";
import { ApprovedHome } from "@/components/home/ApprovedHome";
import { homeFaqs } from "@/components/home/faqs";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { getTrustpilotReviewCount, trustpilotReviews } from "@/lib/trustpilot";

/**
 * The homepage is the approved light design, so the root layout's charcoal
 * theme-color (a black browser chrome on mobile) is overridden here.
 */
export const viewport: Viewport = {
  themeColor: "#f8f7f1",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Search Visibility (AEO) Agency for Service Businesses | DomiSearch",
  description:
    "DomiSearch helps service businesses get discovered, mentioned and cited in ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. Research-led AEO, tracked daily.",
  alternates: { canonical: "/" },
};

const platforms = site.platforms.join(", ");

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

export default async function HomePage() {
  const reviewCount = await getTrustpilotReviewCount();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeGraph) }}
      />
      <ApprovedHome reviews={trustpilotReviews} reviewCount={reviewCount} />
    </>
  );
}
