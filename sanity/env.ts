/**
 * Sanity connection details.
 *
 * Project ID and dataset are public by design — they appear in the browser
 * bundle so the Studio and client-side queries can reach the API. The read
 * token is not, and is only ever imported from server-side code.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-31";

/**
 * Defaults to "production", the dataset this site has always used.
 *
 * Deliberately not required: if it is ever unset the safe outcome is to read
 * live content, not to fail a deploy over a value with one obvious answer.
 */
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Required, with no sensible default — a wrong or missing project ID would
 * build a blog with no posts in it and deploy that over the real one.
 */
export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Server-only. Used to read drafts for preview and by the migration script.
 * Absent in the browser, and absent during a plain production build, which is
 * fine — published content is readable without it.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

function required(value: string | undefined, name: string): string {
  if (value) return value;

  // Next.js surfaces this as "Failed to collect page data", which says nothing
  // about the actual cause. Anyone who hits it is looking at a red deploy and
  // needs to know where to go, so the message says it outright.
  throw new Error(
    [
      ``,
      `Missing environment variable: ${name}`,
      ``,
      `The blog reads from Sanity, so the build cannot run without it.`,
      ``,
      `Locally:  add it to .env.local (see .env.example).`,
      `On Vercel: Settings -> Environment Variables. Set it for Production,`,
      `           Preview AND Development — variables are scoped per`,
      `           environment, and a branch deploy is a Preview build, so`,
      `           setting Production alone fails exactly like this.`,
      ``,
      `The value is the project ID from sanity.io/manage. It is not a secret.`,
      `Full setup notes are in CMS.md.`,
      ``,
    ].join("\n"),
  );
}
