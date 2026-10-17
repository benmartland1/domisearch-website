import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoWall } from "@/components/LogoWall";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const aboutGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: "DomiSearch",
      url: site.url,
      logo: `${site.url}/brand/logo.png`,
      foundingDate: "2023",
      description:
        "DomiSearch is a Manchester-based AI search visibility (Answer Engine Optimisation) agency for service businesses. It helps brands get discovered, mentioned and cited across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews, with recruitment agencies a core focus. DomiSearch also manages Google Ads for a smaller number of clients.",
      areaServed: ["United Kingdom", "European Union", "United States"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Manchester",
        addressCountry: "GB",
      },
      sameAs: [
        site.social.linkedin,
        site.trustpilot,
        "https://x.com/benmartland",
      ],
      founder: { "@type": "Person", name: "Ben Martland" },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/about#ben-martland`,
      name: "Ben Martland",
      jobTitle: "Founder",
      worksFor: { "@type": "Organization", name: "DomiSearch" },
      url: `${site.url}/about`,
      sameAs: [
        "https://www.linkedin.com/in/benmartland/",
        "https://x.com/benmartland",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Manchester",
        addressCountry: "GB",
      },
      description:
        "Ben Martland is the founder of DomiSearch, an AI search visibility (AEO) agency for service businesses. He leads DomiSearch's AI search research and client delivery, and came to it from five years in search marketing, running paid search for e-commerce and service brands in-house and agency-side.",
    },
    {
      "@type": "AboutPage",
      name: "About DomiSearch",
      url: `${site.url}/about`,
      description:
        "Learn about DomiSearch, an AI search visibility (AEO) agency for service businesses founded in 2023 by Ben Martland and based in Manchester.",
      mainEntity: { "@type": "Organization", name: "DomiSearch" },
    },
  ],
};

export const metadata: Metadata = {
  title: "About DomiSearch | AI Search Visibility Agency - Manchester",
  description:
    "DomiSearch is an AI search visibility (AEO) agency for service businesses, founded in 2023 by Ben Martland and based in Manchester. Research-led, tracked daily, reported monthly.",
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
    title: "Evidence over opinion",
    body: "We look at what AI answers actually say about your market before we recommend anything, and we tell you what the measurement can and cannot show.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutGraph) }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ])}
      />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">About</ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)]">
              An AI search visibility agency for service businesses.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-8 max-w-3xl text-lg text-[color:var(--color-fog)]/85 sm:text-xl">
              DomiSearch helps service businesses improve how they are discovered, mentioned and
              cited across{" "}
              <span className="text-[color:var(--color-glacier)]">
                ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews
              </span>
              . Recruitment agencies are a core focus. We work with clients across the UK, EU and
              US, and still manage Google Ads for a smaller number of them.
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
                    src="/brand/founder.png"
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
                Ben Martland founded DomiSearch in 2023 and leads its AI search research and client
                delivery: the buyer-question research, the visibility tracking and the review of
                every client account. Before that he spent five years in search marketing, running
                paid search for e-commerce and service brands in-house and then agency-side.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-4 max-w-xl text-[color:var(--color-fog)]/80">
                The agency is based in Manchester and works with clients across the UK, EU and US.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                  Book a call →
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
            <div className="eyebrow">How we work</div>
            <p className="mt-6 max-w-3xl text-[color:var(--color-fog)]/85">
              Every programme starts with evidence: where you, your competitors and the cited
              sources appear today for the questions your potential clients ask AI. That baseline
              decides the work. We then improve the technical foundations, service pages and
              content, with your team's expertise and approval, and track the agreed questions
              daily so the monthly review is about what changed, not what we hoped would.
            </p>
            <ul className="mt-8 grid gap-5 text-[color:var(--color-fog)]/85 sm:grid-cols-2">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Research first.</strong> Buyer questions, competitor appearances and cited sources, recorded before any work starts.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Daily tracking, monthly review.</strong> The same questions, the same platforms, so periods can be compared fairly.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Your expertise, our structure.</strong> Content is built with your team and approved by you before publication.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                <span><strong className="text-[color:var(--color-glacier)]">Honest about limits.</strong> We cannot control which brands an AI platform recommends, and we say so.</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[color:var(--color-domigreen)]">
              <Link
                href="/services/aeo"
                className="inline-flex items-center gap-2 transition-transform duration-300 hover:translate-x-0.5"
              >
                Our AI search programme <span aria-hidden>→</span>
              </Link>
              <Link
                href="/services/google-ads"
                className="inline-flex items-center gap-2 text-[color:var(--color-fog)]/70 transition-transform duration-300 hover:translate-x-0.5"
              >
                Google Ads management <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <ScrollReveal>
            <div className="eyebrow">The thesis</div>
            <h2 className="display mt-4 text-balance text-4xl sm:text-5xl lg:text-[3.5rem]">
              Reverse engineer the answer.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="space-y-5 text-[color:var(--color-fog)]/85">
              <p>
                A growing share of buyers now research a service business by asking an AI tool
                before they visit a website or make a call. The answer they get back is their
                first shortlist. Your brand is either in it or it is not.
              </p>
              <p>
                We do not guess at why one firm is named and another is not. We look at the
                answers themselves: which brands appear, which sources are cited and how each
                business is described. Then we work backwards from that evidence to the website
                changes, content and credibility work most likely to move it, and we keep
                measuring to see whether it did.
              </p>
              <p className="text-[color:var(--color-glacier)]">
                Evidence in, work out, measured against the same questions every day.
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

      <CTA heading="Find out where you stand in AI search." sub="Book a 30-minute discovery call. We will look at how your business appears in AI answers today and tell you honestly whether we can help." />
    </>
  );
}
