import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { VisibilityCheckForm } from "@/components/VisibilityCheckForm";
import { AnswerCard } from "@/components/light/AnswerCard";
import { Mark, SectionLabel } from "@/components/light/Primitives";

/*
 * Opening section: headline, one short explanation, the visibility-check form
 * as the single primary action, and one illustration that shows the outcome
 * at once. No grid backdrop, no glow, no counters, no moving strip.
 */

const ENGINES = [
  { name: "ChatGPT", icon: "/engines/chatgpt.png" },
  { name: "Gemini", icon: "/engines/gemini.png" },
  { name: "Perplexity", icon: "/engines/perplexity.png" },
  { name: "Claude", icon: "/engines/claude.png" },
  { name: "Google AI Overviews", icon: "/engines/google.png" },
];

export function HomeHero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-4 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-14">
        <div>
          <SectionLabel>AI search visibility for service businesses</SectionLabel>

          <h1 className="mt-4 text-balance text-[clamp(2.2rem,6.2vw,3.7rem)] font-bold leading-[1.04] tracking-[-0.035em] text-[color:var(--color-ink)] sm:mt-5">
            Be the brand <span className="text-[color:var(--color-pine)]">AI recommends</span>.
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:mt-6 sm:text-[19px]">
            When potential clients ask ChatGPT, Gemini or Google which businesses to use, we help
            make sure yours is one of the names that comes back. Research-led, tracked daily and
            explained in plain English.
          </p>

          <div className="mt-7 sm:mt-9" id="visibility-check">
            <VisibilityCheckForm tone="light" />
            <p className="mt-4 text-[14px] text-[color:var(--color-ink-3)]">
              Prefer to talk first?{" "}
              <Link
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className="font-semibold text-[color:var(--color-pine)] underline underline-offset-4"
              >
                Book a 30-minute call
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-10">
            <span className="flex -space-x-1.5" aria-hidden>
              {ENGINES.map((e) => (
                <span
                  key={e.name}
                  className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] bg-white"
                  title={e.name}
                >
                  <Image src={e.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                </span>
              ))}
            </span>
            <span className="text-[13px] text-[color:var(--color-ink-3)]">
              Tracked daily across {site.platforms.slice(0, -1).join(", ")} and{" "}
              {site.platforms[site.platforms.length - 1]}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <AnswerCard
            query="Which recruitment agencies can help us hire a sales director in London?"
            lead={
              <>
                A few agencies specialise in senior sales hires in London. <Mark>Your company</Mark>{" "}
                is worth a look: they run retained searches for sales leaders and publish practical
                guidance on the hiring process.
              </>
            }
            rows={[
              { name: "Your company", meta: "Sales leadership · London", you: true },
              { name: "A national generalist", meta: "Multi-sector · UK-wide" },
              { name: "A regional agency", meta: "Commercial roles · South East" },
            ]}
            sources={["yourcompany.co.uk", "client reviews", "industry guide"]}
            footer={
              <p className="flex flex-wrap items-center gap-2 text-[12.5px] text-[color:var(--color-ink-3)]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-3 py-1.5 text-[11px] font-bold tracking-tight text-[color:var(--color-paper)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-domigreen)]" />
                  Named and cited
                </span>
                The outcome we work towards for every client.
              </p>
            }
          />
        </div>
      </div>
    </section>
  );
}
