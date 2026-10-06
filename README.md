# Angelia Hughes — portfolio

One page, black, ten photographs, five sections. Next.js (App Router) ·
TypeScript · Tailwind v4 · Sanity · GSAP/ScrollTrigger.

The site does not claim she is a director. It lays out the evidence — forty
camera credits plus seven single credits across writing, editing, producing,
visual effects and acting — and lets the numbers make the case.

**Target: live before TIFF opens, 10 September 2026.**

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint
```

---

## Before launch

Four things are still outstanding. The first is the only hard blocker.

1. ~~Contact details~~ — **done.** Email, IMDb and LinkedIn are all set in
   `lib/content.ts` and flow into the JSON-LD `sameAs`. She has no Instagram;
   LinkedIn takes that row.
2. **Production names per photograph.** Every frame is currently untitled. Tag
   the ones she is sure of and leave the rest — an untitled frame is fine, a
   wrong credit is not. Until at least one is set, the gallery's info band is
   hidden so no stray rule crosses the photographs.
3. ~~Publish rights~~ — **confirmed.** She supplied the photographs directly.
4. **Test on a real iPhone.** Pin bugs do not reproduce in DevTools. The pinned
   gallery is never mounted below 768px, so the scroll should not be captured —
   but verify on device.

---

## Structure

```
app/layout.tsx        fonts, metadata, JSON-LD Person
app/page.tsx          server component — fetches content, renders five sections
app/studio/           embedded Sanity Studio at /studio
components/mark.tsx   the three identity marks, geometry from the production SVGs
app/icon.svg          favicon — mark 02 in a warm-black rounded square
components/gallery/   the pinned/static switch (see below)
lib/content.ts        hardcoded fallback — the page never renders empty
lib/data.ts           Sanity fetch with field-level fallback
sanity/               client, queries, image builder, schemas
assets/originals/     EXIF-corrected full-res masters (gitignored)
```

### The gallery is progressive enhancement, not a media query

The single most important structural decision. Do **not** CSS-hide the pinned
gallery on mobile — GSAP's ScrollTrigger still creates its scroll length and
still captures touch, which is exactly the "trapped scroll on an iPhone"
failure.

```
SSR / default   →  GalleryStatic   ten real <img>, real alt, no GSAP
     ↓ on mount, only if (min-width: 768px) and motion is allowed
Tablet/desktop  →  ScrollGallery   pinned, shutter wipe
```

Four problems fall out of that one branch:

- phones never load GSAP, so the pin cannot trap the scroll;
- reduced motion keeps all ten photographs — the vendored component's own
  reduced-motion path renders only the *first* slide;
- the server always emits ten `<img>` tags with alt text, which
  `ScrollGallerySlide` has no field for (hence the `sr-only` list on the
  enhanced path);
- server and first client render agree, so there is no hydration mismatch.

`ScrollGallery` is vendored from the Sora UI registry into
`components/sora-ui/effects/`. It is patched only through its own API —
`showPrefix`/`showLink` off (these stills link nowhere), `showInfoBand` only
once a production name exists (otherwise the studio preset draws an empty rule
across all ten photographs), and `classNames` overriding the preset's white
type to `bone`.

> An alternative treatment (`infinite-scrolling-images`, a scroll-driven
> stacked deck) was built and compared against this one, then removed. If it is
> ever revisited, the notes are in the plan file: it ships an unconditional
> `preventDefault()` on wheel and touch that has to be patched out, and its
> cards escape their stacking context and paint over the fixed header.

---

## Design tokens

Three values, from the identity system. Everything else is an opacity step of
`bone`, expressed with Tailwind's slash syntax (`text-bone/55`,
`border-bone/9`, `bg-bone/18`), so the palette cannot drift.

| Token    | Value     | Use                                |
| -------- | --------- | ---------------------------------- |
| `ground` | `#16140F` | Background — warm black            |
| `bone`   | `#E8DFD1` | Text, marks                        |
| `clay`   | `#9F4B33` | **Mark band only.** Never in the UI |

Type is Archivo (display, carried from the wordmark) and IBM Plex Mono (every
figure and metadata label — camera reports are set in mono). Zero radius, 8px
grid, `dvh` never `vh`.

Motion is three moments then stillness: the shutter wipe, the department
counters, and the section rules — 260ms rule, 220ms resolve, taken directly
from the identity's Motion 03.

### The marks

Geometry is copied verbatim from the identity production files
(`Downloads/exports/svg`). Do not redraw them — the ratios are locked against a
common brim bar.

