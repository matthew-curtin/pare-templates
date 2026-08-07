# Template conventions

Rules every template in this repo follows. They exist so twenty
templates feel like one family, and so each one works properly inside
Pare. Read this before adding a template.

---

## 1. Pick the stack the job actually calls for

| Kind of site | Stack | Why |
| --- | --- | --- |
| Marketing, blog, docs, storefront, listings, booking | **Next.js** (App Router) | Public pages need to load fast and be readable by search engines, so they're pre-rendered |
| Dashboards, kanban, chat, feeds, anything behind a login | **Vite + React** | Nothing to pre-render; the simpler build is the right tool |

Both are React + TypeScript + Tailwind 4. Don't introduce a third
framework without a specific reason — Pare's element-to-source mapping
is built on React, and a non-React template would not be editable in the
app.

Create Next templates with the official CLI so the baseline is never
hand-rolled:

```bash
npx create-next-app@latest <name> --typescript --tailwind --eslint \
  --app --src-dir --use-npm --disable-git --yes
```

Then delete what it leaves behind: `public/*.svg`, `AGENTS.md`,
`CLAUDE.md`, and the default `page.tsx`.

Deleting `AGENTS.md` and `CLAUDE.md` is **not enough on Next 16.3+** —
it rewrites both into the project root every time the dev server
starts, so they come back and get committed. Turn the generator off:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  agentRules: false,
};
```

One thing not to bother with: Next collects anonymous telemetry by
default, and shipping a `.env` with `NEXT_TELEMETRY_DISABLED=1` does
**not** switch it off — Next reads the file too late for the CLI, which
still reports telemetry as enabled. `npx next telemetry disable` works
but is a per-machine setting, so it can't ride along in a template.
Mention it in the template README and leave it there.

---

## 2. Two rules that exist because of Pare

**The dev script must be a plain `next dev`.** No `--turbo`, no
`--turbopack`, and no `--webpack` either.

Pare instruments your source at build time — that's how ⌘-clicking an
element in the preview knows which file and line to edit. The hook it
uses is a webpack hook, and Turbopack ignores it. Pare handles this by
adding `--webpack` itself when it launches Next 16, but it *disables
instrumentation entirely* if it finds `--turbo` in your dev script,
because that reads as a deliberate opt-in it shouldn't override. Adding
`--webpack` yourself is harmless but redundant, and it means running the
template outside Pare behaves differently from every other one.

**Every template needs a `typecheck` script.** On a Next template:

```json
"typecheck": "tsc --noEmit"
```

On a **Vite** template the scaffold uses project references, and
`tsconfig.app.json` already sets `noEmit`, so the build-mode form is
the one that works:

```json
"typecheck": "tsc -b"
```

After Pare applies a change it runs the project's own typecheck and
rolls the change back if it broke something. No script, no safety net.

---

## 3. Content lives apart from presentation

Every template has `src/content/`, holding all copy and data as typed
modules:

```
src/content/
  types.ts        Every content shape, in one place
  site.ts         Name, tagline, navigation, footer
  <domain>.ts     features / pricing / posts / listings / ...
