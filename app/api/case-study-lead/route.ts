import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const schema = z.object({
  name: z.string().min(1).max(120),
  // note: no honeypot — it was silently dropping real (autofilled) submissions.
  business: z.string().min(1).max(160),
  phone: z.string().min(5).max(40),
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
    return NextResponse.json(
      { error: "Please enter your name, business, phone and a valid work email." },
      { status: 422 },
    );
  }
  const { name, business, phone, email } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "noreply@domisearch.com";
  const notifyTo = process.env.CONTACT_TO_EMAIL ?? site.email;

  if (!apiKey) {
    console.error("[case-study-lead] RESEND_API_KEY missing - lead not delivered:", {
      name,
      business,
      email,
      phone,
    });
    // Don't fail the visitor; the lead is at least logged and they still unlock.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  // Internal notification to Ben - the lead. The Resend SDK returns { error }
  // on API failures (e.g. a 429 rate-limit) rather than throwing, so we must
  // check it and retry with backoff - otherwise a failed send would fall through
  // to a silent success and the lead would be lost.
  let delivered = false;
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3 && !delivered; attempt++) {
    if (attempt > 0) await sleep(800 * attempt); // 0ms, 800ms, 1600ms
    try {
      const { error } = await resend.emails.send({
        from: `DomiSearch Website <${fromEmail}>`,
        to: [notifyTo],
        replyTo: email,
        subject: `Taxd case study lead: ${name} (${business})`,
        text: `New Taxd case study lead (from the paid landing page).

Name:     ${name}
Business: ${business}
Email:    ${email}
Phone:    ${phone}

Reply to this email to reach them.`,
        html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">New Taxd case study lead</h2>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Business:</strong> ${business}</p>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #01634c;">${email}</a></p>
          <p style="line-height: 1.6; margin: 0 0 16px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #01634c;">${phone}</a></p>
          <p style="line-height: 1.6; margin: 0; color: #666; font-size: 14px;">From the Taxd case study landing page (paid traffic).</p>
        </div>
      `,
      });
      if (error) {
        lastErr = error;
        console.error(`[case-study-lead] send error (attempt ${attempt + 1})`, error);
      } else {
        delivered = true;
      }
    } catch (err) {
      lastErr = err;
      console.error(`[case-study-lead] send threw (attempt ${attempt + 1})`, err);
    }
  }

  if (!delivered) {
    console.error("[case-study-lead] lead NOT delivered after retries:", { name, business, email, phone, lastErr });
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }

  // Trail on success too, so every captured lead is visible in Vercel logs.
  console.log("[case-study-lead] LEAD:", { name, business, email, phone });

  // Add to the marketing audience (best-effort - never block the unlock, and
  // run after the email is confirmed so it can't starve the send of a
  // rate-limit slot).
  if (audienceId) {
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
        firstName,
        lastName: rest.join(" ") || undefined,
      });
      if (error && !/already exists/i.test(error.message ?? "")) {
        console.error("[case-study-lead] audience add failed (non-fatal)", error);
      }
    } catch (err) {
      console.error("[case-study-lead] audience add threw (non-fatal)", err);
    }
  }

  return NextResponse.json({ ok: true });
}
