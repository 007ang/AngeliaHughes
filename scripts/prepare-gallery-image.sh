#!/usr/bin/env bash
# Prepare one gallery frame: EXIF-correct, crop to 16:9 around a focal point,
# and emit the 1920 + 1280 pair into public/gallery/.
#
#   scripts/prepare-gallery-image.sh <source> <slug> [focalX] [focalY] [--tone]
#
# focalX / focalY are 0..1 fractions of where to anchor the crop
# (0.5,0.5 = centre; lower Y keeps more of the top). Default 0.5 / 0.35 —
# biased upward because these are photographs of a person and a centre crop
# cuts her head off.
#
# --tone converts to warm monochrome: greyscale tinted along the identity's
# warm axis so it sits with the ground and bone rather than reading cold.
# Neutral greyscale looks chilly next to #16140F, and a full ground-to-bone
# duotone lifts the blacks until the frame goes hazy.
#
# Example — replacing the opening frame with a higher-resolution original:
#   scripts/prepare-gallery-image.sh ~/Downloads/hero.jpg 01-operating-alexa 0.5 0.35
#
# Example — re-toning the opening frame:
#   scripts/prepare-gallery-image.sh assets/originals/01-operating-alexa.jpg \
#     01-operating-alexa 0.5 0.35 --tone
set -euo pipefail

SRC=${1:?usage: prepare-gallery-image.sh <source> <slug> [focalX] [focalY]}
SLUG=${2:?missing slug}
FX=${3:-0.5}
FY=${4:-0.35}
TONE=""
for arg in "$@"; do
  [ "$arg" = "--tone" ] && TONE=",format=gray,format=rgb24,colorchannelmixer=rr=1:gg=0.96:bb=0.90"
done

command -v ffmpeg >/dev/null || { echo "ffmpeg is required (brew install ffmpeg)"; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$ROOT/public/gallery" "$ROOT/assets/originals"

# sips bakes in EXIF rotation and converts HEIC/PNG, which browsers can't use.
sips -s format jpeg -s formatOptions 95 "$SRC" --out "$TMP/master.jpg" >/dev/null
cp "$TMP/master.jpg" "$ROOT/assets/originals/$SLUG.jpg"

W=$(sips -g pixelWidth "$TMP/master.jpg" | awk '/pixelWidth/{print $2}')
H=$(sips -g pixelHeight "$TMP/master.jpg" | awk '/pixelHeight/{print $2}')
if [ "$W" -lt 1920 ] || [ "$H" -lt 1080 ]; then
  echo "warning: source is ${W}x${H}, below the 1920x1080 minimum — it will be upscaled and look soft full-bleed."
fi

for SIZE in 1920 1280; do
  HEIGHT=$(( SIZE * 9 / 16 ))
  ffmpeg -loglevel error -y -i "$TMP/master.jpg" \
    -vf "scale=${SIZE}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${SIZE}:${HEIGHT}:(iw-${SIZE})*${FX}:(ih-${HEIGHT})*${FY}${TONE}" \
    -q:v 3 "$ROOT/public/gallery/${SLUG}-${SIZE}.jpg"
done

echo "wrote public/gallery/${SLUG}-1920.jpg and -1280.jpg  (focal ${FX},${FY}, source ${W}x${H})"
echo "check the crop before shipping — confirm it did not clip her head or the hat."
