import "server-only";

/**
 * A best-effort brake on the public save endpoint.
 *
 * /api/onboarding/save takes writes without authentication, because the form
 * has to work from a link in an email with nothing to sign in to. That means
 * anyone who finds the URL can create documents in the dataset.
 *
 * This is not a security boundary — serverless instances don't share memory,
 * so a determined attacker spreads across instances and gets through. It is
 * here to make casual abuse and a runaway client loop cost something, and to
 * cap the damage a single instance can do. The real limits are the payload
 * cap in `request.ts` and the rule that a document is only created once a
 * client has actually written something.
 */
const WINDOW_MS = 60_000;
/**
 * Saves are debounced to one per 900ms, so a single fast typist tops out near
 * 66 a minute. 120 leaves room for two people onboarding from the same office
 * IP without either of them seeing a spurious "saved on this device".
 */
const MAX_PER_WINDOW = 120;

const hits = new Map<string, { count: number; resetAt: number }>();

export function throttled(key: string): boolean {
  const now = Date.now();

  // The map only grows if nothing prunes it, and a long-lived instance would
  // hold every IP it has ever seen.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  }

  const current = hits.get(key);
  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_PER_WINDOW;
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
