import type { Metadata } from "next";
import { VisibilityClient } from "@/components/VisibilityClient";

export const metadata: Metadata = {
  title: "AI Visibility Snapshot · DomiSearch",
  description: "Run a 10-prompt AI visibility check across ChatGPT with live web search. Internal tool.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/visibility" },
};

export default function VisibilityPage() {
  return (
    <>
      <section className="relative isolate overflow-x-clip">
        <div className="absolute inset-0 grid-backdrop" aria-hidden />
        <div
          aria-hidden
          className="glow"
          style={{ width: 520, height: 520, background: "var(--color-domigreen)", top: -160, left: "-10%" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 lg:px-10 lg:pt-24">
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-domigreen)]">
            Internal tool
          </div>
          <h1 className="display mt-5 text-balance text-[clamp(2.25rem,5vw,3.75rem)]">
            AI Visibility Snapshot.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-fog)]/85">
            Enter a brand. We generate ten buyer-intent prompts, run them through ChatGPT with live web
            search, and return a snapshot of where the brand is — and isn&apos;t — cited. For demos and Loom
            walkthroughs.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-32 lg:px-10">
        <VisibilityClient />
      </section>
    </>
  );
}
