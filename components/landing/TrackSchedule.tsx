"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";

/**
 * Fires the Meta `Schedule` conversion once when the thank-you page loads
 * (i.e. after a Calendly booking completes). The base pixel also records a
 * PageView for this URL automatically.
 */
export function TrackSchedule({
  contentName = "AI Visibility Report",
}: {
  /** Which funnel the booking came from - reported as `content_name`. */
  contentName?: string;
} = {}) {
  useEffect(() => {
    trackMeta("Schedule", { content_name: contentName });
  }, [contentName]);
  return null;
}
