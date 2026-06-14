import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Temporary diagnostic — gated by VISIBILITY_PASSWORD header to avoid leaking secrets.
// Returns presence + length of expected env vars without exposing the values themselves.
export async function GET(request: Request) {
  const provided = request.headers.get("x-visibility-token") ?? "";
  const expected = process.env.VISIBILITY_PASSWORD;
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "VISIBILITY_PASSWORD"];
  const report: Record<string, { present: boolean; length: number; prefix: string }> = {};
  for (const k of keys) {
    const v = process.env[k];
    report[k] = {
      present: Boolean(v),
      length: v ? v.length : 0,
      prefix: v ? `${v.slice(0, 6)}…` : "",
    };
  }
  return NextResponse.json({
    deploy_id: process.env.VERCEL_DEPLOYMENT_ID ?? "unknown",
    region: process.env.VERCEL_REGION ?? "unknown",
    env_vars: report,
  });
}
