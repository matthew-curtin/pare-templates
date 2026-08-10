# The Sable Traverse

A guide to an invented 122-mile long-distance trail. Eleven legs
between twelve fixed points, quoted in hours rather than miles, on
eight routes.

The fleet's first outdoor/guide template, and the second built to
[CONVENTIONS §4c](../CONVENTIONS.md). It uses nine of the nine
modern-CSS features that section lists, and every one is doing a job
rather than being demonstrated.

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
node scripts/check-route.mjs      # the arithmetic, the planner, the content
node scripts/check-colours.mjs    # the palette, under three dichromacies
```

Run the first one with a different machine timezone too — `TZ=Asia/Tokyo
node scripts/check-route.mjs` — or it will agree with a bug on your
laptop.

Next collects anonymous telemetry by default. `npx next telemetry disable`
turns it off; it is a per-machine setting, so it cannot ride along in a
template.

## What's in here

| Route | Page |
| --- | --- |
| `/` | The argument: why miles are the wrong number, and the day nobody can avoid |
| `/stages` | All eleven legs, in route order, as cards and as a table |
| `/stages/:slug` | One leg — its profile, its ground, its water, its way off |
| `/plan` | Split the route into six to eleven days and see what each costs |
| `/shelters` | The twelve fixed points, and what water each one has |
| `/conditions` | The season, live reports, and the pace model worked through |
| `/getting-there` | Trailheads, the shuttle, and where you cannot get off |
| 404 | Off the route |

## The idea

A long walk is not a distance. It is a short list of places you are
allowed to sleep, and the ground between them.

So the site adds terrain and climb together and quotes an arrival time.
A mile of graded trail takes twenty-three minutes; a mile of peat takes
fifty-five; a mile of boulder takes fifty whichever way it tilts. The
longest leg on the route and the longest *day* on the route are not the
same leg, which is the whole argument in one comparison — and the
planner exists to show that no itinerary of any length has a day shorter
than eleven hours, because the leg that takes eleven hours cannot be
broken in the middle.

## The structure

Everything about the design follows from that.

**The terrain rail** is the spine: the whole route as one elevation
profile turned on its side, running down the full height of every page,
coloured by what the ground is made of. On a page that reads in route
order it carries a marker that descends as you scroll; on a single leg's
page it lights that section and dims the rest. It is the site's position
indicator and its architecture at once, and it is why this template
claims *"vertical terrain rail — the route drawn full-height beside the
content"* in the fleet's architecture register.

**There is no map**, deliberately. Every trail site opens with one, and
a map is the single thing that cannot answer whether tomorrow is
possible.

**The figures are the display type.** Headings stay small; the hours get
the size. On a site whose argument is "look at the hours, not the
miles", setting the word *Stages* at 9rem and the hours at 14px would be
arguing the opposite.

## The data

Nothing states a number that can be derived from another one. Ascent and
descent come out of each leg's elevation samples, hours come out of the
terrain and the climb, totals come out of the legs — so the shape drawn
in the rail and the figure printed beside it are the same fact read
twice.

`scripts/check-route.mjs` asserts the parts that can be asserted, 194 of
them, including two properties of the planner that are easy to lose
silently:

- asking for one more day can never make the longest day longer
- no plan, at any length, has a day shorter than the longest single leg

## Everything here is invented

The Sable Range, the traverse, the huts, the wardens, the shuttle
timetable and every number on this site. It is a template for
[Pare](https://github.com/matthew-curtin/parallax), not a trail guide.
Do not pack for it.
