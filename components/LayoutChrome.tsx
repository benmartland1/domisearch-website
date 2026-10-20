"use client";

import { usePathname } from "next/navigation";
import { isPaperRoute } from "@/lib/surfaces";

/**
 * Renders the global site chrome (header/footer/padding) on normal routes,
 * and nothing - a bare full-bleed surface - on dedicated landing pages that
 * must have no nav and no competing links (e.g. paid-traffic lead magnets).
 *
 * Header/Footer are passed in as already-server-rendered nodes so they stay
 * server components; this wrapper only decides whether to include them.
 */
const BARE_ROUTES = [
  "/ai-visibility-report",
  "/aesthetics",
  "/ai-visibility-roadmap",
  "/taxd-case-study",
  // Post-booking page: no nav, nothing competing with the VSL.
  "/call-booked",
  // Vertical landing pages — cream surfaces with their own light nav, so the
  // dark global header would clash.
  "/recruitment",
  "/accountants",
  "/healthcare",
  // Sanity Studio renders its own full-viewport UI.
  "/studio",
  // The onboarding questionnaire, served on onboarding.domisearch.com. It has
  // its own chrome and must have nothing competing with the current question.
  "/onboarding",
];

export function LayoutChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  if (bare) {
    return <main className="relative z-10">{children}</main>;
  }

  // Paper routes close on a full-bleed dark section, so the footer's usual
  // top margin would leave a band of paper between two dark blocks.
  const paper = isPaperRoute(pathname);

  return (
    <>
      {header}
      <main className="relative z-10 pt-24">{children}</main>
      <div className={paper ? "[&>footer]:mt-0" : undefined}>{footer}</div>
    </>
  );
}
