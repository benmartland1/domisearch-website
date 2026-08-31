/**
 * Moves a "## TL;DR" section out of a post body and into the `tldr` field.
 *
 *   npx tsx scripts/extract-tldr.ts --dry-run   report only
 *   npx tsx scripts/extract-tldr.ts             write to Sanity
 *
 * The old blog had no TL;DR field. The box was produced by CSS matching a
 * heading whose generated id happened to be "tldr", so it depended on a
 * writer typing the heading exactly right and only ever styled the single
 * paragraph directly beneath it. This lifts that content into a real field.
 *
 * ORDER MATTERS. The site must already be deployed with the code that renders
 * the `tldr` field before this runs. Production reads Sanity directly, so
 * removing the heading from a body while the deployed code still expects it
 * there would drop the TL;DR off the live page until the next deploy.
 *
 * Idempotent: a post that already has a `tldr` value is skipped, so a second
 * run does nothing.
 */

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

function cliToken(): string | undefined {
  try {
    const p = path.join(os.homedir(), ".config", "sanity", "config.json");
    if (!fs.existsSync(p)) return undefined;
    return (JSON.parse(fs.readFileSync(p, "utf8")) as { authToken?: string }).authToken;
  } catch {
    return undefined;
  }
}

const token = process.env.SANITY_API_READ_TOKEN || cliToken();

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Check .env.local.");
if (!DRY_RUN && !token) throw new Error("No Sanity credentials. Run `npx sanity login`.");

const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-31", useCdn: false });

type Block = {
  _type: string;
  _key: string;
  style?: string;
  children?: { text?: string }[];
};

type PostDoc = { _id: string; title: string; slug: string; tldr?: string; body?: Block[] };

const blockText = (b: Block | undefined): string =>
  (b?.children ?? [])
    .map((c) => c?.text ?? "")
    .join("")
    .trim();

/** Matches "TL;DR", "TLDR", "TL;DR:" and friends, case-insensitively. */
const isTldrHeading = (b: Block | undefined): boolean =>
  b?._type === "block" &&
  /^h[2-4]$/.test(b.style ?? "") &&
  /^tl;?dr:?$/i.test(blockText(b));

async function main() {
  console.log(DRY_RUN ? "DRY RUN — nothing will be written.\n" : `Writing to ${projectId}/${dataset}.\n`);

  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post"]{ _id, title, "slug": slug.current, tldr, body }`,
  );

  let changed = 0;

  for (const post of posts) {
    if (post.tldr?.trim()) {
      console.log(`  skip  ${post.slug} — already has a TL;DR`);
      continue;
    }

    const body = post.body ?? [];
    const i = body.findIndex(isTldrHeading);
    if (i === -1) {
      console.log(`  none  ${post.slug} — no TL;DR heading in the body`);
      continue;
    }

    const next = body[i + 1];
    if (next?._type !== "block" || next.style !== "normal") {
      console.log(`  WARN  ${post.slug} — TL;DR heading is not followed by a paragraph, left alone`);
      continue;
    }

    const tldr = blockText(next);
    if (!tldr) {
      console.log(`  WARN  ${post.slug} — TL;DR paragraph is empty, left alone`);
      continue;
    }

    // Drop the heading and its paragraph; everything else keeps its order.
    const newBody = body.filter((_, idx) => idx !== i && idx !== i + 1);

    console.log(`  MOVE  ${post.slug}`);
    console.log(`        "${tldr.slice(0, 100)}${tldr.length > 100 ? "…" : ""}"`);
    console.log(`        body ${body.length} -> ${newBody.length} blocks`);

    if (!DRY_RUN) {
      await client.patch(post._id).set({ tldr, body: newBody }).commit();
      console.log(`        written`);
    }
    changed++;
  }

  console.log(`\n${changed} post(s) ${DRY_RUN ? "would be" : ""} updated.`);
  if (DRY_RUN) console.log("Dry run complete. Nothing was written.");
}

main().catch((error) => {
  console.error("\nFailed:", error.message);
  process.exit(1);
});
