import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  getAllCaseStudies,
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/lib/case-studies";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CTA } from "@/components/CTA";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};
  const title = cs.metaTitle ?? `${cs.client} Case Study · DomiSearch`;
  const description = cs.metaDescription ?? cs.excerpt;
  const url = `/case-studies/${cs.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const related = getAllCaseStudies()
    .filter((c) => c.slug !== cs.slug)
    .slice(0, 2);

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.excerpt,
    datePublished: cs.date,
    mainEntityOfPage: `${site.url}/case-studies/${cs.slug}`,
    url: `${site.url}/case-studies/${cs.slug}`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.png` },
    },
    about: { "@type": "Organization", name: cs.client },
  };

  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={[
          caseStudySchema,
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: cs.client, url: `${site.url}/case-studies/${cs.slug}` },
          ]),
        ]}
      />

      {/* ============================================================ */}
      {/* DARK HERO - bold, editorial, metric-forward                  */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden />
        {cs.accent && (
          <>
            <div
              aria-hidden
              className="glow"
              style={{
                width: 620,
                height: 620,
                background: cs.accent,
                top: -200,
                right: -160,
                opacity: 0.22,
              }}
            />
            <div
              aria-hidden
              className="glow"
              style={{
                width: 520,
                height: 520,
                background: "var(--color-domigreen)",
                bottom: -240,
                left: -180,
                opacity: 0.18,
              }}
            />
          </>
        )}

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]"
            >
              ← Back to home
            </Link>
          </ScrollReveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <ScrollReveal delay={60}>
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em]">
                  {cs.services.filter((s) => s !== "Integrated").map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 px-3 py-1 text-[color:var(--color-fog)]/80"
                    >
                      {s}
                    </span>
                  ))}
                  {cs.services.includes("Integrated") && (
                    <span className="rounded-full bg-[color:var(--color-domigreen)]/15 px-3 py-1 text-[color:var(--color-domigreen)]">
                      Integrated
                    </span>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <h1 className="display mt-6 text-balance text-[clamp(2.25rem,5vw,4.25rem)]">
                  {cs.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="mt-6 max-w-xl text-lg text-[color:var(--color-fog)]/80">
                  {cs.excerpt}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={280}>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-[color:var(--color-fog)]/60">
                  <div className="flex items-center gap-3">
                    <span>Client</span>
                    {cs.clientLogo && (
                      <Image
                        src={cs.clientLogo}
                        alt={cs.client}
                        width={100}
                        height={28}
                        className="h-6 w-auto opacity-85 brightness-0 invert"
                        sizes="100px"
                      />
                    )}
                  </div>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <span>{cs.sector}</span>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <span>{cs.timeline}</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Hero metric - single hero stat, dramatic */}
            <ScrollReveal delay={200}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 sm:p-10">
                <div className="eyebrow">Headline result</div>
                <div
                  className="display mt-4 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-none text-[color:var(--color-domigreen)]"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  {cs.heroMetric.value}
                </div>
                <div className="mt-4 max-w-[16rem] text-sm uppercase tracking-[0.18em] text-[color:var(--color-fog)]/80">
                  {cs.heroMetric.label}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dark → paper seam */}
      <div className="paper-seam" aria-hidden />

      {/* ============================================================ */}
      {/* PAPER - OUTCOMES band (big metric tiles)                     */}
      {/* ============================================================ */}
      {cs.metrics.length > 0 && (
        <section className="on-paper">
          <div className="mx-auto max-w-6xl px-6 pt-20 lg:px-10 lg:pt-24">
            <ScrollReveal>
              <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-ink-2)]">
                Outcomes
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="display mt-4 max-w-2xl text-balance text-[color:var(--color-ink)] text-3xl sm:text-4xl lg:text-[2.75rem]">
                The numbers behind the partnership.
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {cs.metrics.slice(0, 4).map((m, i) => (
                <ScrollReveal
                  key={m.label}
                  delay={i * 80}
                  className="bg-[color:var(--color-paper)] p-8"
                >
                  <div
                    className="display text-4xl text-[color:var(--color-pine)] sm:text-5xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                    {m.label}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* PAPER - SERVICES USED band                                   */}
      {/* ============================================================ */}
      <section className="on-paper">
        <div className="mx-auto max-w-6xl px-6 pt-20 lg:px-10">
          <ScrollReveal>
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-ink-2)]">
              Services used
            </div>
          </ScrollReveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cs.services.map((s, i) => {
              const { body } = serviceCopy(s);
              return (
                <ScrollReveal key={s} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-black/10 bg-[color:var(--color-paper-2)] p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
                      {s}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-2)]">
                      {body}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAPER - THE STORY (MDX prose, tightened)                     */}
      {/* ============================================================ */}
      <section className="on-paper">
        <div className="mx-auto max-w-3xl px-6 pb-6 pt-20 lg:px-0 lg:pt-24">
          <ScrollReveal>
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-ink-2)]">
              The story
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="display mt-4 text-balance text-[color:var(--color-ink)] text-3xl sm:text-4xl lg:text-[2.5rem]">
              How the engagement unfolded.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="prose-paper mt-10">
              <MDXRemote
                source={cs.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAPER - BIG EDITORIAL QUOTE                                  */}
      {/* ============================================================ */}
      {cs.quote && (
        <section className="on-paper">
          <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 lg:px-10">
            <ScrollReveal>
              <figure className="relative overflow-hidden rounded-3xl border border-black/10 bg-[color:var(--color-paper-2)] p-10 sm:p-14">
                <span
                  aria-hidden
                  className="absolute -left-5 top-3 font-[700] text-[10rem] leading-[0.8] text-[color:var(--color-pine)]/12 select-none sm:text-[13rem] sm:top-5"
                  style={{
                    color: cs.accent
                      ? `color-mix(in oklab, ${cs.accent} 18%, transparent)`
                      : undefined,
                  }}
                >
                  &ldquo;
                </span>
                <blockquote
                  className="relative text-balance text-[color:var(--color-ink)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.625rem, 3vw, 2.5rem)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {cs.quote}
                </blockquote>
                {cs.quoteAuthor && (
                  <figcaption className="relative mt-10 flex items-center gap-5">
                    {cs.quoteAuthorPhoto ? (
                      <Image
                        src={cs.quoteAuthorPhoto}
                        alt={cs.quoteAuthor}
                        width={48}
                        height={48}
                        sizes="48px"
                        className="h-12 w-12 shrink-0 rounded-full object-cover object-center ring-1 ring-black/10"
                      />
                    ) : (
                      <span
                        className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-[color:var(--color-paper)] text-sm font-[600]"
                        style={{ color: cs.accent ?? "#01634c" }}
                      >
                        {cs.quoteAuthor.split(" ").map((p) => p[0]).join("")}
                      </span>
                    )}
                    <div>
                      <div className="text-sm font-[600] text-[color:var(--color-ink)]">
                        {cs.quoteAuthor}
                      </div>
                      {cs.quoteRole && (
                        <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                          {cs.quoteRole}
                        </div>
                      )}
                    </div>
                  </figcaption>
                )}
              </figure>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Paper → dark */}
      <div
        aria-hidden
        className="h-2"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-paper) 0%, var(--color-paper) 50%, var(--color-charcoal) 50%, var(--color-charcoal) 100%)",
        }}
      />

      {related.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-6 pt-24 lg:px-10">
          <div className="eyebrow">More case studies</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {related.map((r, i) => (
              <ScrollReveal key={r.slug} delay={i * 100}>
                <CaseStudyCard caseStudy={r} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <CTA
        heading="Ready to compound your search results?"
        sub="Book a free 30-minute audit. We'll show you where you're winning, where you're invisible, and what to do next."
      />
    </>
  );
}

function serviceCopy(service: string): { body: string } {
  switch (service) {
    case "Google Ads":
      return {
        body:
          "Full-funnel Google Ads management - restructure, creative, CRO, bidding. Run by a Google Partner with £3M+ managed spend.",
      };
    case "AEO":
      return {
        body:
          "Entity work, AI-citable content, schema, and citation ops across ChatGPT, Gemini, Perplexity, Copilot and Claude.",
      };
    case "Integrated":
      return {
        body:
          "Ads and AEO run as a single compounding system. Every AI citation lowers branded CPC; every Quality Score win frees budget for more content.",
      };
    default:
      return { body: "" };
  }
}
