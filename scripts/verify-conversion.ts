/**
 * Fidelity check for the MDX -> Portable Text conversion.
 *
 *   npx tsx scripts/verify-conversion.ts
 *
 * Compares each post's source markdown against its converted Portable Text on
 * the things a reader would notice if they were lost: the text itself, every
 * heading, every link target, and every table cell. Runs entirely offline, so
 * it can be used to validate a converter change without touching Sanity.
 *
 * Exits non-zero if anything differs.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, type Token, type Tokens } from "marked";
import { markdownToPortableText, type PortableBlock } from "./lib/md-to-portable-text";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Normalises whitespace so formatting differences do not read as content loss. */
function norm(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

// --- Facts extracted from the source markdown ------------------------------

function markdownFacts(md: string) {
  const headings: string[] = [];
  const links: string[] = [];
  const cells: string[] = [];
  const text: string[] = [];

  const inline = (tokens: Token[] | undefined): void => {
    for (const t of tokens ?? []) {
      if (t.type === "link") links.push((t as Tokens.Link).href);
      if (t.type === "codespan") text.push((t as Tokens.Codespan).text);
      else if ("tokens" in t && t.tokens?.length) inline(t.tokens as Token[]);
      else if (t.type === "text" || t.type === "escape") text.push((t as Tokens.Text).text);
    }
  };

  const walk = (tokens: Token[]): void => {
    for (const t of tokens) {
      switch (t.type) {
        case "heading": {
          // Collect the heading's rendered text, which is what rehype-slug
          // hashed and what the reader sees — backticks and ** are markup.
          const before = text.length;
          inline((t as Tokens.Heading).tokens);
          headings.push(norm(text.slice(before).join("")));
          break;
        }
        case "paragraph":
          inline((t as Tokens.Paragraph).tokens);
          break;
        case "blockquote":
          walk((t as Tokens.Blockquote).tokens ?? []);
          break;
        case "list":
          for (const item of (t as Tokens.List).items) {
            for (const sub of item.tokens ?? []) {
              if (sub.type === "list") walk([sub]);
              else inline((sub as Tokens.Text).tokens);
            }
          }
          break;
        case "table": {
          const tbl = t as Tokens.Table;
          const cellText = (tokens: Token[] | undefined) => {
            const before = text.length;
            inline(tokens);
            return norm(text.splice(before).join(""));
          };
          for (const h of tbl.header ?? []) cells.push(cellText(h.tokens));
          for (const row of tbl.rows ?? []) for (const c of row) cells.push(cellText(c.tokens));
          break;
        }
        default:
          break;
      }
    }
  };

  walk(marked.lexer(md) as Token[]);
  return { headings, links, cells, text: norm(text.join("")) };
}

// --- The same facts, read back out of the Portable Text --------------------

function portableTextFacts(blocks: PortableBlock[]) {
  const headings: string[] = [];
  const links: string[] = [];
  const cells: string[] = [];
  const text: string[] = [];

  for (const b of blocks) {
    if (b._type === "table") {
      for (const h of b.header) cells.push(norm(h));
      for (const row of b.rows) for (const c of row.cells) cells.push(norm(c));
      continue;
    }
    if (b._type === "divider") continue;

    const block = b as Extract<PortableBlock, { _type: "block" }>;
    const blockText = block.children.map((c) => c.text).join("");
    if (/^h[2-4]$/.test(block.style)) headings.push(norm(blockText));
    for (const def of block.markDefs) links.push(def.href);
    text.push(blockText);
  }

  return { headings, links, cells, text: norm(text.join("")) };
}

// --- Comparison ------------------------------------------------------------

type Failure = { post: string; what: string; detail: string };

function compareLists(
  post: string,
  what: string,
  expected: string[],
  actual: string[],
  failures: Failure[],
) {
  if (expected.length !== actual.length) {
    failures.push({
      post,
      what,
      detail: `count differs — markdown has ${expected.length}, Portable Text has ${actual.length}`,
    });
    return;
  }
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      failures.push({
        post,
        what,
        detail: `#${i + 1} differs\n      markdown: ${expected[i]}\n      sanity:   ${actual[i]}`,
      });
      return;
    }
  }
}

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  const failures: Failure[] = [];
  const knownDeltas: string[] = [];

  console.log(`Verifying ${files.length} posts\n`);

  for (const file of files) {
    const { content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
    const expected = markdownFacts(content);
    const actual = portableTextFacts(markdownToPortableText(content));

    compareLists(file, "headings", expected.headings, actual.headings, failures);
    compareLists(file, "links", expected.links, actual.links, failures);
    compareLists(file, "table cells", expected.cells, actual.cells, failures);

    if (expected.text !== actual.text) {
      // Show the first divergence rather than two walls of prose.
      let i = 0;
      while (i < expected.text.length && expected.text[i] === actual.text[i]) i++;
      failures.push({
        post: file,
        what: "body text",
        detail:
          `diverges at character ${i}\n` +
          `      markdown: …${expected.text.slice(Math.max(0, i - 40), i + 60)}…\n` +
          `      sanity:   …${actual.text.slice(Math.max(0, i - 40), i + 60)}…`,
      });
    }

    const ok = !failures.some((f) => f.post === file);
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${file}  ` +
        `(${actual.headings.length} headings, ${actual.links.length} links, ${actual.cells.length} cells)`,
    );
  }

  // Known and accepted: table cells store plain strings, so the one bold
  // phrase inside a cell in what-is-aeo loses its emphasis. Text is unchanged,
  // so the checks above still pass — this is recorded, not detected.
  knownDeltas.push(
    "what-is-aeo.mdx — one table cell loses bold emphasis (text intact): " +
      '"AEO optimises **facts, entities, relationships**, not just pages."',
  );

  console.log("");
  if (failures.length === 0) {
    console.log("All posts converted faithfully: text, headings, links and table cells all match.");
  } else {
    console.log(`${failures.length} problem(s):\n`);
    for (const f of failures) console.log(`  ${f.post} — ${f.what}: ${f.detail}`);
  }

  console.log("\nKnown, accepted differences:");
  for (const d of knownDeltas) console.log(`  · ${d}`);

  process.exit(failures.length === 0 ? 0 : 1);
}

main();
