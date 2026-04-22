import { site } from "./site";

export type Author = {
  name: string;
  role: string;
  image: string;
  bio: string;
  url: string;
  sameAs: string[];
};

export const authors: Record<string, Author> = {
  "Ben Martland": {
    name: "Ben Martland",
    role: "Founder, DomiSearch",
    image: "/brand/founder.jpg",
    bio: "Ben founded DomiSearch after four years running Google Ads for e-commerce and service brands. He's a Google Partner and Shopify Partner, and leads DomiSearch's AEO research programme from Manchester. Every client account is reviewed by him personally.",
    url: `${site.url}/about`,
    sameAs: [site.social.linkedin],
  },
  "DomiSearch Team": {
    name: "DomiSearch Team",
    role: "Search for the AI era",
    image: "/brand/logo.png",
    bio: "DomiSearch is a Google Partner and Shopify Partner agency combining Google Ads with AI Engine Optimisation so brands win across Google, ChatGPT, Gemini and Perplexity.",
    url: site.url,
    sameAs: [site.social.linkedin],
  },
};

export function getAuthor(name: string): Author {
  return authors[name] ?? authors["DomiSearch Team"];
}
