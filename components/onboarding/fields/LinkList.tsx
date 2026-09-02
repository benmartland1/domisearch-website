"use client";

import { normaliseUrl } from "@/lib/onboarding/validation";
import { TextInput } from "./TextInput";

/** A list of URLs. Same idea as the repeater, with one field per row. */
export function LinkList({
  links,
  onChange,
  addLabel,
  max = 6,
  placeholder,
  labelledBy,
  describedBy,
  autoFocus,
  idPrefix = "link",
}: {
  links: string[];
  onChange: (links: string[]) => void;
  addLabel: string;
  max?: number;
  placeholder?: string;
  labelledBy?: string;
  describedBy?: string;
  autoFocus?: boolean;
  idPrefix?: string;
}) {
  const visible = links.length > 0 ? links : [""];

  return (
    <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy} className="flex flex-col gap-3">
      {visible.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <label className="sr-only" htmlFor={`${idPrefix}-${index}`}>
            Link {index + 1}
          </label>
          <div className="flex-1">
            <TextInput
              id={`${idPrefix}-${index}`}
              size="sm"
              inputType="url"
              value={link}
              placeholder={placeholder}
              autoFocus={autoFocus && index === 0}
              onChange={(value) => onChange(visible.map((l, i) => (i === index ? value : l)))}
            />
          </div>
          {visible.length > 1 && (
            <button
              type="button"
              className="ob-icon-btn"
              aria-label={`Remove link ${index + 1}`}
              onClick={() => onChange(visible.filter((_, i) => i !== index))}
            >
              <span aria-hidden>×</span>
            </button>
          )}
        </div>
      ))}

      {visible.length < max && (
        <button
          type="button"
          className="ob-ghost-btn self-start"
          onClick={() => onChange([...visible.map(normaliseUrl), ""])}
        >
          <span aria-hidden>+</span> {addLabel}
        </button>
      )}
    </div>
  );
}
