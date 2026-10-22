import ReactDOM from "react-dom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Splash } from "@/components/splash";
import { Section } from "@/components/section";
import { Gallery } from "@/components/gallery/gallery";
import { About } from "@/components/about";
import { Work } from "@/components/work";
import { getSiteContent } from "@/lib/data";

/** She edits in the Studio; the page picks it up within the minute. */
export const revalidate = 60;

export default async function Home() {
  const { site, portrait, gallery, credits, posters, videos } = await getSiteContent();

  const images = [...gallery].sort((a, b) => a.order - b.order);

  /* ScrollGallery takes a plain string, so next/image is bypassed entirely.
     Preload the first two frames by hand; the rest lazy-load. */
  for (const image of images.slice(0, 2)) {
    ReactDOM.preload(image.src, { as: "image", fetchPriority: "high" });
  }

  return (
    <>
      {/* Overlay only — the page below renders fully server-side, so the splash
          never gates content. Self-dismisses, skippable. */}
      <Splash name={site.name} />

      <SiteHeader site={site} />

      <main id="top">
        {/* Must sit at the root scroll level: GSAP's pin scrolls within
            `window`. Do not wrap this in a smooth-scroll or transformed
            container. */}
        <Gallery images={images} />

        <Section id="about" label="About">
          <About site={site} portrait={portrait} />
        </Section>

        <Section id="work" label="Selected Work">
          <Work credits={credits} posters={posters} videos={videos} />
        </Section>
      </main>

      <SiteFooter site={site} />
    </>
  );
}