```

Components import from there and never hardcode a sentence. This is the
single most important convention in the repo, for three reasons: it's
how a real site is built, it makes "change the price of the second plan"
a one-line edit in an obvious place, and it means the same component can
be reused across templates with different data behind it.

Use plain typed TypeScript, not MDX or a markdown parser, unless the
template is *about* long-form content (the documentation template is the
place to test a markdown pipeline). Typed data needs no dependency, no
build step, and the editor catches a missing field immediately.

---

## 4. Design tokens in one block

Every colour, font and radius goes in the `@theme` block at the top of
`globals.css`. Changing `--color-accent` should re-skin the whole
template. Never write a hex value inside a component.

Give each template its own palette and type — twenty sites that all look
like the same starter defeat the point. Vary the mood deliberately: some
light, some dark, some warm, some stark. That variety is also what
exercises Pare's Smart theme, which samples the page and dresses the app
chrome to match.

---

## 4b. Charts are validated, not eyeballed

Any template with charts picks its palette by **running the check**,
not by deciding the colours look different enough. Roughly one man in
twelve cannot tell some pairs apart, and it is not a judgement anyone
can make by eye.

The rules that have earned their place so far:

- **Assign categorical hues in a fixed order and never cycle them**, so
  an entity keeps its colour when a filter removes its neighbours.
- **One colour for nominal categories** (products, sources, teams).
  Shading them by size encodes the bar's length twice. A value ramp is
  only for genuinely ordered things — funnel stages, tiers, age bands.
- **One y-axis.** Two measures on two scales invent a correlation the
  data does not contain. Use two charts.
- **Every value must be readable as text**, and a tooltip is never the
  only way to read one. A table view is how you achieve that when the
  chart is the only place the value exists — which is the usual case,
  and why `analytics-dashboard` has a toggle on every card. It is not
  an end in itself: `project-tracker`'s roadmap writes each bar's name,
  stage and note on the page already, so a table twin of it would
  restate what is visible and earn nothing.
- **Axis ticks must be round numbers.** Picking a "nice" maximum is not
  enough — 75,000 split five ways gives 18,750. Choose the interval
  count that divides the maximum cleanly.

`analytics-dashboard` is the worked example; its `src/index.css`
records the exact validation commands and their results.

## 5. Build interface, not screenshots

Product mockups, charts, dashboards and logos are drawn in **HTML, CSS
or inline SVG**, not shipped as images. They stay sharp at any size,
weigh nothing, and — the real reason — every part of them can be clicked
and edited in Pare. A screenshot is a dead end.

Use photographs for the things photographs are actually for: article
covers, team portraits, editorial imagery, product shots.

---

## 6. Images

- Source from [Pexels](https://www.pexels.com/license/) — free to use
  and modify, no attribution required.
- **Commit them.** Don't hotlink; templates must work offline.
- Download at roughly twice their display size — around 1400px wide for
  a full-width cover, 700px for a portrait — and let Next's image
  optimiser or a Vite plugin handle the rest.
- Budget about 1MB of imagery per template. The SaaS template uses
  748KB for eight photographs.
- List every photo in a `CREDITS.md`, even though attribution isn't
  required.
- Prefer generated avatars (initials) over stock headshots for
  testimonials — a real face attached to an invented quote sits badly.
- Re-encoding to save weight can make a file **bigger**. Stock images
  arrive already compressed, so asking `sips` for quality 68 when the
  source was nearer 50 re-encodes upward. Fetch a smaller width first;
  only then compress, and measure both ways.

**Look at every photograph, and write the words against the picture.**

Choose the image first and caption it second. Written the other way
round, the caption describes what you hoped to find — and it will be
wrong often enough to matter. In `restaurant-booking`, alt text drafted
before sourcing claimed a fire glowing at the end of a room that has no
fire in the frame, and a "roast chicken, skin blistered from the coals"
turned out to be a pale poached bird with no char on it at all.

The corollary, and the one that takes nerve: **when no photograph
matches the copy, change the copy.** That template's menu says red
mullet rather than plaice because the good picture showed whole round
fish over coals and plaice is a flatfish. Editing one word of invented
content is free. Captioning the photograph "plaice" would have been a
small lie sitting on the page forever.

Two more things to check in the frame itself, because neither shows up
in a search result:

- **Legible signage.** A photo of a covered terrace was rejected from
  `restaurant-booking` for a large `PLECIDER MILL` sign across the back
  of it. §7 forbids real company names; a photograph is the easiest way
  for one to get in.
- **Whether it contradicts the surrounding claim.** `editorial-magazine`
  once illustrated a story arguing a joint needs no screws with a
  close-up of a metal screw.

---

## 7. Everything is fictional, and says so

Invent the company, the people, the quotes and the numbers. Say
plainly in the footer and the README that it isn't real. Never use a
real company's name, logo or trademark — customer logo rows are
rendered as invented wordmarks in plain text.

Write the copy properly. Placeholder lorem ipsum makes a template
useless for judging a design, and worthless for testing whether an edit
landed sensibly.

---

## 7b. Tune the invented numbers so the design can be judged

Inventing the data plausibly is not enough — it has to be tuned so
that every state a design has is **visible, and in the right
proportion**. A state that is meant to be exceptional has to be
exceptional in the data.

The worked example is `project-tracker`. Its first set of team
capacities left all six people over capacity, at 116% load. Every
number was defensible on its own and the page was useless: the amber
"over capacity" treatment was on every card, so it read as the normal
state rather than as a warning, and the whole thing looked like broken
data rather than a busy team. Adjusting the capacities so exactly one
person is over made the feature legible in one glance.

So, when the data is finished, look at each state the UI can show and
ask which of these it is:

- **Never reached** — the empty state, the over-limit warning, the
  error. Dead code as far as anyone can tell. Arrange for at least one.
- **Always reached** — the warning that fires on every row. It stops
  reading as a warning.
- **Reached about as often as it should be.** This is the target.

The same applies to a full column and an empty one, an unassigned
item, a long title that has to truncate, and a person with nothing on.
`project-tracker` deliberately holds one column over its limit, one
column empty under a filter, several unassigned issues and one person
with nothing in flight, for exactly this reason.

Sometimes the honest way to reach a state is to put it in the content
rather than tune the numbers until it appears. `restaurant-booking`
carries two closures — a private hire and a night the fire is being
relined — because otherwise no date in the booking calendar is ever
fully unavailable, and its "nothing free" state would never be seen by
anyone, including whoever wrote it.

### Derived data has to preserve the orderings a user can compare

When the data is computed rather than listed, the relationships between
its answers are part of the design, and users check them by changing one
input and watching.

`restaurant-booking` computes which tables are free from a hash of the
date, the service and the time, compared against a threshold that falls
as the party grows. The first version hashed the party size **too** —
which re-rolled every slot independently for each size, so a table for
six came up free at times a table for two could not. Every individual
answer was defensible; the set of them was nonsense, and one click
between "2" and "6" showed it.

So decide what must hold as each input moves — bigger party never has
more choice, a later date never has less, a busier night never has more
— and make it structurally true rather than probably true.

---

## 8. Before committing a template

```bash
npm run typecheck   # must pass
npm run lint        # must pass
npm run build       # must pass
npm run dev         # then click through every route
```

For Next templates, also run `npx next dev --webpack` once and confirm
it starts — that's the exact command Pare will use, and it's the one
path that a normal `npm run dev` won't exercise.

Look at the result in a browser before calling it done. A build can pass
while the page is visibly broken; the first version of the SaaS
template's bar chart compiled, typechecked and rendered nothing, because
a percentage height inside a flex column has no parent height to resolve
against and silently collapses to zero. **Compute pixel heights for
anything chart-shaped, and always look at the page.**

Then check every route at 375px wide and confirm
`document.documentElement.scrollWidth` equals `clientWidth`. A page
that scrolls sideways on a phone is the most common defect in this
repo and the easiest to miss on a laptop. Two causes account for
nearly all of it:

- **A flex or grid child will not shrink below its content.** A wide
  table inside an `overflow-x-auto` wrapper still pushes the page out
  unless that wrapper has `min-w-0` — the horizontal twin of the
  `min-h-0` rule that vertical scrollers need. Both `project-tracker`'s
  backlog table and its team cards needed it.
- **`sr-only` positions absolutely.** With no positioned ancestor, a
  visually-hidden label inside a horizontally scrolled container
  resolves against the page instead and lands hundreds of pixels off
  to the right. Give its parent `relative`.

And drive the interactions rather than assuming them, because the
interesting bugs are not visible in a screenshot: `project-tracker`'s
drag committed to the last pointer *move* rather than the pointer
*release*, so a quick flick dropped the card a column short — correct
in every slow test and wrong every time it mattered.

---

## 9. Registering it

Add an entry to `manifest.json` and a row to the table in `README.md`.
The manifest is what a future template picker inside Pare will read.
