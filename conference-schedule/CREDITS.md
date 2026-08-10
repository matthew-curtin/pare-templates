# Credits

## Photography

Five photographs, all from [Pexels](https://www.pexels.com/license/) —
free to use and modify, no attribution required, credited here anyway.

| File | Where it is | What is in the frame |
| --- | --- | --- |
| `lathe.jpg` | Front page, under the headline | A lathe at rest, task lamp still angled over the bed, swarf across the slide |
| `ironhouse-floor.jpg` | Venue, under the opening paragraphs | A converted mill: new slab and new services, original timber posts, one machine left on its plinth |
| `crane-rail.jpg` | Venue, "What is still in the building" | A large empty hall from floor level, columns receding, travelling crane spanning the roof |
| `gear-train.jpg` | Venue, same row | Four cast toothed wheels off a hand crank, teeth worn bright where they mesh |
| `yard-tables.jpg` | Venue, same row | Trestle tables and benches set out on bare concrete, nobody at them yet |

### The direction

**Available light, nobody in frame, structure visible.** Interiors of
working and converted industrial buildings, photographed as the venue
copy describes the Ironhouse: nothing hidden behind a lining, every
intervention visible and datable. The story the set tells is a building
that was kept — which is the conference's subject standing in for
itself.

`ironhouse-floor.jpg` is the one that earns its place hardest. The page
claims every intervention since 2000 is visible; the photograph settles
it in a way the paragraph cannot.

### How they are made consistent

**One CSS treatment, not sourcing luck.** These five were taken in five
different buildings under five different white balances — one rust-warm,
one cool grey, one with a green machine in it. No amount of searching
turns a stock library into a coherent set.

`--photo-filter` in `globals.css` does it in one line:
`grayscale(1) sepia(0.22) contrast(1.06) brightness(1.02)`. Warm
monochrome rather than flat grey, because the ground is bone and a
neutral photograph on a warm ground reads as a hole in the page. It also
stops photographs competing with the four room hues, which are the only
colours on this site allowed to mean anything.

The treatment lives in CSS rather than being baked into the files, so
the originals on disk stay original, a replacement image inherits it
automatically, and it is a declaration you can click and change in Pare
— the same argument §5 makes for drawing interfaces instead of shipping
screenshots. Every photograph renders through `components/plate.tsx`,
and the checker fails if a second component starts importing
`next/image`.

### What was rejected, and why

Worth recording, because three of these are the traps §6 already warns
about and one is new:

- A **modern steel shed** with a laminate cabinet in it — right search
  term, wrong century.
- A **derelict ruin** with graffiti and moss. Overlap's building was
  made sound; a ruin tells the opposite story.
- **Grand Central Terminal.** Instantly recognisable, and passing a real
  landmark off as an invented Pittsburgh venue is the same problem as a
  legible company sign. *That is the new one: §6's signage rule should
  be read to cover recognisable buildings too.*
- A **domestic pegboard** covered in paper hearts, and a **workshop shot
  so saturated** (yellow ribbon, red toolboxes, blue door) that it would
  have fought the room colours.

`yard-tables.jpg` has a small orange roll-up banner in the left of
frame. It was cropped and enlarged before use to check it carried no
real company name; it is illegible, and the treatment renders it a grey
rectangle.

## Portraits

None, deliberately, and this is the one place §6's carve-out applies.

Thirty speakers would mean thirty real faces standing behind quotes
nobody said. They are drawn as monograms instead, which is also what
most conference sites fall back to when half the speakers have not sent
a headshot yet.

The carve-out is about *faces*. It is not a reason to photograph nothing
— that reasoning is exactly how this template shipped its first version
with no imagery at all.

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
