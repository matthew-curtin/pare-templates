# Credits

## Photography

**The direction:** *the plant at the moment it is worth the walk — close
enough that ONE thing is the subject, no people, and never a photograph
of "a garden".*

The last clause did the work and cost three otherwise handsome
candidates. A wide shot of a lawn with shrubs round the edge is what
every garden's website is made of, and it cannot say anything this
site's arithmetic has not already said better.

Seventeen frames, from [Pexels](https://www.pexels.com/license/), free
to use and modify with no attribution required. Listed anyway.

| File | What it is | What it is for |
| --- | --- | --- |
| `magnolia.jpg` | Pink magnolia open on bare branches against blue sky | The site's central claim in one frame — this happens on bare wood, above your head, before anything has a leaf |
| `bluebells.jpg` | A bluebell carpet between grey trunks | The one thing here nobody planted |
| `snowdrops.jpg` | A dense mass of snowdrops, heads down | Quantity, not a portrait — the note claims four hundred metres from one lifted clump |
| `witchhazel.jpg` | Pale strap petals on a bare grey branch | February, on bare wood, nothing else out. Makes the winter half credible |
| `bark.jpg` | Bark peeling in thin translucent sheets | Twenty weeks of interest with no flower in it |
| `mimosa.jpg` | Yellow pompoms on ferny grey-green foliage | The foliage is the note's real point |
| `camellia.jpg` | Pink camellias with buds behind | Flowers and buds together: it keeps going for ten weeks |
| `ferns.jpg` | Tree ferns in mist, trunks visible | A century of growth at two centimetres a year |
| `gunnera.jpg` | One backlit leaf filling the frame | Scale, which prose cannot do without boasting |
| `hydrangea.jpg` | A flat mauve lacecap head | What actually carries late August |
| `fuchsia.jpg` | Slim red and purple flowers on arching stems | Why the worst week of the year is not completely empty |
| `acer.jpg` | A maple in full scarlet, seen up into the canopy | The one autumn plant that performs every year |
| `hollow.jpg` | A broad oak from underneath | The shelter the whole garden depends on |
| `burnside.jpg` | A burn over mossy boulders | Wet ground and moving water — what the blue poppies need |
| `glasshouse.jpg` | A white cast-iron spiral stair under glass | The ironwork that costs more to heat than everything else |
| `shore.jpg` | A sea loch, wind-cut scrub, hills beyond | Everything in the frame is growing into salt wind |
| `arboretum.jpg` | Birches turning on an open slope | The only part of the garden with a horizon in it |

All seventeen are treated by a single declaration —
`--photo-filter: saturate(0.9) contrast(1.06) brightness(1.02) sepia(0.05)`
— applied in `src/components/plate.tsx`, the only component in the
template that renders an `<img>`. That is what makes seventeen frames
shot in seventeen places under seventeen different lights a set, and it
is a property of the code rather than a promise about future diligence.

**Graded, not crushed.** Two templates in this repo reduce their
photographs to a duotone and are right to: their subject is a building,
or weather, and hue is carrying nothing. This one is about a bluebell
wood being violet and a katsura being apricot — the colour IS the
evidence the site argues from, so the grade only pulls the set toward
each other. The consequence, which CONVENTIONS §6 names explicitly, is
that the sourcing had to do more work.

### Six things have no photograph, and that is a decision

§6 says that when no honest frame exists you change the copy, or change
the subject — never caption a picture as something it is not. Six
accessions ended up here, and the tile falls back to a flat field of the
plant's own colour, which is a designed state rather than a hole.

- **Embothrium** — every candidate was a protea or a leucospermum. Same
  family, wrong genus, wrong continent.
- **Eucryphia** — everything returned was spring cherry or apple
  blossom. An August tree captioned with April flowers is exactly the
  "plaice" error §6 records.
- **Sorbus 'Joseph Rock'** — three searches for yellow rowan returned
  pyracantha, mislabelled by the uploaders. Dense orange berries on an
  evergreen shrub is not a loose bunch of amber ones on a pinnate-leaved
  tree, and the page it would sit on explains that difference in the
  next sentence.
- **Rhododendron arboreum** — the closest was magenta. The note says
  *blood red*, and the flat colour field the tile falls back to is a
  more accurate picture of the plant than the magenta photograph.
- **Cardiocrinum** and **Crinodendron** — no honest candidate at all.

And one that is almost a joke the content wrote for itself:
**Meconopsis**, the Himalayan blue poppy, whose own note says the colour
comes out purple on every camera ever made. Everything Pexels returns
for "blue poppy" is a field poppy or a cornflower. So the one plant on
this site that says it cannot be photographed has no photograph.

Every frame was checked by cropping and enlarging rather than by
squinting — §6's rule about legible signage and recognisable landmarks.
Two candidates were rejected on that basis: a glasshouse interior that
was identifiably Kew, and a bluebell avenue that was the Dark Hedges.

## Type

**Bricolage Grotesque** (Atkinson Super / Mathieu Triay) and **Instrument
Sans** (Rodrigo Fuenzalida and Jordan Egstad), both under the SIL Open
Font License 1.1, vendored via `@fontsource-variable`.

Bricolage's `opsz` axis does the thing an optical-size axis is actually
for and which almost nobody does with a variable font: it tracks the
size the type is set at. It runs to 96 on the monument figures, which
thins the strokes and tightens the joins so a ten-rem word is not a fat
one enlarged, and drops to 12 on captions, which thickens the stems so
they survive at eleven pixels. `scripts/check-colours.mjs` asserts the
axis is genuinely driven — a variable font nobody varies is a static
font with extra bytes.

The face is chosen against the subject. A botanic garden's default is an
engraved serif and a wreath; this garden is arguing with its own
institution, so the voice is a contemporary grotesque with slightly
wrong proportions. The only concession to convention is that botanical
binomials stay italic, which is not a style choice.
