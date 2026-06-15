"use client";

import { useState, useEffect, FormEvent } from "react";

type Analysis = {
  prompt: string;
  response: string;
  target_mentioned: boolean;
  target_recommended: boolean;
  competitors: string[];
  answer_summary: string;
  error?: string;
};

type Report = {
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

const STORAGE_KEY = "domi_visibility_token";

const INDUSTRIES = [
  "B2B SaaS",
  "E-commerce — apparel/fashion",
  "E-commerce — home goods",
  "E-commerce — beauty/cosmetics",
  "E-commerce — food & drink",
  "Professional services — accounting",
  "Professional services — legal",
  "Professional services — consulting",
  "Professional services — marketing",
  "Healthcare — aesthetics/clinics",
  "Healthcare — dental",
  "Healthcare — wellness",
  "Real estate / Property",
  "Financial services",
  "Education / Training",
  "Software / Tech",
  "Local services — home improvement",
  "Local services — automotive",
  "Travel / Hospitality",
  "Manufacturing / B2B",
];

const LOCATIONS = [
  "United Kingdom",
  "United States",
  "European Union",
  "Australia",
  "Canada",
  "Global",
];

function band_color(band: Report["visibility_band"]): string {
  switch (band) {
    case "Invisible":
      return "text-red-400";
    case "Barely visible":
      return "text-orange-400";
    case "Patchy":
      return "text-yellow-300";
    case "Visible":
      return "text-[color:var(--color-domigreen)]";
  }
}

function highlight(text: string, company: string, url: string): string {
  if (!text) return "";
  let domain = "";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {}
  const needles = [company.trim(), domain].filter(Boolean);
  let out = text;
  for (const n of needles) {
    const re = new RegExp(`(${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    out = out.replace(re, '<mark class="bg-[color:var(--color-domigreen)]/30 text-[color:var(--color-glacier)] px-0.5 rounded">$1</mark>');
  }
  return out;
}

export function VisibilityClient() {
  const [token, setToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [authed, setAuthed] = useState<boolean>(false);

  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  async function runDiagnosis() {
    setDiagnosis("Checking…");
    try {
      const res = await fetch("/api/visibility/debug", {
        headers: { "x-visibility-token": token },
      });
      const data = await res.json();
      setDiagnosis(JSON.stringify(data, null, 2));
    } catch (e) {
      setDiagnosis(`Error: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  function handleAuth(e: FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    window.sessionStorage.setItem(STORAGE_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setAuthed(true);
  }

  async function handleRun(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);
    setLoading(true);
    try {
      const res = await fetch("/api/visibility", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-visibility-token": token,
        },
        body: JSON.stringify({
          company: company.trim(),
          url: /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`,
          industry,
          location,
          description: description.trim(),
        }),
      });
      if (res.status === 401) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        setAuthed(false);
        setError("Password incorrect. Please re-enter.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Visibility check failed.");
        return;
      }
      setReport(data as Report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <form onSubmit={handleAuth} className="card mx-auto mt-8 max-w-md p-8">
        <label htmlFor="token" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
          Access password
        </label>
        <input
          id="token"
          type="password"
          autoFocus
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          className="mt-3 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
          placeholder="Enter VISIBILITY_PASSWORD"
        />
        <button type="submit" className="btn btn-primary mt-6 w-full justify-center">
          Continue →
        </button>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </form>
    );
  }

  return (
    <div className="space-y-12">
      {/* Form */}
      <form onSubmit={handleRun} className="card grid gap-5 p-8 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            Brand name
          </label>
          <input
            id="company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
            placeholder="e.g. Taxd"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            Website
          </label>
          <input
            id="url"
            required
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
            placeholder="taxd.com or https://example.com"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            Industry
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            Primary market
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            What they actually do <span className="lowercase tracking-normal text-[color:var(--color-fog)]/40">(optional but improves accuracy)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={500}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-[color:var(--color-glacier)] focus:border-[color:var(--color-domigreen)]/60 focus:outline-none"
            placeholder="e.g. Taxd is self-assessment tax software for UK individuals (not accountants) — they file their own tax return online via a guided flow."
          />
          <p className="mt-1 text-[11px] text-[color:var(--color-fog)]/45">
            If blank, we&apos;ll auto-fetch the homepage title + meta description. A clear one-liner here produces sharper prompts.
          </p>
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[color:var(--color-fog)]/60">
            10 prompts · ChatGPT · web search ON · ~20-30 seconds
          </p>
          <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-60">
            {loading ? "Running…" : "Run snapshot"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="card border-red-500/40 bg-red-500/5 p-6 text-red-300">
          <div>{error}</div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runDiagnosis}
              className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
            >
              Diagnose env vars
            </button>
          </div>
          {diagnosis && (
            <pre className="mt-4 overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs text-[color:var(--color-fog)]/80">
              {diagnosis}
            </pre>
          )}
        </div>
      )}

      {loading && (
        <div className="card flex items-center gap-4 p-6 text-[color:var(--color-fog)]/80">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--color-domigreen)]" />
          Generating prompts, querying ChatGPT (web search ON), analysing mentions… this typically takes 20–40 seconds.
        </div>
      )}

      {report && <Report report={report} />}
    </div>
  );
}

function bandHex(band: Report["visibility_band"]): string {
  switch (band) {
    case "Invisible": return "#f87171";
    case "Barely visible": return "#fb923c";
    case "Patchy": return "#fde047";
    case "Visible": return "#01e890";
  }
}

function ScoreGauge({ score, band }: { score: number; band: Report["visibility_band"] }) {
  const size = 240;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = bandHex(band);
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 14px ${color}80)`, transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display text-6xl leading-none" style={{ color }}>
          {score}
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-fog)]/55">
          / 100
        </div>
        <div className="mt-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color }}>
          {band}
        </div>
      </div>
    </div>
  );
}

function StackedBar({ recommended, mentionedOnly, missing }: { recommended: number; mentionedOnly: number; missing: number }) {
  const total = recommended + mentionedOnly + missing || 1;
  const rec = (recommended / total) * 100;
  const men = (mentionedOnly / total) * 100;
  const mis = (missing / total) * 100;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {recommended > 0 && (
          <div style={{ width: `${rec}%`, background: "#01e890" }} title={`Recommended: ${recommended}`} />
        )}
        {mentionedOnly > 0 && (
          <div style={{ width: `${men}%`, background: "#fde047" }} title={`Mentioned only: ${mentionedOnly}`} />
        )}
        {missing > 0 && (
          <div style={{ width: `${mis}%`, background: "rgba(248,113,113,0.7)" }} title={`Not mentioned: ${missing}`} />
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[color:var(--color-fog)]/75">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm" style={{ background: "#01e890" }} />
          Recommended ({recommended})
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm" style={{ background: "#fde047" }} />
          Mentioned only ({mentionedOnly})
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-red-400/70" />
          Not mentioned ({missing})
        </span>
      </div>
    </div>
  );
}

function statusPill(p: Analysis) {
  if (p.error) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
        Error
      </span>
    );
  }
  if (p.target_recommended) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-domigreen)]/15 px-3 py-1 text-xs font-medium text-[color:var(--color-domigreen)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
        Recommended
      </span>
    );
  }
  if (p.target_mentioned) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-300">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
        Mentioned only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
      <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
      Not mentioned
    </span>
  );
}

