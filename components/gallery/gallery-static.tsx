"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/content";

/**
 * The server-rendered gallery, and the one mobile and reduced-motion keep.
 *
 * Full-bleed width at the photographs' native 16:9 rather than a forced
 * full-height portrait crop: these are pictures of a person, and cropping a
 * landscape still to a phone viewport is what cuts her head off. Frames
 * crossfade in on intersection; under reduced motion they are simply there.
 *
 * No GSAP, no pin, no scroll capture — this is an ordinary document scroll.
 */
function Frame({ image, priority }: { image: GalleryImage; priority: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="relative w-full">
      <div className="relative aspect-video w-full overflow-hidden bg-bone/9">
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
          data-reveal
          className="h-full w-full object-cover"
          style={{
            opacity: shown ? 1 : 0,
            transition: "opacity 520ms var(--ease-identity)",
          }}
        />
      </div>

      {image.productionName && (
        <figcaption className="label px-6 pt-3 text-bone/55 md:px-10">
          {image.productionName}
        </figcaption>
      )}
    </figure>
  );
}

export function GalleryStatic({ images }: { images: GalleryImage[] }) {
  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      {images.map((image, i) => (
        <Frame key={image.src} image={image} priority={i < 2} />
      ))}
    </div>
  );
}
