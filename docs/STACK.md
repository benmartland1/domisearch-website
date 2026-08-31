# Blog CMS architecture — DomiSearch

A record of how the Sanity blog on domisearch.com is put together, why each
decision was made, and what to change before copying it onto a client build.

Written to be sense-checked. The "Known limitations" and "Things that bit us"
sections are the ones worth arguing with — the rest is description.

Built 31 August 2026.

---

## 1. The stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js, **App Router** | 15.5.15 |
| React | | 19 |
| Styling | Tailwind | v4 beta |
| CMS | Sanity, Studio embedded in the Next app | `sanity` 4.x |
| Sanity binding | `next-sanity` | **11.x** |
| Body format | Portable Text (`@portabletext/react` 4) | |
| Hosting | Vercel | |
| Language | TypeScript, strict | 5.6 |

**`next-sanity` version is a real constraint.** v13 (current at time of writing)
requires Next 16. v12 also requires Next 16. **v11 is the newest that supports
Next 15**, and it accepts `^15.1 || ^16`, so it survives a Next 16 upgrade
without a change. Anyone copying this onto a Next 16 project should use the
current major instead.

---

## 2. Shape of it

```
Writer → /studio (Sanity Studio, embedded)
            ↓ publish
       Sanity dataset (hosted)
            ↓ webhook (HMAC-signed)
       /api/revalidate → revalidateTag("post") + revalidatePath(...)
            ↓
       Next regenerates the affected static pages (~seconds)
```

The Studio is **not** a separate repo or deployment. It lives at
`app/studio/[[...tool]]/page.tsx` inside the same Next app, so schema changes
and the code that renders them ship together and cannot drift apart in version.

Pages are statically generated and stay cached until the webhook invalidates
them. There is no ISR time-based revalidation — invalidation is event-driven
only, which means no stale window and no needless rebuilds.

### Key files

| Path | Role |
|---|---|
| `sanity/schemaTypes/` | Content model |
| `sanity/lib/queries.ts` | All GROQ. Field sets shared between queries |
| `sanity/env.ts` | Env var handling; fails loudly on missing project ID |
| `lib/posts.ts` | Data layer. Every blog read goes through here |
| `components/PortableTextBody.tsx` | Body renderer |
| `app/api/revalidate/route.ts` | Webhook target |
| `app/studio/[[...tool]]/page.tsx` | The Studio (catch-all route is required) |
| `scripts/migrate-to-sanity.ts` | One-off MDX → Sanity migration |
| `scripts/verify-conversion.ts` | Offline fidelity check for that migration |

---

## 3. Content model

**`post`** — title, slug, excerpt, tldr, mainImage (alt required), body,
author (ref), category (ref), tags (string array), publishedAt, featured,
faqs (question/answer array), seo object (metaTitle, metaDescription,
canonicalUrl, noIndex).

**`author`** — name, slug, role, image, bio, linkedinUrl, sameAs.

**`category`** — title, slug, description.

### Body block types

Portable Text plus four custom types: `table`, `callout`, `divider`, `code`.

**`table` and `divider` exist because Portable Text has neither natively.** The
source posts contained 63 table rows and 5 horizontal rules; without custom
types those are silently destroyed on import. This is the single most common
way a markdown → Portable Text migration loses content, and it does so without
erroring.

**Every block type needs a matching serializer** in `PortableTextBody.tsx`. A
block type without one renders as *nothing* — no error, no warning, just
missing content. Schema and serializer must be changed together. Worth a lint
rule or a test if you productionise this.

### Deliberate additions beyond a stock model

- **`tags` alongside `category`.** A single category reference cannot express
  the 3–4 topical tags each post carries, which drive UI pills and
  `keywords` in Article schema.
- **`sameAs` on author.** Needed to keep Article schema's author node complete
  for entity recognition.
- **`tldr` as a field, not a heading convention.** See §6.

---

## 4. Rendering and SEO

The migration had to be invisible to readers and to search engines, so the
serializer emits the **same bare HTML the previous MDX pipeline did** —
headings, paragraphs, lists, tables and blockquotes as direct siblings, no
wrapper elements. The site's prose CSS styles by element and includes an
adjacent-sibling rule (`h2#tldr + p`) that breaks the instant anything is
wrapped.

**Heading anchors** are generated with `github-slugger` and shared between the
table of contents and the rendered headings via a `_key → id` map computed in
one pass. This matters twice over: it matches what `rehype-slug` produced
before, so existing deep links still resolve; and it makes it impossible for a
sidebar link to point at an anchor the body did not emit.

Generated from Sanity, all preserved from the previous setup:

- `Article`, `BreadcrumbList`, and conditional `FAQPage` schema
- meta title/description with fallbacks (seo.metaTitle → title, seo.metaDescription → excerpt)
- canonical, Open Graph (`type: article`, publishedTime, authors, tags), Twitter card
- `sitemap.xml` and `llms.txt`, both excluding `seo.noIndex` posts

### The FAQ resolution rule

Worth calling out as a pattern. Legacy posts expressed FAQs as `### Question?`
headings in the prose; new posts use the `faqs` field. `resolveFaqs()` returns
`{schema, visible}`:

- `faqs` populated → renders a visible FAQ section **and** FAQPage schema
- `faqs` empty → derives schema from body H3s, renders **nothing** visible

So legacy posts keep their structured data without duplicating content on the
page, and no post can ever display its questions twice. This let the migration
be byte-faithful while still giving new posts a proper field.

---

## 5. Migration approach

Relevant if the client has existing content.

1. **Enumerate the token set first.** Parsed every source file and listed every
   markdown construct actually used, before writing any converter. Nine posts
   used exactly: paragraph, heading, list, table, blockquote, hr; strong, em,
   codespan, link. No images, no code blocks.
