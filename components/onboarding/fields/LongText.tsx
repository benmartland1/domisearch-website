"use client";

import { useEffect, useRef } from "react";

export function LongText({
  id,
  value,
  onChange,
  onAdvance,
  placeholder,
  rows = 6,
  maxLength,
  autoFocus,
  labelledBy,
  describedBy,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onAdvance?: () => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  autoFocus?: boolean;
  labelledBy?: string;
  describedBy?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = window.setTimeout(() => ref.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  const remaining = maxLength ? maxLength - value.length : null;

  return (
    <div>
      <textarea
        id={id}
        ref={ref}
        className="ob-textarea"
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          // Enter belongs to the paragraph here. Cmd/Ctrl+Enter is the
          // universal "I'm done" for a multi-line field.
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onAdvance?.();
          }
        }}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--ob-muted)]">
        <span>Take as much space as you need.</span>
        {remaining !== null && remaining < 200 && <span>{remaining} characters left</span>}
      </div>
    </div>
  );
}
