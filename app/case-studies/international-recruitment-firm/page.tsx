import { ResultCaseStudyPage, resultMetadata } from "@/components/ResultCaseStudyPage";

// Anonymous client: see the ANONYMITY note in content/results.ts.
const SLUG = "international-recruitment-firm";

export const metadata = resultMetadata(SLUG);

export default function Page() {
  return <ResultCaseStudyPage slug={SLUG} />;
}
