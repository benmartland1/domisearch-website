/**
 * One-off migration: content/blog/*.mdx -> Sanity.
 *
 *   npx tsx scripts/migrate-to-sanity.ts --dry-run   inspect, write nothing
 *   npx tsx scripts/migrate-to-sanity.ts             write to Sanity
 *
 * Safe to re-run. Document IDs are derived from slugs and authors' names, and
 * every write is a createOrReplace, so a second run overwrites the documents
 * from the first rather than creating duplicates. Image assets are looked up
 * by SHA before upload, so they are only ever stored once.
 *
 * Nothing is guessed: the converter in scripts/lib/md-to-portable-text.ts
 * throws on any markdown construct it does not explicitly handle, so a
 * successful run means every block of every post was accounted for.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import matter from "gray-matter";
import { createClient } from "@sanity/client";
import { markdownToPortableText } from "./lib/md-to-portable-text";
import { authors as localAuthors } from "../lib/authors";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Falls back to the token `sanity login` stored for the CLI.
 *
 * This is a local, one-off migration, so borrowing the developer's own CLI
 * session avoids minting a long-lived API token just to run it once. That
 * token is a personal credential tied to a human account — it belongs on this
 * machine only, and must never be copied into Vercel or any deployment.
 */
function cliToken(): string | undefined {
  try {
    const configPath = path.join(os.homedir(), ".config", "sanity", "config.json");
    if (!fs.existsSync(configPath)) return undefined;
    const parsed = JSON.parse(fs.readFileSync(configPath, "utf8")) as { authToken?: string };
    return parsed.authToken;
  } catch {
    return undefined;
  }
}

const token = process.env.SANITY_API_READ_TOKEN || cliToken();

if (!DRY_RUN) {
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Check .env.local.");
  if (!token)
    throw new Error(
      "No Sanity credentials. Either run `npx sanity login`, or create an Editor token at " +
        "sanity.io/manage and put it in SANITY_API_READ_TOKEN in .env.local.",
    );
}

