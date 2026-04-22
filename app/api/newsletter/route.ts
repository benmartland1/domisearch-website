import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

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

  // If Resend + audience are configured, add the contact to the audience.
  // Otherwise, log and return success so the form works out of the box.
  if (apiKey && audienceId) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (error) {
        console.error("[newsletter] Resend error", error);
        // Treat duplicate emails as success
        if (/already exists/i.test(error.message ?? "")) {
          return NextResponse.json({ ok: true, duplicate: true });
        }
        return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
      }
    } catch (err) {
      console.error("[newsletter] create failed", err);
      return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
    }
  } else {
    console.log(`[newsletter] signup (not yet connected): ${email}`);
  }

  return NextResponse.json({ ok: true });
}
