# Kiln

A members' ceramics studio, and a board that says when your pot comes
out and — more usefully — why it does not come out sooner. Eight routes,
one fortnight, and every number on it worked out from the shelf rather
than typed in.

The fleet's first craft template, and the fifth with a committed model
its pages are checked against. It uses eight of the nine modern-CSS
features [CONVENTIONS §4c](../CONVENTIONS.md) lists; the ninth is
refused on the page rather than skipped, and the reason is written in
`src/app/globals.css`.

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
| `npm run lint` | ESLint |
| `npm run check` | Both checkers below |

```bash
node scripts/check-load.mjs      # the packer, the rota, the claims
node scripts/check-colours.mjs   # the palette, under three dichromacies
```

Run the first one with a different machine timezone too — `TZ=Asia/Tokyo
node scripts/check-load.mjs`. It should not matter, because there is no
`Date` anywhere in `src` and the checker asserts that, but a test that
agrees with the bug on your laptop is worth nothing.

Next collects anonymous telemetry by default. `npx next telemetry
disable` turns it off, but it is a per-machine setting so it cannot ride
along in a template.

## What's in here

| Route | Page |
| --- | --- |
| `/` | The kilns — what is being packed now, and what will not light |
| `/queue` | The shelf — everything waiting, grouped by what it is waiting for |
| `/firings` | The rota, and the last six firings with their logs |
| `/firings/[id]` | One firing: elevation, every shelf from above, who pays what |
| `/pieces/[id]` | One pot: its route, its date, and what is actually holding it up |
| `/glazes` | Nine glazes, priced in days |
| `/studio` | The building, the three kilns, and the loading order |
| `/join` | Membership, and why there is no price list for firing |
| 404 | Nothing on this shelf |

## The idea

**A kiln is not a queue. It is a container that has to be full before
anybody will light it.** A firing costs the same holding four pots as
holding thirty, so every kiln here has a load below which nobody will
run it — and that single rule turns waiting into something other than a
line. What your work is waiting for is not the people in front of it. It
is other people's work of the same kind.

Three of the results are computed rather than asserted, and the site
states none of them without showing the arithmetic:

- **The glaze you choose makes no difference. The programme does.** Put
  the same bisqued mug into today's studio once per glaze and run the
  whole fortnight again: all six electric glazes come back in **6 days**
  and all three reduction glazes in **18**. Inside each group the
  difference is exactly zero days.
- **A firing that already had room for your pot can still fail to
  happen.** The gas kiln's Sunday is 7% spoken for against a threshold
  of 20%, so it will not light, so four glazed pieces wait a fortnight
  for a kiln that was standing empty.
- **Two pieces have no date at all**, and nothing is wrong with either
  of them. They were bumped from the one firing that did run, and the
  next one of its kind is a fortnight after that.

## The structure

**Every page is a container drawn to scale with its leftover space left
visible.** Kilns are elevations with the headroom hatched, shelves are
plan views where the gaps between pots are drawn as gaps, pieces carry
their footprint against the smallest kiln in the studio, and a glaze is
as wide as the wait it costs you.

Nothing here is a uniform card grid and no page has a centred column,
because the whole argument is about slack and a layout that closes up
its own slack cannot make it.

**Two colours, and they never share a job.** `fire` means a kiln is lit
or about to be. `cold` means nothing is happening — a firing short of
its threshold, a pot with no date, the part of a gauge that is air.
Nothing else on the site is coloured at all, including the eight reasons
a piece might be waiting: those are words, because a hue on every row is
a treatment on every row.

## The data

The board is **derived**, not typed out. `src/content` holds the pieces,
the glazes, the kilns and their fortnightly rota; `src/lib/pack.ts`
loads a kiln the way a person does, and `src/lib/schedule.ts` walks the
rota forward deciding which firings light.

Fifty-one pots hand-assigned to firings could not have honoured their
own thresholds. The first firing that should not have run would have run
silently, and the page would be describing a discipline it did not have.

Nothing states a number it could derive. A firing's cost comes from its
kiln's energy figure and the tariff; a piece's share of that cost comes
from the space it took; a wait comes from walking the rota.

There is **no `Date` in the application at all**. Every time is an
integer day index counted from the Monday the rota starts, so the same
fortnight tells the same story in Hollowmere and in Tokyo. That is
stronger than pinning a timestamp, which still renders through the
reader's timezone.

`scripts/check-load.mjs` asserts 540 things, including several that are
properties of the model rather than of a list of numbers:

- no two pots on a shelf ever overlap, and no stack exceeds its chamber
- a firing lights if and only if it is over its threshold
- nothing wet is ever fired before it is dry
- the shares of a firing add up to the firing, and the biggest pot pays
  the most
- all eight reasons a piece can be waiting are reached by the data
- the prose agrees with the model: the kiln note claims a celadon takes
  three times as long as a white glaze, and the checker measures it

## Everything here is invented

Marlpit, Hollowmere, the members, the pots and the glaze recipes. It is
a template for [Pare](https://github.com/matthew-curtin/parallax), not a
ceramics studio. The arithmetic is real, though.
