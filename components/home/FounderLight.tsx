import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Arrow, pillOutline, pillSolid, SectionIntro } from "@/components/light/Primitives";
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

export function FounderLight() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-6 lg:mt-32">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
        <ScrollReveal>
          <div className="relative mx-auto max-w-sm overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white p-2 shadow-[0_24px_60px_-44px_rgba(20,17,13,0.4)] lg:mx-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.3rem] bg-[color:var(--color-paper-2)]">
              <Image
                src="/brand/founder.png"
                alt="Ben Martland, Founder of DomiSearch"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                style={{ objectPosition: "center 15%" }}
              />
            </div>
            <div className="flex items-end justify-between px-3 pb-2 pt-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-pine)]">
                  Founder
                </div>
                <div className="mt-0.5 text-[17px] font-bold tracking-tight text-[color:var(--color-ink)]">
                  Ben Martland
                </div>
              </div>
              <div className="text-[12px] text-[color:var(--color-ink-3)]">{site.city}, UK</div>
            </div>
          </div>
        </ScrollReveal>

        <div>
          <SectionIntro label="Meet the founder" title="Ben Martland." />
          <ScrollReveal delay={120}>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
              I&apos;m Ben, DomiSearch&apos;s founder. Most of my week is spent looking at what
              ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews say when someone researches
              a service business, and working out why one firm gets named and another does not.
              That evidence is where every client programme starts.
            </p>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[color:var(--color-ink-2)] sm:text-[17px]">
              I came to this from five years in search marketing, running paid search for e-commerce
              and service brands in-house and then agency-side. It taught me to work from measured
              results rather than opinion. Today the work is AI search visibility, and I review every
              client account personally.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[14px] text-[color:var(--color-ink-2)]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-pine)]" />
                  {c}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.calendly} target="_blank" rel="noopener" className={pillSolid}>
                Book a call
                <Arrow />
              </a>
              <Link href="/about" className={pillOutline}>
                More about the agency
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
