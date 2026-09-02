import "server-only";
import type { Answers } from "./types";

/**
 * A full questionnaire with a few long text answers and a handful of rows is
 * comfortably under 100 KB. The cap is here so an unauthenticated public
 * endpoint cannot be used to write arbitrarily large documents into Sanity.
 */
const MAX_ANSWERS_BYTES = 256 * 1024;

export type ParsedBody =
  | { ok: true; answers: Answers; id?: string; clientSlug?: string; resumeEmailSent: boolean }
  | { ok: false; error: string; status: number };

export async function parseBody(request: Request): Promise<ParsedBody> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, error: "Invalid request.", status: 400 };
  }

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }

  const body = raw as Record<string, unknown>;
  const answers = body.answers;
  if (typeof answers !== "object" || answers === null || Array.isArray(answers)) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }

  if (JSON.stringify(answers).length > MAX_ANSWERS_BYTES) {
    return { ok: false, error: "That's more than we can store. Try trimming the longer answers.", status: 413 };
  }

  const id = typeof body.id === "string" && /^onb-[\w-]{4,64}$/.test(body.id) ? body.id : undefined;
  const clientSlug =
    typeof body.clientSlug === "string" && /^[\w-]{1,64}$/.test(body.clientSlug) ? body.clientSlug : undefined;

  // A hint from the client that it has already been told the resume email went
  // out. It saves a Sanity lookup on every subsequent autosave. Worst case a
  // client lies and suppresses its own email, which harms nobody but them.
  const resumeEmailSent = body.resumeEmailSent === true;

  return { ok: true, answers: answers as Answers, id, clientSlug, resumeEmailSent };
}

/**
 * The origin to use when there is no request to read — building a file link
 * while writing the Sanity document, for instance. The file route is served on
 * both hosts, so the onboarding subdomain is always a valid choice.
 */
export function configuredOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_ONBOARDING_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://onboarding.domisearch.com"
  ).replace(/\/$/, "");
}

/** The public origin this request arrived on, so resume links point back at it. */
export function originOf(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_ONBOARDING_URL;
  if (configured) return configured.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) return `${proto}://${forwardedHost}`;
  return "https://onboarding.domisearch.com";
}
