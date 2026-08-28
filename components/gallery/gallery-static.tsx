"use client";

import { useFrameProgress } from "@/hooks/use-frame-progress";
import type { GalleryImage } from "@/lib/content";

const STRIPS = 10;

/**
 * The server-rendered gallery, and the one phones and reduced-motion keep.
 *
 * A sticky stack: each photograph holds the screen while the next rides up
 * over it, revealed by the same ten-strip shutter the desktop version uses.
 * Nothing here pins. `position: sticky` cannot capture scroll, and the reveal
 * is driven by a custom property that both drivers only write numbers to — so
 * the phone can have the signature motion without the trapped-finger failure
 * that made us leave it off in the first place.
 *
 * Frames sit letterboxed in the ground rather than cropped to fill the screen:
 * a 16:9 landscape photograph cannot fill a portrait phone without a crop that
 * would destroy the wide compositions and cut her head off. The ground band
 * carries the slate instead, which is how a frame is logged on set anyway.
 *
 * See globals.css for the motion; reduced motion collapses this back to a
 * plain stack.
 */
function Frame({
  image,
  index,
  total,
  priority,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  priority: boolean;
}) {
  return (
    <section className="gallery-frame" data-frame>
      <div className="gallery-stage">
        <figure className="gallery-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            srcSet={
              image.srcMobile
                ? `${image.srcMobile} 1280w, ${image.src} 1920w`
                : undefined
            }
            sizes="100vw"
            alt={image.alt}
            width={1920}
            height={1080}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
          />

          {Array.from({ length: STRIPS }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="gallery-strip"
              style={
                {
                  top: `${i * (100 / STRIPS)}%`,
                  "--i": i,
                } as React.CSSProperties
              }
            />
          ))}

          <span aria-hidden className="gallery-veil" />
        </figure>

        {/* The slate. Uses the letterbox band rather than leaving it empty. */}
        <figcaption className="label flex w-full items-baseline justify-between gap-6 px-6 text-bone/55">
          <span className="tnum">
            {String(index + 1).padStart(2, "0")} / {total}
          </span>
          {image.productionName && <span>{image.productionName}</span>}
        </figcaption>
      </div>
    </section>
  );
}

export function GalleryStatic({ images }: { images: GalleryImage[] }) {
  const ref = useFrameProgress();

  return (
    <div ref={ref} className="w-full">
      {images.map((image, i) => (
        <Frame
          key={image.src}
          image={image}
          index={i}
          total={images.length}
          priority={i < 2}
        />
      ))}
    </div>
  );
}
