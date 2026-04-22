import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  extractFAQs,
  extractHeadings,
  getAllPostSlugs,
  getAllPosts,
  getPostBySlug,
} from "@/lib/blog";
import { getAuthor } from "@/lib/authors";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { AuthorBio } from "@/components/AuthorBio";
import { NewsletterForm } from "@/components/NewsletterForm";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const url = `/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const headings = extractHeadings(post.content).filter((h) => h.level === 2);
  const author = getAuthor(post.author);
  const faqs = extractFAQs(post.content);

  return (
    <>
      <ScrollProgress />
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            date: post.date,
            author: {
              name: author.name,
              role: author.role,
              url: author.url,
              image: author.image,
              sameAs: author.sameAs,
            },
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Blog", url: `${site.url}/blog` },
            { name: post.title, url: `${site.url}/blog/${post.slug}` },
          ]),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
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
              {post.tags.map((t) => (
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
              <span>{post.author}</span>
              <span className="text-[color:var(--color-fog)]/30">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-[color:var(--color-fog)]/30">·</span>
              <span>{post.readingTimeText}</span>
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
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
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
                    {p.tags[0] ?? "Article"}
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
