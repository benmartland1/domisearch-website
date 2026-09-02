"use client";

import { useMemo } from "react";
import type { Row, SubField } from "@/lib/onboarding/types";
import { TextInput } from "./TextInput";

const WIDTHS: Record<string, string> = {
  full: "sm:col-span-6",
  half: "sm:col-span-3",
  wide: "sm:col-span-3",
  narrow: "sm:col-span-2",
};

/**
 * Repeating rows — competitors, people to copy in.
 *
 * Seeded with empty rows so the shape of the answer is obvious without
 * reading the helper text. Empty rows are dropped on the way out, so a client
 * who adds one by accident is never told off for it.
 */
export function Repeater({
  fields,
  rows,
  onChange,
  addLabel,
  seed = 1,
  max,
  labelledBy,
  describedBy,
  autoFocus,
}: {
  fields: SubField[];
  rows: Row[];
  onChange: (rows: Row[]) => void;
  addLabel: string;
  seed?: number;
  max?: number;
  labelledBy?: string;
  describedBy?: string;
  autoFocus?: boolean;
}) {
  const visible = useMemo(() => {
    if (rows.length > 0) return rows;
    return Array.from({ length: seed }, () => ({}) as Row);
  }, [rows, seed]);

  function update(index: number, fieldId: string, value: string) {
    const next = visible.map((row, i) => (i === index ? { ...row, [fieldId]: value } : row));
    onChange(next);
  }

  const canAdd = !max || visible.length < max;

  return (
    <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy} className="flex flex-col gap-4">
      {visible.map((row, index) => (
        <div key={index} className="ob-card p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="ob-index">{index + 1}</span>
            {visible.length > 1 && (
              <button
                type="button"
                className="text-sm text-[color:var(--ob-muted)] underline-offset-4 hover:text-[color:var(--color-domigreen)] hover:underline"
                onClick={() => onChange(visible.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            {fields.map((field, fieldIndex) => (
              <div key={field.id} className={WIDTHS[field.width ?? "full"] ?? WIDTHS.full}>
                <label className="ob-label" htmlFor={`row-${index}-${field.id}`}>
                  {field.label}
                </label>
                <TextInput
                  id={`row-${index}-${field.id}`}
                  size="sm"
                  value={row[field.id] ?? ""}
                  placeholder={field.placeholder}
                  inputType={field.inputType}
                  autoFocus={autoFocus && index === 0 && fieldIndex === 0}
                  onChange={(value) => update(index, field.id, value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {canAdd && (
        <button type="button" className="ob-ghost-btn self-start" onClick={() => onChange([...visible, {}])}>
          <span aria-hidden>+</span> {addLabel}
        </button>
      )}
      {!canAdd && (
        <p className="text-sm text-[color:var(--ob-muted)]">
          That's the lot — {max} is plenty for us to work with.
        </p>
      )}
    </div>
  );
}
