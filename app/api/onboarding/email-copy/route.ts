import { NextResponse } from "next/server";
import { copyEmail } from "@/lib/onboarding/email";
import { send } from "@/lib/onboarding/mailer";
import { clientKey, throttled } from "@/lib/onboarding/throttle";
import { loadSubmission, signedUploads } from "@/lib/onboarding/store";
import { summarise } from "@/lib/onboarding/summary";
import { verifyResumeToken } from "@/lib/onboarding/token";
import { asText, isEmail } from "@/lib/onboarding/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * "Email me a copy of my answers", from the thank-you screen.
 *
 * Reads from the stored document rather than from whatever the browser posts,
 * and only ever sends to the address inside that document — so the endpoint
 * cannot be used to mail someone else's questionnaire to an attacker, even
 * with a valid token.
 */
export async function POST(request: Request) {
  if (throttled(clientKey(request))) {
    return NextResponse.json({ error: "Too many attempts. Give it a moment." }, { status: 429 });
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = verifyResumeToken(token);
  if (!id) return NextResponse.json({ error: "That link isn't valid." }, { status: 404 });

  try {
    const submission = await loadSubmission(id);
    if (!submission) return NextResponse.json({ error: "We couldn't find that submission." }, { status: 404 });

    const to = asText(submission.answers.email);
    if (!to || !isEmail(to)) {
      return NextResponse.json({ error: "There's no email address on this submission to send to." }, { status: 422 });
    }

    const result = await send({
      to,
      ...copyEmail({
        companyName: asText(submission.answers.companyName),
        sections: summarise(submission.answers),
        uploads: signedUploads(submission.answers),
      }),
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Couldn't send that just now. Email hi@domisearch.com and we'll forward it." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, to });
  } catch (err) {
    console.error("[onboarding/email-copy]", err);
    return NextResponse.json({ error: "Couldn't send that just now." }, { status: 503 });
  }
}