const client =
  DRY_RUN && !projectId
    ? null
    : createClient({
        projectId: projectId!,
        dataset,
        token,
        apiVersion: "2026-08-31",
        useCdn: false,
      });

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stable document ID from a stable input, so re-runs replace rather than duplicate. */
function docId(prefix: string, key: string): string {
  const slug = key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${slug}`;
}

type UploadedAsset = { _type: "image"; asset: { _type: "reference"; _ref: string } };

const assetCache = new Map<string, string>();

/**
 * Uploads a file from public/ into Sanity's asset store, reusing an existing
 * asset when the same bytes are already there.
 */
async function uploadImage(publicPath: string): Promise<UploadedAsset | undefined> {
  if (!publicPath) return undefined;
  const abs = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    console.warn(`  ! image not found, skipping: ${publicPath}`);
    return undefined;
  }

  if (assetCache.has(abs)) {
    return { _type: "image", asset: { _type: "reference", _ref: assetCache.get(abs)! } };
  }

  const buffer = fs.readFileSync(abs);
  const sha = crypto.createHash("sha1").update(buffer).digest("hex");

  if (DRY_RUN || !client) {
    console.log(`  · would upload ${publicPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
    assetCache.set(abs, `image-${sha}-placeholder`);
    return { _type: "image", asset: { _type: "reference", _ref: `image-${sha}-placeholder` } };
  }

  // Sanity dedupes by content hash itself, but checking first avoids a
  // pointless upload on every re-run.
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && sha1hash == $sha][0]{_id}`,
    { sha },
  );

  let assetId: string;
  if (existing?._id) {
    assetId = existing._id;
    console.log(`  · reused existing asset for ${publicPath}`);
  } else {
    const asset = await client.assets.upload("image", buffer, {
      filename: path.basename(abs),
    });
    assetId = asset._id;
    console.log(`  + uploaded ${publicPath} -> ${assetId}`);
  }

  assetCache.set(abs, assetId);
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// ---------------------------------------------------------------------------
// Source data
// ---------------------------------------------------------------------------

type Frontmatter = {
  title: string;
  slug: string;
  /** YAML turns an unquoted `2026-05-28` into a Date, a quoted one into a string. */
  date: string | Date;
  excerpt: string;
  author: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  cover?: string;
};

/**
 * Frontmatter dates carry no time. Noon UTC keeps every post on the same
 * calendar day it published on, whether or not BST is in effect — midnight
 * would shift the British Summer Time posts back a day.
 */
function toPublishedAt(date: string | Date): string {
  const ymd =
    date instanceof Date
      ? date.toISOString().slice(0, 10)
      : String(date).trim().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new Error(`Unrecognised date: ${String(date)}`);
  }

  return new Date(`${ymd}T12:00:00.000Z`).toISOString();
}

function readPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return { file, fm: data as Frontmatter, body: content };
    })
    .sort((a, b) => (toPublishedAt(a.fm.date) < toPublishedAt(b.fm.date) ? -1 : 1));
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    DRY_RUN
      ? "DRY RUN — parsing and converting only, nothing will be written.\n"
      : `Migrating into project ${projectId}, dataset "${dataset}".\n`,
  );

  const posts = readPosts();
  console.log(`Found ${posts.length} posts in content/blog\n`);

  // --- Authors -------------------------------------------------------
  const authorNames = [...new Set(posts.map((p) => p.fm.author).filter(Boolean))];
  const authorIds = new Map<string, string>();

  console.log("Authors");
  for (const name of authorNames) {
    const local = localAuthors[name];
    if (!local) throw new Error(`Author "${name}" is not in lib/authors.ts — cannot migrate.`);

    const id = docId("author", name);
    authorIds.set(name, id);

    const image = await uploadImage(local.image);
    const doc = {
      _id: id,
      _type: "author",
      name: local.name,
      slug: { _type: "slug", current: docId("", name).replace(/^-/, "") },
      role: local.role,
      bio: local.bio,
      linkedinUrl: local.sameAs?.[0],
      sameAs: local.sameAs,
      ...(image ? { image } : {}),
    };

    if (DRY_RUN || !client) console.log(`  · would create author ${id}`);
    else {
      await client.createOrReplace(doc);
      console.log(`  + ${id}`);
    }
  }

  // --- Categories ----------------------------------------------------
  // The first tag on a post is its primary subject, which is what a category
  // is. Every other tag stays a tag.
  const categoryTitles = [...new Set(posts.map((p) => p.fm.tags?.[0]).filter(Boolean))] as string[];
  const categoryIds = new Map<string, string>();

  console.log("\nCategories");
  for (const title of categoryTitles) {
    const id = docId("category", title);
    categoryIds.set(title, id);
    const doc = {
      _id: id,
      _type: "category",
      title,
      slug: { _type: "slug", current: docId("", title).replace(/^-/, "") },
    };
    if (DRY_RUN || !client) console.log(`  · would create category ${id} (${title})`);
    else {
      await client.createOrReplace(doc);
      console.log(`  + ${id} (${title})`);
    }
  }

  // --- Posts ---------------------------------------------------------
  console.log("\nPosts");
  const report: { slug: string; blocks: number; tables: number; dividers: number }[] = [];

  for (const { file, fm, body } of posts) {
    if (!fm.title || !fm.date || !fm.slug) {
      throw new Error(`${file} is missing title, slug or date.`);
    }

    let blocks;
    try {
      blocks = markdownToPortableText(body);
    } catch (error) {
      throw new Error(`${file}: ${(error as Error).message}`);
    }

    const tables = blocks.filter((b) => b._type === "table").length;
    const dividers = blocks.filter((b) => b._type === "divider").length;
    report.push({ slug: fm.slug, blocks: blocks.length, tables, dividers });

    const mainImage = fm.cover ? await uploadImage(fm.cover) : undefined;
    const categoryTitle = fm.tags?.[0];

    const doc = {
      _id: docId("post", fm.slug),
      _type: "post",
      title: fm.title,
      slug: { _type: "slug", current: fm.slug },
      excerpt: fm.excerpt ?? "",
      publishedAt: toPublishedAt(fm.date),
      author: { _type: "reference", _ref: authorIds.get(fm.author)! },
      ...(categoryTitle
        ? { category: { _type: "reference", _ref: categoryIds.get(categoryTitle)! } }
        : {}),
      tags: fm.tags ?? [],
      featured: false,
      body: blocks,
      // Left empty on purpose. what-is-aeo's questions are H3s in the prose,
      // and lib/posts.ts derives its FAQPage schema from those, so filling
      // this too would render the same questions twice.
      faqs: [],
      seo: {
        _type: "object",
        metaTitle: fm.metaTitle,
        metaDescription: fm.metaDescription,
        noIndex: false,
      },
      ...(mainImage ? { mainImage: { ...mainImage, alt: fm.title } } : {}),
    };

    if (DRY_RUN || !client) {
      console.log(`  · ${fm.slug} — ${blocks.length} blocks, ${tables} tables, ${dividers} rules`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  + ${fm.slug} — ${blocks.length} blocks, ${tables} tables, ${dividers} rules`);
    }
  }

  console.log("\nSummary");
  console.log(`  posts:      ${report.length}`);
  console.log(`  blocks:     ${report.reduce((n, r) => n + r.blocks, 0)}`);
  console.log(`  tables:     ${report.reduce((n, r) => n + r.tables, 0)}`);
  console.log(`  dividers:   ${report.reduce((n, r) => n + r.dividers, 0)}`);
  console.log(`  authors:    ${authorNames.length}`);
  console.log(`  categories: ${categoryTitles.length}`);

  if (DRY_RUN) {
    console.log("\nDry run complete. Nothing was written.");
  } else {
    console.log("\nDone. Every document was created as PUBLISHED.");
    console.log("Check them at /studio, then run the sitemap and llms.txt diff.");
  }
}

main().catch((error) => {
  console.error("\nMigration failed:", error.message);
  process.exit(1);
});
