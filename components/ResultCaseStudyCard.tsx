import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { resultHref, type ResultCaseStudy } from "@/content/results";

type Cta = {
  label: string;
  href: string;
  /** Opens in a new tab with an ↗ arrow, like the nav's Book a call. */
  external?: boolean;
};

type Props = {
  result: ResultCaseStudy;
  /**
   * "card": headline, one scope line, then a CTA button.
   * "page": the compact detail-page header (h1, source line instead of a
   * button). Used by results whose detail page has no `heroCta`.
   */
  variant?: "card" | "page";
  /** "home": the homepage look (flat, 3px corners, medium-weight type). */
  look?: "home" | "default";
  /** Heading element. Defaults to h3 for a card, h1 for a page header. */
  as?: "h1" | "h3";
  /** Card CTA. Defaults to "Read case study" linking to the detail page. */
  cta?: Cta;
  /** Load the photo eagerly (above the fold). */
  priority?: boolean;
  /** Always show the sector eyebrow, even when it repeats the photo overlay. */
  eyebrow?: boolean;
};

/**
 * Photo-led result card: photograph on the left (about 45% wide on desktop),
 * result-led copy on the right; stacks photo-over-copy on mobile. Content
 * lives in content/results.ts. The card states the result once; fuller
 * evidence is for the detail page.
 */
export function ResultCaseStudyCard({
  result: r,
  variant = "card",
  look = "default",
  as,
  cta,
  priority,
  eyebrow,
}: Props) {
  const isPage = variant === "page";
  const Heading = as ?? (isPage ? "h1" : "h3");
  // The sector label repeats the photo overlay for anonymous clients, so it is
  // shown only where it adds something.
  const showSector = eyebrow || r.sector !== r.overlay.text;
  const action: Cta = cta ?? { label: "Read case study", href: resultHref(r) };
  const isDefaultAction = !cta;
  const className = ["ds-result", isPage && "ds-result-page", look === "home" && "ds-result--home"]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className}>
      <div className="ds-result-media">
        <Image
          src={r.image.src}
          alt={r.image.alt}
          fill
          sizes="(max-width: 800px) 100vw, 565px"
          priority={priority ?? isPage}
          style={{ objectFit: "cover", objectPosition: r.image.position ?? "50% 50%" }}
        />
        <div className="ds-result-overlay">
          {r.overlay.logo ? (
            <Image
              src={r.overlay.logo.src}
              alt={r.overlay.text}
              width={r.overlay.logo.width}
              height={r.overlay.logo.height}
              className="ds-result-logo"
              sizes="92px"
            />
          ) : (
            <span>{r.overlay.text}</span>
          )}
        </div>
      </div>

      <div className="ds-result-body">
        {showSector && <span className="ds-result-sector">{r.sector}</span>}
        <Heading className="ds-result-headline">{r.headline}</Heading>
        <p className="ds-result-summary">{r.summary}</p>

        <div className="ds-result-foot">
          {isPage ? (
            <p className="ds-result-source">
              {/* Axiforma draws "·" as a full stop, so the separator is set in
                  a fallback face. The character itself stays for screen readers. */}
              {r.detail.source.split(" · ").map((part, i) => (
                <span key={part}>
                  {i > 0 && <span className="ds-result-sep"> · </span>}
                  {part}
                </span>
              ))}
            </p>
          ) : action.external ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-button ds-result-button"
            >
              <span>{action.label}</span>
              <span className="ds-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          ) : (
            <Link href={action.href} className="ds-button ds-result-button">
              <span>
                {action.label}
                {isDefaultAction && <span className="sr-only">: {r.client ?? r.overlay.text}</span>}
              </span>
              <span className="ds-arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
