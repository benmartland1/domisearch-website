import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A simple data table.
 *
 * Portable Text has no native table, and the existing posts lean on them
 * heavily — the "Quick Overview" fact tables are among the most-cited blocks
 * in the articles, so losing them in migration was never an option.
 *
 * Stored as a header row plus body rows rather than a grid of cells, because
 * that is what the markup needs and it keeps the Studio UI comprehensible.
 */
export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Describes the table for screen readers.",
    }),
    defineField({
      name: "header",
      title: "Header row",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          name: "row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              return { title: (cells ?? []).join("  ·  ") || "Empty row" };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { header: "header", rows: "rows" },
    prepare({ header, rows }) {
      return {
        title: (header ?? []).join("  ·  ") || "Table",
        subtitle: `Table — ${(rows ?? []).length} rows`,
      };
    },
  },
});
