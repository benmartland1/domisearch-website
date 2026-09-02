import { ACCESS_PLATFORMS } from "./access";
import type { Answers, Question, SectionId, Step } from "./types";
import { asList, asRows, asText, compactRows, isEmail, looksLikeUrl } from "./validation";

export const SECTIONS: { id: SectionId; title: string }[] = [
  { id: "you", title: "You" },
  { id: "business", title: "Business" },
  { id: "competitors", title: "Competitors" },
  { id: "content", title: "Content" },
  { id: "website", title: "Website" },
  { id: "access", title: "Access" },
];

export const SECTION_TITLES: Record<SectionId, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.title]),
) as Record<SectionId, string>;

/** Answered "Local" or "Regional" — the trigger for the Business Profile card. */
function servesLocally(answers: Answers): boolean {
  const areas = asList(answers.serviceAreas);
  return areas.includes("Local") || areas.includes("Regional");
}

/** Someone outside the business looks after the site, so we need their details. */
function hasExternalDeveloper(answers: Answers): boolean {
  const owner = asText(answers.websiteOwner);
  return owner === "Freelance developer" || owner === "Agency";
}

export const QUESTIONS: Question[] = [
  // ---------------------------------------------------------------- 1. You
  {
    id: "fullName",
    section: "you",
    label: "First, what's your name?",
    emailLabel: "Full name",
    required: true,
    input: { type: "text", placeholder: "Jane Fletcher", autoComplete: "name", maxLength: 120 },
    validate: (a) => (asText(a.fullName) ? null : "We'll need your name to get started."),
  },
  {
    id: "email",
    section: "you",
    label: "Best email for us?",
    emailLabel: "Email",
    helper: "Where reports, drafts and your resume link land.",
    required: true,
    input: { type: "text", inputType: "email", placeholder: "jane@company.com", autoComplete: "email", maxLength: 200 },
    validate: (a) => {
      const value = asText(a.email);
      if (!value) return "We'll need an email so we can send your work over.";
      return isEmail(value) ? null : "That doesn't look quite right — check for a typo?";
    },
  },
  {
    id: "contactPreference",
    section: "you",
    label: "How would you rather we reach you day to day?",
    emailLabel: "Preferred contact method",
    input: {
      type: "single",
      options: [
        { value: "Email", label: "Email" },
        { value: "WhatsApp", label: "WhatsApp" },
        { value: "Slack", label: "Slack" },
        { value: "Phone", label: "Phone" },
      ],
    },
  },
  {
    id: "stakeholders",
    section: "you",
    label: "Anyone else we should copy in?",
    emailLabel: "Other stakeholders",
    helper: "People who sign off work, or who should see what we send. Leave blank if it's just you.",
    input: {
      type: "repeater",
      addLabel: "Add another person",
      seed: 1,
      max: 6,
      fields: [
        { id: "name", label: "Name", width: "half" },
        { id: "role", label: "Role", width: "half" },
        { id: "email", label: "Email", inputType: "email", width: "full" },
      ],
    },
    validate: (a) => {
      const bad = compactRows(asRows(a.stakeholders)).find((r) => r.email && !isEmail(r.email));
      return bad ? `${bad.email} doesn't look like a valid email address.` : null;
    },
  },

  // ----------------------------------------------------------- 2. Business
  //
  // Company name and website are deliberately not asked. Both are known by the
  // time a client signs, and asking again reads as "we weren't listening". They
  // arrive instead from the `?client=` slug on the welcome-email link — see
  // `lib/onboarding/clients.ts` — and still reach the Sanity record and the
  // notification subject. The cost is that a wrong slug is never corrected by
  // the client, because they never see it.
  {
    id: "serviceAreas",
    section: "business",
    label: "Where do you serve clients?",
    emailLabel: "Areas served",
    helper: "Tick everything that applies.",
    input: {
      type: "multi",
      options: [
        { value: "Local", label: "Local", hint: "One town or city" },
        { value: "Regional", label: "Regional", hint: "A county or a few counties" },
        { value: "National (UK)", label: "National (UK)" },
        { value: "International", label: "International" },
      ],
    },
  },
  {
    id: "idealClient",
    section: "business",
    label: "Describe your ideal client.",
    emailLabel: "Ideal client",
    helper: "Who are they, what are they trying to solve, and what makes them a good fit for you?",
    input: {
      type: "longtext",
      rows: 7,
      maxLength: 4000,
      placeholder: "Mid-sized manufacturers with an ageing website and a sales team who keep getting asked the same five questions…",
    },
  },
  {
    id: "differentiators",
    section: "business",
    label: "What are your three biggest differentiators?",
    emailLabel: "Differentiators",
    helper: "Versus your competitors. Short and specific beats polished.",
    input: {
      type: "group",
      fields: [
        { id: "one", label: "One", placeholder: "The only UK supplier with…" },
        { id: "two", label: "Two", placeholder: "48-hour turnaround as standard" },
        { id: "three", label: "Three", placeholder: "In-house engineers, no subcontracting" },
      ],
    },
  },
  {
    id: "proofPoints",
    section: "business",
    label: "What proof can we use?",
    emailLabel: "Proof points",
    helper:
      "Awards, accreditations, notable clients, results, years in business, team size, reviews. AI engines cite specifics, so the more concrete the better.",
    input: {
      type: "longtext",
      rows: 7,
      maxLength: 4000,
      placeholder: "ISO 9001 certified since 2016. 340 five-star Google reviews. Cut lead times 40% for Wates…",
    },
    attachments: { key: "proofPointsFiles", label: "Attach anything that backs this up" },
  },
  {
    id: "restrictions",
    section: "business",
    label: "Is there anything we must not say or claim?",
    emailLabel: "Claims and phrases to avoid",
    helper:
      "Regulatory rules, phrases to avoid, sensitive topics. Especially important for regulated sectors — tell us now and we'll build the guardrails in from day one.",
    input: {
      type: "longtext",
      rows: 6,
      maxLength: 3000,
      placeholder: "We can't use the word 'guaranteed' about returns. No naming clients in healthcare…",
    },
  },

  // -------------------------------------------------------- 3. Competitors
  {
    id: "competitors",
    section: "competitors",
    label: "Who are your main competitors?",
    emailLabel: "Competitors",
    helper: "Three to five is ideal. We track how you show up against them in AI answers.",
    input: {
      type: "repeater",
      addLabel: "Add another competitor",
      seed: 3,
      max: 5,
      fields: [
        { id: "name", label: "Name", width: "wide" },
        { id: "website", label: "Website", inputType: "url", placeholder: "competitor.com", width: "wide" },
      ],
    },
    validate: (a) => {
      const bad = compactRows(asRows(a.competitors)).find((r) => r.website && !looksLikeUrl(r.website));
      return bad ? `"${bad.website}" doesn't look like a web address.` : null;
    },
  },

  // ------------------------------------------------------------ 4. Content
  {
    id: "toneOfVoice",
    section: "content",
    label: "How should you sound?",
    emailLabel: "Tone of voice",
    helper: "Pick up to three.",
    input: {
      type: "multi",
      max: 3,
      options: [
        { value: "Plain-spoken", label: "Plain-spoken" },
        { value: "Expert", label: "Expert" },
        { value: "Warm", label: "Warm" },
        { value: "Direct", label: "Direct" },
        { value: "Playful", label: "Playful" },
        { value: "Formal", label: "Formal" },
        { value: "Technical", label: "Technical" },
      ],
    },
  },
  {
    id: "brandAssets",
    section: "content",
    label: "Got brand guidelines or content you're proud of?",
    emailLabel: "Brand guidelines and existing content",
    helper: "Logo files, tone documents, a page you'd happily show anyone. Links or uploads, whichever is easier.",
    input: { type: "longtext", rows: 3, maxLength: 2000, placeholder: "Anything we should know about what you're sharing…" },
    attachments: { key: "brandAssetFiles", label: "Upload files" },
    links: { key: "brandAssetLinks", label: "Or paste links", max: 8, placeholder: "acme.com/brand" },
  },
  {
    id: "contentInspiration",
    section: "content",
    label: "Anyone whose content you'd like ours to feel like?",
    emailLabel: "Content we should feel like",
    helper: "Competitors, publications, someone in a completely different sector. Paste the links.",
    input: { type: "links", addLabel: "Add another link", max: 6, placeholder: "stripe.com/blog" },
  },
  {
    id: "offLimitsTopics",
    section: "content",
    label: "Any topics that are off-limits?",
    emailLabel: "Off-limits topics",
    input: {
      type: "longtext",
      rows: 5,
      maxLength: 2000,
      placeholder: "Nothing on pricing. Steer clear of anything political…",
    },
  },

  // --------------------------------------------- 5. Website and technical
  {
    id: "platform",
    section: "website",
    label: "What's your website built on?",
    emailLabel: "Website platform",
    input: {
      type: "single",
      options: [
        { value: "WordPress", label: "WordPress" },
        { value: "Webflow", label: "Webflow" },
        { value: "Squarespace", label: "Squarespace" },
        { value: "Wix", label: "Wix" },
        { value: "Shopify", label: "Shopify" },
        { value: "HubSpot", label: "HubSpot" },
        { value: "Custom build", label: "Custom build" },
        { value: "Not sure", label: "Not sure", hint: "Perfectly fine — we'll work it out" },
      ],
    },
  },
  {
    id: "websiteOwner",
    section: "website",
    label: "Who looks after the website?",
    emailLabel: "Who maintains the website",
    input: {
      type: "single",
      options: [
        { value: "In-house", label: "In-house" },
        { value: "Freelance developer", label: "A freelance developer" },
        { value: "Agency", label: "An agency" },
        { value: "Nobody really", label: "Nobody, really" },
      ],
    },
  },
  {
    id: "developerContact",
    section: "website",
    label: "Who should we coordinate with?",
    emailLabel: "Developer or agency contact",
    helper: "Their name and email. We'll always copy you in — never go around you.",
    when: hasExternalDeveloper,
    input: {
      type: "group",
      fields: [
        { id: "name", label: "Name", placeholder: "Sam at Northgate Digital" },
        { id: "email", label: "Email", inputType: "email", placeholder: "sam@northgate.co.uk" },
      ],
    },
    validate: (a) => {
      const group = a.developerContact;
      const email = typeof group === "object" && group !== null && !Array.isArray(group)
        ? String((group as Record<string, string>).email ?? "")
        : "";
      return !email || isEmail(email) ? null : "That email doesn't look quite right.";
    },
  },
  {
    id: "changeComfort",
    section: "website",
    label: "Once we have access, are you happy for us to make changes directly?",
    emailLabel: "Comfortable with direct changes",
    helper: "Schema, technical files, new pages. There's no wrong answer — it just changes how we work.",
    input: {
      type: "single",
      options: [
        { value: "Yes", label: "Yes, go ahead" },
        { value: "Prefer to go via our developer", label: "Prefer it goes via our developer" },
        { value: "Let's discuss", label: "Let's discuss it first" },
      ],
    },
  },
  {
    id: "plannedChanges",
    section: "website",
    label: "Any redesign, migration or rebrand planned in the next six months?",
    emailLabel: "Planned redesign, migration or rebrand",
    input: {
      type: "single",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
  },
  {
    id: "plannedChangesDetail",
    section: "website",
    label: "Tell us more.",
    emailLabel: "Planned change — detail",
    helper: "What's changing, roughly when, and who's doing it. Migrations are the single biggest risk to AI visibility, so timing matters.",
    when: (a) => asText(a.plannedChanges) === "Yes",
    input: {
      type: "longtext",
      rows: 6,
      maxLength: 2000,
      placeholder: "New site on Webflow, going live around March, built by our design agency…",
    },
  },

  // ------------------------------------------------------------- 6. Access
  ...ACCESS_PLATFORMS.map<Question>((platform) => ({
    id: platform.id,
    section: "access" as const,
    label: platform.name,
    emailLabel: platform.name,
    input: { type: "access" as const, platform },
    when:
      platform.id === "accessBusinessProfile"
        ? servesLocally
        : undefined,
  })),
  {
    id: "accessOther",
    section: "access",
    label: "Anything else we should have access to?",
    emailLabel: "Other access",
    helper: "Bing Webmaster Tools, a review platform, an analytics tool we haven't asked about. Optional.",
    input: {
      type: "longtext",
      rows: 5,
      maxLength: 2000,
      placeholder: "We also use Trustpilot and Bing Webmaster Tools…",
    },
  },
];

const ACCESS_INTRO: Step = {
  kind: "intro",
  id: "accessIntro",
  section: "access",
  title: "One last thing: access",
  body: [
    "We need access to a few things. You never share passwords with us — instead you add our team email to each platform, which you can remove at any time.",
    "Each step has instructions. If you get stuck on any of them, mark it and we'll sort it out together on your onboarding call.",
  ],
};

/**
 * The screens this client actually sees, in order.
 *
 * Recomputed from the answers on every render, so a branch opens and closes
 * the moment the answer that governs it changes. Nothing is cached, because
 * a stale step list is how you end up asking a national business how to add
 * us to their Google Business Profile.
 */
export function buildSteps(answers: Answers): Step[] {
  const steps: Step[] = [{ kind: "welcome", id: "welcome" }];
  let accessIntroAdded = false;

  for (const question of QUESTIONS) {
    if (question.when && !question.when(answers)) continue;
    if (question.section === "access" && !accessIntroAdded) {
      steps.push(ACCESS_INTRO);
      accessIntroAdded = true;
    }
    steps.push({ kind: "question", id: question.id, section: question.section, question });
  }

  steps.push({ kind: "review", id: "review", section: "access" });
  steps.push({ kind: "done", id: "done" });
  return steps;
}

/** Questions that must be answered before we'll accept a submission. */
export const REQUIRED_IDS = QUESTIONS.filter((q) => q.required).map((q) => q.id);

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
