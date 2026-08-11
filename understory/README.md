# understory

A botanic garden that tells you when **not** to come.

Strathdunan is an invented garden on the north shore of an invented sea
loch in Argyll: twenty-one hectares, nine staff, fifty-nine accessions
on this site, and a single-track road at the end of it. The sea keeps
the frost off, so almost everything in it would be dead forty miles
inland.

```bash
npm install
npm run dev
```

Next.js 16 · React 19 · TypeScript · Tailwind 4.

Next collects anonymous telemetry by default and a `.env` cannot switch
it off — run `npx next telemetry disable` once per machine if you want
it off.

## The one idea

A garden's website shows you one perfect afternoon in July. Almost every
one of them does, because July is when the photographer was free and
when the visitors are.

This garden's best week is the third week of March. Its worst is in late
September. And for fourteen weeks of the year the honest answer is that
there is not much to see — so the site is organised around **when**
rather than **what**, and the front page opens on week 33, which is the
week more people come than any other and is nowhere near the best.

Three things the model keeps saying that nobody guesses:

| | |
| --- | --- |
| **The worst week is not in winter** | It is the third week of September, at **9.8** against March's **54.0** — after the summer has finished and before anything has turned. Winter has bark, scent and a heated glasshouse; late September has three things and one of them is a hedge fuchsia. |
| **Arrival is uncorrelated with quality** | Rank every week by how good the garden is, and **more people come in the ten worst weeks than in the ten best**. Not approximately as many. More. |
| **Being in flower and being worth the walk are different lengths** | A strength-ten magnolia clears the bar for every week it is out; a strength-five trillium clears it only in the middle of its season. That falls out of two numbers rather than being a third one somebody keeps consistent. |

Every figure on the site is computed from `src/content/`. The prose was
written **after** running the model, and three sentences changed
because of what it said — including a note calling the third week of
July "the thin week", which was sitting on the day the giant lily opens.

## The architecture

**A mosaic wall.** There is no page column anywhere and no chrome layer.
The viewport is a dense grid, and a tile's **area** is what that plant is
worth in the week you are looking at. There is no `featured` field in
the content — the only way to be large here is to be worth looking at
that week — so moving through the year re-packs the wall, and the thin
weeks are visibly thin. The masthead is itself a tile, competing for
space with whatever is flowering, which in March it loses.

Week links are plain `<a>` on purpose. A real document navigation is
what lets the browser run a **cross-document view transition**, so each
plant flies from its old cell to its new one and the re-pack is legible
instead of being a cut — with no JavaScript at all. All 52 week pages
and all 59 plant pages are pre-rendered, so a navigation is a cached
file. `eslint.config.mjs` records the trade in full.

## The colour

The page **is** the week. Eight anchor colours around the year,
interpolated per week in `src/lib/ground.ts`, driving the ground, the
sheet, the ink and one saturated flare. March is rose, early May is acid
green, June is poppy blue, late October is amber, and late November is
very nearly nothing. Every page is dressed in the week it is *about* —
so a plant's own page wears the season of its peak, and the blue poppy's
page is blue.

Measured across the sixteen templates that came before it, the page
surface in this repo runs 0.002 to 0.016 chroma. Here it reaches
**0.074**.

`scripts/check-colours.mjs` walks all 52 grounds, all 8 anchors and all
59 tile colours, and validates them against WCAG and all three
dichromacies. Two things it found that nobody would have:

- Mid-March and the end of July were, for a deuteranope, **the same page
  colour** — ΔE 0.8 — because they had been given identical lightness
  and opposite hue. The fix was to spread the lightness, not to lower
  the bar; it is also more truthful, since a July canopy is dark and a
  magnolia against a March sky is not.
- Six tile colours could not be captioned legibly in black **or** white,
  because lightness 0.55–0.62 is a dead band where neither reaches
  4.5:1. Captions are now *constructed* — the tile's own hue at whatever
  lightness clears — which fixes the class rather than the six.

## The model

`src/lib/season.ts` and `calendar.ts` have zero runtime imports, so
`scripts/check-season.mjs` asserts against the modules the site actually
ships. Every window is circular — witch hazel opens in week 51 and
closes in week 8 — and **there is no `Date` anywhere in `src`**: a week
is an integer, and the checker asserts the absence and runs under three
timezones.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run check        # 748 model checks + 169 colour checks
```

The section that matters most is **the prose**. A number in a sentence
is the one kind of content nothing else in this repo can catch: it
typechecks, it builds, it renders, and it is wrong.

Both checkers were falsified before shipping — broken seven ways on
purpose until each fired on the right assertion — and that found a real
hole. Restricting the caption-ink search to one direction, the exact bug
it had been rewritten to fix, left every check green, because the
function's own fallback returns pure black and pure black passes a
contrast test perfectly well. The ratio check was measuring
accessibility, which survived; nothing was measuring the intent. A
fallback that rescues the output is precisely what hides a bug from a
check aimed at the output.

## Everything here is invented

The garden, the loch, the village, the nine staff, the accession
numbers, the visitor counts and the founder. The plants and their
seasons are real, because the argument only works if they are. Replace
the rest before showing it to anyone.

Photography is from [Pexels](https://www.pexels.com/license/); see
[CREDITS.md](CREDITS.md), which also records the six things that have no
photograph and why.
