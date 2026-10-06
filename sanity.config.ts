"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

/**
 * The Studio Angelia edits in, at /studio.
 *
 * Site settings is pinned to a single document rather than left as a list.
 * The site reads `*[_type == "siteSettings"][0]`, so a second one created by
 * accident would silently win or lose at random — and the failure would look
 * like "my edits aren't showing up" rather than anything diagnosable.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Angelia Hughes",
  schema: { types: schemaTypes },

  document: {
    // Keep the singleton out of the "create new" menu entirely.
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== "siteSettings"),
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Angelia Hughes")
          .items([
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site settings"),
              ),
            S.divider(),
            S.documentTypeListItem("galleryImage").title("Photographs"),
            S.documentTypeListItem("selectedCredit").title("Selected credits"),
            S.documentTypeListItem("workVideo").title("Work — videos"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
