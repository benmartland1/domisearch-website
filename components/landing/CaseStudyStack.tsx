import Image from "next/image";

/**
 * The "what's inside" visual — five resource cards presented as realistic
 * deliverables. On large screens they fan out with depth + shadow; on mobile
 * they stack cleanly in a vertical column so nothing overlaps text.
 *
 * All card content is realistic PLACEHOLDER — swap the numbers/quotes for the
 * real ones. Placeholder spots are marked with {/* PLACEHOLDER *​/}.
 */

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)] text-[13px] font-bold leading-none text-[color:var(--color-paper)]">
      <span className="translate-y-[0.5px]">{n}</span>
    </span>
  );
}

function CardShell({
  n,
  kicker,
  children,
}: {
  n: number;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_24px_60px_-28px_rgba(20,17,13,0.45)]">
      <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
        <NumberBadge n={n} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          {kicker}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </div>
  );
}

/* 1 — Visibility dashboard: mention-growth curve 0 → 200+/week */
function CardDashboard() {
  return (
    <CardShell n={1} kicker="Weekly AI mentions">
      <div className="flex items-baseline justify-between">
        <div>
          {/* PLACEHOLDER stat */}
          <div className="text-[2rem] font-bold leading-none tracking-tight text-[color:var(--color-ink)]">
            214<span className="text-base font-semibold text-[color:var(--color-ink-3)]"> /wk</span>
          </div>
          <div className="mt-1 text-[11px] font-medium text-[color:var(--color-pine)]">
            ▲ from 0 in 90 days
          </div>
        </div>
        <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-semibold text-[color:var(--color-ink-3)]">
          Last 90 days
        </span>
      </div>
      <div className="mt-auto pt-3">
        <svg viewBox="0 0 200 80" className="h-[104px] w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="csFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#01634c" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#01634c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 77 L15 74 L28 76 L42 69 L56 71 L70 63 L84 66 L98 57 L112 52 L126 55 L140 42 L154 38 L168 43 L182 26 L200 12 L200 80 L0 80 Z"
            fill="url(#csFill)"
          />
          <path
            d="M0 77 L15 74 L28 76 L42 69 L56 71 L70 63 L84 66 L98 57 L112 52 L126 55 L140 42 L154 38 L168 43 L182 26 L200 12"
            fill="none"
            stroke="#01634c"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-[color:var(--color-ink-3)]">
          <span>Week 1</span>
          <span>Week 12</span>
        </div>
      </div>
    </CardShell>
  );
}

/* 2 — ChatGPT/Gemini screen naming Taxd */
function CardChat() {
  return (
    <CardShell n={2} kicker="ChatGPT · answer">
      <div className="rounded-lg bg-[color:var(--color-paper-2)] px-3 py-2 text-[11px] font-medium text-[color:var(--color-ink-2)]">
        “Which online service should I use to file my UK tax return?”
      </div>
      <div className="mt-3 flex gap-2">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--color-ink)] text-[9px] font-bold text-white">
          AI
        </span>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-ink-2)]">
          A strong option is{" "}
          <span className="rounded bg-[color:var(--color-pine)]/[0.14] px-1 font-bold text-[color:var(--color-pine)]">
            Taxd
          </span>
          , an HMRC-recognised online self-assessment tool that…
        </p>
      </div>
      <div className="mt-auto flex items-center gap-1.5 pt-3 text-[10px] text-[color:var(--color-ink-3)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage)]" />
        Named in 200+ answers this week {/* PLACEHOLDER */}
      </div>
    </CardShell>
  );
}

/* 3 — AEO method breakdown document */
function CardMethod() {
  return (
    <CardShell n={3} kicker="The AEO method">
      <div className="text-[13px] font-bold leading-snug text-[color:var(--color-ink)]">
        How we made Taxd the answer
      </div>
      <div className="mt-3 space-y-2">
        {["Entity + schema foundations", "Answer-shaped content", "Authority & citations", "Track every engine"].map(
          (line, i) => (
            <div key={line} className="flex items-center gap-2">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)]/[0.12] text-[9px] font-bold leading-none text-[color:var(--color-pine)]">
                <span className="translate-y-[0.5px]">{i + 1}</span>
              </span>
              <span className="text-[11px] text-[color:var(--color-ink-2)]">{line}</span>
            </div>
          ),
        )}
      </div>
      <div className="mt-auto pt-3">
        <span className="rounded-full bg-[color:var(--color-pine)]/[0.1] px-2.5 py-1 text-[10px] font-bold text-[color:var(--color-pine)]">
          6-phase playbook
        </span>
      </div>
    </CardShell>
  );
}

