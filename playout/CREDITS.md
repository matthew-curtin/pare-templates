# Credits

## Photography

Four photographs, all from [Pexels](https://www.pexels.com/license/) —
free to use and modify, no attribution required, credited here anyway.

| File | Where it is | What is in the frame |
| --- | --- | --- |
| `desk.jpg` | On air | Two channel strips of a broadcast desk. CUE and ON buttons on each; one ON is lit blue and the one beside it is not, with the faders below |
| `night-studio.jpg` | The day, beside the automated hours | A studio table at night — four microphones on stands, headphones and cable coiled on it, chairs pushed in, blue light through two windows. Nobody there |
| `stylus.jpg` | The library | A stylus down in the groove of a spinning record, tonearm and the edge of the platter, in close-up |
| `mast.jpg` | Rules | A guyed lattice mast on a grassy hillside, antennas at the head, stay wires running out of frame |

### The direction

**Working equipment under whatever light was already on. Nobody in
frame, nothing staged, and every picture answers a question the page
next to it has just asked.**

The last clause did most of the rejecting. A handsome photograph of a
microphone is not a photograph of anything this console claims, and
several otherwise strong frames went back for exactly that reason.

Faces stay out under the usual rule: the hosts here are invented, so a
real person's face under an invented name is a small lie on the page and
initials are the honest answer. It is a rule about *people* and it stops
there — the desk, the empty studio, the turntable and the mast are all
fair game, and they are what a station actually is.

### What each one is for

- **`desk.jpg`** says what a row of the log IS. One channel is ON and the
  next is cued and waiting, which is this entire console rendered in
  hardware, and the picture is the only place that connection gets made.
  It is also the reason this frame beat two better-lit music-studio
  desks: those had twenty-four identical channels and no state. This one
  has a lit button.
- **`night-studio.jpg`** settles what "automated" means, which the word
  does not. Between ten at night and two in the morning there is nobody
  in that room — and the four hours the station is least accurate are
  exactly the four hours this photograph is true of. Putting it beside
  the band comparison is the argument in one frame.
- **`stylus.jpg`** makes the argument physical. A record is as long as it
  is; you cannot ask a wheel for three and a half minutes of one. That is
  the whole reason an hour of records lands worse than an hour with a
  person in it, and it is easier to see than to read.
- **`mast.jpg`** explains why a junction cannot be moved. The hour ends
  when it ends because something at the top of that hands over.

### The fifth photograph, and why there isn't one

The library page was meant to carry a **record shelf** — "twelve Cape
Wren records" is an abstraction until you have seen a shelf, and the
rules page's argument is about a countable number of objects.

Every honest candidate was unusable, and the reason generalises: **a
photograph of a record library is a photograph of other people's
trademarks.** Three strong frames were rejected for a legible Frank
Sinatra spine, a stack reading Fleetwood Mac and Led Zeppelin, and a
hand-lettered divider card saying Queen. §6 already forbids a legible
company sign in shot — that rule was written for a `PLECIDER MILL`
banner behind a restaurant terrace — and album art is the same problem
at ten times the density, on a subject where it is essentially
unavoidable.

So the argument is carried by `stylus.jpg` instead, which makes the
neighbouring point (a record has a fixed length) with nothing legible in
it. That is the §6 corollary about changing the copy when no photograph
matches, arriving from the other direction: change which claim the
picture is asked to prove.

### How they are made consistent

**One CSS treatment, not sourcing luck.** These four were taken in four
different rooms under four different lights — one blue-lit at night, one
under fluorescent, two under daylight. No amount of searching turns a
stock library into a coherent set, because the library is not a shoot.

`--photo-filter` in `src/index.css` does it in one line:

```css
grayscale(1) sepia(1) hue-rotate(158deg) saturate(1.45) contrast(1.12)
  brightness(0.82)
```

This is the **crushed** end of §6's dial, and deliberately so. The
question that sets the strength is whether the colour in the frame is
part of what it is being asked to prove. Here it is not: the subject is
working equipment, and the hue in the sources is whatever tube happened
to be overhead. So it comes out entirely, and a cool cast goes back in,
which puts all four on the same side of neutral as the console. Compare
`exposure`, whose subject IS daylight and which therefore grades rather
than crushes.

Every photograph goes through `src/components/plate.tsx`, and nothing
else in the app renders an `<img>` — `scripts/check-imagery.mjs` at the
repo root fails the template if a second file does. That check learned
about Vite in this template: it used to look only for `next/image`
imports, which meant a Vite template with photographs satisfied the
one-renderer rule by having no renderers at all.

### Weight

Four files, 380KB, comfortably inside the ~1MB budget in CONVENTIONS §6.
Fetched at roughly twice their display size and left at the compression
they arrived with, because re-encoding an already-compressed stock JPEG
usually makes it bigger.

## Type

**Archivo Variable** for everything set in prose, and **Martian Mono
Variable** for times, durations and the console clock. Both are used for
their **width** axis rather than their weight, which is the point: a
console is a fitting problem. Archivo is opened slightly (`wdth` 104) so
the log stays legible at 13px without going up a size, and Martian Mono
is pulled in (`wdth` 87–90) so a six-figure timecode fits a phone-width
console at a size you can read across a room.

Both are self-hosted through `@fontsource-variable`, so the template
works offline and makes no third-party request. Both are OFL.

`scripts/check-colours.mjs` fails the run if the width axis stops being
set — a variable font nobody varies is a static font with extra bytes.

## Everything else

Wren 91.5, Cape Wren, the shows, the presenters, the records, the
artists and the underwriters are all invented. The scheduling arithmetic
is not: an hour is 3,600 seconds, a wheel of twelve records asked for
fourteen an hour hands two of them back twice, and both of those are the
same arithmetic a real station lands an hour with.
