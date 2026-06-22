import Image from "next/image";

/**
 * Clean row of AI-engine logo chips. Uses the real brand marks in
 * /public/engines. Communicates report coverage at a glance.
 */
const ENGINES = [
  { name: "ChatGPT", src: "/engines/chatgpt.png" },
  { name: "Google AI", src: "/engines/google.png" },
  { name: "Perplexity", src: "/engines/perplexity.png" },
  { name: "Gemini", src: "/engines/gemini.png" },
  { name: "Copilot", src: "/engines/copilot.png" },
];

export function EngineStrip({ label }: { label?: string }) {
  return (
    <div>
      {label && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
          {label}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        {ENGINES.map((e) => (
          <span
            key={e.name}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <Image
              src={e.src}
              alt=""
              width={20}
              height={20}
              className="h-[18px] w-[18px] object-contain"
            />
            <span className="text-[13px] font-semibold tracking-tight text-[color:var(--color-ink)]">
              {e.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
