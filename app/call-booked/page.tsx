import type { Metadata } from "next";
import Link from "next/link";
import { DomiMark } from "@/components/landing/DomiMark";
import { TrackSchedule } from "@/components/landing/TrackSchedule";
import { TrustpilotRating } from "@/components/landing/TrustpilotRating";
import { VslPlayer } from "@/components/landing/VslPlayer";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Testimonials } from "@/components/Testimonials";
import { getFeaturedCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're booked · DomiSearch",
  description: "Your call with DomiSearch is confirmed. Watch this before we speak.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const VSL_SRC = "/vsl/thank-you-vsl.mp4";
const VSL_POSTER = "/vsl/thank-you-vsl-poster.jpg";
const VSL_DURATION = "1:31";

const NEXT_STEPS = [
  {
    title: "Check your inbox",
    body: "Your calendar invite and video link are already on their way. Accept it now so the slot is held.",
  },
  {
    title: "Watch the video above",
    body: "Ninety seconds on how the call runs and what we'll cover. It makes the 30 minutes we have together count.",
  },
  {
    title: "Come with one question",
    body: "The thing you actually want answered about how you show up in Google and AI search. That's enough to work with.",
  },
];

/**
 * Turn Calendly's `event_start_time` into readable copy.
 *
 * Calendly sends an ISO-8601 timestamp already expressed in the *invitee's*
 * timezone, so the wall-clock parts are exactly what they picked. We rebuild
 * those parts as a UTC instant and format in UTC, which prints the invitee's
 * time correctly regardless of where the server happens to be.
 */
function formatBookedTime(raw?: string): string | null {
  if (!raw) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(raw.trim());
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute));
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

/** First name from Calendly's params, defensively trimmed - it lands in the H1. */
function firstNameFrom(first?: string, full?: string): string | null {
  const candidate = (first ?? full ?? "").split(/\s+/)[0] ?? "";
  const clean = candidate.replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 24);
  return clean.length > 1 ? clean : null;
}

/** Calendly may send a param once or repeated - we only ever want one value. */
function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const firstName = firstNameFrom(
    one(params.invitee_first_name),
    one(params.invitee_full_name),
  );
  const bookedTime = formatBookedTime(one(params.event_start_time));

  const [featuredCaseStudy] = getFeaturedCaseStudies(1);

  return (
    <div className="relative">
      {/* Fires the Meta `Schedule` conversion on load */}
      <TrackSchedule contentName="Discovery Call" />

      <header className="mx-auto flex max-w-7xl items-center gap-2.5 px-6 py-7 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <DomiMark className="h-7 w-7" />
          <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-glacier)]">
            DomiSearch
          </span>
        </Link>
      </header>

      {/* ---------- Confirmation + VSL ---------- */}
      <section className="relative mx-auto max-w-4xl px-6 pt-8 lg:px-10">
        <span
          aria-hidden
          className="glow pointer-events-none"
          style={{
            width: 760,
            height: 520,
            background: "var(--color-domigreen)",
            top: -140,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.16,
          }}
        />

        <div className="relative text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color:var(--color-domigreen)]">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="var(--color-charcoal)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="display mt-7 text-balance text-[clamp(2.1rem,6vw,3.6rem)]">
            {firstName ? `You're booked, ${firstName}.` : "You're booked."}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[color:var(--color-fog)]/80">
            {bookedTime ? (
              <>
                Your call is confirmed for{" "}
                <strong className="font-[600] text-[color:var(--color-glacier)]">
                  {bookedTime}
                </strong>
                , and the calendar invite is on its way.
              </>
            ) : (
              <>
                Your call is confirmed and the calendar invite is on its way.
              </>
            )}{" "}
            One thing before we speak &mdash; watch the short video below.
          </p>
        </div>

        <div className="relative mt-12">
          <VslPlayer
            src={VSL_SRC}
            poster={VSL_POSTER}
            duration={VSL_DURATION}
            title={`A message from ${site.founder} before your call`}
            trackingName="Thank You VSL"
          />
        </div>
      </section>

      {/* ---------- What happens next ---------- */}
      <section className="mx-auto mt-24 max-w-5xl px-6 lg:px-10">
        <h2 className="eyebrow text-center">What happens next</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {NEXT_STEPS.map((step, i) => (
            <div key={step.title} className="card h-full p-7">
              <div className="display text-3xl text-[color:var(--color-domigreen)]">
                0{i + 1}
              </div>
              <h3 className="mt-5 text-lg font-[600] text-[color:var(--color-glacier)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fog)]/75">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Proof: case study ---------- */}
      {featuredCaseStudy && (
        <section className="mx-auto mt-28 max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <h2 className="eyebrow">While you wait</h2>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-2xl font-[500] leading-snug tracking-tight text-[color:var(--color-glacier)] sm:text-3xl">
              Here&apos;s what this looks like when it works.
            </p>
          </div>
          <div className="mt-14">
            <CaseStudyCard caseStudy={featuredCaseStudy} variant="featured" />
          </div>
        </section>
      )}

      {/* ---------- Proof: Trustpilot + testimonials ---------- */}
      <section className="mx-auto mt-20 max-w-3xl px-6 lg:px-10">
        <TrustpilotRating />
      </section>

      <Testimonials />

      <footer className="mx-auto mt-28 max-w-3xl px-6 pb-24 text-center lg:px-10">
        <p className="text-sm leading-relaxed text-[color:var(--color-fog)]/60">
          Need to move the call? Use the reschedule link in your confirmation email, or reply to it
          directly &mdash; it comes straight to {site.founder}.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-4 inline-block text-sm font-medium text-[color:var(--color-domigreen)] hover:underline"
        >
          {site.email}
        </a>
      </footer>
    </div>
  );
}
