"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/posts";

type Props = {
  headings: Heading[];
  /** "dark" (default) for charcoal pages; "paper" for light-background pages */
  variant?: "dark" | "paper";
};

export function TableOfContents({ headings, variant = "dark" }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.slug ?? null
  );

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the trigger area
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // Trigger when heading is in the top ~35% of the viewport
        rootMargin: "-96px 0px -65% 0px",
        threshold: 0,
      }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const isPaper = variant === "paper";
  const labelClass = isPaper
    ? "mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-ink-2)]"
    : "eyebrow mb-4 text-[color:var(--color-fog)]/75";
  const activeClass = isPaper
    ? "border-[color:var(--color-pine)] text-[color:var(--color-ink)]"
    : "border-[color:var(--color-domigreen)] text-[color:var(--color-domigreen)]";
  const inactiveClass = isPaper
    ? "border-black/10 text-[color:var(--color-ink-3)] hover:border-black/30 hover:text-[color:var(--color-ink)]"
    : "border-white/10 text-[color:var(--color-fog)]/65 hover:border-white/30 hover:text-[color:var(--color-glacier)]";

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className={labelClass}>On this page</div>
      <ul className="space-y-1">
        {headings.map((h) => {
          const active = activeId === h.slug;
          return (
            <li key={h.slug} className={h.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${h.slug}`}
                className={`block border-l py-1.5 pl-3 leading-snug transition-colors ${
                  active ? activeClass : inactiveClass
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