/* 4 — Before / after visibility comparison */
function CardBeforeAfter() {
  return (
    <CardShell n={4} kicker="Before / after">
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[10px] font-medium text-[color:var(--color-ink-3)]">
            <span>Before</span>
            <span>0 mentions</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[color:var(--color-paper-2)]">
            <div className="h-full w-[4%] rounded-full bg-[color:var(--color-ink-3)]" />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px] font-semibold text-[color:var(--color-pine)]">
            <span>After</span>
            {/* PLACEHOLDER stat */}
            <span>200+ / week</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[color:var(--color-paper-2)]">
            <div className="h-full w-[92%] rounded-full bg-[color:var(--color-pine)]" />
          </div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        {["ChatGPT", "Gemini", "Perplexity", "Google AI"].map((e) => (
          <div
            key={e}
            className="flex items-center gap-1.5 rounded-md bg-[color:var(--color-paper-2)] px-2 py-1 text-[10px] font-medium text-[color:var(--color-ink-2)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage)]" />
            {e}
          </div>
        ))}
      </div>
    </CardShell>
  );
}

/* 5 — Founder's perspective on moving early (not an interview) */
function CardFounder() {
  return (
    <CardShell n={5} kicker="Founder's perspective">
      <div className="flex items-center gap-3">
        <Image
          src="/testimonials/eamon-shahir.png"
          alt="Eamon Shahir"
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 leading-tight">
          <div className="text-[13px] font-bold text-[color:var(--color-ink)]">Eamon Shahir</div>
          <div className="text-[11px] text-[color:var(--color-ink-3)]">Co-Founder, Taxd</div>
        </div>
      </div>

      {/* PLACEHOLDER quote */}
      <p className="mt-3 border-l-2 border-[color:var(--color-pine)]/30 pl-3 text-[12.5px] font-medium italic leading-relaxed text-[color:var(--color-ink)]">
        “We decided to be the answer instead of chasing the click.”
      </p>
    </CardShell>
  );
}

const CARDS = [
  { key: "dash", el: <CardDashboard />, rot: -9, x: -300, y: 26, mh: "h-[300px]" },
  { key: "chat", el: <CardChat />, rot: -4.5, x: -150, y: 6, mh: "h-[248px]" },
  { key: "method", el: <CardMethod />, rot: 0, x: 0, y: 0, z: true, mh: "h-[252px]" },
  { key: "before", el: <CardBeforeAfter />, rot: 4.5, x: 150, y: 6, mh: "h-[236px]" },
  { key: "founder", el: <CardFounder />, rot: 9, x: 300, y: 26, mh: "h-[196px]" },
];

export function CaseStudyStack() {
  return (
    <>
      {/* Desktop / tablet: fanned deck */}
      <div className="relative mx-auto hidden h-[430px] w-full max-w-3xl md:block" aria-hidden>
        {CARDS.map((c, i) => (
          <div
            key={c.key}
            className="absolute left-1/2 top-6"
            style={{
              width: 236,
              height: 320,
              transform: `translateX(calc(-50% + ${c.x}px)) translateY(${c.y}px) rotate(${c.rot}deg)`,
              zIndex: c.z ? 50 : 10 + (2 - Math.abs(i - 2)),
            }}
          >
            {c.el}
          </div>
        ))}
      </div>

      {/* Mobile: clean vertical stack — wide (fills the column), per-card heights */}
      <div className="mx-auto flex w-full flex-col gap-5 md:hidden">
        {CARDS.map((c) => (
          <div key={c.key} className={c.mh}>
            {c.el}
          </div>
        ))}
      </div>
    </>
  );
}
