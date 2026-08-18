"use client";

import { useState } from "react";

/**
 * Accordion FAQ. Doubles as AEO surface area — these are the exact questions
 * recruitment owners ask AI about AEO, so the answers are written to be
 * extractable as standalone statements.
 */
export type FaqItem = { q: string; a: string };

export function VerticalFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/[0.07] overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.015] sm:px-7 sm:py-5"
            >
              <span className="flex-1 text-[15px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[17px]">
                {item.q}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 transition-transform duration-300 ${
                  isOpen ? "rotate-45 bg-[color:var(--color-ink)]" : ""
                }`}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke={isOpen ? "#f5f2ec" : "currentColor"}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[15px] leading-relaxed text-[color:var(--color-ink-2)] sm:px-7 sm:pb-6">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
