"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The Sectors dropdown, shared by the dark site header and the light nav on the
 * sector pages. Behaviour is identical in both; only the palette changes.
 */

type Sector = (typeof site.sectors)[number];
export type Tone = "dark" | "light";

const isExternal = (sector: Sector) => sector.href.startsWith("http");

const TONES = {
  dark: {
    button: (open: boolean, active: boolean) =>
      `nav-link text-sm font-medium hover:text-[color:var(--color-domigreen)] ${
        open || active ? "text-[color:var(--color-domigreen)]" : "text-[color:var(--color-fog)]"
      }`,
    panel:
      "border border-white/10 bg-[color:var(--color-charcoal)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]",
    item: "hover:bg-white/[0.05] focus-visible:bg-white/[0.05] aria-[current=page]:bg-white/[0.05]",
    label: "text-[color:var(--color-glacier)] group-hover:text-[color:var(--color-domigreen)]",
    note: "text-[color:var(--color-fog)]/60",
    arrow: "text-[color:var(--color-fog)]/40 group-hover:text-[color:var(--color-domigreen)]",
    mobileButton: "text-[color:var(--color-glacier)] hover:text-[color:var(--color-domigreen)]",
    mobileItem:
      "border-white/10 text-[color:var(--color-fog)] hover:text-[color:var(--color-domigreen)] aria-[current=page]:text-[color:var(--color-domigreen)]",
    mobileArrow: "text-[color:var(--color-fog)]/40",
  },
  light: {
    // Matches the pill links beside it in the light nav.
    button: (open: boolean, active: boolean) =>
      `rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight hover:bg-black/[0.04] hover:text-[color:var(--color-ink)] ${
        open || active
          ? "bg-black/[0.04] text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-2)]"
      }`,
    panel:
      "border border-black/[0.07] bg-white shadow-[0_24px_50px_-24px_rgba(20,17,13,0.45)]",
    item: "hover:bg-black/[0.035] focus-visible:bg-black/[0.035] aria-[current=page]:bg-black/[0.035]",
    label: "text-[color:var(--color-ink)] group-hover:text-[color:var(--color-pine)]",
    note: "text-[color:var(--color-ink-3)]",
    arrow: "text-[color:var(--color-ink-3)]/60 group-hover:text-[color:var(--color-pine)]",
    mobileButton: "text-[color:var(--color-ink)] hover:text-[color:var(--color-pine)]",
    mobileItem:
      "border-black/10 text-[color:var(--color-ink-2)] hover:text-[color:var(--color-pine)] aria-[current=page]:text-[color:var(--color-pine)]",
    mobileArrow: "text-[color:var(--color-ink-3)]/60",
  },
} as const;

/** Internal sector pages route client-side; the care entry is another domain. */
function SectorLink({
  sector,
  className,
  onClick,
  children,
}: {
  sector: Sector;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (isExternal(sector)) {
    return (
      <a href={sector.href} target="_blank" rel="noopener" onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={sector.href}
      onClick={onClick}
      aria-current={pathname === sector.href ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Desktop dropdown. Opens on hover for mouse users and on click/Enter for
 * everyone else. The panel stays in the DOM when closed (visibility-hidden, so
 * not focusable) so the sector links are in the server HTML crawlers read.
 */
export function SectorsMenu({ label, tone }: { label: string; tone: Tone }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();
  const t = TONES[tone];
  const onSectorPage = site.sectors.some((s) => s.href === pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      ref.current?.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sectors-menu"
        // Hover has already opened it for a mouse, so a mouse click must not
        // toggle it shut again. Keyboard and touch clicks toggle.
        onClick={(e) => {
          const mouse = (e.nativeEvent as PointerEvent).pointerType === "mouse";
          setOpen((v) => (mouse ? true : !v));
        }}
        className={`flex cursor-pointer items-center gap-1.5 transition-colors ${t.button(open, onSectorPage)}`}
      >
        {label}
        <Chevron open={open} />
      </button>

      <div
        id="sectors-menu"
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-[opacity,translate,visibility] duration-200 ease-out ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className={`w-72 rounded-2xl p-2 ${t.panel}`}>
          {site.sectors.map((sector) => (
            <li key={sector.href}>
              <SectorLink
                sector={sector}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors ${t.item}`}
              >
                <span>
                  <span className={`block text-sm font-medium transition-colors ${t.label}`}>
                    {sector.label}
                  </span>
                  <span className={`mt-0.5 block text-xs ${t.note}`}>{sector.note}</span>
                </span>
                <span aria-hidden className={`transition-all group-hover:translate-x-0.5 ${t.arrow}`}>
                  {isExternal(sector) ? "↗" : "→"}
                </span>
              </SectorLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The same list as a disclosure inside a mobile menu. */
export function MobileSectors({
  label,
  tone,
  onNavigate,
}: {
  label: string;
  tone: Tone;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const t = TONES[tone];

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-sectors"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between py-3 text-base ${t.mobileButton}`}
      >
        {label}
        <Chevron open={open} />
      </button>
      <div
        id="mobile-sectors"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="min-h-0 overflow-hidden">
          {site.sectors.map((sector) => (
            <li key={sector.href}>
              <SectorLink
                sector={sector}
                onClick={onNavigate}
                className={`flex items-center justify-between border-l py-2.5 pl-4 text-[15px] ${t.mobileItem}`}
              >
                {sector.label}
                <span aria-hidden className={t.mobileArrow}>
                  {isExternal(sector) ? "↗" : "→"}
                </span>
              </SectorLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