function Report({ report }: { report: Report }) {
  const recommendedCount = report.recommended;
  const mentionedOnly = report.mentions - report.recommended;
  const missingCount = report.total - report.mentions;
  const maxCompetitorCount = Math.max(1, ...report.top_competitors.map((c) => c.count));
  const generated = new Date().toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="space-y-10 print:space-y-6">
      {/* ============ HERO REPORT HEADER ============ */}
      <div className="card relative overflow-hidden p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full opacity-25"
          style={{ background: `radial-gradient(circle, ${bandHex(report.visibility_band)} 0%, transparent 70%)`, filter: "blur(60px)" }}
        />
        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
          <ScoreGauge score={report.visibility_score} band={report.visibility_band} />
          <div className="flex-1 text-center lg:text-left">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-domigreen)]">
              AI Visibility Snapshot
            </div>
            <h2 className="display mt-3 text-balance text-4xl sm:text-5xl">{report.company}</h2>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs lg:justify-start">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[color:var(--color-fog)]/80">
                {report.industry}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[color:var(--color-fog)]/80">
                {report.location}
              </span>
              <a
                href={report.url}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-[color:var(--color-domigreen)]/30 bg-[color:var(--color-domigreen)]/5 px-3 py-1 text-[color:var(--color-domigreen)] hover:bg-[color:var(--color-domigreen)]/10"
              >
                {report.url.replace(/^https?:\/\//, "")} ↗
              </a>
            </div>
            <p className="mt-4 text-xs text-[color:var(--color-fog)]/55">
              Generated {generated} · 10 buyer-intent prompts · ChatGPT (gpt-4o) with live web search
            </p>
          </div>
        </div>

        {/* ============ KPI TILES ============ */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Recommended", value: report.recommended, total: report.total, accent: "#01e890" },
            { label: "Mentioned", value: report.mentions, total: report.total, accent: "#fde047" },
            { label: "Competitors", value: report.top_competitors.length, total: null, accent: "#94a3b8" },
          ].map((kpi) => (
            <div key={kpi.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <span aria-hidden className="absolute left-0 top-0 h-full w-[2px]" style={{ background: kpi.accent }} />
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                {kpi.label}
              </div>
              <div className="display mt-3 text-4xl text-[color:var(--color-glacier)]">
                {kpi.value}
                {kpi.total !== null && (
                  <span className="ml-1 text-xl text-[color:var(--color-fog)]/40">/ {kpi.total}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ============ STACKED BAR ============ */}
        <div className="mt-8">
          <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
            Prompt outcomes
          </div>
          <StackedBar recommended={recommendedCount} mentionedOnly={mentionedOnly} missing={missingCount} />
        </div>
      </div>

      {/* ============ COMPETITOR LEADERBOARD ============ */}
      {report.top_competitors.length > 0 && (
        <div className="card p-8 sm:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                Top rivals
              </div>
              <h3 className="display mt-2 text-2xl sm:text-3xl">
                Brands ChatGPT recommended <span className="text-[color:var(--color-fog)]/50">instead</span>
              </h3>
            </div>
            <p className="text-xs text-[color:var(--color-fog)]/55">
              Ranked by mention count across {report.total} prompts
            </p>
          </div>
          <ol className="mt-8 space-y-3">
            {report.top_competitors.map((c, i) => {
              const pct = Math.max(8, (c.count / maxCompetitorCount) * 100);
              return (
                <li key={c.name} className="grid grid-cols-[28px_1fr_60px] items-center gap-4">
                  <span className="text-sm font-medium text-[color:var(--color-fog)]/45">{i + 1}.</span>
                  <div className="flex items-center gap-3">
                    <span className="min-w-[160px] text-sm font-medium text-[color:var(--color-glacier)]">
                      {c.name}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, rgba(1,232,144,0.5), rgba(1,232,144,0.85))",
                          transition: "width 0.8s cubic-bezier(.2,.8,.2,1)",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-right text-sm tabular-nums text-[color:var(--color-fog)]/75">
                    {c.count} {c.count === 1 ? "mention" : "mentions"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* ============ PROMPT-BY-PROMPT BREAKDOWN ============ */}
      <div>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
              The detail
            </div>
            <h3 className="display mt-2 text-2xl sm:text-3xl">Prompt-by-prompt breakdown</h3>
          </div>
          <p className="text-xs text-[color:var(--color-fog)]/55">
            Click any card to read the full ChatGPT response
          </p>
        </div>
        <div className="space-y-3">
          {report.prompts.map((p, i) => (
            <div key={i} className="card group p-6 sm:p-8 transition-colors hover:border-white/20">
              <div className="flex flex-wrap items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-[color:var(--color-fog)]/60">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-base font-medium leading-relaxed text-[color:var(--color-glacier)]">
                    &ldquo;{p.prompt}&rdquo;
                  </p>
                </div>
                <div className="shrink-0">{statusPill(p)}</div>
              </div>

              {p.error && (
                <pre className="ml-14 mt-4 overflow-auto rounded-md border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300 whitespace-pre-wrap">
                  {p.error}
                </pre>
              )}

              {p.answer_summary && (
                <p className="ml-14 mt-4 border-l-2 border-[color:var(--color-domigreen)]/30 pl-4 text-sm leading-relaxed text-[color:var(--color-fog)]/75">
                  {p.answer_summary}
                </p>
              )}

              {p.competitors.length > 0 && (
                <div className="ml-14 mt-5">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/45">
                    Brands ChatGPT named
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.competitors.map((c, j) => (
                      <span
                        key={j}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-[color:var(--color-fog)]/85"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.response && (
                <details className="ml-14 mt-5 group/details">
                  <summary className="cursor-pointer text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/45 transition-colors hover:text-[color:var(--color-domigreen)] group-open/details:text-[color:var(--color-domigreen)]">
                    Read full ChatGPT response ↓
                  </summary>
                  <div
                    className="prose prose-invert mt-4 max-w-none whitespace-pre-wrap rounded-lg border border-white/5 bg-black/20 p-5 text-sm leading-relaxed text-[color:var(--color-fog)]/85"
                    dangerouslySetInnerHTML={{ __html: highlight(p.response, report.company, report.url) }}
                  />
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ METHODOLOGY FOOTER ============ */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-xs leading-relaxed text-[color:var(--color-fog)]/55">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/45">
          Methodology
        </div>
        <p className="mt-2">
          10 buyer-intent prompts generated by Claude based on the brand&apos;s product and market. Each prompt is run through OpenAI&apos;s gpt-4o with live web search ON — the same retrieval stack ChatGPT.com uses for fresh queries. Responses are analysed by Claude to detect brand mentions, recommendations, and competitor brands. The visibility score is the percentage of prompts in which the target brand appears.
        </p>
        <p className="mt-2">
          Snapshot generated by <span className="text-[color:var(--color-domigreen)]">DomiSearch</span> on {generated}.
        </p>
      </div>

      <div className="flex justify-center gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="btn btn-ghost">
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
