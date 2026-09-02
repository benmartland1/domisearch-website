/**
 * Exercises the questionnaire's branching and rendering without a browser.
 *
 * Run with: npx tsx scripts/check-onboarding.ts
 *
 * Every conditional in the form is here, in both directions, because the one
 * failure mode that costs a real client is a branch nobody clicked through.
 * It also writes the four emails to disk so they can be opened and read.
 */
// Must come first: it makes `server-only` importable for the token checks below.
import "./lib/allow-server-only";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cmsSteps } from "../lib/onboarding/access";
import { confirmationEmail, copyEmail, notificationEmail, resumeEmail } from "../lib/onboarding/email";
import { buildSteps, QUESTIONS } from "../lib/onboarding/questions";
import { collectFiles, summarise } from "../lib/onboarding/summary";
import type { Answers } from "../lib/onboarding/types";
import {
  fileUrl,
  newSubmissionId,
  resumeToken,
  resumeUrl,
  verifyFileSignature,
  verifyResumeToken,
} from "../lib/onboarding/token";
import { looksLikeUrl, normaliseUrl } from "../lib/onboarding/validation";

// token.ts reads this lazily, so setting it here is enough.
process.env.ONBOARDING_SECRET ||= "test-secret-for-the-check-script-only";

let failures = 0;

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function ids(answers: Answers): string[] {
  return buildSteps(answers)
    .filter((s) => s.kind === "question")
    .map((s) => s.id);
}

console.log("\nConditional logic");

// --- Google Business Profile: shown only for Local or Regional -------------
for (const areas of [["Local"], ["Regional"], ["Local", "International"], ["Regional", "National (UK)"]]) {
  check(`GBP shown for ${areas.join("+")}`, ids({ serviceAreas: areas }).includes("accessBusinessProfile"));
}
for (const areas of [[], ["National (UK)"], ["International"], ["National (UK)", "International"]]) {
  check(
    `GBP hidden for ${areas.join("+") || "no answer"}`,
    !ids({ serviceAreas: areas }).includes("accessBusinessProfile"),
  );
}

// --- Developer contact: shown only for freelance or agency -----------------
for (const owner of ["Freelance developer", "Agency"]) {
  check(`developer contact shown for "${owner}"`, ids({ websiteOwner: owner }).includes("developerContact"));
}
for (const owner of ["In-house", "Nobody really", ""]) {
  check(
    `developer contact hidden for "${owner || "no answer"}"`,
    !ids({ websiteOwner: owner }).includes("developerContact"),
  );
}

// --- Planned change detail: shown only on Yes -----------------------------
check("redesign detail shown on Yes", ids({ plannedChanges: "Yes" }).includes("plannedChangesDetail"));
check("redesign detail hidden on No", !ids({ plannedChanges: "No" }).includes("plannedChangesDetail"));
check("redesign detail hidden when unanswered", !ids({}).includes("plannedChangesDetail"));

// --- No dead ends: every branch reaches review then done ------------------
const branchMatrix: Answers[] = [];
for (const areas of [["Local"], ["National (UK)"], []]) {
  for (const owner of ["In-house", "Agency"]) {
    for (const planned of ["Yes", "No"]) {
      branchMatrix.push({ serviceAreas: areas, websiteOwner: owner, plannedChanges: planned });
    }
  }
}
for (const answers of branchMatrix) {
  const steps = buildSteps(answers);
  const last = steps[steps.length - 1];
  const secondLast = steps[steps.length - 2];
  const label = JSON.stringify(answers);
  check(`branch ends at review→done ${label}`, last?.id === "done" && secondLast?.id === "review");
  check(`branch has an access intro ${label}`, steps.some((s) => s.kind === "intro"));
}

console.log("\nCMS instructions follow the platform answer");
for (const platform of ["WordPress", "Webflow", "Squarespace", "Wix", "Shopify", "HubSpot"]) {
  const steps = cmsSteps({ platform });
  check(`${platform} has its own steps`, steps.join(" ").toLowerCase().includes(platform.toLowerCase().slice(0, 5)));
}
for (const platform of ["Custom build", "Not sure", ""]) {
  const steps = cmsSteps({ platform });
  check(`"${platform || "unanswered"}" falls back to generic`, steps.some((s) => s.includes("aeo@domisearch.com")));
}

console.log("\nURL normalisation");
const urlCases: [string, string][] = [
  ["acme.com", "https://acme.com"],
  ["  Acme.com/blog ", "https://Acme.com/blog"],
  ["http://acme.com", "http://acme.com"],
  ["https://acme.com", "https://acme.com"],
  ["//acme.com", "https://acme.com"],
  ["", ""],
];
for (const [input, expected] of urlCases) {
  check(`"${input}" → "${expected}"`, normaliseUrl(input) === expected, normaliseUrl(input));
}
check("rejects 'not a url'", !looksLikeUrl("not a url"));
check("accepts 'acme.co.uk'", looksLikeUrl("acme.co.uk"));

