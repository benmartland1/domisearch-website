import type { Metadata } from "next";
import Image from "next/image";
import { DomiMark } from "@/components/landing/DomiMark";
import { EngineStrip } from "@/components/landing/EngineStrip";
import { RoadmapMockup } from "@/components/landing/RoadmapMockup";
import { RoadmapCheckout } from "@/components/landing/RoadmapCheckout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The £99 AI Visibility Roadmap · DomiSearch",
  description:
    "The 90-day plan to become the brand AI recommends across ChatGPT, Google AI, Perplexity and Gemini. The same process we run for clients - yours for £99.",
  alternates: { canonical: "/ai-visibility-roadmap" },
  openGraph: {
    title: "The £99 AI Visibility Roadmap",
    description:
      "The 90-day plan to become the brand AI recommends. Delivered within 24 hours, yours to keep.",
    url: `${site.url}/ai-visibility-roadmap`,
  },
};

const PROOF_LOGOS = [
  { name: "Taxd", src: "/clients/taxd.png" },
  { name: "Rooftop Saunas", src: "/clients/rooftop_saunas.png" },
  { name: "Fueled", src: "/clients/fueled.png" },
  { name: "Netil360", src: "/clients/netil360.png" },
  { name: "Garside Waddingham", src: "/clients/garside_waddingham.png" },
];

const PROBLEMS = [
  {
    title: "Buyers ask AI now - not just Google",
    body: "People type “best accountant in Manchester” or “which CRM should I use” straight into ChatGPT, Perplexity and Google’s AI - and act on whatever it tells them.",
  },
  {
    title: "Most brands are invisible in the answer",
    body: "These tools name only a handful of brands per response. If you’re not one of them, you simply don’t exist at the moment the buyer is deciding.",
  },
  {
    title: "The winner is picked before the click",
    body: "The brand the AI recommends gets the trust, the visit and the sale - often before the buyer ever reaches a single website. Your competitor wins by default.",
  },
];

const STEPS = [
  { n: "1", title: "Enter your domain + pay £99", body: "Secure Stripe checkout. Takes under a minute, no account needed." },
  { n: "2", title: "We build your roadmap", body: "We run live AI visibility tracking across every engine and turn it into your prioritised 90-day plan." },
  { n: "3", title: "Get your roadmap within 24 hours", body: "Your full roadmap PDF lands in your inbox - plus an optional call to walk through it." },
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px]",
};
function IconGauge() {
  return (
    <svg {...iconProps}>
      <path d="M4 15.5a8 8 0 0 1 16 0" />
      <path d="M12 15.5l3.8-3" />
    </svg>
  );
}
function IconAudit() {
  return (
    <svg {...iconProps}>
      <path d="M6.5 3.5h7l4 4v13h-11z" />
      <path d="M13.5 3.5v4h4" />
      <path d="M9.5 12h5M9.5 15.5h5" />
    </svg>
  );
}
function IconContent() {
  return (
    <svg {...iconProps}>
      <path d="M12 4.2l1.9 5.9 5.9 1.9-5.9 1.9L12 19.8l-1.9-5.9L4.2 12l5.9-1.9z" />
    </svg>
  );
}
function IconRoadmap() {
  return (
    <svg {...iconProps}>
      <path d="M6 19V7a3 3 0 0 1 3-3 3 3 0 0 1 3 3v10a3 3 0 0 0 3 3 3 3 0 0 0 3-3" />
      <circle cx="6" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const VALUE_STACK = [
  { icon: IconGauge, title: "Visibility score", sub: "across every engine" },
  { icon: IconAudit, title: "Full technical audit", sub: "the fixes, prioritised" },
  { icon: IconContent, title: "Content opportunities", sub: "the questions you’re missing" },
  { icon: IconRoadmap, title: "Phased 90-day plan", sub: "what to do, in order" },
];

function TrustpilotCue({ align = "start" }: { align?: "start" | "center" }) {
  return (
    <div className={align === "center" ? "flex justify-center" : "flex justify-center lg:justify-start"}>
      <a
        href={site.trustpilot}
        target="_blank"
        rel="noopener"
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/70 px-3.5 py-1.5 text-sm text-[color:var(--color-ink-2)] transition-colors hover:text-[color:var(--color-ink)]"
      >
        <span className="flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="#00b67a">
              <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 9.5l6.9-.6z" />
            </svg>
          ))}
        </span>
        <span className="font-semibold">Rated 5 stars on Trustpilot</span>
      </a>
    </div>
  );
}

