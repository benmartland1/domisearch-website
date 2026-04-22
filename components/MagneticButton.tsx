"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  /** Max pixels of magnetic offset */
  strength?: number;
};

/**
 * A link that subtly pulls toward the cursor when hovered.
 * Respects prefers-reduced-motion via CSS (the inner span is scoped so
 * the base btn transform keeps working).
 */
export function MagneticButton({ href, children, className, target, rel, strength = 10 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty("--mx", `${(x / rect.width) * strength}px`);
    el.style.setProperty("--my", `${(y / rect.height) * strength}px`);
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`magnetic ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
