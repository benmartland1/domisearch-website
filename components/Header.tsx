"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { isPaperRoute } from "@/lib/surfaces";
import { MagneticButton } from "./MagneticButton";
import { MobileSectors, SectorsMenu } from "./SectorsMenu";

/**
 * The global header. On the dark site it is the glacier-on-charcoal bar; on
 * paper routes (see lib/surfaces.ts) the same bar switches to ink on paper,
 * with the recoloured logo, so the homepage and the dark inner pages share one
 * nav rather than two.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const light = isPaperRoute(pathname);
  const tone = light ? "light" : "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const bar = scrolled
    ? light
      ? "backdrop-blur-xl bg-[color:color-mix(in_oklab,var(--color-paper)_86%,transparent)] border-b border-black/[0.06]"
      : "backdrop-blur-xl bg-[color:color-mix(in_oklab,var(--color-charcoal)_78%,transparent)] border-b border-white/5"
    : "bg-transparent";

  const line = light ? "bg-[color:var(--color-ink)]" : "bg-[color:var(--color-glacier)]";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${bar}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" aria-label="DomiSearch home" className="flex items-center gap-2">
          <Image
            src={light ? "/brand/logo-dark.png" : "/brand/logo.png"}
            alt="DomiSearch"
            width={178}
            height={28}
            priority
            className="logo-mark h-[22px] w-auto sm:h-7"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => {
            if ("sectors" in item) return <SectorsMenu key={item.label} label={item.label} tone={tone} />;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link text-sm font-medium transition-colors ${
                  light
                    ? `hover:text-[color:var(--color-pine)] ${
                        active ? "text-[color:var(--color-pine)]" : "text-[color:var(--color-ink-2)]"
                      }`
                    : `hover:text-[color:var(--color-domigreen)] ${
                        active ? "text-[color:var(--color-domigreen)]" : "text-[color:var(--color-fog)]"
                      }`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton
            href={site.calendly}
            target="_blank"
            rel="noopener"
            className={
              light
                ? "inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-2.5 text-[14px] font-bold tracking-tight text-[color:var(--color-paper)] transition-colors hover:bg-[color:var(--color-domigreen)] hover:text-[color:var(--color-charcoal)]"
                : "btn btn-primary"
            }
          >
            Book a call
            <span aria-hidden>→</span>
          </MagneticButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          className={`relative grid h-10 w-10 place-items-center rounded-full border lg:hidden ${
            light ? "border-black/[0.1] bg-white/60" : "border-white/10"
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3 w-[18px]">
            <span
              className={`absolute left-0 block h-px w-[18px] ${line} transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-[18px] -translate-y-1/2 ${line} transition-opacity duration-200 ease-out ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-[18px] ${line} transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity,border-top-width] duration-300 ease-out lg:hidden ${
          light ? "border-black/[0.06] bg-[color:var(--color-paper)]" : "border-white/5 bg-[color:var(--color-charcoal)]"
        } ${open ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {site.nav.map((item) =>
              "sectors" in item ? (
                <MobileSectors key={item.label} label={item.label} tone={tone} onNavigate={() => setOpen(false)} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base ${
                    light
                      ? "text-[color:var(--color-ink)] hover:text-[color:var(--color-pine)]"
                      : "text-[color:var(--color-glacier)] hover:text-[color:var(--color-domigreen)]"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href={site.calendly}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className={
                light
                  ? "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-3 text-[15px] font-bold text-[color:var(--color-paper)]"
                  : "btn btn-primary mt-2 justify-center gap-2"
              }
            >
              Book a call
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
