import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

const checkSchema = z.object({
  mode: z.literal("check"),
  brand: z.string().trim().min(1).max(80),
  url: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  hp_company: z.string().optional(),
});

const teardownSchema = z.object({
  mode: z.literal("teardown"),
  brand: z.string().trim().min(1).max(80),
  url: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().email().max(200),
  name: z.string().trim().min(1).max(80),
  hp_company: z.string().optional(),
});

const schema = z.discriminatedUnion("mode", [checkSchema, teardownSchema]);

type Prompt = {
  prompt: string;
  label: string;
};

function buildPrompts(brand: string, category?: string): Prompt[] {
  const cat = category?.trim();
  return [
    {
      label: "Awareness",
      prompt: `What is ${brand}? Answer in 3-4 sentences.`,
    },
    {
      label: "Category fit",
      prompt: cat
        ? `Who are the best providers of ${cat}? List 5 by name with one sentence each.`
        : `Based on what you know about ${brand}, who are their main competitors? List up to 5 by name.`,
    },
    {
      label: "Recommendation",
      prompt: cat
        ? `If someone asked you to recommend a ${cat}, would ${brand} be in your list? Why or why not?`
        : `Would you recommend ${brand} to someone? Why or why not? Be specific.`,
    },
  ];
}

type CheckResult = {
  label: string;
  prompt: string;
  response: string;
  mentioned: boolean;
  recommended: boolean;
  sentiment: "positive" | "neutral" | "negative" | "absent";
};

function scoreResponse(brand: string, response: string): Omit<CheckResult, "label" | "prompt" | "response"> {
  const lower = response.toLowerCase();
  const brandLower = brand.toLowerCase();
  const mentioned = lower.includes(brandLower);

  if (!mentioned) {
    return { mentioned: false, recommended: false, sentiment: "absent" };
  }

  const recommendSignals = [
    "recommend",
    "i'd suggest",
    "would suggest",
    "great choice",
    "strong option",
    "top pick",
    "worth considering",
    "leading",
  ];
  const negativeSignals = [
    "not recommend",
    "avoid",
    "wouldn't recommend",
    "would not recommend",
    "poor",
    "unreliable",
    "limited",
    "niche",
    "lesser-known",
    "small player",
  ];

  const hasRecommend = recommendSignals.some((s) => lower.includes(s));
  const hasNegative = negativeSignals.some((s) => lower.includes(s));

  let sentiment: CheckResult["sentiment"] = "neutral";
  if (hasRecommend && !hasNegative) sentiment = "positive";
  else if (hasNegative) sentiment = "negative";

  return { mentioned: true, recommended: hasRecommend && !hasNegative, sentiment };
}

function buildScore(results: CheckResult[]): number {
  let score = 0;
  for (const r of results) {
    if (!r.mentioned) continue;
    score += 15;
    if (r.sentiment === "positive") score += 10;
    if (r.recommended) score += 10;
    if (r.sentiment === "negative") score -= 5;
  }
  return Math.max(0, Math.min(100, score));
}

function buildRecommendations(results: CheckResult[], brand: string): string[] {
  const missing = results.filter((r) => !r.mentioned);
  const negative = results.filter((r) => r.sentiment === "negative");
  const neutral = results.filter((r) => r.mentioned && r.sentiment === "neutral");

  const recs: string[] = [];
  if (missing.length === results.length) {
    recs.push(
      `${brand} isn't cited in any of these prompts. Start with entity clarity - Wikipedia, Wikidata, LinkedIn and schema - so models recognise you as a distinct brand in your category.`
    );
    recs.push(
      "Build AI-citable service pages. One page per offer, with a definition line, structured body and FAQ - the format models extract from cleanly."
    );
    recs.push(
      "Ship citation ops. Earn placements in Reddit, third-party listicles and category comparison content - ChatGPT and Perplexity pull heavily from these sources."
    );
  } else if (missing.length > 0) {
    recs.push(
      `You're visible for ${results.length - missing.length} of ${results.length} prompts. The missing ${missing.length} are where your competitors are winning today.`
    );
    recs.push(
      "Target the missing prompts with AI-ready comparison content - structured, factual, with named entities and clear answers."
    );
    recs.push(
      "Run monthly re-checks. Models change weekly and citation volatility is real - what's missing today can be fixed in 60–90 days with the right content + entity work."
    );
  } else if (negative.length > 0) {
    recs.push(
      `${brand} is cited but framed weakly in at least one prompt. That's a positioning problem - the AI has incomplete or outdated information.`
    );
    recs.push(
      "Publish a definitive About / positioning page with clear entity signals, case study metrics and named team members. Then seed it via PR to credible outlets models cite from."
    );
    recs.push(
      "Correct the narrative aggressively - fresh content, updated Wikipedia, new third-party mentions. Models update their weighting every 30–90 days."
    );
  } else if (neutral.length > 0) {
    recs.push(
      `${brand} is in the answer but not as the top choice. That's the hardest position - visible but not preferred.`
    );
    recs.push(
      "Ship proof content: case studies, named customer revenue, third-party reviews. Models reward the brand with the deepest verifiable evidence."
    );
    recs.push(
      "Expand category coverage with 'best X for Y' content - earn citations in the comparison surface where buyers actually decide."
    );
  } else {
    recs.push(
      `${brand} is winning these prompts. The play now is expansion - identify 20+ adjacent prompts your buyers ask, then scale into them.`
    );
    recs.push(
      "Build a prompt dashboard. If you're cited for 5, you're likely missing 50 more that move pipeline. Measurement closes the gap."
    );
    recs.push(
      "Lock in defence. As new players emerge, your share of voice erodes naturally - content cadence and citation ops keep you ahead."
    );
  }

  return recs.slice(0, 3);
}

