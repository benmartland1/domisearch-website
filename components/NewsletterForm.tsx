"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function NewsletterForm() {
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
      const res = await fetch("/api/newsletter", {
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

  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-charcoal)] p-8 sm:p-12">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--color-domigreen)" }}
        />
        <div className="relative">
          <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-domigreen)]">
            The DomiSearch Dispatch
          </div>
          <h3 className="display mt-4 max-w-2xl text-balance text-3xl text-[color:var(--color-glacier)] sm:text-4xl">
            Monthly notes on Google Ads, AEO &amp; how search is actually changing.
          </h3>
          <p className="mt-4 max-w-xl text-[color:var(--color-fog)]/80">
            No fluff. One email per month. Unsubscribe any time.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-xl border border-[color:var(--color-domigreen)]/40 bg-[color:var(--color-domigreen)]/10 px-5 py-4 text-sm text-[color:var(--color-glacier)]">
              You're in. Check your inbox for a quick confirmation.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="hp_company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-base text-[color:var(--color-glacier)] outline-none transition-colors placeholder:text-white/35 focus:border-[color:var(--color-domigreen)]"
              />
              <button
                type="submit"
                className="btn btn-primary justify-center"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
                <span aria-hidden>→</span>
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-[color:#ff9d9d]">{error}</p>
          )}

          <p className="mt-4 text-xs text-[color:var(--color-fog)]/55">
            We only use your email to send the newsletter. No third-party sharing.
          </p>
        </div>
      </div>
    </section>
  );
}
