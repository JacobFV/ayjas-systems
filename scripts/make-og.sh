#!/usr/bin/env bash
# Generates the Open Graph / Twitter card at public/og.png.
#
# Drawn with ImageMagick primitives rather than rasterised from SVG so the
# output does not depend on an SVG delegate being installed. Re-run only when
# the card design or the headline changes; the PNG is committed.
set -euo pipefail

cd "$(dirname "$0")/.."
OUT=public/og.png

SERIF=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
SANS=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf

for f in "$SERIF" "$MONO" "$SANS"; do
  [ -f "$f" ] || { echo "missing font: $f" >&2; exit 1; }
done

# Assembly geometry: three plates, apex-centred on CX, side S, spaced Z apart.
CX=1010
APEX=340
HW=113 # (S/2) * cos30, rounded
HH=65  # (S/2) * sin30 * 2 / 2 — half the plate's screen height
Z=58

CMD=(convert -size 1200x630 xc:'#05110f')

# sparse coordinate grid
for x in 120 240 360 480 600 720 840 960 1080; do
  CMD+=(-stroke '#3fc3b6' -strokewidth 1 -fill none -draw "fill-opacity 0 stroke-opacity 0.055 line $x,0 $x,630")
done
for y in 120 240 360 480 600; do
  CMD+=(-draw "stroke-opacity 0.045 line 0,$y 1200,$y")
done

# top hairline: the one place the brand teal appears as an edge
CMD+=(-stroke '#3fc3b6' -strokewidth 3 -draw "stroke-opacity 0.9 line 0,1 1200,1")

# ---- exploded plates, right side --------------------------------------------
plate() { # $1 = elevation
  local z=$1
  printf 'stroke-opacity 0.6 fill-opacity 0.4 polygon %d,%d %d,%d %d,%d %d,%d' \
    "$CX" "$((APEX - z))" \
    "$((CX + HW))" "$((APEX + HH - z))" \
    "$CX" "$((APEX + HH * 2 - z))" \
    "$((CX - HW))" "$((APEX + HH - z))"
}
CMD+=(-stroke '#6c8992' -strokewidth 1 -fill '#0f2e2b')
CMD+=(-draw "$(plate $((Z * 2)))")
CMD+=(-draw "$(plate $Z)")
CMD+=(-draw "$(plate 0)")

# corner struts tie the explosion back into one assembly
CMD+=(-stroke '#1d4642' -strokewidth 1 -fill none)
CMD+=(-draw "stroke-opacity 0.85 line $CX,$((APEX - Z * 2)) $CX,$APEX")
CMD+=(-draw "stroke-opacity 0.85 line $((CX + HW)),$((APEX + HH - Z * 2)) $((CX + HW)),$((APEX + HH))")
CMD+=(-draw "stroke-opacity 0.85 line $((CX - HW)),$((APEX + HH - Z * 2)) $((CX - HW)),$((APEX + HH))")

# ---- the tracked request: the only saturated element ------------------------
CMD+=(-stroke '#d64221' -strokewidth 3 -fill none)
CMD+=(-draw "stroke-opacity 1 polyline 1049,287 1049,345 975,347 975,405")
CMD+=(-stroke none -fill '#d64221')
CMD+=(-draw "circle 1049,287 1054,287")
CMD+=(-draw "circle 975,405 980,405")

# ---- type -------------------------------------------------------------------
CMD+=(-stroke none)

CMD+=(-font "$MONO" -pointsize 18 -fill '#6d8480' -kerning 4
      -annotate +80+120 'INSTITUTIONAL OPERATIONS')

CMD+=(-font "$SERIF" -pointsize 52 -fill '#e6ece9' -kerning 0
      -annotate +80+205 'Operational software for')
CMD+=(-annotate +80+273 'institutions that must')
CMD+=(-annotate +80+341 'account for every decision.')

CMD+=(-font "$SANS" -pointsize 21 -fill '#9fb3ae'
      -annotate +80+400 'Service requests, approvals, vendor coordination,')
CMD+=(-annotate +80+430 'and the record of all three.')

# base rule + wordmark + the line that sets the tone
CMD+=(-stroke '#1d4642' -strokewidth 1 -fill none -draw "line 80,490 1120,490")
CMD+=(-stroke none -font "$MONO" -pointsize 22 -fill '#e6ece9' -kerning 6
      -annotate +80+538 'AYJAS SYSTEMS')
CMD+=(-font "$MONO" -pointsize 16 -fill '#6d8480' -kerning 1
      -annotate +80+568 'Lagos, Nigeria  ·  every claim carries an explicit state')

"${CMD[@]}" -strip "$OUT"
echo "wrote $OUT"
