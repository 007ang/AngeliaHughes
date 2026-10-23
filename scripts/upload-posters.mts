/**
 * Uploads the production posters she asked for into Sanity, one `poster`
 * document per film.
 *
 *   node --experimental-strip-types scripts/upload-posters.mts <dir>
 *
 * <dir> holds <slug>.jpg files named after the POSTERS list below. Artwork is
 * not committed to the repo — it is the studios' promotional material, so it
 * lives in her CMS where she can replace or remove any of it herself.
 *
 * Auth comes from the Sanity CLI session already on this machine
 * (`npx sanity login`), so no write token has to be minted, pasted or stored.
 *
 * Safe to re-run: deterministic _ids with createOrReplace, and Sanity dedupes
 * assets by content hash, so a second run overwrites rather than duplicating.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Order follows the order she listed them in, which is not the credit order.
 * 2 is deliberately absent: The Greatest premieres in November and has no key
 * art yet, so it slots into the gap whenever the artwork exists.
 */
const POSTERS = [
  { slug: "below", title: "Below", order: 1 },
  { slug: "the-body", title: "The Body", order: 3 },
  { slug: "cross", title: "Cross", order: 4 },
  { slug: "suicide-squad", title: "Suicide Squad", order: 5 },
];

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/upload-posters.mts <poster-dir>");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(join(import.meta.dirname, "..", ".env.local"), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
    .map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
);

const { authToken } = JSON.parse(
  readFileSync(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
) as { authToken?: string };

if (!authToken) {
  console.error("No Sanity CLI session found. Run: npx sanity login");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: authToken,
  apiVersion: "2026-08-01",
  useCdn: false,
});

for (const poster of POSTERS) {
  const file = join(dir, `${poster.slug}.jpg`);
  const asset = await client.assets.upload("image", readFileSync(file), {
    filename: `${poster.slug}.jpg`,
  });

  await client.createOrReplace({
    _id: `poster-${poster.slug}`,
    _type: "poster",
    title: poster.title,
    alt: `Poster for ${poster.title}`,
    order: poster.order,
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });

  console.log(`  ${poster.title} — ${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height}`);
}

console.log(`\n${POSTERS.length} posters uploaded.`);
