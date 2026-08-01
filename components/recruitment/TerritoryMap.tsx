"use client";

import { useState } from "react";
import { VIEWS, type Shape, type ViewId, type Zone } from "./mapData";

/**
 * Availability map: location first, industry second, never more than two clicks.
 *
 * View model
 *  - "world" shows the three zones we operate in; clicking one zooms into it.
 *  - "uk" / "europe" / "north-america" show selectable regions.
 *  - Zooming out returns to "world".
 *
 * Sub-sectors exist only in the data and in the result sentence. They are
 * deliberately never a selector: the visitor picks location, then industry, and
 * stops there.
 *
 * ALL AVAILABILITY DATA IS PLACEHOLDER. See SHOW_TERRITORIES in the page for
 * the flag that keeps it out of production.
 */

type Status = "held" | "limited" | "open";

/**
 * PLACEHOLDER — invented. One config drives everything:
 * industry -> sub-sector -> regions held.
 * A region's status for an industry is derived: every sub-sector held is
 * "held", some held is "limited", none held is "open".
 */
const INDUSTRIES = [
  {
    id: "construction",
    name: "Construction",
    subSectors: {
      "Commercial build": ["north-west", "yorkshire", "france"],
      "Civils and infrastructure": ["north-west", "yorkshire"],
      Residential: ["north-west", "texas"],
      "Fit out": ["north-west", "yorkshire"],
    },
  },
  {
    id: "technology",
    name: "Technology",
    subSectors: {
      "Software engineering": ["london", "germany", "california"],
      "Data and AI": ["london", "california"],
      "Cyber security": ["london"],
      "Data centres": ["ireland"],
    },
  },
  {
    id: "life-sciences",
    name: "Life Sciences & Pharma",
    subSectors: {
      "Clinical research": ["east", "switzerland"],
      "Regulatory affairs": ["switzerland"],
      "Manufacturing and QA": ["ireland", "massachusetts"],
    },
  },
  {
    id: "healthcare",
    name: "Healthcare",
    subSectors: {
      Nursing: ["north-east"],
      "Allied health": [],
      "Social care": ["north-east"],
    },
  },
  {
    id: "education",
    name: "Education",
    subSectors: {
      "Primary and secondary": [],
      "Further education": [],
      SEN: ["west-midlands"],
    },
  },
  {
    id: "energy",
    name: "Energy & Renewables",
    subSectors: {
      "Offshore wind": ["scotland", "north-east", "denmark"],
      Solar: ["south-west", "spain"],
      Nuclear: ["south-west"],
      "Grid and transmission": ["scotland"],
    },
  },
] as const;

type Industry = (typeof INDUSTRIES)[number];

function statusFor(industry: Industry, regionId: string) {
  const entries = Object.entries(industry.subSectors) as [string, readonly string[]][];
  const held = entries.filter(([, regions]) => regions.includes(regionId));
  const open = entries.filter(([, regions]) => !regions.includes(regionId));
  const status: Status = held.length === 0 ? "open" : open.length === 0 ? "held" : "limited";
  return { status, openSubSectors: open.map(([name]) => name) };
}

/**
 * Counter. Only regions where at least one sub-sector is spoken for are counted,
 * so the denominator stays a number a person can hold in their head rather than
 * industries x every region on three continents.
 */
const COUNTED = [
  ...VIEWS.uk.shapes,
  ...VIEWS.europe.shapes,
  ...VIEWS["north-america"].shapes,
];
/** Held and limited both count as taken: that sub-sector is gone either way. */
export const TERRITORIES_TAKEN = INDUSTRIES.reduce(
  (n, i) => n + COUNTED.filter((r) => statusFor(i, r.id).status !== "open").length,
  0,
);
/** PLACEHOLDER — the number of territories we intend to sell in total. */
export const TERRITORIES_CAPACITY = 40;

/** Label anchors on the world view, averaged from each zone's member shapes.
 *  Without these the UK is a few pixels of coastline and impossible to find. */
function zoneAnchors(shapes: Shape[]) {
  const byZone = new Map<Zone, [number, number][]>();
  shapes.forEach((s) => {
    if (!s.zone) return;
    byZone.set(s.zone, [...(byZone.get(s.zone) ?? []), s.label]);
  });
  return [...byZone.entries()].map(([zone, pts]) => ({
    zone,
    x: Math.round(pts.reduce((n, p) => n + p[0], 0) / pts.length),
    y: Math.round(pts.reduce((n, p) => n + p[1], 0) / pts.length),
  }));
}

