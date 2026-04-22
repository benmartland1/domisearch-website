# DomiSearch Website

Next.js 15 + TypeScript + Tailwind CSS v4. Deployed on Vercel.

## Development

```bash
pnpm install        # or npm install
pnpm dev            # start dev server on http://localhost:3000
pnpm build          # production build
pnpm start          # run production build locally
```

## Environment variables

Create `.env.local` based on `.env.example`:

| Key                     | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| `RESEND_API_KEY`        | Sends contact-form submissions to `hi@domisearch.com`.       |
| `CONTACT_TO_EMAIL`      | Destination address (default `hi@domisearch.com`).           |
| `CONTACT_FROM_EMAIL`    | Verified Resend sender (e.g. `website@domisearch.com`).      |
| `ANTHROPIC_API_KEY`     | Reserved for future AI-assisted blog tooling.                |
| `NEXT_PUBLIC_SITE_URL`  | Canonical site URL. Used in sitemap / schema.                |

## Publishing a blog post

```bash
pnpm new:post --from path/to/draft.md
# or interactively
pnpm new:post
```

The script will:

1. Strip the H1 (already in frontmatter)
2. Generate an SEO-tuned meta title + description
3. Lift an excerpt from the first paragraph
4. Write `content/blog/<slug>.mdx` with complete frontmatter

After commit + push, Vercel redeploys; the sitemap, llms.txt and blog index update automatically.

## File map

```
app/
├── layout.tsx                   Root layout (metadata, schema, header, footer)
├── page.tsx                     Home
├── services/google-ads/page.tsx
├── services/aeo/page.tsx
├── about/page.tsx
├── careers/page.tsx
├── contact/page.tsx
├── blog/page.tsx                Index
├── blog/[slug]/page.tsx         Individual post
├── privacy/page.tsx
├── terms/page.tsx
├── api/contact/route.ts         Form handler → Resend → hi@domisearch.com
├── sitemap.ts                   Auto-generated sitemap.xml
├── robots.ts                    robots.txt
├── llms.txt/route.ts            /llms.txt (AI crawler manifest)
└── not-found.tsx                404

components/                      UI primitives (Header, Footer, Hero, FAQ, ...)
content/blog/                    MDX posts with frontmatter
lib/                             Site constants, schema helpers, blog reader
public/fonts/                    Axiforma (6 weights)
public/brand/                    Logo + Shopify Partner badge
scripts/new-post.ts              Blog CMS helper
vercel.json                      Security headers + cache control
```

## Deployment

Push to the branch connected to Vercel. Set the environment variables above in the Vercel dashboard.
