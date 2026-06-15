import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  url: z.string().min(3).max(300),
  // Honeypot — must be empty.
  hp_company: z.string().optional(),
});

function normaliseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
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
      { error: "Please enter a valid website and email." },
      { status: 422 },
    );
  }
  const { url, hp_company } = parsed.data;

  // Honeypot — pretend success, do nothing.
  if (hp_company) {
    return NextResponse.json({ ok: true });
  }

  const website = normaliseUrl(url);
  if (!website) {
    return NextResponse.json({ error: "Please enter a valid website." }, { status: 422 });
  }

  const cleanHost = website.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "noreply@domisearch.com";
  const notifyTo = process.env.CONTACT_TO_EMAIL ?? site.email;

  if (!apiKey) {
    console.error("[audit-request] RESEND_API_KEY missing — request not delivered:", { website });
    // Don't fail the visitor; the lead is at least logged.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  // Internal notification to Ben — the lead.
  try {
    await resend.emails.send({
      from: `DomiSearch Website <${fromEmail}>`,
      to: [notifyTo],
      subject: `AI visibility check request: ${cleanHost}`,
      text: `New AI visibility audit request.

Website: ${website}

Run the check and reach out with their audit.`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">New AI visibility audit request</h2>
          <p style="line-height: 1.6; margin: 0 0 16px;"><strong>Website:</strong> <a href="${website}" style="color: #01a36b;">${website}</a></p>
          <p style="line-height: 1.6; margin: 0; color: #666; font-size: 14px;">Run the check and reach out with their audit.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[audit-request] internal notification failed", err);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
