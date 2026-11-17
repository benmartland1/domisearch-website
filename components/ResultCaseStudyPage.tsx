import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft } from "@/components/Icons";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ResultCaseStudyCard } from "@/components/ResultCaseStudyCard";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
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

/**
 * Long-form body from content/results/<file>.md. Read at build time (these
 * pages are statically rendered). The Markdown is our own copy, not user
 * input. External links open in a new tab.
 */
function renderArticle(file: string): string {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "results", file), "utf-8");
  const html = marked.parse(raw, { async: false, gfm: true }) as string;
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

/** Detail page for one result in content/results.ts. */
export function ResultCaseStudyPage({ slug }: { slug: string }) {
  const r = getResultBySlug(slug);
  if (!r) notFound();
  const d = r.detail;

  const url = `${site.url}${resultHref(r)}`;
  // Anonymous clients get no `about` organisation: structured data is
  // published copy and must not identify them.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.headline,
    description: d.metaDescription,
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

  const articleHtml = d.article ? renderArticle(d.article) : null;
  const heroIsCard = d.heroCta === "booking";
  // The hero is the card exactly as it appears on the page that lists it.
  const heroLook = r.showOn.page === "home" ? "home" : "default";

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: r.client ?? r.sector, url },
          ]),
          ...(d.faqs?.length ? [faqSchema(d.faqs)] : []),
        ]}
      />

      <div className={`ds-result-detail ds-wrap${heroIsCard ? ` ds-result-detail--${r.showOn.page}` : ""}`}>
        <Link href={r.showOn.href} className="ds-result-back">
          <ArrowLeft /> Back to {r.showOn.label}
        </Link>

        {heroIsCard ? (
          // The listing card, unchanged, as the hero: headline as the h1 and
          // the nav's booking link in place of "Read case study".
          <ResultCaseStudyCard
            result={r}
            look={heroLook}
            as="h1"
            priority
            cta={{ label: "Book a call", href: site.calendly, external: true }}
          />
        ) : (
          <ResultCaseStudyCard result={r} variant="page" />
        )}
        {r.image.caption && <p className="ds-result-caption">{r.image.caption}</p>}

        {articleHtml ? (
          <div className="ds-result-article">
            <div dangerouslySetInnerHTML={{ __html: articleHtml }} />

            {d.faqs && d.faqs.length > 0 && (
              <section aria-labelledby="faqs">
                <h2 id="faqs">Frequently Asked Questions</h2>
                {d.faqs.map((f) => (
                  <div key={f.question}>
                    <h3>{f.question}</h3>
                    <p>{f.answer}</p>
                  </div>
                ))}
              </section>
            )}

            {d.note && <p className="ds-result-note">{d.note}</p>}
          </div>
        ) : (
          <div className="ds-result-prose">
            {d.overview && (
              <section aria-labelledby="overview">
                <h2 id="overview">Client overview</h2>
                <p>{d.overview}</p>
              </section>
            )}

            {d.resultPoints && (
              <section aria-labelledby="result">
                <h2 id="result">The measured result</h2>
                <dl className="ds-result-facts">
                  {d.resultPoints.map((p) => (
                    <div key={p.label}>
                      <dt>{p.label}</dt>
                      <dd>{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {d.reading && (
              <section aria-labelledby="reading">
                <h2 id="reading">How to read this result</h2>
                <ul>
                  {d.reading.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            )}

            {d.context && (
              <section aria-labelledby="context">
                <h2 id="context">{d.context.heading}</h2>
                <p>{d.context.body}</p>
                {d.context.link && (
                  <Link href={d.context.link.href} className="ds-text-link">
                    {d.context.link.label}
                  </Link>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      <CTA
        heading={d.cta?.heading ?? "Find out where you stand in AI search."}
        sub={
          d.cta?.sub ??
          "Book a free 30-minute call. We’ll show you where your business appears in AI answers today, and where we’d focus first."
        }
      />
    </>
  );
}
