"use client";

import { useEffect, useRef } from "react";
import { normaliseUrl } from "@/lib/onboarding/validation";

export function TextInput({
  id,
  value,
  onChange,
  onAdvance,
  inputType = "text",
  placeholder,
  autoComplete,
  maxLength,
  autoFocus,
  invalid,
  labelledBy,
  describedBy,
  size = "lg",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onAdvance?: () => void;
  inputType?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  autoFocus?: boolean;
  invalid?: boolean;
  labelledBy?: string;
  describedBy?: string;
  size?: "lg" | "sm";
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    // A tick after the screen transition starts, or iOS Safari scrolls the
    // outgoing screen back into view as the keyboard opens.
    const timer = window.setTimeout(() => ref.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  return (
    <input
      id={id}
      ref={ref}
      className={size === "lg" ? "ob-input" : "ob-input ob-input--sm"}
      /* `type=url` and `type=email` bring their own browser validation bubbles,
         which fire before ours and say less. We keep the mobile keyboard hint
         via inputMode and do the validating ourselves. */
      type={inputType === "email" ? "email" : "text"}
      inputMode={inputType === "tel" ? "tel" : inputType === "email" ? "email" : inputType === "url" ? "url" : undefined}
      autoCapitalize={inputType === "email" || inputType === "url" ? "off" : "sentences"}
      autoCorrect={inputType === "email" || inputType === "url" ? "off" : undefined}
      spellCheck={inputType === "email" || inputType === "url" ? false : undefined}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={maxLength}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      onChange={(event) => onChange(event.target.value)}
      onBlur={() => {
        // Nobody types the scheme. Fix it when they look away, not while
        // they're mid-word.
        if (inputType === "url" && value.trim()) {
          const tidied = normaliseUrl(value);
          if (tidied !== value) onChange(tidied);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (inputType === "url" && value.trim()) onChange(normaliseUrl(value));
          onAdvance?.();
        }
      }}
    />
  );
}
