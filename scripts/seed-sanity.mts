/**
 * Seeds a fresh Sanity project with everything the site currently ships
 * hardcoded: her bio and contact details, the About photograph, the four
 * gallery frames, and the six selected credits.
 *
 * Without this she opens an empty Studio and has to retype all of it, which
 * is the fastest way to end up with a CMS nobody uses.
 *
 *   SANITY_WRITE_TOKEN=... pnpm seed
 *
 * Safe to re-run. Every document uses a deterministic _id with
 * createOrReplace, and Sanity dedupes uploaded images by content hash, so a
 * second run overwrites rather than duplicating.
 *
 * It reads lib/content.ts directly rather than carrying its own copy of the
 * data — one source of truth, no drift.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GALLERY,
  PORTRAIT,
  SELECTED_CREDITS,
  SITE,
  type GalleryImage,
} from "../lib/content.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing config.\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID — from .env.local\n" +
      "  SANITY_WRITE_TOKEN           — sanity.io/manage > API > Tokens (Editor)\n\n" +
      "  SANITY_WRITE_TOKEN=xxx pnpm seed",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-01",
  useCdn: false,
});

/** Turns "/gallery/01-operating-alexa-1920.jpg" into a Sanity image asset. */
async function upload(image: GalleryImage) {
  const file = join(root, "public", image.src.replace(/^\//, ""));
  const asset = await client.assets.upload("image", readFileSync(file), {
    filename: basename(file),
  });
  console.log(`  uploaded  ${basename(file)}`);
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function seed() {
  console.log(`Seeding ${projectId}/${dataset}\n`);

  console.log("Photographs");
  const gallery = await Promise.all(
    [...GALLERY]
      .sort((a, b) => a.order - b.order)
      .map(async (img) => ({
        _id: `galleryImage-${slug(basename(img.src).replace(/-\d+\.jpg$/, ""))}`,
        _type: "galleryImage",
        image: await upload(img),
        alt: img.alt,
        ...(img.productionName ? { productionName: img.productionName } : {}),
        order: img.order,
      })),
  );

  console.log("\nAbout photograph");
  const portrait = await upload(PORTRAIT);

  console.log("\nDocuments");
  const credits = SELECTED_CREDITS.map((c) => ({
    _id: `selectedCredit-${slug(c.title)}`,
    _type: "selectedCredit",
    ...c,
  }));

  const settings = {
    _id: "siteSettings",
    _type: "siteSettings",
    name: SITE.name,
    shortName: SITE.shortName,
    roleLine: SITE.roleLine,
    location: SITE.location,
    email: SITE.email,
    imdbUrl: SITE.imdbUrl,
    linkedinUrl: SITE.linkedinUrl,
    seoDescription: SITE.seoDescription,
    bio: SITE.bio,
    portrait: { ...portrait, alt: PORTRAIT.alt },
  };

  // Typed as the minimum the client needs, so the heterogeneous array does not
  // collapse into a union that no single createOrReplace signature accepts.
  const docs: Array<{ _id: string; _type: string } & Record<string, unknown>> = [
    settings,
    ...gallery,
    ...credits,
  ];

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();

  console.log(`  site settings   1`);
  console.log(`  photographs     ${gallery.length}`);
  console.log(`  credits         ${credits.length}`);
  console.log(`\nDone. Open /studio to edit.`);
}

seed().catch((err) => {
  console.error("\nSeed failed:", err.message ?? err);
  process.exit(1);
});
