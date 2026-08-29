import { defineField, defineType } from "sanity";

/**
 * Deliberately thin: flat fields, no references, no derived computation.
 * The requirement is that she can change a caption, swap a photograph or add
 * a credit without calling anyone. That is the whole bar.
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
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description:
        "One entry per paragraph. This is the main text search engines read, so keep 'camera operator', 'director' and 'Toronto' in it.",
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

const selectedCredit = defineType({
  name: "selectedCredit",
  title: "Selected credit",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. 'a' camera operator",
    }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "e.g. TV series. Keep it short — a long note reads as IMDb.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "role" } },
});

const workVideo = defineType({
  name: "workVideo",
  title: "Work — video",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Vimeo, YouTube, or anywhere the piece can be watched.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "provider", title: "Where", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const schemaTypes = [siteSettings, galleryImage, selectedCredit, workVideo];
