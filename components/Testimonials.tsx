import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeader } from "./SectionHeader";
import { site } from "@/lib/site";

const TRUSTPILOT_GREEN = "#00B67A";

function TrustpilotStars({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l2.9 6.88 7.1.55-5.4 4.69 1.6 6.88L12 17.3l-6.2 3.7 1.6-6.88L2 9.43l7.1-.55L12 2z" />
        </svg>
      ))}
    </span>
  );
}

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Hex brand colour used as a subtle accent bar */
  accent: string;
  /** Optional client logo path - shown on the featured card */
  logo?: string;
  /** Slug-style basename for headshot lookup (e.g. "eamon-shahir") */
  photoSlug?: string;
  featured?: boolean;
};

// Quotes below are verbatim from domisearch.com - do not paraphrase.
const testimonials: Testimonial[] = [
  {
    quote:
      "We have been working with Ben and DomiSearch for nearly 3 years. A true expert in his space. Taxd has grown a phenomenal customer base thanks to our fantastic search acquisition strategy.",
    name: "Eamon Shahir",
    role: "Co-Founder",
    company: "Taxd",
    accent: "#1E40FF",
    logo: "/clients/taxd.png",
    photoSlug: "eamon-shahir",
    featured: true,
  },
  {
    quote:
      "We brought Ben in to support not just with Google Ads, but also landing pages, copy, and AEO. This helped boost conversions at every stage of the funnel - more clicks from ads and more customers converting. What we value most is his ability to provide clear insights, suggest improvements, and execute independently.",
    name: "Arjun Kumar",
    role: "Founder",
    company: "Taxd",
    accent: "#1E40FF",
    photoSlug: "arjun-kumar",
  },
  {
    quote:
      "Ben from DomiSearch has made my life easy... Anything and I mean anything to do with google ads, this guy knows, no over complication, not focusing on 'getting you to buy' The guy tells you what works, makes it works and over delivers. Genuinely never had a better experience with anyone!",
    name: "Angellos Koulli",
    role: "CEO",
    company: "Alphaveata",
    accent: "#01E890",
    photoSlug: "angellos-koulli",
  },
  {
    quote:
      "Ben reached out to help us scale our business through Google Ads, and he's done just that. We were completely new to the idea but are now are the point where we can profitably invest in the Google Ads platform to bring new customers to our site every day.",
    name: "Jake Duffy",
    role: "Co-founder",
    company: "Fueled",
    accent: "#F59E0B",
    logo: "/clients/fueled.png",
    photoSlug: "jake-duffy",
  },
  {
    quote:
      "It's been great to work with DomiSearch. Their level of competence in ads and understanding of wider SEO keeps us coming back month after month!",
    name: "Sam Barraclough",
    role: "CEO",
    company: "Rooftop Saunas",
    accent: "#B45309",
    logo: "/clients/rooftop_saunas.png",
    photoSlug: "sam-barraclough",
  },
];

const TESTIMONIAL_EXTS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

