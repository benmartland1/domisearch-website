import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { site } from "@/lib/site";
import { ScrollReveal } from "./ScrollReveal";

type Action = { label: string; href: string };

/** Closing call to action: the approved design's forest panel. */
export function CTA({
  heading = "Ready to be the brand AI recommends?",
  sub = "Book a free 30-minute discovery call with Ben. We'll show you where your brand appears in AI answers today, and where it does not.",
  secondary = { label: "Contact us", href: "/contact" },
}: { heading?: string; sub?: string; secondary?: Action } = {}) {
  return (
    <section className="ds-wrap mt-24 lg:mt-32">
      <div className="ds-cta">
        <ScrollReveal>
          <span className="ds-eyebrow" style={{ color: "var(--color-domigreen)" }}>
            Start with the evidence
          </span>
          <h2 className="display text-balance text-[clamp(1.9rem,4.6vw,3rem)]" style={{ color: "var(--color-paper)" }}>
            {heading}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.85]">{sub}</p>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href={site.calendly} target="_blank" rel="noopener" className="ds-button ds-button-green">
              Book a call <span className="ds-arrow"><ArrowUpRight /></span>
            </Link>
            <Link href={secondary.href} className="ds-button ds-button-outline">
              {secondary.label} <span className="ds-arrow"><ArrowUpRight /></span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
