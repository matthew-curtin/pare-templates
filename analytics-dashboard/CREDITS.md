# Credits

## Photography

None. This template ships **no image files at all** — every chart,
icon, sparkline and mark is drawn in SVG or CSS. That is why it has no
image budget to speak of, and why every part of a chart is editable
rather than being a picture of one.

## Type

The system UI stack — `system-ui`, then `-apple-system` and
`"Segoe UI"` — with no webfont. Two reasons rather than laziness: a
dashboard is a tool people keep open all day, and the system face is
the one already rendering everywhere else on their machine; and it
removes a network request and a font-loading shift from an app whose
first paint is a wall of numbers.

If you want a brand face here, add it with `@font-face` in
`src/index.css` and point `--font-sans` at it. Keep the big figures in
the same family as the rest — a display or serif face on a hero number
reads as decoration in a tool.

## Colour

The chart palette is not original to this template. The categorical
hues, the sequential blue ramp and the ordinal steps come from a
validated reference palette, re-checked against **this** app's white
surface rather than assumed to transfer. The commands and their
results are recorded in the `@theme` block in `src/index.css`.

Status colours (good / warning / critical) are deliberately distinct
from the series colours, so a status hue can never impersonate an
entity, and they always ship with a label or an arrow rather than
carrying meaning by colour alone.

## Everything else

The Orrery mark, the sidebar icons, the favicon, and all five chart
types are drawn in this repository. There are no third-party assets.