export default function AiVisibilityRoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]">
      {/* Minimal brand bar - no nav, no links */}
      <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
        <DomiMark className="h-7 w-7" />
        <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">DomiSearch</span>
        <span className="ml-2 hidden border-l border-black/15 pl-2.5 text-[13px] text-[color:var(--color-ink-3)] sm:inline">
          Search Growth Partner
        </span>
      </div>

      {/* ============================ HERO ============================ */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-backdrop-light" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-6 sm:pt-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Left: headline / value / CTA */}
            <div className="text-center lg:text-left">
              <TrustpilotCue />

              <h1 className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(2.1rem,5.6vw,3.05rem)] font-bold leading-[1.06] tracking-tight text-[color:var(--color-ink)] lg:mx-0">
                The 90-day plan to become the brand{" "}
                <span className="text-[color:var(--color-pine)]">AI recommends.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[color:var(--color-ink-2)] sm:text-lg lg:mx-0">
                Get the exact 90-day roadmap to become the brand AI recommends. The same process we
                run for our clients - yours for £99.
              </p>

              {/* Value stack surfaced on the page - tight 2x2 */}
              <div className="mx-auto mt-7 grid max-w-xl auto-rows-fr grid-cols-2 gap-2.5 lg:mx-0">
                {VALUE_STACK.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.title} className="flex h-full items-start gap-3 rounded-xl border border-black/[0.06] bg-white/70 p-3.5 text-left">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-pine)]/[0.08] text-[color:var(--color-pine)]">
                        <Icon />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold leading-snug text-[color:var(--color-ink)]">{v.title}</div>
                        <div className="mt-1 text-[12px] leading-snug text-[color:var(--color-ink-3)]">{v.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price anchor pulled up next to the CTA */}
              <p className="mt-7 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
                Agencies charge <span className="text-[color:var(--color-ink-3)] line-through">£1,000+</span> for
                an audit like this - yours is <span className="font-bold text-[color:var(--color-pine)]">£99</span>.
              </p>

              <div className="mt-4 space-y-3">
                <RoadmapCheckout id="checkout-hero" />
                <p className="text-sm text-[color:var(--color-ink-3)]">
                  Delivered within 24 hours · Yours to keep
                </p>
              </div>
            </div>

            {/* Right: floating roadmap document */}
            <div className="mt-2 lg:mt-0">
              <RoadmapMockup />
            </div>
          </div>

          <div className="mt-14">
            <EngineStrip label="We check every engine your buyers ask" animated />
          </div>
        </div>
      </section>

      {/* ===================== SEARCH HAS CHANGED ===================== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-center text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
            Search has quietly changed. Most brands haven&apos;t noticed yet.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-black/[0.07] bg-[color:var(--color-paper)] p-7">
                <h3 className="text-lg font-bold tracking-tight text-[color:var(--color-ink)]">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROOF ===================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
        <p className="mx-auto max-w-2xl text-[clamp(1.3rem,3.2vw,1.9rem)] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
          Taxd went from invisible to{" "}
          <span className="text-[color:var(--color-pine)]">200+ AI mentions a month</span> across ChatGPT,
          Claude, Perplexity and Gemini.
        </p>
        <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-3)]">
          Trusted by brands like
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PROOF_LOGOS.map((logo) => (
            <Image key={logo.name} src={logo.src} alt={logo.name} width={132} height={40}
              className="h-7 w-auto opacity-70 brightness-0 sm:h-8" />
          ))}
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="border-y border-black/[0.06] bg-[color:var(--color-paper-2)]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="text-center text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-tight text-[color:var(--color-ink)]">
            How it works
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-black/[0.07] bg-[color:var(--color-paper)] p-7">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--color-pine)] text-lg font-bold text-[color:var(--color-paper)]">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-[color:var(--color-ink)]">{s.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="mx-auto max-w-2xl text-balance text-[clamp(1.8rem,4.6vw,2.8rem)] font-bold leading-[1.1] tracking-tight">
            Get your 90-day roadmap to becoming the recommended answer
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-paper)]/70">
            Agencies charge £1,000+. Yours is £99 - one payment, delivered within 24 hours, yours to keep.
          </p>
          <div className="mx-auto mt-9 max-w-md space-y-4 rounded-3xl bg-white/[0.04] p-6 sm:p-7">
            <RoadmapCheckout id="checkout-final" />
            <p className="text-sm text-[color:var(--color-paper)]/55">
              Delivered within 24 hours · Yours to keep
            </p>
          </div>
        </div>
      </section>

      {/* ===================== Footer ===================== */}
      <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)]/55">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 px-6 py-7 text-[13px] sm:flex-row">
          <span>© {new Date().getFullYear()} DomiSearch · Search Growth Partner</span>
          <a href="/privacy" target="_blank" rel="noopener"
            className="text-[color:var(--color-paper)]/55 underline-offset-4 hover:text-[color:var(--color-paper)] hover:underline">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
