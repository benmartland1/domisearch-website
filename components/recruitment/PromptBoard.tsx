"use client";

import { useState } from "react";

/**
 * The "leaderboard" module — a stand-in for the live sales tables that make
 * proof-heavy agency sites feel alive. Here it shows what a recruitment firm's
 * AI-visibility audit actually looks like: the prompts their buyers ask, who
 * gets named today, and whether they appear at all.
 *
 * Framed explicitly as an example audit. Competitor slots are generic
 * descriptors, never real firm names.
 */

type Row = {
  prompt: string;
  sector: "Construction" | "Engineering" | "Trades";
  engine: string;
  named: string;
  cited: boolean;
};

const ROWS: Row[] = [
  {
    prompt: "best recruitment agency for construction in Manchester",
    sector: "Construction",
    engine: "ChatGPT",
    named: "3 national generalists",
    cited: false,
  },
  {
    prompt: "who places quantity surveyors in the North West",
    sector: "Construction",
    engine: "Perplexity",
    named: "2 regional firms",
    cited: false,
  },
  {
    prompt: "top site manager recruiters UK",
    sector: "Construction",
    engine: "Gemini",
    named: "1 job board, 2 agencies",
    cited: false,
  },
  {
    prompt: "civil engineering recruitment agency Leeds",
    sector: "Engineering",
    engine: "ChatGPT",
    named: "2 national generalists",
    cited: false,
  },
  {
    prompt: "best agency to hire structural engineers",
    sector: "Engineering",
    engine: "Copilot",
    named: "1 directory, 1 agency",
    cited: false,
  },
  {
    prompt: "specialist M&E recruitment agencies near me",
    sector: "Engineering",
    engine: "Google AI",
    named: "3 regional firms",
    cited: false,
  },
  {
    prompt: "recruitment agency for electricians Manchester",
    sector: "Trades",
    engine: "ChatGPT",
    named: "2 job boards",
    cited: false,
  },
  {
    prompt: "best labour supply agency North West",
    sector: "Trades",
    engine: "Perplexity",
    named: "1 national, 1 regional",
    cited: false,
  },
];

const TABS = ["All", "Construction", "Engineering", "Trades"] as const;

export function PromptBoard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const rows = tab === "All" ? ROWS : ROWS.filter((r) => r.sector === tab);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_30px_70px_-40px_rgba(20,17,13,0.4)]">
      {/* Header strip */}
      <div className="flex flex-wrap items-center gap-3 border-b border-black/[0.06] bg-[#fbfaf8] px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-sage)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-pine)]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink)]">
            Example visibility audit
          </span>
        </div>
        <div className="ml-auto flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-tight transition-colors ${
                tab === t
                  ? "bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
                  : "text-[color:var(--color-ink-3)] hover:bg-black/[0.04]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-black/[0.06] text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              <th className="px-4 py-3 font-semibold sm:px-6">Buyer prompt</th>
              <th className="px-4 py-3 font-semibold">Engine</th>
              <th className="px-4 py-3 font-semibold">Who gets named</th>
              <th className="px-4 py-3 text-right font-semibold sm:px-6">Your firm</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.prompt}
                className="border-b border-black/[0.05] last:border-0 hover:bg-black/[0.015]"
              >
                <td className="px-4 py-3 text-[14px] font-medium tracking-tight text-[color:var(--color-ink)] sm:px-6">
                  {r.prompt}
                </td>
                <td className="px-4 py-3 text-[13px] text-[color:var(--color-ink-3)]">
                  {r.engine}
                </td>
                <td className="px-4 py-3 text-[13px] text-[color:var(--color-ink-3)]">
                  {r.named}
                </td>
                <td className="px-4 py-3 text-right sm:px-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdeeee] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#b4342f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4453f]" />
                    Not cited
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-black/[0.06] bg-[#fbfaf8] px-4 py-3 text-[11px] leading-relaxed text-[color:var(--color-ink-3)] sm:px-6">
        Illustrative example of the audit we run before any engagement. Competitor slots are
        described generically, and we never publish another firm&apos;s ranking.
      </div>
    </div>
  );
}
