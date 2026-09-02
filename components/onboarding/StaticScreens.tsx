"use client";

import { useState } from "react";
import type { SummarySection } from "@/lib/onboarding/summary";

/** Screen 0. Written from Ben, because he is the one they signed with. */
export function WelcomeScreen({
  onStart,
  resumed,
}: {
  onStart: () => void;
  resumed: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="ob-index">DomiSearch onboarding</p>
      <h1 className="display text-4xl sm:text-5xl">Welcome to DomiSearch</h1>

      <div className="flex max-w-[52ch] flex-col gap-4 text-[1.05rem] leading-relaxed text-[color:var(--color-fog)]/85">
        {resumed ? (
          <p>Good to have you back. Everything you'd already filled in is here — pick up wherever you left off.</p>
        ) : (
          <p>
            Good to have you on board. We've already covered the big picture on our calls, so this isn't about
            explaining your business from scratch. It's the detail we need before we start: the exact claims we
            can make, the tone you want us to write in, who your competitors are, and access to the platforms
            we'll be working in.
          </p>
        )}
        <p>
          It takes about ten minutes. Every answer saves as you go, so you can stop whenever you like and we'll
          email you a link back in.
        </p>
        <p>
          None of it is admin for the sake of it. It feeds straight into your first 30 days: the visibility
          baseline, the technical groundwork, and the first content we put in front of AI engines.
        </p>
      </div>

      <p className="font-[SignatureA] text-3xl text-[color:var(--color-domigreen)]" aria-label="Ben">
        Ben
      </p>

      <div className="flex flex-col items-start gap-3">
        <button type="button" className="btn btn-primary text-base" onClick={onStart}>
          {resumed ? "Pick up where I left off" : "Let's get started"}
          <span aria-hidden>→</span>
        </button>
        <p className="text-sm text-[color:var(--ob-muted)]">
          About 10 minutes · Save and come back any time
        </p>
      </div>
    </div>
  );
}

/** The access section's opening screen: sets the rules before the asks. */
export function IntroScreen({
  title,
  body,
  onContinue,
}: {
  title: string;
  body: string[];
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="ob-index">Almost there</p>
      <h2 className="ob-question">{title}</h2>
      <div className="flex max-w-[52ch] flex-col gap-4 text-[1.05rem] leading-relaxed text-[color:var(--color-fog)]/85">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="ob-card max-w-[52ch] p-5">
        <p className="text-[0.98rem] text-[color:var(--color-fog)]">
          <span className="text-[color:var(--color-domigreen)]">We never ask for passwords.</span> If anyone ever
          does — including someone claiming to be us — don't give them one.
        </p>
      </div>
      <button type="button" className="btn btn-primary self-start text-base" onClick={onContinue}>
        Got it <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/** The last screen before submitting. A short account of what's about to be sent. */
export function ReviewScreen({
  sections,
  missing,
  onSubmit,
  onJumpTo,
  submitting,
  error,
}: {
  sections: SummarySection[];
  missing: { id: string; label: string }[];
  onSubmit: () => void;
  onJumpTo: (questionId: string) => void;
  submitting: boolean;
  error: string | null;
}) {
  const answered = sections.reduce((total, section) => total + section.items.filter((i) => i.answer).length, 0);

  return (
    <div className="flex flex-col gap-6">
      <p className="ob-index">Last step</p>
      <h2 className="ob-question">That's everything. Ready to send?</h2>
      <p className="ob-helper">
        {answered} answers, across {sections.length} sections. You can still go back and change anything.
      </p>

      {missing.length > 0 && (
        <div className="ob-card p-5">
          <p className="mb-3 text-[color:var(--color-fog)]">
            Two or three still need an answer before we can take it:
          </p>
          <ul className="flex flex-col gap-2">
            {missing.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="text-left text-[color:var(--color-domigreen)] underline underline-offset-4"
                  onClick={() => onJumpTo(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <div key={section.id} className="flex items-baseline justify-between gap-4 border-b border-[color:var(--ob-line)] pb-2">
            <span className="text-[color:var(--color-glacier)]">{section.title}</span>
            <span className="text-sm text-[color:var(--ob-muted)]">
              {section.items.filter((i) => i.answer).length} answered
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary self-start text-base"
        onClick={onSubmit}
        disabled={submitting || missing.length > 0}
      >
        {submitting ? "Sending…" : "Send it over"}
        <span aria-hidden>→</span>
      </button>

      {error && (
        <p className="ob-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Screen 7. */
export function DoneScreen({ token, firstName }: { token: string | null; firstName: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function emailCopy() {
    if (!token) return;
    setState("sending");
    setMessage(null);
    try {
      const response = await fetch("/api/onboarding/email-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; to?: string };
      if (!response.ok) throw new Error(body.error ?? "Couldn't send that just now.");
      setState("sent");
      setMessage(body.to ? `Sent to ${body.to}.` : "Sent.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Couldn't send that just now.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <span
        className="grid h-14 w-14 place-items-center rounded-full bg-[color:var(--color-domigreen)] text-2xl text-[color:var(--color-charcoal)]"
        aria-hidden
      >
        ✓
      </span>
      <h1 className="display text-4xl sm:text-5xl">
        Thanks{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="max-w-[52ch] text-[1.05rem] leading-relaxed text-[color:var(--color-fog)]/85">
        That's everything we need. Ben will be in touch to book your onboarding session.
      </p>

      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          className="btn btn-ghost text-base"
          onClick={() => void emailCopy()}
          disabled={!token || state === "sending" || state === "sent"}
        >
          {state === "sending" ? "Sending…" : state === "sent" ? "On its way" : "Email me a copy of my answers"}
        </button>
        <p className="text-sm text-[color:var(--ob-muted)]" role="status" aria-live="polite">
          {message ?? "You can close this page — everything's saved."}
        </p>
      </div>
    </div>
  );
}
