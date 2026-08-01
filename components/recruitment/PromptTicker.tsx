"use client";

import { useEffect, useState } from "react";

/**
 * Bottom-left card, in the spirit of the "live sale" toasts on proof-heavy
 * agency sites.
 *
 * Important: this shows *buyer prompts we track*, not fabricated client wins.
 * Until there is a real recruitment client producing real citation events,
 * inventing "Firm X was just cited" would be a fake receipt. When a recruitment
 * client is live, swap PROMPTS for real citation events from Searchable and
 * relabel the header.
 *
 * Behaviour: shows once per session, auto-retires after one cycle, and can be
 * dismissed. It previously looped indefinitely and sat over the body copy.
 */
const PROMPTS = [
  { q: "best construction recruitment agency in Manchester", engine: "ChatGPT" },
  { q: "who recruits quantity surveyors in the North West", engine: "Perplexity" },
  { q: "top rated site manager recruiters UK", engine: "Gemini" },
  { q: "recruitment agency for civil engineering jobs Leeds", engine: "ChatGPT" },
];

const SEEN_KEY = "domi-prompt-ticker-seen";
const VISIBLE_MS = 6500;

export function PromptTicker() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode / storage disabled: fall back to showing it this load.
    }
    if (seen) return;

    setDone(false);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Two prompts, then retire for the session.
    at(2600, () => setShown(true));
    if (!reduced) {
      at(2600 + VISIBLE_MS, () => setShown(false));
      at(2600 + VISIBLE_MS + 500, () => {
        setI(1);
        setShown(true);
      });
    }
    const endAt = reduced ? 2600 + VISIBLE_MS : 2600 + VISIBLE_MS * 2 + 500;
    at(endAt, () => setShown(false));
    at(endAt + 600, () => {
      setDone(true);
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* no-op */
      }
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  if (done) return null;

  const p = PROMPTS[i];

  const dismiss = () => {
    setShown(false);
    setDone(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* no-op */
    }
  };

  return (
    // Only rendered from xl up: below that the viewport gutter is narrower than
    // the card, so a fixed bottom-left toast would sit over the body copy.
    <div
      className={`fixed bottom-4 left-4 z-40 hidden max-w-[16.5rem] transition-all duration-500 xl:block ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="relative rounded-2xl border border-black/[0.07] bg-white/95 p-3.5 pr-8 shadow-[0_20px_50px_-24px_rgba(20,17,13,0.55)] backdrop-blur">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--color-ink-3)] transition-colors hover:bg-black/[0.05] hover:text-[color:var(--color-ink)]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
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
