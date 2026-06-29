import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  domain: z.string().min(3).max(300),
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(40),
  // Honeypot - must be empty.
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
      { error: "Please enter your name, a valid email and phone number." },
      { status: 422 },
    );
  }
  const { domain, name, email, phone, hp_company } = parsed.data;

  // Honeypot - pretend success, do nothing.
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

  if (!apiKey) {
    console.error("[report-request] RESEND_API_KEY missing - lead not delivered:", { host, email });
    // Don't fail the visitor; the lead is at least logged.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  // Internal notification to Ben - the lead.
  try {
    await resend.emails.send({
      from: `DomiSearch Website <${fromEmail}>`,
      to: [notifyTo],
      replyTo: email,
      subject: `AI Visibility Report request: ${name} (${host})`,
      text: `New AI Visibility Report lead (from the paid landing page).

Name:   ${name}
Domain: ${host}
Email:  ${email}
Phone:  ${phone}

Generate the report and bring it to the booking call. Reply to this email to reach them.`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">New AI Visibility Report lead</h2>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Domain:</strong> <a href="https://${host}" style="color: #01634c;">${host}</a></p>
          <p style="line-height: 1.6; margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #01634c;">${email}</a></p>
          <p style="line-height: 1.6; margin: 0 0 16px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #01634c;">${phone}</a></p>
          <p style="line-height: 1.6; margin: 0; color: #666; font-size: 14px;">From the paid landing page. Generate the report and bring it to the booking call.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[report-request] internal notification failed", err);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }

  // Trigger the AI Visibility Report generator (GitHub Actions) for this lead.
  // Fire-and-forget: a failure here must never block the visitor or lose the
  // lead — Ben already has the lead email above. Nothing is sent to the prospect.
  const ghToken = process.env.GITHUB_DISPATCH_TOKEN;
  if (ghToken) {
    try {
      const dispatch = await fetch(
        "https://api.github.com/repos/benmartland1/ai-visibility-report-generator/dispatches",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_type: "new-lead",
            client_payload: { domain: host, name, email },
          }),
        },
      );
      if (!dispatch.ok) {
        console.error("[report-request] dispatch failed", dispatch.status, await dispatch.text());
      }
    } catch (err) {
      console.error("[report-request] dispatch error", err);
    }
  } else {
    console.warn("[report-request] GITHUB_DISPATCH_TOKEN missing — generation not triggered");
  }

  return NextResponse.json({ ok: true });
}
