import { VIEWS } from "./mapData";

/**
 * Territory data and the derivation that turns it into a status.
 *
 * Deliberately NOT in TerritoryMap.tsx: that file is a client component, so
 * anything exported from it becomes a client reference and cannot be called
 * during a server render. The vertical pages compute their counter for the nav
 * at module scope on the server, so this has to live outside the boundary.
 */

export type Status = "held" | "limited" | "open";

/**
 * One config drives everything: industry -> sub-sector -> regions held.
 * A region's status for an industry is derived: every sub-sector held is
 * "held", some held is "limited", none held is "open".
 *
 * Each vertical page passes its own list; the default below is recruitment.
 */
export type TerritoryIndustry = {
  id: string;
  name: string;
  subSectors: Record<string, readonly string[]>;
};

/** PLACEHOLDER — invented. Recruitment's sub-sectors and held regions. */
export const RECRUITMENT_INDUSTRIES: TerritoryIndustry[] = [
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
];

export function statusFor(industry: TerritoryIndustry, regionId: string) {
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
export function territoriesTaken(industries: TerritoryIndustry[]) {
  return industries.reduce(
    (n, i) => n + COUNTED.filter((r) => statusFor(i, r.id).status !== "open").length,
    0,
  );
}
export const TERRITORIES_TAKEN = territoriesTaken(RECRUITMENT_INDUSTRIES);
/** PLACEHOLDER — the number of territories we intend to sell in total. */
export const TERRITORIES_CAPACITY = 40;

