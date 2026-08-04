# Analytics dashboard

A product-analytics app for a fictional company called **Orrery**. Six
routes, five kinds of chart, a filterable event catalogue, and a
settings form.

The fleet's first **application** and its first **Vite** template. The
other four are public-facing sites on Next.js; this one lives behind a
login, so there is nothing to pre-render and the simpler build is the
right tool.

There are **no images in this template**. Every chart, icon and mark is
drawn in SVG or CSS, which is why it weighs almost nothing and why
every part of a chart can be clicked and edited.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check, then production build |
| `npm run typecheck` | Types only, no output |
| `npm run lint` | oxlint |
| `npm run preview` | Serve the production build locally |

## What's in here

| Route | Page |
| --- | --- |
| `/` | Overview — KPI row, events over time, sources, plan mix |
| `/audience` | Retention heatmap and teams by plan |
| `/funnels` | Activation funnel with drop-off at each stage |
| `/events` | Event catalogue — searchable, filterable, sortable |
| `/events/:id` | One event: its own numbers and daily volume |
| `/settings` | Workspace form, toggles and members |

## How it's organised

```
src/
  components/       Shell, stat tile, range picker
  components/chart/ The chart primitives
  content/          All the words, numbers and labels
  lib/              Formatting, derivation, hooks
```

**Content is separate from presentation.** Every label, help string,
event description and note lives under `src/content/`. Components read
from it and never hardcode a sentence.

The one exception is `src/content/metrics.ts`, which *computes* its
daily series rather than listing it. Ninety days × three measures is
270 numbers; as a literal nobody could edit it sensibly. The shape
parameters at the top of that file are the editable surface instead —
change `TREND_PER_DAY` and the whole dashboard responds. It is seeded,
not random, so the figures are identical on every reload.

## The charts

They are hand-built, and they follow a specific method rather than
taste. Worth knowing before you change one:

- **The palette was validated, not chosen by eye.** The three
  categorical series clear the colourblind-separation, lightness-band,
  chroma and normal-vision gates against this app's white surface; the
  funnel's ordinal ramp clears monotone-lightness and light-end
  contrast. The exact commands and results are in the comment block in
  `src/index.css`. **Re-run them if you change a colour** — "these look
  different enough" is how a chart becomes unreadable for about one in
  twelve men.
- **The slot order is the safety mechanism, not a preference.**
  Assign series in order and never cycle. An entity keeps its hue when
  a filter removes its neighbours.
- **One colour per nominal bar chart.** "Where sessions come from"
  draws every bar in one hue, because those categories have no order
  and shading them by size would encode length twice. The funnel is
  the opposite case — its stages *are* ordered, so it earns a ramp.
- **One y-axis, always.** Two measures on two scales invent a
  correlation the data does not contain.
- **Every chart has a table twin.** The toggle is in the shared card,
  so no chart can ship without one. A tooltip is never the only way to
  read a value — one series sits below 3:1 against white, so colour
  alone cannot carry it either.
- **Axis ticks are round numbers.** A "nice" maximum is not enough:
  75,000 split five ways gives 18,750. Each candidate maximum carries
  the interval count that divides it cleanly — see `niceScale` in
  `time-series.tsx`.

## Making it yours

1. `src/content/site.ts` — app name, workspace, navigation, members.
2. `src/index.css` — the `@theme` block holds every colour and font,
   including the chart palette and its validation notes.
3. `src/content/metrics.ts` — the series shape and the KPI definitions.
4. `src/content/events.ts` — the event catalogue.

## Notes

- **Charts measure themselves before the first paint.** The size hook
  reads the box synchronously in a layout effect and uses
  ResizeObserver only for later resizes. Relying on the observer's
  first callback looks fine until the page is not actively painting — a
  background tab, a hidden panel — and then the chart is permanently
  blank. That bug was real here: toggling a chart to its table view and
  back left an empty card.
- **The date range lives in the URL** (`?range=7d`), so a refresh keeps
  it, the back button steps through it, and the link is shareable.
- **The path alias is declared twice**, in `vite.config.ts` and in
  `tsconfig.app.json`. Vite resolves the import; TypeScript and your
  editor read the tsconfig. Both have to agree. There is no `baseUrl` —
  TypeScript 6 deprecates it, and `paths` resolves relative to the
  config file without one.
- Nothing here talks to a server. Saving a setting, filtering a table
  and moving the date range are all local.

Orrery and Fieldnote are invented. The company, the people, the
figures, the outage and every event name are made up.
