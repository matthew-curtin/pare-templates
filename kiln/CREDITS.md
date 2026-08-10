# Credits

## Photography

Four photographs, all from [Pexels](https://www.pexels.com/license/) —
free to use and modify, no attribution required, credited here anyway.

| File | Where it is | What is in the frame |
| --- | --- | --- |
| `green-shelf.jpg` | Front page | Dozens of unfired clay bowls standing rim-up in close rows, receding out of focus into a dark studio |
| `elements.jpg` | Firings | The inside of a kiln — heating elements coiled into grooves up a pale refractory wall, one shelf below holding a row of small bowls with gaps between them |
| `stacked.jpg` | Studio | Stacks of pale unfired plates and bowls on a grey metal studio shelf, an empty shelf above them, a window beyond |
| `buckets.jpg` | The shelf | Five open buckets of thick pale liquid seen from above on a speckled concrete floor, one with a dried skin across it |

### The direction

**Work in progress under working light. Nobody in frame, and nothing
finished.**

The last clause is the one that rejected things, and it is a position
rather than a convenience: this site is about the WAIT, and a finished
glazed pot is the one thing the studio cannot show you yet. There is no
photograph of a completed piece anywhere on it. A gallery of members'
work would be a different site with a different argument.

Faces stay out under the usual rule: the ten members here are invented,
so a real person's face under an invented name is a small lie on the
page, and initials are the honest answer. It is a rule about *people*
and it stops there — the pots, the shelves, the kiln and the glaze
bench are all fair game, and they are what a studio actually is.

### What each one is for

- **`green-shelf.jpg`** is the queue, as an object. The shelf page is
  forty-seven rows of a table; this is the same forty-seven things, and
  it makes the point the table cannot — what runs out here is space, not
  patience. It beat two better-lit frames of half a dozen pots for
  exactly that reason: the count IS the argument.
- **`elements.jpg`** is every elevation drawing on the site,
  unabstracted. Elements in the wall, one shelf loaded, real gaps
  between real pots, and the whole upper half of the chamber holding
  nothing. It settles that the empty space in those drawings is a real
  thing somebody is paying to heat, which prose can only assert.
- **`stacked.jpg`** settles the other half of the same claim: that a
  shelf is a HEIGHT. Two shelves, work standing on the lower one, and a
  gap above it that nothing is using. That gap is what the whole site is
  about.
- **`buckets.jpg`** is what "waiting for you" looks like. Five pieces on
  the shelf are held up by their own maker rather than by any kiln, and
  the studio cannot schedule a pot whose glaze nobody has chosen. The
  queue page groups by reason; this is the reason that has a picture.

### The two photographs that are not here, and why

**A gas burner in reduction.** Bramble is the villain of this site — it
fires once a fortnight, it will not light under a fifth full, and it is
why three glazes take three times as long as the other six. A flame at
its burner port would have been the perfect frame for it. Every honest
candidate on Pexels is a **wood** kiln, with logs and ash plainly in
shot, and captioning one of those as a propane kiln is exactly the
failure §6 describes: a small lie sitting on the page forever. Rejected
two strong frames on that basis rather than change the caption.

**Pyrometric cones.** Cone 6 is the unit this whole site counts in, and
it is not a temperature — it is a small pyramid that bends when enough
heat has gone through it for long enough. A photograph would explain
that better than the paragraph now doing the job. Pexels has ice cream
cones, traffic cones and pine cones, and no pyrometric ones at all.

Both gaps were filled by asking a *different* photograph to prove a
*different* claim, which is §6's "change the copy when no photograph
matches" arriving one level up — change which claim the picture is asked
to make.

### How they are made consistent

**One CSS treatment, not sourcing luck.** These four were taken in four
different rooms under four different lights — one near-dark, one under
daylight through a window, one under industrial fluorescent, one
overhead on a concrete floor. No amount of searching turns a stock
library into a coherent set, because the library is not a shoot.

`--photo-filter` in `src/app/globals.css` does it in one line:

```css
saturate(0.52) sepia(0.2) contrast(1.06) brightness(0.99)
```

This is a **grade rather than a crush**, and §6's question is what sets
the dial: is the colour in the frame part of what it is being asked to
prove? Here it half is. The greyness of raw clay is the whole subject of
two of these, and a duotone would flatten the difference between bone-dry
white greenware and clay still damp enough to be brown — which is the
difference between a pot that can be fired and one that cannot. So the
saturation comes most of the way out and not all the way, and a warm
cast goes back in, because a neutral photograph on this bone ground
reads as a hole cut in the page. Compare `conference-schedule`, whose
subject is a building and which crushes to a duotone at no cost.

Every photograph goes through `src/components/plate.tsx`, which is the
only file in the template that renders an `<img>` —
`scripts/check-imagery.mjs` at the repo root fails the template if a
second one starts. The treatment is a class in the stylesheet rather
than an inline style on the component, because "there is exactly one
declaration of this" is the property being claimed.

### Weight

Four files, 502KB, comfortably inside the ~1MB budget in CONVENTIONS §6.
Fetched at roughly twice their display size and left at the compression
they arrived with, because re-encoding an already-compressed stock JPEG
usually makes it bigger.

## Type

**Fraunces Variable** for anything that is a claim, and **Public Sans
Variable** for anything that is a measurement.

Fraunces is used for its **optical-size** axis rather than its weight,
which is the point of having it: `opsz` is set to 144 on the display
sizes and 96 on ordinary headings, so the letterforms get the tighter
joins and finer hairs that a large size wants and the same face does not
turn into a scaled-up 18px setting. `SOFT` and `WONK` are set
deliberately too — WONK swaps in the alternate `g` and `y`, which is a
decision rather than a default.

`scripts/check-colours.mjs` fails the run if the axis stops being set,
or if every `opsz` in the file is the same number — a variable font
nobody varies is a static font with extra bytes.

Both are self-hosted through `@fontsource-variable`, so the template
works offline and makes no third-party request. Fraunces is OFL; Public
Sans is OFL.

## Everything else

Marlpit, Hollowmere, Sedge Row, the ten members, the pots, the glaze
recipes and the underwriting of the electricity bill are all invented.
The arithmetic is not: a kiln really does cost the same empty as full, a
shelf really is as tall as the tallest thing standing on it, and a
fortnightly gas firing with a load threshold really will strand somebody
for a month.
