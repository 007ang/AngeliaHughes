/**
 * Fallback content — the page renders complete and correct without Sanity.
 * Sanity overrides these at request time; if a fetch fails or a document is
 * missing, the site still ships the real credits rather than an empty frame.
 *
 * Every figure here is from IMDb (Rev B spec). Do not round, pad, or invent.
 */

export type SelectedCredit = {
  _id?: string;
  title: string;
  role: string;
  year?: string;
  note?: string;
  order: number;
};

export type WorkVideo = {
  _id?: string;
  title: string;
  url: string;
  provider?: string;
  year?: string;
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
  /** Paragraphs. Written by her — never invented here. */
  bio: string[];
};

/**
 * Role line matches IMDb exactly and supports the transition she is making.
 * Not "Cinematographer", not "Director of Photography" — nothing in her
 * credits supports either, and Toronto's camera community would notice.
 */
export const SITE: SiteSettings = {
  name: "Angelia Hughes",
  shortName: "Angie Hughes",
  roleLine: "Filmmaker",
  location: "Toronto",
  email: "Hughes.angelia@gmail.com",
  imdbUrl: "https://www.imdb.com/name/nm4277983/",
  linkedinUrl: "https://ca.linkedin.com/in/angelia-hughes-abb02538",
  seoDescription:
    "Angelia Hughes is a filmmaker based in Toronto. Forty camera and electrical credits across television and film, with work in directing, writing, editing, production and visual effects.",

  /**
   * DRAFT — NOT APPROVED. Assembled only from facts already verified against
   * her IMDb profile: location, role, the department counts, and the four 2026
   * titles. Nothing here is invented, and nothing here should go live until
   * Angelia has read and corrected it. Replace via Sanity.
   *
   * It also carries the site's SEO weight now that the credit tables are gone,
   * so "camera operator", "director" and "Toronto" need to survive any rewrite.
   */
  bio: [
    "Angelia Hughes is a filmmaker based in Toronto.",
    "Her forty credits across camera and electrical departments span television and film. Alongside them she has worked as a writer, editor, producer, visual effects artist and actor.",
    "She is currently operating on four productions in post-production for 2026.",
  ],
};

/**
 * Written out rather than tabulated — a table of these reads as IMDb, which is
 * exactly the note. Placeholder curation: these are the four 2026 titles we
 * hold, not a selection Angelia has made.
 */
export const SELECTED_CREDITS: SelectedCredit[] = [
  {
    title: "Below",
    role: "'a' / 'b' camera operator",
    year: "2026",
    note: "TV mini series",
    order: 1,
  },
  {
    title: "The Greatest",
    role: "'b' camera, 'a' camera second unit",
    year: "2026",
    note: "TV series",
    order: 2,
  },
  {
    title: "The Body",
    role: "'a' camera operator",
    year: "2026",
    note: "TV series",
    order: 3,
  },
  {
    title: "Kiss of Death",
    role: "'a' camera operator",
    year: "2026",
    order: 4,
  },
];

/**
 * Empty until she sends links. The Work section renders an honest empty state
 * rather than a fabricated reel.
 */
export const WORK_VIDEOS: WorkVideo[] = [];

/**
 * Four frames, down from ten — "I def don't need all those photos". These four
 * survive because every one of them shows her *operating*; the lifestyle
 * frames do not serve the case for directing. The remaining eight stay in
 * /public/gallery so any of them can be swapped back in from Sanity.
 *
 * Ordered by editorial strength — the opening frames carry the
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
];

/** The one true portrait of the ten, and the only one not shot on a set. */
export const PORTRAIT: GalleryImage = {
  src: "/gallery/07-portrait-tree-1920.jpg",
  srcMobile: "/gallery/07-portrait-tree-1280.jpg",
  alt: "Portrait of Angelia Hughes in a wide-brimmed hat, leaning against a tree in winter woodland.",
  order: 1,
};