- **Header** shows **mark 03** (the AH monogram) at rest and swaps to
  **mark 02** (the reduced silhouette) on hover or keyboard focus. Both share
  the same 360×120 space and an identical brim bar, so the swap pivots on the
  brim — the identity's motion spine — instead of cross-fading two unrelated
  shapes. These are also the only two marks the identity permits over
  photography, and only with a scrim, which is why the header carries a
  gradient. Tailwind scopes the swap to `@media (hover:hover)`, so touch
  devices keep the monogram rather than flickering. Mark 02's band is an
  *open slot* — the gap between crown and brim — so there is nothing to
  paint clay.

  The hat **tips 6° as it arrives**, over `--duration-mark` (620ms) on the
  identity easing. Its `transform-origin` sits on the brim bar
  (`50% 86.25%`, i.e. y=103.5 of 120), so it rotates about the spine rather
  than about its own middle — a hat tip, not a spin. Two things to know if
  you touch this: Tailwind v4's `rotate-*` sets the standalone `rotate`
  property, so the transition list must be `opacity,rotate` (transitioning
  `transform` silently does nothing); and there is no `--duration-*` theme
  namespace, so the token is referenced as
  `duration-[var(--duration-mark)]`. The tilt is `motion-safe:` only —
  reduced motion keeps the swap and drops the movement.
- **Footer** uses **mark 01 in full colour**: bone felt, burnt-clay band, raw
  brim edge. This is the identity's own end card, on plain ground, sized past
  its 96px minimum. It is the only place clay appears on the site.
- Favicon is the shipped `favicon.svg` (mark 02 in a warm-black rounded
  square), plus a 32px PNG and a 180px apple-touch icon.

### The splash

`components/splash.tsx`. An overlay, not a gate: the page renders fully
server-side underneath, so crawlers and no-JS visitors are unaffected.

The sequence is the identity's own argument — *"states of one geometry, not
three logos"* — with the brim bar as the constant:

1. Exposure ramps up from black (Motion 01).
2. The brim draws outward from centre — the spine arrives first (Motion 02).
3. Mark **01** resolves upward off it, clay band and all.
4. **01 → 02** morphs: the crease flattens, the band opens into a slot.
   This is the one real morph, because the two crowns genuinely correspond.
5. The hat is **wiped into the brim** and **03 grows back out of it**.
   This step was originally a morph too, but a solid trapezoid has no
   counterpart in a four-subpath monogram and MorphSVG produced a jumbled
   middle. *"Every mark either grows out of the brim line or is wiped by it"*
   is both better-looking and doctrinally correct.
6. The wordmark resolves. The ground then parts along the spine **while the
   lockup holds**, so the monogram is still standing there as the gallery
   opens behind it; a soft radial scrim travels with it (the identity allows
   02/03 over photography only with one). The scrim is deliberately never
   opaque and is blurred at its edges, so it reads as a haze the photograph
   shows through rather than a dark disc behind the mark. Both dissolve last. It ends on the
   monogram the header wears, so the eye tracks from centre to corner.

Runs 3.16s and **plays on every load** — deliberately. Nobody arrives here for
reference; if you reloaded it, you reloaded it to watch this. It stays
**skippable on any pointer, key, wheel or touch event**, and reduced motion
skips it entirely, that being a stated access need rather than a preference.

Two things to know if you touch it:

- Reveals are driven by **clip rects**, not transforms. GSAP resolves
  `transformOrigin` percentages against the viewBox on SVG children, which
  left the brim translated off centre; `svgOrigin` is the transform-based
  fix, but clip rects need no origin at all and read as "draws" / "wiped",
  which is the identity's own language.
- `finish()` calls `ScrollTrigger.refresh()`. The pinned gallery mounts
  behind a locked scroll, so its pin length is measured against the wrong
  page height until the splash clears.

MorphSVGPlugin and ScrollTrigger both ship free with GSAP (since 3.13, under
its standard no-charge licence). No extra dependency: of the 290 registries in
the shadcn directory, none do true SVG path morphing.

### The role line

`Camera Operator / Director`. Not "Cinematographer", not "Director of
Photography" — nothing in her credits supports either and Toronto's camera
community is small enough that the gap would be noticed.

> Note: the identity system (Rev A) describes her as "Cinematographer and
> director" and its invoice mock is headed "DIRECTOR OF PHOTOGRAPHY". The site
> follows the later Rev B spec. **Her identity document currently contradicts
> her website** — worth fixing before festival week.

---

## Sanity — so Angelia can edit it herself

The site reads from Sanity and falls back to the hardcoded content in
`lib/content.ts`, so it is correct and complete whether or not the CMS exists.
Everything below is about handing her the controls.

**The project must be created under her own email**, not ours — she should own
the content her site runs on, and nothing then has to be transferred later.

### Setup

Creating a project needs an interactive browser login, so these are steps to
run, not something that can be automated:

```bash
npx sanity@latest login          # sign in as Angelia
npx sanity@latest projects create
```

