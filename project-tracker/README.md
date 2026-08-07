# Project tracker

A project tracker for a fictional product team called **Lantern**, in a
fictional tool called **Cadence**. Six routes: a draggable board, a
filterable backlog table, an issue page, a roadmap, a team page and
settings.

The fleet's second **application** and its second **Vite** template.
Like the analytics dashboard, this one lives behind a login, so there
is nothing to pre-render and the simpler build is the right tool.

There are **no images in this template**. The logo, the icons and the
roadmap are drawn in SVG or CSS.

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
| `/` | Board — five columns, drag cards between them |
| `/backlog` | Every issue — searchable, filterable, sortable |
| `/issue/:id` | One issue: description, checklist, activity |
| `/roadmap` | Four quarters by workstream |
| `/team` | Who is carrying what, against capacity |
| `/settings` | Workspace form, toggles, members |

## How it's organised

```
src/
  components/   Shell, board column, card, chips, controls
  content/      All the words, numbers and labels
  lib/          The board store, the drag, formatting, hooks
  pages/        One file per route
```

**Content is separate from presentation.** Every issue, name, label and
help string lives under `src/content/`. Components read from it and
never hardcode a sentence.

## The board

Worth knowing before you change it.

- **Dragging is built on pointer events, not HTML5 drag-and-drop.**
  Native DnD gives an unstyleable drag image, no control over where a
  card lands within a list, and nothing at all on touch.
- **The drop commits to where the pointer was RELEASED**, not to the
  last position a move event reported. A quick flick outruns the move
  stream, and trusting it drops the card a column behind the cursor.
  That bug was real here and it is the one worth keeping in mind if you
  rewrite this.
- **Touch arms on a long press.** A card that grabs the pointer
  immediately makes the column impossible to scroll with a finger, so
  `touch-action: pan-y` lets the browser scroll and the drag waits.
- **The keyboard can do everything the mouse can.** Each card has one
  tab stop; left and right arrows move it between columns, and the move
  is announced. Focus is restored after the move by an effect rather
  than a scheduled frame — the card lands in a different list, so React
  remounts it and focus would otherwise fall to the body after a single
  press.
- **The board does not persist.** Drag a card, reload, and it returns
  to `src/content/issues.ts`. That is deliberate: a cart should survive
  a refresh because it belongs to the user, but a board's contents are
  this template's *content*, and content that a stray storage entry can
  override has stopped being editable.

## Making it yours

1. `src/content/site.ts` — app name, workspace, columns, labels, and
   the date every "2 days ago" is measured against.
2. `src/index.css` — the `@theme` block holds every colour and font.
3. `src/content/issues.ts` — the issues.
4. `src/content/team.ts` — the people and their capacity.
5. `src/content/roadmap.ts` — quarters, workstreams and bars.

## Notes

- **Relative dates are measured against a fixed date**, `site.today`,
  not the real clock. Otherwise a template opened next year says every
  issue was updated eight months ago, which reads as neglect rather
  than as a demonstration. Point it at `new Date()` if you make this
  real.
- **Capacities are tuned so exactly one person is over.** If everyone
  is over, the warning stops meaning anything and the page looks like
  broken data rather than a busy team.
- **The colour ramps are for the ordered scales only.** Priority and
  roadmap stage are ordered, so they earn a ramp — and both always ship
  the word too. Labels are nominal and deliberately uncoloured; eight
  competing hues would drown the two places where colour means
  something.
- **The path alias is declared twice**, in `vite.config.ts` and in
  `tsconfig.app.json`. Vite resolves the import; TypeScript and your
  editor read the tsconfig. Both have to agree.
- Nothing here talks to a server. Saving a setting, filtering, sorting
  and moving a card are all local.

Cadence, Lantern, the people and every issue here are invented.
