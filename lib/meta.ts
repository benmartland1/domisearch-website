/**
 * Thin, typed wrapper around the Meta Pixel's global `fbq`. Safe to call before
 * the pixel script has loaded (fbq queues calls) and on the server (no-op).
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
