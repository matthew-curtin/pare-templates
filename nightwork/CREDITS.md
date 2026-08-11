# Credits

## Photography

**The direction:** *the ground a display is fired from, empty — and the
light itself only where the light is the evidence.*

The second clause is the whole set, and it exists because the obvious
approach was worse. A photograph of a firework on a pyrotechnics
website is the most predictable image in the world and says nothing that
the site's own drawings do not say better. Three of these six are
fireworks anyway, because each is doing work no sentence can.

Six frames, from [Pexels](https://www.pexels.com/license/), free to use
and modify with no attribution required. Listed anyway.

| File | What it is | What it is for |
| --- | --- | --- |
| `climb.jpg` | A long exposure: an unbroken trail rising from the bottom of the frame to a violet burst near the top | The site's whole argument in one image. The climb is visible, so the gap between firing and breaking stops being an abstraction |
| `gold.jpg` | Two overlapping golden chrysanthemums, trailing stars curving down | Charcoal at 1700 kelvin — the thing almost every display is mostly made of, shown next to the expensive alternatives |
| `green.jpg` | A single green burst isolated on black, stars radiating from a white centre | Proves what the field's drawing depends on: every break has a near-white core, which is the only reason a copper blue at 1.2:1 against the night is visible at all |
| `fell.jpg` | A drystone wall over open moorland under heavy cloud | Bracken Fell, the one site whose GROUND decides something — there is visibly nothing here to bolt a rack to |
| `stand.jpg` | A floodlit goalpost at night with an empty concrete terrace behind | Carrow Bowl. The terracing in the background is exactly what the site note is about: it returns every break about four-tenths later |
| `lawn.jpg` | A large mown lawn before a white country house, framed by two trees | Ravensmoor. The firing ground and the audience are both in frame, which is the 88-metre constraint made visible |

All six are treated by a single declaration —
`--photo-filter: saturate(0.82) contrast(1.1) brightness(0.96) sepia(0.06)`
— applied in `src/components/plate.tsx`, the only component in the
template that renders an `<img>`. That is what makes six frames shot in
six places under six different lights a set, and it is a property of the
code rather than a promise about future diligence.

**Graded, not crushed.** CONVENTIONS §6 sets treatment strength by
whether the photograph's own colour is part of what it is being asked to
prove. Here it emphatically is: the difference between a gold burst and
a green one is the evidence the whole colour page argues from, and
greyscale would delete precisely the thing being claimed. So the grade
only pulls the set toward each other — enough to reconcile a warm night
sky with a grey English afternoon, not enough to stop gold reading as
gold. The consequence, which §6 names, is that the sourcing had to do
more work: three otherwise handsome candidates were rejected.

### Three rejections, and what each one cost

- **A harbour at night with a moored vessel.** The ship's name was
  legible on the bow and the town's waterfront was identifiable behind
  it. §6 rejects legible signage and recognisable landmarks; a real
  named vessel is both.
- **A sunset marina.** Boat registration numbers legible in the
  foreground, and a sunset besides — which fights a company called
  Nightwork.
- **An aerial drone shot of a village pitch.** Matched nothing else in
  the set, and had people on it.

### Two of the five sites have no photograph, and that is a decision

§6 says an image you could swap for a different image of the same
subject without anybody noticing is decoration, and decoration is what
makes a template look like a template. North Quay and the Six Bells
recreation ground ended up exactly there: a generic harbour and a
generic football pitch prove nothing the prose has not already said, and
Pexels has no honest frame of either place doing the thing that makes it
interesting.

The three that remain each settle a claim the prose can only assert.
That is the test, and two frames failed it.

**What does not exist at all, and is worth knowing before you try:**
there is no stock photography of professional display setup. Searching
for mortars returns kitchen pestles; searching for a firework crew
returns a man with a sparkler. The world this site is about — racks
staked into peat, cable runs, four hours of setup for eleven minutes —
is not on any stock library, which is a small piece of evidence for the
site's own argument that nobody publishes the part that is actually the
job.

## Type

**Anybody** (Ana Sanfelippo and Fermín Guerrero, Etcétera) and
**Chivo** (Omnibus-Type), both under the SIL Open Font License 1.1,
with **JetBrains Mono** (JetBrains, also OFL) for anything numeric.
All three vendored via `@fontsource-variable`.

Anybody carries a genuine width axis from 50 to 150 and the design
drives it rather than decorating with it: the wordmark runs at 132 and
the field's own labels at 78, so a time stamp fits a column a normal
grotesque would overflow. `scripts/check-colours.mjs` asserts the axis
is varied across at least three distinct values spanning at least 40
units — a variable font nobody varies is a static font with extra bytes.

The face is chosen against the subject. A pyrotechnics company's
default is a script logo and an exclamation mark; this one is a
technical publisher, so the voice is a poster grotesque with slightly
wrong proportions set against a plain workhorse and a mono for the cue
sheets. Numbers are tabular everywhere, because half this site is
columns of times that have to line up.
