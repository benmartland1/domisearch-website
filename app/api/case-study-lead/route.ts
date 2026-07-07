import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1).max(120),
  business: z.string().min(1).max(160),
  phone: z.string().min(5).max(40),
  email: z.string().email().max(200),
  // Honeypot - must be empty.
  hp_company: z.string().optional(),
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
  const { name, business, phone, email, hp_company } = parsed.data;

  // Honeypot - pretend success, do nothing.
  if (hp_company) {
    return NextResponse.json({ ok: true });
  }

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

  // Internal notification to Ben - the lead.
  try {
    await resend.emails.send({
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
  } catch (err) {
    console.error("[case-study-lead] internal notification failed", err);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }

  // Add to the marketing audience (best-effort - never block the unlock).
  if (audienceId) {
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
        firstName,
        lastName: rest.join(" ") || undefined,
      });
    } catch (err) {
      console.error("[case-study-lead] audience add failed (non-fatal)", err);
    }
  }

  return NextResponse.json({ ok: true });
}
