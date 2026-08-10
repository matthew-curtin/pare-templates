# Credits

## Photography

Five photographs, all from [Pexels](https://www.pexels.com/license/) —
free to use and modify, no attribution required, credited here anyway.

| File | Where it is | What is in the frame |
| --- | --- | --- |
| `garden-room.jpg` | Front page, and the garden room at 1140 Cassel Avenue | Two armchairs facing a wall of sliding doors onto a garden. Completely flat light: no patch of sun on the carpet and nothing casting a shadow on the paving outside |
| `january-sun.jpg` | The principal bedroom at 1140 Cassel Avenue | A tall panelled room in low winter light, with a hard-edged rectangle of sun across a herringbone floor and a bench. Bare trees outside |
| `south-side.jpg` | The living room at 27 Ferry Lane, and the About page | Two low swivel chairs in a bay window, late sun raking across bare boards and up the side of one chair |
| `the-ridge.jpg` | The living room at 61 Hollow Road | A band of windows above a radiator, looking at a dense stand of conifers that fills the view above the head of the window. Snow on the ground, dark room |
| `one-wall.jpg` | The main room at 5 Mill Court | A run of tall steel-framed industrial windows down one side of a concrete interior, bare trees outside, hard sun striping the piers and the floor |

### The direction

**Interiors only, daylight only, no lamps lit, nobody in frame, and the
window in the shot.**

That sentence is enough to accept or reject a candidate in about two
seconds, which is the whole job of it — and on this template it is also
the argument. The site's claim is that a listing photograph is taken in
the one hour that flatters a room, so a set of warm lamp-lit interiors
would be the exact genre the copy is arguing against. "The window in the
shot" is the load-bearing clause: it is what makes every frame here
evidence rather than decoration, because you can see where the light is
coming from and judge the caption against the picture.

It did real work. Three strong candidates were rejected for a lit
pendant or table lamp, which is not a detail — a room lit by a lamp
cannot show you anything about its daylight.

### What each one is for

- **`garden-room.jpg`** is the seductive photograph the whole site
  exists to complicate, and it is on the front page under a caption
  giving the hour. It shows what "generously glazed and no direct sun"
  actually looks like: calm, even, rather beautiful, and with no shadow
  anywhere in the frame — inside or out. That absence is the evidence.
- **`january-sun.jpg`** is the same house four rooms away and is the
  opposite: a hard beam on a floor, in the season the site keeps arguing
  about, with bare trees dating it. Having both on one property is the
  argument in two pictures.
- **`south-side.jpg`** is the cheapest house doing what the most
  expensive one cannot, and it is the only frame here where the sun is
  low and warm rather than overhead.
- **`the-ridge.jpg`** settles a claim prose can only assert. The survey
  says a ridge stands twenty-six degrees above those windows; here it
  is, at midday in December, standing between a south-facing room and
  the sun.
- **`one-wall.jpg`** shows single aspect rather than stating it. Every
  opening in the frame is in the same wall, which is why that room's day
  starts when the sun comes round rather than when it comes up.

**Every caption's hour is checked against the model.** Each `Shot`
carries a `lit` flag saying whether there is direct sun in the frame,
and `scripts/check-sun.mjs` puts the stated date and time through the
same arithmetic the rest of the site uses and fails if the answer
disagrees. So a caption cannot drift away from the picture it sits
under, in either direction. That check is worth more here than anywhere
else in the fleet, because the hour IS the content.

### The sixth photograph, and why there isn't one

8 Orchard Row carries none, deliberately. Its lesson is a close
obstruction on a heavily glazed elevation — floor-to-ceiling glass
thirty feet from the row opposite — and that is the *same mechanism*
`the-ridge.jpg` already shows, with a different object in the way. A
second picture of it would be exactly the decoration §6 warns about: an
image you could swap for another of the same subject without anybody
noticing.

Two candidates were tried first and both failed the frame check rather
than the direction. One had a roadworks sign with legible lettering down
the street; both put an unmistakably European street outside a house the
copy says is a 2023 new-build in Michigan. §6 asks whether a photograph
contradicts the claim beside it, and a pantiled terrace does.

### How they are made consistent

**One CSS treatment, not sourcing luck.** These five were taken in five
different buildings under five different white balances — one cold and
industrial, one golden, one snowbound, two domestic and neutral. No
amount of searching turns a stock library into a coherent set, because
the library is not a shoot.

`--photo-filter` in `globals.css` does it in one line:

```css
saturate(0.44) sepia(0.17) contrast(1.07) brightness(1.02)
```

**This is a deliberately weaker treatment than its neighbours in the
fleet, and the reason is the subject.** `trail-guide` and
`conference-schedule` crush their photographs to a duotone, because the
colour in them carries nothing — the subject is weather, or a building,
and hue is noise to be removed. On a site about daylight the hue *is*
the evidence. A warm raking beam and a flat cold north light are two
different claims, and greyscale would delete the difference the page is
arguing about.

So this is a partial desaturation: enough to pull a teal industrial cast
and a golden domestic one towards each other, not so much that warm
light stops reading as warm. The slight sepia gives the set one shared
temperature and the contrast lift keeps the edge of a beam crisp, which
is the one thing every frame here is being asked to show.

The corollary is that **the sourcing has to work harder here than in a
duotone template**, because less of the disagreement is being ironed out
afterwards. That is what the direction sentence is for, and it is why
"no lamps lit" is in it.

Three properties make the CSS the right place for it either way: the
files on disk stay the originals, so the decision is reversible; a
replacement image inherits the treatment automatically; and it is a
declaration you can click and change in Pare, which a flattened JPEG is
not. Every photograph goes through `components/plate.tsx`, and nothing
else may import `next/image` — `scripts/check-imagery.mjs` at the repo
root fails the template if a second file does.

### Weight

Five files, 768KB, inside the ~1MB budget in CONVENTIONS §6. Fetched at
roughly twice their display size — 1200px for the landscape plates,
820px for the portraits — and left at the compression they arrived with,
because re-encoding an already-compressed stock JPEG usually makes it
bigger.

## Type

**Bricolage Grotesque** for display, headings, and every label inside a
drawing, with two of its variable axes doing real work: `opsz` set in
step with the type scale, and `wdth` narrowed for the dense measurement
labels. **Geist** for body text. Both from Google Fonts, both OFL.

There is no bold anywhere on this site — weights are 400 and 500 only,
and `scripts/check-colours.mjs` fails the run if one appears.

## Everything else

The company, the town, the six houses, the wardens of every number on
this site: invented. The astronomy is not — sunrise, sunset and solar
position are the standard textbook formulae for 42.3° north, and agree
with a published almanac to within about two minutes.
