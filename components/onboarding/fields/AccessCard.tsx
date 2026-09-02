"use client";

import { TEAM_EMAIL } from "@/lib/onboarding/access";
import type { AccessPlatform, Answers } from "@/lib/onboarding/types";
import { useState } from "react";

const STATUS_OPTIONS: { value: "done" | "help" | "na"; label: string; hint: string }[] = [
  { value: "done", label: "Done", hint: "Access granted" },
  { value: "help", label: "I need help with this", hint: "We'll do it together on the call" },
  { value: "na", label: "Not applicable", hint: "We don't use this" },
];

/**
 * One platform to grant access to.
 *
 * The instructions are on the screen, not behind a link, because the person
 * filling this in is usually doing it on a phone with the platform open in
 * another tab. "I need help with this" is a first-class answer, not a
 * failure state — it is the whole reason this screen isn't a checkbox.
 */
export function AccessCard({
  platform,
  answers,
  value,
  onChange,
  onAdvance,
  labelledBy,
}: {
  platform: AccessPlatform;
  answers: Answers;
  value: string;
  onChange: (value: string) => void;
  onAdvance?: () => void;
  labelledBy?: string;
}) {
  const [copied, setCopied] = useState(false);
  const steps = platform.steps(answers);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(TEAM_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some in-app browsers. The address is on
      // screen and selectable, so there's nothing to recover from.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="ob-card p-5 sm:p-6">
        <p className="text-[color:var(--ob-muted)]">{platform.why}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[color:var(--ob-line)] px-3 py-2">
            <code className="text-[0.95rem] text-[color:var(--color-domigreen)]">{TEAM_EMAIL}</code>
            <button
              type="button"
              onClick={() => void copyEmail()}
              className="text-xs uppercase tracking-[0.14em] text-[color:var(--ob-muted)] hover:text-[color:var(--color-domigreen)]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <span className="text-sm text-[color:var(--ob-muted)]">
            Permission: <span className="text-[color:var(--color-glacier)]">{platform.permission}</span>
          </span>
        </div>

        <ol className="mt-6 flex flex-col gap-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-[0.98rem] leading-relaxed">
              <span className="ob-key mt-0.5" aria-hidden>
                {index + 1}
              </span>
              <span className="pt-1 text-[color:var(--color-fog)]">{step}</span>
            </li>
          ))}
        </ol>

        {platform.link && (
          <a
            href={platform.link.href}
            target="_blank"
            rel="noopener noreferrer"
            /* Solid, not the dashed "add another" affordance — this opens a
               page rather than adding a row. */
            className="ob-ghost-btn mt-5 inline-flex"
            style={{ borderStyle: "solid" }}
          >
            {platform.link.label} <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      <fieldset>
        <legend className="ob-label mb-3">How did you get on?</legend>
        <div className="flex flex-col gap-2.5" role="radiogroup" aria-labelledby={labelledBy}>
          {STATUS_OPTIONS.map((option, index) => {
            const selected = value === option.value;
            return (
              <label key={option.value} className="ob-option" data-selected={selected}>
                <input
                  type="radio"
                  name={platform.id}
                  value={option.value}
                  checked={selected}
                  className="sr-only"
                  onChange={() => {
                    onChange(option.value);
                    window.setTimeout(() => onAdvance?.(), 260);
                  }}
                />
                <span className="ob-key" aria-hidden>
                  {selected ? "✓" : "ABC"[index]}
                </span>
                <span>
                  <span className="ob-option-label">{option.label}</span>
                  <span className="ob-option-hint block">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
