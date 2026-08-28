"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ScrollGallery,
  type ScrollGallerySlide,
} from "@/components/sora-ui/effects/scroll-gallery";
import { GalleryStatic } from "@/components/gallery/gallery-static";
import type { GalleryImage } from "@/lib/content";

type Mode = "static" | "tablet" | "desktop";

/**
 * Progressive enhancement, deliberately NOT a media query.
 *
 * Hiding the pinned gallery with CSS does not help: GSAP's ScrollTrigger still
 * creates its scroll length and still captures touch, which is exactly the
 * "trapped scroll on an iPhone" failure. So the pinned version is never
 * *mounted* unless we're on a wide viewport with motion allowed.
 *
 * Falling out of this one decision:
 *   - phones never load GSAP, so the pin cannot trap the scroll
 *   - reduced motion keeps all ten photographs instead of the component's
 *     built-in behaviour, which renders only the first slide
 *   - the server always emits ten real <img> tags with real alt text, which
 *     the ScrollGallery slide type has no field for
 *   - server and first client render agree, so there is no hydration mismatch
 */
function useGalleryMode(): Mode {
  const [mode, setMode] = useState<Mode>("static");

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      if (reduced.matches || !tablet.matches) return setMode("static");
      setMode(desktop.matches ? "desktop" : "tablet");
    };

    update();
    for (const mq of [tablet, desktop, reduced]) {
      mq.addEventListener("change", update);
    }
    return () => {
      for (const mq of [tablet, desktop, reduced]) {
        mq.removeEventListener("change", update);
      }
    };
  }, []);

  return mode;
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const mode = useGalleryMode();

  const slides = useMemo<ScrollGallerySlide[]>(
    () =>
      images.map((image) => ({
        image: image.src,
        // Untitled is fine; a wrong credit is not.
        title: image.productionName ?? "",
      })),
    [images],
  );

  /* Until she confirms which show each photo is from, every title is blank —
     and the studio preset would then draw an empty info band with a rule
     straight across all ten photographs. Show the band only once there is
     something to put in it. */
  const hasProductionNames = images.some((image) => image.productionName);

  if (mode === "static") {
    return <GalleryStatic images={images} />;
  }

  return (
    <>
      {/*
        The static stack stays in the DOM, visually hidden, so the ten alt
        texts remain available to assistive tech and to crawlers. The pinned
        canvas itself carries no per-slide alt — the slide type has no field
        for one.
      */}
      <div className="sr-only">
        <ul>
          {images.map((image) => (
            <li key={image.src}>
              {image.alt}
              {image.productionName ? ` (${image.productionName})` : ""}
            </li>
          ))}
        </ul>
      </div>

      <ScrollGallery
        // Remount cleanly across the breakpoint so no stale pin spacer survives.
        key={mode}
        slides={slides}
        variant="studio"
        /* 10 instead of the default 20: the strips widen and read as a shutter. */
        stripsCount={10}
        /* Tablets get a shorter throw so the section isn't endless. */
        scrollPerTransition={mode === "desktop" ? 800 : 600}
        scrub={1}
        timing={{
          /* 1.12, not the default 1.25 — a hard push-in on a photograph looks
             like a slideshow; a restrained one looks like a dolly. */
          scaleFrom: 1.12,
          titleChangeThreshold: 0.28,
          stripRevealSpeed: 2.2,
        }}
        /* These are BTS stills with nowhere to link, so the studio preset's
           prefix and CTA columns would render empty. Production name only. */
        showPrefix={false}
        showLink={false}
        showInfoBand={hasProductionNames}
        /* svh, not dvh, for the pinned element: dvh changes as mobile browser
           chrome collapses, which would resize a live pin mid-scroll. */
        className="max-lg:h-svh"
        classNames={{
          info: "border-bone/9",
          titleText:
            "font-display font-medium text-bone text-[32px] tracking-normal max-[1000px]:text-[18px]",
        }}
      />
    </>
  );
}