async function runClaudePrompt(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected Anthropic response");
  return text;
}

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
    return NextResponse.json({ error: "Please check your details." }, { status: 422 });
  }

  const payload = parsed.data;
  // Silent honeypot success
  if (payload.hp_company) {
    return NextResponse.json({ ok: true, honeypot: true });
  }

  // ---------------- Instant visibility check ----------------
  if (payload.mode === "check") {
    const { brand, category } = payload;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    const prompts = buildPrompts(brand, category);

    if (!apiKey) {
      // Graceful degradation: return a deterministic placeholder so the UI still works in dev
      const results: CheckResult[] = prompts.map((p) => ({
        label: p.label,
        prompt: p.prompt,
        response: `[Demo mode - Anthropic API key not set] ${brand} was not evaluated by a live model.`,
        mentioned: false,
        recommended: false,
        sentiment: "absent" as const,
      }));
      return NextResponse.json({
        ok: true,
        mode: "check",
        demo: true,
        brand,
        score: 0,
        results,
        recommendations: buildRecommendations(results, brand),
      });
    }

    try {
      const responses = await Promise.all(
        prompts.map((p) => runClaudePrompt(p.prompt, apiKey))
      );
      const results: CheckResult[] = prompts.map((p, i) => {
        const response = responses[i];
        const scored = scoreResponse(brand, response);
        return { label: p.label, prompt: p.prompt, response, ...scored };
      });
      const score = buildScore(results);
      const recommendations = buildRecommendations(results, brand);

      return NextResponse.json({
        ok: true,
        mode: "check",
        brand,
        score,
        results,
        recommendations,
      });
    } catch (err) {
      console.error("[teardown/check] failed", err);
      return NextResponse.json(
        { error: "The check failed. Please try again or book the full Teardown." },
        { status: 500 }
      );
    }
  }

  // ---------------- Full 48h Teardown lead ----------------
  const { brand, url, category, email, name } = payload;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "website@domisearch.com";

  if (!apiKey) {
    console.log(`[teardown] lead (not delivered): ${name} / ${email} / ${brand}`);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `Teardown request - ${brand} (${name})`;
    const html = `
      <div style="font-family: -apple-system, system-ui, sans-serif; background: #090909; color: #dddfde; padding: 32px;">
        <h2 style="color: #eeffff;">New Teardown request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #aaa; width: 140px;">Brand</td><td>${escape(brand)}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaa;">Name</td><td>${escape(name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td><a style="color:#01e890" href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
          ${url ? `<tr><td style="padding: 8px 0; color: #aaa;">URL</td><td>${escape(url)}</td></tr>` : ""}
          ${category ? `<tr><td style="padding: 8px 0; color: #aaa;">Category</td><td>${escape(category)}</td></tr>` : ""}
        </table>
        <p style="margin-top: 24px; color: #aaa;">48-hour promise. The countdown is running.</p>
      </div>
    `;
    await resend.emails.send({
      from: `DomiSearch Teardown <${from}>`,
      to: [to],
      replyTo: email,
      subject,
      html,
      text: `New Teardown request.\nName: ${name}\nEmail: ${email}\nBrand: ${brand}\nURL: ${url ?? ""}\nCategory: ${category ?? ""}`,
    });
  } catch (err) {
    console.error("[teardown] email send failed", err);
    return NextResponse.json(
      { error: "Could not submit. Please email hi@domisearch.com." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
