import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { configuredOrigin } from "./request";
import { collectFiles, summarise } from "./summary";
import { fileUrl } from "./token";
import type { EmailUpload } from "./email";
import type { Answers } from "./types";
import { asText, normaliseUrl } from "./validation";

export const ONBOARDING_TYPE = "onboardingSubmission";

/**
 * Every upload in a submission, each with a signed link to our file route.
 *
 * The blob store is private, so `file.pathname` is not something a browser can
 * open. Signing happens here, server-side, and only here — the browser is
 * never given a key that would let it mint its own links.
 */
export function signedUploads(answers: Answers): EmailUpload[] {
  const origin = configuredOrigin();
  return collectFiles(answers).map(({ question, file }) => ({
    question,
    file,
    href: fileUrl(file.pathname, origin),
  }));
}

/**
 * Write client for onboarding submissions.
 *
 * Separate from `sanity/lib/client` because that one is read-only and
 * deliberately tokenless so it can be imported anywhere. This one is
 * server-only and needs a token with write permission.
 */
let cached: SanityClient | null = null;

function writeClient(): SanityClient {
  if (cached) return cached;
  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error(
      "No Sanity write token. Set SANITY_API_WRITE_TOKEN (sanity.io/manage → API → Tokens, Editor permission) — onboarding answers cannot be saved without it.",
    );
  }
  cached = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "published" });
  return cached;
}

/** Deep link to the document in the embedded Studio, for the notification email. */
export function studioUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.domisearch.com";
  return `${base.replace(/\/$/, "")}/studio/intent/edit/id=${encodeURIComponent(id)};type=${ONBOARDING_TYPE}`;
}

export type Submission = {
  id: string;
  status: "draft" | "submitted";
  answers: Answers;
  clientSlug: string | null;
  resumeEmailSentTo: string | null;
  startedAt: string | null;
  submittedAt: string | null;
};

/**
 * Build the document body.
 *
 * The rendered `sections` snapshot exists so a submission is readable in the
 * Studio without anyone parsing JSON. `answersJson` is the lossless copy:
 * the rendered version deliberately drops blanks, and the raw answers are
 * what a resume has to restore exactly. Storing the answers as a typed Sanity
 * object was the alternative and was rejected — the shape changes every time
 * a question changes, and a stale schema would reject a valid answer.
 */
function documentBody(answers: Answers) {
  const sections = summarise(answers).map((section) => ({
    _type: "onboardingSection",
    _key: section.id,
    title: section.title,
    items: section.items.map((item, index) => ({
      _type: "onboardingItem",
      _key: `${section.id}-${index}`,
      question: item.question,
      answer: item.answer,
      links: item.links,
      status: item.status,
    })),
  }));

  const files = signedUploads(answers).map(({ question, file, href }, index) => ({
    _type: "onboardingFile",
    _key: `file-${index}`,
    question,
    name: file.name,
    url: href,
    size: file.size,
  }));

  // Company and website are prefilled from the `?client=` slug rather than
  // asked, so both are routinely absent. `websiteUrl` is a `url` field in the
  // schema and an empty string is not a valid one, so it is omitted rather
  // than blanked.
  const websiteUrl = normaliseUrl(asText(answers.websiteUrl));

  return {
    companyName: asText(answers.companyName),
    contactName: asText(answers.fullName),
    contactEmail: asText(answers.email),
    ...(websiteUrl ? { websiteUrl } : {}),
    sections,
    files,
    answersJson: JSON.stringify(answers, null, 2),
  };
}

type Fetched = {
  _id: string;
  status?: "draft" | "submitted";
  answersJson?: string;
  clientSlug?: string;
  resumeEmailSentTo?: string;
  startedAt?: string;
  submittedAt?: string;
};

export async function loadSubmission(id: string): Promise<Submission | null> {
  const doc = await writeClient().fetch<Fetched | null>(
    `*[_type == $type && _id == $id][0]{ _id, status, answersJson, clientSlug, resumeEmailSentTo, startedAt, submittedAt }`,
    { type: ONBOARDING_TYPE, id },
    { cache: "no-store" },
  );
  if (!doc) return null;

  let answers: Answers = {};
  if (doc.answersJson) {
    try {
      answers = JSON.parse(doc.answersJson) as Answers;
    } catch {
      // A corrupt blob should not lock the client out of their own form; they
      // resume with whatever the browser still holds instead.
      answers = {};
    }
  }

  return {
    id: doc._id,
    status: doc.status ?? "draft",
    answers,
    clientSlug: doc.clientSlug ?? null,
    resumeEmailSentTo: doc.resumeEmailSentTo ?? null,
    startedAt: doc.startedAt ?? null,
    submittedAt: doc.submittedAt ?? null,
  };
}

