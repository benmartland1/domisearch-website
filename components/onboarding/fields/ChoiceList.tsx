"use client";

import { useEffect } from "react";
import type { Option } from "@/lib/onboarding/types";

const KEYS = "ABCDEFGHIJ";

/**
 * Single and multi select, as full-width cards.
 *
 * Real radios and checkboxes underneath: arrow keys, space, screen-reader
 * announcements and form semantics all come free, and the card is only paint.
 * The A/B/C badges are a keyboard shortcut on top, not the mechanism.
 */
export function ChoiceList({
  options,
  multi,
  value,
  onChange,
  onAdvance,
  max,
  name,
  labelledBy,
  describedBy,
}: {
  options: Option[];
  multi?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  onAdvance?: () => void;
  max?: number;
  name: string;
  labelledBy?: string;
  describedBy?: string;
}) {
  const atMax = Boolean(multi && max && value.length >= max);

  function toggle(optionValue: string) {
    if (!multi) {
      onChange([optionValue]);
      // Picking one answer is the whole interaction; waiting for a Next tap
      // would be a step for the sake of a step. Short pause so the selection
      // is seen before the screen moves.
      window.setTimeout(() => onAdvance?.(), 260);
      return;
    }
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (!atMax) {
      onChange([...value, optionValue]);
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && target.getAttribute("type") !== "radio" && target.getAttribute("type") !== "checkbox") {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const index = KEYS.indexOf(event.key.toUpperCase());
      if (index < 0 || index >= options.length) return;
      event.preventDefault();
      toggle(options[index].value);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="flex flex-col gap-2.5"
    >
      {options.map((option, index) => {
        const selected = value.includes(option.value);
        const disabled = Boolean(atMax && !selected);
        return (
          <label
            key={option.value}
            className="ob-option"
            data-selected={selected}
            data-disabled={disabled || undefined}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={name}
              value={option.value}
              checked={selected}
              disabled={disabled}
              onChange={() => toggle(option.value)}
              className="sr-only"
            />
            <span className="ob-key" aria-hidden>
              {selected ? "✓" : KEYS[index]}
            </span>
            <span>
              <span className="ob-option-label">{option.label}</span>
              {option.hint && <span className="ob-option-hint block">{option.hint}</span>}
            </span>
          </label>
        );
      })}

      {multi && max && (
        <p className="mt-1 text-sm text-[color:var(--ob-muted)]" aria-live="polite">
          {value.length}/{max} chosen{atMax ? " — untick one to change your mind." : "."}
        </p>
      )}
    </div>
  );
}
