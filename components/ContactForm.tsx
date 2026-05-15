"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Honeypot - if filled, silently succeed and drop
    if (data.hp_field_dom) {
      setStatus("success");
      form.reset();
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please email hi@domisearch.com.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-10 text-center">
        <div className="eyebrow">Message received</div>
        <h3 className="display mt-4 text-3xl">Thanks - we'll be in touch.</h3>
        <p className="mt-4 text-[color:var(--color-fog)]/85">
          Ben reads every submission personally. Expect a reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5 p-8 sm:p-10" noValidate>
      {/* Honeypot — must not be filled. Hardened against password-manager autofill. */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label>
          Leave this empty
          <input
            type="text"
            name="hp_field_dom"
            tabIndex={-1}
            autoComplete="new-password"
            defaultValue=""
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" required />
        <Field name="email" label="Email" type="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="company" label="Company" />
        <Field name="budget" label="Monthly budget (optional)" />
      </div>
      <Field name="message" label="What can we help with?" textarea required />

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[color:var(--color-fog)]/60">
          We'll only use your details to reply. No list, no spam.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          <span aria-hidden>→</span>
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-[color:#ff9d9d]">{error}</p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
        {label}
        {required && <span aria-hidden className="ml-1 text-[color:var(--color-domigreen)]">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={name === "email" ? "email" : name === "name" ? "name" : "off"}
          className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/30 focus:border-[color:var(--color-domigreen)]"
        />
      )}
    </label>
  );
}
