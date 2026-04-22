import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use the DomiSearch website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <ScrollReveal as="span" className="eyebrow">Legal</ScrollReveal>
      <ScrollReveal delay={60}>
        <h1 className="display mt-4 text-4xl sm:text-5xl">Terms of Service</h1>
      </ScrollReveal>
      <ScrollReveal delay={140}>
        <div className="prose-dsrc mt-10">
          <p>
            These terms apply to your use of domisearch.com. Client engagements are governed by a
            separate Master Services Agreement.
          </p>

          <h2>Use of this site</h2>
          <p>
            You may use this site to learn about DomiSearch, request information, and read our
            publications. You may not attempt to interfere with the site, scrape content at scale
            without permission, or misuse any form on the site.
          </p>

          <h2>Content</h2>
          <p>
            Content on this site is © DomiSearch unless credited otherwise. You may quote
            short excerpts with attribution and a link back. Commercial republication requires
            our written consent.
          </p>

          <h2>No warranty on editorial content</h2>
          <p>
            Our blog and marketing content is for general information. It is not a substitute for
            tailored advice for your specific business.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, DomiSearch's liability for use of this
            website is limited to £100. Nothing in these terms excludes liability for death,
            personal injury or fraud.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of England and Wales.</p>

          <h2>Contact</h2>
          <p>{site.email} · {site.city}, {site.country}</p>

          <p className="text-sm opacity-70">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
