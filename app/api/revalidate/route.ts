import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target. Publishing a post in the Studio clears the cache for
 * the pages that post appears on, so it is live within seconds rather than
 * waiting on a Vercel rebuild.
 *
 * The request is verified with SANITY_REVALIDATE_SECRET, which Sanity sends as
 * an HMAC signature over the raw body — not a bearer token in a header. An
 * unsigned or wrongly-signed request is rejected, so this endpoint is safe to
 * leave public (it has to be; Sanity calls it from its own infrastructure).
 *
 * Configured in sanity.io/manage → API → Webhooks. See CMS.md.
 */

export const runtime = "nodejs";
// The webhook must always execute; caching this route would defeat its purpose.
export const dynamic = "force-dynamic";

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string } | string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "Revalidation is not configured." }, { status: 500 });
  }

  let body: WebhookPayload | null = null;
  let isValidSignature = false;

  try {
    const parsed = await parseBody<WebhookPayload>(request, secret);
    body = parsed.body;
    // parseBody returns null when the request carried no signature at all.
    isValidSignature = parsed.isValidSignature === true;
  } catch (error) {
    console.error("[revalidate] could not read webhook body", error);
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!isValidSignature) {
    // Wrong or missing signature. Almost always a mismatched secret between
    // Vercel and the webhook's configuration in sanity.io/manage.
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json({ error: "Payload had no document type." }, { status: 400 });
  }

  const revalidated: string[] = [];

  // Everything the blog renders reads through the "post" tag, so clearing it
  // covers the listing, the post itself, related-post rails and any page that
  // counts posts. Authors and categories are referenced by posts, so a change
  // to either has to clear the same tag.
  if (["post", "author", "category"].includes(body._type)) {
    revalidateTag("post");
    revalidated.push("tag:post");

    const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
    if (slug) {
      revalidateTag(`post:${slug}`);
      revalidatePath(`/blog/${slug}`);
      revalidated.push(`/blog/${slug}`);
    }

    // These are generated from the post list, so they go stale on any publish.
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");
    revalidated.push("/blog", "/sitemap.xml", "/llms.txt");
  }

  return NextResponse.json({
    revalidated,
    type: body._type,
    now: Date.now(),
  });
}

/** A GET is a health check — useful for confirming the route deployed. */
export function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.SANITY_REVALIDATE_SECRET),
    hint: "Sanity sends a signed POST here. See CMS.md.",
  });
}
