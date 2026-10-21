"use client";

import { useState } from "react";
import { Pause, Play } from "@/components/Icons";

const ITEMS = [
  { value: "50+", label: "brands served" },
  { value: "5", label: "AI platforms tracked daily" },
  { value: "90", label: "day initial programme" },
];

/** The slim green banner above the nav. The second group is a visual clone for the loop. */
export function Ticker() {
  const [paused, setPaused] = useState(false);
  const group = (hidden: boolean) => (
    <div className="ds-ticker-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((i) => (
        <span key={i.label} className="ds-ticker-item">
          <b>{i.value}</b> {i.label}
        </span>
      ))}
    </div>
  );
  return (
    <div
      className={`ds-ticker${paused ? " is-paused" : ""}`}
      aria-label="DomiSearch: over 50 brands served, five AI platforms tracked daily, 90-day initial programme"
    >
      <div className="ds-ticker-window">
        <div className="ds-ticker-track">
          {group(false)}
          {group(true)}
        </div>
      </div>
      <button
        type="button"
        className="ds-ticker-pause"
        aria-pressed={paused}
        aria-label={paused ? "Play agency information banner" : "Pause agency information banner"}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play size={12} /> : <Pause size={12} />}
      </button>
    </div>
  );
}
