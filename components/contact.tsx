import type { SiteSettings } from "@/lib/content";

/** Email, IMDb, LinkedIn. mailto:, no form. */
export function Contact({ site }: { site: SiteSettings }) {
  const links = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "IMDb", value: "imdb.com", href: site.imdbUrl },
    { label: "LinkedIn", value: "linkedin.com", href: site.linkedinUrl },
  ];

  return (
    <ul className="mt-12 md:mt-16">
      {links.map((link) => (
        <li key={link.label} className="border-t border-bone/9 first:border-t-0">
          <a
            href={link.href}
            {...(link.label !== "Email"
              ? { target: "_blank", rel: "me noopener noreferrer" }
              : {})}
            className="flex items-baseline justify-between gap-8 py-5 transition-colors duration-200 hover:bg-bone/18 md:py-6"
          >
            <span className="label text-bone/55">{link.label}</span>
            <span className="text-lg leading-tight text-bone md:text-xl">
              {link.value}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
