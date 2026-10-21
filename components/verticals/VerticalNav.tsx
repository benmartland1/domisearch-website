"use client";

import { SiteNav } from "@/components/SiteNav";

/**
 * The sector pages share the site navigation from the approved design. The
 * territory counter the pill nav used to show is no longer displayed; the
 * props are kept so the pages need no change.
 */
export function VerticalNav(_props: { calendly: string; territories?: { taken: number; total: number } }) {
  return <SiteNav />;
}
