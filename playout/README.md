# Playout

The playout console for an invented community radio station on the
Oregon coast. Seven routes, one broadcast day, and every number on it
worked out from the log rather than typed in.

The fleet's first broadcast template, the first Vite application built
to [CONVENTIONS §4c](../CONVENTIONS.md), and the fourth template with a
committed model its pages are checked against. It uses eight of the nine
modern-CSS features that section lists; the ninth is refused on the page
rather than skipped, and the reason is written in `src/index.css`.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Types only, no output |
| `npm run lint` | oxlint |
| `npm run check` | Both checkers below |

```bash
node scripts/check-log.mjs       # the schedule, the rotation, the claims
node scripts/check-colours.mjs   # the palette, under three dichromacies
```

Run the first one with a different machine timezone too — `TZ=Asia/Tokyo
node scripts/check-log.mjs`. It should not matter, because there is no
`Date` anywhere in `src` and the checker asserts that, but a test that
agrees with the bug on your laptop is worth nothing.

## What's in here

| Route | Page |
| --- | --- |
| `/` | On air — the hour you are in, whole, with the row that is playing lit |
| `/day` | Every hour of Thursday, what it lands on, and why |
| `/library` | Seventy-six records in five wheels, and when each one is free again |
| `/library/:id` | One record: its plays today, its wheel, its rest |
| `/shows` | The clocks — each show's hour drawn to scale |
| `/spots` | Underwriting, counted off the log rather than reported |
| `/rules` | What the library can actually hold |
| 404 | Dead air |

## The idea

**A radio hour is a container of a fixed size.** Everything about
scheduling that sounds like taste — what follows what, how often a
record comes round, how long you talk — is arithmetic underneath, and
this station publishes the arithmetic instead of describing it.

Two of the results are ones nobody guesses right, and both are computed
rather than asserted:

- **An hour lands by absorbing whatever is left over**, so the question
  is what it has to absorb it *with*. A hosted hour has a person in it,
  and a person is infinitely adjustable. An automated hour has nothing
  but records, and a record is as long as it is. Measured over one
  Thursday: hosted hours average **7 seconds** off the junction,
  automated hours **2:47**. The hours with the most clutter in them are
  the accurate ones.
- **Local Cuts asks its wheel for fourteen records an hour and the wheel
  holds twelve.** Two come round twice inside the hour, every week, and
  no ordering fixes it. The day keeps every rule the station wrote; one
  show cannot.

## The structure

**A console docked to the bottom edge of every route.** It is not a
header that happens to sit at the bottom — it is the instrument. It
carries the playhead, what is next, and the count to the junction, so
you can be three pages away reading the underwriting report and still
know the current hour is 1:54 long.

Above it the log runs full-bleed against a time gutter. **No page here
has a centred column.**

**Two colours, and they never share a job.** `live` is the on-air
colour, and in a studio that means one thing: you are being heard. So
everything that will be heard *wrong* gets it and nothing else does.
`signal` is for measurement — meters, drift bars, the playhead's track.
Alarm and arithmetic are different jobs.

**Over and under are told apart by side, not by hue.** The drift meter
puts its bar left or right of a centre line. A red/green pair for over
and under is the textbook thing about one man in twelve cannot read.

## The data

The log is **derived**, not typed out. `src/content` holds the library,
the shows' clocks, the underwriting contracts and what is different
about each hour; `src/lib/scheduler.ts` turns those into a broadcast day
the same way a station's own scheduler would — play whichever record in
the wheel has been off the air longest, prefer one whose artist has not
just been on, and let the back-announce absorb the remainder.

Three hundred hand-written elements could not have honoured their own
rotation rules. The first rule broken would have been broken silently,
and the page would have been describing a discipline it did not have.

Nothing states a number it could derive. A record's length comes from
the record, a spot's from the contract, the drift from the log, and the
underwriting report from counting.

There is **no `Date` in the application at all**. Every time is an
integer number of seconds from the head of the broadcast day, so the
same schedule tells the same story in Oregon and in Tokyo. That is
stronger than pinning a timestamp, which still renders through the
reader's timezone.

`scripts/check-log.mjs` asserts 150 things, including several that are
properties of the model rather than of a list of numbers:

- the same library and clocks always produce the same Thursday
- every reported breach really is inside the rule it names
- every breach is in or immediately after the one show that
  over-subscribes its wheel
- twice the records buys a longer achievable rest
- exactly one hour misses its junction, exactly one underwriter is
  short, and exactly one is airing outside its flight

## Everything here is invented

Wren 91.5, Cape Wren, the shows, the presenters, the records, the
artists and the underwriters. It is a template for
[Pare](https://github.com/matthew-curtin/parallax), not a radio station.
The arithmetic is real, though.
