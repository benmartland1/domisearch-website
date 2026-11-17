import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/Icons";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ResultCaseStudyCard } from "@/components/ResultCaseStudyCard";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { getResultBySlug, resultHref } from "@/content/results";

/** Metadata for a /case-studies/<slug> result page. */
export function resultMetadata(slug: string): Metadata {
  const r = getResultBySlug(slug);
  if (!r) return {};
  const url = resultHref(r);
  const title = { absolute: r.detail.metaTitle };
  const description = r.detail.metaDescription;
  const images = [{ url: r.image.src, width: r.image.width, height: r.image.height, alt: r.image.alt }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: r.detail.metaTitle, description, url, images },
    twitter: { card: "summary_large_image", title: r.detail.metaTitle, description },
  };
}

/** Concise detail page for one result in content/results.ts. */
export function ResultCaseStudyPage({ slug }: { slug: string }) {
  const r = getResultBySlug(slug);
  if (!r) notFound();

  const url = `${site.url}${resultHref(r)}`;
  // Anonymous clients get no `about` organisation: structured data is
  // published copy and must not identify them.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.headline,
    description: r.detail.metaDescription,
    image: `${site.url}${r.image.src}`,
    mainEntityOfPage: url,
    url,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/logo-square.png` },
    },
    ...(r.client ? { about: { "@type": "Organization", name: r.client } } : {}),
  };

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: r.client ?? r.sector, url },
          ]),
        ]}
      />

      <div className="ds-result-detail ds-wrap">
        <Link href={r.showOn.href} className="ds-result-back">
          <ArrowLeft /> Back to {r.showOn.label}
        </Link>

        <ResultCaseStudyCard result={r} variant="page" />
        {r.image.caption && <p className="ds-result-caption">{r.image.caption}</p>}

        <div className="ds-result-prose">
          <section aria-labelledby="overview">
            <h2 id="overview">Client overview</h2>
            <p>{r.detail.overview}</p>
          </section>

          <section aria-labelledby="result">
            <h2 id="result">The measured result</h2>
            <dl className="ds-result-facts">
              {r.detail.resultPoints.map((p) => (
                <div key={p.label}>
                  <dt>{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="reading">
            <h2 id="reading">How to read this result</h2>
            <ul>
              {r.detail.reading.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          {r.detail.context && (
            <section aria-labelledby="context">
              <h2 id="context">{r.detail.context.heading}</h2>
              <p>{r.detail.context.body}</p>
              {r.detail.context.link && (
                <Link href={r.detail.context.link.href} className="ds-text-link">
                  {r.detail.context.link.label}
                </Link>
              )}
            </section>
          )}
        </div>
      </div>

      <CTA
        heading="Find out where you stand in AI search."
        sub="Book a free 30-minute call. We’ll show you where your business appears in AI answers today, and where we’d focus first."
      />
    </>
  );
}
