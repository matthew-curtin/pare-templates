# Credits

## Photography

None, and not by omission. A support inbox has nothing to photograph —
the people in it are invented, and CONVENTIONS §6 rules out putting a
stock face next to an invented person, which in a template like this
would mean fourteen of them.

Everyone is drawn as initials instead, which is also what a real
support tool shows for most customers, who have never uploaded
anything. Colleagues get a tinted avatar and customers a neutral one,
so the two are told apart by weight rather than by a fifth colour.

## Icons

All twenty are inline SVG in `src/components/nav-icon.tsx`, drawn for
this template. No icon font and no library — they inherit the
surrounding colour through `currentColor`, so a token change moves them
with everything else, and each one can be selected and edited in Pare
like any other element.

## Type

The system stack, as with the other two Vite templates in this fleet:
`ui-sans-serif` for the interface and `ui-monospace` for figures.

No webfont, deliberately. This template is dense with numbers that sit
in columns — clocks, counts, ticket references — and the thing that
matters for those is `font-variant-numeric: tabular-nums`, which the
system mono has. A downloaded face would cost a network request and a
flash of fallback text to buy something an inbox does not need.

## Colour

Original to this template, and **validated rather than chosen** —
`node scripts/check-colours.mjs` reads the tokens back out of
`src/index.css`, simulates protanopia, deuteranopia and tritanopia over
every pair that can be on screen at once, and measures the CIEDE2000
distance between them.

The accent is a mulberry, `#a51e5d`. Magenta is the one hue no other
template in the fleet uses — the others have claimed indigo, warm
amber, rust, deep green, blue, teal, ember and violet — and it earns
its place beyond that. A support inbox is mostly a wall of state, and
those states need red and amber in the warm half of the wheel and blue
and green in the cool half. Sitting the brand at magenta leaves both
alone.

The check has real teeth: the first four palettes written for this
template failed it. One paired an amber status with a red deadline that
are **2.8 apart** under deuteranopia — the same colour, to roughly one
man in twelve, on a page whose entire job is telling you which
conversations need you. The eventual amber is a compromise the sweep
found rather than one anyone would have guessed: light enough to
separate from red, dark enough to keep 3:1 against the tint behind it,
with about 0.1 of margin either side.

The ground is a warm greige rather than the cool grey the fleet's other
light application uses, so the two do not read as the same product.

## Everything else

The Parley mark — two speech bubbles, the one in front answering the
one behind — is inline SVG, in the sidebar and in
`public/favicon.svg`. There are no third-party assets of any kind, and
nothing is fetched at runtime, so the template works offline.
