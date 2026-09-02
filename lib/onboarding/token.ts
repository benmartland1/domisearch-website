import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Resume links.
 *
 * The link is the only thing standing between a stranger and someone else's
 * half-finished onboarding, so the id alone is not enough: it is signed, and
 * the signature is checked before we ever read the document. The secret is
 * shared with nothing else that matters, and falls back to the Sanity
 * revalidate secret so a deploy that forgets one variable still signs rather
 * than silently accepting anything.
 */
function secret(): string {
  const value = process.env.ONBOARDING_SECRET ?? process.env.SANITY_REVALIDATE_SECRET;
  if (!value) {
    throw new Error(
      "ONBOARDING_SECRET is not set. Generate one with `openssl rand -hex 32` and add it to the environment — resume links cannot be signed without it.",
    );
  }
  return value;
}

/** URL-safe, unambiguous, and short enough to sit in an email without wrapping. */
export function newSubmissionId(): string {
  return `onb-${randomBytes(9).toString("base64url")}`;
}

function sign(id: string): string {
  return createHmac("sha256", secret()).update(id).digest("base64url").slice(0, 32);
}

export function resumeToken(id: string): string {
  return `${id}.${sign(id)}`;
}

/** Returns the submission id, or null if the token is malformed or forged. */
export function verifyResumeToken(token: string): string | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const id = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!/^onb-[\w-]{4,64}$/.test(id)) return null;

  const expected = Buffer.from(sign(id));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return null;
  return timingSafeEqual(expected, provided) ? id : null;
}

export function resumeUrl(id: string, origin: string): string {
  return `${origin.replace(/\/$/, "")}/?resume=${encodeURIComponent(resumeToken(id))}`;
}

// ------------------------------------------------------------------ files

/**
 * Signed links to uploaded files.
 *
 * The blob store is private, so a raw blob URL opens nothing. These links go
 * to `/api/onboarding/file`, which verifies the signature and streams the
 * file. They do not expire — the notification email sits in an inbox and gets
 * opened weeks later — but every one of them dies the moment ONBOARDING_SECRET
 * is rotated, which is the revocation lever a public blob URL never had.
 *
 * Signed separately from resume tokens so that neither can be replayed as the
 * other.
 */
function signFile(pathname: string): string {
  return createHmac("sha256", secret()).update(`file:${pathname}`).digest("base64url").slice(0, 32);
}

export function verifyFileSignature(pathname: string, signature: string): boolean {
  const expected = Buffer.from(signFile(pathname));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

export function fileUrl(pathname: string, origin: string): string {
  const params = new URLSearchParams({ p: pathname, sig: signFile(pathname) });
  return `${origin.replace(/\/$/, "")}/api/onboarding/file?${params.toString()}`;
}
