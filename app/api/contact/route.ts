import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1, "Please enter your name.").max(120),
  email: z.string().email("Please enter a valid email address.").max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  budget: z.string().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .min(3, "Please add a short message.")
    .max(5000),
});

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check your details and try again." },
      { status: 422 }
    );
  }
  const { name, email, company, budget, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "website@domisearch.com";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY missing");
    return NextResponse.json(
      { error: "Mail service not configured. Please email hi@domisearch.com directly." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const subject = `New enquiry from ${name}${company ? ` (${company})` : ""}`;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; background: #090909; color: #dddfde; padding: 32px;">
      <h2 style="color: #eeffff; margin: 0 0 24px;">New website enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #aaa; width: 120px;">Name</td><td>${escape(name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td><a style="color:#01e890" href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
        ${company ? `<tr><td style="padding: 8px 0; color: #aaa;">Company</td><td>${escape(company)}</td></tr>` : ""}
        ${budget ? `<tr><td style="padding: 8px 0; color: #aaa;">Budget</td><td>${escape(budget)}</td></tr>` : ""}
      </table>
      <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 24px 0;" />
      <div style="white-space: pre-wrap; line-height: 1.6;">${escape(message)}</div>
    </div>
  `;

  const text = [
    `New enquiry from ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    budget ? `Budget: ${budget}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: `DomiSearch Website <${from}>`,
      to: [to],
      replyTo: email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json({ error: "Could not send message." }, { status: 500 });
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
