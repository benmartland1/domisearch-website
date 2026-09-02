"use client";

import type { SubField } from "@/lib/onboarding/types";
import { TextInput } from "./TextInput";

/**
 * Several short fields that together answer one question — the three
 * differentiators, or a developer's name and email. Still one screen: they are
 * one thought, and splitting them would be three screens of near-identical
 * boxes.
 */
export function FieldGroup({
  fields,
  value,
  onChange,
  onAdvance,
  labelledBy,
}: {
  fields: SubField[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onAdvance?: () => void;
  labelledBy?: string;
}) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id}>
          <label className="ob-label" htmlFor={`group-${field.id}`}>
            {field.label}
          </label>
          <TextInput
            id={`group-${field.id}`}
            size="sm"
            value={value[field.id] ?? ""}
            placeholder={field.placeholder}
            inputType={field.inputType}
            autoFocus={index === 0}
            onChange={(next) => onChange({ ...value, [field.id]: next })}
            onAdvance={onAdvance}
          />
        </div>
      ))}
    </div>
  );
}
