"use client";

import { useRef, type ReactNode, type ComponentProps } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
} & Omit<ComponentProps<"div">, "ref">;

/**
 * Wraps children in a card that renders a radial spotlight
 * tracking the cursor. Respects prefers-reduced-motion.
 */
export function SpotlightCard({ children, className = "", as = "div", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      onMouseMove={onMouseMove}
      className={`spotlight ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
