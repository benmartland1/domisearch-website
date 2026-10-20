import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

/*
 * Four spacious numbered stages, text beside a large illustration, sides
 * alternating. Shared by the homepage and the sector pages so the "how it
 * works" story is told the same way everywhere.
 */

export type IllustratedStep = {
  title: string;
  body: string;
  /** Spoken description of the illustration. */
  alt: string;
  visual: ReactNode;
};

export function IllustratedSteps({ steps }: { steps: IllustratedStep[] }) {
  return (
    <ol>
      {steps.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <li
            key={s.title}
            className={`grid items-center gap-10 border-t border-black/[0.08] py-14 lg:grid-cols-2 lg:gap-20 lg:py-24 ${
              i === 0 ? "border-t-0 pt-0 lg:pt-0" : ""
            }`}
          >
            <ScrollReveal className={flip ? "lg:order-2" : ""}>
              <div className="max-w-lg">
                <span className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-ink)] text-[18px] font-bold text-[color:var(--color-domigreen)]"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink-3)]">
                    Step {i + 1} of {steps.length}
                  </span>
                </span>
                <h3 className="mt-6 text-balance text-[1.6rem] font-bold leading-[1.12] tracking-[-0.03em] text-[color:var(--color-ink)] sm:text-[2.1rem]">
                  {s.title}
                </h3>
                <p className="mt-5 text-pretty text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[18px]">
                  {s.body}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} className={flip ? "lg:order-1" : ""}>
              <figure role="img" aria-label={s.alt} className="mx-auto w-full max-w-xl">
                {s.visual}
              </figure>
            </ScrollReveal>
          </li>
        );
      })}
    </ol>
  );
}
