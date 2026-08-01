"use client";

import { useEffect, useState } from "react";

/**
 * Bottom-left rotating card, in the spirit of the "live sale" toasts on
 * proof-heavy agency sites.
 *
 * Important: this shows *buyer prompts we track*, not fabricated client wins.
 * Until there is a real recruitment client producing real citation events,
 * inventing "Firm X was just cited" would be a fake receipt. When a recruitment
 * client is live, swap PROMPTS for real citation events from Searchable and
 * relabel the header.
 */
const PROMPTS = [
  { q: "best construction recruitment agency in Manchester", engine: "ChatGPT" },
  { q: "who recruits quantity surveyors in the North West", engine: "Perplexity" },
  { q: "top rated site manager recruiters UK", engine: "Gemini" },
  { q: "recruitment agency for civil engineering jobs Leeds", engine: "ChatGPT" },
  { q: "best agency to hire project managers construction", engine: "Copilot" },
  { q: "specialist M&E recruitment agencies near me", engine: "Google AI" },
];

export function PromptTicker() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const enter = window.setTimeout(() => setShown(true), 2600);
    if (reduced) return () => window.clearTimeout(enter);

    const iv = window.setInterval(() => {
      setShown(false);
      window.setTimeout(() => {
        setI((n) => (n + 1) % PROMPTS.length);
        setShown(true);
      }, 520);
    }, 5200);

    return () => {
      window.clearTimeout(enter);
      window.clearInterval(iv);
    };
  }, []);

  const p = PROMPTS[i];

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-4 z-40 hidden max-w-[19rem] transition-all duration-500 sm:block ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      aria-hidden
    >
      <div className="rounded-2xl border border-black/[0.07] bg-white/95 p-3.5 shadow-[0_20px_50px_-24px_rgba(20,17,13,0.55)] backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-sage)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-pine)]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Buyer prompt tracked
          </span>
        </div>
        <p className="mt-2 text-[13px] font-semibold leading-snug tracking-tight text-[color:var(--color-ink)]">
          &ldquo;{p.q}&rdquo;
        </p>
        <p className="mt-1.5 text-[11px] text-[color:var(--color-ink-3)]">
          Asked on {p.engine} · someone is hiring right now
        </p>
      </div>
    </div>
  );
}
