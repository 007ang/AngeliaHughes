/* eslint-disable @next/next/no-img-element -- Rendered by Satori into a PNG at
   build time, never by a browser. Satori understands plain <img> only, and
   next/image has nothing to optimise here. */
/**
 * Vendored from ogimagecn (`@ogimagecn/photo`) and dressed in her identity.
 *
 * The layout is theirs — full-bleed photograph, gradient scrim, bottom-aligned
 * title block — which also happens to satisfy the identity's own rule that a
 * mark may sit over photography only with a scrim.
 *
 * What changed, and why:
 *   - bone (#E8DFD1) rather than #ffffff, and the warm ground rather than #0a0a0a
 *   - the scrim is warm, not neutral black, so it agrees with the ground
 *   - zero border radius; the pill and the logo tile lose their 999px / 8px
 *   - Archivo medium (500), not 700, and open tracking rather than -0.03em —
 *     the wordmark is "set open and quiet"
 *   - no text-shadow; the system is flat, the scrim does that work
 *   - the mark replaces the placeholder logo tile
 *
 * Rendered by Satori, which supports a deliberately small slice of CSS —
 * flex only, no gap shorthand quirks, and every image as a data URI so the
 * build never depends on a deploy URL that does not exist yet.
 */

const GROUND = "#16140F";
const BONE = "#E8DFD1";

export interface PhotoProps {
  image: string;
  label: string;
  title: string;
  brand: string;
  logo?: string;
}

export const Photo = ({ image, label, title, brand, logo }: PhotoProps) => (
  <div
    style={{
      backgroundColor: GROUND,
      color: BONE,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "flex-end",
      padding: "72px",
      position: "relative",
      width: "100%",
    }}
  >
    {/* An <img> rather than backgroundImage — Satori handles it far more
        predictably, and it lets the photograph keep its own aspect. */}
    <img
      alt=""
      src={image}
      width={1200}
      height={630}
      style={{ height: "100%", left: 0, objectFit: "cover", position: "absolute", top: 0, width: "100%" }}
    />

    {/* Warm scrim, weighted to the bottom where the type sits. */}
    <div
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(22,20,15,0.12) 0%, rgba(22,20,15,0.34) 42%, rgba(22,20,15,0.82) 78%, rgba(22,20,15,0.94) 100%)",
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
      }}
    />

    <div style={{ display: "flex", position: "relative" }}>
      {logo ? (
        <img alt="" src={logo} width={180} height={60} style={{ objectFit: "contain" }} />
      ) : null}
    </div>

    <div
      style={{
        display: "flex",
        fontFamily: "Archivo",
        fontSize: 66,
        fontWeight: 500,
        letterSpacing: "0.16em",
        lineHeight: 1.05,
        marginTop: "26px",
        position: "relative",
        textTransform: "uppercase",
      }}
    >
      {title}
    </div>

    <div
      style={{
        color: "rgba(232,223,209,0.55)",
        display: "flex",
        fontFamily: "IBM Plex Mono",
        fontSize: 25,
        letterSpacing: "0.24em",
        marginTop: "22px",
        position: "relative",
        textTransform: "uppercase",
      }}
    >
      {label} · {brand}
    </div>
  </div>
);
