"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DomiMark } from "@/components/landing/DomiMark";
import { MobileSectors, SectorsMenu } from "@/components/SectorsMenu";
import { site } from "@/lib/site";

/**
 * Floating pill nav for the sector pages. The pages are cream, so the dark
 * global header would clash; this is the same site nav (same links, same
 * Sectors dropdown) in the light palette, so a visitor can move between
 * sectors and back to the main site without the page changing character.
 */
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2.5 transition-all duration-300 sm:px-4 ${
          solid || open
            ? "border border-black/[0.07] bg-white/85 shadow-[0_10px_36px_-20px_rgba(20,17,13,0.45)] backdrop-blur-md"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link href="/" aria-label="DomiSearch home" className="flex shrink-0 items-center gap-2">
          <DomiMark className="h-6 w-6" />
          <span className="text-[14px] font-bold tracking-tight text-[color:var(--color-ink)]">
            DomiSearch
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {site.nav.map((item) =>
            "sectors" in item ? (
              <SectorsMenu key={item.label} label={item.label} tone="light" />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-[color:var(--color-ink-2)] transition-colors hover:bg-black/[0.04] hover:text-[color:var(--color-ink)]"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {territories ? (
            <span className="hidden text-right text-[11px] leading-tight text-[color:var(--color-ink-3)] xl:block">
              <span className="font-bold text-[color:var(--color-pine)]">
                {territories.taken} of {territories.total}
              </span>{" "}
              territories held
              <br />
              Manchester based, UK-wide
            </span>
          ) : null}
          <a
            href={calendly}
            target="_blank"
            rel="noopener"
            className="shrink-0 rounded-full bg-[color:var(--color-ink)] px-4 py-2.5 text-[13px] font-bold tracking-tight text-[color:var(--color-paper)] transition-all duration-200 hover:-translate-y-px hover:bg-[color:var(--color-domigreen)] hover:text-[color:var(--color-charcoal)] motion-reduce:transition-none"
          >
            Book a call
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="vertical-mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/[0.1] bg-white/60 lg:hidden"
          >
            <span className="relative block h-3 w-[18px]">
              <span
                className={`absolute left-0 block h-px w-[18px] bg-[color:var(--color-ink)] transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-[18px] -translate-y-1/2 bg-[color:var(--color-ink)] transition-opacity duration-200 ease-out ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-[18px] bg-[color:var(--color-ink)] transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu: a card floating under the pill, so opening it never
          pushes the page down. */}
      <div
        id="vertical-mobile-nav"
        inert={!open}
        className={`absolute inset-x-3 top-full mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out sm:inset-x-5 lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white shadow-[0_24px_50px_-24px_rgba(20,17,13,0.45)]">
          <nav className="flex flex-col px-5 py-3">
            {site.nav.map((item) =>
              "sectors" in item ? (
                <MobileSectors
                  key={item.label}
                  label={item.label}
                  tone="light"
                  onNavigate={() => setOpen(false)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base text-[color:var(--color-ink)] hover:text-[color:var(--color-pine)]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
