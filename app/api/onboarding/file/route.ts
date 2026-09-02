import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { clientKey, throttled } from "@/lib/onboarding/throttle";
import { verifyFileSignature } from "@/lib/onboarding/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves an uploaded file.
 *
 * The blob store is private, so nothing a client uploads is readable from the
 * internet. This route is the only way back in: it checks an HMAC over the
 * blob's pathname, then streams the file through.
 *
 * The signature is what makes this safe to put in an email. Without it the
 * route would be an open proxy to the whole store — pathnames carry a random
 * suffix, but "hard to guess" is not an access control.
 */
export async function GET(request: Request) {
  if (throttled(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const params = new URL(request.url).searchParams;
  const pathname = params.get("p");
  const signature = params.get("sig");

  if (!pathname || !signature || !verifyFileSignature(pathname, signature)) {
    return NextResponse.json({ error: "That link isn't valid." }, { status: 404 });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result) {
      return NextResponse.json({ error: "That file is no longer here." }, { status: 404 });
    }

    const name = pathname.split("/").pop() ?? "download";
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.headers.get("content-type") ?? "application/octet-stream",
        // Inline so a PDF or an image opens in the browser rather than
        // landing in Downloads. The filename is quoted and stripped of
        // anything that could break out of the header.
        "Content-Disposition": `inline; filename="${name.replace(/[^\w.\- ]/g, "_")}"`,
        // A client's brand guidelines have no business in a shared cache.
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[onboarding/file]", err);
    return NextResponse.json({ error: "Couldn't fetch that file." }, { status: 502 });
  }
}
