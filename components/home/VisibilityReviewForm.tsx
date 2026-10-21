"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { trackMeta } from "@/lib/meta";

/**
 * The "Your AI visibility review" form from the approved design, wired to the
 * same /api/audit-request endpoint as the previous homepage form, so requests
 * reach Ben by email exactly as before.
 */
export function VisibilityReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus(null);
    setSending(true);
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: website.trim(),
          name: name.trim(),
          email: email.trim(),
          hp_company: honeypot,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      trackMeta("Lead", { content_name: "Homepage AI Visibility Review" });
      setStatus({
        ok: true,
        text: `Thanks, ${name.trim()}. We'll check ${website.trim()} across ChatGPT, Gemini and Perplexity and send your review to ${email.trim()}.`,
      });
      setName("");
      setEmail("");
      setWebsite("");
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="ds-form" onSubmit={submit} noValidate>
      <h3>Your AI visibility review</h3>
      <p>Tell us where to look and where to send it.</p>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="hp_company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ position: "absolute", left: -9999, width: 0, height: 0, opacity: 0 }}
      />
      <label className="ds-field">
        Your name
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Alex Smith"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="ds-field">
        Work email
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="alex@yourcompany.co.uk"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="ds-field">
        Company website
        <input
          type="text"
          name="website"
          inputMode="url"
          autoComplete="url"
          placeholder="yourcompany.co.uk"
          required
          minLength={3}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>
      <button className="ds-button ds-button-green" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Request my free review"} <span className="ds-arrow">↗</span>
      </button>
      <p className="ds-form-note">
        We’ll use these details to respond to your request.{" "}
        <a href="/privacy" style={{ textDecoration: "underline" }}>
          Privacy policy
        </a>
        .
      </p>
      <div className="ds-form-feedback" role="status" aria-live="polite" hidden={!status}>
        {status?.text}
        {status?.ok ? (
          <>
            {" "}
            Prefer to talk it through?{" "}
            <a href={site.calendly} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
              Book a 30-minute call ↗
            </a>
          </>
        ) : null}
      </div>
    </form>
  );
}
