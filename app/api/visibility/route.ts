import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const inputSchema = z.object({
  company: z.string().min(1).max(120),
  url: z.string().url().max(300),
  industry: z.string().min(1).max(120),
  location: z.string().min(1).max(120),
  description: z.string().max(500).optional().or(z.literal("")),
});

type Lead = z.infer<typeof inputSchema>;

type Analysis = {
  prompt: string;
  response: string;
  target_mentioned: boolean;
  target_recommended: boolean;
  competitors: string[];
  answer_summary: string;
  error?: string;
};

type ReportPayload = {
  company: string;
  url: string;
  industry: string;
  location: string;
  visibility_score: number;
  visibility_band: "Invisible" | "Barely visible" | "Patchy" | "Visible";
  mentions: number;
  recommended: number;
  total: number;
  top_competitors: { name: string; count: number }[];
  prompts: Analysis[];
};

const OPENAI_MODEL = "gpt-4o";
const ANTHROPIC_MODEL = "claude-sonnet-4-5";
const ANTHROPIC_VERSION = "2023-06-01";

function bandFromScore(score: number): ReportPayload["visibility_band"] {
  if (score < 10) return "Invisible";
  if (score < 30) return "Barely visible";
  if (score < 60) return "Patchy";
  return "Visible";
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function stringMatch(company: string, domain: string, text: string): boolean {
  const low = text.toLowerCase();
  if (domain && low.includes(domain.toLowerCase())) return true;
  const name = company
    .toLowerCase()
    .replace(/\b(ltd|limited|llc|inc|clinic|aesthetics|co)\b/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
  return !!name && low.includes(name);
}

async function fetchBrandContext(url: string): Promise<string> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; DomiSearchBot/1.0)" },
      signal: ctrl.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const html = await res.text();
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim()
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]?.trim()
      ?? "";
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim() ?? "";
    return [title, desc, h1].filter(Boolean).slice(0, 3).join(" | ").slice(0, 600);
  } catch {
    return "";
  }
}

async function generatePrompts(lead: Lead, anthropicKey: string): Promise<string[]> {
  // Pull live homepage context for accuracy when user didn't supply a description.
  let context = lead.description?.trim() ?? "";
  if (!context) context = await fetchBrandContext(lead.url);

  const system =
    "You generate realistic buyer-intent search prompts — the exact questions a potential customer would type into ChatGPT when looking for this type of product or service. " +
    "CRITICAL: ground every prompt in what the brand ACTUALLY does (from the description below), NOT generic interpretations of the industry label. " +
    "Read the description carefully — if it's consumer-facing, write consumer prompts; if it's B2B, write B2B prompts; match the actual product. " +
    "UK phrasing for UK businesses, US English for US. " +
    "Never mention the brand name itself (we are testing whether AI recommends them unprompted). " +
    "Return ONLY a JSON array of 10 strings, no markdown fences, no preamble.";

  const user = `Brand: ${lead.company}
Website: ${lead.url}
What they do: ${context || "(no description provided — infer carefully from URL and industry)"}
Industry label: ${lead.industry}
Primary market: ${lead.location}

Generate 10 prompts a real buyer of THIS specific product/service would type into ChatGPT:
- ~40% direct/category intent ("best X for Y", "top X in UK")
- ~30% comparison/research ("X vs Y", "how to choose X")
- ~30% problem-led ("I need to do X but...", "struggling with Y")`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic prompts error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = (data.content || []).find((c: { type: string }) => c.type === "text")?.text ?? "";
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
  }
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array found in prompt response");
  const arr = JSON.parse(cleaned.slice(start, end + 1));
  return arr.map(String).filter(Boolean).slice(0, 10);
}

async function queryOpenAI(prompt: string, openaiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: prompt,
      max_output_tokens: 1500,
      tools: [{ type: "web_search" }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.output_text) return String(data.output_text).trim();
  // Fallback: walk the output array for assistant message text
  const outputArr = data.output || [];
  for (const item of outputArr) {
    if (item.type === "message" && item.content) {
      for (const c of item.content) {
        if (c.type === "output_text" && c.text) return String(c.text).trim();
      }
    }
  }
  return "";
}

