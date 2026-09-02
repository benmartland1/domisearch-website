import { ACCESS_STATUS_LABELS } from "./access";
import type { SummarySection } from "./summary";
import type { UploadedFile } from "./types";

/**
 * Email rendering.
 *
 * Tables and inline styles, on a light background. The site is dark, but dark
 * HTML email is a coin toss across Outlook and the Gmail app, and a
 * questionnaire nobody can read is worse than one that is slightly off-brand.
 * The palette is the site's paper surface, which keeps it recognisable.
 */

const INK = "#111111";
const INK_2 = "#3d3d3d";
const INK_3 = "#6a6a6a";
const PAPER = "#f5f2ec";
const GREEN = "#01634c";
const HAIRLINE = "#dcd7cc";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only ever emit links we built or that survived URL validation. */
function safeHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function paragraphs(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function shell(title: string, inner: string): string {
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid ${HAIRLINE};border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 0;">
          <div style="font:600 13px/1 ${FONT};letter-spacing:0.18em;text-transform:uppercase;color:${GREEN};">DomiSearch</div>
        </td></tr>
        <tr><td style="padding:16px 32px 36px;font:400 16px/1.6 ${FONT};color:${INK_2};">
          ${inner}
        </td></tr>
      </table>
      <div style="max-width:640px;padding:18px 8px 0;font:400 12px/1.6 ${FONT};color:${INK_3};">
        DomiSearch · Manchester, United Kingdom · <a href="mailto:hi@domisearch.com" style="color:${INK_3};">hi@domisearch.com</a>
      </div>
    </td></tr>
  </table>
</body></html>`;
}

function button(href: string, label: string): string {
  const safe = safeHref(href);
  if (!safe) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;"><tr><td style="background:${GREEN};border-radius:999px;">
    <a href="${escapeHtml(safe)}" style="display:inline-block;padding:14px 26px;font:600 15px/1 ${FONT};color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font:700 26px/1.25 ${FONT};color:${INK};letter-spacing:-0.02em;">${escapeHtml(text)}</h1>`;
}

/**
 * Uploads, as an attached-file list.
 *
 * `href` is a signed link to our own file route, not a blob URL: the store is
 * private, so a direct URL would open nothing.
 */
export type EmailUpload = { question: string; file: UploadedFile; href: string };

function fileList(uploads: EmailUpload[]): string {
  if (uploads.length === 0) return "";
  return `<ul style="margin:8px 0 0;padding-left:18px;">${uploads
    .map(({ file, href: raw }) => {
      const href = safeHref(raw);
      const size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const name = `${escapeHtml(file.name)} <span style="color:${INK_3};">(${size})</span>`;
      return `<li style="margin:4px 0;">${href ? `<a href="${escapeHtml(href)}" style="color:${GREEN};">${name}</a>` : name}</li>`;
    })
    .join("")}</ul>`;
}

function linkList(links: string[]): string {
  if (links.length === 0) return "";
  return `<ul style="margin:8px 0 0;padding-left:18px;">${links
    .map((link) => {
      const href = safeHref(link);
      return href
        ? `<li style="margin:4px 0;"><a href="${escapeHtml(href)}" style="color:${GREEN};">${escapeHtml(link)}</a></li>`
        : `<li style="margin:4px 0;">${escapeHtml(link)}</li>`;
    })
    .join("")}</ul>`;
}

const STATUS_MARK: Record<string, string> = {
  done: "✓",
  help: "!",
  na: "–",
};

/** One section of the questionnaire, questions bold, answers beneath. */
function renderSection(section: SummarySection, files: (question: string) => EmailUpload[]): string {
  const isAccess = section.id === "access";

  const items = section.items
    .map((item) => {
      if (isAccess && item.status !== undefined) {
        const mark = STATUS_MARK[item.status] ?? "?";
        const label = ACCESS_STATUS_LABELS[item.status] ?? "Not answered";
        const colour = item.status === "done" ? GREEN : item.status === "help" ? "#b4531c" : INK_3;
        return `<tr>
          <td style="padding:8px 10px 8px 0;font:700 15px/1.5 ${FONT};color:${INK};">${escapeHtml(item.question)}</td>
          <td style="padding:8px 0;font:600 14px/1.5 ${FONT};color:${colour};white-space:nowrap;" align="right">${mark} ${escapeHtml(label)}</td>
        </tr>`;
      }
      if (isAccess && item.status === undefined && !item.answer) {
        return `<tr>
          <td style="padding:8px 10px 8px 0;font:700 15px/1.5 ${FONT};color:${INK};">${escapeHtml(item.question)}</td>
          <td style="padding:8px 0;font:600 14px/1.5 ${FONT};color:#b4531c;white-space:nowrap;" align="right">? Not answered</td>
        </tr>`;
      }
      return `<tr><td colspan="2" style="padding:0 0 20px;">
        <div style="font:700 15px/1.5 ${FONT};color:${INK};">${escapeHtml(item.question)}</div>
        ${item.answer ? `<div style="margin-top:4px;font:400 15px/1.6 ${FONT};color:${INK_2};">${paragraphs(item.answer)}</div>` : `<div style="margin-top:4px;font:400 15px/1.6 ${FONT};color:${INK_3};">Not answered</div>`}
        ${linkList(item.links)}
        ${fileList(files(item.question))}
      </td></tr>`;
    })
    .join("");

  return `<div style="margin-top:32px;">
    <div style="font:600 12px/1 ${FONT};letter-spacing:0.18em;text-transform:uppercase;color:${GREEN};padding-bottom:10px;border-bottom:1px solid ${HAIRLINE};">${escapeHtml(section.title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${items}</table>
  </div>`;
}

export function renderSummaryHtml(sections: SummarySection[], uploads: EmailUpload[]): string {
  const byQuestion = (question: string) => uploads.filter((u) => u.question === question);
  return sections.map((section) => renderSection(section, byQuestion)).join("");
}

export function renderSummaryText(sections: SummarySection[], uploads: EmailUpload[]): string {
  return sections
    .map((section) => {
      const lines = section.items.map((item) => {
        const status = item.status ? ` — ${ACCESS_STATUS_LABELS[item.status]}` : "";
        const files = uploads
          .filter((u) => u.question === item.question)
          .map((u) => `  file: ${u.file.name} ${u.href}`);
        return [
          `${item.question}${status}`,
          item.answer ? item.answer.split("\n").map((l) => `  ${l}`).join("\n") : status ? null : "  (not answered)",
          ...item.links.map((l) => `  ${l}`),
          ...files,
        ]
          .filter(Boolean)
          .join("\n");
      });
      return [section.title.toUpperCase(), "-".repeat(section.title.length), ...lines].join("\n");
    })
    .join("\n\n");
}

// --------------------------------------------------------------- Templates

export function notificationEmail({
  companyName,
  contactName,
  contactEmail,
  sections,
  uploads,
  studioHref,
}: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  sections: SummarySection[];
  uploads: EmailUpload[];
  studioHref: string;
}): { subject: string; html: string; text: string } {
  // Company name comes from the `?client=` slug, not from an answer, so it is
  // empty whenever a link went out without one. Falling back to the person who
  // filled it in keeps the subject line identifying rather than generic — two
  // "Unnamed company" emails in an inbox are indistinguishable.
  const company = companyName || contactName || "Unnamed company";
  const inner = `
    ${heading(`New AEO onboarding: ${company}`)}
    <p style="margin:0;font:400 16px/1.6 ${FONT};color:${INK_2};">
      ${escapeHtml(contactName || "Someone")}${contactEmail ? ` (<a href="mailto:${escapeHtml(contactEmail)}" style="color:${GREEN};">${escapeHtml(contactEmail)}</a>)` : ""} has completed the onboarding questionnaire.
    </p>
    ${button(studioHref, "Open in Sanity")}
    ${renderSummaryHtml(sections, uploads)}
  `;

  return {
    subject: `New AEO onboarding: ${company}`,
    html: shell(`New AEO onboarding: ${company}`, inner),
    text: [
      `New AEO onboarding: ${company}`,
      `${contactName} <${contactEmail}>`,
      `Sanity: ${studioHref}`,
      "",
      renderSummaryText(sections, uploads),
    ].join("\n"),
  };
}

