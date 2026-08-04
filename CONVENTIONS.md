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
- **Every chart gets a table view**, and a tooltip is never the only
  way to read a value.
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

---

## 9. Registering it

Add an entry to `manifest.json` and a row to the table in `README.md`.
The manifest is what a future template picker inside Pare will read.