console.log("\nRequired questions");
check("exactly two required", QUESTIONS.filter((q) => q.required).length === 2);
check(
  "required set is name and email",
  QUESTIONS.filter((q) => q.required)
    .map((q) => q.id)
    .join(",") === "fullName,email",
);
// Company name and website are known before a client signs and are supplied by
// the `?client=` slug. If either ever comes back as a question, the prefill
// path below stops being the only source and this check should be revisited.
check(
  "company and website are not asked",
  !QUESTIONS.some((q) => q.id === "companyName" || q.id === "websiteUrl"),
);
check("role and mobile are not asked", !QUESTIONS.some((q) => q.id === "role" || q.id === "mobile"));

// --------------------------------------------------------------- rendering
const filled: Answers = {
  fullName: "Jane Fletcher",
  email: "jane@northgatejoinery.co.uk",
  contactPreference: "WhatsApp",
  stakeholders: [{ name: "Tom Rees", role: "MD", email: "tom@northgatejoinery.co.uk" }, {}],
  companyName: "Northgate Joinery",
  websiteUrl: "https://northgatejoinery.co.uk",
  serviceAreas: ["Local", "Regional"],
  idealClient: "Main contractors on commercial fit-outs in the North West.\nUsually a project manager under time pressure.",
  differentiators: { one: "Own workshop", two: "Six-week lead time", three: "FSC certified throughout" },
  proofPoints: "Constructionline Gold. 42 years trading. 18 joiners on the books.",
  proofPointsFiles: [
    { name: "accreditations.pdf", pathname: "accreditations-x7Fq2.pdf", size: 482000, type: "application/pdf" },
  ],
  restrictions: "Never say 'fireproof'. 'Fire-rated to spec' only.",
  competitors: [
    { name: "Baxter Joinery", website: "baxterjoinery.co.uk" },
    { name: "Kingsmill", website: "https://kingsmill.com" },
    {},
  ],
  toneOfVoice: ["Plain-spoken", "Expert", "Direct"],
  brandAssets: "Guidelines are from 2021 but still current.",
  brandAssetLinks: ["northgatejoinery.co.uk/about"],
  contentInspiration: ["stripe.com/blog"],
  offLimitsTopics: "Nothing on pricing.",
  platform: "WordPress",
  websiteOwner: "Agency",
  developerContact: { name: "Sam at Northgate Digital", email: "sam@northgate.digital" },
  changeComfort: "Prefer to go via our developer",
  plannedChanges: "Yes",
  plannedChangesDetail: "New site on Webflow, going live around March.",
  accessSearchConsole: "done",
  accessAnalytics: "help",
  accessCms: "done",
  accessBusinessProfile: "na",
  accessOther: "We also use Bing Webmaster Tools.",
};

console.log("\nSummary");
const sections = summarise(filled);
// The store is private, so the email gets signed links to our own file route
// rather than blob URLs. Mirrors what `signedUploads` does server-side.
const uploads = collectFiles(filled).map(({ question, file }) => ({
  question,
  file,
  href: fileUrl(file.pathname, "https://onboarding.domisearch.com"),
}));
check("six sections rendered", sections.length === 6, `got ${sections.length}`);
check(
  "removed questions leave no trace in the summary",
  !JSON.stringify(sections).includes("Marketing Director") && !JSON.stringify(sections).includes("07700"),
);
check("empty repeater rows dropped", !JSON.stringify(sections).includes('"—"'));
check(
  "competitor website normalised",
  JSON.stringify(sections).includes("https://baxterjoinery.co.uk"),
);
check("one upload collected", uploads.length === 1);
check(
  "link answers are carried as links, not text",
  sections
    .find((s) => s.id === "content")
    ?.items.find((i) => i.question === "Content we should feel like")
    ?.links.includes("https://stripe.com/blog") === true,
);
check(
  "attached link lists are carried too",
  sections
    .find((s) => s.id === "content")
    ?.items.find((i) => i.question === "Brand guidelines and existing content")
    ?.links.includes("https://northgatejoinery.co.uk/about") === true,
);
check(
  "access statuses carried through",
  sections.find((s) => s.id === "access")?.items.filter((i) => i.status).length === 4,
);

const sparse = summarise({ fullName: "Jane Fletcher", companyName: "Northgate" });
check(
  "blank optional answers dropped outside the access section",
  sparse.filter((s) => s.id !== "access").every((s) => s.items.every((i) => i.answer)),
);
// Access cards survive with no answer on purpose: a blank one is the thing
// Ben needs to see, because it means nothing has been granted yet.
const sparseAccess = sparse.find((s) => s.id === "access");
check("access cards kept when untouched", (sparseAccess?.items.length ?? 0) === 3);
check(
  "untouched access renders as not answered",
  notificationEmail({
    companyName: "Northgate",
    contactName: "Jane",
    contactEmail: "jane@x.com",
    sections: sparse,
    uploads: [],
    studioHref: "https://www.domisearch.com/studio",
  }).html.includes("Not answered"),
);

