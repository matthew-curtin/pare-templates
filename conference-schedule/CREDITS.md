# Credits

## Photography

None, and not by omission.

Thirty speakers would mean thirty portraits, and CONVENTIONS §6 rules
out attaching a stock photograph to an invented person — thirty real
faces standing behind quotes nobody said, on a site whose whole subject
is being honest about what things cost. The venue is invented too, so
there is no building to show.

They are drawn as monograms, which is also what most conference sites
fall back to when half the speakers have not sent a headshot yet.

## Icons

The mark — two blocks sharing a column of time, one solid and one
outlined, overlapping — is inline SVG in
`src/components/wordmark.tsx`, and again in `src/app/icon.svg` for the
favicon. Change one and change the other. There is no icon library and
no icon font.

It is the schedule's central problem drawn at 24px.

## Type

**Archivo**, one family for everything, self-hosted by `next/font` at
build time so there is no request to a font CDN at runtime and no flash
of fallback text.

The template uses its `wdth` axis rather than a second typeface: the
signage is set wide because a wallchart headline is a painted sign, and
the column labels are set narrow so they fit a 150px track without
shrinking. The axis is doing the hierarchy work a font pairing would
otherwise do, which is the argument for a variable font.

Asking for the axis explicitly matters. Without `axes: ["wdth"]` in the
`next/font` call you get the variable WEIGHT only, and every
`font-variation-settings: "wdth"` in the stylesheet silently does
nothing — the page looks fine and the whole typographic idea is absent.

Figures use `font-variant-numeric: tabular-nums` through a `.tabular`
class, because times and prices sit in columns.

## Colour

Original to this template, and **validated rather than chosen**.
`node scripts/check-colours.mjs` reads the tokens back out of
`src/app/globals.css` — resolving the OKLCH and the `color-mix()`
derivations itself — simulates protanopia, deuteranopia and tritanopia,
and measures every pair that can appear together plus every piece of
text against every surface it can land on. Forty-three checks, and it
prints its own tightest margins rather than carrying a "last run"
comment that goes stale.

The load-bearing claim it defends is that the four rooms are separated
in **lightness** as much as in hue. Four hues at one lightness collapse
to two under deuteranopia, and the grid uses colour as its main
glanceable "which room" cue, so the spacing is what actually makes four
tracks tellable apart.

Which hue landed on which room was decided by the checker rather than by
taste. Red and ochre are the pair that collapses — measured at ΔE 7 when
they sat next to each other on the ladder — so they took the two ends of
it and the two hues that survive dichromacy sit between them. The rooms
then happen to read correctly anyway: the Foundry is iron-red, the
Drawing Office is blueprint blue, the Yard is outdoor teal.

Three values moved because of the check rather than because of taste:
the two lighter inks (a warm ground raises the bar for everything drawn
on it) and the now-marker green, which landed at exactly 3.00 against a
floor of 3 — a pass one rounding would have turned into a failure.

## Everything else

No third-party assets of any kind. Nothing is fetched at runtime, so the
template works offline.
