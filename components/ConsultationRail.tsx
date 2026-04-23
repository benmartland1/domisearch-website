import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

type Props = {
  eyebrow?: string;
  ctaLabel?: string;
  founderQuote?: string;
  className?: string;
};

export function ConsultationRail({
  eyebrow = "Arrange a call about this",
  ctaLabel = "Book a call",
  founderQuote = "You'll speak to me - not a sales pod. If this isn't right for you I'll say so on the call.",
  className = "",
}: Props) {
  return (
    <aside
      className={`card relative overflow-hidden p-6 sm:p-7 ${className}`}
      aria-label="Book a consultation"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{ background: "linear-gradient(to bottom, var(--color-domigreen), transparent)" }}
      />

      <div className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-domigreen)]">
        {eyebrow}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          href={site.calendly}
          target="_blank"
          rel="noopener"
          className="btn btn-primary w-full justify-center"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>

        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm text-[color:var(--color-glacier)] transition hover:border-[#25D366]/55 hover:text-[color:var(--color-glacier)]"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="#25D366"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.1-.471-.15-.67.149-.197.297-.767.966-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .159 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Message me on WhatsApp
        </a>
      </div>

      <div className="hairline my-6" />

      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[color:var(--color-charcoal)]">
          <Image
            src="/brand/ben-warm.jpg"
            alt={`${site.founder}, founder of ${site.name}`}
            fill
            sizes="48px"
            className="object-cover object-center"
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-[600] text-[color:var(--color-glacier)]">
            {site.founder}
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fog)]/60">
            Founder · {site.city}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-fog)]/80">
            &ldquo;{founderQuote}&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