/** Resolve a headshot file in /public/testimonials/<slug>.<ext>, trying common extensions. */
function resolvePhoto(slug?: string): string | null {
  if (!slug) return null;
  const dir = path.join(process.cwd(), "public", "testimonials");
  for (const ext of TESTIMONIAL_EXTS) {
    const filePath = path.join(dir, `${slug}.${ext}`);
    if (fs.existsSync(filePath)) return `/testimonials/${slug}.${ext}`;
  }
  return null;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function Avatar({
  testimonial,
  size,
}: {
  testimonial: Testimonial;
  size: "sm" | "md" | "lg";
}) {
  const photo = resolvePhoto(testimonial.photoSlug);
  const px = size === "lg" ? 52 : size === "md" ? 44 : 36;
  const className =
    size === "lg"
      ? "h-[52px] w-[52px]"
      : size === "md"
        ? "h-11 w-11"
        : "h-9 w-9";

  if (photo) {
    return (
      <Image
        src={photo}
        alt={testimonial.name}
        width={px}
        height={px}
        className={`${className} shrink-0 rounded-full object-cover object-center ring-1 ring-white/10`}
        sizes={`${px}px`}
      />
    );
  }

  return (
    <span
      className={`${className} grid shrink-0 place-items-center rounded-full border border-white/10 text-sm font-[600]`}
      style={{ color: testimonial.accent }}
    >
      {initials(testimonial.name)}
    </span>
  );
}

type TestimonialsProps = {
  /** Render a "Book a call" button next to the Trustpilot CTA. Defaults to false. */
  showBookCall?: boolean;
};

export function Testimonials({ showBookCall = false }: TestimonialsProps = {}) {
  const featured = testimonials.find((t) => t.featured) ?? testimonials[0];
  const others = testimonials.filter((t) => t !== featured);

  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-10">
      <SectionHeader
        eyebrow="Testimonials"
        title="Don't just take our word for it."
        description="Here's what our clients say about working with us."
      />

      {/* Featured testimonial */}
      <ScrollReveal className="mt-16">
        <figure className="card relative overflow-hidden p-10 sm:p-14">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px]"
            style={{
              background: `linear-gradient(to bottom, ${featured.accent}, transparent)`,
            }}
          />
          <span
            aria-hidden
            className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: featured.accent }}
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div
                className="text-xs uppercase tracking-[0.28em]"
                style={{ color: featured.accent }}
              >
                Featured · {featured.company}
              </div>
              <blockquote
                className="mt-6 max-w-3xl text-balance text-2xl leading-snug text-[color:var(--color-glacier)] sm:text-3xl lg:text-[2.1rem]"
                style={{ fontWeight: 500, letterSpacing: "-0.015em" }}
              >
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <Avatar testimonial={featured} size="lg" />
                <div>
                  <div className="text-sm font-[600] text-[color:var(--color-glacier)]">
                    {featured.name}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-fog)]/65">
                    {featured.role} · {featured.company}
                  </div>
                </div>
              </figcaption>
            </div>
            {featured.logo && (
              <div className="flex items-end justify-start lg:justify-end">
                <Image
                  src={featured.logo}
                  alt={featured.company}
                  width={120}
                  height={40}
                  className="h-8 w-auto opacity-75 brightness-0 invert"
                  sizes="120px"
                />
              </div>
            )}
          </div>
        </figure>
      </ScrollReveal>

      {/* Other testimonials - compact grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-2">
        {others.map((t, i) => (
          <ScrollReveal key={t.name} delay={(i % 2) * 100}>
            <figure className="card relative h-full overflow-hidden p-8">
              <span
                aria-hidden
                className="absolute inset-y-4 left-0 w-[2px] rounded-full"
                style={{ background: t.accent, opacity: 0.55 }}
              />
              <blockquote
                className="text-lg leading-snug text-[color:var(--color-glacier)]"
                style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar testimonial={t} size="md" />
                <div>
                  <div className="text-sm font-[600] text-[color:var(--color-glacier)]">
                    {t.name}
                  </div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[color:var(--color-fog)]/65">
                    {t.role} · {t.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      {/* CTAs — Trustpilot (primary) + optional Book a call */}
      <ScrollReveal
        delay={80}
        className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
      >
        <a
          href={site.trustpilot}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-16 items-center justify-center gap-3 rounded-full px-7 text-[15px] font-medium text-white shadow-[0_12px_36px_-14px_rgba(0,182,122,0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-12px_rgba(0,182,122,0.7)]"
          style={{ backgroundColor: TRUSTPILOT_GREEN }}
        >
          <TrustpilotStars />
          <span className="whitespace-nowrap">See our reviews on Trustpilot</span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>

        {showBookCall && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-16 items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-2.5 pr-7 text-[15px] font-medium text-[color:var(--color-glacier)] shadow-[0_12px_36px_-14px_rgba(0,0,0,0.5)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-domigreen)]/50 hover:shadow-[0_18px_44px_-14px_color-mix(in_oklab,var(--color-domigreen)_38%,transparent)]"
          >
            <Image
              src="/brand/founder-cta.png"
              alt="Ben Martland"
              width={48}
              height={48}
              sizes="48px"
              className="h-11 w-11 shrink-0 rounded-full object-cover object-center ring-2 ring-[color:var(--color-domigreen)]/40"
              style={{ objectPosition: "center 15%" }}
            />
            <span className="whitespace-nowrap">Book a call</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        )}
      </ScrollReveal>
    </section>
  );
}
