"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/Icons";

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
      <div className="relative overflow-hidden rounded-[4px] bg-[color:var(--color-forest)] p-8 text-[color:var(--color-paper)] sm:p-12">
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[color:var(--color-domigreen)]">
            The DomiSearch Dispatch
          </div>
          <h3 className="display mt-4 max-w-2xl text-balance text-3xl sm:text-4xl" style={{ color: "var(--color-paper)" }}>
            Monthly notes on Google Ads, AEO &amp; how search is actually changing.
          </h3>
          <p className="mt-4 max-w-xl text-[#cadcd1]">
            No fluff. One email per month. Unsubscribe any time.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-[3px] border border-[color:var(--color-domigreen)]/50 bg-[color:var(--color-domigreen)]/10 px-5 py-4 text-sm">
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
                className="flex-1 rounded-[2px] border border-[#b7c0b5] bg-white px-4 py-3 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[#7c867f] focus:border-[color:var(--color-ink)]"
              />
              <button
                type="submit"
                className="ds-button ds-button-green justify-center"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
                <span aria-hidden><ArrowRight /></span>
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-[#ffb4b4]">{error}</p>
          )}

          <p className="mt-4 text-xs text-[#cadcd1]">
            We only use your email to send the newsletter. No third-party sharing.
          </p>
        </div>
      </div>
    </section>
  );
}
