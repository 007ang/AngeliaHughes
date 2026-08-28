import ReactDOM from "react-dom";
import { SiteHeader } from "@/components/site-header";
import { Splash } from "@/components/splash";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { Gallery } from "@/components/gallery/gallery";
import { Departments } from "@/components/departments";
import { Upcoming } from "@/components/upcoming";
import { Contact } from "@/components/contact";
import { getSiteContent } from "@/lib/data";

/** She edits in the Studio; the page picks it up within the minute. */
export const revalidate = 60;

export default async function Home() {
  const { site, gallery, departments, upcoming } = await getSiteContent();

  const images = [...gallery].sort((a, b) => a.order - b.order);

  /* ScrollGallery takes a plain string, so next/image is bypassed entirely.
     Preload the first two frames by hand; the rest lazy-load. */
  for (const image of images.slice(0, 2)) {
    ReactDOM.preload(image.src, { as: "image", fetchPriority: "high" });
  }

  return (
    <>
      {/* Overlay only — the page below renders fully server-side, so the splash
          never gates content. Self-dismisses, skippable, once per session. */}
      <Splash name={site.name} />

      <SiteHeader site={site} />

      <main id="top">
        {/* Section 1 — Gallery.
            Must sit at the root scroll level: GSAP's pin scrolls within
            `window`. Do not wrap this in a smooth-scroll or transformed
            container. */}
        <Gallery images={images} />

        {/* Section 2 — Departments. The page's centrepiece. */}
        <Section id="departments" label="Departments">
          <Departments departments={departments} />
        </Section>

        {/* Section 3 — Upcoming. */}
        <Section id="upcoming" label="Upcoming">
          <Upcoming items={upcoming} />
        </Section>

        {/* Section 4 — Contact. */}
        <Section id="contact" label="Contact">
          <Contact site={site} />
        </Section>
      </main>

      {/* Section 5 — Footer. */}
      <SiteFooter site={site} />
    </>
  );
}
