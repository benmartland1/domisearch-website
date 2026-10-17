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
    image: "/brand/founder.png",
    bio: "Ben founded DomiSearch in 2023 and leads its AI search visibility work: researching the questions buyers ask ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews, and what makes one business get named over another. He came to it from five years in search marketing, in-house and agency-side. Every client account is reviewed by him personally.",
    url: `${site.url}/about`,
    sameAs: [site.social.linkedin],
  },
  "DomiSearch Team": {
    name: "DomiSearch Team",
    role: "AI search visibility for service businesses",
    image: "/brand/logo.png",
    bio: "DomiSearch is an AI search visibility (AEO) agency for service businesses, helping brands get discovered, mentioned and cited across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews.",
    url: site.url,
    sameAs: [site.social.linkedin],
  },
};

export function getAuthor(name: string): Author {
  return authors[name] ?? authors["DomiSearch Team"];
}
