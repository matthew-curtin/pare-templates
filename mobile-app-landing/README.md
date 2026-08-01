# Mobile app landing

A marketing site for a fictional sleep app, called **Lull**. Eight
routes — including the help centre, press kit and legal pages that
every real app site has and almost every template leaves out.

Dark by design: it is a sleep app, so the palette is a cold indigo
night with one warm light in it.

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
| `/` | Home — hero, phone mockup, how it works, features, sound library, reviews |
| `/features` | Six features in full, plus the whole sound library |
| `/pricing` | Three plans, a monthly/yearly toggle, and an FAQ |
| `/download` | Store links, device requirements, and release notes |
| `/support` | Help centre — searchable, grouped by category |
| `/support/[slug]` | A help article, pre-rendered for each one |
| `/press` | Press kit — boilerplate, facts, assets, coverage, contact |
| `/legal/[doc]` | Privacy policy and terms |

## How it's organised

```
src/
  app/          One folder per route
  components/   Reusable pieces — header, cards, mockup, search
  content/      All the words and data live here
  lib/          Small helpers
public/images/  Photography
```

**The content is separate from the components.** Everything the site
says — features, prices, sounds, help articles, release notes, legal
text — lives in typed files under `src/content/`. Nothing is hardcoded
in a component. So:

- To change **what the site says**, edit `src/content/`.
- To change **how it looks**, edit `src/components/` or the tokens in
  `src/app/globals.css`.

`src/content/types.ts` describes the shape of every kind of content, so
your editor will tell you if something's missing.

## Making it yours

1. `src/content/site.ts` — name, tagline, navigation, footer, app details.
2. `src/app/globals.css` — the `@theme` block at the top holds every
   colour and font. Changing `--color-accent` re-skins the whole site.
3. `src/components/logo.tsx` — the crescent mark and the wordmark.
4. `public/images/sounds/` — swap the photography, keeping the same
   filenames, and nothing else needs to change.

## Notes

- The phone on the home page is **built in HTML and CSS**
  (`src/components/phone-mockup.tsx`), not a screenshot. It stays sharp
  at any size and you can edit any part of it — including the hypnogram,
  which is laid out from a plain array of sleep stages.
- The help centre search filters what is already on the page. There is
  no request and no spinner, and it works with the network off.
- The download badges are **not** Apple's or Google's official store
  artwork, which are trademarks. Replace them with the real badges, and
  follow each store's guidelines, before shipping anything.
- The privacy policy and terms are plain-English placeholders written so
  the pages have real shape to design against. They are not legal advice
  and have not been reviewed by a lawyer.
- Photography credits are in [CREDITS.md](CREDITS.md).
- Next.js collects anonymous usage telemetry by default. Putting
  `NEXT_TELEMETRY_DISABLED=1` in a `.env` file does **not** turn it off —
  it's read too late. `npx next telemetry disable` does, and applies to
  every Next project on your machine.

Lull is not a real company. All names, quotes, reviews, metrics, press
coverage and figures are invented.
