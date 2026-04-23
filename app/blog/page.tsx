import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Blog - AEO & Google Ads insights",
  description:
    "Research, playbooks and strategy from the DomiSearch team on AI engine optimisation, Google Ads performance and search in the AI era.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10 lg:pt-24">
          <ScrollReveal as="span" className="eyebrow">The DomiSearch journal</ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)]">
              Field notes from the AI search era.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-fog)]/85">
              Playbooks, research and opinion from the team - on AEO, Google Ads and what's
              coming next in search.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
          <p className="text-[color:var(--color-fog)]/75">Articles coming soon.</p>
        </section>
      ) : (
        <>
          {featured && (
            <section className="relative mx-auto mt-10 max-w-7xl px-6 lg:px-10">
              <ScrollReveal>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="card group grid overflow-hidden p-10 transition-all lg:grid-cols-[1fr_1fr] lg:p-12"
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--color-domigreen)]">
                      <span>Featured</span>
                      <span className="h-px w-8 bg-[color:var(--color-domigreen)]/60" />
                      <span className="text-[color:var(--color-fog)]/60">{featured.readingTimeText}</span>
                    </div>
                    <h2 className="display mt-6 text-balance text-3xl sm:text-4xl lg:text-5xl">
                      {featured.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-[color:var(--color-fog)]/85">
                      {featured.excerpt}
                    </p>
                    <div className="mt-8 flex items-center gap-3 text-sm">
                      <span className="text-[color:var(--color-fog)]/70">{formatDate(featured.date)}</span>
                      <span className="text-[color:var(--color-fog)]/30">·</span>
                      <span className="text-[color:var(--color-fog)]/70">{featured.author}</span>
                    </div>
                  </div>
                  <div className="hidden items-center justify-center lg:flex">
                    <div className="relative h-64 w-64">
                      <div
                        className="absolute inset-0 rounded-full bg-[color:var(--color-domigreen)]/20 blur-3xl transition-transform duration-700 group-hover:scale-110"
                        aria-hidden
                      />
                      <div className="relative grid h-full w-full place-items-center rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <span className="display text-6xl text-[color:var(--color-domigreen)]">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </section>
          )}

          <section className="relative mx-auto mt-12 max-w-7xl px-6 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-3">
              {rest.map((post, i) => (
                <ScrollReveal key={post.slug} delay={(i % 3) * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="card group flex h-full flex-col justify-between gap-8 p-8"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-fog)]/60">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[color:var(--color-domigreen)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="display mt-5 text-2xl leading-tight text-balance sm:text-[1.75rem]">
                        {post.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fog)]/80">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[color:var(--color-fog)]/65">
                      <span>{formatDate(post.date)}</span>
                      <span>{post.readingTimeText}</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </>
      )}

      <CTA
        heading="Want this playbook applied to your brand?"
        sub="Book a free audit with Ben. We'll tell you what to ignore, what to prioritise, and how long it'll take to show up."
      />
    </>
  );
}
