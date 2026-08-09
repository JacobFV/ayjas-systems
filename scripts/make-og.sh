#!/usr/bin/env bash
# Generates the Open Graph / Twitter card at public/og.png.
#
# Set as a document cover, matching the site: ivory stock, ink type, ruled like a
# letterhead, with the assembly drawing tipped in as a dark plate. Drawn with
# ImageMagick primitives rather than rasterised from SVG so the output does not
# depend on an SVG delegate being installed. The PNG is committed; re-run only
# when the card design or the headline changes.
set -euo pipefail

cd "$(dirname "$0")/.."
OUT=public/og.png

SERIF=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
SANS=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf

for f in "$SERIF" "$MONO" "$SANS"; do
  [ -f "$f" ] || { echo "missing font: $f" >&2; exit 1; }
done

PAPER='#faf8f2'
INK='#14171b'
INK_MID='#4c545e'
INK_FAINT='#5f6771'
RULE='#cfc9ba'
STEEL='#6a7480'
ANNOT='#a8351c'
ANNOT_LINE='#c0492a'
PLATE='#14171b'
PLATE_FACE='#1e252e'
PLATE_TEXT='#e7e5df'

# Plate geometry: three plates, apex-centred on CX, spaced Z apart.
CX=1000
APEX=250
HW=95
HH=52
Z=48

CMD=(convert -size 1200x630 "xc:$PAPER")

# Faint drafting rule, same 88px module as the site.
for x in 88 176 264 352 440 528 616 704 792 880 968 1056 1144; do
  CMD+=(-stroke "$INK" -strokewidth 1 -fill none -draw "fill-opacity 0 stroke-opacity 0.05 line $x,0 $x,630")
done
for y in 88 176 264 352 440 528 616; do
  CMD+=(-draw "stroke-opacity 0.05 line 0,$y 1200,$y")
done

# ---- letterhead ------------------------------------------------------------
CMD+=(-stroke "$INK" -strokewidth 3 -fill none -draw "stroke-opacity 1 line 0,2 1200,2")
CMD+=(-stroke none -font "$MONO" -pointsize 21 -fill "$INK" -kerning 6
      -annotate +80+70 'AYJAS SYSTEMS')
CMD+=(-font "$MONO" -pointsize 15 -fill "$INK_FAINT" -kerning 2
      -annotate +80+96 'OPERATIONAL SYSTEMS DOSSIER  ·  AIS-OPS-2026-01  ·  REV 1.0  ·  PUBLIC')
CMD+=(-stroke "$RULE" -strokewidth 2 -fill none -draw "line 80,118 1120,118")

# ---- plate: exploded assembly, tipped in on the right ----------------------
CMD+=(-stroke "$INK" -strokewidth 1 -fill "$PLATE" -draw "rectangle 862,150 1140,404")

plate() { # $1 = elevation
  local z=$1
  printf 'stroke-opacity 0.65 fill-opacity 1 polygon %d,%d %d,%d %d,%d %d,%d' \
    "$CX" "$((APEX - z))" \
    "$((CX + HW))" "$((APEX + HH - z))" \
    "$CX" "$((APEX + HH * 2 - z))" \
    "$((CX - HW))" "$((APEX + HH - z))"
}
CMD+=(-stroke "$STEEL" -strokewidth 1 -fill "$PLATE_FACE")
CMD+=(-draw "$(plate $((Z * 2)))")
CMD+=(-draw "$(plate $Z)")
CMD+=(-draw "$(plate 0)")

# struts tie the explosion back into one assembly
CMD+=(-stroke '#333b45' -strokewidth 1 -fill none)
CMD+=(-draw "stroke-opacity 1 line $CX,$((APEX - Z * 2)) $CX,$APEX")
CMD+=(-draw "line $((CX + HW)),$((APEX + HH - Z * 2)) $((CX + HW)),$((APEX + HH))")
CMD+=(-draw "line $((CX - HW)),$((APEX + HH - Z * 2)) $((CX - HW)),$((APEX + HH))")

# the tracked request: the only saturated element in the drawing
CMD+=(-stroke "$ANNOT_LINE" -strokewidth 3 -fill none)
CMD+=(-draw "stroke-opacity 1 polyline 1035,192 1035,240 970,242 970,290")
CMD+=(-stroke none -fill "$ANNOT_LINE")
CMD+=(-draw "circle 1035,192 1040,192")
CMD+=(-draw "circle 970,290 975,290")

CMD+=(-font "$MONO" -pointsize 13 -fill '#858c94' -kerning 2
      -annotate +882+382 'CONFIGURED DEPLOYMENT')
CMD+=(-font "$MONO" -pointsize 14 -fill "$INK" -kerning 2
      -annotate +862+428 'FIGURE 1.1')

# ---- headline --------------------------------------------------------------
CMD+=(-font "$SERIF" -pointsize 50 -fill "$INK" -kerning 0
      -annotate +80+200 'Operational software for')
CMD+=(-annotate +80+265 'institutions that must')
CMD+=(-annotate +80+330 'account for every decision.')

CMD+=(-font "$SANS" -pointsize 20 -fill "$INK_MID"
      -annotate +80+390 'Service requests, approvals, vendor coordination,')
CMD+=(-annotate +80+418 'and the record of all three.')

# ---- running foot ----------------------------------------------------------
CMD+=(-stroke "$INK" -strokewidth 2 -fill none -draw "line 80,492 1120,492")
CMD+=(-stroke none -font "$MONO" -pointsize 15 -fill "$INK_FAINT" -kerning 2
      -annotate +80+524 'PART 1 OF 7  ·  PURPOSE AND SYSTEM  ·  ISSUED 2026-08-09')
CMD+=(-font "$MONO" -pointsize 15 -fill "$ANNOT" -kerning 2
      -annotate +80+556 'EVERY CLAIM CARRIES AN EXPLICIT STATE.')
CMD+=(-font "$MONO" -pointsize 15 -fill "$INK_FAINT" -kerning 2
      -annotate +80+588 'UNFILLED FIELDS ARE SHOWN AS UNFILLED.')

"${CMD[@]}" -strip -depth 8 "$OUT"
echo "wrote $OUT"
