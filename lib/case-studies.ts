import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type CaseStudyService = "Google Ads" | "AEO" | "Integrated";

export type CaseStudyMetric = {
  value: string;
  label: string;
};

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  client: string;
  clientLogo?: string;
  sector: string;
  services: CaseStudyService[];
  timeline: string;
  date: string;
  heroMetric: CaseStudyMetric;
  metrics: CaseStudyMetric[];
  excerpt: string;
  quote?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  /** Optional accent colour for client branding in featured contexts */
  accent?: string;
};

export type CaseStudy = CaseStudyFrontmatter & {
  content: string;
};

const CS_DIR = path.join(process.cwd(), "content", "case-studies");

function ensureDir(): string {
  if (!fs.existsSync(CS_DIR)) fs.mkdirSync(CS_DIR, { recursive: true });
  return CS_DIR;
}

export function getAllCaseStudySlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(CS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  ensureDir();
  const mdxPath = path.join(CS_DIR, `${slug}.mdx`);
  const mdPath = path.join(CS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as Partial<CaseStudyFrontmatter>;
  if (!fm.title || !fm.client || !fm.heroMetric) return null;

  return {
    title: fm.title,
    slug: fm.slug ?? slug,
    client: fm.client,
    clientLogo: fm.clientLogo,
    sector: fm.sector ?? "",
    services: fm.services ?? [],
    timeline: fm.timeline ?? "",
    date: fm.date ?? "",
    heroMetric: fm.heroMetric,
    metrics: fm.metrics ?? [],
    excerpt: fm.excerpt ?? "",
    quote: fm.quote,
    quoteAuthor: fm.quoteAuthor,
    quoteRole: fm.quoteRole,
    featured: fm.featured ?? false,
    metaTitle: fm.metaTitle,
    metaDescription: fm.metaDescription,
    accent: fm.accent,
    content,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  return getAllCaseStudySlugs()
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((c): c is CaseStudy => Boolean(c))
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.date < b.date ? 1 : -1;
    });
}

export function getFeaturedCaseStudies(limit = 3): CaseStudy[] {
  return getAllCaseStudies().slice(0, limit);
}

export function getCaseStudiesByService(service: CaseStudyService, limit?: number): CaseStudy[] {
  const all = getAllCaseStudies().filter((c) =>
    c.services.includes(service) || (service !== "Integrated" && c.services.includes("Integrated"))
  );
  return typeof limit === "number" ? all.slice(0, limit) : all;
}
