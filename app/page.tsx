import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { FounderSection } from "@/components/FounderSection";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "DomiSearch - The Search Agency for the AI Era",
  description:
    "Google Ads + AI Engine Optimisation (AEO). DomiSearch is the Google Partner and Shopify Partner agency helping brands win across Google, ChatGPT, Gemini and Perplexity.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <div className="mt-16">
        <ClientMarquee />
      </div>
      <ServicesGrid />
      <CaseStudiesSection />
      <FounderSection />
      <Testimonials showBookCall />
      <CTA
        heading="Own every surface your buyers search."
        sub="Book a free 30-minute call with Ben. We'll walk through your Google Ads account and how you're showing up across ChatGPT, Gemini and Perplexity - then tell you the three highest-leverage moves you can make next."
      />
    </>
  );
}
