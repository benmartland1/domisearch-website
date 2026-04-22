import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoWall } from "@/components/LogoWall";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About - The team behind DomiSearch",
  description:
    "DomiSearch is a small, senior team led by Ben Martland - a Google Partner and Shopify Partner agency built on performance, transparency and AI-first thinking.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Honest before clever",
    body: "We tell clients what isn't working before we tell them what we'll do about it. Plain English, always.",
  },
  {
    title: "Performance over theatre",
    body: "No vanity decks. No exported PDFs. Real dashboards, real numbers, real accountability.",
  },
  {
    title: "Selective by design",
    body: "We turn down more work than we take on. Fit matters more than fee - it's the only way we stay sharp.",
  },
  {
    title: "Built for what's next",
    body: "AI search is changing how people find brands. We're building for the search engines that will exist in two years, not the ones we knew two years ago.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          personSchema({
            name: site.founder,
            jobTitle: "Founder, DomiSearch",
            image: "/brand/founder.jpg",
            url: `${site.url}/about`,
            sameAs: [site.social.linkedin],
            description:
              "Ben Martland is the founder of DomiSearch. Four years running Google Ads for e-commerce and service brands. Google Partner and Shopify Partner. Leads the agency's AEO research programme from Manchester.",
            worksFor: { name: site.name, url: site.url },
          }),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "About", url: `${site.url}/about` },
          ]),
        ]}
      />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">About</ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)]">
              A small, senior team - built for the way search is moving.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-8 max-w-3xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              DomiSearch started as a Google Ads agency. We're now the search agency for the AI
              era - combining paid and AI engine optimisation into a single discipline we call{" "}
              <span className="text-[color:var(--color-glacier)]">Search Ownership</span>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <ScrollReveal>
            <div className="relative">
              <div
                aria-hidden
                className="glow"
                style={{
                  width: 360,
                  height: 360,
                  background: "var(--color-domigreen)",
                  top: -40,
                  left: -40,
                  opacity: 0.22,
                }}
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-[1.6rem] bg-[color:var(--color-charcoal)]">
                  <Image
                    src="/brand/ben-warm.jpg"
                    alt="Ben Martland, Founder of DomiSearch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal as="span" className="eyebrow">Founder</ScrollReveal>
            <ScrollReveal delay={60}>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Ben Martland</h2>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="mt-6 max-w-xl text-[color:var(--color-fog)]/85">
                Ben founded DomiSearch after almost a decade running paid and organic campaigns for
                e-commerce and service brands. He personally reviews every client account monthly
                and leads the agency's AEO research.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-4 max-w-xl text-[color:var(--color-fog)]/80">
                Based in Manchester, working with brands across the UK, EU and US.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                  Book a call with Ben →
                </Link>
                <Link href={site.social.linkedin} target="_blank" rel="noopener" className="btn btn-ghost">
                  LinkedIn
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <ScrollReveal delay={120}>
          <div className="card p-10">
            <div className="eyebrow">What sets us apart</div>
            <ul className="mt-6 grid gap-5 text-[color:var(--color-fog)]/85 sm:grid-cols-2">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Google + Shopify Partners.</strong> Certified across the platforms that matter most for paid performance and e-commerce.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">£3M+ managed spend.</strong> Pattern recognition at a scale a junior freelancer can't match.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">AEO-first positioning.</strong> We publish original research on AI engine visibility monthly.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Flat monthly fees.</strong> No percentage-of-spend incentives. No smoke.</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <ScrollReveal>
            <div className="eyebrow">The thesis</div>
            <h2 className="display mt-4 text-balance text-4xl sm:text-5xl lg:text-[3.5rem]">
              Search Ownership.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="space-y-5 text-[color:var(--color-fog)]/85">
              <p>
                Search today isn't just Google. It's ChatGPT, Gemini, Perplexity, Copilot and
                the handful of engines coming next. Your buyers don't care which surface
                delivers the answer - only that your brand is in it.
              </p>
              <p>
                Search Ownership is the discipline of showing up, consistently, across every
                surface they use. Paid covers the demand that exists today. AEO engineers the
                demand forming inside AI answers. Together, they compound. In isolation, they
                each do real work - which is why we sell them that way too.
              </p>
              <p className="text-[color:var(--color-glacier)]">
                We built the whole agency around making them run as one.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <SectionHeader eyebrow="How we operate" title="Four things we actually mean." />
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={(i % 2) * 120}>
              <article className="card p-8">
                <h3 className="text-2xl font-[600] text-[color:var(--color-glacier)]">{v.title}</h3>
                <div className="hairline mt-4" />
                <p className="mt-4 text-[color:var(--color-fog)]/85">{v.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <LogoWall />

      <CTA heading="Work with a team that does the actual work." sub="If you're tired of agencies who talk more than they ship, book a 30-minute call. We'll tell you honestly whether we can help." />
    </>
  );
}
