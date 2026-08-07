# Documentation site

Developer documentation for a fictional webhook delivery service called
**Rookery**. Six routes: home, the documentation itself, an HTTP API
reference, client libraries and a changelog.

The fleet's first template built on a **markdown pipeline**. Documentation
pages are `.md` files with frontmatter; the sidebar, the contents list,
the previous/next links and the search index are all derived from them.

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
| `npm run start` | Serve the production build |
| `npm run typecheck` | Types only, no output |
| `npm run lint` | ESLint |

## What's in here

| Route | Page |
| --- | --- |
| `/` | What it is, and the same request in five languages |
| `/docs` | Every page, grouped |
| `/docs/[...slug]` | The documentation — eleven pages from markdown |
| `/reference` | Ten HTTP endpoints, with parameters and responses |
| `/sdks` | Four client libraries |
| `/changelog` | Releases, also markdown |

## How it's organised

```
src/
  app/          One folder per route
  components/   Header, sidebar, contents list, search, the renderers
  content/
    docs/       The documentation, as markdown
    changelog/  Release notes, as markdown
    *.ts        Everything else, as typed data
  lib/          Reading and parsing; two pure helpers
```

## The markdown pipeline

The part worth understanding before you change it.

**Markdown is rendered by walking the parser's token tree into React
elements.** There is no `dangerouslySetInnerHTML` anywhere in this
template, and nothing ever becomes an HTML string. That is a stronger
guarantee than parsing to HTML and sanitising afterwards: every element
that can appear on a page is one `components/markdown.tsx` explicitly
names. A token type with no case — including the `html` token that a raw
`<script>` in a markdown file produces — has no path to a live DOM
element. It falls through to text, which React escapes, so it appears on
the page as visible characters.

The same applies to syntax highlighting. Shiki will return an HTML string;
this uses `codeToHast` and walks the tree, for the same reason.

**Two things about the parser's tokens** are worth knowing, because both
are invisible until they are wrong, and neither is inferable from the type
names:

1. `.text` is **not** escaped, and entities are left exactly as authored.
   `&amp;` in a source file stays `&amp;`. Given to a browser as HTML that
   renders as `&`; given to React it renders as five literal characters.
   Hence `decodeEntities` on every leaf.
2. **Every list item wraps its content in a token of type `text`**, not
   `paragraph`. A renderer that only handles `paragraph` silently drops to
   raw source and shows literal `**` inside list items.

**Adding a page** means adding a markdown file. The group folder decides
which section it appears in, `order` in the frontmatter decides where, and
the sidebar, contents list, previous/next links and search index all
follow. The one hand-maintained list is `docGroups` in
`src/content/site.ts`, which sets the order of the groups and their
labels; a folder not named there is skipped rather than appended, so a
scratch directory cannot quietly turn up in the navigation.

```markdown
---
title: Rate limits
description: What happens when you go too fast.
order: 5
---

## The limits
```

**Heading ids are computed once** — in `lib/docs.ts`, written onto the
token — and read by both the heading and the contents list. Deriving the
slug in two places would work right up until one of them changed, and a
contents link that scrolls to the wrong place looks like a design problem
rather than a string problem.

## Markdown or typed data?

Both are here on purpose, and the split is the point.

- **Markdown for prose that varies.** Every documentation page is a
  different shape, and prose wants to be written, not filled in.
- **Typed data for records that repeat.** The API reference is ten
  endpoints with identical structure. As markdown that structure would be
  a convention nobody enforces, and the tenth endpoint would quietly end
  up laid out differently from the first. As typed data the shape *is* the
  type, a missing field is a red squiggle, and all ten render identically
  for free.

## Notes

- **Two pure modules in `lib/` have no imports on purpose.**
  `pickActiveHeading` decides which section you are reading, and
  `decodeEntities` handles the entity mismatch above. Both are the only
  parts of their features that can be *wrong*, and everything around them
  — scroll position, layout, the browser's event loop — is exactly what
  cannot be driven in a test. Separating the decision from the machinery
  that triggers it means the decision can be checked with a list of
  numbers.
- **The contents list uses a scroll listener, not an
  IntersectionObserver.** The observer is the usual choice, but it reports
  elements crossing a threshold, and the question here is "which heading
  is furthest down the page while still above the fold" — which needs all
  their positions. Tracking whatever is currently intersecting picks
  arbitrarily when two short sections are visible together, and picks
  nothing at all when one long section fills the window.
- **Syntax highlighting never reaches the browser.** Every code sample is
  highlighted on the server; the language tabs and the copy button are the
  only client components involved, and they receive the finished markup as
  children.
- **The copy button degrades rather than failing.** The clipboard API needs
  a secure context, so it is simply absent over plain HTTP — a colleague
  opening your dev server by LAN address, for instance. It falls back, and
  then says "Press ⌘C" rather than opening a blocking dialog.
- **Search is substring matching over an index built at build time.** A
  fuzzy matcher earns its keep over thousands of entries; over a few dozen
  headings it mostly produces confident wrong answers.
- **Next collects anonymous telemetry by default.** Shipping a `.env` with
  `NEXT_TELEMETRY_DISABLED=1` does not switch it off — Next reads the file
  too late for the CLI. `npx next telemetry disable` works, but it is a
  per-machine setting, so it cannot ride along in a template.

Rookery, its API, its libraries, its release history and every key and
identifier in these pages are invented. None of the URLs resolve and
nothing here talks to a server.
