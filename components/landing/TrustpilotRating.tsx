import { site } from "@/lib/site";

const TRUSTPILOT_GREEN = "#00B67A";

/**
 * Trustpilot's public TrustBox data endpoint. Undocumented but stable, and the
 * only free-plan widget the DomiSearch business unit has access to - it returns
 * the aggregate score and review count, not the review bodies.
 *
 * Every failure path falls through to FALLBACK, so the strip always renders.
 */
const TRUSTBOX_TEMPLATE = "56278e9abfbbba0bdcd568bc";

/**
 * We show the average of the actual review ratings, not Trustpilot's TrustScore.
 *
 * They are not the same number. TrustScore is time-weighted and pulled down by
 * low review volume, so it currently reads 4.3 while every single review is a
 * 5. Averaging the ratings themselves is the truthful version of what people
 * have actually said, and `allFiveStar` lets us say so outright.
 *
 * If a sub-5 review ever lands, the average drops on its own and the "every one
 * of them 5 stars" line disappears - nothing here needs revisiting.
 */

/** Snapshot taken 2026-09-01 - only used if the live fetch fails. */
const FALLBACK = {
  average: 5,
  total: 9,
  allFiveStar: true,
};

type Rating = typeof FALLBACK;

async function getRating(): Promise<Rating> {
  try {
    const url =
      `https://widget.trustpilot.com/trustbox-data/${TRUSTBOX_TEMPLATE}` +
      `?businessUnitId=${site.trustpilotBusinessUnitId}&locale=en-GB`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 21600 }, // 6 hours
    });
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as {
      businessUnit?: {
        numberOfReviews?: {
          total?: number;
          oneStar?: number;
          twoStars?: number;
          threeStars?: number;
          fourStars?: number;
          fiveStars?: number;
        };
      };
    };

    const counts = data.businessUnit?.numberOfReviews;
    const total = counts?.total;
    if (typeof total !== "number" || total < 1) return FALLBACK;

    const byRating = [
      counts?.oneStar ?? 0,
      counts?.twoStars ?? 0,
      counts?.threeStars ?? 0,
      counts?.fourStars ?? 0,
      counts?.fiveStars ?? 0,
    ];

    // The breakdown must actually add up, or we're averaging a partial picture.
    const counted = byRating.reduce((a, b) => a + b, 0);
    if (counted !== total) return FALLBACK;

    const weighted = byRating.reduce((sum, n, i) => sum + n * (i + 1), 0);

    return {
      average: weighted / total,
      total,
      allFiveStar: byRating[4] === total,
    };
  } catch {
    return FALLBACK;
  }
}

/** One Trustpilot star tile: green square, white star, optionally half-filled. */
function StarTile({ fill, index }: { fill: "full" | "half" | "empty"; index: number }) {
  const id = `tp-half-${index}`;
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      {fill === "half" ? (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor={TRUSTPILOT_GREEN} />
              <stop offset="50%" stopColor="#DCDCE6" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" fill={`url(#${id})`} />
        </>
      ) : (
        <rect width="24" height="24" fill={fill === "full" ? TRUSTPILOT_GREEN : "#DCDCE6"} />
      )}
      <path
        d="M12 3.4l2.35 5.57 6.02.47-4.58 3.94 1.4 5.87L12 16.12l-5.19 3.13 1.4-5.87-4.58-3.94 6.02-.47L12 3.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function Stars({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarTile
          key={i}
          index={i}
          fill={stars >= i ? "full" : stars >= i - 0.5 ? "half" : "empty"}
        />
      ))}
    </span>
  );
}

/**
 * Live Trustpilot proof strip - score, star tiles and review count, linking out
 * to the full profile where the individual reviews live.
 */
export async function TrustpilotRating() {
  const { average, total, allFiveStar } = await getRating();

  return (
    <a
      href={site.trustpilot}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-7 text-center transition-colors duration-300 hover:border-[color:var(--color-domigreen)]/40 sm:flex-row sm:justify-center sm:gap-7 sm:text-left"
    >
      <Stars stars={average} />

      <span className="flex flex-col gap-1 sm:border-l sm:border-white/10 sm:pl-7">
        <span className="text-[15px] font-[600] text-[color:var(--color-glacier)]">
          {allFiveStar
            ? `${total} review${total === 1 ? "" : "s"}, every one of them 5 stars`
            : `Rated ${average.toFixed(1)} out of 5 from ${total} review${total === 1 ? "" : "s"}`}
        </span>
        <span className="text-[13px] text-[color:var(--color-fog)]/65">
          Read them on <span style={{ color: TRUSTPILOT_GREEN }}>Trustpilot</span>
          <span
            aria-hidden
            className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </span>
    </a>
  );
}
