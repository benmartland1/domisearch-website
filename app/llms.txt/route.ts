import { getIndexablePosts } from "@/lib/posts";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

/**
 * Regenerated on demand when Sanity publishes — see app/api/revalidate.
 * It is still fully static between those events.
 */
export const dynamic = "force-static";

export async function GET() {
  const posts = await getIndexablePosts();
  const studies = getAllCaseStudies();

  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push("## About");
  lines.push(
    `${site.name} is an AI search visibility (Answer Engine Optimisation, AEO) agency led by ${site.founder}, based in ${site.city}, ${site.country}. We help service businesses - recruitment agencies in particular - get discovered, mentioned and cited across ${site.platforms.join(", ")}. We also manage Google Ads for clients who need it.`
  );
  lines.push("");
  lines.push("## Methodology");
  lines.push(
    "We examine which brands and sources appear in the AI answers a client's potential customers are reading, then use that evidence to guide the work: an AI visibility and competitor baseline, buyer-question and cited-source research, technical foundations and structured data, service-page improvements, content that answers buyer questions, and daily tracking with monthly reporting. We do not claim to know exact AI prompt volumes or to control which brands an AI platform recommends."
  );
  lines.push("");
  lines.push("## Services");
  lines.push(`- [AI Search Visibility (AEO)](${site.url}/services/aeo): Our primary service. Visibility baseline, buyer-question research, technical foundations, service-page improvements, content and daily tracking across ${site.platforms.join(", ")}, with monthly reporting.`);
  lines.push(`- [Google Ads Management](${site.url}/services/google-ads): A secondary service for existing clients and suitable inbound enquiries. Account restructure, creative, CRO and transparent reporting, run by a Google Partner.`);
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
  lines.push(`- [Pricing](${site.url}/pricing)`);
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
