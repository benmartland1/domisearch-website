"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { MagneticButton } from "./MagneticButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[color:color-mix(in_oklab,var(--color-charcoal)_78%,transparent)] border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" aria-label="DomiSearch home" className="flex items-center gap-2">
          <Image
            src="/brand/logo.png"
            alt="DomiSearch"
            width={178}
            height={28}
            priority
            className="logo-mark h-[22px] w-auto sm:h-7"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link text-sm font-medium transition-colors hover:text-[color:var(--color-domigreen)] ${
                  active ? "text-[color:var(--color-domigreen)]" : "text-[color:var(--color-fog)]"
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
            className="btn btn-primary"
          >
            Book a call
            <span aria-hidden>→</span>
          </MagneticButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3 w-[18px]">
            <span
              className={`absolute left-0 block h-px w-[18px] bg-[color:var(--color-glacier)] transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-[18px] -translate-y-1/2 bg-[color:var(--color-glacier)] transition-opacity duration-200 ease-out ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-[18px] bg-[color:var(--color-glacier)] transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`grid overflow-hidden border-white/5 bg-[color:var(--color-charcoal)] transition-[grid-template-rows,opacity,border-top-width] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-[color:var(--color-glacier)] hover:text-[color:var(--color-domigreen)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={site.calendly}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2 justify-center gap-2"
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
