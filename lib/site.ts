export const site = {
  name: "DomiSearch",
  tagline: "The search agency for the AI era.",
  description:
    "DomiSearch is a Google Partner and Shopify Partner agency combining Google Ads with AI Engine Optimisation (AEO) so brands win across Google, ChatGPT, Gemini and Perplexity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://domisearch.com",
  email: "hi@domisearch.com",
  phone: "+44 7980 920 659",
  phoneHref: "+447980920659",
  whatsappHref: "https://wa.me/447980920659",
  city: "Manchester",
  country: "United Kingdom",
  calendly: "https://calendly.com/domisearch/discovery-call",
  trustpilot: "https://www.trustpilot.com/review/domisearch.com",
  founder: "Ben Martland",
  social: {
    linkedin: "https://www.linkedin.com/company/domisearch",
    x: "https://x.com/domisearch",
  },
  nav: [
    { label: "Google Ads", href: "/services/google-ads" },
    { label: "AI Search", href: "/services/aeo" },
    { label: "Pricing", href: "/pricing" },
    { label: "Free audit", href: "/scorecard" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  clients: [
    { name: "Taxd", logo: "/clients/taxd.png" },
    { name: "Rooftop Saunas", logo: "/clients/rooftop_saunas.png" },
    { name: "Garside Waddingham", logo: "/clients/garside_waddingham.png" },
    { name: "Fueled", logo: "/clients/fueled.png" },
    { name: "Mighty Student Living", logo: "/clients/mighty_student_living.png" },
    { name: "Netil360", logo: "/clients/netil360.png" },
    { name: "Lancashire Smiles", logo: "/clients/lancashire_smiles.png" },
    { name: "David Farrer", logo: "/clients/david_farrer.png" },
    { name: "The Birds Nest", logo: "/clients/birds_nest.png" },
    { name: "Typo", logo: "/clients/typo.png" },
  ],
} as const;

export type Site = typeof site;
export type Client = Site["clients"][number];
