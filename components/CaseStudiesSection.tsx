import { getFeaturedCaseStudies } from "@/lib/case-studies";
import { CaseStudyCard } from "./CaseStudyCard";
import { SectionHeader } from "./SectionHeader";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Homepage case study section.
 * Shows a single featured case study card (large, magazine-style).
 */
export function CaseStudiesSection() {
  const studies = getFeaturedCaseStudies(1);
  if (studies.length === 0) return null;

  const [featured] = studies;

  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="Featured case study"
        title="Work that compounds."
        description="What three years of integrated Ads + AEO actually looks like - with the numbers to match."
      />
      <ScrollReveal className="mt-14 block">
        {featured && <CaseStudyCard caseStudy={featured} variant="featured" />}
      </ScrollReveal>
    </section>
  );
}
