/**
 * The onboarding questionnaire, as data.
 *
 * Every screen, its validation, whether it is shown at all, and how it prints
 * in the notification email all derive from the definitions in
 * `questions.ts`. Nothing about a question lives in a component: if the email
 * and the form ever disagree about what was asked, that is a bug in one file
 * rather than a drift between two.
 */

export type SectionId =
  | "you"
  | "business"
  | "competitors"
  | "content"
  | "website"
  | "access";

export type UploadedFile = {
  name: string;
  /**
   * The blob's pathname within the store — not a URL.
   *
   * The store is private, so there is no address the browser can simply open.
   * Files are served back through `/api/onboarding/file`, which checks a
   * signature and streams the blob. The signed URL is built server-side at the
   * point the email or the Sanity record is written, because signing needs a
   * secret the browser must never hold.
   */
  pathname: string;
  size: number;
  type: string;
};

/**
 * One set of named short values: a repeater row (a competitor, a person to
 * copy in) or a grouped answer (the three differentiators).
 */
export type Row = Record<string, string>;

export type AnswerValue = string | string[] | Row | Row[] | UploadedFile[] | undefined;

export type Answers = Record<string, AnswerValue>;

export type Option = {
  value: string;
  label: string;
  /** Small line under the option label. Used sparingly. */
  hint?: string;
};

export type SubField = {
  id: string;
  label: string;
  inputType?: "text" | "email" | "url" | "tel";
  placeholder?: string;
  /** Rough share of the row on desktop. Two-thirds/one-third reads better than equal columns. */
  width?: "full" | "half" | "wide" | "narrow";
};

export type Input =
  | {
      type: "text";
      inputType?: "text" | "email" | "url" | "tel";
      placeholder?: string;
      autoComplete?: string;
      maxLength?: number;
    }
  | { type: "longtext"; placeholder?: string; rows?: number; maxLength?: number }
  | { type: "single"; options: Option[] }
  | { type: "multi"; options: Option[]; max?: number }
  /** Several short text fields that answer one question, e.g. three differentiators. */
  | { type: "group"; fields: SubField[] }
  | {
      type: "repeater";
      fields: SubField[];
      addLabel: string;
      /** Rows rendered on first view, so the shape of the answer is obvious. */
      seed?: number;
      max?: number;
    }
  | { type: "links"; addLabel: string; max?: number; placeholder?: string }
  | { type: "access"; platform: AccessPlatform };

/** A platform we ask the client to add aeo@domisearch.com to. */
export type AccessPlatform = {
  id: string;
  name: string;
  /** One line: why we need it. */
  why: string;
  /** The permission level to grant, in the platform's own wording. */
  permission: string;
  /**
   * Step-by-step. Returning a function rather than a list lets the CMS card
   * swap its instructions for the platform the client picked earlier.
   */
  steps: (answers: Answers) => string[];
  /** Optional deep link to the exact settings screen. */
  link?: { href: string; label: string };
};

export type AccessStatus = "done" | "help" | "na";

export type Question = {
  id: string;
  section: SectionId;
  /** The question as asked on screen. Large type, so keep it short. */
  label: string;
  /** Label used in the emails and the Sanity record, if the on-screen one is conversational. */
  emailLabel?: string;
  helper?: string;
  required?: boolean;
  input: Input;
  /** Optional file upload attached to this question. */
  attachments?: { key: string; label: string; accept?: string };
  /** Optional link list attached to this question. */
  links?: { key: string; label: string; max?: number; placeholder?: string };
  /** Return false to skip the question entirely. */
  when?: (answers: Answers) => boolean;
  /** Return a message to block advancing, or null to allow it. */
  validate?: (answers: Answers) => string | null;
};

export type Step =
  | { kind: "welcome"; id: "welcome" }
  | { kind: "intro"; id: string; section: SectionId; title: string; body: string[] }
  | { kind: "question"; id: string; section: SectionId; question: Question }
  | { kind: "review"; id: "review"; section: SectionId }
  | { kind: "done"; id: "done" };
