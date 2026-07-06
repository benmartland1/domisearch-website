"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackMeta } from "@/lib/meta";

// ─── STRIPE STUB ──────────────────────────────────────────────────────────
// Drop your real Stripe Payment Link in the NEXT_PUBLIC_STRIPE_PAYMENT_LINK env
// var (Vercel → Settings → Environment Variables). Create a £99 GBP one-off
// Payment Link in Stripe, enable "collect email", and set its success URL to
// https://www.domisearch.com/ai-visibility-roadmap/thanks
// The visitor's domain is passed through as client_reference_id (visible on the
// payment in your Stripe dashboard) and their email is prefilled.
// Until the env var is set, the button validates + fires the pixel but shows a
// "checkout not live yet" note instead of redirecting.
// ──────────────────────────────────────────────────────────────────────────
const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";

function checkoutConfigured(): boolean {
  return Boolean(STRIPE_PAYMENT_LINK) && !STRIPE_PAYMENT_LINK.includes("REPLACE_ME");
}

const inputClass =
  "w-full rounded-full border bg-white px-5 py-3.5 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)]";

export function RoadmapCheckout({ id }: { id: string }) {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const domainRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanDomain = domain.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    const cleanEmail = email.trim();

    if (cleanDomain.length < 3 || !cleanDomain.includes(".")) {
      domainRef.current?.focus();
      setError("Enter your website domain.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      emailRef.current?.focus();
      setError("Enter a valid email address.");
      return;
    }

    // Meta: they've committed to buying. Fire before leaving the page.
    trackMeta("InitiateCheckout", {
      value: 99,
      currency: "GBP",
      content_name: "AI Visibility Roadmap",
    });

    if (!checkoutConfigured()) {
      setError("Checkout isn't live yet - add your Stripe Payment Link to go live.");
      return;
    }

    setSending(true);
    const url =
      `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(cleanEmail)}` +
      `&client_reference_id=${encodeURIComponent(cleanDomain)}`;
    window.location.href = url;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md lg:mx-0" noValidate>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[15px] text-[color:var(--color-ink-3)]"
          >
            https://
          </span>
          <label htmlFor={`${id}-domain`} className="sr-only">Your website domain</label>
          <input
            ref={domainRef}
            id={`${id}-domain`}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourbrand.com"
            className={`${inputClass} border-black/15 pl-[5rem]`}
          />
        </div>
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input
          ref={emailRef}
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={`${inputClass} border-black/15`}
        />
        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-pine)] px-7 py-4 text-base font-semibold text-[color:var(--color-paper)] shadow-[0_10px_30px_-12px_rgba(1,99,76,0.7)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {sending ? "Taking you to checkout…" : "Get my 90-day roadmap - £99"}
          <span aria-hidden>→</span>
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-[color:#c0392b]">{error}</p>}
    </form>
  );
}
