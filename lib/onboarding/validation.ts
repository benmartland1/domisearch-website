import type { Answers, AnswerValue, Row, UploadedFile } from "./types";

/**
 * A trimmed answer, for validating, summarising and storing.
 *
 * Never use this as the value of a controlled input. Trimming on every render
 * deletes the space the moment it is typed, because a space is always trailing
 * while someone is still typing — see `asRawText`.
 */
export function asText(value: AnswerValue): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Exactly what the client has typed, untrimmed.
 *
 * This is what a controlled input must render. Whitespace is tidied later, at
 * the point the answer is read, so the field never fights the person typing
 * into it.
 */
export function asRawText(value: AnswerValue): string {
  return typeof value === "string" ? value : "";
}

export function asList(value: AnswerValue): string[] {
  return Array.isArray(value) ? (value as unknown[]).filter((v): v is string => typeof v === "string") : [];
}

export function asRows(value: AnswerValue): Row[] {
  if (!Array.isArray(value)) return [];
  return (value as unknown[]).filter(
    (v): v is Row =>
      typeof v === "object" && v !== null && !Array.isArray(v) && !("pathname" in (v as object) && "size" in (v as object)),
  );
}

export function asFiles(value: AnswerValue): UploadedFile[] {
  if (!Array.isArray(value)) return [];
  return (value as unknown[]).filter(
    (v): v is UploadedFile =>
      typeof v === "object" && v !== null && typeof (v as UploadedFile).pathname === "string",
  );
}

/** A row is "empty" when the client added it and typed nothing. Those are dropped, never flagged. */
export function rowIsEmpty(row: Row): boolean {
  return Object.values(row).every((v) => !v || !v.trim());
}

export function compactRows(rows: Row[]): Row[] {
  return rows.filter((r) => !rowIsEmpty(r));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/**
 * Turn what people actually type into a usable URL.
 *
 * Nobody types the scheme. "domisearch.com", "www.domisearch.com/blog" and
 * "DomiSearch.com " are all the same intent, and rejecting them teaches the
 * client that the form is fussy on the very first screen where it matters.
 */
export function normaliseUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/\//.test(value)) return `https:${value}`;
  // Don't touch things that clearly aren't a URL yet — let validation speak.
  if (!/^[\w-]+(\.[\w-]+)+/.test(value)) return value;
  return `https://${value}`;
}

export function looksLikeUrl(value: string): boolean {
  const v = normaliseUrl(value);
  if (!v) return false;
  try {
    const url = new URL(v);
    return (url.protocol === "http:" || url.protocol === "https:") && /\./.test(url.hostname);
  } catch {
    return false;
  }
}

/** Required-field message, phrased as a nudge rather than an error. */
export function requiredText(answers: Answers, id: string, message: string): string | null {
  return asText(answers[id]) ? null : message;
}
