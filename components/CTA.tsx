import Link from "next/link";
import { site } from "@/lib/site";
import { ScrollReveal } from "./ScrollReveal";

export function CTA({
  heading = "Ready to be the brand AI recommends?",
  sub = "Book a free 30-minute audit with Ben. We'll show you exactly where your brand is winning - and where it's invisible.",
}: { heading?: string; sub?: string } = {}) {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[color:var(--color-pine)]/30 via-[color:var(--color-charcoal)] to-[color:var(--color-charcoal)] p-10 sm:p-16">
        <div
          aria-hidden
          className="glow"
          style={{ width: 420, height: 420, background: "var(--color-domigreen)", top: -80, right: -80 }}
        />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <ScrollReveal>
            <h2 className="display text-balance text-4xl sm:text-5xl lg:text-6xl">
              {heading}
            </h2>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--color-fog)]/85">{sub}</p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Claim your free audit
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn btn-ghost">Contact us</Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