export function confirmationEmail({
  firstName,
  companyName,
}: {
  firstName: string;
  companyName: string;
}): { subject: string; html: string; text: string } {
  const inner = `
    ${heading(`Thanks${firstName ? `, ${firstName}` : ""}.`)}
    <p style="margin:0 0 14px;">That's everything we need to get going.</p>
    <p style="margin:0 0 14px;">I'll go through your answers properly before we speak, and I'll be in touch shortly to book your onboarding session. If anything changed between filling this in and reading this, just reply to this email.</p>
    <p style="margin:0 0 14px;">Once we have access to your platforms, the first 30 days are: a full visibility baseline, the technical groundwork, and your first pieces of AI-citable content.</p>
    <p style="margin:24px 0 0;">Ben<br /><span style="color:${INK_3};">Founder, DomiSearch</span></p>
  `;
  return {
    subject: `We've got everything — thanks${firstName ? `, ${firstName}` : ""}`,
    html: shell("Onboarding received", inner),
    text: [
      `Thanks${firstName ? `, ${firstName}` : ""}.`,
      "",
      "That's everything we need to get going. I'll go through your answers before we speak and will be in touch shortly to book your onboarding session.",
      "",
      "Ben — Founder, DomiSearch",
      companyName ? `(${companyName})` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function resumeEmail({
  firstName,
  href,
}: {
  firstName: string;
  href: string;
}): { subject: string; html: string; text: string } {
  const inner = `
    ${heading("Your onboarding link")}
    <p style="margin:0 0 14px;">${firstName ? `${escapeHtml(firstName)}, y` : "Y"}ou've started the DomiSearch onboarding form. Here's your link back into it — everything you've typed so far is already saved.</p>
    ${button(href, "Pick up where you left off")}
    <p style="margin:0;color:${INK_3};font:400 14px/1.6 ${FONT};">Keep this email. The link works from any device and stays live until you submit. If it stops working, reply and we'll send a new one.</p>
  `;
  return {
    subject: "Your DomiSearch onboarding link",
    html: shell("Your onboarding link", inner),
    text: [
      "You've started the DomiSearch onboarding form. Everything so far is saved.",
      "",
      `Pick up where you left off: ${href}`,
      "",
      "Keep this email — the link works from any device until you submit.",
    ].join("\n"),
  };
}

export function copyEmail({
  companyName,
  sections,
  uploads,
}: {
  companyName: string;
  sections: SummarySection[];
  uploads: EmailUpload[];
}): { subject: string; html: string; text: string } {
  const inner = `
    ${heading("Your onboarding answers")}
    <p style="margin:0;">A copy of everything you sent us${companyName ? `, for ${escapeHtml(companyName)}` : ""}. Nothing to do with it — it's yours to keep.</p>
    ${renderSummaryHtml(sections, uploads)}
  `;
  return {
    subject: `Your DomiSearch onboarding answers${companyName ? ` — ${companyName}` : ""}`,
    html: shell("Your onboarding answers", inner),
    text: ["Your DomiSearch onboarding answers", "", renderSummaryText(sections, uploads)].join("\n"),
  };
}
