"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-transparent"
    >
      <div
        className="h-full bg-[color:var(--color-domigreen)] transition-[width] duration-150 ease-out"
        style={{
          width: `${pct}%`,
          boxShadow: "0 0 16px color-mix(in oklab, var(--color-domigreen) 60%, transparent)",
        }}
      />
    </div>
  );
}
