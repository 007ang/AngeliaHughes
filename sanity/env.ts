export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-08-01";

/**
 * The site must build and render correctly before Sanity exists — the whole
 * page has a hardcoded fallback. Nothing here throws on a missing project.
 */
export const hasSanity = projectId.length > 0;
