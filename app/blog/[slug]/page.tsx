import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  extractHeadings,
  getPostBySlug,
  getPostSlugs,
  getReadingTime,
  getRelatedPosts,
  resolveFaqs,
  type PostAuthor,
} from "@/lib/posts";
import { getAuthor } from "@/lib/authors";
import { JsonLd } from "@/components/JsonLd";
import { PortableTextBody } from "@/components/PortableTextBody";
import { TldrCard } from "@/components/TldrCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { AuthorBio } from "@/components/AuthorBio";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FAQ } from "@/components/FAQ";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { ogImageUrl, urlForImage } from "@/sanity/lib/image";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Resolves an author for display and for Article schema.
 *
 * Sanity is the source of truth. lib/authors.ts is kept as the fallback for
 * the fields Sanity has no value for, so a half-filled author document cannot
 * strip `sameAs` or the role out of the structured data.
 */
function resolveAuthor(sanityAuthor: PostAuthor | undefined) {
  const fallback = getAuthor(sanityAuthor?.name ?? "DomiSearch Team");
  const image = sanityAuthor?.image?.asset
    ? urlForImage(sanityAuthor.image as never).width(256).height(256).fit("crop").url()
    : fallback.image;

  return {
    name: sanityAuthor?.name ?? fallback.name,
    role: sanityAuthor?.role ?? fallback.role,
    bio: sanityAuthor?.bio ?? fallback.bio,
    image,
    url: fallback.url,
    sameAs: sanityAuthor?.sameAs?.length
      ? sanityAuthor.sameAs
      : sanityAuthor?.linkedinUrl
        ? [sanityAuthor.linkedinUrl]
        : fallback.sameAs,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt;
  const url = `/blog/${post.slug}`;
  const image = ogImageUrl(post.mainImage as never);

  return {
    title,
    description,
    alternates: { canonical: post.seo?.canonicalUrl ?? url },
    ...(post.seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author?.name ?? "DomiSearch Team"],
      tags: post.tags ?? [],
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  // Sanity's published perspective means drafts never resolve here — an
  // unpublished post is simply not found.
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug);
  const headings = extractHeadings(post.body);
  const author = resolveAuthor(post.author);
  const faqs = resolveFaqs(post);
  const tags = post.tags ?? [];

  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            date: post.publishedAt,
            author: {
              name: author.name,
              role: author.role,
              url: author.url,
              image: author.image,
              sameAs: author.sameAs,
            },
            tags,
          }),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Blog", url: `${site.url}/blog` },
            { name: post.title, url: `${site.url}/blog/${post.slug}` },
          ]),
          ...(faqs.schema.length > 0 ? [faqSchema(faqs.schema)] : []),
        ]}
      />

      {/* ============================================================ */}
      {/* Dark hero - back link, tags, title, byline                   */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-16 lg:pt-24">
          <ScrollReveal>
            <Link
              href="/blog"
              className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]"
            >
              ← Back to blog
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-fog)]/70">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <h1 className="display mt-6 text-balance text-4xl sm:text-5xl lg:text-[3.5rem]">
              {post.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mt-8 flex items-center gap-3 text-sm text-[color:var(--color-fog)]/70">
              <span>{author.name}</span>
              <span className="text-[color:var(--color-fog)]/30">·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span className="text-[color:var(--color-fog)]/30">·</span>
              <span>{getReadingTime(post.body)}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Dark → paper seam */}
      <div className="paper-seam" aria-hidden />

      {/* ============================================================ */}
      {/* Paper body - TOC + article content                           */}
      {/* ============================================================ */}
      <section className="on-paper">
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:pt-24">
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <TableOfContents headings={headings} variant="paper" />
              </div>
            </aside>
          )}

          <article className="min-w-0">
            <div className="prose-paper">
              <TldrCard text={post.tldr} />
              <PortableTextBody value={post.body ?? []} />
            </div>

            <AuthorBio author={author} variant="paper" />
            <NewsletterForm />
          </article>
        </div>
      </section>

      {/* Paper → dark seam */}
      <div
        aria-hidden
        className="h-2"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-paper) 0%, var(--color-paper) 50%, var(--color-charcoal) 50%, var(--color-charcoal) 100%)",
        }}
      />

      {/* FAQs authored in the Studio. Posts whose questions are already H3s in
          the prose render nothing here — resolveFaqs keeps their schema
          without repeating the content. */}
      {faqs.visible.length > 0 && <FAQ items={faqs.visible} />}

      {/* ============================================================ */}
      {/* Dark footer zone - related posts                             */}
      {/* ============================================================ */}
      {related.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-6 pt-24 lg:px-10">
          <div className="eyebrow">Keep reading</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {related.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 80}>
                <Link href={`/blog/${p.slug}`} className="card block h-full p-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
                    {p.tags?.[0] ?? "Article"}
                  </div>
                  <h3 className="display mt-4 text-xl leading-tight text-balance sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-[color:var(--color-fog)]/75">{p.excerpt}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <div className="pb-32" />
    </>
  );
}
