import { NextResponse, type NextRequest } from "next/server";

/**
 * Subdomain routing for onboarding.domisearch.com.
 *
 * The questionnaire lives in this repo, at /onboarding, so it shares the
 * design system, the Sanity client and the deploy. The subdomain is added to
 * the same Vercel project (Settings → Domains), which gives it SSL, and this
 * rewrite makes it serve the onboarding route at its own root.
 *
 * A second Vercel project pointing at the same repo was the alternative. It
 * would have meant two builds, two sets of environment variables and two
 * places for the design system to drift.
 */
const ONBOARDING_HOSTS = new Set([
  "onboarding.domisearch.com",
  "onboarding.localhost",
]);

function isOnboardingHost(hostname: string): boolean {
  if (ONBOARDING_HOSTS.has(hostname)) return true;
  // Vercel preview deployments of this branch, e.g.
  // onboarding-domisearch-website-abc123.vercel.app.
  return hostname.startsWith("onboarding-") && hostname.endsWith(".vercel.app");
}

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (isOnboardingHost(hostname)) {
    // API routes and the Studio keep their real paths on every host: the form
    // posts to /api/onboarding/* from this origin, and rewriting those would
    // send them to /onboarding/api/... instead.
    if (pathname.startsWith("/api/") || pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/onboarding" : `/onboarding${pathname}`;
    return NextResponse.rewrite(url);
  }

  // On the main site, send /onboarding to the subdomain so there is one
  // address for it. Off by default in development, where the subdomain does
  // not resolve, and disableable with ONBOARDING_CANONICAL_REDIRECT=off in
  // case DNS is ever mid-flight.
  if (
    pathname === "/onboarding" &&
    process.env.NODE_ENV === "production" &&
    process.env.ONBOARDING_CANONICAL_REDIRECT !== "off"
  ) {
    const target = new URL(request.nextUrl.search, "https://onboarding.domisearch.com");
    return NextResponse.redirect(target, 307);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the files that must resolve from
  // the real path on any host.
  matcher: ["/((?!_next/static|_next/image|fonts/|brand/|favicon.ico|icon.png|apple-icon.png).*)"],
};
