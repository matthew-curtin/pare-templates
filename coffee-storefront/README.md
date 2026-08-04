# Coffee storefront

A complete shop for a fictional roastery called **Ridgeline**. Eight
routes, six products with variants, a working basket, and an
interactive brew timer.

The fleet's first commerce template, and the first with real client
state: the basket survives a reload, survives navigation, and stays in
agreement between two open tabs.

High contrast on purpose — white, near-black, one deep green — so it
sits apart from the other three templates rather than being a fourth
shade of the same idea.

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
| `/` | Home — hero, featured coffees, subscriptions, brewing |
| `/shop` | All six coffees, filtered by roast, process and stock |
| `/shop/[slug]` | A coffee — size and grind pickers, roast scale, flavour chart |
| `/cart` | The basket — quantities, removal, delivery threshold |
| `/subscribe` | Three frequencies, priced off the House blend |
| `/brewing` | Three recipes |
| `/brewing/[slug]` | A recipe, with a timer that runs |
| `/about` | The roastery |

## How it's organised

```
src/
  app/          One folder per route
  components/   Header, cards, pickers, filters, the brew timer
  content/      All the words, products and prices live here
  lib/          The basket store, the cart hook, money formatting
public/images/  Photography
```

**The content is separate from the components.** Every coffee, price,
tasting note, brew step and paragraph lives in typed files under
`src/content/`. Nothing is hardcoded in a component. So:

- To change **what the shop sells**, edit `src/content/coffees.ts`.
- To change **how it looks**, edit `src/components/` or the tokens in
  `src/app/globals.css`.

`src/content/types.ts` describes the shape of every kind of content, so
your editor will tell you if something is missing.

## Making it yours

1. `src/content/site.ts` — name, tagline, navigation, grind options,
   delivery pricing and the free-delivery threshold.
2. `src/content/coffees.ts` — the products. Sizes and prices are per
   product; grind is shared, because a roastery grinds to order.
3. `src/app/globals.css` — the `@theme` block holds every colour and
   font. Changing `--color-accent` re-skins the whole shop.
4. `src/components/logo.tsx` — the ridge is four line segments of
   inline SVG, not an image file.

## Notes

- **Money is whole pence everywhere**, and only becomes a string at the
  point it is displayed (`src/lib/money.ts`). Adding pounds as floats
  drifts — `0.1 + 0.2` is `0.30000000000000004` — and a shop that shows
  that once in a subtotal has a real problem. Integers do not drift.
- **The basket is a module store read through `useSyncExternalStore`**
  (`src/lib/cart-store.ts`), not React context. The server cannot know
  what is in your basket, so the server-rendered HTML must show an
  empty one; `useSyncExternalStore` takes a separate server snapshot
  and switches to the real one immediately after hydration, with no
  mismatch and no effect. Listening for the `storage` event on the way
  past means two open tabs agree about the basket.
- **Grind is part of the basket line, not of the coffee.** The same
  bean ordered whole and ordered for espresso are two different things
  to post, so they are two lines. The line id is
  `slug:size:grind`.
- **The flavour bars run horizontally on purpose.** A percentage width
  resolves against a known parent width; a percentage *height* inside a
  flex column often has nothing to resolve against and silently
  collapses to zero. There is a longer note in
  `src/components/flavour-profile.tsx`.
- The brew timer computes elapsed time from a timestamp rather than by
  counting ticks, so it stays accurate even when the browser throttles
  timers in a background tab.
- **Trademarks.** The brew guides name real equipment — AeroPress,
  Hario V60 — because you cannot write those recipes without naming
  them, and the photographs show the actual devices. That is ordinary
  nominative use. It is a different thing from putting a real company's
  logo on an invented product, which this template does not do.
- `agentRules: false` in `next.config.ts` stops Next 16.3 writing an
  `AGENTS.md` and a `CLAUDE.md` into the project root on every dev
  start. Deleting them is not enough; they come back.
- Next.js collects anonymous usage telemetry by default. Putting
  `NEXT_TELEMETRY_DISABLED=1` in a `.env` file does **not** turn it
  off — it is read too late. `npx next telemetry disable` does.
- Photography credits are in [CREDITS.md](CREDITS.md).

Ridgeline is not a real roastery. The company, the farms, the
producers, the prices and every claim on this site are invented, and
nothing here takes a payment.
