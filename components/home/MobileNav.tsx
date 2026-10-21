"use client";

import { useRef } from "react";

export type NavLink = { label: string; href: string };

/** The mockup's small-screen menu: a native details element that closes once a link is chosen. */
export function MobileNav({ links }: { links: NavLink[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details className="ds-mobile-nav" ref={ref}>
      <summary>
        Menu <span className="ds-arrow">☰</span>
      </summary>
      <nav className="ds-mobile-menu" aria-label="Mobile navigation">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => ref.current?.removeAttribute("open")}>
            {l.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
