"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function VisibilityCheckForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Honeypot
    if (data.hp_company) {
      setStatus("success");
      form.reset();
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
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
      <div className="max-w-xl rounded-2xl border border-[color:var(--color-domigreen)]/40 bg-[color:var(--color-domigreen)]/10 px-5 py-4 text-sm text-[color:var(--color-glacier)]">
        Got it - Ben will run your AI search visibility check personally and follow up with a
        short audit.
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
        {/* Honeypot */}
        <input
          type="text"
          name="hp_company"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden
        />
        <label htmlFor="visibility-url" className="sr-only">
          Your website
        </label>
        <input
          id="visibility-url"
          name="url"
          type="text"
          inputMode="url"
          required
          autoComplete="url"
          placeholder="yourcompany.com"
          className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/35 focus:border-[color:var(--color-domigreen)]"
        />
        <button
          type="submit"
          className="btn btn-primary justify-center whitespace-nowrap"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Checking…" : "Check Your AI Search Visibility"}
          <span aria-hidden>→</span>
        </button>
      </form>

      {status === "error" && <p className="mt-3 text-sm text-[color:#ff9d9d]">{error}</p>}

      <p className="mt-3 text-xs text-[color:var(--color-fog)]/55">
        We&apos;ll check where you show up across ChatGPT, Gemini &amp; Perplexity and send back a
        short audit.
      </p>
    </div>
  );
}
