/**
 * Fallback content — the page renders complete and correct without Sanity.
 * Sanity overrides these at request time; if a fetch fails or a document is
 * missing, the site still ships the real credits rather than an empty frame.
 *
 * Bio and selected credits are Angelia's own copy, supplied 2026-09-24.
 * Do not reword her voice, and do not invent a credit she did not list.
 */

export type SelectedCredit = {
  _id?: string;
  title: string;
  role: string;
  /** TV Series, Mini Series, Feature. */
  format?: string;
  /** Netflix, Blumhouse, Paramount / Prime Video. */
  studio?: string;
  /** "Ep. 1–8", "S2 & S3". */
  episodes?: string;
  /** She supplied none; kept so she can add them in Sanity without a deploy. */
  year?: string;
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
 * The old rule here was that we must never assign her "Cinematographer" — her
 * IMDb credits did not support it. That rule governed titles *we* chose. Her
 * own bio now claims the title directly, which is hers to claim, so it stands.
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
    "Angelia Hughes is a Toronto filmmaker with fifteen years on set \u2014 Director, Creative Director, Head of Production, Cinematographer and Camera Operator for Netflix, Paramount, Prime Video and Blumhouse.",

  /**
   * Angelia's own words, supplied 2026-09-24. Only mechanical slips were
   * corrected \u2014 "talent"\u2192"talented", "thats"\u2192"that's", "Thought"\u2192"Though", a
   * stray capital, "in-front of", and a doubled "Paramount". Her voice,
   * sentence structure and word choices are untouched. Every further edit
   * belongs to her, via Sanity.
   */
  bio: [
    "Angelia is a talented creative that has proven herself as a notably valuable asset on every production. She goes beyond her role behind the lens, with energy and passion that's hard to match, but is certainly infectious. She's an ambitious team-player that thinks outside the box, learns fast, challenges to be creative while keeping story as the focal point and knows when to pivot.",
    "Hughes started her TV journey in front of the camera, as a sports show host. Though she loved engaging with guests, she knew it was paramount as a leader to be well-rounded, and set out to become just as strong behind the camera as she was in front of it.",
    "Hughes has extensive production experience, both in front of and behind the camera and has held the titles of Director, Creative Director, Head of Production, Cinematographer and Camera Operator. Working on Film and TV shows for Netflix, Paramount, Prime Video and Blumhouse.",
    "After 15 years of working on set, she's taking all that she's learnt and building her Director reel.",
    "When she's not on set, she's refilling her creative cup, exploring different countries, hiking mountains, chasing plastic, trying new workout classes and exercising her writing chops in cute cafes.",
  ],
};

/**
 * Her curation, in her order, headed "Selected Credits \u2014 Camera". These are
 * camera credits specifically \u2014 the directing reel she mentions in the bio
 * does not exist yet \u2014 so the section keeps that qualifier.
 *
 * Episode and season strings are normalised for typography only
 * ("Ep 3,4,5" \u2192 "Ep. 3, 4, 5"); no credit was altered.
 */
export const SELECTED_CREDITS: SelectedCredit[] = [
  {
    title: "The Body",
    role: "A Camera",
    format: "TV Series",
    studio: "Netflix",
    episodes: "Ep. 1\u20138",
    order: 1,
  },
  {
    title: "Below",
    role: "A Camera",
    format: "Mini Series",
    studio: "Netflix",
    episodes: "Ep. 3, 4, 5",
    order: 2,
  },
  {
    title: "The Last Kiss",
    role: "A Camera",
    format: "Feature",
    studio: "Blumhouse",
    order: 3,
  },
  {
    title: "Cross",
    role: "A Camera 2nd Unit / B Camera",
    format: "TV Series",
    studio: "Paramount / Prime Video",
    episodes: "S2 & S3",
    order: 4,
  },
  {
    title: "The Greatest",
    role: "A Camera 2nd Unit / B Camera",
    format: "TV Series",
    studio: "Prime Video",
    episodes: "S1, Ep. 1\u20138",
    order: 5,
  },
  {
    title: "A Merry Little Ex-Mas",
    role: "B Camera",
    format: "Feature",
    studio: "Netflix",
    order: 6,
  },
];

/**
 * Still empty, and now we know why: her bio says she is "building her Director
 * reel". So this is a true state, not a missing asset \u2014 the Work section shows
 * credits alone until there is something real to link.
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
    /**
     * Toned warm monochrome at her request — the site is otherwise nearly all
     * monochrome and the colour original sat apart from it. Neutral greyscale
     * read cold against the warm ground, and a full ground-to-bone duotone
     * lifted the blacks until the frame went hazy, so this is greyscale tinted
     * along the identity's warm axis: full contrast, bone-leaning highlights.
     *
     * Baked into the file rather than applied as a CSS filter, because
     * assets/og/hero.jpg is cut from the same frame — a filter would leave
     * every shared link in colour while the page was monochrome.
     *
     * Reproduce, or revert to colour by dropping --tone:
     *   scripts/prepare-gallery-image.sh assets/originals/01-operating-alexa.jpg \
     *     01-operating-alexa 0.5 0.35 --tone
     */
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
