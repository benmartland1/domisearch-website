import { defineType } from "sanity";

/**
 * A horizontal rule. Portable Text has no native equivalent, and the existing
 * posts use them as section breaks, so they get a block type of their own.
 */
export const divider = defineType({
  name: "divider",
  title: "Divider",
  type: "object",
  fields: [{ name: "hidden", type: "boolean", hidden: true }],
  preview: { prepare: () => ({ title: "———  Divider  ———" }) },
});
