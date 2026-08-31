import { defineField, defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Note", value: "note" },
          { title: "Tip", value: "tip" },
          { title: "Warning", value: "warning" },
        ],
        layout: "radio",
      },
      initialValue: "note",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { tone: "tone", text: "text" },
    prepare({ tone, text }) {
      const first = text?.[0]?.children?.[0]?.text ?? "";
      return { title: first || "Callout", subtitle: `Callout — ${tone ?? "note"}` };
    },
  },
});
