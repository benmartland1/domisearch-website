import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { ScrollReveal } from "./ScrollReveal";
import { site } from "@/lib/site";
import { AEO_PRICING, aeoUpfrontEffectiveMonthly, aeoUpfrontSaving, gbp } from "@/lib/pricing";

/*
 * The AI search programme, two ways to pay. Google Ads is deliberately not
 * priced here or anywhere else on the site: it is scoped on a call.
 */
const included = [
  "AI visibility and competitor baseline across ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews",
  "Buyer-question and cited-source research",
  "Technical foundations and structured data",
  "Service-page improvements",
  "36 new or refreshed content pieces in the first 90 days, approved by you",
  "Daily tracking of the agreed questions, monthly report and strategy call",
];

const options = [
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Start, review at 90 days, continue month to month.",
    price: gbp(AEO_PRICING.monthly),
    cadence: "per month",
    term: `${AEO_PRICING.minimumMonths}-month minimum term (${AEO_PRICING.recommendedMonths} recommended), then rolling monthly.`,
    highlight: false,
  },
  {
    id: "upfront",
    name: `${AEO_PRICING.upfrontMonths} months upfront`,
    tagline: "The first programme paid in one go.",
    price: gbp(AEO_PRICING.upfront),
    cadence: "one payment",
    term: `${gbp(aeoUpfrontEffectiveMonthly)} a month effective rate for the first ${AEO_PRICING.upfrontMonths} months, then rolling monthly at the standard rate.`,
    highlight: true,
    badge: `Save ${gbp(aeoUpfrontSaving)}`,
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
      className={`mt-[3px] shrink-0 ${muted ? "text-[color:var(--color-muted)]" : "text-[color:var(--color-forest)]"}`}
    >
      <path d="M3.5 9.5l3.2 3.2 7.8-7.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      {/* What the programme includes */}
      <ScrollReveal>
        <div className="card h-full p-8 sm:p-10">
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-forest)]">
            AI search visibility programme
          </div>
          <h2 className="display mt-4 text-3xl sm:text-4xl">One programme. Two ways to pay.</h2>
          <p className="mt-4 text-[color:var(--color-muted)]">
            Every client gets the same programme, scoped to their services and markets. The
            price covers one business; additional territories or group companies are agreed on
            the call.
          </p>
          <div className="hairline mt-8" />
          <ul className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-[color:var(--color-muted)]">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <Check />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-[color:var(--color-muted)]">
            Not included: ad spend of any kind, third-party tools you already pay for, and any
            outreach, original research or paid placements, which are scoped separately if they
            are relevant.
          </p>
        </div>
      </ScrollReveal>

      {/* The two billing options */}
      <div className="grid gap-6">
        {options.map((o, idx) => (
          <ScrollReveal key={o.id} delay={idx * 100}>
            <div
              className={`relative flex h-full flex-col rounded-[1.5rem] border p-8 transition-colors ${
                o.highlight
                  ? "border-[color:var(--color-forest)]/40 bg-[color:color-mix(in_oklab,var(--color-domigreen)_6%,transparent)]"
                  : "border-[color:var(--color-line)] bg-white hover:border-[color:var(--color-ink)]"
              }`}
            >
              {o.highlight && o.badge && (
                <span className="absolute left-8 top-0 -translate-y-1/2 rounded-full border border-[color:var(--color-forest)]/40 bg-[color:var(--color-paper)] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-forest)]">
                  {o.badge}
                </span>
              )}
              <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
                {o.name}
              </div>
              <p className="mt-3 text-sm text-[color:var(--color-muted)]">{o.tagline}</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span
                  className={`display leading-none text-[3rem] sm:text-[3.5rem] ${
                    o.highlight ? "text-[color:var(--color-forest)]" : "text-[color:var(--color-ink)]"
                  }`}
                >
                  {o.price}
                </span>
                <span className="text-sm text-[color:var(--color-muted)]">{o.cadence}</span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[color:var(--color-muted)]">{o.term}</p>
              <div className="mt-8">
                <Link
                  href={site.calendly}
                  target="_blank"
                  rel="noopener"
                  className={`btn w-full justify-center ${o.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  Book a discovery call
                  <span aria-hidden><ArrowRight /></span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
