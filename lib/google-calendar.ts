import { site } from "@/lib/site";

/** How long the discovery call runs, in minutes - used when Calendly sends no end time. */
const DEFAULT_DURATION_MINUTES = 30;

const GOOGLE_TEMPLATE = "https://calendar.google.com/calendar/render";

type Args = {
  /** Calendly's `event_start_time` - ISO-8601, usually with the invitee's UTC offset. */
  startRaw?: string;
  /** Calendly's `event_end_time`, same format. Optional. */
  endRaw?: string;
  /** Business name for the event title, if the booking captured one. */
  businessName?: string | null;
  /** Join link, if the booking passed one through. */
  meetingUrl?: string | null;
};

/**
 * Google's template URL wants either a UTC instant (`YYYYMMDDTHHMMSSZ`) or a
 * floating wall-clock time (`YYYYMMDDTHHMMSS`, read in the viewer's own calendar
 * timezone).
 *
 * Calendly normally sends an offset (`2026-09-10T14:00:00+01:00`), so we resolve
 * the real instant and hand Google UTC. When the offset is missing we keep the
 * wall-clock parts untouched and let Google interpret them locally - that is the
 * invitee's own time either way, and it beats silently shifting the slot.
 */
function toGoogleStamp(raw: string): { stamp: string; instant: Date | null } | null {
  const value = raw.trim();
  const parts = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(value);
  if (!parts) return null;

  const [, year, month, day, hour, minute, second = "00"] = parts;
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);

  if (hasZone) {
    const instant = new Date(value);
    if (Number.isNaN(instant.getTime())) return null;
    return { stamp: `${instant.toISOString().replace(/[-:]|\.\d{3}/g, "")}`, instant };
  }

  return {
    stamp: `${year}${month}${day}T${hour}${minute}${second}`,
    instant: null,
  };
}

/** Shift a formatted stamp forward by N minutes, preserving its UTC/floating shape. */
function addMinutes(stamp: string, instant: Date | null, minutes: number): string {
  if (instant) {
    const end = new Date(instant.getTime() + minutes * 60_000);
    return end.toISOString().replace(/[-:]|\.\d{3}/g, "");
  }

  // Floating time - do the arithmetic in UTC purely as a calendar, then re-print.
  const [date, time] = stamp.split("T");
  const asUtc = new Date(
    Date.UTC(
      +date.slice(0, 4),
      +date.slice(4, 6) - 1,
      +date.slice(6, 8),
      +time.slice(0, 2),
      +time.slice(2, 4),
      +time.slice(4, 6),
    ),
  );
  asUtc.setUTCMinutes(asUtc.getUTCMinutes() + minutes);
  return asUtc.toISOString().replace(/[-:]|\.\d{3}/g, "").replace(/Z$/, "");
}

/**
 * Build a Google Calendar "add event" template URL for a booked discovery call.
 *
 * Returns `null` when there is no usable start time - the caller then renders the
 * button in its fallback state rather than linking somewhere useless.
 */
export function buildGoogleCalendarUrl({
  startRaw,
  endRaw,
  businessName,
  meetingUrl,
}: Args): string | null {
  if (!startRaw) return null;

  const start = toGoogleStamp(startRaw);
  if (!start) return null;

  const end = endRaw ? toGoogleStamp(endRaw) : null;
  // Only trust Calendly's end time if it is the same shape as the start, otherwise
  // mixing a UTC instant with a floating time would produce a nonsense range.
  const endStamp =
    end && end.stamp.endsWith("Z") === start.stamp.endsWith("Z")
      ? end.stamp
      : addMinutes(start.stamp, start.instant, DEFAULT_DURATION_MINUTES);

  const title = businessName
    ? `Intro Call — ${site.name} x ${businessName}`
    : `Intro Call — ${site.name}`;

  const details = [
    `Your intro call with ${site.founder} at ${site.name}.`,
    meetingUrl ? `Join here: ${meetingUrl}` : null,
    meetingUrl
      ? null
      : "The join link is in your confirmation email — the calendar invite we sent has it too.",
    `Need to move it? Reply to your confirmation email or write to ${site.email}.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start.stamp}/${endStamp}`,
    details,
  });
  if (meetingUrl) params.set("location", meetingUrl);

  return `${GOOGLE_TEMPLATE}?${params.toString()}`;
}
