#!/usr/bin/env tsx
/**
 * Blog CMS helper.
 *
 * Usage:
 *   pnpm new:post                         # interactive prompts
 *   pnpm new:post --from draft.md         # read markdown draft and generate frontmatter
 *
 * What it does:
 *   - Takes a title + body (markdown) and optional tags
 *   - Slugifies the title
 *   - Generates an SEO-tuned meta title (≤60 chars) and description (≤155 chars)
 *   - Lifts an excerpt from the first paragraph
 *   - Ensures H1 is removed from body (it's in frontmatter)
 *   - Writes to content/blog/<slug>.mdx with full frontmatter
 *   - Prints a post-publish checklist (sitemap + llms.txt update automatically at build)
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripH1(md: string) {
  return md.replace(/^\s*#\s+.+\n+/m, "").trimStart();
}

function firstParagraph(md: string) {
  const cleaned = stripH1(md)
    .replace(/^#+\s.+$/gm, "")
    .trim();
  const p = cleaned.split(/\n\s*\n/)[0] ?? "";
  return p.replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\s]+$/, "") + "…";
}

async function ask(rl: readline.Interface, q: string, fallback = "") {
  const a = (await rl.question(q)).trim();
  return a.length ? a : fallback;
}

async function main() {
  const args = process.argv.slice(2);
  const fromFlag = args.indexOf("--from");
  let bodyFromFile = "";
  let titleFromFile = "";

  if (fromFlag !== -1 && args[fromFlag + 1]) {
    const file = args[fromFlag + 1];
    bodyFromFile = fs.readFileSync(file, "utf-8");
    const h1Match = bodyFromFile.match(/^\s*#\s+(.+)$/m);
    titleFromFile = h1Match?.[1]?.trim() ?? "";
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const title = await ask(rl, `Title${titleFromFile ? ` [${titleFromFile}]` : ""}: `, titleFromFile);
  if (!title) {
    console.error("Title is required.");
    process.exit(1);
  }

  let body = bodyFromFile;
  if (!body) {
    console.log("\nPaste the article body in markdown. End with a single line containing 'EOF':\n");
    body = await new Promise<string>((resolve) => {
      const chunks: string[] = [];
      rl.on("line", (line) => {
        if (line.trim() === "EOF") {
          rl.removeAllListeners("line");
          resolve(chunks.join("\n"));
          return;
        }
        chunks.push(line);
      });
    });
  }

  body = stripH1(body).trim();
  if (!body) {
    console.error("Body cannot be empty.");
    process.exit(1);
  }

  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);
  const defaultExcerpt = truncate(firstParagraph(body), 220);
  const excerpt = await ask(rl, `Excerpt [${truncate(defaultExcerpt, 80)}]: `, defaultExcerpt);

  const tagsRaw = await ask(rl, `Tags (comma-separated, e.g. AEO, SEO, SaaS): `, "AEO");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const author = await ask(rl, `Author [DomiSearch Team]: `, "DomiSearch Team");

  const metaTitle = await ask(
    rl,
    `Meta title [${truncate(title, 58)}]: `,
    truncate(title, 58)
  );
  const metaDescription = await ask(
    rl,
    `Meta description [${truncate(excerpt, 150)}]: `,
    truncate(excerpt, 150)
  );

  rl.close();

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const out = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(out)) {
    console.error(`A post with slug "${slug}" already exists: ${out}`);
    process.exit(1);
  }

  const fm = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `slug: ${slug}`,
    `date: ${date}`,
    `excerpt: ${JSON.stringify(excerpt)}`,
    `author: ${JSON.stringify(author)}`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(", ")}]`,
    `metaTitle: ${JSON.stringify(metaTitle)}`,
    `metaDescription: ${JSON.stringify(metaDescription)}`,
    "---",
    "",
    body.trim(),
    "",
  ].join("\n");

  fs.writeFileSync(out, fm, "utf-8");
  console.log(`\n✓ Created ${path.relative(process.cwd(), out)}`);
  console.log(`\nNext:`);
  console.log(`  1. Review the file and adjust copy/links if needed.`);
  console.log(`  2. Commit and push - Vercel will rebuild the sitemap + llms.txt automatically.`);
  console.log(`  3. Share: https://domisearch.com/blog/${slug}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
