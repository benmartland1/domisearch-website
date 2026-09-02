import type { Answers } from "./types";

/**
 * Prefill for `?client=slug`.
 *
 * The welcome email links to onboarding.domisearch.com/?client=acme-ltd so the
 * client doesn't retype what we already know. Add a row here when a client
 * signs; anything not listed still gets a sensible company name derived from
 * the slug, which is better than an empty first screen.
 *
 * Nothing here is confidential — it appears in a URL and in the page the
 * client loads — so it holds names and addresses only.
 */
export type ClientPrefill = {
  companyName?: string;
  fullName?: string;
  email?: string;
  websiteUrl?: string;
};

export const CLIENT_PREFILLS: Record<string, ClientPrefill> = {
  // "acme-ltd": { companyName: "Acme Ltd", fullName: "Jane Fletcher", email: "jane@acme.com", websiteUrl: "acme.com" },
};

/** Company suffixes and initialisms that a plain capitalise would mangle. */
const SPECIAL_CASE: Record<string, string> = {
  ltd: "Ltd",
  llp: "LLP",
  plc: "PLC",
  uk: "UK",
  cic: "CIC",
};

/** "north-west-roofing" → "North West Roofing". Good enough to feel personal, easy to correct. */
function titleCase(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => SPECIAL_CASE[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build the starting answers for a slug.
 *
 * `name` and `email` may also arrive as query params, which is how a mail-merge
 * personalises the link without needing a row in the table above. Query params
 * win over the table: they are the more recent information.
 */
export function prefillFor(
  slug: string | null,
  extra: { name?: string | null; email?: string | null } = {},
): Answers {
  const answers: Answers = {};
  if (!slug && !extra.name && !extra.email) return answers;

  if (slug) {
    const known = CLIENT_PREFILLS[slug.toLowerCase()];
    const companyName = known?.companyName ?? titleCase(slug);
    if (companyName) answers.companyName = companyName;
    if (known?.fullName) answers.fullName = known.fullName;
    if (known?.email) answers.email = known.email;
    if (known?.websiteUrl) answers.websiteUrl = known.websiteUrl;
  }

  if (extra.name) answers.fullName = extra.name.slice(0, 120);
  if (extra.email) answers.email = extra.email.slice(0, 200);

  return answers;
}
