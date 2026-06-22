import type { Metadata } from "next";
import { ReportFunnelProvider, DomainCaptureForm } from "@/components/landing/ReportFunnel";
import { DomiMark } from "@/components/landing/DomiMark";
import { EngineStrip } from "@/components/landing/EngineStrip";
import { site } from "@/lib/site";
import { Fraunces } from "next/font/google";

// Editorial serif for headlines only - gives a premium "clinic/beauty" feel
// while body + UI stay on the DomiSearch sans (Axiforma).
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

const serif = "font-[family-name:var(--font-fraunces)]";

// Fine hand-drawn underline used under one or two hero keywords. A single
// slightly-wavy stroke reads premium/editorial rather than a tacky marker block.
const HL_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 16' preserveAspectRatio='none'><path d='M4,9C48,5,92,13,128,8C160,4,184,12,196,8' fill='none' stroke='#01a36b' stroke-width='4' stroke-linecap='round'/></svg>";
const HL_URI = `url("data:image/svg+xml,${encodeURIComponent(HL_SVG)}")`;

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="pb-[0.04em]"
      style={{
        backgroundImage: HL_URI,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 0.36em",
        backgroundPosition: "0 100%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}

export const metadata: Metadata = {
  title: "Is AI Recommending Your Aesthetic Clinic? · DomiSearch",
  description:
    "Patients ask ChatGPT and Google AI for the best aesthetic clinic before they book. Find out if you're in the answer with a free AI Visibility Report for UK clinics.",
  alternates: { canonical: "/aesthetics" },
  openGraph: {
    title: "Is AI recommending your clinic, or your competitor?",
    description:
      "A free AI Visibility Report for UK aesthetic clinics. See where you show up across ChatGPT, Google AI and Perplexity.",
    url: `${site.url}/aesthetics`,
  },
};

/* ---- Thin-line aesthetics icons (stroke = currentColor, set by parent) ---- */
const iconBase =
  "h-5 w-5";
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconDroplet() {
  return (
    <svg {...iconProps} className={iconBase}>
      <path d="M12 3.5c0 0-6 6.6-6 10.5a6 6 0 1 0 12 0c0-3.9-6-10.5-6-10.5z" />
    </svg>
  );
}
function IconMirror() {
  return (
    <svg {...iconProps} className={iconBase}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V20" />
      <path d="M9 20h6" />
    </svg>
  );
}
function IconSparkle({ className = iconBase }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 3.5 13.5 9.4 19.5 11 13.5 12.6 12 18.5 10.5 12.6 4.5 11 10.5 9.4Z" />
      <path d="M18.7 4.4l.5 1.6 1.6.5-1.6.5-.5 1.6-.5-1.6-1.6-.5 1.6-.5z" />
    </svg>
  );
}

const PROBLEMS = [
  {
    icon: IconDroplet,
    title: "The treatments you're known for can't be advertised",
    body: "Botox and most injectables are prescription-only. You can't run paid ads for them, and naming them on your own Instagram risks an ASA or MHRA notice. The channel everyone else leans on is closed to you.",
  },
  {
    icon: IconMirror,
    title: "Patients choose the most trusted clinic, not the nearest",
    body: "Before booking they search “best clinic near me”, read every review, study before-and-afters, and increasingly ask ChatGPT and Google AI which clinic to trust. Reputation wins, and it's now being decided inside AI answers.",
  },
  {
    icon: IconSparkle,
    title: "If AI doesn't name you, a rival gets the consultation",
    body: "The clinic the AI recommends gets the enquiry, the deposit and the client, often before the patient ever sees your work. Being left out of the answer is the new being invisible.",
  },
];

const REPORT_BULLETS = [
  "Whether AI recommends your clinic when someone asks for the best in your area",
  "The exact treatment and “near me” questions you show up for, and the ones you're missing",
  "Which rival clinics the AI is naming instead of you",
  "The gaps to fix first so you get recommended, compliantly and without ad spend",
];

const STEPS = [
  {
    n: "1",
    title: "Enter your clinic's website",
    body: "Tell us your site and where to send the report. Takes ten seconds.",
  },
  {
    n: "2",
    title: "We run live AI visibility tracking",
    body: "We check your clinic across the AI engines your patients actually use, with real treatment and location prompts.",
  },
  {
    n: "3",
    title: "Get the report + a walkthrough call",
    body: "You receive your AI Visibility Report and a short call to walk through your gaps and how to close them.",
  },
];

function UnionFlag({ className = "h-[11px] w-[22px]" }: { className?: string }) {
  return (
    <span className={`inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10 ${className}`}>
      <svg viewBox="0 0 60 30" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
        <clipPath id="uk-flag-clip">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill="#01634c" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#f5f2ec" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-flag-clip)" stroke="#2dc295" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#f5f2ec" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#2dc295" strokeWidth="6" />
      </svg>
    </span>
  );
}

// Mid-page CTA: scrolls back up to the hero form (smooth via global CSS)
// instead of repeating the full URL entry field.
function ScrollCta({ label }: { label: string }) {
  return (
    <div className="flex justify-center">
      <a
        href="#top"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-pine)] px-7 py-4 text-base font-semibold text-[color:var(--color-paper)] shadow-[0_10px_30px_-12px_rgba(1,99,76,0.7)] transition-transform hover:-translate-y-0.5"
      >
        {label}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function Stars() {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-5 w-5" fill="#00b67a" aria-hidden>
            <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 9.5l6.9-.6z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-[color:var(--color-ink)]">
        Rated 5 stars on Trustpilot
      </span>
    </div>
  );
}

