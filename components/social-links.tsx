import type { SiteSettings } from "@/lib/content";

/**
 * "IMDb and linked just the icon with hot links."
 *
 * Drawn as monochrome glyphs in `bone` rather than the official marks: both
 * IMDb and LinkedIn forbid recolouring their logos, and a full-colour badge
 * would be the only unlicensed colour on a page built from three values.
 */
function ImdbGlyph() {
  return (
    <svg viewBox="0 0 64 32" className="h-full w-auto" aria-hidden focusable="false">
      <g fill="currentColor">
        <rect x="2" y="8" width="4.6" height="16" />
        <path d="M10.4,8 h6.2 l1.9,7.6 L20.4,8 h6.2 v16 h-4.2 v-10.4 l-2.3,10.4 h-3 l-2.3,-10.4 v10.4 h-4.4 Z" />
        <path d="M29.6,8 h5.6 c3.4,0 5,1.3 5,4.2 v7.6 c0,2.9 -1.6,4.2 -5,4.2 h-5.6 Z M34.2,11.4 v9.2 c1,0 1.6,-0.3 1.6,-1.5 v-6.2 c0,-1.2 -0.6,-1.5 -1.6,-1.5 Z" />
        <path d="M43.4,8 h4.6 v5.1 c0.7,-0.8 1.6,-1.2 2.7,-1.2 c2.3,0 3.5,1.3 3.5,3.8 v4.6 c0,2.5 -1.2,3.8 -3.5,3.8 c-1.1,0 -2,-0.4 -2.7,-1.3 v1.2 h-4.6 Z M48,16.2 v3.8 c0,0.7 0.2,1 0.8,1 c0.5,0 0.8,-0.3 0.8,-1 v-3.8 c0,-0.7 -0.3,-1 -0.8,-1 c-0.6,0 -0.8,0.3 -0.8,1 Z" />
      </g>
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-auto" aria-hidden focusable="false">
      <g fill="currentColor">
        <rect x="3" y="12" width="5" height="17" />
        <circle cx="5.5" cy="6.5" r="3.2" />
        <path d="M12,12 h4.8 v2.3 c0.9,-1.6 2.6,-2.7 4.9,-2.7 c4,0 6.3,2.4 6.3,7.1 V29 h-5 v-9.3 c0,-2.4 -0.9,-3.7 -2.9,-3.7 c-2.1,0 -3.1,1.4 -3.1,3.7 V29 h-5 Z" />
      </g>
    </svg>
  );
}

export function SocialLinks({
  site,
  className = "",
}: {
  site: SiteSettings;
  className?: string;
}) {
  const links = [
    { label: "IMDb", href: site.imdbUrl, glyph: <ImdbGlyph />, h: "h-[22px]" },
    { label: "LinkedIn", href: site.linkedinUrl, glyph: <LinkedInGlyph />, h: "h-[19px]" },
  ];

  return (
    <ul className={`flex items-center gap-6 ${className}`}>
      {links.map((link) => (
        <li key={link.label} className={link.h}>
          <a
            href={link.href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={`${site.name} on ${link.label}`}
            className="block h-full text-bone/70 transition-colors duration-200 hover:text-bone focus-visible:text-bone active:text-bone"
          >
            {link.glyph}
          </a>
        </li>
      ))}
    </ul>
  );
}
