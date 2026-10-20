"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Hero visual: a simplified Domi Studio record showing the three connected
 * stages of the work. Opportunity (a buyer question and the sources in its
 * answers) → the work (what went live and when) → the review (what was
 * observed and the next action).
 *
 * Everything shown is an illustrative example. No real client data, no
 * performance figures, no internal identifiers. Replace with an approved
 * screenshot or verified example when one exists.
 */

const stages = [
  {
    n: "01",
    label: "The opportunity",
    title: "Which recruitment agencies specialise in engineering hires in the North West?",
    meta: "Buyer question · tracked daily",
    body: (
      <>
        <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fog)]/55">
          Sources appearing in the answers
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Sources appearing in the answers">
          {["Sector directory", "Competitor service page", "Trade press article", "Review site"].map((s) => (
            <li
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-[color:var(--color-fog)]/85"
            >
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[color:var(--color-fog)]/70">
          Client not named. Competitors named on two of five platforms.
        </p>
      </>
    ),
  },
  {
    n: "02",
    label: "The work",
    title: "Guide: hiring engineers in the North West, with agency fees explained",
    meta: "New content · live 14 Oct",
    body: (
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <dt className="text-[color:var(--color-fog)]/55">Type</dt>
        <dd className="text-[color:var(--color-fog)]/85">New content, approved by the client</dd>
        <dt className="text-[color:var(--color-fog)]/55">Targets</dt>
        <dd className="text-[color:var(--color-fog)]/85">The question above and two related ones</dd>
        <dt className="text-[color:var(--color-fog)]/55">Recorded</dt>
        <dd className="text-[color:var(--color-fog)]/85">Live date logged. Baseline: 14 days before.</dd>
      </dl>
    ),
  },
  {
    n: "03",
    label: "The review",
    title: "Cited on Perplexity and Google AI Overviews. Not yet named in ChatGPT.",
    meta: "Observed · 14-day window",
    body: (
      <>
        <p className="text-xs text-[color:var(--color-fog)]/85">
          <span className="text-[color:var(--color-fog)]/55">Next action: </span>
          add placement evidence and an FAQ block, then review again at day 28.
        </p>
        <p className="mt-2 text-xs text-[color:var(--color-fog)]/55">
          Findings feed the next round of research.
        </p>
      </>
    ),
  },
];

export function StudioHeroVisual() {
  const reduce = useReducedMotion();
  const card = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.7, delay: 0.5 + i * 0.45, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <figure className="w-full max-w-[640px]">
      <div className="card relative overflow-hidden p-4 sm:p-5">
        {/* Window bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-domigreen)]" aria-hidden />
            <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--color-glacier)]">
              Domi Studio
            </span>
            <span className="hidden whitespace-nowrap text-[11px] text-[color:var(--color-fog)]/45 sm:inline">· Change &amp; impact</span>
          </div>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-fog)]/60">
            Illustrative
          </span>
        </div>

        <ol className="relative mt-4 space-y-3">
          {/* Connector rail */}
          <motion.span
            aria-hidden
            className="absolute left-[15px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-[color:var(--color-domigreen)] via-[color:var(--color-domigreen)]/60 to-[color:var(--color-domigreen)]/20"
            initial={{ scaleY: reduce ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, delay: 0.6, ease: "easeOut" }}
          />
          {stages.map((s, i) => (
            <motion.li key={s.n} {...card(i)} className="relative pl-10">
              <span
                aria-hidden
                className="absolute left-0 top-3 grid h-8 w-8 place-items-center rounded-full border border-[color:var(--color-domigreen)]/50 bg-[color:var(--color-charcoal)] text-[11px] font-semibold text-[color:var(--color-domigreen)]"
              >
                {s.n}
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="eyebrow text-[0.62rem]">{s.label}</span>
                  <span className="text-[11px] text-[color:var(--color-fog)]/55">{s.meta}</span>
                </div>
                <p className="mt-2 text-sm font-[600] leading-snug text-[color:var(--color-glacier)]">{s.title}</p>
                <div className="mt-3">{s.body}</div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-xs text-[color:var(--color-fog)]/55">
        Illustrative example of a Domi Studio record, simplified for the web. Not client data.
      </figcaption>
    </figure>
  );
}
