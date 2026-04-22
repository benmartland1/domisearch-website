import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    n: "01",
    title: "Map",
    body: "Full audit of where your brand appears across Google, ChatGPT, Gemini, Perplexity and Copilot - plus a root-cause read of your Ads account. The unvarnished truth in a single dashboard.",
  },
  {
    n: "02",
    title: "Plan",
    body: "Bespoke Search Ownership strategy - which prompts your buyers ask, which keywords convert, where paid captures intent and where AEO builds the next quarter's pipeline.",
  },
  {
    n: "03",
    title: "Ship",
    body: "Entities, schema, AI-citable content, campaign rebuilds, citation ops. Work that goes live - not slide decks that go in a drawer.",
  },
  {
    n: "04",
    title: "Compound",
    body: "The flywheel kicks in. Every AEO citation lowers your branded-search CPC. Every Quality Score gain frees budget for more content. Ads and AEO stop competing for credit and start multiplying it.",
  },
  {
    n: "05",
    title: "Report",
    body: "Weekly prompt-level dashboards, monthly strategy calls, quarterly business reviews. Tied to pipeline - never to vanity citations.",
  },
];

export function ProcessSteps() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="The Search Ownership Operating System"
        title="Five stages. One feedback loop."
        description="Our named methodology for running Ads and AEO as a single compounding system. Every engagement moves through the same five stages - the output is unique to you."
      />
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <ScrollReveal key={step.n} delay={i * 80}>
            <div className="card h-full p-7">
              <span className="display text-5xl text-[color:var(--color-domigreen)]/80">
                {step.n}
              </span>
              <h3 className="mt-6 text-xl font-[600] text-[color:var(--color-glacier)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fog)]/80">
                {step.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={420}>
        <p className="mt-10 max-w-2xl text-sm text-[color:var(--color-fog)]/60">
          Stage 4 is where most agencies can't follow. It's what makes running Ads and AEO
          together worth more than the sum of the two.
        </p>
      </ScrollReveal>
    </section>
  );
}
