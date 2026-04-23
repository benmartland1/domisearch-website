import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";

type Props = {
  caseStudy: CaseStudy;
  variant?: "default" | "featured";
};

export function CaseStudyCard({ caseStudy, variant = "default" }: Props) {
  const href = `/case-studies/${caseStudy.slug}`;
  const isFeatured = variant === "featured";
  const accent = caseStudy.accent;

  const card = (
    <Link
      href={href}
      className={`card spotlight group relative flex flex-col overflow-hidden transition-transform duration-300 ${
        isFeatured ? "p-8 sm:p-10" : "p-8"
      }`}
      style={
        isFeatured && accent
          ? {
              background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 10%, transparent) 0%, color-mix(in oklab, var(--color-glacier) 3%, transparent) 55%)`,
              borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
              boxShadow: `0 30px 80px -30px color-mix(in oklab, ${accent} 55%, transparent)`,
            }
          : undefined
      }
    >
      {accent && (
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 z-10 ${
            isFeatured ? "w-[5px]" : "w-[3px]"
          }`}
          style={{
            background: `linear-gradient(to bottom, ${accent}, transparent)`,
          }}
        />
      )}

      <div className="w-full">
        <div className="flex items-center gap-3">
          <div
            className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em]"
            style={{
              color: isFeatured ? "var(--color-glacier)" : "var(--color-domigreen)",
            }}
          >
            {caseStudy.services.filter((s) => s !== "Integrated").map((s) => (
              <span key={s}>{s}</span>
            ))}
            {caseStudy.services.includes("Integrated") && (
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  background:
                    isFeatured && accent
                      ? `color-mix(in oklab, ${accent} 15%, transparent)`
                      : "color-mix(in oklab, var(--color-domigreen) 10%, transparent)",
                  color:
                    isFeatured && accent ? accent : "var(--color-domigreen)",
                }}
              >
                Integrated
              </span>
            )}
          </div>
        </div>

        <h3
          className={`display mt-5 w-full leading-[1.05] ${
            isFeatured
              ? "text-[clamp(2rem,5vw,4rem)] tracking-tight"
              : "text-xl sm:text-2xl"
          }`}
        >
          {caseStudy.title}
        </h3>

        {caseStudy.excerpt && isFeatured && (
          <p className="mt-6 w-full text-base leading-relaxed text-[color:var(--color-fog)]/80 sm:text-lg lg:text-xl">
            {caseStudy.excerpt}
          </p>
        )}
      </div>

      <div
        className={`mt-8 flex items-end justify-between gap-6 ${
          isFeatured ? "pt-4" : "pt-2"
        }`}
      >
        <div>
          <div
            className={`display ${
              isFeatured ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
            }`}
            style={{
              color:
                isFeatured && accent ? accent : "var(--color-domigreen)",
            }}
          >
            {caseStudy.heroMetric.value}
          </div>
          <div className="mt-2 max-w-[14rem] text-xs uppercase tracking-[0.16em] text-[color:var(--color-fog)]/70">
            {caseStudy.heroMetric.label}
          </div>
        </div>

        {caseStudy.clientLogo && (
          <div className="flex shrink-0 items-end">
            <Image
              src={caseStudy.clientLogo}
              alt={caseStudy.client}
              width={96}
              height={32}
              className={`w-auto opacity-75 brightness-0 invert ${
                isFeatured ? "h-8" : "h-6"
              }`}
              sizes="96px"
            />
          </div>
        )}
      </div>

      <div
        className={`mt-8 flex items-center gap-2 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1 ${
          isFeatured ? "text-base" : ""
        }`}
        style={{
          color: isFeatured ? "var(--color-glacier)" : "var(--color-domigreen)",
        }}
      >
        Read case study →
      </div>
    </Link>
  );

  if (isFeatured && accent) {
    return (
      <div className="relative">
        <span
          aria-hidden
          className="glow"
          style={{
            width: 720,
            height: 520,
            background: accent,
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.22,
          }}
        />
        <div className="relative">{card}</div>
      </div>
    );
  }

  return card;
}
