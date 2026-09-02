import { NextResponse } from "next/server";
import { confirmationEmail, notificationEmail } from "@/lib/onboarding/email";
import { QUESTIONS } from "@/lib/onboarding/questions";
import { send, TEAM_INBOX } from "@/lib/onboarding/mailer";
import { parseBody } from "@/lib/onboarding/request";
import { clientKey, throttled } from "@/lib/onboarding/throttle";
import { loadSubmission, markSubmitted, saveDraft, signedUploads, studioUrl } from "@/lib/onboarding/store";
import { summarise } from "@/lib/onboarding/summary";
import { newSubmissionId, resumeToken } from "@/lib/onboarding/token";
import { asText, isEmail } from "@/lib/onboarding/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Final submission.
 *
 * Required answers are re-checked here rather than trusted from the client:
 * the form validates as you go, but the form is not the thing that decides
 * whether a submission is complete.
 */
export async function POST(request: Request) {
  if (throttled(clientKey(request))) {
    return NextResponse.json({ error: "Too many attempts. Give it a moment." }, { status: 429 });
  }

  const parsed = await parseBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const { answers } = parsed;

  for (const question of QUESTIONS) {
    if (!question.required) continue;
    if (question.when && !question.when(answers)) continue;
    const problem = question.validate?.(answers) ?? (asText(answers[question.id]) ? null : `${question.emailLabel ?? question.label} is still blank.`);
    if (problem) {
      return NextResponse.json({ error: problem, questionId: question.id }, { status: 422 });
    }
  }

  const id = parsed.id ?? newSubmissionId();
  const companyName = asText(answers.companyName);
  const contactName = asText(answers.fullName);
  const contactEmail = asText(answers.email);
  const firstName = contactName.split(/\s+/)[0] ?? "";

  try {
    const existing = parsed.id ? await loadSubmission(id) : null;
    if (existing?.status === "submitted") {
      // A double-tap, or a retry after a flaky connection. The client should
      // land on the thank-you screen either way rather than see an error.
      return NextResponse.json({ id, token: resumeToken(id), alreadySubmitted: true });
    }

    if (!existing) {
      await saveDraft({ id, answers, clientSlug: parsed.clientSlug, isFirstSave: true });
    }
    await markSubmitted(id, answers);
  } catch (err) {
    console.error("[onboarding/submit] store", err);
    return NextResponse.json(
      { error: "We couldn't file that. Give it another go, or email hi@domisearch.com and we'll take it from there." },
      { status: 503 },
    );
  }

  const sections = summarise(answers);
  const uploads = signedUploads(answers);

  // Emails are best-effort: the answers are already safe in Sanity, and a mail
  // failure must not tell the client their submission was lost.
  const notification = await send({
    to: TEAM_INBOX,
    replyTo: contactEmail && isEmail(contactEmail) ? contactEmail : undefined,
    ...notificationEmail({
      companyName,
      contactName,
      contactEmail,
      sections,
      uploads,
      studioHref: studioUrl(id),
    }),
  });
  if (!notification.ok) console.error("[onboarding/submit] notification not sent", notification.reason);

  if (contactEmail && isEmail(contactEmail)) {
    const confirmation = await send({
      to: contactEmail,
      replyTo: TEAM_INBOX,
      ...confirmationEmail({ firstName, companyName }),
    });
    if (!confirmation.ok) console.error("[onboarding/submit] confirmation not sent", confirmation.reason);
  }

  // The token goes back so the thank-you screen can offer a copy of the
  // answers even when the resume email never went out.
  return NextResponse.json({ id, token: resumeToken(id), ok: true });
}
