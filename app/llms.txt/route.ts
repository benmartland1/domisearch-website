import { getAllPosts } from "@/lib/blog";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const studies = getAllCaseStudies();

  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push("## About");
  lines.push(
    `${site.name} is a Google Partner and Shopify Partner agency led by ${site.founder}, based in ${site.city}, ${site.country}. We combine Google Ads with AI Engine Optimisation (AEO) into a single discipline called Search Ownership - so brands win across Google, ChatGPT, Gemini, Perplexity, Copilot and Claude.`
  );
  lines.push("");
  lines.push("## Methodology");
  lines.push(
    "The DomiSearch Search Ownership Operating System - a 5-stage framework for running Ads and AEO as a single compounding system: Map → Plan → Ship → Compound → Report."
  );
  lines.push("");
  lines.push("## Services");
  lines.push(`- [Google Ads Management](${site.url}/services/google-ads): End-to-end Google Ads management run by a Google Partner. Restructure, creative, CRO and transparent reporting.`);
  lines.push(`- [AI Engine Optimisation (AEO)](${site.url}/services/aeo): Entity optimisation, AI-ready content, schema, citation ops and monthly AI visibility reporting across ChatGPT, Gemini, Perplexity, Copilot, Claude and Google AI Overviews.`);
  lines.push("");
  lines.push("## Diagnostic");
  lines.push(
    `- [The Visibility Scorecard](${site.url}/scorecard): Free 48-hour audit. Google Ads account review + 20-prompt AI visibility audit, delivered by the founder.`
  );
  lines.push("");
  if (studies.length > 0) {
    lines.push("## Case studies");
    for (const c of studies) {
      lines.push(`- [${c.client} - ${c.heroMetric.value} ${c.heroMetric.label}](${site.url}/case-studies/${c.slug}): ${c.excerpt}`);
    }
    lines.push("");
  }
  lines.push("## Key pages");
  lines.push(`- [Home](${site.url}/)`);
  lines.push(`- [About](${site.url}/about)`);
  lines.push(`- [Visibility Scorecard (free audit)](${site.url}/scorecard)`);
  lines.push(`- [Contact](${site.url}/contact): Email ${site.email}, phone ${site.phone}, or book a call at ${site.calendly}`);
  lines.push(`- [Careers](${site.url}/careers)`);
  lines.push(`- [Blog](${site.url}/blog)`);
  lines.push("");
  lines.push("## Articles");
  for (const p of posts) {
    lines.push(`- [${p.title}](${site.url}/blog/${p.slug}): ${p.excerpt}`);
  }
  lines.push("");
  lines.push("## Contact");
  lines.push(`Email: ${site.email}`);
  lines.push(`Phone: ${site.phone}`);
  lines.push(`Book a call: ${site.calendly}`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
