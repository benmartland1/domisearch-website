"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

export type FAQItem = { question: string; answer: string };

export function FAQ({ items, heading = "Frequently asked" }: { items: FAQItem[]; heading?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative mx-auto mt-32 max-w-4xl px-6 lg:px-10">
      <ScrollReveal>
        <h2 className="display text-balance text-4xl sm:text-5xl">{heading}</h2>
      </ScrollReveal>
      <ul className="mt-12 divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
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
                <span className="text-lg font-[500] text-[color:var(--color-ink)]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-forest)] transition-transform ${
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
                  <p className="pb-6 pr-12 text-[color:var(--color-muted)]">{item.answer}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </ul>
    </section>
  );
}
