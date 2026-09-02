import { ACCESS_STATUS_LABELS } from "./access";
import { QUESTIONS, SECTIONS } from "./questions";
import type { Answers, Question, SectionId, UploadedFile } from "./types";
import { asFiles, asList, asRows, asText, compactRows, normaliseUrl } from "./validation";

export type SummaryItem = {
  question: string;
  /** Plain-text answer, already flattened. Empty string means "not answered". */
  answer: string;
  links: string[];
  files: UploadedFile[];
  /** Present only for access cards, so the notification can render a checklist. */
  status?: "done" | "help" | "na";
};

export type SummarySection = {
  id: SectionId;
  title: string;
  items: SummaryItem[];
};

function groupValue(value: unknown): Record<string, string> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, string>)
    : {};
}

/** Flatten one question's answer into the single string a reader wants to see. */
function flatten(question: Question, answers: Answers): string {
  const value = answers[question.id];

  switch (question.input.type) {
    case "text":
      return question.input.inputType === "url" ? normaliseUrl(asText(value)) : asText(value);

    case "longtext":
      return asText(value);

    case "single":
      return asText(value);

    case "multi":
      return asList(value).join(", ");

    case "group": {
      const group = groupValue(value);
      return question.input.fields
        .map((field) => {
          const entry = (group[field.id] ?? "").trim();
          if (!entry) return null;
          return question.input.type === "group" && question.input.fields.length > 2
            ? `${field.label}. ${entry}`
            : `${field.label}: ${entry}`;
        })
        .filter(Boolean)
        .join("\n");
    }

    case "repeater": {
      const rows = compactRows(asRows(value));
      return rows
        .map((row) =>
          (question.input.type === "repeater" ? question.input.fields : [])
            .map((field) => {
              const entry = (row[field.id] ?? "").trim();
              if (!entry) return null;
              return field.inputType === "url" ? normaliseUrl(entry) : entry;
            })
            .filter(Boolean)
            .join(" — "),
        )
        .join("\n");
    }

    case "links":
      // Rendered as a clickable list rather than a text answer — see below.
      return "";

    case "access": {
      const status = asText(value);
      return ACCESS_STATUS_LABELS[status] ?? "";
    }
  }
}

/**
 * The submission as a human reads it: sections in the order they were asked,
 * unanswered optional questions dropped, access always present so the
 * checklist has no gaps.
 *
 * Both emails and the Sanity record are rendered from this, which is why it
 * lives outside any of them.
 */
export function summarise(answers: Answers): SummarySection[] {
  return SECTIONS.map((section) => {
    const items: SummaryItem[] = [];

    for (const question of QUESTIONS) {
      if (question.section !== section.id) continue;
      if (question.when && !question.when(answers)) continue;

      const answer = flatten(question, answers);

      // Two sources of links: a question that *is* a list of links, and a
      // question with a link list attached alongside its text answer.
      const links = [
        ...(question.input.type === "links" ? asList(answers[question.id]) : []),
        ...(question.links ? asList(answers[question.links.key]) : []),
      ]
        .map(normaliseUrl)
        .filter(Boolean);
      const files = question.attachments ? asFiles(answers[question.attachments.key]) : [];
      const isAccess = question.input.type === "access";

      // Optional questions the client skipped are noise in the email. Access
      // cards are the exception: a blank one is itself the thing Ben needs to
      // see, because it means nobody has granted us anything yet.
      if (!isAccess && !answer && links.length === 0 && files.length === 0) continue;

      items.push({
        question: question.emailLabel ?? question.label,
        answer,
        links,
        files,
        status: isAccess
          ? ((asText(answers[question.id]) || undefined) as SummaryItem["status"])
          : undefined,
      });
    }

    return { id: section.id, title: section.title, items };
  }).filter((section) => section.items.length > 0);
}

/** Every uploaded file across the whole submission, for the Sanity record. */
export function collectFiles(answers: Answers): { question: string; file: UploadedFile }[] {
  const out: { question: string; file: UploadedFile }[] = [];
  for (const question of QUESTIONS) {
    if (!question.attachments) continue;
    for (const file of asFiles(answers[question.attachments.key])) {
      out.push({ question: question.emailLabel ?? question.label, file });
    }
  }
  return out;
}

/** How far through the client is, as a fraction, for the progress bar. */
export function completionRatio(answers: Answers, visibleQuestionIds: string[]): number {
  if (visibleQuestionIds.length === 0) return 0;
  const answered = visibleQuestionIds.filter((id) => {
    const value = answers[id];
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return compactRows(asRows(value)).length > 0 || asList(value).length > 0 || asFiles(value).length > 0;
    if (value && typeof value === "object") return Object.values(value).some((v) => String(v ?? "").trim());
    return false;
  }).length;
  return answered / visibleQuestionIds.length;
}