/**
 * Create or update the draft.
 *
 * One Sanity round trip per save, not three. The obvious version —
 * createIfNotExists, then read back the status, then patch — cost about three
 * seconds per autosave on a normal connection, which is three seconds of
 * "Saving…" after every answer on a phone.
 *
 * Instead: the first save creates the document outright, and every save after
 * it is a patch selected by query. The query carries the guard that used to
 * need its own request — a document that has been submitted matches nothing,
 * so a late autosave arriving after the client hit send cannot overwrite the
 * final answers with a slightly older copy.
 *
 * Returns `false` when nothing was updated, which means the questionnaire has
 * already been submitted.
 */
export async function saveDraft({
  id,
  answers,
  clientSlug,
  isFirstSave,
}: {
  id: string;
  answers: Answers;
  clientSlug?: string;
  /** True when the client had no id yet, so this save is what creates the document. */
  isFirstSave: boolean;
}): Promise<boolean> {
  const client = writeClient();
  const now = new Date().toISOString();
  const body = documentBody(answers);

  if (isFirstSave) {
    await client.createIfNotExists({
      _id: id,
      _type: ONBOARDING_TYPE,
      submissionId: id,
      status: "draft",
      startedAt: now,
      updatedAt: now,
      ...(clientSlug ? { clientSlug } : {}),
      ...body,
    });
    return true;
  }

  const result = await client
    .patch({ query: `*[_id == $id && _type == $type && status != "submitted"]`, params: { id, type: ONBOARDING_TYPE } })
    .setIfMissing({ startedAt: now })
    .set({ ...body, updatedAt: now })
    .commit({ autoGenerateArrayKeys: false, returnDocuments: false });

  // No match means the document is gone or already submitted. A missing
  // document is the awkward case: the client holds an id we no longer have, so
  // recreate it rather than silently dropping their answers.
  if (result.results.length > 0) return true;

  const existing = await client.fetch<string | null>(
    `*[_id == $id][0].status`,
    { id },
    { cache: "no-store" },
  );
  if (existing === "submitted") return false;

  await client.createIfNotExists({
    _id: id,
    _type: ONBOARDING_TYPE,
    submissionId: id,
    status: "draft",
    startedAt: now,
    updatedAt: now,
    ...(clientSlug ? { clientSlug } : {}),
    ...body,
  });
  return true;
}

export async function markSubmitted(id: string, answers: Answers): Promise<void> {
  const now = new Date().toISOString();
  await writeClient()
    .patch(id)
    .set({ ...documentBody(answers), status: "submitted", submittedAt: now, updatedAt: now })
    .commit({ autoGenerateArrayKeys: false });
}

/**
 * Claim the right to send the resume email, atomically.
 *
 * Checking "has it been sent?" and then sending is a race: two saves a
 * heartbeat apart both read "no" and the client gets two identical emails.
 * The window got wider once sending moved after the response.
 *
 * So the claim is the write. The patch only matches a document that has no
 * `resumeEmailSentTo` yet, and Sanity tells us how many documents it touched —
 * one means we won and should send, zero means somebody else got there first.
 *
 * Returns true if the caller now owns the send.
 */
export async function claimResumeEmail(id: string, email: string): Promise<boolean> {
  const result = await writeClient()
    .patch({
      query: `*[_id == $id && _type == $type && !defined(resumeEmailSentTo)]`,
      params: { id, type: ONBOARDING_TYPE },
    })
    .set({ resumeEmailSentTo: email })
    .commit({ returnDocuments: false });

  return result.results.length > 0;
}

/**
 * Give the claim back after a failed send, so a later save tries again rather
 * than leaving the client with no link and us thinking we sent one.
 */
export async function releaseResumeEmail(id: string): Promise<void> {
  try {
    await writeClient().patch(id).unset(["resumeEmailSentTo"]).commit({ returnDocuments: false });
  } catch (err) {
    console.error("[onboarding] could not release the resume-email claim", err);
  }
}
