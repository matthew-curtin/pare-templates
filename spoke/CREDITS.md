# Credits

## Photography

**The direction:** *parts before they are a bicycle — close, on a bench
or in a stand, no faces, and enough depth of field to COUNT things.*

The last clause did the work. This site is entirely about counting —
sixty-four spokes, eight hundred and twelve nipples, five parts that
cost seventy cents between them — so a photograph too shallow to count
anything in is decoration however handsome it is. It rejected a
beautifully lit hub shot at f/1.4 with three spokes in focus, and a rear
triangle whose only readable content was a manufacturer's decal.

Four frames, from [Pexels](https://www.pexels.com/license/), free to use
and modify with no attribution required. Listed anyway.

| File | What it is | What it is for |
| --- | --- | --- |
| `wheel.jpg` | A front wheel in low sun, spokes crossing between hub and rim | Makes "sixty-four spokes" a real number rather than a claim on a page |
| `bins.jpg` | Steel bins of bolts, washers, nyloc nuts and crimp spade terminals | Three of the five parts closest to stopping a Kade are in this picture |
| `shop.jpg` | An assembly workshop from above: frames overhead, parts bins on the wall, bicycles on stands | Shows that a bill of materials is a room |
| `rack.jpg` | Bare frames and forks hanging, two tagged by hand "57cm" | Explains a five-week lead time in one image |

All four are treated by a single CSS declaration —
`--photo-filter: saturate(0.58) sepia(0.14) contrast(1.05)
brightness(1.01)` — applied in `src/components/plate.tsx`, which is the
only component in the template that renders an `<img>`. That is what
makes four frames shot in four rooms under four different lights a set,
and it is a property of the code rather than a promise about future
diligence.

**Graded rather than crushed.** Steel, ash timber and powder coat are
three materials this site names by colour, and a duotone would delete
the difference. The consequence, per CONVENTIONS §6, is that the
sourcing had to work harder — which is what the direction sentence is
for.

### Two things that changed during sourcing

**The subject changed once.** The front page was planned around a
brazing torch — the work that is not in the parts figure. No honest
candidate exists: everything returned for brazing was arc welding, which
is not what happens to a bicycle frame. The workshop-from-above frame
makes the same point with nothing misleading in it. §6's rule is to
change the copy when no photograph matches; here it was the subject.

**One frame was cropped rather than rejected.** The hanging framesets
carried a real Amsterdam shop's printed tag and a real price ticket in
the top quarter of the frame — §6 forbids shipping another company's
name, and it is the easiest way for one to get onto a page. The centre
band has neither, and is the better composition: the handwritten size
tags are the whole point and the ceiling was not.

Every frame was checked by cropping and enlarging rather than by
squinting, which is how the tag was found — it is illegible at any size
a reader would see it at, and perfectly legible at 3×.

## Type

**Recursive Variable**, by Arrow Type, under the SIL Open Font License
1.1, vendored via `@fontsource-variable/recursive`.

One family carries both roles. Recursive's `MONO` axis runs from 0
(proportional) to 1 (monospaced) on a single set of outlines, so the
figures in a column and the prose above them are literally the same
typeface at two settings rather than two families that have to be made
to get along. `.fig` in `src/index.css` is the entire mechanism, and
`scripts/check-colours.mjs` asserts that both settings are actually
used — a variable font nobody varies is a static font with extra bytes.