async function extractMentions(
  company: string,
  domain: string,
  prompt: string,
  responseText: string,
  anthropicKey: string,
): Promise<Omit<Analysis, "prompt" | "response">> {
  const system = "You analyse an AI assistant's answer to a buyer-intent question. Return ONLY JSON, no fences.";
  const user = `Determine, for the target company below:
  "target_mentioned": is the target (or its website domain) named or linked?
  "target_recommended": is it actively recommended (not just mentioned)?
  "competitors": every specific company/brand recommended INSTEAD (names only, max 8)
  "answer_summary": one sentence summarising what the AI told this potential customer

Target company: ${company} | Domain: ${domain}
Question asked: ${prompt}
AI answer: ${responseText}

Return JSON with exactly those four keys.`;

  const stringHit = stringMatch(company, domain, responseText);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 600,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`extract ${res.status}`);
    const data = await res.json();
    const text: string = (data.content || []).find((c: { type: string }) => c.type === "text")?.text ?? "";
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("no json");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return {
      target_mentioned: Boolean(parsed.target_mentioned),
      target_recommended: Boolean(parsed.target_recommended),
      competitors: Array.isArray(parsed.competitors)
        ? parsed.competitors.map((c: unknown) => String(c).trim()).filter(Boolean).slice(0, 8)
        : [],
      answer_summary: typeof parsed.answer_summary === "string" ? parsed.answer_summary.trim() : "",
    };
  } catch {
    return {
      target_mentioned: stringHit,
      target_recommended: false,
      competitors: [],
      answer_summary: "",
    };
  }
}

export async function POST(request: Request) {
  // Password gate
  const provided = request.headers.get("x-visibility-token") ?? "";
  const expected = process.env.VISIBILITY_PASSWORD;
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 422 });
  }
  const lead = parsed.data;

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const missing: string[] = [];
  if (!openaiKey) missing.push("OPENAI_API_KEY");
  if (!anthropicKey) missing.push("ANTHROPIC_API_KEY");
  if (missing.length > 0 || !openaiKey || !anthropicKey) {
    return NextResponse.json(
      { error: `Missing env var(s) on Vercel: ${missing.join(", ")}. Add them in Settings → Environment Variables, then redeploy without build cache.` },
      { status: 500 },
    );
  }

  try {
    // 1. Generate prompts
    const prompts = await generatePrompts(lead, anthropicKey);
    if (prompts.length === 0) throw new Error("No prompts generated");

    // 2. Query ChatGPT for each prompt in parallel
    const responses = await Promise.all(
      prompts.map(async (p) => {
        try {
          const r = await queryOpenAI(p, openaiKey);
          return { prompt: p, response: r, error: undefined as string | undefined };
        } catch (e) {
          return { prompt: p, response: "", error: e instanceof Error ? e.message : "unknown" };
        }
      }),
    );

    // 3. Extract mentions per response
    const domain = domainFromUrl(lead.url);
    const analyses: Analysis[] = await Promise.all(
      responses.map(async (r) => {
        if (r.error || !r.response) {
          return {
            prompt: r.prompt,
            response: r.response,
            target_mentioned: false,
            target_recommended: false,
            competitors: [],
            answer_summary: "",
            error: r.error,
          };
        }
        const extracted = await extractMentions(lead.company, domain, r.prompt, r.response, anthropicKey);
        return { prompt: r.prompt, response: r.response, ...extracted };
      }),
    );

    // 4. Aggregate
    const valid = analyses.filter((a) => !a.error);
    const mentions = valid.filter((a) => a.target_mentioned).length;
    const recommended = valid.filter((a) => a.target_recommended).length;
    const total = valid.length || prompts.length;
    const score = total > 0 ? Math.round((mentions / total) * 100) : 0;

    const counts = new Map<string, number>();
    for (const a of valid) {
      for (const c of a.competitors) {
        const key = c.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const top_competitors = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const payload: ReportPayload = {
      company: lead.company,
      url: lead.url,
      industry: lead.industry,
      location: lead.location,
      visibility_score: score,
      visibility_band: bandFromScore(score),
      mentions,
      recommended,
      total,
      top_competitors,
      prompts: analyses,
    };
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[visibility] failed", err);
    return NextResponse.json(
      { error: "Visibility check failed", detail: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
