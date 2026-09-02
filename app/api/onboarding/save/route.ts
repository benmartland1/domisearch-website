import { after, NextResponse } from "next/server";
import { resumeEmail } from "@/lib/onboarding/email";
import { send } from "@/lib/onboarding/mailer";
import { originOf, parseBody } from "@/lib/onboarding/request";
import { claimResumeEmail, releaseResumeEmail, saveDraft } from "@/lib/onboarding/store";
import { clientKey, throttled } from "@/lib/onboarding/throttle";
import { newSubmissionId, resumeToken, resumeUrl } from "@/lib/onboarding/token";
import { asText, isEmail } from "@/lib/onboarding/validation";

/** Has the client actually written anything worth a document? */
function hasContent(answers: Record<string, unknown>): boolean {
  return Object.values(answers).some((value) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.values(value).some((v) => String(v ?? "").trim());
    return false;
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Autosave.
 *
 * Called after every answer, debounced by the client. It is deliberately
 * forgiving: partial answers, no email yet, no id yet. The one thing it will
 * not do is resurrect a submitted questionnaire.
 *
 * The resume email goes out the first time we have an address to send it to,
 * not on the literal first save — on the first save the client has typed a
 * name and nothing else.
 */
export async function POST(request: Request) {
  if (throttled(clientKey(request))) {
    return NextResponse.json({ error: "Too many saves. Give it a moment." }, { status: 429 });
  }

  const parsed = await parseBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  // Don't create a document for someone who has opened the page and typed
  // nothing. Without this, every bot that finds the endpoint leaves an empty
  // record behind, and the real submissions get lost among them.
  if (!parsed.id && !hasContent(parsed.answers)) {
    return NextResponse.json({ id: null, pending: true });
  }

  const id = parsed.id ?? newSubmissionId();
  const email = asText(parsed.answers.email);
  const firstName = asText(parsed.answers.fullName).split(/\s+/)[0] ?? "";

  try {
    const saved = await saveDraft({
      id,
      answers: parsed.answers,
      clientSlug: parsed.clientSlug,
      isFirstSave: !parsed.id,
    });
    if (!saved) {
      return NextResponse.json({ id, submitted: true }, { status: 200 });
    }

    // The resume email happens after the response, not before it.
    //
    // Sending it inline meant the one save that first carries a valid email
    // address blocked on a Sanity lookup, a Resend call and a second Sanity
    // write — several seconds of "Saving…" for something the client is not
    // waiting on. They are still typing; the email can catch up.
    const shouldSendEmail = !parsed.resumeEmailSent && Boolean(email) && isEmail(email);

    if (shouldSendEmail) {
      // Read off the request now: it is not ours to touch once we've responded.
      const href = resumeUrl(id, originOf(request));
      after(async () => {
        try {
          // Claim first, send second. Reading "has it been sent?" and then
          // sending lets two near-simultaneous saves both decide they are the
          // first, and the client gets the same email twice.
          if (!(await claimResumeEmail(id, email))) return;

          const result = await send({ to: email, ...resumeEmail({ firstName, href }) });
          if (!result.ok) await releaseResumeEmail(id);
        } catch (err) {
          console.error("[onboarding/save] resume email failed", err);
          await releaseResumeEmail(id);
        }
      });
    }

    // Optimistic: it reports that we have taken responsibility for the email,
    // not that it has landed. That is what the flag is for — it stops the
    // client asking again this session. If the send does fail, nothing is
    // recorded against the document, so a later session tries once more.
    return NextResponse.json({
      id,
      token: resumeToken(id),
      resumeEmailSent: parsed.resumeEmailSent || shouldSendEmail,
    });
  } catch (err) {
    console.error("[onboarding/save]", err);
    // The client keeps a localStorage copy, so a failed save is recoverable.
    // Say so plainly rather than pretending it worked.
    return NextResponse.json(
      { error: "We couldn't save that just now. Your answers are still on this device — keep going and we'll retry." },
      { status: 503 },
    );
  }
}
