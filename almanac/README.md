# Almanac

A jobs board for the public sector and nonprofits — county government,
health systems, school districts, housing authorities, museums and
charities. Twenty-two invented jobs across twelve invented
organizations, on seven routes.

The fleet's first listings board, and the first template where the
interesting logic is arithmetic rather than layout: what a job pays, and
whether that can be compared to what another one pays.

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

Two extra checks, both plain node, both worth running after editing the
content or the palette:

```bash
node scripts/check-listings.mjs   # the arithmetic, the orderings, the data
node scripts/check-colours.mjs    # the palette, under three dichromacies
```

Next collects anonymous telemetry by default. `npx next telemetry disable`
turns it off; it is a per-machine setting, so it cannot ride along in a
template.

## What's in here

| Route | Page |
| --- | --- |
| `/` | The board — filters, search, sorting, closed postings |
| `/jobs/:slug` | One job: the summary block, the posting, the employer |
| `/employers` | Everyone advertising |
| `/employers/:slug` | One organization and its jobs, open and closed |
| `/alerts` | Build an alert and see what it would have caught |
| `/post` | Prices, the rules, and a composer with a live preview |
| `/about` | Who runs it, the listing policy, questions |

## How it's organised

```
src/
  app/          One folder per route
  components/   The header, the card, the filters, the two forms
  content/      Everything the site says, as typed data
  lib/          pay, dates, filters — pure; board — the glue
scripts/        The two checks
```

## The parts worth understanding

**The number in the posting is not what the job pays.** Public sector
postings quote the full-time range with "prorated" after it, which has
been quietly misleading people for decades: a 24-hour position posted at
"$52,000 – $57,000 prorated" pays $31,200 to $34,200. So `lib/pay.ts`
works out the real figure, the board shows *that* as the headline, and
the posted range drops to a footnote attributed to the employer. Filters
and sorts use the real figure too — a board that filters on the posted
range tells someone with a $40,000 floor about a job paying $31,200.

**Some jobs cannot be compared, and the board says so.** A volunteer
position, an on-call position with no guaranteed hours, and a posting
with no salary on it have no annual figure. `annualise` returns null for
all three rather than inventing one; they sink to the bottom of the pay
sort and never clear a salary floor. Inventing a number — assuming an
on-call worker does twenty hours, say — would make them sortable and
wrong.

**A filter asks the top of the range, a sort asks the bottom.** "Pays at
least $85,000" means *could this pay me that*, so it compares the top of
the range. "Highest paid" means *what would I start on*, so it uses the
bottom. Same data, two questions, and getting them the same way round
hides every job whose range starts below your floor and ends well
above.

**A closing date is a calendar day, not a countdown.** At 09:20 on a
Wednesday, the end of Thursday is 38 hours away — under two days by the
clock, which an elapsed-time test rounds to one and then calls "closes
today". `lib/dates.ts` compares day keys in a fixed timezone, so it
cannot make that mistake.

**Only two things are coloured, and the buttons are not one of them.**
A job closing today or in the next week is red; a closed one is grey.
Everything else a posting can be — term, part time, job share, hybrid,
volunteer — is a fact rather than a state, and colouring facts is how a
board ends up with nine hues and no hierarchy. The primary action colour
is near-black for the same reason: a blue button next to a red deadline
is a colour spent on nothing. The palette is validated rather than
chosen; see `scripts/check-colours.mjs` and the note at the top of
`src/app/globals.css`.

**Almost nothing is drawn.** Cards are white on a warm grey ground with
a soft shadow, so a list of twenty has twenty fewer edges than a
bordered version and reads as calmer at the same density. There is one
hairline in the header and one under the price lists. The one place a
border comes back is a closed posting, which should not have the same
presence as a live one.

**Filters are links, not a widget.** Every narrowing is a URL, so the
back button steps through them, a refresh keeps them, a filtered board
can be pasted into an email — and the whole thing works with scripting
turned off, which is not a niche concern for an audience that includes
people applying from a library computer.

## Notes

- **Times and dates are the workspace's, not yours.** The board is a
  fixed story — one job closes today, one tomorrow, three have closed —
  read against a pinned `now` in `src/content/site.ts`. Without it, a
  template opened six months later is a board where everything closed in
  the spring. The timezone is pinned for the same reason: a deadline of
  "Friday" is already Saturday in Auckland. Building a real product on
  this? Delete both and it follows whoever is reading.
- **Featured postings do not jump the queue.** They get their own strip
  above the board, labelled as promotions, and they appear again in
  their proper place below. The first version lifted them into the list
  instead, which put a job closing in October above one closing that
  afternoon under a control that said "Closing soonest" — a list that
  does not obey its own sort is broken however well the promotion pays.
- **Closed postings keep their pages.** People share these links. A
  page that 404s two weeks later tells you nothing about what happened;
  one that says "this closed on Friday" tells you everything.
- **The data is tuned, not sprinkled.** Exactly one job closes today,
  one tomorrow, three have closed, two have no salary, one is unpaid,
  one is on call, one is a job share, one employer has nothing open, and
  one title is long enough to test wrapping. Every one of those is a
  state the design has to draw, and `check-listings.mjs` asserts all of
  them so an edit cannot quietly leave nine jobs closing today, or
  none.
- **Nothing persists and nothing is sent.** The alert form and the
  listing composer both end in a panel explaining that this is a
  template. Reloading puts everything back.

Almanac, the twelve organizations, the twenty-two jobs, the salaries,
the job numbers and the two people who run it are all invented. No
address resolves and nothing here talks to a server.
