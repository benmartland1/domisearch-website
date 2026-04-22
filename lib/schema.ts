import { site } from "./site";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.email,
  telephone: site.phone,
  sameAs: [site.social.linkedin, site.social.x],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "GB",
  },
  founder: { "@type": "Person", name: site.founder },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  image: `${site.url}/brand/logo.png`,
  priceRange: "£££",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "GB",
  },
  areaServed: ["GB", "US", "EU"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    serviceType: params.serviceType,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    areaServed: ["GB", "US", "EU"],
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: {
    name: string;
    role: string;
    url: string;
    image: string;
    sameAs: string[];
  } | string;
  tags: string[];
}) {
  const url = `${site.url}/blog/${params.slug}`;
  const authorNode =
    typeof params.author === "string"
      ? { "@type": "Person" as const, name: params.author }
      : {
          "@type": "Person" as const,
          name: params.author.name,
          jobTitle: params.author.role,
          url: params.author.url,
          image: params.author.image.startsWith("http")
            ? params.author.image
            : `${site.url}${params.author.image}`,
          sameAs: params.author.sameAs,
        };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    author: authorNode,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.png` },
    },
    datePublished: params.date,
    dateModified: params.date,
    mainEntityOfPage: url,
    url,
    keywords: params.tags.join(", "),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function personSchema(params: {
  name: string;
  jobTitle: string;
  image: string;
  url: string;
  sameAs?: string[];
  description?: string;
  worksFor?: { name: string; url: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    jobTitle: params.jobTitle,
    image: params.image.startsWith("http") ? params.image : `${site.url}${params.image}`,
    url: params.url,
    sameAs: params.sameAs,
    description: params.description,
    worksFor: params.worksFor
      ? {
          "@type": "Organization",
          name: params.worksFor.name,
          url: params.worksFor.url,
        }
      : undefined,
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${site.url}/contact`,
    name: `Contact ${site.name}`,
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      contactPoint: {
        "@type": "ContactPoint",
        email: site.email,
        telephone: site.phone,
        contactType: "customer service",
        areaServed: ["GB", "US", "EU"],
        availableLanguage: ["English"],
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

