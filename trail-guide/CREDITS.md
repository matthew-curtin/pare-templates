# Credits

## Photography

Five photographs, all from [Pexels](https://www.pexels.com/license/) —
free to use and modify, no attribution required, credited here anyway.

| File | Where it is | What is in the frame |
| --- | --- | --- |
| `cloud-on-the-range.jpg` | Front page, under the masthead | A high corrie in thick cloud — pale grass, scattered boulders, a rock buttress vanishing into mist, no horizon |
| `peat-and-sedge.jpg` | The Ninebark flats | Black peat and hundreds of separate sedge hummocks with standing water between them, under heavy cloud |
| `talus.jpg` | The Rime steps | A boulder field filling the frame edge to edge: angular blocks, no path, no soil, no sky |
| `bothy.jpg` | Shelters | A small stone shelter with two heavy doors, alone on a grass slope under a bank of black cloud |
| `upland-creek.jpg` | Conditions | A shallow creek running fast over dark flat rock between banks of tussock grass, low hills behind |

### The direction

**Weather, not views: the ground underfoot, low cloud, nobody in frame,
and no summit panorama.**

That sentence is enough to accept or reject a candidate in about two
seconds, which is the whole job of it — and on this template it is also
the argument. The site's claim is that a view will not tell you whether
tomorrow is possible, so a set of sunlit summit photographs would be
contradicting the copy underneath them.

Every one of the five does a job you can name in a sentence:

- **The hero** is the site's opening claim, not an illustration of it.
  The range is somewhere in the top half of the frame and you cannot see
  it. That is what an ordinary August morning looks like here.
- **The peat** settles why 14.6 downhill miles take eleven hours. The
  paragraph asserts it; the hummocks and the standing water explain it.
- **The talus** does the same for the Rime steps — six miles of ground
  with no line through it.
- **The bothy** makes "fixed point" concrete. Eight bunks and a barred
  door, and nothing else for nine hours, which is why the route breaks
  where it breaks.
- **The creek** is what the whole conditions page is actually about. A
  "reliable source" is an abstraction until you have seen one.

The other nine legs carry no photograph, deliberately. Nine pictures of
upland would be the decoration §6 warns about: an image you could swap
for another of the same subject without anybody noticing.

### How they are made consistent

**One CSS treatment, not sourcing luck.** These five were taken in five
different ranges in five different kinds of weather. No amount of
searching turns a stock library into a coherent set, because the library
is not a shoot.

`--photo-filter` in `globals.css` does it in one line:

```css
grayscale(1) sepia(0.55) hue-rotate(163deg) saturate(1.45) contrast(1.06)
  brightness(0.82)
```

Cold duotone rather than plain greyscale. `sepia()` is the only cheap
way to tint a monochrome image in CSS and it only goes warm, so the
trick is to sepia it and then rotate the hue the long way round to the
blue the template is built on. Darkened, because a bright photograph on
a canvas this dark is a hole punched in the page — the opposite
adjustment to the one `conference-schedule` needed on bone.

The treatment lives in CSS rather than being baked into the files, so
the originals on disk stay original, a replacement image inherits it
automatically, and it is a declaration you can click and change in Pare
— the same argument §5 makes for drawing interfaces instead of shipping
screenshots. Every photograph renders through `components/plate.tsx`,
and the repo-level checker fails if a second component starts importing
`next/image`.

### What was checked in the frame

- **The bothy's door carries a small oval plaque.** It was cropped and
  enlarged at full source resolution before use: the text on it is not
  legible at any size the file can produce, and under the treatment it
  reads as a pale oval. Recorded rather than ignored, because a legible
  one would have been a real name on an invented hut.
- **No boardwalks.** Most stock bog photography is shot from a
  boardwalk, and a boardwalk in the frame would contradict the sentence
  underneath it — the flats are slow precisely because there is nothing
  to walk on.
- **Nothing recognisable.** No named landmark, no signage, no vehicles.

### What was rejected, and why

- A **stone path climbing to a summit under blue sky** — a good
  photograph and the exact thing the direction rules out. It is a view.
- A **bog under a bright blue sky with a wooded hill on the horizon** —
  pretty, and it makes the flats look like a pleasant afternoon.
- A **gravel close-up** for the talus, which turned out to be
  indistinguishable from a car park.
- A **torrent under a cloud-capped crag** for the water page. Dramatic,
  and wrong: this site's interest in water is whether you can drink it,
  not whether it is spectacular.

### Weight

1.04MB across five files, at the ~1MB budget §6 sets. The talus is the
heaviest at 244KB despite being the smallest in pixels — a frame that is
entirely high-frequency detail compresses badly, and fetching it smaller
was the fix rather than re-encoding it, per §6.

## Portraits

None. There are no people in this template at all — no wardens with
names and faces, no testimonials. The one place a person is described,
the warden at Fallowdyke who will drive you out in the morning, is a
sentence rather than a headshot.

## Icons

The mark — a ridge line with one point above the rest, over a horizon —
is inline SVG in `src/components/wordmark.tsx`, and again in
`src/app/icon.svg` for the favicon. Change one and change the other.
There is no icon library and no icon font.

## Type

**Recursive**, one family for everything, self-hosted by `next/font` at
build time so there is no request to a font CDN at runtime and no flash
of fallback text.

The template uses its `MONO` axis rather than a second typeface: prose
is set proportional at `MONO 0`, and every figure on the site — hours,
feet, miles — is set at `MONO 1`, which is the same face walking on
monospaced feet. That is a better answer than `tabular-nums` here
because the numbers are not only being aligned in columns, they are the
thing being read. `CASL` is pinned at 0 everywhere; the casual end of
that axis softens the letterforms toward handwriting, which is charming
and wrong for a document about whether you will make it before dark.

Asking for the axes explicitly matters. Without `axes: ["MONO", "CASL"]`
in the `next/font` call you get the variable weight only, and every
`font-variation-settings` in the stylesheet silently does nothing — the
page looks fine and the whole typographic idea is absent.

## Colour

Original to this template, and **validated rather than chosen**.
`node scripts/check-colours.mjs` reads the tokens back out of
`src/app/globals.css` — resolving the OKLCH and the `color-mix()`
derivations itself — simulates protanopia, deuteranopia and tritanopia,
and measures every pair that can appear together plus every piece of
text against every surface it can land on. Forty-eight checks, and it
prints its own tightest margins rather than carrying a "last run"
comment that goes stale.

The load-bearing claim it defends is that the four terrain colours are
separated in **lightness** in a fixed order — lighter is faster — since
the rail, the terrain bar and the legend all rely on that reading, and
four hues at one lightness collapse to two under deuteranopia.

Three values moved because of the checker rather than because of taste:

- The **rough-path olive** was at hue 104 and measured ΔE 9.78 from the
  warning amber, which sits at nearly the same lightness and can appear
  in the same leg card. Moving it to 122 costs nothing and clears the
  bar.
- The **rail well** was ΔE 2.13 from the canvas — under the
  just-noticeable difference, so the rail's own border was doing all the
  work of separating them. Darkening it to 0.108 got 2.99, which is a
  pass one rounding would turn into a failure; it ships at 0.094.

## Everything else

No third-party assets of any kind. Nothing is fetched at runtime, so the
template works offline.
