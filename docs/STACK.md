# domisearch.com — full site architecture

How the whole site is built, hosted, and edited. Written so another engineer or
agent can understand it cold, sense-check the decisions, and judge what is worth
copying onto a client build.

Sections 6–13 cover the blog CMS specifically. Sections 14–16 are the honest
assessment — limitations, traps, and what to change when replicating.

Accurate as of 31 August 2026.

---

## 1. What this is

Marketing site for DomiSearch, a UK search agency (Google Ads + AI Engine
Optimisation). Roughly 25 public pages, a blog on a headless CMS, several
lead-capture funnels, and one AI-powered lead magnet.

It is a **content and lead-generation site**, not an application. No user
accounts, no database, no authenticated area other than the CMS.

---

## 2. Hosting and deployment

| | |
|---|---|
| Host | **Vercel** |
| Region | `lhr1` (London) — pinned in `vercel.json` |
| Repo | `benmartland1/domisearch-website` (GitHub, private) |
| Deploys | Automatic on push to `main`. Branch pushes get preview deployments |
| Canonical host | **`https://www.domisearch.com`** — the bare domain 307-redirects to `www` |
| DNS/domain | Managed via Vercel |
| Preview protection | Vercel SSO on preview deployments; **not** on production |

`lib/site.ts` force-rewrites any bare-domain value of `NEXT_PUBLIC_SITE_URL` to
the `www` form, so canonicals, sitemap and schema cannot disagree with what
Vercel actually serves.

### Security headers

