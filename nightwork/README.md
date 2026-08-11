# nightwork

A fireworks company that publishes **both** of its documents.

Nightwork is an invented display-design firm in Northumberland: nine
people, five licensed sites, and six displays whose entire scripts are
on the website — every shell, what it cost, the moment it broke and the
moment it actually left the ground.

```bash
npm install
npm run dev
```

Next.js 16 · React 19 · TypeScript · Tailwind 4.

Next collects anonymous telemetry by default and a `.env` cannot switch
it off — run `npx next telemetry disable` once per machine if you want
it off.

## The one idea

You do not design the sky. You design the delays.

A shell has to climb before it can do anything, and a twelve-inch shell
climbs for 6.3 seconds while a two-inch takes 2.1. So three shells that
break at the same instant were fired at three different times, and the
cue sheet a crew works from does not look like the show an audience
sees. Every other pyrotechnics site publishes the sky. This one
publishes both, and lets you flip between them.

Three things the model keeps saying that nobody guesses:

| | |
| --- | --- |
| **Most shows begin before they begin** | Five of the six displays here have a cue with a negative time on it. On Bracken Fell the mortar is audible **2.3 seconds** before anybody sees a light, because the opening shell has to be in the air before the show can start. |
| **The deepest salvo is fired 4.2 seconds apart** | Three shells break together at 9:30.0 in *The Long Field*. The twelve-inch left the ground at 9:23.7, the six-inch at 9:26.0 and the two-inch at 9:27.9. On a small lawn the same three tiers are fired **half a second** apart — that difference, not the budget, is what makes a big show hard to write. |
| **The finale is not bigger, it is faster** | The busiest second of every show with a finale is made of the *smallest* shells in the catalogue. *Blue Hour* is the exception that proves it: it has no rate finale at all, because you cannot fire copper that fast at any sane price. |

Every figure on the site is computed from `src/content/`. The prose was
written **after** running the model, and it corrected four sentences —
including one claiming Six Bells is the cheapest display we fire. It is
not; Ravensmoor is. Six Bells is the cheapest *per minute*.

## The architecture

**An altitude field.** Time runs across, real height runs up, and every
shell appears twice — as the climb, and as the burst at the top of it.
The annotations are anchored *in the sky* at the moment and the height
they describe, so reading a show means moving through it.

Flip the switch and the whole drawing becomes the crew's document: each
mark slides left by its own lift time, the trajectories vanish, and the
bursts become plain firing marks, because in that document there is no
burst — only a moment a match is touched.

Nothing is a canvas. The trajectories are one inline SVG with a viewBox
in (tenths × metres); every burst is a DOM element positioned by custom
properties. All of it is selectable and editable.

## The colour

The palette is **computed from physics**. A firework colour is a metal
salt burning at a temperature it can only just survive, and those
emission wavelengths are published — so each colour here is the actual
spectral line put through the CIE 1931 colour matching functions into
OKLCH, and each *lightness* is that emitter's real relative luminous
output.

| | | |
| --- | --- | --- |
| Copper blue | 445 nm | ×0.22 light |
| Strontium red | 645 nm | ×0.55 |
| Barium green | 515 nm | ×0.85 |
| Charcoal gold | 1700 K | ×1.00 |
| Sodium amber | 589 nm | ×2.60 |

Sodium is nearly twelve times the output of copper, so amber renders
bright and blue renders genuinely dim. The site's whole argument about
why every display you have ever seen was mostly gold is legible in its
own swatches before you read a word. Each page is then printed on a
coloured **stock** — a show wears its signature emitter, and `/colour`,
which is an argument about copper, is printed on blue paper.

`scripts/check-colours.mjs` validates it against WCAG and all three
dichromacies. Three things it found:

- **Purple needed no special case once it had two lines.** A
  copper-strontium star is 445 nm *and* 645 nm, and summing the two
  spectra is what the eye actually does — the hand-set hue correction
  the first version needed simply disappeared.
- **Broadband does not mean desaturated.** Maxing chroma turned
  titanium silver into a tangerine; taking chroma from the spectrum
  instead fixed it. But charcoal gold at 1700 K then *failed* the
  "thermal emitters are unsaturated" check, correctly — at that
  temperature the Planckian locus is a long way from white. Only
  *close to the white point* implies desaturated.
- **Zero colour-blindness collisions, where nine were predicted.** Red
  at 645 nm against green at 515 nm is the textbook pair a red-green
  deficiency collapses, and it clears ΔE 20.5 here — because lightness
  derived from luminous output separates the emitters on an axis no
  colour deficiency touches. The closest pair is copper against
  copper-plus-strontium for a protanope, at ΔE 3.02, which is exactly
  the pair the chemistry predicts and is thin enough that the checker
  prints the margin.

## The model

`src/lib/ballistics.ts` and `emission.ts` have zero runtime imports, so
the checkers assert against the modules the site actually ships. There
is **no `Date` anywhere in `src`** — every instant is an integer number
of tenths of a second from a show's own start, which can go negative —
and the checker asserts the absence and runs under three timezones.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run check        # 594 model + prose checks, 572 colour checks
```

Both checkers were falsified before shipping — broken twelve ways on
purpose until each fired on the right assertion. One case had to be
redesigned: shrinking Ravensmoor's crowd distance tripped the prose
assertion that quotes 88 metres *before* reaching the site-limit check
it was meant to test, so it proved the wrong thing.

The prose section is the one that matters. It also caught a count
nothing else could: three places said "eighteen shells" against a
catalogue of twenty, and nothing failed, because nothing was checking
it. A number written as a word is still a number.

## What driving it found

Three bugs in the document flip that every static check passed, that
looked identical in a screenshot, and that only appeared by clicking the
control and reading the computed value in both states:

1. An inline `--x` on each burst beat the stylesheet rule meant to
   override it.
2. `container-type: size` — added innocently so bursts could be sized
   in `cqh` — applies **style containment**, which stops `:has()`
   invalidation on an ancestor from reaching inside the contained
   subtree.
3. Every way of *animating* the flip is broken in Chromium today:
   `transition: left` leaves the computed value stale, `transition: --x`
   freezes the registered property, and a plain `transition: opacity`
   does the same to the trajectories' fade. With no transition at all,
   everything works. The flip is a cut, deliberately.

A stale `next start` serving a previous build cost a further round on
top of that. Kill the server before believing a rebuild.

## Everything here is invented

The company, the six displays, the clients, the five sites, the prices
and the people. The chemistry, the ballistics and the safety distances
are real, because the arithmetic only means anything if they are.
Replace the rest before showing it to anyone.

Photography is from [Pexels](https://www.pexels.com/license/); see
[CREDITS.md](CREDITS.md), which also records the two sites that have no
photograph and why.
