# spoke

A workshop's bill of materials, published.

Spaakwerk is an invented bicycle works in an invented Dutch town: nine
people, two bicycles, a hundred part numbers and no secrets. The site is
its build console — the same list that decides what gets made this week,
with the arithmetic left in.

```bash
npm install
npm run dev
```

Vite 8 · React 19 · TypeScript · Tailwind 4 · React Router.

## The one idea

A bill of materials is filed as an accounting document and it is really
a sentence about constraint. Ask a workshop why it can only build twelve
and the answer has a name and a price on it — and the price is almost
never large.

Three things the model keeps saying that nobody guesses:

| | |
| --- | --- |
| **The constraint is cheap** | The five parts nearest to halting a Kade cost **€0.70 between them**. The €182 hub gear would have allowed nineteen. |
| **Delivery is the longest chain** | Add up the lead times of a Kade's parts and you get **774 days**. The bicycle takes **49**, because everything is ordered on the same morning. 55 of its 58 parts could arrive a fortnight late and change nothing. |
| **Cheap stops you today; long-lead stops you in six weeks** | That is the split worth knowing, and it is not cheap-versus-expensive. Nipples are a phone call. Wound hub shells are a date in April that nobody can move. |

Every number on the site is computed from `src/content/`. Nothing is
typed twice — a spoke count of 64 appears nowhere, because the tree
stores 2 wheels and 32 spokes and the model multiplies.

## The architecture

**The tree IS the page.** Depth is not a disclosure control, it is the
layout. Every route is the same hierarchy seen from a different side:

- `/tree/:product` — the explosion, full width, with a sticky gutter
  carrying the rollup for whichever branch is under the pointer
- `/parts` — the tree flattened, with link-based filters
- `/parts/:id` — the tree **inverted**: every route from a bicycle down
  to this part
- `/builds` — the queue, checked cumulatively against the shelf
- `/orders`, `/method`, `/` — what is coming, how it works, and what it
  all adds up to this morning

A shortage propagates **up** the tree in CSS alone. `:has()` marks every
assembly containing a short part, so the constraint is visible at the
root without a line of JavaScript walking anything — which is also why
collapsing a branch hides its children rather than unmounting them.

## The model

`src/lib/bom.ts` has zero runtime imports, so `scripts/check-bom.mjs`
asserts against the module the site actually ships. Five walks over one
graph:

| Walk | Direction | |
| --- | --- | --- |
| `explode` | down, multiplying | how many of this are in one of those |
| `rolledCost` | up, summing | what a thing is worth made of |
| `leadTime` | up, **maximising** | the longest chain, never the sum |
| `buildable` | across the leaves | the smallest quotient wins |
| `whereUsed` | backwards from a leaf | the tree read the other way |

Plus `slack` — how late a part could be before the bicycle was. Exactly
one bought part in each bicycle has none, and it is the same part in
both.

**No `Date` anywhere in `src`.** Every instant is an integer day index
from a fixed morning, so the story reads identically in Auckland and in
Amsterdam. The checker asserts the absence, and runs under three
timezones.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run check        # 1,399 model checks + 75 colour checks
```

`scripts/check-bom.mjs` covers integrity, the arithmetic, every UI state
§7b asks to be reachable, and — the part that matters — **every claim
the prose makes**. The sentence about seventy cents is an assertion, not
a sentence somebody typed once and hoped stayed true.

`scripts/check-colours.mjs` reads the tokens back out of `src/index.css`
and validates them against WCAG and all three dichromacies. Both
checkers were falsified before shipping: each was broken on purpose
until it fired, and one of them turned out to have a hole — the check
guarding the `:has()` propagation passed with the propagation deleted,
because a second rule mentioning the same selector satisfied its regex.

## Everything here is invented

The workshop, the town, the nine people, the two bicycles, the nine
suppliers and every number attached to them. Replace it before showing
anything to anyone.

Photography is from [Pexels](https://www.pexels.com/license/); see
[CREDITS.md](CREDITS.md).
