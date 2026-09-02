"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";
import type { UploadedFile } from "@/lib/onboarding/types";

const MAX_BYTES = 25 * 1024 * 1024;

function readableSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Uploads straight to Vercel Blob from the browser.
 *
 * Going through our own API would cap files at the serverless body limit,
 * which a brand guidelines PDF clears without trying. If blob storage isn't
 * configured the component says so and points at the link field instead of
 * failing silently — an upload that quietly does nothing is the worst
 * outcome here.
 */
export function FileDrop({
  label,
  accept,
  files,
  onChange,
  describedBy,
}: {
  label: string;
  accept?: string;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  describedBy?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setError(null);

    const accepted: UploadedFile[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is ${readableSize(file.size)} — the limit is 25 MB. Send anything bigger to hi@domisearch.com and we'll attach it for you.`);
        continue;
      }
      setBusy(file.name);
      try {
        const blob = await upload(file.name, file, {
          // The store is private: nothing uploaded here is readable without a
          // signed link, and the browser never gets one.
          access: "private",
          handleUploadUrl: "/api/onboarding/upload",
          // Multipart keeps a large file on a flaky mobile connection alive.
          multipart: file.size > 8 * 1024 * 1024,
        });
        accepted.push({ name: file.name, pathname: blob.pathname, size: file.size, type: file.type });
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : `Couldn't upload ${file.name}. Try again, or paste a link instead.`,
        );
      } finally {
        setBusy(null);
      }
    }

    if (accepted.length > 0) onChange([...files, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="ob-label" htmlFor={inputId}>
        {label}
      </label>

      <div
        className="ob-card flex flex-col items-center justify-center gap-2 px-5 py-7 text-center transition-colors"
        style={dragging ? { borderColor: "var(--color-domigreen)" } : undefined}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={accept}
          aria-describedby={describedBy}
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <button type="button" className="ob-ghost-btn" onClick={() => inputRef.current?.click()} disabled={Boolean(busy)}>
          {busy ? `Uploading ${busy}…` : "Choose files"}
        </button>
        <p className="text-sm text-[color:var(--ob-muted)]">
          Or drop them here. Up to 25 MB each.
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            /* Filename only, not a link: the file is private and the browser
               has no signed URL for it. They uploaded it a second ago — what
               they need is confirmation it arrived and a way to undo. */
            <li key={file.pathname} className="ob-card flex items-center justify-between gap-3 px-4 py-3">
              <span className="min-w-0">
                <span className="flex items-center gap-2 truncate text-[color:var(--color-glacier)]">
                  <span aria-hidden className="text-[color:var(--color-domigreen)]">✓</span>
                  {file.name}
                </span>
                <span className="text-xs text-[color:var(--ob-muted)]">{readableSize(file.size)} · uploaded</span>
              </span>
              <button
                type="button"
                className="ob-icon-btn"
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange(files.filter((f) => f.pathname !== file.pathname))}
              >
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="ob-error mt-3" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
