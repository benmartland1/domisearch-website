import { ResultCaseStudyPage, resultMetadata } from "@/components/ResultCaseStudyPage";

// Static route, so it takes precedence over app/case-studies/[slug] (the MDX
// case studies). /case-studies/taxd is the separate Google Ads story.
const SLUG = "taxd-ai-search";

export const metadata = resultMetadata(SLUG);

export default function Page() {
  return <ResultCaseStudyPage slug={SLUG} />;
}
