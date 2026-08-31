import { marked, type Token, type Tokens } from "marked";

/**
 * Markdown to Portable Text.
 *
 * Purpose-built for the nine posts in content/blog rather than for markdown in
 * general. The token set those posts actually use was enumerated first
 * (paragraph, heading, list, table, blockquote, hr; strong, em, codespan,
 * link) and everything in it is handled here. Anything outside that set throws
 * rather than being dropped, so a silent content loss during migration is not
 * possible — if this script finishes, everything was converted.
 *
 * Keys are deterministic per document. Re-running the migration therefore
 * produces identical documents instead of a fresh set of random keys.
 */

export type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type MarkDef = { _type: "link"; _key: string; href: string };

export type TextBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: "bullet" | "number";
  level?: number;
};

export type TableBlock = {
  _type: "table";
  _key: string;
  header: string[];
  rows: { _type: "row"; _key: string; cells: string[] }[];
};

export type DividerBlock = { _type: "divider"; _key: string };

export type PortableBlock = TextBlock | TableBlock | DividerBlock;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

function decode(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|nbsp|#39|#x27);/g, (m) => ENTITIES[m] ?? m);
}

/** Deterministic key generator, reset per document. */
function makeKeyer() {
  let n = 0;
  return () => `k${(n++).toString(36).padStart(3, "0")}`;
}

type Keyer = () => string;

/** Collapses an inline token tree into spans, carrying marks down the tree. */
function inlineToSpans(
  tokens: Token[] | undefined,
  key: Keyer,
  markDefs: MarkDef[],
  marks: string[] = [],
): Span[] {
  const spans: Span[] = [];
  if (!tokens) return spans;

  const push = (text: string, activeMarks: string[]) => {
    if (!text) return;
    const last = spans[spans.length - 1];
    // Merge adjacent spans with identical marks so the output matches what a
    // human would have typed in the Studio.
    if (last && last.marks.join(" ") === activeMarks.join(" ")) {
      last.text += text;
      return;
    }
    spans.push({ _type: "span", _key: key(), text, marks: [...activeMarks] });
  };

  for (const token of tokens) {
    switch (token.type) {
      case "text":
      case "escape": {
        const t = token as Tokens.Text;
        if (t.tokens?.length) {
          spans.push(...inlineToSpans(t.tokens, key, markDefs, marks));
        } else {
          push(decode(t.text), marks);
        }
        break;
      }
      case "strong": {
        const t = token as Tokens.Strong;
        spans.push(...inlineToSpans(t.tokens, key, markDefs, [...marks, "strong"]));
        break;
      }
      case "em": {
        const t = token as Tokens.Em;
        spans.push(...inlineToSpans(t.tokens, key, markDefs, [...marks, "em"]));
        break;
      }
      case "del": {
        const t = token as Tokens.Del;
        spans.push(...inlineToSpans(t.tokens, key, markDefs, [...marks, "strike-through"]));
        break;
      }
      case "codespan": {
        const t = token as Tokens.Codespan;
        push(decode(t.text), [...marks, "code"]);
        break;
      }
      case "link": {
        const t = token as Tokens.Link;
        const defKey = key();
        markDefs.push({ _type: "link", _key: defKey, href: t.href });
        spans.push(...inlineToSpans(t.tokens, key, markDefs, [...marks, defKey]));
        break;
      }
      case "br": {
        push(" ", marks);
        break;
      }
      case "html": {
        // No post contains inline HTML; treated as literal text if one ever does.
        push(decode((token as Tokens.HTML).text), marks);
        break;
      }
      default:
        throw new Error(`Unhandled inline token: ${token.type}`);
    }
  }

  return spans;
}

function textBlock(
  style: string,
  tokens: Token[] | undefined,
  key: Keyer,
  extra: Partial<TextBlock> = {},
): TextBlock {
  const markDefs: MarkDef[] = [];
  const children = inlineToSpans(tokens, key, markDefs);
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children: children.length ? children : [{ _type: "span", _key: key(), text: "", marks: [] }],
    ...extra,
  };
}

function cellText(cell: Tokens.TableCell): string {
  // Cells are stored as plain strings, so any inline formatting inside one is
  // flattened to its text. Exactly one cell across the existing posts is
  // affected (a bold phrase in what-is-aeo).
  const markDefs: MarkDef[] = [];
  const key = makeKeyer();
  return inlineToSpans(cell.tokens, key, markDefs)
    .map((s) => s.text)
    .join("");
}

function convertTokens(tokens: Token[], key: Keyer, listLevel = 0): PortableBlock[] {
  const blocks: PortableBlock[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "space":
        break;

      case "heading": {
        const t = token as Tokens.Heading;
        if (t.depth === 1) {
          throw new Error(
            `H1 found in body ("${t.text}"). The post title is the only H1 — fix the source file.`,
          );
        }
        const style = `h${Math.min(t.depth, 4)}`;
        blocks.push(textBlock(style, t.tokens, key));
        break;
      }

      case "paragraph": {
        const t = token as Tokens.Paragraph;
        blocks.push(textBlock("normal", t.tokens, key));
        break;
      }

      case "blockquote": {
        const t = token as Tokens.Blockquote;
        for (const inner of convertTokens(t.tokens ?? [], key, listLevel)) {
          if (inner._type === "block") inner.style = "blockquote";
          blocks.push(inner);
        }
        break;
      }

      case "list": {
        const t = token as Tokens.List;
        const listItem = t.ordered ? "number" : "bullet";
        for (const item of t.items) {
          // A list item's own text, then any nested list beneath it.
          const own = (item.tokens ?? []).filter((x) => x.type !== "list");
          const nested = (item.tokens ?? []).filter((x) => x.type === "list");

          const inlineTokens: Token[] = [];
          for (const o of own) {
            if (o.type === "text" || o.type === "paragraph") {
              inlineTokens.push(...(((o as Tokens.Text).tokens ?? []) as Token[]));
            } else {
              throw new Error(`Unhandled token inside list item: ${o.type}`);
            }
          }

          blocks.push(textBlock("normal", inlineTokens, key, { listItem, level: listLevel + 1 }));

          for (const n of nested) {
            blocks.push(...convertTokens([n], key, listLevel + 1));
          }
        }
        break;
      }

      case "table": {
        const t = token as Tokens.Table;
        blocks.push({
          _type: "table",
          _key: key(),
          header: (t.header ?? []).map(cellText),
          rows: (t.rows ?? []).map((row) => ({
            _type: "row" as const,
            _key: key(),
            cells: row.map(cellText),
          })),
        });
        break;
      }

      case "hr":
        blocks.push({ _type: "divider", _key: key() });
        break;

      case "code": {
        const t = token as Tokens.Code;
        blocks.push({
          _type: "codeBlock",
          _key: key(),
          code: t.text,
          language: t.lang || undefined,
        } as unknown as PortableBlock);
        break;
      }

      default:
        throw new Error(`Unhandled block token: ${token.type}`);
    }
  }

  return blocks;
}

/** Converts one markdown document to Portable Text blocks. */
export function markdownToPortableText(markdown: string): PortableBlock[] {
  const key = makeKeyer();
  return convertTokens(marked.lexer(markdown) as Token[], key);
}
