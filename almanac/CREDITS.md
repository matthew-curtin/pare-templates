# Credits

## Photography

None, and not by omission. A jobs board has nothing to photograph. The
twelve organizations are invented, so they have no premises to show and
no logo to reproduce, and CONVENTIONS §6 rules out attaching a stock
photograph to an invented thing — which here would mean twelve of them.

Employers are drawn as initials instead, which is also what most job
boards fall back to more often than they admit.

## Icons

The mark — a page of dates with one of them picked out — is inline SVG,
in `src/components/wordmark.tsx` and again in `src/app/icon.svg` for the
favicon. Change one and change the other. There is no icon library and
no icon font.

## Type

**Plus Jakarta Sans**, one family for everything, self-hosted by
`next/font` at build time so there is no request to a font CDN at
runtime and no flash of fallback text.

The first version paired a text serif with a grotesque, which is the
obvious combination for anything calling itself a gazette and is also
about a decade out of date for an interface. The headings here are job
titles — some of them eleven words long — not article titles, and they
want the same voice as the rest of the page, one size up and a little
tighter.

Figures use `font-variant-numeric: tabular-nums` through a `.tabular`
class, because salaries, closing dates and job numbers all sit in
columns and proportional digits make a mess of them.

## Colour

Original to this template, and **validated rather than chosen** —
`node scripts/check-colours.mjs` reads the tokens back out of
`src/app/globals.css`, simulates protanopia, deuteranopia and
tritanopia, and measures every pair that can appear together plus every
piece of text against every surface it can land on. Forty-one checks.

The ground is a warm neutral, the cards are white, and the separation
between them is a soft shadow rather than a drawn border — so a list of
twenty postings carries twenty fewer edges than the bordered version
and reads as considerably calmer at the same density.

**The primary action colour is near-black rather than a brand hue.**
That is the decision the rest of the palette hangs off. It leaves colour
free to mean something — blue is a link, red is a deadline — and on a
board whose entire job is telling you what needs you this week, a
coloured button competing with a red closing date is a colour spent on
nothing. There are three hues in total, and everything a posting can be
that is a *fact* rather than a *state* is not coloured at all.

Two values moved because of the check rather than because of taste, and
both for the same reason: a warmer, lighter ground raises the bar for
everything drawn on it, so the muted ink and the field border each had
to come down a step. Lightening a background is never only a background
change.

The greys also split in two. A rule between postings is decoration —
WCAG 1.4.11 is about identifying controls and their state, and a divider
identifies nothing — while the boundary of a text field *is* the control
and owes the full 3:1. Most palettes use one grey for both and are wrong
about the second.

## Everything else

No third-party assets of any kind. Nothing is fetched at runtime, so the
template works offline.
