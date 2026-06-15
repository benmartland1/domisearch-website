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

function Report({ report }: { report: Report }) {
  return (
    <div className="space-y-10 print:space-y-6">
      {/* Hero stats */}
      <div className="card overflow-hidden p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
              Visibility score
            </div>
            <div className={`display mt-3 text-7xl ${band_color(report.visibility_band)}`}>
              {report.visibility_score}
              <span className="text-3xl text-[color:var(--color-fog)]/40">/100</span>
            </div>
            <div className={`mt-2 text-xl font-medium ${band_color(report.visibility_band)}`}>
              {report.visibility_band}
            </div>
          </div>
          <div>
            <h2 className="display text-2xl sm:text-3xl">{report.company}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-fog)]/70">
              {report.industry} · {report.location}
            </p>
            <a
              href={report.url}
              target="_blank"
              rel="noopener"
              className="mt-1 inline-block text-sm text-[color:var(--color-domigreen)] hover:underline"
            >
              {report.url} ↗
            </a>
            <div className="hairline mt-6" />
            <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                  Mentioned in
                </dt>
                <dd className="display mt-1 text-3xl text-[color:var(--color-glacier)]">
                  {report.mentions}/{report.total}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                  Recommended in
                </dt>
                <dd className="display mt-1 text-3xl text-[color:var(--color-glacier)]">
                  {report.recommended}/{report.total}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                  Top rivals
                </dt>
                <dd className="display mt-1 text-3xl text-[color:var(--color-glacier)]">
                  {report.top_competitors.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Competitors */}
      {report.top_competitors.length > 0 && (
        <div className="card p-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/60">
            Brands ChatGPT recommended instead
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {report.top_competitors.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[color:var(--color-fog)]/85"
              >
                {c.name}
                <span className="text-[color:var(--color-domigreen)]">×{c.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Per-prompt cards */}
      <div className="space-y-4">
        <h3 className="display text-2xl">Prompt-by-prompt breakdown</h3>
        {report.prompts.map((p, i) => (
          <div key={i} className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                  Prompt {i + 1}
                </div>
                <p className="mt-1 text-base font-medium text-[color:var(--color-glacier)]">
                  &ldquo;{p.prompt}&rdquo;
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {p.error ? (
                  <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">
                    Error
                  </span>
                ) : p.target_recommended ? (
                  <span className="rounded-full bg-[color:var(--color-domigreen)]/15 px-3 py-1 text-xs text-[color:var(--color-domigreen)]">
                    ✓ Recommended
                  </span>
                ) : p.target_mentioned ? (
                  <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs text-yellow-300">
                    Mentioned only
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">
                    Not mentioned
                  </span>
                )}
              </div>
            </div>

            {p.error && (
              <pre className="mt-4 overflow-auto rounded-md border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300 whitespace-pre-wrap">
                {p.error}
              </pre>
            )}

            {p.answer_summary && (
              <p className="mt-4 text-sm italic text-[color:var(--color-fog)]/75">
                {p.answer_summary}
              </p>
            )}

            {p.competitors.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55">
                  Competitors named
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.competitors.map((c, j) => (
                    <span
                      key={j}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-[color:var(--color-fog)]/80"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {p.response && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs uppercase tracking-[0.22em] text-[color:var(--color-fog)]/55 hover:text-[color:var(--color-domigreen)]">
                  Show ChatGPT response
                </summary>
                <div
                  className="prose prose-invert mt-3 max-w-none whitespace-pre-wrap text-sm text-[color:var(--color-fog)]/85"
                  dangerouslySetInnerHTML={{ __html: highlight(p.response, report.company, report.url) }}
                />
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="text-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-ghost"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
