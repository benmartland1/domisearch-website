"use client";

import { useEffect, useState } from "react";
import { DomiMark } from "@/components/landing/DomiMark";

/**
 * Floating pill nav for the recruitment vertical page. The global site header
 * is dark and links away to everything; this page is cream and single-purpose,
 * so it carries its own light chrome with section anchors only.
 */
const LINKS = [
  { label: "The problem", href: "#problem" },
  { label: "How it works", href: "#system" },
  { label: "Proof", href: "#proof" },
  { label: "Pricing", href: "#pricing" },
];

export function VerticalNav({
  calendly,
  territories,
}: {
  calendly: string;
  /** Capacity counter, mirroring the "54/60 clients" scarcity pattern. Omitted
   *  entirely while the territory data is still placeholder. */
  territories?: { taken: number; total: number };
}) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2.5 transition-all duration-300 sm:px-4 ${
          solid
            ? "border border-black/[0.07] bg-white/85 shadow-[0_10px_36px_-20px_rgba(20,17,13,0.45)] backdrop-blur-md"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <DomiMark className="h-6 w-6" />
          <span className="text-[14px] font-bold tracking-tight text-[color:var(--color-ink)]">
            DomiSearch
          </span>
        </a>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-[color:var(--color-ink-2)] transition-colors hover:bg-black/[0.04] hover:text-[color:var(--color-ink)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {territories ? (
            <span className="hidden text-right text-[11px] leading-tight text-[color:var(--color-ink-3)] sm:block">
              <span className="font-bold text-[color:var(--color-pine)]">
                {territories.taken} of {territories.total}
              </span>{" "}
              territories held
              <br />
              Manchester based, UK-wide
            </span>
          ) : (
            <span className="hidden text-right text-[11px] leading-tight text-[color:var(--color-ink-3)] sm:block">
              Manchester based
              <br />
              Google &amp; Shopify Partner
            </span>
          )}
          <a
            href={calendly}
            target="_blank"
            rel="noopener"
            className="shrink-0 rounded-full bg-[color:var(--color-ink)] px-4 py-2.5 text-[13px] font-bold tracking-tight text-[color:var(--color-paper)] transition-all duration-200 hover:-translate-y-px hover:bg-[color:var(--color-domigreen)] hover:text-[color:var(--color-charcoal)] motion-reduce:transition-none"
          >
            Book a call
          </a>
        </div>
      </nav>
    </div>
  );
}
