/**
 * The three marks — one geometry, three states.
 *
 * Geometry is taken verbatim from the identity production files
 * (Downloads/exports/svg, Rev A). Do not redraw these by hand: the ratios are
 * locked against a common brim bar and the brim is the motion spine.
 *
 *   01  literal silhouette. Raw brim edge and centre crown crease retained.
 *       Hero use — landing, end cards, large format. Min 96px wide.
 *   02  reduced silhouette. Tapered crown, band as an OPEN SLOT — the gap
 *       between crown and brim is the band. Favicon, avatar, watermark, and
 *       the only marks (with 03) permitted over photography. Min 24px.
 *   03  AH monogram. Neutral register — paperwork, hat-free contexts. Min 24px.
 *
 * Clay exists only on 01 in full colour. 02 has no band to paint.
 */

type MarkVariant = "01" | "02" | "03";

/** 360 x 120 mark space; 1 unit = brim width / 340. */
const VIEWBOX = "0 0 360 120";

/** The identity rounds corners by matching stroke to fill. */
const ROUND = {
  strokeWidth: 6,
  strokeLinejoin: "round",
} as const;

const CROWN_01 =
  "M108.5,13.2 L142,12.5 L180,15.6 L218,12.5 L251.5,13.2 L277,93 L83,93 Z";
const BAND_01 = "M92.1,64 L267.9,64 L277,93 L83,93 Z";
/** Raw brim edge — deliberately not a straight rect on mark 01. */
const BRIM_01 =
  "M13,99 L347,99 L347.6,107.6 L288,106.4 L232,108.2 L176,106.2 L118,108.1 L62,106.3 L13.6,107.5 Z";

export function Mark({
  variant = "02",
  fullColour = false,
  className,
  title,
}: {
  variant?: MarkVariant;
  /** Mark 01 only: bone felt with the burnt-clay band. Ignored otherwise. */
  fullColour?: boolean;
  className?: string;
  /** Omit for decorative use — adjacent type already carries the name. */
  title?: string;
}) {
  return (
    <svg
      viewBox={VIEWBOX}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {variant === "01" &&
        (fullColour ? (
          <>
            <g fill="#E8DFD1" stroke="#E8DFD1" {...ROUND}>
              <path d={CROWN_01} />
            </g>
            <g fill="#9F4B33" stroke="#9F4B33" {...ROUND}>
              <path d={BAND_01} />
            </g>
            <g fill="#E8DFD1" stroke="#E8DFD1" {...ROUND}>
              <path d={BRIM_01} />
            </g>
          </>
        ) : (
          <g fill="currentColor" stroke="currentColor" {...ROUND}>
            {/* Band knocked out rather than painted, so the mark survives on
                any ground as a single colour. */}
            <path fillRule="evenodd" d={`${CROWN_01} ${BAND_01}`} />
            <path d={BRIM_01} />
          </g>
        ))}

      {variant === "02" && (
        <g fill="currentColor" stroke="currentColor" {...ROUND}>
          <path d="M109,12 L251,12 L266,58 L94,58 Z" />
          <rect x={13} y={99} width={334} height={9} rx={4.5} />
        </g>
      )}

      {variant === "03" && (
        <g fill="currentColor" stroke="currentColor" {...ROUND}>
          <polygon points="84,93 92.8,93 117,12 108.2,12" />
          <polygon points="172,93 163.2,93 139,12 147.8,12" />
          <rect x={109} y={12} width={38} height={9} rx={3} />
          <rect x={93.5} y={64} width={69} height={9} rx={3} />
          <rect x={187} y={12} width={9} height={81} rx={3} />
          <polygon points="276.6,93 267.6,93 256.4,12 265.4,12" />
          <rect x={187} y={64} width={86.2} height={9} rx={3} />
          <rect x={13} y={99} width={334} height={9} rx={3} />
        </g>
      )}
    </svg>
  );
}
