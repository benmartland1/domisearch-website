"use client";

/**
 * Sanity Studio, embedded in this Next.js app at /studio.
 *
 * There is no separate Studio repository and no separate deployment: the
 * Studio ships with the site, so schema changes and the code that renders
 * them are always the same version.
 */

import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "DomiSearch",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Posts")
              .child(
                S.documentTypeList("post")
                  .title("Posts")
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
              ),
            S.divider(),
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("category").title("Categories"),
          ]),
    }),
    codeInput(),
    // Vision is a GROQ playground. Handy for Ben, noise for writers.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
