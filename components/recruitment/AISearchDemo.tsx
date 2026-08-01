"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The hero centrepiece: a stylised ChatGPT window that types a real buyer
 * query, "searches", then streams back an answer in which the visitor's firm
 * is the named recommendation.
 *
 * Deliberately a mock, not a screenshot — it loops, it is labelled as an
 * illustration, and the competitor rows are generic so we are never implying a
 * real ranking of real companies.
 *
 * Sequence: type → send → search → stream answer → rank rows → "that's you"
 * badge → hold → loop. Runs only once scrolled into view; collapses to the
 * finished state under prefers-reduced-motion.
 */

const QUERY = "best recruitment agency for construction in Manchester";

const ANSWER_PARTS: { text: string; brand?: boolean }[] = [
  {
    text: "For construction hiring in Manchester, the firm that comes up most consistently is",
  },
  { text: "Your Firm", brand: true },
  {
    text: ". They cover site managers, quantity surveyors and project managers across the North West, and are repeatedly rated for speed of placement.",
  },
];

/** Flattened word stream, so the answer can be revealed word by word. */
const WORDS: { text: string; brand: boolean; part: number }[] = ANSWER_PARTS.flatMap(
  (part, i) =>
    part.text.split(/\s+/).map((text) => ({ text, brand: Boolean(part.brand), part: i })),
);

const SOURCES = ["yourfirm.co.uk", "trustpilot.com", "constructionnews.co.uk"];

/** Rows 2 and 3 stay generic on purpose — we are not ranking real rivals. */
const RESULTS = [
  // Kept short: row 1 also carries the "Cited" chip, so it has the least room.
  { name: "Your Firm", meta: "Construction · Manchester", you: true },
  { name: "A regional competitor", meta: "Trades & labour · North West", you: false },
  { name: "A national generalist", meta: "Multi-sector · UK-wide", you: false },
];

type Phase = "typing" | "sent" | "searching" | "answering" | "done";

