"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";
import { WIDGET_BOOKED_FLAG } from "@/components/BookingWidget";

/** A widget booking hands off to this page within seconds; allow ten minutes. */
const HANDOFF_WINDOW_MS = 10 * 60 * 1000;

/**
 * True if the site-wide booking widget already counted this booking (it fires
 * `Schedule` on Calendly's confirmed event before any redirect lands here).
 * Clears the flag so a later, separate booking is still counted.
 */
function alreadyCountedByWidget(): boolean {
  try {
    const raw = window.sessionStorage.getItem(WIDGET_BOOKED_FLAG);
    if (!raw) return false;
    window.sessionStorage.removeItem(WIDGET_BOOKED_FLAG);
    return Date.now() - Number(JSON.parse(raw)) < HANDOFF_WINDOW_MS;
  } catch {
    return false;
  }
}

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
    if (alreadyCountedByWidget()) return;
    trackMeta("Schedule", { content_name: contentName });
  }, [contentName]);
  return null;
}