Copy `.env.local.example` to `.env.local` and fill in the project ID. Then add
the same two variables in Vercel (Project → Settings → Environment Variables),
or the deployed site will keep serving the fallback while localhost looks fine.

### Seed it

Do not hand her an empty Studio — that is the fastest way to end up with a CMS
nobody uses. This imports everything the site currently ships: her bio and
contact details, the About photograph, the four gallery frames and the six
selected credits.

```bash
# sanity.io/manage → API → Tokens → add token, "Editor"
SANITY_WRITE_TOKEN=xxx pnpm seed
```

Safe to re-run: every document uses a deterministic `_id` with
`createOrReplace`, and Sanity dedupes uploaded images by content hash. It reads
`lib/content.ts` directly rather than carrying its own copy, so the two cannot
drift.

### Give her access

sanity.io/manage → Members → invite her as **Editor**. The Studio is at
`/studio` on the live site — no separate install, and she can use it from a
phone.

### What she can change

Site settings is a single pinned document, not a list: the site reads
`*[_type == "siteSettings"][0]`, so a second one created by accident would win
or lose at random, and the symptom would be "my edits aren't showing up"
rather than anything she could diagnose. The Studio hides it from the "create
new" menu for the same reason.

| | |
| --- | --- |
| Site settings | name, role line, location, email, IMDb, LinkedIn, SEO description, bio, **About photograph** |
| Photographs | the gallery frames — image, alt text, production name, order |
| Selected credits | title, role, format, studio, episodes, year, order |
| Work — videos | title, link, where, year, order — empty until she has a reel |

Set a **hotspot** on each photograph. The frames crop to 16:9 and the About
portrait to 4:5; the hotspot is what keeps her face in frame rather than
cropped out.

Edits appear on the live site within a minute (`revalidate = 60`).

### If something looks wrong

An empty Sanity result is treated as "not set up yet" and falls back to the
hardcoded content — a half-provisioned CMS can never blank the page. The one
exception is Work videos, where empty genuinely means "none yet". Fields are
merged individually, so clearing one field in the Studio falls back for that
field alone rather than wiping the section.

> The globally installed `sanity` CLI is pinned to Node 18; this project needs
> Node 22. Use `npx`, not the global binary.

---

## Open Graph image

`app/opengraph-image.tsx` renders `components/og/photo.tsx` through Satori at
**build time**, 1200x630. Producers pass her link around during the festival,
so a blank card is a real cost.

The layout is vendored from ogimagecn (`@ogimagecn/photo`) — full-bleed
photograph, gradient scrim, bottom-aligned title block, which also satisfies
the identity's rule that a mark may sit over photography only with a scrim.
It was then dressed in her system: bone rather than white, warm ground rather
than `#0a0a0a`, a warm scrim rather than neutral black, zero radius (its pill
and logo tile ship at 999px / 8px), Archivo medium rather than 700, open
tracking rather than `-0.03em`, and no text-shadow.

Every input is read from disk and inlined as a data URI, so the build never
depends on a deploy URL that does not exist yet:

```
assets/og/hero.jpg      1200x630 crop of the opening frame
assets/og/mark.png      mark 03, bone on transparent
assets/fonts/*.woff     Archivo 500 + IBM Plex Mono 400
```

Satori needs real font buffers and supports **ttf/otf/woff — not woff2**.
Google Fonts' CSS endpoint hands an old user-agent EOT files, which Satori
cannot parse; these came from fontsource via jsdelivr instead. `assets/fonts`
and `assets/og` are committed for that reason, while `assets/originals` is
ignored — it is only needed for the one-time Sanity upload.

To re-cut the card from a different frame:

```bash
ffmpeg -i assets/originals/<slug>.jpg \
  -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630:(iw-1200)*0.5:(ih-630)*0.28" \
  -q:v 3 assets/og/hero.jpg
```

---

## Images

Ten frames, cropped to 1920×1080 (plus 1280×720 for mobile) from
EXIF-corrected masters, each with a hand-chosen focal point rather than a
centre crop. Sources were mixed JPG/PNG/HEIC in both orientations; HEIC is not
web-displayable and was converted.

`01-operating-alexa` and `08-winter-bench` were originally below the
1920×1080 minimum and have been replaced with Topaz upscales (3840×2559 and
5160×3780). Every frame now exceeds the minimum, so all ten are downscaled
into the gallery rather than stretched.

To drop in a replacement (or add a frame), use the prep script — it bakes in
EXIF rotation, converts HEIC, crops 16:9 around a focal point and writes both
sizes:

```bash
scripts/prepare-gallery-image.sh ~/Downloads/hero.jpg 01-operating-alexa 0.5 0.35
```

`focalX`/`focalY` are 0..1 fractions; the default `0.5 0.35` is biased upward
because a centre crop cuts her head off. The script warns if the source is
below the minimum. Check the crop before shipping.
