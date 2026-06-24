"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { site } from "@/lib/site";
import { trackMeta } from "@/lib/meta";

type Step = "email" | "booking";

type FunnelCtx = {
  start: (domain: string) => void;
};

const Ctx = createContext<FunnelCtx | null>(null);

function useFunnel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFunnel must be used within <ReportFunnelProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider + modal                                                    */
/* ------------------------------------------------------------------ */

export function ReportFunnelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [domain, setDomain] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback((d: string) => {
    setDomain(d);
    setName("");
    setEmail("");
    setPhone("");
    setError(null);
    setStep("email");
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll + escape-to-close while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // When a Calendly booking completes inside the embed, Calendly posts a
  // `calendly.event_scheduled` message to the parent window. Redirect to the
  // thank-you page so the conversion can be tracked (PageView + Schedule event).
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string } | null;
      if (data && typeof data === "object" && data.event === "calendly.event_scheduled") {
        window.location.assign("/ai-visibility-report/thank-you");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  async function submitEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/report-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      // Meta conversion signal: a real lead (domain + email captured).
      trackMeta("Lead", { content_name: "AI Visibility Report" });
      setStep("booking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSending(false);
    }
  }

  return (
    <Ctx.Provider value={{ start }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Get your AI Visibility Report"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="relative my-auto w-full bg-[color:var(--color-paper)] text-[color:var(--color-ink)] shadow-2xl sm:max-w-lg sm:rounded-[1.5rem]">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-[color:var(--color-ink-3)] transition-colors hover:bg-black/5 hover:text-[color:var(--color-ink)]"
            >
              <span aria-hidden className="text-xl leading-none">×</span>
            </button>

            {step === "email" ? (
              <div className="p-7 sm:p-9">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-pine)]">
                  Almost there
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
                  Where should we send your report?
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                  We&apos;re building the AI visibility report for{" "}
                  <span className="font-semibold text-[color:var(--color-ink)]">{domain}</span>.
                  Add your details and we&apos;ll send it over, then you can book a call to walk through it.
                </p>

                <form onSubmit={submitEmail} className="mt-6 space-y-3">
                  <div>
                    <label htmlFor="funnel-name" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="funnel-name"
                      type="text"
                      required
                      autoFocus
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="funnel-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="funnel-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="funnel-phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="funnel-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-pine)] px-6 py-3.5 text-base font-semibold text-[color:var(--color-paper)] transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send My Free Report"}
                    <span aria-hidden>→</span>
                  </button>
                </form>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <p className="mt-4 text-xs text-[color:var(--color-ink-3)]">
                  No spam. We use your details only to send the report and arrange your call.
                </p>
              </div>
            ) : (
              <div className="p-7 sm:p-9">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-pine)]">
                  Report on its way
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
                  Now book your walkthrough call
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                  We&apos;re generating the report for{" "}
                  <span className="font-semibold text-[color:var(--color-ink)]">{domain}</span> and it&apos;s
                  landing in your inbox shortly. Grab a slot below and we&apos;ll go through exactly where
                  you&apos;re missing - and the fastest gaps to close.
                </p>

                {/* Calendly inline embed. Swap site.calendly in lib/site.ts to change the booking link. */}
                <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
                  <iframe
                    src={`${site.calendly}?hide_gdpr_banner=1&background_color=f5f2ec&primary_color=01634c`}
                    title="Book a call with DomiSearch"
                    className="h-[560px] w-full"
                    loading="lazy"
                  />
                </div>

                <p className="mt-4 text-xs text-[color:var(--color-ink-3)]">
                  Prefer email? We&apos;ll be in touch once your report is ready.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Domain capture form - the single, repeated CTA                      */
/* ------------------------------------------------------------------ */

export function DomainCaptureForm({
  id,
  placeholder = "yourbrand.com",
}: {
  id: string;
  placeholder?: string;
}) {
  const { start } = useFunnel();
  const [domain, setDomain] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = domain.trim();
    if (value.length < 3 || !value.includes(".")) {
      // Don't fail silently — highlight + focus the field so it's clear the
      // visitor needs to enter a website here.
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setInvalid(false);
    start(value.replace(/^https?:\/\//i, "").replace(/\/.*$/, ""));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      noValidate
    >
      <label htmlFor={id} className="sr-only">
        Your website domain
      </label>
      <div className="relative flex-1">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[color:var(--color-ink-3)]"
        >
          https://
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="url"
          required
          autoComplete="url"
          aria-invalid={invalid}
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            if (invalid) setInvalid(false);
          }}
          placeholder={placeholder}
          className={`w-full rounded-full border bg-white py-4 pl-[4.6rem] pr-5 text-base text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-black/35 focus:border-[color:var(--color-pine)] ${invalid ? "border-red-400" : "border-black/15"}`}
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-pine)] px-7 py-4 text-base font-semibold text-[color:var(--color-paper)] shadow-[0_10px_30px_-12px_rgba(1,99,76,0.7)] transition-transform hover:-translate-y-0.5"
      >
        Get My Free AI Visibility Report
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
