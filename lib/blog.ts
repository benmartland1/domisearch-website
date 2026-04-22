import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  cover?: string;
};

export type Post = PostFrontmatter & {
  content: string;
  readingTimeText: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function ensureDir(): string {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  return BLOG_DIR;
}

export function getAllPostSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  ensureDir();
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;
  if (!fm.title || !fm.date) return null;

  return {
    title: fm.title,
    slug: fm.slug ?? slug,
    date: fm.date,
    excerpt: fm.excerpt ?? "",
    author: fm.author ?? "DomiSearch Team",
    tags: fm.tags ?? [],
    metaTitle: fm.metaTitle,
    metaDescription: fm.metaDescription,
    cover: fm.cover,
    content,
    readingTimeText: readingTime(content).text,
  };
}

export function getAllPosts(): Post[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type Heading = { level: 2 | 3; text: string; slug: string };

/** Produces GitHub-style slugs (matches rehype-slug for English headings). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract FAQ pairs from a markdown body.
 *
 * Looks for H3 headings that end in a question mark and takes the first
 * non-empty paragraph below as the answer. Designed to emit FAQPage schema
 * automatically from posts that use the `### Question?` pattern.
 */
export function extractFAQs(markdown: string): { question: string; answer: string }[] {
  const lines = markdown.split("\n");
  const faqs: { question: string; answer: string }[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const m = lines[i].match(/^###\s+(.+\?)\s*$/);
    if (!m) continue;

    const question = m[1]
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .trim();

    // First non-empty paragraph below, stopping at the next heading.
    const answerParts: string[] = [];
    let started = false;
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j];
      if (/^```/.test(line)) break;
      if (/^#{1,6}\s/.test(line.trim())) break;
      if (line.trim() === "") {
        if (started) break;
        continue;
      }
      answerParts.push(line.trim());
      started = true;
    }

    if (answerParts.length > 0) {
      const answer = answerParts
        .join(" ")
        .replace(/\*\*/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links, keep text
        .replace(/\s+/g, " ")
        .trim();
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

/** Extract H2 and H3 headings from a markdown/MDX body - skips fenced code blocks. */
export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = (m[1].length as 2 | 3);
    const text = m[2].replace(/`/g, "").replace(/\*\*/g, "").trim();
    let slug = slugify(text);
    // Handle duplicate headings by appending -1, -2, matching github-slugger
    const count = seen.get(slug) ?? 0;
    if (count > 0) slug = `${slug}-${count}`;
    seen.set(slugify(text), count + 1);
    headings.push({ level, text, slug });
  }
  return headings;
}
