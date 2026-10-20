import { ScrollReveal } from "./ScrollReveal";

/**
 * The four-stage method as a loop. The final stage feeds back into research,
 * which is the point: findings from each review set the next priorities.
 * Desktop: four steps in a row with a return path drawn beneath them.
 * Mobile: stacked, with the return path described in words.
 */
const steps = [
  {
    n: "1",
    title: "Research",
    body: "Examine the answers, competitors and sources relevant to your buyers.",
  },
  {
    n: "2",
    title: "Prioritise",
    body: "Use that evidence to decide which pages, content and technical fixes to tackle first.",
  },
  {
    n: "3",
    title: "Implement",
    body: "Deliver the agreed work and record when it goes live.",
  },
  {
    n: "4",
    title: "Measure and refine",
    body: "Review subsequent performance and use the findings to set the next priorities.",
  },
];

export function MethodLoop() {
  return (
    <div className="relative">
      <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-0">
        {steps.map((s, i) => (
          <ScrollReveal key={s.n} as="li" delay={i * 90} className="relative lg:px-3 lg:first:pl-0 lg:last:pr-0">
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--color-domigreen)]/60 text-xs font-semibold text-[color:var(--color-domigreen)]">
                  {s.n}
                </span>
                <h3 className="text-lg font-[600] text-[color:var(--color-glacier)]">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fog)]/85">{s.body}</p>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute right-[-7px] top-1/2 z-10 hidden -translate-y-1/2 text-[color:var(--color-domigreen)] lg:block"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h9M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </ScrollReveal>
        ))}
      </ol>

      {/* Return path: stage 4 feeds back into stage 1 */}
      <ScrollReveal delay={380}>
        <div className="relative mt-4 hidden lg:block" aria-hidden>
          <svg viewBox="0 0 1000 56" className="h-14 w-full" preserveAspectRatio="none" fill="none">
            <path
              d="M940 0 V30 Q940 44 926 44 H74 Q60 44 60 30 V12"
              stroke="url(#loop-grad)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              vectorEffect="non-scaling-stroke"
            />
            <path d="M52 20 L60 10 L68 20" stroke="var(--color-domigreen)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <defs>
              <linearGradient id="loop-grad" x1="0" x2="1">
                <stop offset="0" stopColor="var(--color-domigreen)" />
                <stop offset="1" stopColor="var(--color-domigreen)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute left-1/2 top-[22px] -translate-x-1/2 -translate-y-1/2 bg-[color:var(--color-charcoal)] px-3 text-xs uppercase tracking-[0.18em] text-[color:var(--color-domigreen)]">
            Findings feed the next round of research
          </span>
        </div>
        <p className="mt-4 text-sm text-[color:var(--color-fog)]/70 lg:hidden">
          <span className="text-[color:var(--color-domigreen)]">↺</span> Findings from each review feed the next round of research.
        </p>
      </ScrollReveal>
    </div>
  );
}
