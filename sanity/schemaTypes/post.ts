import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "The headline. This is the page's H1 — do not repeat it in the body.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      description:
        "The address the post lives at: domisearch.com/blog/THIS. Once a post is live, changing this breaks every link to it and resets its ranking.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "One or two sentences. Shown on the blog listing, used as the fallback meta description, and quoted verbatim in llms.txt.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "tldr",
      title: "TL;DR",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "The article's answer, in two or three sentences, stated outright. Shows in the green box at the top of the post. This is the block AI assistants quote most often, so lead with the answer rather than building up to it.",
      validation: (rule) => [
        rule.max(600).warning("Long enough that a reader will skip it. Aim for two or three sentences."),
        rule.custom((value) =>
          value && value.trim().length > 0
            ? true
            : "Every post should have a TL;DR — it is the most-cited part of the page.",
        ).warning(),
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required().error("Alt text is required."),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "meta",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      group: "meta",
      description:
        "Shown as pills on the post, and the first one labels the post's card elsewhere on the site.",
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "meta",
      description: "Controls the order posts appear in, and the date shown on the post.",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "Pins this post to the large card at the top of the blog index.",
      initialValue: false,
    }),
    defineField({
      name: "pillarStatus",
      title: "Pillar status",
      type: "string",
      group: "meta",
      description:
        "Where this post sits in the topic cluster. A pillar is the definitive page on a topic; a cluster post covers one angle of it and links back to the pillar.",
      options: {
        list: [
          { title: "Pillar", value: "pillar" },
          { title: "Cluster", value: "cluster" },
          { title: "Standalone", value: "standalone" },
        ],
        layout: "radio",
      },
      initialValue: "standalone",
    }),
    defineField({
      name: "pillarTopic",
      title: "Pillar topic",
      type: "string",
      group: "meta",
      description:
        'The topic cluster this post belongs to, e.g. "AI search for recruitment firms". Use the same wording across every post in the cluster. Emitted as articleSection in Article schema.',
      hidden: ({ document }) => document?.pillarStatus === "standalone",
    }),
    defineField({
      name: "pillarPage",
      title: "Pillar page",
      type: "url",
      group: "meta",
      description:
        "The pillar this post supports: another post or a landing page, e.g. /recruitment. The body should link to it.",
      validation: (rule) => rule.uri({ allowRelative: true, scheme: ["https"] }),
      hidden: ({ document }) => document?.pillarStatus !== "cluster",
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "content",
      description:
        "Question and answer pairs. These render at the end of the post and generate FAQPage schema, which is what puts the post in AI answers and Google's FAQ results. Leave empty if the post has none.",
      of: [
        defineArrayMember({
          name: "faq",
          type: "object",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              type: "text",
              rows: 4,
              description: "Plain text. Answer outright in the first sentence.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "metaTitle",
          title: "Search title",
          type: "string",
          description:
            "The blue headline in Google. Leave blank to use the post title. Google cuts off past ~60 characters.",
          validation: (rule) => rule.max(70).warning("Google usually truncates past 60 characters."),
        }),
        defineField({
          name: "metaDescription",
          title: "Search description",
          type: "text",
          rows: 3,
          description:
            "The grey text under the blue link. Leave blank to use the summary. Google cuts off past ~155 characters.",
          validation: (rule) =>
            rule.max(180).warning("Google usually truncates past 155 characters."),
        }),
        defineField({
          name: "ogTitle",
          title: "Social title",
          type: "string",
          description:
            "The headline on LinkedIn, X and Slack link previews (Open Graph and Twitter card). Leave blank to use the search title.",
          validation: (rule) => rule.max(95).warning("Most previews cut off past ~90 characters."),
        }),
        defineField({
          name: "ogDescription",
          title: "Social description",
          type: "text",
          rows: 2,
          description:
            "The line under the headline in link previews. Leave blank to use the search description.",
          validation: (rule) => rule.max(200).warning("Most previews cut off past ~200 characters."),
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
          description:
            "Only set this if the article was published somewhere else first. Otherwise leave blank and the post's own URL is used.",
        }),
        defineField({
          name: "noIndex",
          title: "Hide from search engines",
          type: "boolean",
          description:
            "Keeps the post out of Google and out of sitemap.xml and llms.txt. The post stays reachable by direct link.",
          initialValue: false,
        }),
      ],
    }),
  ],

  orderings: [
    {
      title: "Publish date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: { title: "title", author: "author.name", date: "publishedAt", media: "mainImage" },
    prepare({ title, author, date, media }) {
      const when = date ? new Date(date).toLocaleDateString("en-GB") : "No date";
      return { title, subtitle: [author, when].filter(Boolean).join(" · "), media };
    },
  },
});
