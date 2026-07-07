import Image from "next/image";

// PLACEHOLDER — confirm Ben's real LinkedIn handle + headline + photo.
const LINKEDIN_URL = "https://www.linkedin.com/in/benmartland";
const HEADLINE = "Founder @ DomiSearch | AI Search & AEO";
const FOLLOWERS = "8,040";

/** LinkedIn "in" logo mark. */
function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#0A66C2" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** LinkedIn-style verified badge (blue circle + tick). */
function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Verified">
      <circle cx="12" cy="12" r="10" fill="#0A66C2" />
      <path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A LinkedIn-style profile card for Ben, used as a credibility element below
 * the hero CTA. The whole card links to his LinkedIn profile. Mimics LinkedIn's
 * UI: banner, overlapping circular photo, name + verified flow, headline,
 * follower count, and the LinkedIn logo for explicit platform association.
 */
export function LinkedInCard() {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener"
      className="group mx-auto block w-full max-w-[360px] overflow-hidden rounded-2xl border border-black/[0.1] bg-white shadow-[0_16px_40px_-24px_rgba(20,17,13,0.4)] transition-transform hover:-translate-y-0.5"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
    >
      {/* Compact banner: label + LinkedIn logo, vertically centred */}
      <div className="relative flex h-11 items-center bg-[color:var(--color-pine)] px-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
          Our Founder
        </span>
        <span className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded bg-white shadow-sm">
          <LinkedInLogo className="h-4 w-4" />
        </span>
      </div>

      <div className="px-5 pb-5 pt-4">
        {/* Profile photo sits fully below the banner — never clipped */}
        <div className="mb-3">
          <Image
            src="/brand/founder.png"
            alt="Ben Martland"
            width={76}
            height={76}
            className="h-[76px] w-[76px] rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* Name + verified */}
        <div className="flex items-center gap-1.5">
          <span className="text-[17px] font-semibold leading-tight text-[#1a1a1a]">Ben Martland</span>
          <VerifiedBadge />
        </div>

        {/* Headline */}
        <p className="mt-0.5 text-[13.5px] leading-snug text-[#5f5f5f]">{HEADLINE}</p>

        {/* Follower count + secondary line */}
        <p className="mt-2 text-[12.5px] text-[#5f5f5f]">
          <span className="font-semibold text-[#1a1a1a]">{FOLLOWERS}</span> followers · Posts daily about AI search
        </p>
      </div>
    </a>
  );
}
