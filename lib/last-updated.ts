import { execSync } from "node:child_process";

/**
 * When a page's source file last changed, for a visible "Last updated" line and
 * the matching `dateModified` in schema.
 *
 * Read from the last git commit that touched the file, so the date moves when
 * the page is edited and not merely because the site was redeployed. Static
 * pages evaluate this once, at build time.
 *
 * Falls back to the build date wherever git history is not available (a CLI
 * deploy uploads no .git folder). Vercel's git deploys use a shallow clone, so a
 * file untouched for longer than that clone reports the oldest commit in it:
 * later than the true date, but never later than the deploy itself.
 */
export function lastUpdated(file: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // No git binary or no repository: use the build date below.
  }
  return new Date();
}

/** "September 2026", in UK time so a late-evening commit lands in the right month. */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}
