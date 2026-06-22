import type { Metadata } from "next";
import { DomiMark } from "@/components/landing/DomiMark";
import { TrackSchedule } from "@/components/landing/TrackSchedule";

export const metadata: Metadata = {
  title: "You're booked · DomiSearch",
  description: "Your AI Visibility walkthrough call is booked.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]">
      {/* Fires the Meta Schedule conversion on load */}
      <TrackSchedule />

      <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
        <DomiMark className="h-7 w-7" />
        <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">
          DomiSearch
        </span>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-pine)]">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="var(--color-paper)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-8 text-balance text-[clamp(1.9rem,5vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--color-ink)]">
            You&apos;re booked. Talk soon.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
            Your call is confirmed and a calendar invite is on its way. We&apos;ll have your AI
            Visibility Report ready to walk through together, including the quickest gaps to close.
          </p>

          <p className="mt-8 text-sm text-[color:var(--color-ink-3)]">
            Check your inbox for the confirmation. See you on the call.
          </p>
        </div>
      </main>
    </div>
  );
}
