# Editorial magazine

A complete website for a fictional quarterly magazine called
**Meridian**, about places and the people who make them. Seven routes,
nine full-length stories, three departments and six contributors.

Warm and typographic: cream paper, one brick-red spot colour, and a
serif for everything. It is the light-but-warm end of the fleet, which
is a different thing from the crisp white of the SaaS template.

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
| `npm run typecheck` | Types only, no output |
| `npm run lint` | ESLint |

## What's in here

| Route | Page |
| --- | --- |
| `/` | Home — masthead, lead story, latest, the print edition, departments |
| `/story/[slug]` | A story, pre-rendered for each of the nine |
| `/section/[slug]` | A department index — Cities, Craft, Land |
| `/archive` | Everything, filterable by department and year |
| `/contributors` | The six people who write and photograph it |
| `/about` | What the magazine publishes and how it is paid for |
| `/subscribe` | Three plans, the current issue, and questions |

## How it's organised

```
src/
  app/          One folder per route
  components/   Header, cards, the cover mockup, the filters
  content/      All the words and data live here
  lib/          Date formatting
public/images/  Photography
```

**The content is separate from the components.** Every word the site
says — the stories and their full body text, the departments, the
contributors, the plans, the legal-ish about copy — lives in typed
files under `src/content/`. Nothing is hardcoded in a component. So:

- To change **what the magazine says**, edit `src/content/`.
- To change **how it looks**, edit `src/components/` or the tokens in
  `src/app/globals.css`.

`src/content/types.ts` describes the shape of every kind of content, so
your editor will tell you if something is missing.

## Making it yours

1. `src/content/site.ts` — name, tagline, navigation, the standfirst.
2. `src/app/globals.css` — the `@theme` block at the top holds every
   colour and font. Changing `--color-accent` re-skins the whole
   magazine, masthead rule and print cover included.
3. `src/content/sections.ts` — rename the three departments; stories
   point at them by slug.
4. `src/components/logo.tsx` — the masthead is live text, not an image.

## Notes

- **The print edition cover is built in HTML and CSS**
  (`src/components/cover-mockup.tsx`), not a screenshot. The masthead,
  the cover line, the spine and the paper edge are all live — edit any
  of them. It sizes its own type with container-query units, so it
  looks right at 20rem on the subscribe page and at 22rem on the home
  page without a second set of styles.
- **Story bodies are typed blocks**, not markdown — paragraph, heading,
  quote, list, figure. Each gets a deliberate treatment, and a
  malformed one is a type error rather than a rendering surprise.
- The archive filters what is already on the page. No request, no
  spinner, works with the network off.
- The reading-progress hairline on a story measures the article
  element, so it reaches 100% at the end of the text rather than
  somewhere inside the footer. It is driven by
  `requestAnimationFrame`, so it will not update in a background tab
  until you come back to it — which is the intended behaviour and also
  why it cannot be verified in a headless browser.
- `agentRules: false` in `next.config.ts` stops Next 16.3 writing an
  `AGENTS.md` and a `CLAUDE.md` into the project root on every dev
  start. Deleting them is not enough; they come back.
- Next.js collects anonymous usage telemetry by default. Putting
  `NEXT_TELEMETRY_DISABLED=1` in a `.env` file does **not** turn it
  off — it is read too late. `npx next telemetry disable` does, and
  applies to every Next project on your machine.
- Photography credits are in [CREDITS.md](CREDITS.md).

Meridian is not a real magazine. The publication, its writers, the
people quoted, the towns described and every figure on this site are
invented.
