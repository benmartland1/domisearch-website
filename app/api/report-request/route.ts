import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  domain: z.string().min(3).max(300),
  email: z.string().email().max(200),
  // Honeypot — must be empty.
  hp_company: z.string().optional(),
});

function normaliseDomain(raw: string): string | null {
  const trimmed = raw.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

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
      { error: "Please enter a valid domain and email." },
      { status: 422 },
    );
  }
  const { domain, email, hp_company } = parsed.data;

  // Honeypot — pretend success, do nothing.
  if (hp_company) {
    return NextResponse.json({ ok: true });
  }

  const host = normaliseDomain(domain);
  if (!host) {
    return NextResponse.json({ error: "Please enter a valid domain." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "noreply@domisearch.com";
  const notifyTo = process.env.CONTACT_TO_EMAIL ?? site.email;

  // ── Hook point ──────────────────────────────────────────────────────────
  // This is where an automated AI-visibility report generation could be
  // triggered (queue the domain, run it through the visibility engine, email
  // the PDF). For now the lead is delivered to Ben, who generates the report
  // manually and brings it to the booking call.
  // ────────────────────────────────────────────────────────────────────────

  if (!apiKey) {
    console.error("[report-request] RESEND_API_KEY missing — lead not delivered:", { host, email });
    // Don't fail the visitor; the lead is at least logged.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  // Internal notification to Ben — the lead.
  try {
    await resend.emails.send({
      from: `DomiSearch Website <${fromEmail}>`,
      to: [notifyTo],
      replyTo: email,
      subject: `AI Visibility Report request: ${host}`,
      text: `New AI Visibility Report lead (from the paid landing page).

Domain: ${host}
Email:  ${email}

Generate the report and bring it to the booking call. Reply to this email to reach them.`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">New AI Visibility Report lead</h2>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Domain:</strong> <a href="https://${host}" style="color: #01634c;">${host}</a></p>
          <p style="line-height: 1.6; margin: 0 0 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #01634c;">${email}</a></p>
          <p style="line-height: 1.6; margin: 0; color: #666; font-size: 14px;">From the paid landing page. Generate the report and bring it to the booking call.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[report-request] internal notification failed", err);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }

  // Confirmation to the prospect.
  const confirmHtml = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
      <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600;">Your AI Visibility Report is on its way.</h2>
      <p style="line-height: 1.6; margin: 0 0 16px;">
        Thanks — we're checking <strong>${host}</strong> across ChatGPT, Google AI and Perplexity to see
        where you show up, where you don't, and which competitors are winning the answer.
      </p>
      <p style="line-height: 1.6; margin: 0 0 16px;">
        If you haven't already, book your walkthrough call and we'll go through the report together
        and the quickest gaps to close: <a href="${site.calendly}" style="color: #01634c;">${site.calendly}</a>
      </p>
      <p style="line-height: 1.6; margin: 24px 0 0;">
        — Ben<br/>
        <span style="color: #666; font-size: 14px;">Founder, DomiSearch</span>
      </p>
    </div>
  `;
  const confirmText = `Your AI Visibility Report is on its way.

Thanks — we're checking ${host} across ChatGPT, Google AI and Perplexity to see where you show up, where you don't, and which competitors are winning the answer.

If you haven't already, book your walkthrough call and we'll go through the report together: ${site.calendly}

— Ben
Founder, DomiSearch`;

  try {
    await resend.emails.send({
      from: `Ben at DomiSearch <${fromEmail}>`,
      to: [email],
      replyTo: notifyTo,
      subject: "Your AI Visibility Report is being generated",
      html: confirmHtml,
      text: confirmText,
    });
  } catch (err) {
    // Lead already reached Ben; don't fail on the confirmation.
    console.error("[report-request] confirmation email failed", err);
  }

  return NextResponse.json({ ok: true });
}
