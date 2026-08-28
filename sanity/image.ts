import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { dataset, hasSanity, projectId } from "./env";

const builder = hasSanity ? imageUrlBuilder({ projectId, dataset }) : null;

/**
 * The builder honours the hotspot set in the Studio, so `fit("crop")` crops
 * around her rather than around the centre of the frame. These are
 * photographs of a person; a centre crop cuts her head off.
 */
export function galleryUrl(source: SanityImageSource, width: 1920 | 1280) {
  if (!builder) return "";
  return builder
    .image(source)
    .width(width)
    .height(Math.round((width * 9) / 16))
    .fit("crop")
    .auto("format")
    .quality(80)
    .url();
}
