import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read client for published content.
 *
 * `useCdn: false` because every read happens either at build time or behind
 * on-demand revalidation, so the CDN would only ever serve us staleness we
 * have already paid to avoid.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
