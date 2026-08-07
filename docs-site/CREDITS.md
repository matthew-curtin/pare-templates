# Credits

## Photography

None. A documentation site has nothing to photograph — the only images
here are the wordmark and the favicon, both drawn as inline SVG so they
stay sharp at any size and can be edited in place.

## Type

**Public Sans** for everything, **JetBrains Mono** for code, both through
`next/font`, which downloads and self-hosts them at build time. Nothing is
fetched from a font CDN at runtime, so there is no third-party request, no
flash of a fallback face, and the site works offline.

Public Sans is a neutral grotesque designed for government service pages,
which makes it very good at exactly this job: legible at small sizes,
uncomplicated over long stretches of reading, and boring enough not to
compete with the code beside it.

JetBrains Mono is the first real monospace webfont in this fleet. Every
other template falls back to whatever `ui-monospace` resolves to, which is
fine when code is incidental and not fine when half the page is a code
sample — the fallback differs per platform, so line lengths and the
alignment of a parameter table change depending on who is looking.

## Syntax highlighting

[Shiki](https://shiki.style), using the **tokyo-night** theme. Shiki runs
at build time on the server, so no highlighter reaches the browser.

The theme was chosen for its background, `#1a1b26`, which is a deep
blue-black that sits well under the violet accent. `--color-code` in
`globals.css` is set to the same value so the language bar and the copy
button read as part of one surface. **Change one and you must change the
other** — a code block whose chrome is a slightly different black than its
body looks broken in a way that is hard to name.

## Markdown

[marked](https://marked.js.org) for parsing, [gray-matter] for
frontmatter. Neither renders anything: marked is used as a *lexer*, and
the token tree is walked into React elements by this template's own code.

[gray-matter]: https://github.com/jonschlinkert/gray-matter

## Colour

Original to this template. A cool near-white page, a near-black with a
faint blue cast, and a saturated violet.

The page is deliberately not pure white — documentation is read at length
and a fractionally grey ground is easier over a few thousand words. The
violet is the one hue no other template in the fleet uses; the others have
claimed indigo, amber, rust, green, cerulean, teal and ember.

Code blocks are dark on a light page, which is what nearly every real
documentation site does, because it separates "this is prose" from "this
is something you paste" without needing a border to say so.

## Everything else

The Rookery wordmark and favicon are drawn as inline SVG. There are no
third-party assets, no icon fonts and no illustration libraries.
