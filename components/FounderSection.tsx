import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";
import { site } from "@/lib/site";

/*
 * Every line here is a verified biographical fact. Search marketing is kept
 * as supporting experience; the lead is the AI search work Ben does today.
 */
const credentials = [
  "Founded DomiSearch in 2023",
  "Leads DomiSearch's AI search research and client delivery",
  "Five years in search marketing before that, in-house and agency-side",
  "Works with UK service businesses, with recruitment agencies a core focus",
];

export function FounderSection() {
  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        {/* Portrait / initial slab */}
        <ScrollReveal>
          <div className="relative">
            <div
              aria-hidden
              className="glow"
              style={{
                width: 360,
                height: 360,
                background: "var(--color-domigreen)",
                top: -40,
                left: -40,
                opacity: 0.25,
              }}
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-[color:var(--color-charcoal)]">
                <Image
                  src="/brand/founder.png"
                  alt="Ben Martland, Founder of DomiSearch"
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  style={{ objectPosition: "center 15%" }}
                />
                {/* Soft bottom gradient so the caption reads on any photo */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color:var(--color-charcoal)]/85 via-[color:var(--color-charcoal)]/30 to-transparent"
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
                      Founder
                    </div>
                    <div className="mt-1 text-xl font-[600] text-[color:var(--color-glacier)]">
                      Ben Martland
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fog)]/60">
                    {site.city}, UK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bio */}
        <div>
          <ScrollReveal as="span" className="eyebrow">
            Meet the founder
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="display mt-4 text-balance text-4xl sm:text-5xl lg:text-[3.25rem]">
              Ben Martland.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-fog)]/85">
              I&apos;m Ben, DomiSearch&apos;s founder. Most of my week is spent looking at what
              ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews say when someone researches
              a service business, and working out why one firm gets named and another does not.
              That evidence is where every client programme starts.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-fog)]/85">
              I came to this from five years in search marketing, running paid search for e-commerce
              and service brands in-house and then agency-side. It taught me to work from measured
              results rather than opinion. Today the work is AI search visibility, and I review
              every client account personally.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {credentials.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 text-sm text-[color:var(--color-fog)]/85"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-domigreen)]" />
                  {c}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={340}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={site.calendly} target="_blank" rel="noopener" className="btn btn-primary">
                Book a call
                <span aria-hidden>→</span>
              </Link>
              <Link href="/about" className="btn btn-ghost">
                More about the agency
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
