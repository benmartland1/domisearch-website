import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(200),
});

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
  }
  const { email } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "noreply@domisearch.com";
  const notifyTo = process.env.CONTACT_TO_EMAIL ?? site.email;

  if (!apiKey) {
    console.error("[newsletter] RESEND_API_KEY missing - signup not stored:", email);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  let alreadySubscribed = false;

  // Add contact to audience (if configured)
  if (audienceId) {
    try {
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (error) {
        if (/already exists/i.test(error.message ?? "")) {
          alreadySubscribed = true;
        } else {
          console.error("[newsletter] Resend audience error", error);
          return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
        }
      }
    } catch (err) {
      console.error("[newsletter] create failed", err);
      return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
    }
  } else {
    console.warn(`[newsletter] RESEND_AUDIENCE_ID not set - subscriber not stored: ${email}`);
  }

  // Send welcome email to subscriber + internal notification
  // Do not block the response if either fails.
  if (!alreadySubscribed) {
    const welcomeHtml = `
      <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
        <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600;">You're in.</h2>
        <p style="line-height: 1.6; margin: 0 0 16px;">
          Thanks for subscribing to the DomiSearch newsletter. You'll get monthly research, playbooks
          and field notes on Google Ads and AI Engine Optimisation - no fluff, no filler.
        </p>
        <p style="line-height: 1.6; margin: 0 0 16px;">
          If you ever want to chat about your account or AI visibility specifically,
          <a href="${site.calendly}" style="color: #01a36b;">book a call</a> and I'll take a look personally.
        </p>
        <p style="line-height: 1.6; margin: 24px 0 0;">
          - Ben<br/>
          <span style="color: #666; font-size: 14px;">Founder, DomiSearch</span>
        </p>
      </div>
    `;
    const welcomeText = `You're in.

Thanks for subscribing to the DomiSearch newsletter. You'll get monthly research, playbooks and field notes on Google Ads and AI Engine Optimisation - no fluff, no filler.

If you ever want to chat about your account or AI visibility specifically, book a call: ${site.calendly}

- Ben
Founder, DomiSearch`;

    try {
      await resend.emails.send({
        from: `Ben at DomiSearch <${fromEmail}>`,
        to: [email],
        replyTo: notifyTo,
        subject: "Welcome to DomiSearch",
        html: welcomeHtml,
        text: welcomeText,
      });
    } catch (err) {
      console.error("[newsletter] welcome email failed", err);
    }

    try {
      await resend.emails.send({
        from: `DomiSearch Website <${fromEmail}>`,
        to: [notifyTo],
        subject: `New newsletter subscriber: ${email}`,
        text: `${email} just signed up to the newsletter.`,
      });
    } catch (err) {
      console.error("[newsletter] internal notification failed", err);
    }
  }

  return NextResponse.json({ ok: true, duplicate: alreadySubscribed });
}
