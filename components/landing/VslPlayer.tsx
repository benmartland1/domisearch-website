"use client";

import { useRef, useState } from "react";
import { trackMeta } from "@/lib/meta";

type Props = {
  src: string;
  poster: string;
  /** Human-readable runtime, e.g. "1:31". Shown on the play overlay. */
  duration?: string;
  /** Label sent with the Meta `ViewContent` event fired on first play. */
  trackingName?: string;
  /** Accessible label for the video element. */
  title: string;
};

/**
 * Poster-first video player for the thank-you VSL.
 *
 * `preload="none"` means the 17MB file isn't fetched until the visitor actually
 * presses play - the poster carries the first paint. Native controls only appear
 * once playback has started so the poster stays clean.
 */
export function VslPlayer({
  src,
  poster,
  duration,
  trackingName = "Thank You VSL",
  title,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    trackMeta("ViewContent", { content_name: trackingName, content_type: "video" });
    void video.play().catch(() => {
      /* Autoplay blocked or codec issue - native controls are visible, let the user retry. */
    });
  }

  return (
    <div>
      {/* Green pill above the frame - the loudest "press this" cue on the page.
          Stays put once playback starts so nothing below it shifts. */}
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={play}
          className={`group inline-flex items-center gap-3 rounded-full bg-[color:var(--color-domigreen)] px-7 py-3.5 text-[15px] font-[600] text-[color:var(--color-charcoal)] transition-transform duration-300 hover:-translate-y-0.5 ${
            started
              ? "shadow-[0_14px_44px_-14px_rgba(1,232,144,0.5)]"
              : "watch-pulse"
          }`}
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--color-charcoal)]">
            <svg viewBox="0 0 24 24" className="ml-[1px] h-3 w-3" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5z" fill="var(--color-domigreen)" />
            </svg>
          </span>
          <span>Watch this first{duration ? ` (${duration})` : ""}</span>
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_120px_-40px_rgba(1,232,144,0.28)]">
        <video
          ref={videoRef}
          className="block aspect-video w-full"
          poster={poster}
          preload="none"
          playsInline
          controls={started}
          title={title}
          onPlay={() => setStarted(true)}
        >
          <source src={src} type="video/mp4" />
          Your browser doesn&apos;t support embedded video.{" "}
          <a href={src}>Download the video</a> instead.
        </video>

        {!started && (
          <button
            type="button"
            onClick={play}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 grid place-items-center bg-black/25 transition-colors duration-300 hover:bg-black/35"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-[color:var(--color-domigreen)] shadow-[0_18px_50px_-12px_rgba(1,232,144,0.75)] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 sm:h-9 sm:w-9" aria-hidden>
                <path d="M8 5.5v13l11-6.5-11-6.5z" fill="var(--color-charcoal)" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
