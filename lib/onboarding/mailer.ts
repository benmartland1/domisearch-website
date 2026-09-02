import "server-only";
import { Resend } from "resend";

export const TEAM_INBOX = process.env.ONBOARDING_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? "hi@domisearch.com";
const FROM = process.env.ONBOARDING_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? "onboarding@domisearch.com";

export type MailResult = { ok: true } | { ok: false; reason: string };

/**
 * Send, and never throw.
 *
 * Every caller here is in the middle of doing something more important than
 * sending an email — saving a client's answers, or accepting their
 * submission. A mail outage must degrade the experience, not fail the write.
 */
export async function send({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[onboarding] RESEND_API_KEY missing — email not sent:", subject);
    return { ok: false, reason: "mail-not-configured" };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: `DomiSearch <${FROM}>`,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error("[onboarding] Resend error", error);
      return { ok: false, reason: "send-failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[onboarding] send threw", err);
    return { ok: false, reason: "send-failed" };
  }
}
