import Image from "next/image";
import type { ReactNode } from "react";
import { IllustrationTag, LightWindow, SparkIcon } from "./Primitives";

/*
 * A finished AI answer, drawn as a light chat window. Static on purpose: the
 * visitor sees the meaningful state at once, with no typing sequence and no
 * reserved empty space. The ranked rows never name a real competitor.
 */

export type AnswerRow = { name: string; meta: string; you?: boolean };

export function AnswerCard({
  engine = "ChatGPT",
  engineIcon = "/engines/chatgpt.png",
  query,
  lead,
  rows,
  sources,
  footer,
  className = "",
}: {
  engine?: string;
  engineIcon?: string;
  query: string;
  /** The answer sentence. May include <Mark> around the client's name. */
  lead: ReactNode;
  rows: AnswerRow[];
  sources?: string[];
  /** Optional line under the answer, e.g. a "not mentioned" note. */
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <LightWindow
      title={engine}
      icon={
        <Image src={engineIcon} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
      }
      tag={<IllustrationTag />}
      className={className}
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-end">
          <p className="max-w-[88%] rounded-2xl rounded-br-md bg-[#f1efe9] px-4 py-2.5 text-[14px] leading-snug text-[color:var(--color-ink)] sm:text-[15px]">
            {query}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)]/10 text-[color:var(--color-pine)]">
            <SparkIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[15px]">
              {lead}
            </p>

            <ol className="mt-3.5 space-y-1.5">
              {rows.map((r, i) => (
                <li
                  key={r.name}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    r.you
                      ? "border-[color:var(--color-pine)]/35 bg-[color:var(--color-pine)]/[0.06]"
                      : "border-black/[0.06] bg-[#fbfaf8]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      r.you
                        ? "bg-[color:var(--color-pine)] text-white"
                        : "bg-black/[0.06] text-[color:var(--color-ink-3)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[14px] font-semibold tracking-tight ${
                        r.you ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-2)]"
                      }`}
                    >
                      {r.name}
                    </span>
                    <span className="block truncate text-[12px] text-[color:var(--color-ink-3)]">
                      {r.meta}
                    </span>
                  </span>
                  {r.you ? (
                    <span className="shrink-0 rounded-full bg-[color:var(--color-pine)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                      You
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            {sources?.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                  Sources
                </span>
                {sources.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-[#fbfaf8] px-2.5 py-1 text-[11px] text-[color:var(--color-ink-2)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-sage)]" />
                    {s}
                  </span>
                ))}
              </div>
            ) : null}

            {footer ? <div className="mt-4">{footer}</div> : null}
          </div>
        </div>
      </div>
    </LightWindow>
  );
}

/** Red "not mentioned" chip for the before-state. */
export function NotMentioned({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#fdeeee] px-3 py-1.5 text-[12px] font-semibold text-[#b4342f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d4453f]" />
      {name}: not mentioned
    </span>
  );
}
