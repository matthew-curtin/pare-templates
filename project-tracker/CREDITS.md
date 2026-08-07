# Credits

## Photography

None. This template ships **no image files at all**. The Cadence mark,
the favicon, the five sidebar icons, the search and dropdown glyphs and
the roadmap are all drawn in SVG or CSS.

Avatars are drawn from initials rather than photographed. A real face
attached to an invented person sits badly, and it keeps the template
free of binary assets entirely.

## Type

The system UI stack — `system-ui`, then `-apple-system` and
`"Segoe UI"` — with no webfont, and `ui-monospace` for issue keys,
points and dates.

Two reasons rather than laziness. A tracker is a tool people keep open
all day, and the system face is the one already rendering everywhere
else on their machine. And the mono face is doing real work: issue
keys and point counts are read as columns of figures, so they want
tabular figures and a fixed advance width, or the board jitters as
numbers change.

If you want a brand face here, add it with `@font-face` in
`src/index.css` and point `--font-sans` at it. Keep the figures
monospaced.

## Colour

Original to this template. A near-black cool graphite with a single
teal signal.

Teal is a deliberate choice rather than a taste one: it leaves the
entire warm half of the wheel free for priority and status, so an
"urgent" red can never be mistaken for the brand colour, and the
roadmap's ordered stage ramp can climb through the accent hue without
colliding with anything that means "attention".

Both ramps in this template — priority and roadmap stage — encode
genuinely ordered scales, and both always ship the value as a word as
well. Labels are nominal and are deliberately left uncoloured.

## Everything else

There are no third-party assets in this template.
