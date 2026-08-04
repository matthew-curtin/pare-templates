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
| [saas-product-site](saas-product-site) | Marketing | Next.js | Light | ✅ Ready |
| [mobile-app-landing](mobile-app-landing) | Marketing | Next.js | Dark | ✅ Ready |
| [editorial-magazine](editorial-magazine) | Publishing | Next.js | Warm | ✅ Ready |

More on the way — around twenty in total, spanning marketing sites,
content and publishing, commerce and booking, and applications.

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

## Licence

The template code is yours to use for anything, with no attribution
required. Photography is from [Pexels](https://www.pexels.com/license/)
under its own licence; each template lists its sources in `CREDITS.md`.

The companies, people, quotes and metrics in these templates are all
invented. Replace them before showing anything to anyone.
