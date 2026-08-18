# Pare templates

Starter sites for [Pare](https://github.com/matthew-curtin/parallax) — the
IDE for product teams.

Each one is a complete, working website rather than a homepage: real
routes, real content, real navigation. They exist so you can start from
something that already looks like a product instead of a blank page, and
so Pare itself has realistic projects to be tested against.

## Using one

Clone the repo and open any template folder as a project in Pare, or:

```bash
git clone https://github.com/matthew-curtin/pare-templates
cd pare-templates/saas-product-site
npm install
npm run dev
```

Each template is self-contained — its own dependencies, its own README.

## The templates

| Template | Type | Stack | Theme | Status |
| --- | --- | --- | --- | --- |
| [saas-product-site](saas-product-site) | Marketing site | Next.js | Light | ✅ Ready |
| [mobile-app-landing](mobile-app-landing) | Marketing site | Next.js | Dark | ✅ Ready |
| [editorial-magazine](editorial-magazine) | Content & publishing | Next.js | Warm | ✅ Ready |
| [coffee-storefront](coffee-storefront) | Commerce & listings | Next.js | Light | ✅ Ready |
| [analytics-dashboard](analytics-dashboard) | Application | Vite | Light | ✅ Ready |
| [project-tracker](project-tracker) | Application | Vite | Dark | ✅ Ready |
| [restaurant-booking](restaurant-booking) | Booking & scheduling | Next.js | Dark | ✅ Ready |
| [docs-site](docs-site) | Content & publishing | Next.js | Light | ✅ Ready |
| [support-inbox](support-inbox) | Application | Vite | Light | ✅ Ready |
| [almanac](almanac) | Commerce & listings | Next.js | Light | ✅ Ready |
| [conference-schedule](conference-schedule) | Booking & scheduling | Next.js | Light | ✅ Ready |
| [trail-guide](trail-guide) | Content & publishing | Next.js | Dark | ✅ Ready |
| [exposure](exposure) | Commerce & listings | Next.js | Light | ✅ Ready |
| [playout](playout) | Application | Vite | Dark | ✅ Ready |
| [kiln](kiln) | Booking & scheduling | Next.js | Warm | ✅ Ready |
| [spoke](spoke) | Application | Vite | Light | ✅ Ready |
| [understory](understory) | Content & publishing | Next.js | Seasonal | ✅ Ready |
| [nightwork](nightwork) | Marketing site | Next.js | Light | ✅ Ready |
| [tally](tally) | Application | Next.js | Dark | ✅ Ready |

More on the way — around twenty in total, spanning marketing sites,
content and publishing, commerce and booking, and applications.

### Page architecture register

No two templates may share a page architecture, so each one claims an
entry here and a new template has to take an unused one. The reason is
in [CONVENTIONS.md §4c](CONVENTIONS.md): architecture is what you see
before you read a word, and it is the part of a design that can be
checked by looking rather than argued about.

The first six were all the same thing, which is what prompted the rule.

| Template | Architecture |
| --- | --- |
| saas-product-site | Sticky bar over a centred column ⚠️ |
| mobile-app-landing | Sticky bar over a centred column ⚠️ |
| editorial-magazine | Sticky bar over a centred column ⚠️ |
| coffee-storefront | Sticky bar over a centred column ⚠️ |
| restaurant-booking | Sticky bar over a centred column ⚠️ |
| almanac | Sticky bar, centred column, filter aside ⚠️ |
| docs-site | Fixed nav rail, reading column, contents rail |
| analytics-dashboard | App shell — top nav over a tiled grid |
| project-tracker | App shell — horizontally scrolled board |
| support-inbox | App shell — list beside detail |
| conference-schedule | Full-bleed time grid, sticky axes, no page column |
| trail-guide | Vertical terrain rail — the route drawn full-height beside the content |
| exposure | Split view — a pinned drawing beside a scrolling document |
| playout | Docked console — a persistent transport bar under a full-bleed log |
| kiln | Packed container — full-bleed rows drawn to scale, with the leftover space left visible |
| spoke | Indented tree — depth is the layout, with a sticky rollup gutter for the branch under the pointer |
| understory | Mosaic wall — a full-bleed dense grid with no page column, where a tile's area is its rank that week |
| nightwork | Altitude field — a full-bleed two-axis plot of time against real height, with the annotations anchored in the sky at the moment they describe |
| tally | Uptime strip — stacked full-width service rows, each an identity / ninety-day tally / budget triptych, and that triptych repeated as the unit of every other page |

⚠️ marks the six that predate the rule and share one architecture
between them. They are grandfathered, not endorsed.

## Why two stacks

Templates use the stack a professional would actually choose for that
kind of site, which is not the same answer every time:

- **Next.js** for anything public-facing — marketing sites, blogs, docs,
  storefronts, listings. These need fast first loads and search engines
  need to read them, so pages are pre-rendered.
- **Vite + React** for applications — dashboards, kanban boards, chat,
  anything that lives behind a login. Nothing to pre-render, so the
  simpler build wins.

Both are React + TypeScript + Tailwind, so the components, the content
conventions and the editing experience are the same either way.

## What every template has

- **Content separated from presentation.** All copy and data live in
  typed files under `src/content/`. Components read from them and never
  hardcode words.
- **Real navigation.** Several routes with real URLs, so the browser
  back button and a refresh both behave.
- **Working interaction.** Forms validate, toggles toggle, filters
  filter — enough that the flow can be seen end to end without a backend.
- **A typecheck script**, so mistakes surface immediately.
- **Committed images**, optimised and licensed for reuse, so everything
  works offline.

Details and rationale are in [CONVENTIONS.md](CONVENTIONS.md).

## Thumbnails

Every template has a screenshot at `thumbnails/<id>.jpg`, and its manifest
entry points at it. Pare's template picker shows these; a template without
one falls back to a route sketch, silently and by design, which is why the
consistency is checked rather than trusted.

```
node scripts/shoot-fleet.mjs            # re-shoot everything
node scripts/shoot-fleet.mjs understory # or just one
node scripts/check-thumbnails.mjs       # manifest and images agree
```

Shooting boots each template's own dev server and photographs the homepage
at 1280×800, so the templates need to be installed first. It drives the
Chrome already on this machine via Playwright — installed under
`scripts/`, deliberately not at the repo root, so it can never end up on a
template's module resolution path.

**Look at the images before committing them.** A template that boots to an
error page screenshots the error page, and no script can tell the
difference.

## Licence

The template code is yours to use for anything, with no attribution
required. Photography is from [Pexels](https://www.pexels.com/license/)
under its own licence; each template lists its sources in `CREDITS.md`.

The companies, people, quotes and metrics in these templates are all
invented. Replace them before showing anything to anyone.
