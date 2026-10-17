import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { SpotlightCard } from "./SpotlightCard";
import { site } from "@/lib/site";

/**
 * Homepage explanation of the AI search programme. Replaces the old two-card
 * Google Ads / AI Search grid. Every deliverable here matches the service as
 * it is currently sold; nothing about prompt volumes or guaranteed outcomes.
 */
const deliverables = [
  {
    n: "01",
    title: "AI visibility and competitor baseline",
    body: `We agree the buyer questions to track and record where you, your competitors and the cited sources appear today across ${site.platforms.join(", ")}. If visibility has never been measured, the starting point is unknown, not zero.`,
  },
  {
    n: "02",
    title: "Buyer-question and source research",
    body: "We research the questions potential clients ask before choosing a provider, and which websites the answers reference. That evidence sets the priorities, not a generic checklist.",
  },
  {
    n: "03",
    title: "Technical foundations and structured data",
    body: "Access, indexing, page structure and consistent business information, with structured data where it is appropriate and matches what is visible on the page.",
  },
  {
    n: "04",
    title: "Service-page improvements",
    body: "Pages that explain who you help, where you operate, what you offer and the evidence behind it, so an AI answer has something specific and accurate to cite.",
  },
  {
    n: "05",
    title: "Content that answers buyer questions",
    body: "New and refreshed content built around the questions in the research, written with your team's expertise and approved by you before it is published.",
  },
  {
    n: "06",
    title: "Ongoing tracking and reporting",
    body: "Daily tracking of the agreed questions, then monthly reporting and a strategy call covering your visibility, competitor appearances, cited sources and the next priorities.",
  },
];

export function ProgrammeSection() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="Our AI search programme"
        title="We don't guess. We reverse engineer."
        description="We examine which brands and sources appear in the AI answers your potential clients are reading, then use that evidence to decide what to fix, build and publish."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliverables.map((d, i) => (
          <ScrollReveal key={d.n} delay={i * 70}>
            <SpotlightCard as="article" className="card h-full p-8">
              <span className="display text-4xl text-[color:var(--color-domigreen)]/80">{d.n}</span>
              <h3 className="mt-5 text-xl font-[600] text-[color:var(--color-glacier)]">{d.title}</h3>
              <div className="hairline mt-4" />
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fog)]/85">{d.body}</p>
            </SpotlightCard>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={420}>
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm text-[color:var(--color-fog)]/65">
            Two things we do not claim: exact AI prompt search volumes, and control over which
            brands an AI platform recommends. We measure, act on the evidence, and review what
            changed.
          </p>
          <Link
            href="/services/aeo"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[color:var(--color-domigreen)] transition-transform duration-300 hover:translate-x-0.5"
          >
            See the full programme <span aria-hidden>→</span>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
