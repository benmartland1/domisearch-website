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

  const expectedKeys = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "VISIBILITY_PASSWORD"];
  const report: Record<string, { present: boolean; length: number; prefix: string }> = {};
  for (const k of expectedKeys) {
    const v = process.env[k];
    report[k] = {
      present: Boolean(v),
      length: v ? v.length : 0,
      prefix: v ? `${v.slice(0, 6)}…` : "",
    };
  }

  // Catch typos: list any env var whose name contains "OPEN", "AI", "GPT", or "CHAT" (case-insensitive)
  const hintNeedles = ["OPEN", "GPT", "CHAT", "OAI"];
  const suspectMatches: Record<string, { length: number; prefix: string }> = {};
  for (const key of Object.keys(process.env)) {
    const upper = key.toUpperCase();
    if (hintNeedles.some((n) => upper.includes(n))) {
      const v = process.env[key];
      suspectMatches[key] = {
        length: v ? v.length : 0,
        prefix: v ? `${v.slice(0, 6)}…` : "",
      };
    }
  }

  return NextResponse.json({
    deploy_id: process.env.VERCEL_DEPLOYMENT_ID ?? "unknown",
    region: process.env.VERCEL_REGION ?? "unknown",
    env_vars: report,
    possible_openai_typos: suspectMatches,
    total_env_var_count: Object.keys(process.env).length,
  });
}
