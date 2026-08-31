import type { MetadataRoute } from "next";
import { getIndexablePosts } from "@/lib/posts";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/services/google-ads",
    "/services/aeo",
    "/recruitment",
    "/accountants",
    "/pricing",
    "/about",
    "/careers",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path.startsWith("/services") ||
          path === "/recruitment" ||
          path === "/accountants"
          ? 0.9
          : 0.6,
  }));

  // Posts marked "Hide from search engines" in the Studio are excluded.
  const posts = (await getIndexablePosts()).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const cs = getAllCaseStudies().map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: c.date ? new Date(c.date) : now,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...posts, ...cs];
}
