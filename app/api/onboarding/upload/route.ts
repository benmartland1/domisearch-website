import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Client uploads for logos, brand guidelines and example content.
 *
 * The browser uploads straight to Vercel Blob and this route only mints the
 * token — a 25 MB brand guidelines PDF would not survive a round trip through
 * a serverless function body.
 *
 * Files land on public, unguessable URLs. That is a deliberate trade: the
 * client's designer needs to be able to open them, and nothing collected here
 * is a credential. Genuinely sensitive material should not go in a
 * questionnaire, and the copy on the upload screen says so.
 */
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "text/markdown",
];

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "File uploads aren't switched on yet. Paste a link instead, or send the files over by email and we'll attach them.",
      },
      { status: 501 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    // Deliberately no `onUploadCompleted`: the browser hands the blob URL
    // straight to the form, which writes it into the submission on the next
    // autosave, so there is nothing to reconcile. Adding the hook would also
    // break local development outright — Blob needs a publicly reachable
    // callback URL to call back to, and localhost has none.
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
        // Long enough for a slow mobile connection to finish a big PDF.
        validUntil: Date.now() + 60 * 60 * 1000,
      }),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[onboarding/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
