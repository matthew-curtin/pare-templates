# Credits

## Photography

None, and not by omission. A jobs board has nothing to photograph. The
twelve organisations are invented, so they have no premises to show and
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

Two faces, both self-hosted by `next/font` at build time, so there is no
request to a font CDN at runtime and no flash of fallback text:

- **Source Serif 4** for headings and the masthead. A sturdy text serif
  rather than a display face, which is what a gazette wants: the
  headings here are job titles, and some of them run to eleven words.
- **Libre Franklin** for everything else. A civic grotesque, and the
  right register for a board whose readers work in local government.

Figures use `font-variant-numeric: tabular-nums` through a `.tabular`
class, because salaries, closing dates and reference numbers all sit in
columns and proportional digits make a mess of them.

## Colour

Original to this template, and **validated rather than chosen** —
`node scripts/check-colours.mjs` reads the tokens back out of
`src/app/globals.css`, simulates protanopia, deuteranopia and
tritanopia, and measures every pair that can appear together, plus every
piece of text against every surface it can land on. Thirty-nine checks.

The accent is a navy, `#17509b`. The palette has three hues in total and
that is the point: navy for links and the new flag, red for a vacancy
closing today, grey for one that has closed. Everything else a listing
can be is a fact rather than a state, and facts are not coloured.

Two things moved because of the check rather than because of taste.
`ink-subtle` started three steps lighter and failed on two of the four
grounds it is drawn on — the ordinary way a light palette goes wrong,
judged on white and used on grey. And the greys split in two: a rule
between listings is decoration and holding it to 3:1 would turn the page
into grey bars, while the boundary of a text field *is* the control and
owes the full ratio. Most palettes use one grey for both and are wrong
about the second.

The ground is a newsprint grey-blue rather than white, so a white
listing card sits on it as an object instead of dissolving into it.

## Everything else

No third-party assets of any kind. Nothing is fetched at runtime, so the
template works offline.
