"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatReviewDate, type TrustpilotReview } from "@/lib/trustpilot";

/*
 * One horizontal row of complete Trustpilot reviews, moving slowly right to
 * left at a constant speed. The row holds the full set twice; once the first
 * set has scrolled out of view the offset wraps by exactly one set width, so
 * the loop is seamless. Movement is driven by requestAnimationFrame rather
 * than a CSS animation so the manual controls can nudge the same offset.
 *
 *  - Pauses on hover, keyboard focus inside the row and touch.
 *  - Pause/play control and previous/next buttons, all real buttons.
 *  - Under prefers-reduced-motion nothing moves on its own; the buttons still
 *    step through the reviews.
 *  - The duplicate set is aria-hidden and inert, so screen readers announce
 *    each review once and the clone's links are not tab stops.
 *  - Cards stretch to the tallest review, so the track height never changes.
 */

const SPEED_PX_PER_SECOND = 24;
const TOUCH_RESUME_MS = 5000;
const STEP_MS = 480;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

function ReviewCard({ review }: { review: TrustpilotReview }) {
  const paragraphs = review.text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const date = formatReviewDate(review.publishedDate);
  return (
    <article className="ds-review-card">
      <div className="ds-person">
        {review.photo ? (
          <Image src={review.photo} alt="" width={44} height={44} sizes="44px" />
        ) : (
          <span className="ds-initials" aria-hidden="true">
            {initials(review.name)}
          </span>
        )}
        <p>
          <strong>{review.name}</strong>
          <small>
            <time dateTime={review.publishedDate}>{date}</time> · Trustpilot
          </small>
        </p>
      </div>
      <span className="ds-review-stars" role="img" aria-label={`Rated ${review.rating} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} aria-hidden="true" style={i < review.rating ? undefined : { opacity: 0.3 }}>
            ★
          </span>
        ))}
      </span>
      <blockquote>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </blockquote>
      <a className="ds-review-link" href={review.url} target="_blank" rel="noopener noreferrer">
        Read on Trustpilot ↗<span className="sr-only"> (review by {review.name}, opens in a new tab)</span>
      </a>
    </article>
  );
}

export function ReviewsCarousel({ reviews }: { reviews: TrustpilotReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const tween = useRef<{ from: number; to: number; start: number; dur: number } | null>(null);
  const held = useRef(false);
  const touchTimer = useRef<number | undefined>(undefined);

  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [heldState, setHeldState] = useState(false);
  const autoplay = !userPaused && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;

    const gap = () => parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const setWidth = () => set.offsetWidth + gap();

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      const w = setWidth();
      let x = offset.current;
      const t = tween.current;
      if (t) {
        const p = t.dur === 0 ? 1 : Math.min(1, (now - t.start) / t.dur);
        const eased = 1 - Math.pow(1 - p, 3);
        x = t.from + (t.to - t.from) * eased;
        if (p >= 1) tween.current = null;
      } else if (autoplay && !held.current) {
        x += SPEED_PX_PER_SECOND * dt;
      }
      if (w > 0) x = ((x % w) + w) % w;
      offset.current = x;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [autoplay]);

  const hold = (on: boolean) => {
    held.current = on;
    setHeldState(on);
  };

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const set = setRef.current;
    const card = set?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const distance = card.offsetWidth + gap;
    const from = tween.current ? tween.current.to : offset.current;
    tween.current = {
      from,
      to: from + direction * distance,
      start: performance.now(),
      dur: reduced ? 0 : STEP_MS,
    };
  };

  const moving = autoplay && !heldState;

  return (
    <div>
      <div
        className="ds-reviews-window"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hold(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hold(false);
        }}
        onFocus={() => hold(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hold(false);
        }}
        onTouchStart={() => {
          window.clearTimeout(touchTimer.current);
          hold(true);
        }}
        onTouchEnd={() => {
          window.clearTimeout(touchTimer.current);
          touchTimer.current = window.setTimeout(() => hold(false), TOUCH_RESUME_MS);
        }}
      >
        <div className="ds-reviews-track" ref={trackRef}>
          <div className="ds-reviews-set" ref={setRef} role="list" aria-label="Client reviews from Trustpilot">
            {reviews.map((r) => (
              <div role="listitem" key={r.id} style={{ display: "flex" }}>
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
          {/* Visual copy for the seamless loop: hidden from assistive tech and not focusable. */}
          <div className="ds-reviews-set" aria-hidden="true" inert>
            {reviews.map((r) => (
              <div key={`clone-${r.id}`} style={{ display: "flex" }}>
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-reviews-controls">
        <button type="button" onClick={() => step(-1)} aria-label="Previous review">
          ←
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next review">
          →
        </button>
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          aria-label={userPaused ? "Play automatic scrolling" : "Pause automatic scrolling"}
          disabled={reduced}
        >
          <span aria-hidden="true">{userPaused ? "▶" : "Ⅱ"}</span>
          {userPaused ? "Play" : "Pause"}
        </button>
        <span className="ds-reviews-status" aria-live="polite">
          {reduced
            ? "Automatic scrolling is off because your device prefers reduced motion."
            : moving
              ? "Scrolling slowly. Hover, tap or press pause to read at your own pace."
              : "Paused."}
        </span>
      </div>
    </div>
  );
}
