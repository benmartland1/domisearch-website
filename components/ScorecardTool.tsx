"use client";

import { useState } from "react";

type CheckResult = {
  label: string;
  prompt: string;
  response: string;
  mentioned: boolean;
  recommended: boolean;
  sentiment: "positive" | "neutral" | "negative" | "absent";
};

type CheckResponse = {
  ok: boolean;
  brand: string;
  score: number;
  results: CheckResult[];
  recommendations: string[];
  demo?: boolean;
};

type Status = "idle" | "checking" | "results" | "error";

export function ScorecardTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<CheckResponse | null>(null);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [leadError, setLeadError] = useState<string | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<{
    brand: string;
    url: string;
    category: string;
  } | null>(null);

  async function onCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    if (data.hp_company) {
      setStatus("idle");
      return;
    }

    setStatus("checking");
    setError(null);
    setFormSnapshot({
      brand: data.brand ?? "",
      url: data.url ?? "",
      category: data.category ?? "",
    });

    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "check", ...data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "The check failed. Please try again.");
      }
      const payload: CheckResponse = await res.json();
      setCheck(payload);
      setStatus("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  async function onScorecardSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    setLeadStatus("sending");
    setLeadError(null);
    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "scorecard",
          ...data,
          brand: formSnapshot?.brand ?? data.brand,
          url: formSnapshot?.url ?? data.url,
          category: formSnapshot?.category ?? data.category,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not submit. Please try again.");
      }
      setLeadStatus("sent");
    } catch (err) {
      setLeadStatus("error");
      setLeadError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      {status === "idle" || status === "checking" || status === "error" ? (
        <form
          onSubmit={onCheck}
          className="card relative overflow-hidden p-8 sm:p-10"
          noValidate
        >
          <span
            aria-hidden
            className="absolute -right-24 -top-24 h-60 w-60 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--color-domigreen)" }}
          />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
              Run the check
            </div>
            <h3 className="display mt-3 text-2xl sm:text-3xl">
              See how AI talks about your brand - in under 30 seconds.
            </h3>
            <p className="mt-3 text-sm text-[color:var(--color-fog)]/80">
              We run three prompts through Claude and score whether your brand appears, how
              it's positioned, and where you're losing ground.
            </p>

            <input
              type="text"
              name="hp_company"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-[2fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                  Your brand name <span className="text-[color:var(--color-domigreen)]">*</span>
                </span>
                <input
                  name="brand"
                  required
                  maxLength={80}
                  autoComplete="off"
                  placeholder="e.g. Taxd"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                  Your category
                </span>
                <input
                  name="category"
                  maxLength={120}
                  autoComplete="off"
                  placeholder="e.g. tax software"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                Your website (optional)
              </span>
              <input
                name="url"
                type="url"
                maxLength={200}
                autoComplete="off"
                placeholder="https://yourbrand.com"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
              />
            </label>

            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[color:var(--color-fog)]/60">
                No email required to see the score. Powered by Claude.
              </p>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "checking"}
              >
                {status === "checking" ? "Running check…" : "Run visibility check"}
                <span aria-hidden>→</span>
              </button>
            </div>

            {status === "checking" && (
              <div className="mt-6 flex items-center gap-3 text-sm text-[color:var(--color-fog)]/70">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[color:var(--color-domigreen)]" />
                Asking Claude three questions about your brand…
              </div>
            )}

            {status === "error" && error && (
              <p className="mt-4 text-sm text-[color:#ff9d9d]">{error}</p>
            )}
          </div>
        </form>
      ) : null}

      {status === "results" && check && (
        <div className="grid gap-6">
          {/* Score */}
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <span
              aria-hidden
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
              style={{ background: "var(--color-domigreen)" }}
            />
            <div className="relative grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                  AI visibility score
                </div>
                <div className="display mt-2 text-7xl text-[color:var(--color-glacier)] sm:text-8xl">
                  {check.score}
                  <span className="text-3xl text-[color:var(--color-fog)]/50">/100</span>
                </div>
              </div>
              <p className="text-lg text-[color:var(--color-fog)]/85">
                {check.score >= 70
                  ? `${check.brand} is showing up strongly. Time to scale the wins.`
                  : check.score >= 40
                    ? `${check.brand} is in the conversation but losing ground on key prompts.`
                    : check.score >= 15
                      ? `${check.brand} is cited occasionally - but your competitors are winning the surface.`
                      : `${check.brand} is invisible to AI right now. The good news: this is fixable.`}
              </p>
            </div>
            {check.demo && (
              <p className="relative mt-6 text-xs text-[color:var(--color-fog)]/55">
                Demo mode - the Anthropic API key isn't configured in this environment. Add
                <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5">ANTHROPIC_API_KEY</code>
                to Vercel to run live checks.
              </p>
            )}
          </div>

          {/* Per-prompt findings */}
          <div className="card p-8 sm:p-10">
            <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
              Prompt-by-prompt
            </div>
            <ul className="mt-6 divide-y divide-white/5">
              {check.results.map((r) => (
                <li key={r.label} className="py-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                    <span>{r.label}</span>
                    <span className="text-[color:var(--color-fog)]/30">·</span>
                    <span
                      className={
                        r.mentioned
                          ? r.sentiment === "positive"
                            ? "text-[color:var(--color-domigreen)]"
                            : r.sentiment === "negative"
                              ? "text-[color:#ff9d9d]"
                              : "text-[color:var(--color-fog)]/80"
                          : "text-[color:#ff9d9d]"
                      }
                    >
                      {r.mentioned
                        ? r.recommended
                          ? "Cited & recommended"
                          : r.sentiment === "negative"
                            ? "Cited but negative"
                            : "Cited"
                        : "Not cited"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-[color:var(--color-glacier)]">
                    {r.prompt}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fog)]/75">
                    {r.response.length > 380
                      ? r.response.slice(0, 380) + "…"
                      : r.response}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="card p-8 sm:p-10">
            <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
              Three moves from here
            </div>
            <ol className="mt-6 space-y-4 text-[color:var(--color-fog)]/85">
              {check.recommendations.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="display text-2xl text-[color:var(--color-domigreen)]/80">
                    0{i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Upsell to full Scorecard */}
          {leadStatus === "sent" ? (
            <div className="card p-8 sm:p-10">
              <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                Scorecard booked
              </div>
              <h3 className="display mt-3 text-2xl sm:text-3xl">
                48 hours. Ben will be in touch.
              </h3>
              <p className="mt-4 text-[color:var(--color-fog)]/85">
                Expect the full Scorecard - your Ads account review + 20-prompt AI visibility
                audit + three next moves - delivered by email.
              </p>
            </div>
          ) : (
            <form onSubmit={onScorecardSubmit} className="card p-8 sm:p-10">
              <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                Go deeper
              </div>
              <h3 className="display mt-3 text-balance text-3xl sm:text-4xl">
                Get the full DomiSearch Scorecard.
              </h3>
              <p className="mt-4 max-w-xl text-[color:var(--color-fog)]/85">
                Your Google Ads account + the top 20 prompts your buyers ask AI, reviewed by Ben
                personally. Delivered in 48 hours. No strings, no pitch deck.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                    Your name <span className="text-[color:var(--color-domigreen)]">*</span>
                  </span>
                  <input
                    name="name"
                    required
                    maxLength={80}
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                    Work email <span className="text-[color:var(--color-domigreen)]">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[color:var(--color-fog)]/60">
                  We only use your email to reply. No list, no spam.
                </p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={leadStatus === "sending"}
                >
                  {leadStatus === "sending" ? "Submitting…" : "Book the Scorecard"}
                  <span aria-hidden>→</span>
                </button>
              </div>

              {leadStatus === "error" && leadError && (
                <p className="mt-3 text-sm text-[color:#ff9d9d]">{leadError}</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
