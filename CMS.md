# The blog CMS

The blog runs on [Sanity](https://www.sanity.io). Posts are written in a Studio built into this site at **[domisearch.com/studio](https://domisearch.com/studio)** — there is no separate application and no second repository.

Marketing pages (home, services, pricing, about, the vertical landing pages) are **not** in the CMS. They live in code and are changed by a developer.

---

## Writing a post

1. Go to **/studio** and sign in.
2. **Posts → Create new**.
3. Fill in the three tabs:

**Content** — title, URL, summary, main image, body, FAQs.

**Details** — author, category, tags, publish date, and the Featured toggle.

**SEO** — search title, search description, canonical URL, and the hide-from-search switch. All four are optional; leave them blank and sensible defaults are used.

4. Click **Publish**.

The post is live in a few seconds. You do not need a developer, and nothing needs to be deployed.

### The fields that matter most

| Field | Why it matters |
|---|---|
| **URL** | The address the post lives at. Once a post is live, **do not change it** — every link to it breaks and its search ranking resets. |
| **Summary** | Read on the blog listing before someone decides to click, used as the fallback meta description, and quoted verbatim in `llms.txt`, which is what AI assistants read. It does more work than its size suggests. |
| **FAQs** | Question and answer pairs. These render at the end of the post *and* generate FAQPage schema, which is what puts the post into AI answers and Google's FAQ results. Answer outright in the first sentence. |
| **Tags** | The first tag labels the post's card elsewhere on the site. Reuse existing tags rather than inventing near-duplicates. |
| **Featured** | Pins the post to the large card at the top of `/blog`. If nothing is flagged, the newest post takes that slot. |

### Drafts

Sanity keeps every unpublished change as a draft automatically. A draft is invisible to the public site — it is not on `/blog`, not in `sitemap.xml`, not in `llms.txt`, and not reachable by URL. **Nothing goes live until you click Publish.**

Editing a post that is already live creates a new draft alongside it. The published version stays up, unchanged, until you publish again.

> **One thing to know:** Sanity has no submit-for-review step. Anyone who can edit can publish. If you need approval before something goes live, that has to be a human agreement, not something the tool enforces.

### Body blocks

Beyond normal text, headings and lists, the body supports:

- **Table** — a header row plus data rows. Cells are plain text.
- **Callout** — a highlighted note, tip or warning.
- **Image** — alt text is required, because it is not optional for accessibility or for search.
- **Code block** — with syntax highlighting.
- **Divider** — a horizontal rule between sections.

Do not add a heading for the post title. The title field already is the page's H1; start your sections at **Heading** (H2).

---

## Inviting the team

1. Go to [sanity.io/manage](https://sanity.io/manage) and pick the DomiSearch project.
2. **Members → Invite member**, enter their email, choose a role, send.
3. They get an email, create a free Sanity account, and then sign in at **/studio**.

Roles worth knowing:

| Role | Can do |
|---|---|
| **Administrator** | Everything, including managing members and tokens. Keep this to yourself. |
| **Editor** | Create, edit, publish and delete content. The right role for a writer you trust to publish. |
| **Viewer** | Read only. |

Sanity's free plan includes a limited number of seats. Check the current allowance on the Members screen before promising someone access.

Removing a member from sanity.io/manage revokes their access immediately.

---

## How publishing reaches the live site

```
Studio              Sanity              /api/revalidate         Live site
──────              ──────              ───────────────         ─────────
click Publish  →    document saved  →   webhook fires      →    page rebuilt
                                        (signed request)        ~seconds
```

The site is statically generated, so pages are cached until something tells them to refresh. That "something" is a webhook: Sanity calls `/api/revalidate` on every publish, and that route clears the cache for the affected post, the blog listing, `sitemap.xml` and `llms.txt`.

Without the webhook, published posts would only appear on the next deploy. With it, no deploy is needed.

### Webhook configuration

Set up once, in [sanity.io/manage](https://sanity.io/manage) → **API → Webhooks → Create webhook**:

| Setting | Value |
|---|---|
| Name | `Revalidate site` |
| URL | `https://domisearch.com/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "post" \|\| _type == "author" \|\| _type == "category"` |
| Projection | `{_type, slug}` |
| HTTP method | `POST` |
| API version | `v2026-08-31` |
| Secret | the value of `SANITY_REVALIDATE_SECRET` |

The secret must match `SANITY_REVALIDATE_SECRET` in Vercel exactly. Sanity signs the request body with it, and the route rejects anything whose signature does not verify — so a mismatch shows up as published posts not appearing, and a `401` in the webhook's delivery log.

To check the route is deployed at all, open `https://domisearch.com/api/revalidate` in a browser. It should return `{"ok":true,"configured":true}`.

---

## Environment variables

Set in Vercel under **Settings → Environment Variables**, for Production, Preview and Development. Documented in [.env.example](.env.example).

| Variable | Value | Secret |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | The project ID from sanity.io/manage | No — ships in the browser bundle |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | No |
| `SANITY_API_READ_TOKEN` | An **Editor** token from sanity.io/manage → API → Tokens | **Yes** |
| `SANITY_REVALIDATE_SECRET` | Any random string; generate with `openssl rand -hex 32` | **Yes** |

The build fails fast and loudly if the project ID or dataset is missing, which is deliberate — a site that built without them would silently serve a blog with no posts.

---

## For developers

| Path | What it is |
|---|---|
| `sanity/schemaTypes/` | The content model. `post`, `author`, `category`, plus the `blockContent` body and its custom `table`, `callout` and `divider` blocks. |
| `sanity/lib/queries.ts` | Every GROQ query. Field sets are shared so the listing, post page, sitemap and `llms.txt` cannot disagree about what a post is. |
| `lib/posts.ts` | The data layer. All blog reads go through here. |
| `components/PortableTextBody.tsx` | Renders a post body. Emits the same bare HTML the old MDX pipeline did, because `.prose-paper` in `globals.css` styles by element. |
| `app/api/revalidate/route.ts` | The webhook target. |
| `scripts/migrate-to-sanity.ts` | The one-off MDX → Sanity migration. Kept for reference; safe to re-run. |
| `sanity.config.ts` | Studio configuration. |

**Adding a block type** means changing two files together: the schema in `sanity/schemaTypes/blockContent.ts` and its serializer in `components/PortableTextBody.tsx`. A block type without a serializer renders as nothing.

**Heading anchors** are generated by `github-slugger` in `lib/posts.ts` and shared between the table of contents and the rendered headings, so a sidebar link can never point at an anchor the body did not emit. This matches what `rehype-slug` produced for the MDX posts, so existing deep links still work.

### The old MDX posts

`content/blog/*.mdx` are still in the repository but nothing reads them any more — they are the migration's source material and a fallback if anything needs checking against the original. `lib/blog.ts` likewise remains but is no longer used by the blog.
