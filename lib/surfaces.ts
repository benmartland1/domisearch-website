/**
 * Routes that render on the warm paper surface rather than the dark site
 * theme. The global header switches to its light palette on these routes and
 * the footer loses its top margin so the page's dark closing section runs
 * straight into it. Sector landing pages are not listed here: they are bare
 * routes with their own nav (see LayoutChrome).
 */
export const PAPER_ROUTES = ["/"] as const;

export function isPaperRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return PAPER_ROUTES.some((r) => pathname === r);
}