2. **Hand-written converter** (`marked` lexer → Portable Text) rather than
   `@sanity/block-tools`. More code, but exact control over tables, and no
   jsdom dependency. It **throws on any construct it does not explicitly
   handle**, so a successful run proves nothing was silently dropped.
3. **Deterministic keys**, reset per document, so re-running produces identical
   documents rather than a fresh set of random `_key`s.
4. **`createOrReplace` with slug-derived IDs** — idempotent, safe to re-run.
5. **Offline fidelity check** (`verify-conversion.ts`) comparing source markdown
   against converted Portable Text on text, headings, link targets and table
   cells. Runs without touching Sanity.
6. **Before/after HTTP diff** — captured every rendered page, sitemap and
   llms.txt before starting, and diffed after.

Result: 9/9 posts passed the offline check; 8/9 rendered bodies were
byte-equivalent, the 9th differing only in one table cell losing bold.

**Ordering rule that matters:** production reads Sanity live. Any content
migration that changes how a page renders must run **after** the code that
renders it is deployed, or the live page breaks in the gap.

---

## 6. Things that bit us

Read this section before replicating.

**Vercel scopes env vars per environment.** Setting them on Production only
means Preview builds fail. Cost us a failed deploy. `sanity/env.ts` now says
this in the error message.

**`npx sanity init` created a second, duplicate project** and a standalone
Studio in a `domisearch/` subfolder (607MB, not gitignored). The webhook was
then created against the *wrong* project — correctly configured, attached to an
empty dataset, silently doing nothing. **Verify the project ID everywhere**;
two projects with the same display name are indistinguishable in the UI.

**Webhook URL must be the canonical host.** `domisearch.com` 307-redirects to
`www.` — pointing a signed webhook at the redirecting host makes delivery
depend on the signature header surviving the hop. Use the final host.

**CORS is a separate, manual, per-origin step.** The Studio route returns 200
without it; login just fails. Needs the production origin and `localhost:3000`,
both with credentials enabled.

**Vercel deployment protection** blocks preview URLs behind SSO, so preview
deployments cannot be tested by anything outside a browser session. Check it is
not enabled on *production*, or webhooks get bounced to a login redirect.

**`gray-matter` parses unquoted YAML dates into `Date` objects**, not strings.
This had produced a live bug: `article:published_time` was emitting
`"Thu May 28 2026 08:00:00 GMT+0800 (Central Indonesia Time)"` — a locale
string in the build machine's timezone, not ISO 8601.

**Date-only values need a time.** Frontmatter dates were stored at noon UTC, not
midnight, so they render on the correct calendar day regardless of server
timezone.

---

## 7. Known limitations

The honest list.

**No review/approval workflow.** Sanity's native drafts are binary: draft or
published. Anyone with Editor rights can publish. There is no
submit-for-review, no approval step, no notification. If a client needs
editorial sign-off, this stack does not provide it — that needs a custom
`status` field plus custom Studio actions, or Sanity's paid workflow tooling.
**This is the biggest gap for a client build** and should be raised before
choosing Sanity.

**Table cells are plain strings.** Simple to author, but inline formatting
inside a cell is not possible. Making cells Portable Text arrays would fix it
at real cost to the authoring experience.

**Schema/serializer coupling** is convention-enforced, not type-enforced.

**The migration script is bespoke.** It targets one specific markdown dialect
and will need rewriting per project. The *approach* generalises; the code does
not.

**Free tier has seat and API limits.** Check before promising a client seats.

**No visual preview of drafts.** Sanity supports live/presentation preview;
it is not wired up here. Writers see the Studio's editor, not the rendered page.

---

## 8. If replicating for a client

**Different by necessity:**

1. **Project ownership.** Create the Sanity project inside the *client's*
   organisation, or transfer it. Do not leave a client's content on a personal
   account. Decide who pays for the plan before starting.
2. **Dataset privacy.** This one is public — published content is readable
   without a token, which is fine for a public blog and means the site needs no
   read token at runtime. A client with unpublished-but-sensitive content wants
   a private dataset, which then *does* require a server-side token.
3. **Review workflow.** Ask early. If they need it, Sanity's native model does
   not cover it.
4. **Marketing page copy.** Scoped out here deliberately — only the blog is in
   the CMS. Clients often want more. Moving page copy into Sanity is a
   materially larger job than the blog, and worth pricing separately.

**Worth keeping:**

- Embedded Studio rather than a separate deployment — one repo, one deploy,
  no version drift
- Shared GROQ field sets so listing/detail/sitemap/llms.txt cannot disagree
- Data layer as the single read path
- Fail-loudly env validation with an actionable message
- Offline fidelity checking before any content migration
- Before/after HTTP diffing of sitemap and structured data
- Deterministic, idempotent migration scripts

**Checklist per project:** Sanity project + dataset → env vars in Vercel
(**all three environments**) → CORS origins (production + localhost, credentials
on) → webhook (canonical host, secret matching, filter + projection) → verify
delivery in the webhook log, not by assumption.

---

## 9. Open items on this build

- Revalidation route calls `revalidatePath('/blog/<slug>')` for `author` and
  `category` changes, where the slug is not a post slug. Harmless no-op, but
  sloppy — should be scoped to `_type == "post"`.
- `tldr` is structured data and could feed `llms.txt` as each article's direct
  answer, which currently uses the excerpt. Arguably the higher-value use of
  the field for AI citation.
- Stale CORS origins from setup (`localhost:3333`, an old preview URL) still
  carry credentials.
- `content/blog/*.mdx` and `lib/blog.ts` remain in the repo, unread, as
  migration source material. `scripts/new-post.ts` still generates MDX files
  nothing renders — a trap for future contributors.
