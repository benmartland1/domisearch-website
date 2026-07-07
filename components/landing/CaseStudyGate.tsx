"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { trackMeta } from "@/lib/meta";

// ─── UNLOCK STUB ──────────────────────────────────────────────────────────
// The CTA button opens a short lead form (name, business, phone, work email).
// On submit we capture the lead (/api/case-study-lead → emails Ben + audience),
// fire the Meta Pixel `Lead` event, then send the visitor to the unlock page.
// Swap UNLOCK_DESTINATION for the real resource bundle URL when it's ready.
// ──────────────────────────────────────────────────────────────────────────
const UNLOCK_DESTINATION = "/taxd-case-study/unlocked";

const fieldClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)]";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-[color:var(--color-ink)]";

export function CaseStudyGate({ id, tone = "light" }: { id: string; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Lock scroll + focus first field + close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, sending]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const v = {
      name: name.trim(),
      business: business.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };
    if (v.name.length < 1) return setError("Please enter your name.");
    if (v.business.length < 1) return setError("Please enter your business name.");
    if (v.phone.replace(/[^\d]/g, "").length < 5) return setError("Please enter a valid phone number.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) return setError("Please enter a valid work email.");

    // Meta: they've committed to unlocking. Fire before leaving the page.
    trackMeta("Lead", {
      content_name: "Taxd Case Study",
      content_category: "case-study",
    });

    setSending(true);
    // Best-effort capture — never block the unlock on a delivery hiccup.
    try {
      await fetch("/api/case-study-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, hp_company: hp }),
        keepalive: true,
      });
    } catch {
      /* ignore — the pixel Lead has already fired and we still unlock */
    }
    window.location.href = UNLOCK_DESTINATION;
  }

  const helper =
    tone === "dark" ? "text-[color:var(--color-paper)]/55" : "text-[color:var(--color-ink-3)]";

  return (
    <div className="mx-auto w-full max-w-md" id={id}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cta-pulse flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-7 py-4 text-base font-semibold text-[color:var(--color-paper)] shadow-[0_14px_34px_-14px_rgba(0,0,0,0.7)] transition-transform hover:-translate-y-0.5"
      >
        Unlock the full breakdown
        <span aria-hidden>→</span>
      </button>
      <p className={`mt-3 text-center text-sm ${helper}`}>5 resources · 100% free · Instant access</p>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-modal-title`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !sending) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-t-3xl bg-[color:var(--color-paper)] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
            <button
              type="button"
              onClick={() => !sending && setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[color:var(--color-ink-3)] transition-colors hover:bg-black/[0.05] hover:text-[color:var(--color-ink)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <h2
              id={`${id}-modal-title`}
              className="pr-8 text-[clamp(1.3rem,4vw,1.6rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]"
            >
              Unlock the full Taxd breakdown
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
              Tell us where to send it and you&apos;ll get instant access to all five resources.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              {/* Honeypot — hidden from real users. No label/name/placeholder so
                  browser autofill never populates it (a filled honeypot would be
                  treated as a bot and the lead silently dropped). */}
              <div aria-hidden className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor={`${id}-name`} className={labelClass}>Name</label>
                <input
                  ref={firstFieldRef}
                  id={`${id}-name`}
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${id}-business`} className={labelClass}>Business name</label>
                <input
                  id={`${id}-business`}
                  type="text"
                  autoComplete="organization"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Acme Ltd"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${id}-phone`} className={labelClass}>Phone number</label>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07980 000000"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${id}-email`} className={labelClass}>Work email</label>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>

              {error && <p className="text-sm text-[color:#c0392b]">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-7 py-4 text-base font-semibold text-[color:var(--color-paper)] shadow-[0_14px_34px_-14px_rgba(0,0,0,0.7)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {sending ? "Unlocking…" : "Unlock the full breakdown"}
                <span aria-hidden>→</span>
              </button>
              <p className="text-center text-[13px] text-[color:var(--color-ink-3)]">
                5 resources · 100% free · Instant access
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
