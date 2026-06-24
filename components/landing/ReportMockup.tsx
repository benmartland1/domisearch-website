import Image from "next/image";
import { DomiMark } from "./DomiMark";

/**
 * Stylised, floating mockup of the AI Visibility Report PDF for the hero.
 * All content is believable placeholder data (no real customers/competitors) —
 * it exists to make the free report feel like a tangible deliverable.
 *
 * Palette: white pages on the cream hero, brand pine green for accents, with
 * amber/red used sparingly for the "gap" signals so the problem reads visually.
 */

const RED = "#dc2626";
const AMBER = "#f59e0b";

const ENGINE_ROWS = [
  { name: "ChatGPT", src: "/engines/chatgpt.png", ok: false },
  { name: "Perplexity", src: "/engines/perplexity.png", ok: false },
  { name: "Gemini", src: "/engines/gemini.png", amber: true },
  { name: "Copilot", src: "/engines/copilot.png", ok: false },
];

function MiniGauge({ score }: { score: number }) {
  const size = 60;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={RED}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[14px] font-bold" style={{ color: RED }}>
          {score}
        </span>
      </div>
    </div>
  );
}

function TopPage() {
  return (
    <div className="relative rounded-xl bg-white p-5 shadow-[0_30px_60px_-18px_rgba(17,17,17,0.3)] ring-1 ring-black/[0.04] lg:rotate-[6deg]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-3">
        <div className="flex items-center gap-1.5">
          <DomiMark className="h-4 w-4" />
          <span className="text-[11px] font-bold tracking-tight text-[color:var(--color-ink)]">
            AI Visibility Report
          </span>
        </div>
        <div className="text-right leading-tight">
          <div className="text-[8.5px] font-semibold text-[color:var(--color-pine)]">yourbrand.com</div>
          <div className="text-[7.5px] text-[color:var(--color-ink-3)]">June 2026</div>
        </div>
      </div>

      {/* Score */}
      <div className="mt-4 flex items-center gap-3">
        <MiniGauge score={23} />
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
            AI Visibility Score
          </div>
          <div className="mt-0.5 text-[13px] font-bold" style={{ color: RED }}>
            Invisible
          </div>
          <div className="text-[8px] text-[color:var(--color-ink-3)]">Named in 2 of 10 buyer prompts</div>
        </div>
      </div>

      {/* Chat snippet */}
      <div className="mt-4 rounded-lg bg-[#f4f3f1] p-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--color-pine)]" aria-hidden />
          <span className="text-[7.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink-3)]">
            ChatGPT
          </span>
        </div>
        <p className="mt-1.5 text-[8.5px] font-semibold text-[color:var(--color-ink)]">
          &ldquo;Best [industry] company in the UK?&rdquo;
        </p>
        <p className="mt-1 text-[8.5px] leading-relaxed text-[color:var(--color-ink-2)]">
          The strongest options are{" "}
          <span className="font-semibold text-[color:var(--color-ink)]">Acme Digital</span>,{" "}
          <span className="font-semibold text-[color:var(--color-ink)]">Northwind</span> and{" "}
          <span className="font-semibold text-[color:var(--color-ink)]">Globex</span>, each well reviewed for&hellip;
        </p>
        <div
          className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#fde8e8] px-1.5 py-0.5 text-[7.5px] font-bold"
          style={{ color: RED }}
        >
          <span aria-hidden>✕</span> Your brand: not mentioned
        </div>
      </div>

      {/* Engine coverage */}
      <div className="mt-4 border-t border-black/[0.07] pt-3">
        <div className="text-[7.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink-3)]">
          Engine coverage
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {ENGINE_ROWS.map((e) => (
            <div key={e.name} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Image
                  src={e.src}
                  alt=""
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 shrink-0 object-contain"
                />
                <span className="text-[8.5px] text-[color:var(--color-ink-2)]">{e.name}</span>
              </span>
              {e.amber ? (
                <span className="h-2 w-2 rounded-full" style={{ background: AMBER }} aria-hidden />
              ) : (
                <span className="text-[9px] font-bold leading-none" style={{ color: RED }} aria-hidden>
                  ✕
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportMockup() {
  return (
    <div className="report-float relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      {/* Back pages peek out to imply depth/length */}
      <div
        aria-hidden
        className="absolute inset-0 -translate-y-3 translate-x-3 rounded-xl bg-white shadow-[0_12px_30px_-12px_rgba(17,17,17,0.18)] ring-1 ring-black/[0.04] lg:rotate-[12deg]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -translate-y-1.5 translate-x-1.5 rounded-xl bg-white shadow-[0_12px_30px_-12px_rgba(17,17,17,0.2)] ring-1 ring-black/[0.04] lg:rotate-[9deg]"
      />
      <TopPage />
    </div>
  );
}
