import type { Metadata } from "next";
import { DomiMark } from "@/components/landing/DomiMark";
import { TrackPurchase } from "@/components/landing/TrackPurchase";

export const metadata: Metadata = {
  title: "Thank you - your roadmap is on its way · DomiSearch",
  description: "Your AI Visibility Roadmap is being prepared and will be delivered within 24 hours.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RoadmapThanksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)]">
      {/* Fires the Meta Purchase conversion (value 99, GBP) on load */}
      <TrackPurchase />

      <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
        <DomiMark className="h-7 w-7" />
        <span className="text-[15px] font-bold tracking-tight text-[color:var(--color-ink)]">DomiSearch</span>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-pine)]">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <path d="M5 12.5l4.2 4.2L19 7" stroke="var(--color-paper)" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-8 text-balance text-[clamp(1.9rem,5vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--color-ink)]">
            Thank you - your roadmap is on its way.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-pretty text-lg leading-relaxed text-[color:var(--color-ink-2)]">
            Payment received. We&apos;re building your AI Visibility Roadmap now and it&apos;ll land in
            your inbox <strong className="text-[color:var(--color-ink)]">within 24 hours</strong> - the full
            score, technical fixes, content opportunities and your phased 90-day plan.
          </p>

          <p className="mt-8 text-sm text-[color:var(--color-ink-3)]">
            Keep an eye on your inbox (and spam, just in case). Questions? Reply to your receipt any time.
          </p>
        </div>
      </main>
    </div>
  );
}
