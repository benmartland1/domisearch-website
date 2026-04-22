"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** The numeric value to count up to */
  value: number;
  /** A prefix (e.g. "£", "−") rendered before the number */
  prefix?: string;
  /** A suffix (e.g. "%", "+", "×") rendered after the number */
  suffix?: string;
  /** Count duration in ms */
  duration?: number;
  /** Render the number with a thousands separator */
  separator?: boolean;
  /** Decimal places to render */
  decimals?: number;
  className?: string;
};

export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  separator = true,
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min((now - start) / duration, 1);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(step);
              else setDisplay(value);
            };
            requestAnimationFrame(step);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  const formatted = display.toLocaleString("en-GB", {
    useGrouping: separator,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
