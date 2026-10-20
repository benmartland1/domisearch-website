"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

export type FAQItem = { question: string; answer: string };

/**
 * Accordion FAQ. `tone="dark"` is the inner-site treatment; `tone="light"`
 * is the white card used on the paper homepage, matching the sector pages.
 */
export function FAQ({
  items,
  heading = "Frequently asked",
  tone = "dark",
}: {
  items: FAQItem[];
  heading?: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const light = tone === "light";

  if (light) {
    return (
      <section className="relative mx-auto mt-24 max-w-3xl px-5 sm:px-6 lg:mt-32">
        <h2 className="text-balance text-center text-[clamp(1.85rem,4.2vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--color-ink)]">
          {heading}
        </h2>
        <div className="mt-10 divide-y divide-black/[0.07] overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.015] sm:px-7 sm:py-5"
                >
                  <span className="flex-1 text-[15px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[17px]">
                    {item.question}
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
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto mt-32 max-w-4xl px-6 lg:px-10">
      <ScrollReveal>
        <h2 className="display text-balance text-4xl sm:text-5xl">{heading}</h2>
      </ScrollReveal>
      <ul className="mt-12 divide-y divide-white/5 border-y border-white/5">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <ScrollReveal key={item.question} as="li" delay={i * 60}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-lg font-[500] text-[color:var(--color-glacier)]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-[color:var(--color-domigreen)] transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-500"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 pr-12 text-[color:var(--color-fog)]/85">{item.answer}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </ul>
    </section>
  );
}
