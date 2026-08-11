# tally

A public status page for **Coldharbour**, an invented cloud company that
runs its own hardware in five regions.

```bash
npm install
npm run dev
```

Everything on it is fiction. See [CREDITS.md](CREDITS.md).

---

## The one idea

An uptime percentage is a **score**, and a score only tells you what already
happened. The number underneath it is a **budget**: a target of 99.95% is
not a boast, it is a permission slip for 66.2 minutes of failure a quarter,
and the useful question on any given morning is how much is left.

So this page leads on the service spending its budget too fast rather than
on a row of green ticks — a number that can be bad, above the fold, while
nothing is actually down.

Two consequences fall out of that, and both are deliberate.

**Operational days are not green.** The only coloured marks anywhere on the
site are the bad ones, so a glance at a strip counts problems instead of
parsing a wall of colour. It is also honest: a status page where the good
days shout is backwards.

**There is no overall Coldharbour uptime figure**, and there is not going
to be one. Six services against three different targets average to
something arithmetically true that says nothing about whether the one you
depend on was working.

## The architecture

**Uptime strip** — stacked full-width service rows, each an identity /
ninety-day tally / budget triptych, and that same triptych repeated as the
unit every other page is built from. No centred column, no sticky bar; the
masthead scrolls away like a newspaper's.

## What is computed rather than typed

`src/lib/availability.ts` is the whole model, and nothing on any page
states a figure it did not produce.

- **Impact is a fraction, not a flag.** An incident costs `duration ×
  share of requests affected`. That single decision is why the two
  incidents the front page compares can be compared at all: 4h 51m at 4%
  costs **11.6** budget minutes, and 22m at 100% costs **22.0**. The one
  that looks far worse on a timeline cost half as much.
- **Error budget, burn rate and projection.** `allowance = window ×
  (1 − target)`; burn is spent ÷ earned. Hovering a row runs its budget bar
  out to where the current rate lands at quarter end.
- **Credit bands derived from each service's own target**, rather than three
  fixed percentages. Absolute bands have a hole in them: a service sold on
  99.99% and credited from 99.95% can miss by a factor of five and owe
  nothing.
- **Announced maintenance spends nothing**, and is still listed — a record
  that drops its maintenance windows makes the surrounding months look
  better than they were.
- **A window is stated with every verdict.** Managed Postgres meets its
  target over ninety days (99.962%) and misses it over the quarter
  (99.921%) on exactly the same incidents. Credits settle on a third
  window, the calendar month.

The clock is pinned to **11 August 2026, 09:42 UTC** and there is no `Date`
anywhere in `src` — the calendar arithmetic is written out longhand, which
is what makes the page render identically in Tokyo and in California. The
checker asserts the absence and then runs itself again under three
timezones.

## Checkers

```bash
npm run check      # both of the below
```

`scripts/check-availability.mjs` — 98 assertions. Integrity, the arithmetic
worked independently of the module, the §7b tuned states, **every figure
quoted in the prose asserted against the model**, no `Date`, and the whole
suite repeated under three timezones.

`scripts/check-colours.mjs` — 53 assertions, read back out of
`globals.css`. The load-bearing one: the three outage severities are an
**ordinal** scale whose ordering lives in lightness rather than hue, so it
survives colour-vision deficiency. Every severity is pushed through the
Machado dichromacy matrices and the ladder has to still be a ladder
afterwards.

### What they caught

Both were then falsified on purpose — §4b, since a check that has only ever
passed is a check nobody has tested — and eight of eight fired for the
right reason once the cases were designed properly. Two of the first
attempts were bad cases rather than checker holes: one added a duplicate
`endMin` key that JavaScript quietly overwrote, and one pushed a colour out
of gamut so an earlier assertion fired first and the run exited before
reaching the ladder.

Real defects they found while being written:

- **"Across sixteen unplanned incidents we averaged 3.8 minutes to
  notice and 98.6 to fix"** was false. There are sixteen unplanned
  incidents but one of them is still open, so the averages are over the
  **fifteen closed** ones — you cannot have a repair time for something
  still running. The sentence now says fifteen and explains why.
- **Two palette values were guesses and both were wrong.** `--color-ok` sat
  at 2.81:1 and `--color-line` at 1.56:1 against the ground; both were
  solved numerically for the 3:1 floor instead of nudged by eye.
- **Driving the interaction found a bug a screenshot could not.** Pointing
  at an incident dims every day except the ones it cost — and it was
  dimming the six legend swatches too, because the legend is built from the
  same marks so that it cannot drift from them. Measuring said 96 marks
  responded where 90 should have.
- **99.99% buys 13.2 minutes a quarter, not six.** A comment said six; six
  was the allowance *elapsed so far*. Running the model before writing the
  words is what caught it.

## Routes

| Route | What it is |
| --- | --- |
| `/` | The board. Open incidents, the burn rate, six strips, the budget, the money. |
| `/incidents` | The whole archive, with CSS-only filters and the detection statistics. |
| `/incidents/[slug]` | The post-mortem: timeline, what it cost each service, what changes because of it. |
| `/services/[slug]` | One service — a large strip, the same incidents over three windows, and what "unavailable" means for it. |
| `/sla` | Targets, the derived credit schedule, every credit the last six months produced, how it is measured. |
| `/infrastructure` | Five sites, the redundancy claims, and the photographs that settle them. |
| `/subscribe` | Notification preferences. Validates its own errors, so it opts out of the browser's. |

## Notes

Next collects anonymous telemetry by default and a `.env` cannot switch it
off in time. `npx next telemetry disable` works but is a per-machine
setting, so it cannot ride along in a template.
