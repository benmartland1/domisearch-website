/**
 * "What you unlock" — six resource cards, each with a small muted "peek" visual
 * (a fragment of the real deliverable) plus a subtle lock→unlock cue. Copy is
 * passed in unchanged; only the presentation is upgraded.
 */

type Item = { title: string; body: string };

/* ── lock cue (closed → open on hover) ──────────────────────────────────── */
function LockCue() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 h-[18px] w-[18px]">
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-[18px] w-[18px] text-[color:var(--color-ink-3)]/45 transition-opacity duration-200 group-hover:opacity-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-[18px] w-[18px] text-[color:var(--color-pine)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 7-2.6" />
      </svg>
    </div>
  );
}

function TinyCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

/* ── the six peek visuals ───────────────────────────────────────────────── */

// 1 · cropped AI-answer fragment: providers named, Taxd not mentioned (red accent)
function VStart() {
  return (
    <div className="flex h-full flex-col justify-center gap-[3px]">
      <div className="text-[8px] font-semibold leading-none text-[color:var(--color-ink-2)]">
        Recommended providers:
      </div>
      {["TaxAssist Online", "SimpleReturn", "FileSmart"].map((name, i) => (
        <div key={name} className="flex items-center gap-1.5 leading-none">
          <span className="text-[8px] font-semibold text-[color:var(--color-ink-3)]">{i + 1}.</span>
          <span className="text-[9px] text-[color:var(--color-ink-2)]">{name}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-1.5 rounded-md bg-[#c0392b]/[0.08] px-1.5 py-[3px]">
        <span className="text-[9px] font-bold leading-none text-[color:var(--color-ink-2)]">Taxd</span>
        <span className="text-[8px] font-semibold leading-none text-[#c0392b]">— not mentioned</span>
      </div>
    </div>
  );
}

// 2 · jagged growth sparkline, 0 → 200+/wk
function VTurnaround() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="text-[9px] font-bold text-[color:var(--color-pine)]">0 → 200+/wk</div>
      <svg viewBox="0 0 120 46" className="h-[52px] w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="ucSpark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#01634c" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#01634c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 42 L10 40 L20 41 L30 35 L40 37 L50 30 L60 33 L70 25 L80 27 L90 18 L100 21 L110 11 L120 6 L120 46 L0 46 Z" fill="url(#ucSpark)" />
        <path d="M0 42 L10 40 L20 41 L30 35 L40 37 L50 30 L60 33 L70 25 L80 27 L90 18 L100 21 L110 11 L120 6" fill="none" stroke="#01634c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// 3 · mini working checklist — first two done
function VMethod() {
  const rows: [boolean, string][] = [
    [true, "Organisation + FAQ schema"],
    [true, "llms.txt live"],
    [false, "Answer-first service pages"],
    [false, "Citation building"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {rows.map(([done, label]) => (
        <div key={label} className="flex items-center gap-2">
          <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[4px] ${done ? "bg-[color:var(--color-pine)] text-white" : "border border-black/25"}`}>
            {done && <TinyCheck className="h-2 w-2" />}
          </span>
          <span className={`truncate text-[8.5px] ${done ? "text-[color:var(--color-ink-2)]" : "text-[color:var(--color-ink-3)]"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// 4 · winning prompt chips
function VPrompts() {
  const prompts = ["best online tax return UK", "how to file self assessment"];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {prompts.map((q) => (
        <div key={q} className="inline-flex max-w-full items-center gap-1 self-start rounded-full border border-black/[0.08] bg-white px-2 py-1">
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0 text-[color:var(--color-ink-3)]" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" strokeLinecap="round" />
          </svg>
          <span className="truncate text-[8.5px] font-medium text-[color:var(--color-ink-2)]">{q}</span>
          <TinyCheck className="h-2.5 w-2.5 shrink-0 text-[color:var(--color-pine)]" />
        </div>
      ))}
    </div>
  );
}

// 5 · cropped pull-quote fragment (text only, trailing off)
function VFounder() {
  return (
    <div className="flex h-full flex-col justify-center">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--color-pine)]/60" fill="currentColor" aria-hidden>
        <path d="M9.5 6C6.5 7 5 9.5 5 13v5h6v-6H8c0-2 .8-3.4 2.6-4L9.5 6Zm9 0c-3 1-4.5 3.5-4.5 7v5h6v-6h-3c0-2 .8-3.4 2.6-4L18.5 6Z" />
      </svg>
      <p className="mt-1 text-[10px] italic leading-snug text-[color:var(--color-ink)]">
        “Everyone’s still fighting over Google rankings while…”
      </p>
      <p className="mt-1.5 text-[8px] font-medium text-[color:var(--color-ink-3)]">— Eamon Shahir, Co-Founder</p>
    </div>
  );
}

// 6 · phase timeline, first segment filled
function VPlaybook() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="flex items-center">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-pine)]" />
        <span className="h-1.5 flex-1 bg-[color:var(--color-pine)]" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-pine)]" />
        <span className="h-1.5 flex-1 bg-black/[0.12]" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-black/[0.18]" />
        <span className="h-1.5 flex-1 bg-black/[0.12]" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-black/[0.18]" />
      </div>
      <div className="flex justify-between text-center text-[7.5px] font-semibold">
        <span className="flex flex-col text-[color:var(--color-pine)]"><span>Foundation</span><span className="font-medium text-[color:var(--color-pine)]/70">0–30</span></span>
        <span className="flex flex-col text-[color:var(--color-ink-3)]"><span>Content</span><span className="font-medium text-[color:var(--color-ink-3)]/80">31–60</span></span>
        <span className="flex flex-col text-[color:var(--color-ink-3)]"><span>Authority</span><span className="font-medium text-[color:var(--color-ink-3)]/80">61–90</span></span>
      </div>
    </div>
  );
}

const VISUALS = [VStart, VTurnaround, VMethod, VPrompts, VFounder, VPlaybook];

/* ── card + grid ────────────────────────────────────────────────────────── */

export function UnlockCards({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
      {items.map((item, i) => {
        const Visual = VISUALS[i] ?? VStart;
        return (
          <div
            key={item.title}
            className="group relative flex h-full flex-col rounded-2xl border border-black/[0.09] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(20,17,13,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-22px_rgba(20,17,13,0.42)]"
          >
            <LockCue />
            <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4 sm:flex-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)] text-[15px] font-bold leading-none text-[color:var(--color-paper)]">
                  <span className="translate-y-[0.5px]">{i + 1}</span>
                </span>
                <div className="min-w-0 pr-7 sm:pr-0">
                  <h3 className="text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
                    {item.body}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-[176px] sm:shrink-0">
                <div className="h-[118px] w-full overflow-hidden rounded-xl border border-black/[0.07] bg-[color:var(--color-paper-2)] px-3.5 py-3">
                  <Visual />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
