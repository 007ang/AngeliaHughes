/**
 * Fallback content — the page renders complete and correct without Sanity.
 * Sanity overrides these at request time; if a fetch fails or a document is
 * missing, the site still ships the real credits rather than an empty frame.
 *
 * Every figure here is from IMDb (Rev B spec). Do not round, pad, or invent.
 */

export type Department = {
  _id?: string;
  label: string;
  count: number;
  order: number;
};

export type Upcoming = {
  _id?: string;
  title: string;
  format?: string;
  episodes?: string;
  roles: string;
  status: string;
  order: number;
};

export type GalleryImage = {
  _id?: string;
  src: string;
  srcMobile?: string;
  alt: string;
  productionName?: string;
  order: number;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  roleLine: string;
  location: string;
  email: string;
  imdbUrl: string;
  linkedinUrl: string;
  seoDescription: string;
};

/**
 * Role line matches IMDb exactly and supports the transition she is making.
 * Not "Cinematographer", not "Director of Photography" — nothing in her
 * credits supports either, and Toronto's camera community would notice.
 */
export const SITE: SiteSettings = {
  name: "Angelia Hughes",
  shortName: "Angie Hughes",
  roleLine: "Camera Operator / Director",
  location: "Toronto",
  email: "Hughes.angelia@gmail.com",
  imdbUrl: "https://www.imdb.com/name/nm4277983/",
  linkedinUrl: "https://ca.linkedin.com/in/angelia-hughes-abb02538",
  seoDescription:
    "Angelia Hughes is a camera operator and director based in Toronto. Forty camera and electrical credits across television and film, with work in writing, editing, production and visual effects.",
};

/**
 * The centrepiece. Eight rows, set at ONE size.
 * The 40 is credibility; the seven singles are the case for directing.
 * The argument is the spread, not the total — never make the 40 large.
 */
export const DEPARTMENTS: Department[] = [
  { label: "Camera and Electrical", count: 40, order: 1 },
  { label: "Director", count: 1, order: 2 },
  { label: "Writer", count: 1, order: 3 },
  { label: "Editor", count: 1, order: 4 },
  { label: "Actress", count: 1, order: 5 },
  { label: "Production Management", count: 1, order: 6 },
  { label: "Visual Effects", count: 1, order: 7 },
  { label: "Additional Crew", count: 1, order: 8 },
];

/** All 2026, all in post. "Post-production" reads as working right now. */
export const UPCOMING: Upcoming[] = [
  {
    title: "Below",
    format: "TV Mini Series",
    episodes: "4 eps",
    roles: "'a' / 'b' camera operator",
    status: "Completed",
    order: 1,
  },
  {
    title: "The Greatest",
    format: "TV Series",
    episodes: "8 eps",
    roles: "'b' camera, 'a' camera second unit",
    status: "Post-production",
    order: 2,
  },
  {
    title: "The Body",
    format: "TV Series",
    episodes: "8 eps",
    roles: "'a' camera operator",
    status: "Post-production",
    order: 3,
  },
  {
    title: "Kiss of Death",
    roles: "'a' camera operator",
    status: "Post-production",
    order: 4,
  },
];

/**
 * Ten frames, ordered by editorial strength — the opening frames carry the
 * most weight and the first two are preloaded.
 *
 * Cropped to 1920x1080 from EXIF-corrected masters in /assets/originals, each
 * with a hand-chosen focal point rather than a centre crop: these are
 * photographs of a person, and a centre crop cuts her head off. The focal
 * fractions are recorded here so the same framing can be reproduced as Sanity
 * hotspots when the images move into the CMS.
 *
 * `productionName` is deliberately blank until she confirms which show each
 * photograph is from. An untitled frame is fine; a wrong credit is not.
 */
export const GALLERY: GalleryImage[] = [
  {
    src: "/gallery/01-operating-alexa-1920.jpg",
    srcMobile: "/gallery/01-operating-alexa-1280.jpg",
    alt: "Angelia Hughes, in a wide-brimmed hat, operating a cinema camera on an exterior location.",
    order: 1,
  },
  {
    src: "/gallery/02-silhouette-flare-1920.jpg",
    srcMobile: "/gallery/02-silhouette-flare-1280.jpg",
    alt: "Angelia Hughes silhouetted in her flat-brim hat beside a camera, backlit by a lamp flaring into the lens.",
    order: 2,
  },
  {
    src: "/gallery/03-street-operating-1920.jpg",
    srcMobile: "/gallery/03-street-operating-1280.jpg",
    alt: "Angelia Hughes laughing while operating a camera rig on a narrow street.",
    order: 3,
  },
  {
    src: "/gallery/04-monitor-wide-1920.jpg",
    srcMobile: "/gallery/04-monitor-wide-1280.jpg",
    alt: "Angelia Hughes in her flat-brim hat watching a take from beside the camera, the actor visible on the monitor.",
    order: 4,
  },
  {
    src: "/gallery/05-on-set-interview-1920.jpg",
    srcMobile: "/gallery/05-on-set-interview-1280.jpg",
    alt: "Angelia Hughes operating a camera on an interior set while three seated subjects are filmed.",
    order: 5,
  },
  {
    src: "/gallery/06-period-interior-1920.jpg",
    srcMobile: "/gallery/06-period-interior-1280.jpg",
    alt: "Angelia Hughes lining up a shot on a large camera rig inside a period interior.",
    order: 6,
  },
  {
    src: "/gallery/07-portrait-tree-1920.jpg",
    srcMobile: "/gallery/07-portrait-tree-1280.jpg",
    alt: "Portrait of Angelia Hughes in a wide-brimmed hat, leaning against a tree in winter woodland.",
    order: 7,
  },
  {
    src: "/gallery/08-winter-bench-1920.jpg",
    srcMobile: "/gallery/08-winter-bench-1280.jpg",
    alt: "Angelia Hughes seated on a park bench in the snow, wearing a wide-brimmed hat and winter coat.",
    order: 8,
  },
  {
    src: "/gallery/09-location-helicopter-1920.jpg",
    srcMobile: "/gallery/09-location-helicopter-1280.jpg",
    alt: "Angelia Hughes on a remote location shoot, standing with camera gear beside a helicopter.",
    order: 9,
  },
  {
    src: "/gallery/10-studio-floor-1920.jpg",
    srcMobile: "/gallery/10-studio-floor-1280.jpg",
    alt: "A television studio floor during setup, with crew, lighting and camera positions.",
    order: 10,
  },
];
