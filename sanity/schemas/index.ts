import { defineField, defineType } from "sanity";

/**
 * Deliberately thin: flat fields, no references, no derived computation.
 * The requirement is that she can change a caption, swap a photograph or add
 * an upcoming title without calling anyone. That is the whole bar.
 */

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full name", type: "string" }),
    defineField({
      name: "shortName",
      title: "Short name (footer)",
      type: "string",
    }),
    defineField({
      name: "roleLine",
      title: "Role line",
      type: "string",
      description:
        "Matches IMDb. Do not use 'Cinematographer' or 'Director of Photography' — the credits do not support either.",
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "imdbUrl", title: "IMDb URL", type: "url" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: { select: { title: "name", subtitle: "roleLine" } },
});

const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photograph",
      type: "image",
      // Hotspot is the whole point — set it on her face.
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photograph for screen readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "productionName",
      title: "Production",
      type: "string",
      description:
        "Leave blank if unsure. An untitled frame is fine; a wrong credit is not.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    {
      name: "orderAsc",
      title: "Order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "productionName", subtitle: "alt", media: "image" },
  },
});

const department = defineType({
  name: "department",
  title: "Department",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Department", type: "string" }),
    defineField({
      name: "count",
      title: "Credits",
      type: "number",
      validation: (rule) => rule.required().min(0).integer(),
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: { select: { title: "label", subtitle: "count" } },
});

const upcoming = defineType({
  name: "upcoming",
  title: "Upcoming",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      description: "e.g. TV Series, TV Mini Series",
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "string",
      description: "e.g. 8 eps",
    }),
    defineField({ name: "roles", title: "Role", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Shown verbatim. 'Post-production' reads as working right now.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "status" } },
});

export const schemaTypes = [siteSettings, galleryImage, department, upcoming];
