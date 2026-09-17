"use client";

import { useState } from "react";
import { Cta } from "./Cta";
import { MobileCollapse } from "./Mobile";

/**
 * The single programme card on the vertical pages: what it costs on the left,
 * what you get on the right, full width of the pricing container.
 *
 * Every vertical sells the same programme at the same price, so the billing
 * options live here rather than on each page. Only the price and term copy
 * change with the toggle; the rest of the card stays put.
 */

export type PricingPlan = {
  name: string;
  /** Rendered as a pill floating over the card's top edge, not inside it. */
  label: string;
  tagline: string;
  blocks: readonly { heading: string; items: readonly string[] }[];
  /** The exclusivity note under the price. */
  territory: string;
};

const MONTHLY = 2995;
const UPFRONT = 7500;
const UPFRONT_MONTHS = 3;

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

/** Derived, so the saving and effective rate can never disagree with the prices. */
const BILLING = [
  {
    id: "monthly",
    tab: "Monthly",
    price: gbp(MONTHLY),
    cadence: "per month",
    save: null,
    term: "3 month minimum term (6 recommended), then rolling monthly",
  },
  {
    id: "upfront",
    tab: `${UPFRONT_MONTHS} months upfront`,
    price: gbp(UPFRONT),
    cadence: "one payment",
    save: `Save ${gbp(MONTHLY * UPFRONT_MONTHS - UPFRONT)} vs monthly`,
    term: `${gbp(UPFRONT / UPFRONT_MONTHS)}/mo effective rate, then rolling monthly after`,
  },
] as const;

type BillingId = (typeof BILLING)[number]["id"];

export function PricingCard({ plan, href }: { plan: PricingPlan; href: string }) {
  const [billing, setBilling] = useState<BillingId>("monthly");
  const upfront = billing === "upfront";

  return (
    /* Not overflow-hidden: the floating label hangs past the top edge. */
    <div className="relative rounded-2xl border-2 border-[color:var(--color-domigreen)] bg-white p-6 shadow-[0_34px_70px_-30px_rgba(1,232,144,0.45)] sm:p-10">
      <span className="absolute left-6 top-0 inline-flex max-w-[calc(100%-3rem)] -translate-y-1/2 items-center rounded-full bg-[color:var(--color-domigreen)] px-3.5 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.16em] text-[color:var(--color-charcoal)] shadow-[0_6px_18px_-6px_rgba(1,232,144,0.9)] sm:left-10">
        {plan.label}
      </span>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-0">
        {/* ---- What it costs ---- */}
        <div className="flex flex-col lg:pr-12">
          <h3 className="mt-2 text-[19px] font-bold tracking-tight text-[color:var(--color-ink)] sm:mt-0 sm:text-[21px]">
            {plan.name}
          </h3>

          {/* Equal-width tabs so the indicator can slide a fixed half-width. */}
          <div
            role="group"
            aria-label="Billing"
            className="relative mt-5 grid w-full max-w-[20rem] grid-cols-2 rounded-full bg-black/[0.05] p-1"
          >
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[color:var(--color-ink)] shadow-[0_6px_16px_-8px_rgba(20,17,13,0.6)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                upfront ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {BILLING.map((b) => {
              const active = b.id === billing;
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBilling(b.id)}
                  className={`relative z-10 cursor-pointer rounded-full px-3 py-2 text-[13px] font-bold tracking-tight transition-colors duration-300 ${
                    active
                      ? "text-[color:var(--color-paper)]"
                      : "text-[color:var(--color-ink-2)] hover:text-[color:var(--color-ink)]"
                  }`}
                >
                  {b.tab}
                </button>
              );
            })}
          </div>

          {/* Both options share one grid cell, so the card is always as tall as
              the longer one and toggling never shifts the layout below it. */}
          <div className="mt-6 grid" aria-live="polite">
            {BILLING.map((b) => {
              const active = b.id === billing;
              return (
                <div
                  key={b.id}
                  aria-hidden={!active}
                  className={`[grid-area:1/1] transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
                    active ? "visible translate-y-0 opacity-100" : "invisible translate-y-1.5 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-[clamp(2.6rem,6vw,3.4rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--color-ink)]">
                      {b.price}
                    </span>
                    <span className="text-[14px] font-semibold text-[color:var(--color-ink-3)]">
                      {b.cadence}
                    </span>
                  </div>
                  {b.save ? (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-domigreen)]/15 px-3 py-1 text-[13px] font-bold tracking-tight text-[color:var(--color-pine)]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                      {b.save}
                    </p>
                  ) : null}
                  <p className="mt-2.5 text-[12px] font-semibold text-[color:var(--color-ink-3)]">
                    {b.term}
                  </p>
                </div>
              );
            })}
          </div>

          <div aria-hidden className="mt-6 border-t border-black/[0.07]" />

          <p className="mt-5 text-[16px] font-bold leading-snug tracking-tight text-[color:var(--color-pine)]">
            {plan.tagline}
          </p>
          <p className="mt-4 rounded-xl bg-[color:var(--color-pine)]/[0.08] px-3.5 py-3 text-[13px] font-semibold leading-relaxed text-[color:var(--color-pine)]">
            {plan.territory}
          </p>

          <div aria-hidden className="hidden grow lg:block" />
          <Cta href={href} className="mt-7 w-full" />
        </div>

        {/* ---- What you get ---- */}
        <div className="border-t border-black/[0.07] pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <MobileCollapse label="See what&apos;s included" closeLabel="Hide details">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              {plan.blocks.map((block) => (
                <div key={block.heading}>
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-3)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-domigreen)]"
                    />
                    {block.heading}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {block.items.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2.5 text-[14px] leading-[1.45] text-[color:var(--color-ink-2)]"
                      >
                        <span
                          aria-hidden
                          className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[color:var(--color-domigreen)]/15"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-[11px] w-[11px] text-[color:var(--color-pine)]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MobileCollapse>
        </div>
      </div>
    </div>
  );
}
