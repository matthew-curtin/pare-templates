# SaaS product site

A marketing site for a fictional software product, called **Cadence**.
Eight pages, real content, and a blog — the shape a real SaaS site
actually takes, rather than a landing page on its own.

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
| `/` | Home — hero, product mockup, features, testimonials, recent posts |
| `/features` | Six features, each with a detail section |
| `/pricing` | Three plans, a monthly/yearly toggle, and an FAQ |
| `/changelog` | Six dated releases, tagged by type |
| `/blog` | Post index with a lead story |
| `/blog/[slug]` | Full post, pre-rendered for each entry |
| `/about` | Story, values, team, company FAQ |
| `/contact` | Contact form with validation |

## How it's organised

```
src/
  app/          One folder per route
  components/   Reusable pieces — header, cards, forms, mockup
  content/      All the words and data live here
  lib/          Small helpers
public/images/  Photography
```

**The content is separate from the components.** Everything the site
says — features, prices, posts, team, navigation — lives in typed files
under `src/content/`. Nothing is hardcoded in a component. So:

- To change **what the site says**, edit `src/content/`.
- To change **how it looks**, edit `src/components/` or the tokens in
  `src/app/globals.css`.

`src/content/types.ts` describes the shape of every kind of content, so
your editor will tell you if something's missing.

## Making it yours

1. `src/content/site.ts` — name, tagline, description, navigation, footer.
2. `src/app/globals.css` — the `@theme` block at the top holds every
   colour and font. Changing `--color-accent` re-skins the whole site.
3. `src/components/logo.tsx` — the wordmark and its mark.
4. `public/images/` — swap the photography, keeping the same filenames,
   and nothing else needs to change.

## Notes

- The product screenshot on the home page is **built in HTML and CSS**
  (`src/components/app-mockup.tsx`), not an image. It stays sharp at any
  size and you can edit any part of it directly.
- The contact form has no backend. It validates and shows its success
  state so you can see the whole flow; wire up `handleSubmit` when you
  have somewhere to send it.
- Testimonial avatars are generated from initials, so there are no stock
  photos standing in for quotes nobody gave.
- Photography credits are in [CREDITS.md](CREDITS.md).
- Next.js collects anonymous usage telemetry by default. Putting
  `NEXT_TELEMETRY_DISABLED=1` in a `.env` file does **not** turn it off —
  it's read too late. `npx next telemetry disable` does, and applies to
  every Next project on your machine.

Cadence is not a real company. All names, quotes, metrics and customer
logos are invented.
