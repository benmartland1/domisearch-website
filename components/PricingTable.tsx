"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { site } from "@/lib/site";

type Tier = {
  name: string;
  tagline?: string;
  price: number;
  recommended?: boolean;
  features: string[];
  cta: { label: string; href: string; external?: boolean };
};

const tiers: Tier[] = [
  {
    name: "Google Ads",
    tagline: "Demand that exists today.",
    price: 1500,
    features: [
      "AI-assisted daily account monitoring",
      "Human-led strategy and optimisation",
      "Campaign management across all active campaigns",
      "Monthly performance report and strategy call",
    ],
    cta: { label: "Book a call", href: site.calendly, external: true },
  },
  {
    name: "Search Revenue Ownership",
    tagline: "Both channels, one strategy.",
    price: 3950,
    recommended: true,
    features: [
      "Everything in both services",
      "Unified strategy across both channels",
      "Single monthly report covering Google Ads and AI visibility",
    ],
    cta: { label: "Book a call", href: site.calendly, external: true },
  },
  {
    name: "AEO / AI Search",
    tagline: "Demand forming inside AI.",
    price: 2950,
    features: [
      "Full AI visibility audit",
      "Technical implementation — schema, llms.txt, entity clarity",
      "Monthly AI-citable content production",
      "Monthly visibility monitoring across ChatGPT, Claude and Perplexity",
    ],
    cta: { label: "Book a call", href: site.calendly, external: true },
  },
];

function Check({ muted = false }: { muted?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={`mt-[3px] shrink-0 ${muted ? "text-[color:var(--color-fog)]/60" : "text-[color:var(--color-domigreen)]"}`}
    >
      <path
        d="M3.5 9.5l3.2 3.2 7.8-7.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingTable() {
  return (
    <div className="relative grid items-stretch gap-6 lg:grid-cols-3 lg:gap-5">
      {tiers.map((tier, idx) => {
        const rec = !!tier.recommended;
        return (
          <ScrollReveal key={tier.name} delay={idx * 100}>
            <div
              className={`relative flex h-full flex-col rounded-[1.5rem] border p-8 transition-colors sm:p-10 ${
                rec
                  ? "border-[color:var(--color-domigreen)]/50 bg-[color:color-mix(in_oklab,var(--color-domigreen)_6%,transparent)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {rec && (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-10 -z-10 rounded-[2.5rem] opacity-70"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--color-domigreen) 35%, transparent), transparent 65%)",
                      filter: "blur(40px)",
                    }}
                  />
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-domigreen)]/50 bg-[color:var(--color-charcoal)] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                    ★ Recommended
                  </span>
                </>
              )}

              <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-fog)]/65">
                {tier.name}
              </div>

              {tier.tagline && (
                <p className="mt-3 text-sm text-[color:var(--color-fog)]/75">
                  {tier.tagline}
                </p>
              )}

              <div className="mt-10">
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--color-fog)]/55">
                  From
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className={`display leading-none text-[3.25rem] sm:text-[3.75rem] ${
                      rec
                        ? "text-[color:var(--color-domigreen)]"
                        : "text-[color:var(--color-glacier)]"
                    }`}
                  >
                    £{tier.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-[color:var(--color-fog)]/70">
                    / month
                  </span>
                </div>
              </div>

              <div className="hairline mt-10" />

              <ul className="mt-8 flex-1 space-y-4 text-[0.95rem] leading-relaxed text-[color:var(--color-fog)]/90">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check muted={!rec} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link
                  href={tier.cta.href}
                  target={tier.cta.external ? "_blank" : undefined}
                  rel={tier.cta.external ? "noopener" : undefined}
                  className={`btn w-full justify-center ${rec ? "btn-primary" : "btn-ghost"}`}
                >
                  {tier.cta.label}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
