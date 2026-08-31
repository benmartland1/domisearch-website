import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import type { PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/lib/client";
import {
  allPostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  relatedPostsQuery,
} from "@/sanity/lib/queries";

/**
 * The blog's data layer, backed by Sanity.
 *
 * Everything the blog renders - pages, sitemap, llms.txt, structured data -
 * reads through here, so there is exactly one definition of what a post is
 * and what counts as published.
 *
 * "Published" means Sanity has a published (non-draft) document for it. Sanity
 * keeps drafts as separate `drafts.*` documents and the read client uses the
 * `published` perspective, so a draft is invisible here until Publish is
 * clicked. There is no status field to get wrong.
 */

export type SanityImageRef = {
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  caption?: string;
  hotspot?: unknown;
  crop?: unknown;
};

export type PostAuthor = {
  name: string;
  slug?: string;
  role?: string;
  bio?: string;
  linkedinUrl?: string;
  sameAs?: string[];
  image?: SanityImageRef;
};

export type PostCategory = {
  title: string;
  slug: string;
  description?: string;
};

export type PostSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured?: boolean;
  tags?: string[];
  mainImage?: SanityImageRef;
  author?: PostAuthor;
  category?: PostCategory;
  noIndex?: boolean;
  wordCount?: number;
};

export type Faq = { question: string; answer: string };

export type Post = PostSummary & {
  /** The answer, stated outright. Rendered in the box at the top of the post. */
  tldr?: string;
  body?: PortableTextBlock[];
  faqs?: Faq[];
  seo?: PostSeo;
};

/**
 * Next caches these fetches and the /api/revalidate webhook clears them by
 * tag, which is what makes a publish go live in seconds without a redeploy.
 */
const POSTS_TAG = "post";

function tagged(tags: string[]) {
  return { next: { tags } } as const;
}

export async function getAllPosts(): Promise<PostSummary[]> {
  return client.fetch<PostSummary[]>(allPostsQuery, {}, tagged([POSTS_TAG]));
}

export async function getPostSlugs(): Promise<string[]> {
  return client.fetch<string[]>(postSlugsQuery, {}, tagged([POSTS_TAG]));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(postBySlugQuery, { slug }, tagged([POSTS_TAG, `post:${slug}`]));
}

export async function getRelatedPosts(slug: string): Promise<PostSummary[]> {
  return client.fetch<PostSummary[]>(relatedPostsQuery, { slug }, tagged([POSTS_TAG]));
}

/** Posts that belong in sitemap.xml and llms.txt. `noIndex` opts a post out. */
export async function getIndexablePosts(): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => !p.noIndex);
}

// ---------------------------------------------------------------------------
// Portable Text helpers
// ---------------------------------------------------------------------------

type Spanish = { _type?: string; text?: string; children?: unknown };

/** Flattens a Portable Text tree to readable plain text. */
export function toPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return "";
  const out: string[] = [];

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;
    const n = node as Spanish & Record<string, unknown>;

    if (n._type === "span" && typeof n.text === "string") {
      out.push(n.text);
      return;
    }
    if (n._type === "table") {
      const header = (n.header as string[] | undefined) ?? [];
      const rows = (n.rows as { cells?: string[] }[] | undefined) ?? [];
      out.push(header.join(" "));
      rows.forEach((r) => out.push((r.cells ?? []).join(" ")));
      return;
    }
    if (Array.isArray(n.children)) {
      n.children.forEach(walk);
      out.push("\n");
      return;
    }
    if (n._type === "callout" && Array.isArray(n.text)) {
      (n.text as unknown[]).forEach(walk);
      return;
    }
    if (n._type === "codeBlock" && typeof n.code === "string") {
      out.push(n.code);
    }
  };

  walk(blocks);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export function getReadingTime(body: PortableTextBlock[] | undefined): string {
  return readingTime(toPlainText(body)).text;
}

