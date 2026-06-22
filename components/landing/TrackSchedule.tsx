"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";

/**
 * Fires the Meta `Schedule` conversion once when the thank-you page loads
 * (i.e. after a Calendly booking completes). The base pixel also records a
 * PageView for this URL automatically.
 */
export function TrackSchedule() {
  useEffect(() => {
    trackMeta("Schedule", { content_name: "AI Visibility Report" });
  }, []);
  return null;
}
