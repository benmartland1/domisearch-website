"use client";

import { usePathname } from "next/navigation";

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
  // Vertical landing pages — cream surfaces with their own light nav, so the
  // dark global header would clash.
  "/recruitment",
  "/accountants",
  // The CMS is a separate application that happens to share this deployment.
  "/cms",
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

  return (
    <>
      {header}
      <main className="relative z-10 pt-24">{children}</main>
      {footer}
    </>
  );
}
