"use client";

import { SECTIONS } from "@/lib/onboarding/questions";
import type { SectionId } from "@/lib/onboarding/types";

/**
 * Where they are, by section, plus a bar for the overall run.
 *
 * Section names rather than "Question 14 of 27": the number is discouraging
 * and the names tell them what's left. On mobile the full list won't fit, so
 * it collapses to the current section and a count.
 */
export function ProgressRail({
  currentSection,
  ratio,
  saveState,
}: {
  currentSection: SectionId | null;
  ratio: number;
  saveState: "idle" | "saving" | "saved" | "offline";
}) {
  const currentIndex = currentSection ? SECTIONS.findIndex((s) => s.id === currentSection) : -1;

  return (
    <div className="w-full">
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        {/* Desktop: the whole map. */}
        <ol className="hidden items-center gap-4 sm:flex">
          {SECTIONS.map((section, index) => (
            <li
              key={section.id}
              className="ob-section-dot"
              data-state={index === currentIndex ? "current" : index < currentIndex ? "done" : "todo"}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              {section.title}
            </li>
          ))}
        </ol>

        {/* Mobile: just where you are. */}
        <p className="ob-section-dot sm:hidden" data-state="current" aria-current="step">
          {currentIndex >= 0
            ? `${SECTIONS[currentIndex].title} · ${currentIndex + 1} of ${SECTIONS.length}`
            : "Getting started"}
        </p>

        <p
          className="text-xs text-[color:var(--ob-muted)] transition-opacity"
          style={{ opacity: saveState === "idle" ? 0 : 1 }}
          aria-live="polite"
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "offline" && "Saved on this device"}
        </p>
      </div>

      <div
        className="ob-progress-track"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      >
        <div className="ob-progress-fill" style={{ width: `${Math.max(2, Math.round(ratio * 100))}%` }} />
      </div>
    </div>
  );
}