export function AISearchDemo() {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [words, setWords] = useState(0);
  const [rows, setRows] = useState(0);
  const [badge, setBadge] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setTyped(QUERY.length);
      setWords(WORDS.length);
      setRows(RESULTS.length);
      setBadge(true);
      setPhase("done");
      return;
    }

    const timers: number[] = [];
    const intervals: number[] = [];
    const clearAll = () => {
      timers.forEach((t) => window.clearTimeout(t));
      intervals.forEach((i) => window.clearInterval(i));
      timers.length = 0;
      intervals.length = 0;
    };

    const start = () => {
      clearAll();
      setTyped(0);
      setWords(0);
      setRows(0);
      setBadge(false);
      setPhase("typing");

      const at = (ms: number, fn: () => void) => {
        timers.push(window.setTimeout(fn, ms));
      };

      const TYPE_MS = 42;
      const WORD_MS = 52;

      at(500, () => {
        const iv = window.setInterval(() => {
          setTyped((n) => {
            if (n >= QUERY.length) {
              window.clearInterval(iv);
              return n;
            }
            return n + 1;
          });
        }, TYPE_MS);
        intervals.push(iv);
      });

      const typedAt = 500 + QUERY.length * TYPE_MS + 150;
      at(typedAt + 260, () => setPhase("sent"));
      at(typedAt + 720, () => setPhase("searching"));

      const answerAt = typedAt + 2700;
      at(answerAt, () => {
        setPhase("answering");
        const iv = window.setInterval(() => {
          setWords((n) => {
            if (n >= WORDS.length) {
              window.clearInterval(iv);
              return n;
            }
            return n + 1;
          });
        }, WORD_MS);
        intervals.push(iv);
      });

      const answeredAt = answerAt + WORDS.length * WORD_MS;
      at(answeredAt + 320, () => setRows(1));
      at(answeredAt + 580, () => setRows(2));
      at(answeredAt + 840, () => setRows(3));
      at(answeredAt + 1500, () => {
        setBadge(true);
        setPhase("done");
      });
      at(answeredAt + 8000, start);
    };

    // Only burn cycles once the demo is actually on screen.
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started) {
          started = true;
          start();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(host);

    return () => {
      io.disconnect();
      clearAll();
    };
  }, []);

  const showBubble = phase !== "typing";
  const showAnswer = phase === "answering" || phase === "done";

  return (
    <div ref={hostRef} className="relative w-full min-w-0">
      {/* Soft halo behind the window so it lifts off the cream background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(60%_50%_at_50%_35%,rgba(1,99,76,0.10),transparent_75%)]"
      />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-black/[0.08] bg-white shadow-[0_40px_90px_-40px_rgba(20,17,13,0.45)]">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#fbfaf8] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5e2dd]" />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/engines/chatgpt.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
            <span className="text-[12px] font-semibold tracking-tight text-[color:var(--color-ink)]">
              ChatGPT
            </span>
          </div>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
            Illustration
          </span>
        </div>

        {/* Fixed height, not min-height: the window must never resize as the
            answer streams in, or the whole hero shifts under it. Measured
            against the tallest finished state (614px at lg, 595px at 390px)
            with headroom for font-loading variance. */}
        <div className="flex h-[22rem] flex-col px-3.5 py-4 sm:h-[40rem] sm:px-6 sm:py-6 lg:h-[41rem]">
          <div className="min-w-0 flex-1 overflow-hidden">
          {/* User message */}
          {showBubble ? (
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#f1efe9] px-3 py-1.5 text-[12.5px] leading-snug text-[color:var(--color-ink)] sm:px-4 sm:py-2.5 sm:text-[15px]">
                {QUERY}
              </div>
            </div>
          ) : null}

          {/* Searching state */}
          {phase === "searching" ? (
            <div className="mt-4 sm:mt-5">
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[color:var(--color-ink-3)]">
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="engine-pulse h-1.5 w-1.5 rounded-full bg-[color:var(--color-pine)]"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </span>
                Searching the web
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SOURCES.map((s, i) => (
                  <span
                    key={s}
                    className="source-in inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-[#fbfaf8] px-2.5 py-1 text-[11px] text-[color:var(--color-ink-3)]"
                    style={{ animationDelay: `${400 + i * 260}ms` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage)]" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Streamed answer */}
          {showAnswer ? (
            <div className="mt-4 sm:mt-5">
              <p className="text-[12.5px] leading-[1.45] text-[color:var(--color-ink-2)] sm:text-[16px] sm:leading-relaxed">
                {ANSWER_PARTS.map((part, pi) => {
                  const before = WORDS.filter((w) => w.part < pi).length;
                  const total = WORDS.filter((w) => w.part === pi).length;
                  const shown = Math.max(0, Math.min(total, words - before));
                  if (shown === 0) return null;
                  const text = WORDS.filter((w) => w.part === pi)
                    .slice(0, shown)
                    .map((w) => w.text)
                    .join(" ");
                  if (!part.brand) return <span key={pi}>{text} </span>;
                  const complete = shown === total;
                  return (
                    <strong
                      key={pi}
                      className={`relative font-bold text-[color:var(--color-ink)] ${
                        complete ? "brand-mark" : ""
                      }`}
                    >
                      {text}
                    </strong>
                  );
                })}
                {phase === "answering" ? (
                  <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-[color:var(--color-pine)]" />
                ) : null}
              </p>

              {/* Ranked rows */}
              <div className="mt-2.5 space-y-1 sm:mt-5 sm:space-y-2">
                {RESULTS.slice(0, rows).map((r, i) => (
                  <div
                    key={r.name}
                    className={`row-in flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 sm:gap-3 sm:px-3.5 sm:py-3 ${
                      i > 0 ? "hidden sm:flex" : ""
                    } ${
                      r.you
                        ? "border-[color:var(--color-pine)]/35 bg-[color:var(--color-pine)]/[0.06]"
                        : "border-black/[0.06] bg-[#fbfaf8]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-[11px] ${
                        r.you
                          ? "bg-[color:var(--color-pine)] text-white"
                          : "bg-black/[0.06] text-[color:var(--color-ink-3)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[12.5px] font-semibold tracking-tight sm:text-[14px] ${
                          r.you
                            ? "text-[color:var(--color-ink)]"
                            : "text-[color:var(--color-ink-3)]"
                        }`}
                      >
                        {r.name}
                      </span>
                      <span className="block truncate text-[10.5px] text-[color:var(--color-ink-3)] sm:text-[12px]">
                        {r.meta}
                      </span>
                    </span>
                    {r.you ? (
                      <span className="ml-auto shrink-0 rounded-full bg-[color:var(--color-pine)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                        Cited
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Payoff callout — inline so it can never collide with the rows */}
              <div
                className={`mt-3 hidden flex-wrap items-center gap-2 transition-all duration-500 sm:mt-4 sm:flex ${
                  badge ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                }`}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-3.5 py-2 text-[12px] font-bold tracking-tight text-[color:var(--color-paper)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
                  That&apos;s your firm
                </span>
                <span className="text-[12px] text-[color:var(--color-ink-3)]">
                  Named first, cited, inside the answer.
                </span>
              </div>
            </div>
          ) : null}
          </div>

          {/* Composer — pinned to the bottom throughout, as in a real chat */}
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-black/[0.09] bg-[#fbfaf8] px-3 py-2.5 sm:mt-5 sm:px-4 sm:py-3">
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-[color:var(--color-ink)] sm:text-[15px]">
              {phase === "typing" ? (
                <>
                  {QUERY.slice(0, typed) || (
                    <span className="text-[color:var(--color-ink-3)]">Ask anything</span>
                  )}
                  <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-[color:var(--color-ink)]" />
                </>
              ) : (
                <span className="text-[color:var(--color-ink-3)]">Ask anything</span>
              )}
            </span>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                phase === "typing" && typed >= QUERY.length
                  ? "bg-[color:var(--color-ink)]"
                  : "bg-black/[0.12]"
              }`}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#fff" strokeWidth="2.4">
                <path d="M12 19V5m0 0-6 6m6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