Set in `vercel.json` for all routes: `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (camera/mic/geolocation denied), and HSTS with
`preload`. Fonts and brand assets get a one-year immutable cache.

---

## 3. Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js, **App Router** (no `pages/`) | 15.5.15 |
| React | | 19 |
| Language | TypeScript, `strict: true` | 5.6 |
| Styling | Tailwind | **v4 beta** |
| Animation | `motion` (Framer Motion successor) | 11 |
| CMS | Sanity, Studio embedded in the app | `sanity` 4.x |
| Sanity binding | `next-sanity` | **11.x** |
| Body format | Portable Text | `@portabletext/react` 4 |
| Transactional email | Resend | 4 |
| Validation | Zod | 3 |

**Two version constraints worth knowing.** `next-sanity` v12 and v13 both
require Next 16; **v11 is the newest that supports Next 15**, and it accepts
`^15.1 || ^16` so it survives the upgrade. Tailwind is on a **beta**, which is a
standing risk on a production site.

---

## 4. Route map

**Marketing** — `/`, `/about`, `/pricing`, `/careers`, `/contact`,
`/privacy`, `/terms`

**Services** — `/services/google-ads`, `/services/aeo`

**Vertical landing pages** — `/recruitment`, `/accountants`, `/aesthetics`
(cream-surfaced, own light nav, no global header/footer)

**Blog** — `/blog`, `/blog/[slug]` (9 posts, Sanity-backed)

**Case studies** — `/case-studies/[slug]` (MDX, 1 study), plus a gated funnel at
`/taxd-case-study` → `/taxd-case-study/unlocked`

**Lead magnets** —
`/ai-visibility-report` → `/ai-visibility-report/thank-you`,
`/ai-visibility-roadmap` → `/ai-visibility-roadmap/thanks` (£99, Stripe),
`/visibility` (internal AI visibility tool)

**CMS** — `/studio` (Sanity Studio)

**Generated** — `/sitemap.xml`, `/robots.txt`, `/llms.txt`

`llms.txt` is a deliberate AEO artefact: a plain-text summary of the company,
services, case studies and every article, written for AI crawlers.

### Layout chrome

`components/LayoutChrome.tsx` holds a `BARE_ROUTES` list. Routes on it render
full-bleed with no global header or footer — the vertical landing pages, the
paid-traffic funnels, and `/studio`. Everything else gets the standard chrome.

### Redirects

~20 permanent redirects in `next.config.mjs`, mapping old Framer URLs (the
previous site) to current equivalents. Kept to preserve backlinks and AI
citations.

---

## 5. Where content lives

This split matters more than anything else in this document.

| Content | Source | Editable without a developer? |
|---|---|---|
| **Blog posts** | **Sanity** | **Yes — `/studio`** |
| **Authors, categories** | **Sanity** | **Yes** |
| Case studies | `content/case-studies/*.mdx` | No |
| Testimonials | Hardcoded array in `components/Testimonials.tsx` | No |
| Marketing page copy | Hardcoded in each page component | No |
| FAQ blocks on marketing pages | Hardcoded arrays in each page | No |
| Site-wide config (nav, contact, clients) | `lib/site.ts` | No |
| Author bio fallbacks | `lib/authors.ts` | No |

**Only the blog is in the CMS.** That was a deliberate scope decision, not an
oversight. Some marketing pages are very large — `/accountants` is 1,420 lines
and `/recruitment` 1,163 — and are bespoke layouts rather than editable
documents. Moving them into a CMS is a materially bigger job than the blog and
should be priced separately.

---

## 6. CMS access

**URL:** `https://www.domisearch.com/studio`

**Auth:** Sanity accounts, not site accounts. Sign in with Google/GitHub/email
against the Sanity project. There is no separate password.

**Adding an editor:** [sanity.io/manage](https://sanity.io/manage) → the
DomiSearch project → **Members → Invite member** → role **Editor**. They create
a free Sanity account and sign in at `/studio`. Removing them there revokes
access immediately.

**Roles:** Administrator (everything, including tokens and members), Editor
(create/edit/publish/delete content), Viewer (read only).

**Sanity project ID:** `e0ox5a49`, dataset `production` (public).

> The dataset being public means published content is readable without a token,
> which is why the site needs no read token at runtime. Drafts are *not* public.

**CORS matters and is easy to miss.** Sanity only accepts browser requests from
approved origins. Without the production origin registered (with credentials
enabled), `/studio` loads but login silently fails. Currently registered:
`https://www.domisearch.com`, `http://localhost:3000`, plus two stale entries.

Editor-facing instructions live in [`CMS.md`](../CMS.md).

---

## 7. Blog architecture

```
Writer → /studio (Sanity Studio, embedded in this Next app)
            ↓ publish
       Sanity dataset (hosted)
            ↓ webhook, HMAC-signed
       /api/revalidate → revalidateTag("post") + revalidatePath(...)
            ↓
       Next regenerates the affected static pages (~seconds)
```

The Studio is **not** a separate repo or deployment. It lives at
`app/studio/[[...tool]]/page.tsx` in the same app, so the schema and the code
that renders it ship together and cannot drift apart in version.

Pages are statically generated and stay cached until the webhook invalidates
them. There is no time-based ISR — invalidation is event-driven only, so there
is no stale window and no needless rebuilds.

### Key files

| Path | Role |
|---|---|
| `sanity/schemaTypes/` | Content model |
| `sanity/lib/queries.ts` | All GROQ; field sets shared between queries |
| `sanity/env.ts` | Env handling; fails loudly on missing project ID |
| `lib/posts.ts` | Data layer — every blog read goes through here |
| `components/PortableTextBody.tsx` | Body renderer |
| `app/api/revalidate/route.ts` | Webhook target |
| `scripts/migrate-to-sanity.ts` | One-off MDX → Sanity migration |
| `scripts/verify-conversion.ts` | Offline fidelity check for that migration |

---

## 8. Content model

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
types those are silently destroyed on import. This is the most common way a
markdown → Portable Text migration loses content, and it does so without
erroring.

**Every block type needs a matching serializer** in `PortableTextBody.tsx`. A
block type without one renders as *nothing* — no error, no warning. Schema and
serializer must change together. Worth a test if you productionise this.

### Deliberate additions beyond a stock model

- **`tags` alongside `category`** — a single reference cannot express the 3–4
  topical tags each post carries, which drive UI pills and Article `keywords`.
- **`sameAs` on author** — keeps the Article schema author node complete for
  entity recognition.
- **`tldr` as a field, not a heading convention** — see §11.

---

## 9. Rendering and SEO

The migration had to be invisible to readers and search engines, so the
serializer emits the **same bare HTML the previous MDX pipeline did** —
headings, paragraphs, lists, tables and blockquotes as direct siblings, no
wrappers. The prose CSS styles by element and includes an adjacent-sibling rule
(`h2#tldr + p`) that breaks the instant anything is wrapped.

**Heading anchors** use `github-slugger`, shared between the table of contents
and the rendered headings via a `_key → id` map computed in one pass. This
matches what `rehype-slug` produced before (so existing deep links resolve) and
makes it impossible for a sidebar link to point at an anchor the body never
emitted.

Generated from Sanity: `Article`, `BreadcrumbList` and conditional `FAQPage`
schema; meta title/description with fallbacks; canonical; Open Graph
(`type: article`, publishedTime, authors, tags); Twitter card; `sitemap.xml`
and `llms.txt` (both excluding `seo.noIndex` posts).

Site-wide `Organization`, `WebSite`, `ProfessionalService`, `Person`,
`Service` and `ContactPage` schema live in `lib/schema.ts`.

### The FAQ resolution rule

Legacy posts expressed FAQs as `### Question?` headings in prose; new posts use
the `faqs` field. `resolveFaqs()` returns `{schema, visible}`:

- `faqs` populated → visible FAQ section **and** FAQPage schema
- `faqs` empty → schema derived from body H3s, **nothing** rendered visibly

Legacy posts keep their structured data without duplicating content, and no post
can ever display its questions twice.

---

## 10. Integrations

| Service | Used for | Key |
|---|---|---|
| **Resend** | All transactional email — contact, newsletter, audit and report requests, case-study leads | `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` |
| **Anthropic** | Generates search prompts for the AI visibility checker (`claude-sonnet-4-5`) | `ANTHROPIC_API_KEY` |
| **OpenAI** | Queries `gpt-4o` to see whether the brand appears in AI answers | `OPENAI_API_KEY` |
| **Stripe** | £99 AI Visibility Roadmap, via a hosted Payment Link (no Stripe SDK) | `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` |
| **Meta Pixel** | Conversion tracking. Pixel ID **hardcoded** in `components/MetaPixel.tsx` | — |
| **Vercel Analytics + Speed Insights** | Traffic and Core Web Vitals | — |
| **GitHub API** | `repository_dispatch` to trigger report generation | `GITHUB_DISPATCH_TOKEN` |
| **Calendly** | Discovery-call booking (plain link) | — |

### API routes

| Route | Does |
|---|---|
| `/api/contact` | Contact form → Resend |
| `/api/newsletter` | Newsletter signup → Resend audience |
| `/api/audit-request` | Audit request form → Resend |
| `/api/report-request` | Report request → Resend + GitHub dispatch |
| `/api/case-study-lead` | Gated case-study unlock → Resend |
| `/api/visibility` | AI visibility checker — Claude generates prompts, GPT-4o answers them. Password-gated |
| `/api/visibility/debug` | Diagnostic, gated by `VISIBILITY_PASSWORD` |
| `/api/revalidate` | Sanity webhook target |

All form routes validate with Zod before sending.

---

## 11. Design system

**Fonts** — Axiforma (Book/Medium/SemiBold/Bold) as the display and body face,
self-hosted as woff2 with a preload hint on the critical weight. Homemade Apple
and Zeyada for handwritten accents.

**Colour tokens** — CSS custom properties in `globals.css`:
`--color-charcoal`, `--color-ink`, `--color-ink-2`, `--color-ink-3`,
`--color-paper`, `--color-paper-2`, `--color-domigreen`, `--color-pine`,
`--color-sage`, `--color-fog`, `--color-glacier`, `--color-ash`.

**The dark/paper pattern** — the site alternates dark sections against cream
"paper" sections, joined by explicit seam elements. Blog posts use a dark hero
then a paper body (`.prose-paper`). Prose is styled **by element**, not by
utility classes, which is why the Portable Text serializer must emit bare HTML.

**58 components** in `components/`, grouped into `ui/`, `landing/`, and
`verticals/`.

### Feature flags

Two env-based flags let unfinished content ship dark:
`NEXT_PUBLIC_SHOW_TERRITORIES` and `NEXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIAL`
(both default off, enabled per-environment).

---

## 12. Environment variables

| Variable | Purpose | Secret |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin | No |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project. **Required — build fails without it** | No |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production` | No |
| `SANITY_API_READ_TOKEN` | Draft reads. Not needed for a public dataset | **Yes** |
| `SANITY_REVALIDATE_SECRET` | Verifies the webhook signature | **Yes** |
| `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` | Email | **Yes** |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Form routing | No |
| `ANTHROPIC_API_KEY` | Visibility checker | **Yes** |
| `OPENAI_API_KEY` | Visibility checker | **Yes** |
| `VISIBILITY_PASSWORD` | Gates the visibility tool | **Yes** |
| `GITHUB_DISPATCH_TOKEN` | Triggers report generation | **Yes** |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Roadmap checkout | No |
| `NEXT_PUBLIC_SHOW_TERRITORIES` | Feature flag | No |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIAL` | Feature flag | No |

**Vercel scopes env vars per environment.** Setting one on Production only means
Preview builds fail. This cost a failed deploy during setup.

> **Gap:** `.env.example` is missing `OPENAI_API_KEY`, `VISIBILITY_PASSWORD`,
> `GITHUB_DISPATCH_TOKEN`, `NEXT_PUBLIC_SANITY_API_VERSION` and both feature
> flags. A fresh clone would not know it needs them. Worth fixing.

---

## 13. Migration approach

Relevant if a client has existing content to move.

1. **Enumerate the token set first** — parse every source file and list every
   markdown construct actually used, before writing a converter.
2. **Hand-written converter** (`marked` lexer → Portable Text) rather than
   `@sanity/block-tools`. More code, exact control over tables, no jsdom. It
   **throws on any construct it does not handle**, so a successful run proves
   nothing was silently dropped.
3. **Deterministic keys**, reset per document, so re-runs produce identical
   documents rather than new random `_key`s.
4. **`createOrReplace` with slug-derived IDs** — idempotent.
5. **Offline fidelity check** comparing source markdown to converted Portable
   Text on text, headings, link targets and table cells.
6. **Before/after HTTP diff** of every rendered page, sitemap and llms.txt.

Result: 9/9 posts passed the offline check; 8/9 rendered bodies were
byte-equivalent, the 9th differing only in one table cell losing bold.

**Ordering rule:** production reads Sanity live. A content migration that
changes how a page renders must run **after** the code that renders it is
deployed, or the live page breaks in the gap.

---

## 14. Things that bit us

**`npx sanity init` created a second, duplicate project** with an identical
display name, plus a standalone Studio in a subfolder (607MB, not gitignored).
The webhook was then created against the *wrong* project — perfectly
configured, attached to an empty dataset, silently doing nothing. Nothing
errors; posts just never appear. **Verify the project ID everywhere.**

**Vercel env vars are per-environment.** See §12.

**Webhook URL must be the canonical host.** Pointing a signed webhook at a
redirecting host makes delivery depend on the signature surviving the hop.

**CORS is a separate manual step.** `/studio` returns 200 without it; login just
fails.

**Vercel deployment protection** puts preview URLs behind SSO, so they cannot be
tested by anything outside a browser session. Confirm it is off for
*production*, or webhooks get bounced to a login redirect.

**`gray-matter` parses unquoted YAML dates into `Date` objects.** This had
produced a live bug: `article:published_time` was emitting
`"Thu May 28 2026 08:00:00 GMT+0800 (Central Indonesia Time)"` — a locale string
in the build machine's timezone, not ISO 8601.

**Date-only values need a time.** Dates are stored at noon UTC so they render on
the correct calendar day regardless of server timezone.

---

## 15. Known limitations

**No review/approval workflow.** Sanity's native drafts are binary. Anyone with
Editor rights can publish; there is no submit-for-review, no approval, no
notification. **This is the biggest gap for a client build** and should be
raised before choosing Sanity. It needs a custom `status` field plus custom
Studio actions, or Sanity's paid workflow tooling.

**Tailwind v4 is a beta** on a production site.

**Meta Pixel ID is hardcoded**, not an env var — it would need changing in code
per deployment.

**Marketing copy is not editable** without a developer. See §5.

**Table cells are plain strings** — no inline formatting inside a cell.

**Schema/serializer coupling** is convention-enforced, not type-enforced.

**The migration script is bespoke** to one markdown dialect. The approach
generalises; the code does not.

**No visual preview of drafts.** Sanity supports presentation/live preview; it
is not wired up.

**Free tier seat and API limits** — check before promising a client seats.

**Testimonials are hardcoded and unattributed in the CMS**, so social proof
cannot be updated by the client.

---

## 16. If replicating for a client

**Change by necessity:**

1. **Project ownership.** Create the Sanity project in the *client's*
   organisation, or transfer it. Do not leave a client's content on your
   personal account. Agree who pays for the plan up front.
2. **Dataset privacy.** This one is public, which is fine for a public blog and
   means no runtime read token. A client with sensitive unpublished content
   wants a private dataset — which then *does* require a server-side token.
3. **Review workflow.** Ask early. Sanity's native model does not cover it.
4. **Scope of what's editable.** Clients usually expect more than the blog.
   Decide explicitly what goes in the CMS and price it.
5. **Hardcoded IDs** — Meta Pixel, and anything else brand-specific, needs
   extracting to env vars.

**Worth keeping:**

- Embedded Studio rather than a separate deployment — one repo, one deploy, no
  version drift
- Shared GROQ field sets so listing/detail/sitemap/llms.txt cannot disagree
- A single data layer as the only read path
- Fail-loudly env validation with an actionable error message
- Offline fidelity checking before any content migration
- Before/after HTTP diffing of sitemap and structured data
- Deterministic, idempotent migration scripts
- `llms.txt` and thorough schema.org coverage — cheap, and the whole point for
  an AEO-focused client

**Per-project checklist:** Sanity project + dataset → env vars in Vercel (**all
three environments**) → CORS origins (production + localhost, credentials on) →
webhook (canonical host, matching secret, filter + projection) → **verify
delivery in the webhook log, not by assumption**.

---

## 17. Open items on this build

- `.env.example` is missing six variables the code reads (§12).
- Revalidation route calls `revalidatePath('/blog/<slug>')` for `author` and
  `category` changes, where the slug is not a post slug. Harmless no-op, but
  sloppy.
- `tldr` is structured data and could feed `llms.txt` as each article's direct
  answer, which currently uses the excerpt.
- Stale CORS origins (`localhost:3333`, an old preview URL) still carry
  credentials.
- `content/blog/*.mdx` and `lib/blog.ts` remain in the repo, unread, as
  migration source. `scripts/new-post.ts` still generates MDX files nothing
  renders — a trap for future contributors.
- Tailwind should move off beta before this pattern is sold to clients.