/**
 * Same phrasing as `reading-time` ("8 min read"), from a word count alone.
 * The blog listing uses this so it can show reading time without fetching
 * the body of every post.
 */
export function readingTimeFromWords(words: number | undefined): string {
  const minutes = Math.ceil((words ?? 0) / 200);
  return `${Math.max(1, minutes)} min read`;
}

export type Heading = { level: 2 | 3; text: string; slug: string };

/**
 * Heading text for a Portable Text block, matching what the browser would
 * show - which is what rehype-slug used to hash before the move to Sanity.
 */
function blockText(block: PortableTextBlock): string {
  const children = (block as unknown as { children?: { text?: string }[] }).children ?? [];
  return children
    .map((c) => c?.text ?? "")
    .join("")
    .trim();
}

/**
 * Anchor IDs for every heading in a body, keyed by block `_key`.
 *
 * One GithubSlugger instance walks the document in order, so repeated
 * headings get the same `-1`, `-2` suffixes that rehype-slug produced for the
 * MDX version of these posts. The table of contents and the rendered headings
 * both read from this map, so a link in the sidebar can never point at an
 * anchor the body did not emit.
 */
export function buildHeadingIds(body: PortableTextBlock[] | undefined): Map<string, string> {
  const ids = new Map<string, string>();
  if (!body) return ids;
  const slugger = new GithubSlugger();

  for (const block of body) {
    const style = (block as unknown as { style?: string; _key?: string })?.style;
    const key = (block as unknown as { _key?: string })?._key;
    if (!key || !style || !/^h[2-4]$/.test(style)) continue;
    const text = blockText(block);
    if (!text) continue;
    ids.set(key, slugger.slug(text));
  }

  return ids;
}

/** H2s only, matching the previous table of contents. */
export function extractHeadings(body: PortableTextBlock[] | undefined): Heading[] {
  if (!body) return [];
  const ids = buildHeadingIds(body);
  const headings: Heading[] = [];

  for (const block of body) {
    const b = block as unknown as { style?: string; _key?: string };
    if (b.style !== "h2" || !b._key) continue;
    const text = blockText(block);
    const slug = ids.get(b._key);
    if (!text || !slug) continue;
    headings.push({ level: 2, text, slug });
  }

  return headings;
}

/**
 * FAQ pairs derived from the body's `### Question?` headings.
 *
 * The MDX blog generated FAQPage schema this way — by reading question-shaped
 * H3s out of the prose — and one migrated post (what-is-aeo) still relies on
 * it. Posts written in the Studio should fill the `faqs` field instead, which
 * both renders a visible FAQ section and produces the same schema.
 *
 * Used only as a fallback, so a post can never emit two competing FAQ blocks.
 */
export function faqsFromBody(body: PortableTextBlock[] | undefined): Faq[] {
  if (!body) return [];
  const faqs: Faq[] = [];

  for (let i = 0; i < body.length; i++) {
    const b = body[i] as unknown as { _type?: string; style?: string };
    if (b._type !== "block" || b.style !== "h3") continue;

    const question = blockText(body[i]);
    if (!question.endsWith("?")) continue;

    // The first paragraph beneath it, stopping at the next heading.
    const next = body[i + 1] as unknown as { _type?: string; style?: string } | undefined;
    if (!next || next._type !== "block" || next.style !== "normal") continue;

    const answer = blockText(body[i + 1]);
    if (answer) faqs.push({ question, answer });
  }

  return faqs;
}

/** The FAQs a post should advertise: authored ones first, body-derived otherwise. */
export function resolveFaqs(post: Pick<Post, "faqs" | "body">): {
  schema: Faq[];
  visible: Faq[];
} {
  const authored = (post.faqs ?? []).filter((f) => f?.question && f?.answer);
  if (authored.length > 0) return { schema: authored, visible: authored };
  // Legacy posts keep their schema without rendering a duplicate section,
  // because the questions are already in the prose.
  return { schema: faqsFromBody(post.body), visible: [] };
}
