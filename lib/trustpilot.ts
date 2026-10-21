import data from "@/content/trustpilot-reviews.json";
import { site } from "@/lib/site";

/**
 * The reviews on https://www.trustpilot.com/review/domisearch.com, stored
 * verbatim in content/trustpilot-reviews.json. Trustpilot's review pages sit
 * behind a bot check and the business unit has no API access, so the bodies
 * are captured by hand (last retrieved on the date in the file) and only the
 * aggregate count is fetched live. Never edit the text: it is the reviewer's
 * own wording.
 */
export type TrustpilotReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  publishedDate: string;
  url: string;
  photo: string | null;
};

export const trustpilotReviews: TrustpilotReview[] = data.reviews;
export const trustpilotRetrieved = data.retrieved;

const TRUSTBOX_TEMPLATE = "56278e9abfbbba0bdcd568bc";

/** Live review count from Trustpilot's TrustBox endpoint; the stored count if that fails. */
export async function getTrustpilotReviewCount(): Promise<number> {
  const fallback = data.businessUnit.numberOfReviews;
  try {
    const url =
      `https://widget.trustpilot.com/trustbox-data/${TRUSTBOX_TEMPLATE}` +
      `?businessUnitId=${site.trustpilotBusinessUnitId}&locale=en-GB`;
    const res = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 21600 } });
    if (!res.ok) return fallback;
    const json = (await res.json()) as { businessUnit?: { numberOfReviews?: { total?: number } } };
    const total = json.businessUnit?.numberOfReviews?.total;
    return typeof total === "number" && total > 0 ? total : fallback;
  } catch {
    return fallback;
  }
}

/** "31 Jan 2026" */
export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}
