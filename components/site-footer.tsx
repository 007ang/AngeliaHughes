import { MarkInView } from "@/components/mark-in-view";
import { SocialLinks } from "@/components/social-links";
import type { SiteSettings } from "@/lib/content";

/** Mark, year, done. The short name is the identity's end-card signoff. */
export function SiteFooter({ site }: { site: SiteSettings }) {
  return (
    <footer className="px-6 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="h-px w-full bg-bone/9" />
        <div className="flex items-end justify-between gap-6 pt-8">
          {/* The identity's own end card. 01 is hero use and needs 96px of width —
              at a 3:1 mark space that is 32px tall, so h-9 clears it. This is
              the one place clay appears on the site. */}
          {/* Tips itself when you reach it — the hover version of this moment is
              unreachable with a thumb, and the footer is the end card, so a
              hat tip is the right gesture on arrival. */}
          <MarkInView className="h-9 w-auto" title={site.name} />
          <div className="flex flex-col items-end gap-4">
            <SocialLinks site={site} />
            <p className="label text-bone/55">
              {site.shortName} © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
