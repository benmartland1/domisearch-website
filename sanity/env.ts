/**
 * Sanity connection details.
 *
 * Project ID and dataset are public by design — they appear in the browser
 * bundle so the Studio and client-side queries can reach the API. The read
 * token is not, and is only ever imported from server-side code.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-31";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Server-only. Used to read drafts for preview and by the migration script.
 * Absent in the browser, and absent during a plain production build, which is
 * fine — published content is readable without it.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
