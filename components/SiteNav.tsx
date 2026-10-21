"use client";

import Image from "next/image";
import { ArrowUpRight, Menu } from "@/components/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { MobileSectors, SectorsMenu } from "./SectorsMenu";

/**
 * The site navigation, in the approved design: logo lockup with the solid
 * green ring, the site links with the Sectors dropdown, and the visibility
 * review button. Used on every page, including the sector landing pages.
 */
const CTA = { label: "Get a visibility review", href: "/#visibility-check" };

export function SiteNav() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => menu.current?.removeAttribute("open"), [pathname]);

  const links = site.nav;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="ds-navbar ds-wrap">
      <Link className="ds-brand-link" href="/" aria-label="DomiSearch homepage">
        {/* The dark logo asset as supplied, with its own coloured ring. */}
        <Image className="ds-logo ds-logo-dark" src="/brand/logo-dark.png" alt="DomiSearch" width={155} height={24} priority />
      </Link>

      <nav className="ds-navlinks" aria-label="Main navigation">
        {links.map((item) =>
          "sectors" in item ? (
            <SectorsMenu key={item.label} label={item.label} tone="light" />
          ) : (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              style={isActive(item.href) ? { textDecoration: "underline", textUnderlineOffset: 5 } : undefined}
            >
              {item.label}
            </Link>
          ),
        )}
        <Link className="ds-button" href={CTA.href}>
          {CTA.label} <span className="ds-arrow"><ArrowUpRight /></span>
        </Link>
      </nav>

      <details className="ds-mobile-nav" ref={menu}>
        <summary>
          Menu <span className="ds-arrow"><Menu size={18} /></span>
        </summary>
        <nav className="ds-mobile-menu" aria-label="Mobile navigation">
          {links.map((item) =>
            "sectors" in item ? (
              <MobileSectors
                key={item.label}
                label={item.label}
                tone="light"
                onNavigate={() => menu.current?.removeAttribute("open")}
              />
            ) : (
              <Link key={item.href} href={item.href} onClick={() => menu.current?.removeAttribute("open")}>
                {item.label}
              </Link>
            ),
          )}
          <Link href={CTA.href} onClick={() => menu.current?.removeAttribute("open")}>
            {CTA.label} <ArrowUpRight />
          </Link>
        </nav>
      </details>
    </header>
  );
}
