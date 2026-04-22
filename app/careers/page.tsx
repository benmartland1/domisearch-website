import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers - Join DomiSearch",
  description:
    "Hire-by-hire, we're building one of the best small search teams in Europe. If you're senior, curious and allergic to corporate process, we'd like to talk.",
  alternates: { canonical: "/careers" },
};

const principles = [
  {
    title: "Senior only, by design",
    body: "No junior pools. Everyone here owns client work end-to-end. If you want to hide inside a process, this won't fit.",
  },
  {
    title: "Remote-first, Manchester-rooted",
    body: "Work from wherever you think best. We meet in Manchester for strategy days every quarter.",
  },
  {
    title: "Build in public",
    body: "We publish research, share playbooks and contribute to how the AEO industry develops. Your work gets attribution.",
  },
  {
    title: "Fair and transparent pay",
    body: "Fixed bands by role, published internally. No silly bonuses. We share the upside when the business grows.",
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">Careers</ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)]">
              Build the search agency you'd want to hire.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-8 max-w-3xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              We hire slowly and rarely. We look for senior operators who genuinely enjoy the
              craft - paid media specialists, technical SEOs, AEO researchers, and a handful of
              generalists who want to define a new discipline.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <SectionHeader eyebrow="How we work" title="Four non-negotiables." />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {principles.map((p, i) => (
            <ScrollReveal key={p.title} delay={(i % 2) * 100}>
              <article className="card p-8">
                <h3 className="text-2xl font-[600] text-[color:var(--color-glacier)]">{p.title}</h3>
                <div className="hairline mt-4" />
                <p className="mt-4 text-[color:var(--color-fog)]/85">{p.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="card p-10 lg:p-14">
          <ScrollReveal>
            <div className="eyebrow">Current openings</div>
            <h2 className="display mt-4 text-3xl sm:text-4xl">No public roles right now.</h2>
            <p className="mt-5 max-w-2xl text-[color:var(--color-fog)]/85">
              We hire opportunistically. If you're exceptional at Google Ads, AEO, technical SEO,
              or you think you'd be a great fit for a small senior team, email Ben directly.
              Include work you're proud of.
            </p>
            <div className="mt-8">
              <Link
                href={`mailto:${site.email}?subject=Careers - introduction`}
                className="btn btn-primary"
              >
                Introduce yourself
                <span aria-hidden>→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="pb-32" />
    </>
  );
}
