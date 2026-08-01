import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/services/google-ads",
    "/services/aeo",
    "/recruitment",
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
        : path.startsWith("/services") || path === "/recruitment"
          ? 0.9
          : 0.6,
  }));

  const posts = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
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
