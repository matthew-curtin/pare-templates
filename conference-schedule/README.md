# Overlap

A three-day conference on maintenance — of software, of bridges, of
buildings, of institutions, of each other. Forty-seven sessions across
four rooms and thirty invented speakers, on eight routes.

The fleet's first events template, and the first one built to
[CONVENTIONS §4c](../CONVENTIONS.md) — the craft directive. It uses nine
of the nine modern-CSS features that section lists, and every one of
them is doing a job rather than being demonstrated.

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
node scripts/check-schedule.mjs   # the arithmetic, the collisions, the data
node scripts/check-colours.mjs    # the palette, under three dichromacies
```

Run the first one with a different machine timezone too — `TZ=Asia/Tokyo
node scripts/check-schedule.mjs` — or it will agree with a bug on your
laptop.

Next collects anonymous telemetry by default. `npx next telemetry disable`
turns it off; it is a per-machine setting, so it cannot ride along in a
template.

## What's in here

| Route | Page |
| --- | --- |
| `/` | The front — the argument, what is on right now, the three days |
| `/schedule` | The wallchart: three days, four rooms, drawn to scale |
| `/sessions/:slug` | One session, and what going to it costs you |
| `/speakers` | Thirty people |
| `/speakers/:slug` | One person and everything they are doing |
| `/plan` | Your plan, with the collisions called out |
| `/venue` | The building, the rooms, access, getting there |
| `/tickets` | Four tiers, questions, and a booking form that books nothing |

## How it's organised

```
src/
  app/          One folder per route
  components/   Header, footer, the grid, the two client controls
  content/      Everything the site says, as typed data
  lib/          time, schedule — pure; params, plan-store — the glue
scripts/        The two checks
```

## The parts worth understanding

**The schedule is drawn to scale, and that is the whole point.** A
block's top is (start − day opens) and its height is (end − start), both
in minutes. Nothing rounds to a row. So the ninety-minute workshop that
starts at 1:40 on Thursday visibly runs across the three talks that
begin at 2:35 — a collision that no list-shaped schedule can show,
because in a list those four sit in different rows and look like
different choices. Every conference website prints a list.

**Every session says what it costs you.** The session page ends with the
sessions that run against it, marked "overlaps in part" when they only
partly do. It is the honest answer to "should I go to this", and it is
computed from the same overlap test the plan page and the checker use —
two sessions collide if they share a minute.

**The clock is pinned into the middle of the conference.** 11:20 on the
Thursday, so the now-marker sits mid-grid where you can see it working
and four sessions are genuinely live. A live state in a real conference
site exists for forty minutes at a time and would otherwise never be
seen by anyone, including whoever built it. The timezone is pinned for
the same reason: rendered in the reader's zone, a 9:00 opening reads
14:00 in London and the story of a working day stops being one.

**Some things cannot be compared, and the grid says so.** A cancelled
session stays on the wallchart struck through rather than vanishing —
people have it in their plans, and a session that silently disappears is
indistinguishable from one you misremembered.

**The plan is honest about double-booking rather than preventing it.**
Adding two things at once is allowed and then said out loud, on the row
and on the day heading. Deciding which one to drop is the point;
refusing the second would just hide the choice.

**Filters are links.** Every narrowing is a URL, so the back button
steps through them, a refresh keeps them, and a filtered day can be
pasted into an email. The day tabs are links too — they only become a
View Transition when JavaScript is there to intercept them.

## The modern CSS, and what each piece is for

Not a demonstration. Each of these is the shortest correct way to do
something the template needs.

- **`clamp()`** — the signage headline is a curve, not four breakpoints.
- **`text-wrap: balance` / `pretty`** — session titles are up to eleven
  words and wrap badly; `balance` on headings, `pretty` on prose.
- **Container queries** — a block's height decides whether there is room
  for a speaker's name, and its WIDTH decides whether the name would
  survive being shown. Filter to two rooms and every block doubles in
  width at the same viewport size, which is exactly the question a media
  query cannot answer.
- **`:has()`** — a plan day marks its own heading when it contains a
  clash, and a room column with nothing left after filtering says so.
  Both are facts about a subtree.
- **OKLCH + `color-mix()`** — the four room tints are derived from the
  four room hues, so re-hueing a room is one edit.
- **A variable-font axis** — one typeface at four widths instead of two
  typefaces. Archivo's `wdth` axis carries the hierarchy.
- **View Transitions** — switching day morphs the wallchart in place.
- **A scroll-driven animation** — the hour rail fills as you move down
  the page, with no scroll listener and nothing on the main thread.
- **`@property`** — registers the now-marker's pulse so it interpolates
  instead of jumping between keyframes.

Everything above degrades to nothing in a browser that lacks it, and all
of it is off under `prefers-reduced-motion`.

## Notes

- **The data is tuned, not sprinkled.** One session is cancelled, one
  workshop is full and one has places, four things are live at the
  pinned now, one room stands empty while the others run, one title is
  long enough to test wrapping at every column width, and the last day
  is deliberately shorter than the other two. `check-schedule.mjs`
  asserts every one of those, plus the things that are easy to break by
  hand and invisible on the page: nothing outside its day's opening
  hours, no room booked twice, no speaker in two places at once.
- **The palette is validated rather than chosen.** Which hue lands on
  which room was decided by the checker: red and ochre collapse together
  under protanopia, so they take the two ends of the lightness ladder
  and the two hues that survive dichromacy sit between them. See the
  note at the top of `src/app/globals.css`.
- **Your plan starts with something in it.** Six sessions across three
  days, one pair of which collides — because an empty plan page is the
  honest first-run state and also a blank rectangle. "Clear the plan"
  gets you to genuinely empty.
- **Nothing persists off this machine and nothing is sent.** The plan is
  localStorage. The booking form ends in a panel explaining that it
  booked nothing.
- **There are no photographs**, and that is a decision — see
  `CREDITS.md`.

Overlap, the Ironhouse, the four rooms, the forty-seven sessions and the
thirty people speaking at them are all invented. No address resolves and
nothing here talks to a server.
