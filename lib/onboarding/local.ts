import type { Answers } from "./types";

/**
 * The on-device copy of a half-finished questionnaire.
 *
 * This is the fallback the brief asks for: if the resume email never arrives —
 * no mail service configured, a typo in the address, a spam filter — the
 * client still gets their answers back by returning to the same browser.
 *
 * Deliberately not the source of truth. Sanity is. This exists so a bad ten
 * minutes for Resend is not a bad ten minutes for the client.
 */
const KEY = "domisearch.onboarding.v1";

export type LocalState = {
  id: string | null;
  token: string | null;
  answers: Answers;
  stepId: string | null;
  savedAt: number;
};

/** A stale draft is more confusing than no draft. Four weeks is generous. */
const MAX_AGE_MS = 28 * 24 * 60 * 60 * 1000;

export function readLocal(): LocalState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalState;
    if (!parsed || typeof parsed !== "object" || typeof parsed.answers !== "object") return null;
    if (typeof parsed.savedAt === "number" && Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearLocal();
      return null;
    }
    return parsed;
  } catch {
    // Private browsing, a full quota, a corrupt value — all the same to us.
    return null;
  }
}

export function writeLocal(state: Omit<LocalState, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch {
    // Quota exceeded, usually from a large draft. Nothing useful to do: the
    // server copy is still authoritative.
  }
}

export function clearLocal(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clean up */
  }
}
