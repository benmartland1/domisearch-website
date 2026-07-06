"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";

/**
 * Fires the Meta `Purchase` conversion (value 99, GBP) once when the roadmap
 * thank-you page loads - i.e. after a successful Stripe payment redirect.
 */
export function TrackPurchase() {
  useEffect(() => {
    trackMeta("Purchase", {
      value: 99,
      currency: "GBP",
      content_name: "AI Visibility Roadmap",
    });
  }, []);
  return null;
}