const ZONE_LABEL: Record<Zone, string> = {
  uk: "United Kingdom",
  europe: "Europe",
  "north-america": "North America",
};

export function TerritoryMap() {
  const [view, setView] = useState<ViewId>("uk");
  const [industry, setIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [region, setRegion] = useState<Shape | null>(null);
  const [hover, setHover] = useState<Shape | null>(null);
  const [hoverZone, setHoverZone] = useState<Zone | null>(null);

  const isWorld = view === "world";
  const { shapes, viewBox } = VIEWS[view];
  const shapeStatus = (s: Shape): Status | null => (isWorld ? null : statusFor(industry, s.id).status);

  const fillFor = (s: Shape) => {
    if (isWorld)
      return hover?.id === s.id || (s.zone && hoverZone === s.zone) ? "var(--color-pine)" : "#cfc9be";
    const st = shapeStatus(s);
    if (st === "held") return "var(--color-pine)";
    if (st === "limited") return "url(#territory-hatch)";
    return hover?.id === s.id || region?.id === s.id ? "#ded9d0" : "var(--color-paper-2)";
  };

  const result = region ? statusFor(industry, region.id) : null;
  const toWorld = () => {
    setView("world");
    setRegion(null);
  };

  return (
    <div>
      {/* Industry chips. Horizontal scroll on mobile, wrap from sm up. */}
      <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
        {INDUSTRIES.map((d) => {
          const on = d.id === industry.id;
          return (
            <li key={d.id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setIndustry(d)}
                aria-pressed={on}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors sm:text-[14px] ${
                  on
                    ? "bg-[color:var(--color-pine)] text-white"
                    : "bg-[color:var(--color-paper-2)] text-[color:var(--color-ink-2)] hover:bg-[color:var(--color-paper)] hover:text-[color:var(--color-ink)]"
                }`}
              >
                {d.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 grid items-start gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-12">
        {/* Map */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-ink-3)]">
              <button
                type="button"
                onClick={toWorld}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  isWorld ? "text-[color:var(--color-ink)]" : "hover:bg-black/[0.05] hover:text-[color:var(--color-ink)]"
                }`}
              >
                World
              </button>
              {!isWorld ? (
                <>
                  <span aria-hidden className="opacity-50">
                    /
                  </span>
                  <span className="px-1.5 text-[color:var(--color-ink)]">{VIEWS[view].label}</span>
                </>
              ) : null}
            </div>
            {!isWorld ? (
              <button
                type="button"
                onClick={toWorld}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-ink-2)] transition-colors hover:border-black/25 hover:text-[color:var(--color-ink)]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                  <path d="M9 3H3v6M15 21h6v-6" />
                </svg>
                Zoom out
              </button>
            ) : null}
          </div>

          {/* key={view} restarts the animation, so changing view reads as a zoom */}
          <svg
            key={view}
            viewBox={viewBox}
            className="map-zoom mx-auto mt-3 h-auto w-full max-w-[13.5rem] sm:max-w-[22rem] lg:max-w-[30rem]"
            role="img"
            aria-label={
              isWorld
                ? "Choose a region of the world"
                : `${VIEWS[view].label} availability for ${industry.name}`
            }
          >
            <defs>
              {/* Partly held reads as neither taken nor free */}
              <pattern
                id="territory-hatch"
                width="7"
                height="7"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
              >
                <rect width="7" height="7" fill="var(--color-paper-2)" />
                <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-pine)" strokeWidth="3.5" opacity="0.5" />
              </pattern>
            </defs>
            {shapes.map((s) => {
              const clickable = isWorld ? Boolean(s.zone) : true;
              return (
                <g key={s.id}>
                  <path
                    d={s.d}
                    className={`transition-[fill] duration-300 ${clickable ? "cursor-pointer" : ""}`}
                    fill={fillFor(s)}
                    stroke={
                      !isWorld && shapeStatus(s) === "held" ? "var(--color-pine)" : "rgba(20,17,13,0.18)"
                    }
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      if (isWorld) {
                        if (s.zone) {
                          setView(s.zone);
                          setRegion(null);
                        }
                      } else {
                        setRegion(s);
                      }
                    }}
                  />
                  {s.short ? (
                    <text
                      x={s.label[0]}
                      y={s.label[1]}
                      textAnchor="middle"
                      className="pointer-events-none select-none text-[9px] font-bold"
                      fill={shapeStatus(s) === "held" ? "#ffffff" : "rgba(20,17,13,0.45)"}
                    >
                      {s.short}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {isWorld
              ? zoneAnchors(shapes).map((a) => {
                  const isUk = a.zone === "uk";
                  return (
                    <g
                      key={a.zone}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverZone(a.zone)}
                      onMouseLeave={() => setHoverZone(null)}
                      onClick={() => {
                        setView(a.zone);
                        setRegion(null);
                      }}
                    >
                      {/* The UK is a handful of pixels here, so it gets a ring */}
                      {isUk ? (
                        <circle
                          cx={a.x}
                          cy={a.y}
                          r={9}
                          fill="none"
                          stroke="var(--color-pine)"
                          strokeWidth={1.4}
                          opacity={0.9}
                        />
                      ) : null}
                      <text
                        x={a.x}
                        y={isUk ? a.y - 14 : a.y}
                        textAnchor="middle"
                        className="select-none text-[11px] font-bold"
                        fill={hoverZone === a.zone ? "var(--color-pine)" : "rgba(20,17,13,0.65)"}
                      >
                        {ZONE_LABEL[a.zone]}
                      </text>
                    </g>
                  );
                })
              : null}
          </svg>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[color:var(--color-ink-3)]">
            {isWorld ? (
              <span>Pick a region to zoom in.</span>
            ) : (
              <>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[4px] bg-[color:var(--color-pine)]" />
                  Held
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-[4px] border border-black/15"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, var(--color-pine) 0 2px, var(--color-paper-2) 2px 5px)",
                    }}
                  />
                  Partly held
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[4px] border border-black/15 bg-[color:var(--color-paper-2)]" />
                  Open
                </span>
              </>
            )}
            <span className="ml-auto text-[color:var(--color-ink-3)]/70">
              {isWorld
                ? hoverZone
                  ? ZONE_LABEL[hoverZone]
                  : "Illustration"
                : hover
                  ? hover.name
                  : "Illustration"}
            </span>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-[1.25rem] border border-black/[0.08] bg-[color:var(--color-paper-2)] p-4 sm:p-6">
          {isWorld ? (
            <>
              <h3 className="text-[16px] font-bold tracking-tight text-[color:var(--color-ink)]">
                Where do you place?
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
                Choose the United Kingdom, Europe or North America on the map, then pick your region.
              </p>
            </>
          ) : !region || !result ? (
            <>
              <h3 className="text-[16px] font-bold tracking-tight text-[color:var(--color-ink)]">
                Pick your region
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
                Select where you place on the map to see whether {industry.name} is still open there.
              </p>
            </>
          ) : (
            <>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  result.status === "held"
                    ? "bg-[color:var(--color-pine)] text-white"
                    : result.status === "limited"
                      ? "bg-[color:var(--color-pine)]/15 text-[color:var(--color-pine)]"
                      : "bg-[color:var(--color-domigreen)] text-[color:var(--color-charcoal)]"
                }`}
              >
                {result.status === "held" ? "Held" : result.status === "limited" ? "Limited" : "Open"}
              </span>
              <h3 className="mt-3 text-balance text-[17px] font-bold leading-snug tracking-tight text-[color:var(--color-ink)]">
                {result.status === "held"
                  ? `${industry.name} in ${region.name} is held.`
                  : result.status === "limited"
                    ? `${industry.name} in ${region.name} is partially held.`
                    : "This territory is open."}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
                {result.status === "held"
                  ? "Every sub-sector we cover here is taken. Tell us your patch on a call and we will show you the nearest region still open."
                  : result.status === "limited"
                    ? `${result.openSubSectors.join(", ")} ${
                        result.openSubSectors.length === 1 ? "is" : "are"
                      } still open.`
                    : "First firm in holds it."}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Absence from the map is the commonest misread: a visitor whose niche is
          not listed assumes we do not cover it, when it actually means nobody
          holds it. */}
      <p className="mt-5 rounded-[1.25rem] border border-[color:var(--color-pine)]/25 bg-[color:var(--color-pine)]/[0.05] px-4 py-3.5 sm:px-5 sm:py-4 text-[14px] leading-relaxed text-[color:var(--color-ink-2)]">
        <span className="font-bold text-[color:var(--color-ink)]">
          Cannot see your sector on here?
        </span>{" "}
        That means nobody holds it. We only list the sub-sectors we already work
        in, so anything missing is wide open and yours to claim first.
      </p>
    </div>
  );
}
