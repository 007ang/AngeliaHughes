import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { Photo } from "@/components/og/photo";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name} — Filmmaker · ${SITE.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string, mime: string) =>
  `data:${mime};base64,${readFileSync(join(process.cwd(), "assets", file)).toString("base64")}`;

/**
 * Producers pass her link around during the festival, so a blank card is a
 * real cost. Generated at build: every asset is read from disk and inlined,
 * so nothing depends on a deploy URL.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <Photo
        image={asset("og/hero.jpg", "image/jpeg")}
        logo={asset("og/mark.png", "image/png")}
        title={SITE.name}
        label={SITE.roleLine}
        brand={SITE.location}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: "Archivo",
          data: readFileSync(join(process.cwd(), "assets/fonts/Archivo-Medium.woff")),
          weight: 500,
          style: "normal",
        },
        {
          name: "IBM Plex Mono",
          data: readFileSync(join(process.cwd(), "assets/fonts/IBMPlexMono-Regular.woff")),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
