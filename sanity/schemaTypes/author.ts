import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Shown under the name, and used as jobTitle in Article schema.",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      description: "One paragraph. Appears in the author box at the end of every post.",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "sameAs",
      title: "Other profiles",
      type: "array",
      of: [{ type: "url" }],
      description:
        "Additional profile URLs. These are emitted as sameAs in Article schema, which is how search and AI engines tie the byline to a real person.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