console.log("\nEmails");
const out = join(process.cwd(), ".onboarding-preview");
mkdirSync(out, { recursive: true });

const notification = notificationEmail({
  companyName: "Northgate Joinery",
  contactName: "Jane Fletcher",
  contactEmail: "jane@northgatejoinery.co.uk",
  sections,
  uploads,
  studioHref: "https://www.domisearch.com/studio/intent/edit/id=onb-demo;type=onboardingSubmission",
});
check("subject follows the brief", notification.subject === "New AEO onboarding: Northgate Joinery");
check(
  "subject falls back to the person when there's no client slug",
  notificationEmail({
    companyName: "",
    contactName: "Jane Fletcher",
    contactEmail: "jane@x.com",
    sections,
    uploads,
    studioHref: "https://www.domisearch.com/studio",
  }).subject === "New AEO onboarding: Jane Fletcher",
);
check("file link is clickable", notification.html.includes("accreditations.pdf</a>") || notification.html.includes("accreditations.pdf "));
check("access checklist rendered", notification.html.includes("Needs help"));
check("Sanity link included", notification.html.includes("/studio/intent/edit/"));
check("no unescaped angle brackets from answers", !notification.html.includes("<script"));

const emails = {
  "notification.html": notification.html,
  "confirmation.html": confirmationEmail({ firstName: "Jane", companyName: "Northgate Joinery" }).html,
  "resume.html": resumeEmail({ firstName: "Jane", href: "https://onboarding.domisearch.com/?resume=onb-demo.sig" }).html,
  "copy.html": copyEmail({ companyName: "Northgate Joinery", sections, uploads }).html,
};
for (const [name, html] of Object.entries(emails)) {
  writeFileSync(join(out, name), html);
}
console.log(`  wrote ${Object.keys(emails).length} email previews to ${out}`);

// Escaping is the one place a client's own text could break the email.
const nasty = summarise({ fullName: "<script>alert(1)</script>", companyName: "A & B \"Ltd\"" });
const nastyHtml = notificationEmail({
  companyName: 'A & B "Ltd"',
  contactName: "<script>alert(1)</script>",
  contactEmail: "x@y.com",
  sections: nasty,
  uploads: [],
  studioHref: "https://www.domisearch.com/studio",
}).html;
check("client text is escaped", !nastyHtml.includes("<script>") && nastyHtml.includes("&lt;script&gt;"));
check("ampersands escaped", nastyHtml.includes("A &amp; B"));

console.log("\nResume links");
const id = newSubmissionId();
const token = resumeToken(id);
check("a signed token round-trips", verifyResumeToken(token) === id);
check("a tampered id is rejected", verifyResumeToken(`onb-elsewhere.${token.split(".")[1]}`) === null);
check("a tampered signature is rejected", verifyResumeToken(`${id}.${"a".repeat(32)}`) === null);
check("an unsigned id is rejected", verifyResumeToken(id) === null);
check("junk is rejected", verifyResumeToken("../../etc/passwd") === null);
check("an empty token is rejected", verifyResumeToken("") === null);
check(
  "the link points at the subdomain",
  resumeUrl(id, "https://onboarding.domisearch.com").startsWith("https://onboarding.domisearch.com/?resume="),
);

// File links: the blob store is private, so these are the only way in.
const filePath = "brand-guidelines-Ab3xQ.pdf";
const signed = new URL(fileUrl(filePath, "https://onboarding.domisearch.com"));
const sig = signed.searchParams.get("sig") ?? "";
check("a file link round-trips", verifyFileSignature(filePath, sig));
check("a file link points at the file route", signed.pathname === "/api/onboarding/file");
check("another path is rejected with the same signature", !verifyFileSignature("someone-elses-file.pdf", sig));
check("a tampered file signature is rejected", !verifyFileSignature(filePath, "a".repeat(32)));
check("an empty file signature is rejected", !verifyFileSignature(filePath, ""));
// A resume token must not open a file, and vice versa: they are signed with
// different prefixes precisely so neither can be replayed as the other.
check("a resume signature cannot open a file", !verifyFileSignature(id, resumeToken(id).split(".")[1]));
// A different secret must not validate the same link.
process.env.ONBOARDING_SECRET = "a-completely-different-secret";
check("a token signed with another secret is rejected", verifyResumeToken(token) === null);
process.env.ONBOARDING_SECRET = "test-secret-for-the-check-script-only";

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
