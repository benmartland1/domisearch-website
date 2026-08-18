"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only progressive disclosure.
 *
 * Every one of these keeps a single copy of the content in the DOM and hides it
 * with CSS below sm, rather than rendering a mobile copy and a desktop copy.
 * Duplicating the text would double what the AI crawlers read on a page whose
 * whole purpose is being cited accurately.
 *
 * Desktop is untouched: the content div carries `sm:!block` so it is always
 * visible from sm up regardless of state, and the toggle is `sm:hidden`.
 */

export function MobileCollapse({
  label,
  closeLabel,
  defaultOpen = false,
  children,
  className = "",
}: {
  label: string;
  closeLabel?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <div className={`${open ? "block" : "hidden"} sm:!block ${className}`}>{children}</div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold tracking-tight text-[color:var(--color-pine)] sm:hidden"
      >
        {open ? (closeLabel ?? "Show less") : label}
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </>
  );
}

/** Two-line clamp on mobile with a More toggle; full text from sm up. */
export function ClampedText({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p
        className={`text-[15px] leading-relaxed text-[color:var(--color-ink-2)] ${
          open ? "" : "line-clamp-2"
        } sm:!line-clamp-none`}
      >
        {children}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-1.5 text-[13px] font-bold tracking-tight text-[color:var(--color-pine)] sm:hidden"
      >
        {open ? "Less" : "More"}
      </button>
    </>
  );
}

/**
 * Numbered accordion for the Territory Engine steps. Header (number, title,
 * one-line summary) is always visible; the body opens on tap. Grid on desktop.
 */
export function StepsAccordion({
  steps,
}: {
  steps: { n: string; title: string; summary: string; body: string }[];
}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-black/[0.06] sm:grid-cols-2">
      {steps.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={s.n} className="bg-[color:var(--color-paper)] p-5 sm:p-9">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-3 text-left sm:pointer-events-none"
            >
              <span className="mt-0.5 text-[12px] font-bold tracking-[0.2em] text-[color:var(--color-pine)]">
                {s.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-bold tracking-tight text-[color:var(--color-ink)] sm:text-[22px]">
                  {s.title}
                </span>
                <span className="mt-1 block text-[14px] leading-snug text-[color:var(--color-ink-3)] sm:hidden">
                  {s.summary}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className={`mt-1 h-4 w-4 shrink-0 text-[color:var(--color-ink-3)] transition-transform duration-200 sm:hidden ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <p
              className={`text-[15px] leading-relaxed text-[color:var(--color-ink-2)] ${
                isOpen ? "mt-3 block" : "hidden"
              } sm:!mt-3 sm:!block`}
            >
              {s.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Swipe carousel with dots below sm; three-up grid from sm. */
export function Carousel({ children }: { children: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth || 1;
      setI(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((c, n) => (
          <div key={n} className="w-[85%] shrink-0 snap-center sm:w-auto sm:shrink">
            {c}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5 sm:hidden" aria-hidden>
        {children.map((_, n) => (
          <span
            key={n}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              n === i ? "w-5 bg-[color:var(--color-pine)]" : "w-1.5 bg-black/20"
            }`}
          />
        ))}
      </div>
    </>
  );
}

/**
 * Slim sticky CTA, mobile only, revealed once the hero is scrolled past.
 * Padded for the iOS home indicator so it never sits under the safe area.
 */
export function StickyCta({
  href,
  line = "One firm per sub-sector, per region.",
}: {
  href: string;
  line?: string;
}) {
  const [past, setPast] = useState(false);
  const [atFoot, setAtFoot] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Retract once the footer is on screen, so the bar never sits over it.
    const foot = document.querySelector("footer");
    const io = foot
      ? new IntersectionObserver((e) => setAtFoot(e.some((x) => x.isIntersecting)), {
          rootMargin: "0px 0px -8px 0px",
        })
      : null;
    if (foot && io) io.observe(foot);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = past && !atFoot;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.08] bg-[color:var(--color-paper)]/95 backdrop-blur transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.65rem)" }}
    >
      <div className="flex items-center gap-3 px-4 pt-2.5">
        <span className="min-w-0 flex-1 text-[12px] leading-tight text-[color:var(--color-ink-3)]">
          {line}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-full bg-[color:var(--color-ink)] px-5 py-2.5 text-[14px] font-bold tracking-tight text-[color:var(--color-paper)]"
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
