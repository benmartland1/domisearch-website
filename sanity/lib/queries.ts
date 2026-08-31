import { groq } from "next-sanity";

/**
 * Field sets are shared so the listing, the post page, the sitemap and
 * llms.txt cannot drift apart in what they consider a post.
 */

const authorFields = groq`
  name,
  "slug": slug.current,
  role,
  bio,
  linkedinUrl,
  sameAs,
  image
`;

const summaryFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  tags,
  mainImage,
  author->{ ${authorFields} },
  category->{ title, "slug": slug.current, description },
  "noIndex": coalesce(seo.noIndex, false),
  // Word count rather than the body itself, so the listing does not ship the
  // full text of every post just to print "8 min read".
  "wordCount": length(string::split(pt::text(body), " "))
`;

/** Every published post, newest first. */
export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)]
    | order(publishedAt desc, slug.current asc) {
      ${summaryFields}
    }
`;

/** One post, with everything needed to render the page and its metadata. */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${summaryFields},
    tldr,
    body,
    faqs[]{ question, answer },
    seo
  }
`;

/** Slugs only — used by generateStaticParams. */
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)].slug.current
`;

/** Sibling posts for the "keep reading" rail. */
export const relatedPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && slug.current != $slug]
    | order(publishedAt desc, slug.current asc)[0...3] {
      ${summaryFields}
    }
`;