function Check({ className = "mt-0.5 h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
      <circle cx="10" cy="10" r="10" fill="var(--color-pine)" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="var(--color-paper)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AestheticsPage() {
  return (
    <ReportFunnelProvider>
      <div className={`${fraunces.variable} min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]`}>
        {/* Minimal brand bar - no nav, no links */}
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
          <DomiMark className="h-7 w-7" />
          <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">
            DomiSearch
          </span>
          <span className="ml-2 hidden border-l border-black/15 pl-2.5 text-[13px] text-[color:var(--color-ink-3)] sm:inline">
            Search Growth Partner
          </span>
        </div>

        {/* ============================ HERO ============================ */}
        <section id="top" className="relative isolate overflow-hidden scroll-mt-6">
          {/* soft green glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-12%] h-[440px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.12]"
            style={{ background: "radial-gradient(circle, var(--color-pine) 0%, transparent 70%)", filter: "blur(40px)" }}
          />
          {/* whisper of warm blush for a spa feel */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[6%] top-[14%] h-[320px] w-[320px] rounded-full opacity-[0.10]"
            style={{ background: "radial-gradient(circle, #d8a7a0 0%, transparent 70%)", filter: "blur(50px)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-8 text-center sm:pt-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.06] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-pine)]">
              <UnionFlag />
              For UK aesthetic clinics
            </div>

            <h1 className={`mx-auto mt-6 max-w-3xl text-balance ${serif} text-[clamp(2.3rem,5.8vw,3.7rem)] font-medium leading-[1.08] tracking-[-0.01em] text-[color:var(--color-ink)]`}>
              Someone near you just asked <Highlight>AI</Highlight> for the best aesthetic{" "}
              <Highlight>clinic</Highlight>.{" "}
              <span className="italic font-normal text-[color:var(--color-pine)]">
                Did it say your name?
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
              Patients now ask ChatGPT and Google AI which clinic to trust before they ever pick up
              the phone. If the answer names a rival, you've lost them, and you can't run an ad to
              fix it.
            </p>

            <div className="mt-9">
              <DomainCaptureForm id="domain-hero" placeholder="yourclinic.com" />
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[color:var(--color-ink-3)]">
                {["Fully compliant", "No ad spend", "Built for UK clinics"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <EngineStrip label="We check every engine your patients ask" />
            </div>
          </div>
        </section>

        {/* ========================== PROBLEM ========================== */}
        <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="flex flex-col items-center text-center">
              <span className="text-[color:var(--color-pine)]">
                <IconSparkle className="h-6 w-6" />
              </span>
              <h2 className={`mt-4 max-w-2xl ${serif} text-[clamp(1.7rem,4vw,2.5rem)] font-medium leading-tight tracking-[-0.01em] text-[color:var(--color-ink)]`}>
                Your patients moved to AI. Most clinics haven&apos;t noticed.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROBLEMS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-3xl border border-black/[0.06] bg-[color:var(--color-paper)] p-7"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-pine)]/[0.08] text-[color:var(--color-pine)]">
                      <Icon />
                    </div>
                    <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                      {p.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <ScrollCta label="See where your clinic stands" />
            </div>
          </div>
        </section>

        {/* ===================== WHAT THE REPORT SHOWS ===================== */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
                Your free report
              </div>
              <h2 className={`mt-4 ${serif} text-[clamp(1.7rem,4vw,2.5rem)] font-medium leading-tight tracking-[-0.01em] text-[color:var(--color-ink)]`}>
                Exactly where your clinic stands inside AI search
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                A plain-English snapshot of how visible your clinic is when patients ask AI who to
                trust, and the quickest, compliant ways to start being recommended.
              </p>
            </div>

            <ul className="space-y-4 rounded-3xl border border-black/[0.06] bg-[color:var(--color-paper-2)] p-7 sm:p-8">
              {REPORT_BULLETS.map((b) => (
                <li key={b} className="flex gap-3.5">
                  <Check />
                  <span className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================= HOW IT WORKS ========================= */}
        <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="flex flex-col items-center text-center">
              <span className="text-[color:var(--color-pine)]">
                <IconSparkle className="h-6 w-6" />
              </span>
              <h2 className={`mt-4 ${serif} text-[clamp(1.7rem,4vw,2.5rem)] font-medium leading-tight tracking-[-0.01em] text-[color:var(--color-ink)]`}>
                How it works
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-3xl border border-black/[0.06] bg-[color:var(--color-paper)] p-7">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--color-pine)] text-lg font-bold text-[color:var(--color-paper)]">
                    {s.n}
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-[color:var(--color-ink)]">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <ScrollCta label="Get my free AI Visibility Report" />
            </div>
          </div>
        </section>

        {/* ==================== PROOF / COMPLIANCE ==================== */}
        <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
          <p className={`mx-auto max-w-2xl ${serif} text-[clamp(1.4rem,3.4vw,2.05rem)] font-medium leading-snug tracking-[-0.01em] text-[color:var(--color-ink)]`}>
            There are over 5,500 Botox clinics in the UK and the market is growing more than 20% a
            year. The clinics that win aren't the loudest.{" "}
            <span className="italic font-normal text-[color:var(--color-pine)]">
              They're the ones AI recommends.
            </span>
          </p>

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[color:var(--color-pine)]/20 bg-[color:var(--color-pine)]/[0.05] p-6 sm:p-7">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
              Compliant by design
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
              Being recommended by AI isn't advertising, so there's no ASA or MHRA risk. It's the
              modern version of word-of-mouth, and it's the one growth channel that's still wide open
              to aesthetic clinics. Built by DomiSearch, a Google Partner search agency.
            </p>
          </div>
        </section>

        {/* ==================== WHY CLINICS TRUST US ==================== */}
        <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
            <h2 className={`${serif} text-[clamp(1.7rem,4vw,2.5rem)] font-medium leading-tight tracking-[-0.01em] text-[color:var(--color-ink)]`}>
              Why clinics trust DomiSearch with this
            </h2>

            <div className="mt-6 flex justify-center">
              <Stars />
            </div>

            <ul className="mx-auto mt-10 max-w-2xl space-y-4 text-left">
              {[
                "A Google Partner agency - the same rigour we apply to ad accounts, applied to AI visibility.",
                "Built for UK aesthetics: every prompt reflects how real patients ask, every fix checked against ASA and MHRA rules.",
                "No guesswork - we show you which engines name you, which name your rivals, and the gaps to close first.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-px shrink-0 font-semibold text-[color:var(--color-pine)]">
                    →
                  </span>
                  <span className="text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">{t}</span>
                </li>
              ))}
            </ul>

            <p className={`mx-auto mt-10 max-w-xl ${serif} text-[clamp(1.15rem,2.6vw,1.5rem)] font-medium leading-snug text-[color:var(--color-ink)]`}>
              The agency clinics trust to get them recommended,{" "}
              <span className="italic font-normal text-[color:var(--color-pine)]">compliantly.</span>
            </p>
          </div>
        </section>

        {/* ========================= FINAL CTA ========================= */}
        <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <h2 className={`mx-auto max-w-2xl text-balance ${serif} text-[clamp(1.9rem,4.8vw,2.9rem)] font-medium leading-[1.12] tracking-[-0.01em]`}>
              See if AI is sending patients to you, or{" "}
              <span className="italic font-normal">your competitor</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-paper)]/70">
              Get your free AI Visibility Report and see exactly where your clinic stands. It takes
              ten seconds to start.
            </p>
            <div className="mt-9">
              <DomainCaptureForm id="domain-final" placeholder="yourclinic.com" />
            </div>
          </div>
        </section>

        {/* ===================== Minimal footer ====================== */}
        <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]/55">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 px-6 py-7 text-[13px] sm:flex-row">
            <span>© {new Date().getFullYear()} DomiSearch · Search Growth Partner</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="text-[color:var(--color-paper)]/55 underline-offset-4 hover:text-[color:var(--color-paper)] hover:underline"
            >
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </ReportFunnelProvider>
  );
}
