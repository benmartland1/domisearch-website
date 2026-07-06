import { DomiMark } from "./DomiMark";

/**
 * The hero asset of the paid page: a floating, fanned mockup of the multi-page
 * "AI Visibility Roadmap" PDF - so it reads as a real, premium deliverable they
 * buy and keep. Top page = the score/cover; pages behind peek out showing a
 * technical-fixes checklist and a phased 90-day timeline.
 *
 * All content is believable placeholder - no real customer data.
 */

const AMBER = "#f59e0b";
const RED = "#dc2626";

function MiniGauge({ score }: { score: number }) {
  const size = 58;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score <= 20 ? RED : score <= 50 ? AMBER : "#01634c";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

/* A back page: white sheet with a green section header + peeking content rows. */
function SheetHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 pb-2 pt-3">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-pine)]" aria-hidden />
      <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-pine)]">
        {label}
      </span>
    </div>
  );
}

const FIXES = [
  "Add Organisation + FAQ schema",
  "Publish 6 buyer-intent answer pages",
  "Fix thin service-page copy",
];

const PHASES = [
  { label: "Days 0–30 · Foundations", w: "38%" },
  { label: "Days 30–60 · Authority", w: "66%" },
  { label: "Days 60–90 · Compounding", w: "92%" },
];

export function RoadmapMockup() {
  const sheet =
    "overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.05] shadow-[0_16px_40px_-20px_rgba(20,17,13,0.28)]";
  return (
    <div className="report-float relative mx-auto w-full max-w-[300px] pt-24 sm:max-w-[340px]">
      {/* Back page 3 - 90-day timeline (peeks highest) */}
      <div className={`absolute inset-x-0 top-0 -translate-y-[112px] translate-x-[16px] lg:rotate-[5deg] ${sheet}`}>
        <SheetHeader label="90-Day Roadmap" />
        <div className="space-y-2 px-4 py-3">
          {PHASES.map((p) => (
            <div key={p.label}>
              <div className="text-[8px] font-semibold text-[color:var(--color-ink-2)]">{p.label}</div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full bg-[color:var(--color-pine)]" style={{ width: p.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back page 2 - technical fixes checklist (peeks middle) */}
      <div className={`absolute inset-x-0 top-0 -translate-y-[56px] translate-x-[8px] lg:rotate-[2.5deg] ${sheet}`}>
        <SheetHeader label="Technical Fixes · Prioritised" />
        <div className="space-y-2 px-4 py-3">
          {FIXES.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" aria-hidden>
                <rect width="16" height="16" rx="4" fill="var(--color-pine)" />
                <path d="M4.5 8.5l2.2 2.2L11.5 6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px] text-[color:var(--color-ink-2)]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Front page - cover + score gauge */}
      <div className={`relative ${sheet}`}>
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 pb-3 pt-4">
          <div className="flex items-center gap-1.5">
            <DomiMark className="h-4 w-4" />
            <span className="text-[11px] font-bold tracking-tight text-[color:var(--color-ink)]">
              AI Visibility Roadmap
            </span>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[8.5px] font-semibold text-[color:var(--color-pine)]">yourbrand.com</div>
            <div className="text-[7.5px] text-[color:var(--color-ink-3)]">90-day plan</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 pt-4">
          <MiniGauge score={34} />
          <div>
            <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
              AI Visibility Score
            </div>
            <div className="mt-0.5 text-[13px] font-bold" style={{ color: AMBER }}>
              Emerging
            </div>
            <div className="text-[8px] text-[color:var(--color-ink-3)]">Named in 3 of 12 buyer prompts</div>
          </div>
        </div>

        <div className="mt-4 border-t border-black/[0.06] px-5 py-3">
          <div className="text-[7.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
            Inside your roadmap
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {["Visibility score · every engine", "Full technical audit", "Content opportunities", "Phased 90-day plan"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[color:var(--color-pine)]" aria-hidden />
                <span className="text-[8px] text-[color:var(--color-ink-2)]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[color:var(--color-pine)] px-5 py-2.5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/80">
            Prepared by DomiSearch
          </span>
          <span className="text-[9px] font-bold text-white">£99</span>
        </div>
      </div>
    </div>
  );
}
