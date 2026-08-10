# Exposure

A brokerage in an invented Michigan town that publishes the light. Six
homes, every room quoted in hours of direct sun on three days of the
year, on seven routes.

The fleet's first property template, and the third built to
[CONVENTIONS §4c](../CONVENTIONS.md). It uses eight of the nine
modern-CSS features that section lists; the ninth is refused on the page
rather than skipped, and the reason is written in `globals.css`.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Types only, no output |
| `npm run lint` | eslint |
| `npm run check` | Both checkers below |

```bash
node scripts/check-sun.mjs       # the astronomy, the content, the captions
node scripts/check-colours.mjs   # the palette, under three dichromacies
```

Run the first one with a different machine timezone too — `TZ=Asia/Tokyo
node scripts/check-sun.mjs` — or it will agree with a bug on your laptop.

Next collects anonymous telemetry by default. `npx next telemetry disable`
turns it off; it is a per-machine setting, so it cannot ride along in a
template.

## What's in here

| Route | Page |
| --- | --- |
| `/` | The argument: aspect is half a question, and the other half is the month |
| `/homes` | All six, sorted by the column they display |
| `/homes/:slug` | One home — a clickable plan pinned beside every room, hour by hour |
| `/compare` | Two of them side by side, room by room, on one ruler |
| `/light` | How the survey works, and what it does not model |
| `/viewings` | Book a viewing at the hour the house has nothing to show you |
| `/about` | What a vendor is agreeing to |
| 404 | Nothing at this address |

## The idea

"Good light" is not a property of a house. It is a property of a house
**and a date**.

Every listing in the world tells you which way a house faces and none of
them tells you when. So this site adds up the compass bearing of each
window, the height of whatever stands in front of it, and the position of
the sun, and prints hours. The two results that make the argument are
both computed rather than asserted:

- A **due-south** room here takes more direct sun on 21 December than on
  21 June, because in June the sun rises and sets behind it.
- A **north** room takes nearly seven hours in June and **none at all**
  in December.

The spread is the other half. In June the best aspect beats the worst by
about an hour and twenty minutes — aspect barely matters. In December it
beats it by the entire day.

## The structure

**A drawing stays and a document moves.** Every page is a split: a pinned
half carrying a plan, a compass and the sun's arc, and a scrolling half
you read. On a home the drawing is also the navigation — click a room in
the plan and its card comes up beside you.

**There is no hero photograph.** Every property site opens with the
exterior shot taken at 8pm in July, which is the least informative
picture it is possible to take of a house. This one opens with a plan and
a number, and every photograph carries the hour it was taken so you can
check the picture against the room.

**Nothing is red.** There is no alarm colour anywhere on the site. A
bedroom with no winter sun is a fact, not a defect, and the position is
that we print hours and you decide.

**There is no bold**, either. Weights are 400 and 500; hierarchy is
carried by size, colour and space, and the display face changes its
optical size at every step of the scale. `check-colours.mjs` fails the
run if a bold weight appears.

## The data

Nothing states a number that can be derived from another one. Floor areas
come out of the plan geometry, a home's size comes out of its rooms, and
every compass bearing comes out of the room's wall plus the plan's
rotation — so turning a house on its plot turns all of its light with it,
and the drawing and the figure beside it cannot disagree.

`scripts/check-sun.mjs` asserts 1,073 things, including several that are
properties of the model rather than of a list of numbers:

- a taller obstruction never buys a room more sun
- east and west are mirror images, to the minute
- no room is ever lit for longer than the day is
- every photograph's stated hour, put through the model, agrees with what
  its caption says is in the frame

The astronomy is standard and slightly rounded — Cooper's declination,
the hour-angle form of solar position, the equation of time, and the
half-degree of refraction the almanac uses at sunrise and sunset. It
agrees with a published almanac for 42.3° north to within about two
minutes.

## Everything here is invented

Exposure, Halstead, the six houses, the prices and the wardens. It is a
template for [Pare](https://github.com/matthew-curtin/parallax), not a
brokerage. The arithmetic is real, though — check it against any almanac
for 42.3° north.
