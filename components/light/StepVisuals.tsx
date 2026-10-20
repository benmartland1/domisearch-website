import type { ReactNode } from "react";
import { IllustrationTag, LightWindow, lightCard, Mark } from "./Primitives";

/*
 * The illustrations for stages 2, 3 and 4 of "How it works": a website page,
 * an enquiry email and a simple monthly report. Each is drawn from familiar
 * things and every one carries an "Illustrative example" tag. Content is
 * passed in so the homepage and the sector pages can show their own example
 * without duplicating the drawing.
 */

/* ---------- stage 2: the website ---------- */

export function WebsiteVisual({
  domain,
  pageKicker,
  pageTitle,
  pageIntro,
  bullets,
  quote,
  guideKicker,
  guideTitle,
  guideBlurb,
  answer,
}: {
  domain: string;
  pageKicker: string;
  pageTitle: string;
  pageIntro: string;
  bullets: string[];
  quote: string;
  guideKicker: string;
  guideTitle: string;
  guideBlurb: string;
  /** The AI sentence the pages earn. May include <Mark>. */
  answer: ReactNode;
}) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-start">
        <LightWindow title={`${domain}/${slug(pageTitle)}`}>
          <div className="p-5 sm:p-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
              {pageKicker}
            </span>
            <h4 className="mt-2 text-[18px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[20px]">
              {pageTitle}
            </h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-ink-2)]">
              {pageIntro}
            </p>
            <ul className="mt-3 space-y-1.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] text-[color:var(--color-ink-2)]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-pine)]" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-black/[0.06] bg-[#fbfaf8] p-3 text-[12px] italic leading-snug text-[color:var(--color-ink-2)]">
              &ldquo;{quote}&rdquo;
            </div>
          </div>
        </LightWindow>

        <LightWindow title={`${domain}/insights`} tag={null}>
          <article className="p-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
              {guideKicker}
            </span>
            <h4 className="mt-2 text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
              {guideTitle}
            </h4>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--color-ink-2)]">
              {guideBlurb}
            </p>
            <div className="mt-4 space-y-1.5" aria-hidden>
              <span className="block h-1.5 w-full rounded bg-black/[0.06]" />
              <span className="block h-1.5 w-[88%] rounded bg-black/[0.06]" />
              <span className="block h-1.5 w-[70%] rounded bg-black/[0.06]" />
            </div>
          </article>
        </LightWindow>
      </div>

      <div className="flex justify-center py-1" aria-hidden>
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
          <path d="M12 0v26" stroke="var(--color-pine)" strokeWidth="1.5" strokeDasharray="3 4" />
          <path d="M6 24l6 8 6-8" stroke="var(--color-pine)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className={`${lightCard} mx-auto flex max-w-lg gap-3 border-[color:var(--color-pine)]/30 bg-[color:var(--color-pine)]/[0.05] p-4`}>
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)]/10 text-[color:var(--color-pine)]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M12 2.5l2.1 5.9 5.9 2.1-5.9 2.1L12 18.5l-2.1-5.9L4 10.5l5.9-2.1L12 2.5z" />
          </svg>
        </span>
        <p className="text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{answer}</p>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- stage 3: the enquiry ---------- */

export function EnquiryVisual({
  name,
  role,
  subject,
  body,
  signoff,
  formLine,
}: {
  name: string;
  role: string;
  subject: string;
  body: string;
  signoff?: string;
  /** The first line typed into the website's enquiry form. */
  formLine: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="relative">
      {/* The enquiry form, drawn quieter so the email reads as the outcome */}
      <div className={`${lightCard} w-[78%] max-w-sm p-5 opacity-90 sm:w-[62%]`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
            Enquiry form
          </p>
          <IllustrationTag />
        </div>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-black/[0.08] px-3 py-2 text-[12.5px] text-[color:var(--color-ink-2)]">
            {name}
          </div>
          <div className="rounded-lg border border-black/[0.08] px-3 py-2 text-[12.5px] text-[color:var(--color-ink-2)]">
            {role}
          </div>
          <div className="rounded-lg border border-black/[0.08] px-3 py-2 text-[12.5px] leading-snug text-[color:var(--color-ink-2)]">
            {formLine}
          </div>
        </div>
        <span className="mt-3 inline-flex rounded-full bg-[color:var(--color-ink)] px-3.5 py-1.5 text-[12px] font-semibold text-[color:var(--color-paper)]">
          Send enquiry
        </span>
      </div>

      <svg
        className="absolute left-[52%] top-[26%] hidden h-16 w-24 text-[color:var(--color-pine)] sm:block"
        viewBox="0 0 96 64"
        fill="none"
        aria-hidden
      >
        <path d="M4 6c30 0 50 10 74 46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d="M70 46l8 8 2-11" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      {/* The email that lands: the focal point */}
      <div className="relative -mt-3 ml-auto w-[94%] max-w-md rounded-2xl border border-black/[0.08] bg-white p-5 text-[color:var(--color-ink)] shadow-[0_30px_70px_-34px_rgba(20,17,13,0.55)] sm:-mt-1 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[16px] font-bold leading-snug tracking-tight sm:text-[18px]">{subject}</h4>
          <span className="shrink-0 rounded-md bg-[color:var(--color-paper-2)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-ink-3)]">
            Inbox
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-pine)] text-[12px] font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0 text-[12.5px] leading-snug">
            <p className="font-semibold text-[color:var(--color-ink)]">{name}</p>
            <p className="text-[color:var(--color-ink-3)]">to you · Just now</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">{body}</p>
        {signoff ? (
          <p className="mt-3 text-[14px] text-[color:var(--color-ink-2)]">
            Thanks,
            <br />
            {signoff}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <span className="rounded-full border border-black/[0.14] px-3.5 py-1.5 text-[12px] font-semibold text-[color:var(--color-ink)]">
            Reply
          </span>
          <span className="rounded-full border border-black/[0.14] px-3.5 py-1.5 text-[12px] font-semibold text-[color:var(--color-ink)]">
            Forward
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- stage 4: the report ---------- */

export type ReportRow = { label: string; body: string; note: string };

export function ReportVisual({
  company,
  period,
  rows,
  studioNote = "Each change is dated in Domi Studio, our own software, so we can see what happened after it.",
}: {
  company: string;
  period: string;
  rows: ReportRow[];
  studioNote?: string | null;
}) {
  return (
    <LightWindow title="Monthly report" tag={<IllustrationTag />}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] font-bold tracking-tight text-[color:var(--color-ink)]">{company}</p>
          <p className="text-[12px] text-[color:var(--color-ink-3)]">{period}</p>
        </div>
        <ul className="mt-3 divide-y divide-black/[0.06]">
          {rows.map((r) => (
            <li key={r.label} className="grid gap-1 py-3.5 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-pine)] sm:pt-1">
                {r.label}
              </span>
              <span>
                <span className="block text-[14px] font-semibold tracking-tight text-[color:var(--color-ink)]">
                  {r.body}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-relaxed text-[color:var(--color-ink-3)]">
                  {r.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {studioNote ? (
          <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-[#fbfaf8] px-3.5 py-3">
            <span className="mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[color:var(--color-ink)] text-[8px] font-bold text-[color:var(--color-domigreen)]">
              D
            </span>
            <p className="text-[12px] leading-relaxed text-[color:var(--color-ink-3)]">
              <span className="font-semibold text-[color:var(--color-ink-2)]">Domi Studio.</span>{" "}
              {studioNote}
            </p>
          </div>
        ) : null}
      </div>
    </LightWindow>
  );
}

/** Convenience re-export so a page can build an answer sentence. */
export { Mark };
