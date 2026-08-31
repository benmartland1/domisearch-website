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
