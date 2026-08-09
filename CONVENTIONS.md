# Template conventions

Rules every template in this repo follows. They exist so twenty
templates feel like one family, and so each one works properly inside
Pare. Read this before adding a template.

---

## 1. Pick the stack the job actually calls for

| Kind of site | Stack | Why |
| --- | --- | --- |
| Marketing, blog, docs, storefront, listings, booking | **Next.js** (App Router) | Public pages need to load fast and be readable by search engines, so they're pre-rendered |
| Dashboards, kanban, chat, feeds, anything behind a login | **Vite + React** | Nothing to pre-render; the simpler build is the right tool |

Both are React + TypeScript + Tailwind 4. Don't introduce a third
framework without a specific reason — Pare's element-to-source mapping
is built on React, and a non-React template would not be editable in the
app.

Create Next templates with the official CLI so the baseline is never
hand-rolled:

```bash
npx create-next-app@latest <name> --typescript --tailwind --eslint \
  --app --src-dir --use-npm --disable-git --yes
```

Then delete what it leaves behind: `public/*.svg`, `AGENTS.md`,
`CLAUDE.md`, and the default `page.tsx`.

Deleting `AGENTS.md` and `CLAUDE.md` is **not enough on Next 16.3+** —
it rewrites both into the project root every time the dev server
starts, so they come back and get committed. Turn the generator off:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  agentRules: false,
};
```

One thing not to bother with: Next collects anonymous telemetry by
default, and shipping a `.env` with `NEXT_TELEMETRY_DISABLED=1` does
**not** switch it off — Next reads the file too late for the CLI, which
still reports telemetry as enabled. `npx next telemetry disable` works
but is a per-machine setting, so it can't ride along in a template.
Mention it in the template README and leave it there.

---

## 2. Two rules that exist because of Pare

**The dev script must be a plain `next dev`.** No `--turbo`, no
`--turbopack`, and no `--webpack` either.

Pare instruments your source at build time — that's how ⌘-clicking an
element in the preview knows which file and line to edit. The hook it
uses is a webpack hook, and Turbopack ignores it. Pare handles this by
adding `--webpack` itself when it launches Next 16, but it *disables
instrumentation entirely* if it finds `--turbo` in your dev script,
because that reads as a deliberate opt-in it shouldn't override. Adding
`--webpack` yourself is harmless but redundant, and it means running the
template outside Pare behaves differently from every other one.

**Every template needs a `typecheck` script.** On a Next template:

```json
"typecheck": "tsc --noEmit"
```

On a **Vite** template the scaffold uses project references, and
`tsconfig.app.json` already sets `noEmit`, so the build-mode form is
the one that works:

```json
"typecheck": "tsc -b"
```

After Pare applies a change it runs the project's own typecheck and
rolls the change back if it broke something. No script, no safety net.

---

## 3. Content lives apart from presentation

Every template has `src/content/`, holding all copy and data as typed
modules:

```
src/content/
  types.ts        Every content shape, in one place
  site.ts         Name, tagline, navigation, footer
  <domain>.ts     features / pricing / posts / listings / ...
```

Components import from there and never hardcode a sentence. This is the
single most important convention in the repo, for three reasons: it's
how a real site is built, it makes "change the price of the second plan"
a one-line edit in an obvious place, and it means the same component can
be reused across templates with different data behind it.

Use plain typed TypeScript, not MDX or a markdown parser, unless the
template is *about* long-form content. Typed data needs no dependency, no
build step, and the editor catches a missing field immediately.

### Markdown for prose that varies, typed data for records that repeat

`docs-site` is the worked example, and it carries both on purpose. Its
documentation pages are markdown, because every page is a different shape
and prose wants to be written rather than filled in. Its API reference is
typed data, because ten endpoints with identical structure written as
markdown would make that structure a convention nobody enforces — and the
tenth endpoint would quietly end up laid out differently from the first.
As typed data the shape *is* the type, a missing field is a red squiggle,
and every record renders identically for free.

Derive everything you can from the files. In that template the sidebar,
the contents list, the previous/next links and the search index all come
from the markdown itself, so adding a page is adding a file. Exactly one
hand-maintained list remains — the order and labels of the groups — and a
folder not named in it is **skipped rather than appended**, so a scratch
directory cannot quietly appear in the navigation.

### Render markdown by walking the token tree, never through an HTML string

Ask the parser for tokens, not HTML, and map the token types you want onto
React elements by hand. No `dangerouslySetInnerHTML`, anywhere.

This is a stronger guarantee than parsing to HTML and sanitising
afterwards: every element that can appear on the page is one your renderer
explicitly names, so a token type with no case — including the `html`
token a raw `<script>` in a markdown file produces — has no path to a live
DOM element at all. It falls through to text, which React escapes, and
shows up as visible characters on the page. The same goes for syntax
highlighting: Shiki will return an HTML string, and `codeToHast` returns a
tree instead.

**Read what the parser's fields actually contain** before writing the
renderer, rather than inferring it from the type names. Two findings from
`marked` that are each invisible until they are wrong, and neither of
which the types tell you:

- **`.text` is not escaped, and entities are left exactly as authored.**
  `&amp;` in a source file stays `&amp;`. Handed to a browser as HTML that
  renders as `&`; handed to React it renders as five literal characters,
  so leaves need decoding. Other parsers — and other *versions* — escape
  this field instead, which needs the same fix for the opposite reason.
- **Every list item wraps its content in a token of type `text`**, not
  `paragraph`. A renderer that handles only `paragraph` silently drops to
  raw source and shows literal `**` inside list items.

Spend ten minutes dumping the token tree for a paragraph, a list, a table
and a code block first. Both of the above pass typecheck, lint and build.

---

## 4. Design tokens in one block

Every colour, font and radius goes in the `@theme` block at the top of
`globals.css`. Changing `--color-accent` should re-skin the whole
template. Never write a hex value inside a component.

Give each template its own palette and type — twenty sites that all look
like the same starter defeat the point. Vary the mood deliberately: some
light, some dark, some warm, some stark. That variety is also what
exercises Pare's Smart theme, which samples the page and dresses the app
chrome to match.

---

## 4b. Charts are validated, not eyeballed

Any template with charts picks its palette by **running the check**,
not by deciding the colours look different enough. Roughly one man in
twelve cannot tell some pairs apart, and it is not a judgement anyone
can make by eye.

The rules that have earned their place so far:

- **Assign categorical hues in a fixed order and never cycle them**, so
  an entity keeps its colour when a filter removes its neighbours.
- **One colour for nominal categories** (products, sources, teams).
  Shading them by size encodes the bar's length twice. A value ramp is
  only for genuinely ordered things — funnel stages, tiers, age bands.
- **One y-axis.** Two measures on two scales invent a correlation the
  data does not contain. Use two charts.
- **Every value must be readable as text**, and a tooltip is never the
  only way to read one. A table view is how you achieve that when the
  chart is the only place the value exists — which is the usual case,
  and why `analytics-dashboard` has a toggle on every card. It is not
  an end in itself: `project-tracker`'s roadmap writes each bar's name,
  stage and note on the page already, so a table twin of it would
  restate what is visible and earn nothing.
- **Axis ticks must be round numbers.** Picking a "nice" maximum is not
  enough — 75,000 split five ways gives 18,750. Choose the interval
  count that divides the maximum cleanly.

`analytics-dashboard` is the worked example; its `src/index.css`
records the exact validation commands and their results.

### The bar depends on whether the colour is carrying the meaning alone

A single threshold for every colour is either too strict for the
labelled ones or too slack for the unlabelled one. Price what the
colour is being asked to do:

- **Alone** — a bar, a rule, a dot with no words: it must be
  unmistakable, and 3:1 against both surfaces it touches (WCAG 1.4.11).
- **Beside its own name**: colour is the second cue, and the words are
  doing the work. It still needs separation from its neighbours, but it
  does not also have to be legible as text.

`support-inbox` is the worked example, and the split fell out of the
check rather than out of taste. Its four status pills are a soft tint,
a solid dot in the state's hue, and the name in ordinary ink — because
the amber that separates from red under deuteranopia is far too light
to read as text, and the amber that reads as text is **2.8** from red,
which is the same colour to about one man in twelve. Letting the dot
carry the hue and the ink carry the words satisfies both constraints at
once. Four palettes failed before that one passed.

The same reasoning splits greys that look like one job and are not.
`almanac` carries two: a rule between listings is **decoration**, and
1.4.11 does not reach it — it is about identifying controls and their
state, and a divider identifies nothing, so holding it to 3:1 would only
produce a page of heavy grey bars. The boundary of a text field is the
opposite: it *is* the control, so it owes the full ratio. Most palettes
use one grey for both and are wrong about the second. What the
decorative rule owes instead is being visible at all, which is a
perceptual claim rather than a WCAG one — ΔE 3, the just-noticeable
difference, since a rule under that is a layout with no rows in it.

The same template also keeps exactly one thing coloured for lateness.
Time merely running is the normal state of most of an inbox, so it is
plain muted text; only past the deadline is red. A treatment on every
row is not a warning — §7b again, arriving from the palette side.

### Commit the validator, do not just describe it

A palette nobody can re-measure is a claim rather than a property.
`support-inbox/scripts/check-colours.mjs` reads the tokens back out of
`src/index.css` and fails when they drift, so the reasoning in the
comments stays true to the values underneath it. Prefer that to citing
a tool the reader does not have — and run the checker before writing
the numbers into a comment, not after. It is very easy to write a
confident "last run" line describing a result you have not got yet.

## 5. Build interface, not screenshots

Product mockups, charts, dashboards and logos are drawn in **HTML, CSS
or inline SVG**, not shipped as images. They stay sharp at any size,
weigh nothing, and — the real reason — every part of them can be clicked
and edited in Pare. A screenshot is a dead end.

Use photographs for the things photographs are actually for: article
covers, team portraits, editorial imagery, product shots.

**That includes the favicon.** Draw it as an SVG and let the framework
pick it up — in Next that means `src/app/icon.svg`, which takes precedence
over the scaffold's `favicon.ico`. Known debt: every template before
`docs-site` still ships `create-next-app`'s default icon, byte for byte,
which is a small thing that reads as unfinished the moment anyone opens
two of them in adjacent tabs. Worth backfilling.

---

## 6. Images

- Source from [Pexels](https://www.pexels.com/license/) — free to use
  and modify, no attribution required.
- **Commit them.** Don't hotlink; templates must work offline.
- Download at roughly twice their display size — around 1400px wide for
  a full-width cover, 700px for a portrait — and let Next's image
  optimiser or a Vite plugin handle the rest.
- Budget about 1MB of imagery per template. The SaaS template uses
  748KB for eight photographs.
- List every photo in a `CREDITS.md`, even though attribution isn't
  required.
- Prefer generated avatars (initials) over stock headshots for
  testimonials — a real face attached to an invented quote sits badly.
- Re-encoding to save weight can make a file **bigger**. Stock images
  arrive already compressed, so asking `sips` for quality 68 when the
  source was nearer 50 re-encodes upward. Fetch a smaller width first;
  only then compress, and measure both ways.

**Look at every photograph, and write the words against the picture.**

Choose the image first and caption it second. Written the other way
round, the caption describes what you hoped to find — and it will be
wrong often enough to matter. In `restaurant-booking`, alt text drafted
before sourcing claimed a fire glowing at the end of a room that has no
fire in the frame, and a "roast chicken, skin blistered from the coals"
turned out to be a pale poached bird with no char on it at all.

The corollary, and the one that takes nerve: **when no photograph
matches the copy, change the copy.** That template's menu says red
mullet rather than plaice because the good picture showed whole round
fish over coals and plaice is a flatfish. Editing one word of invented
content is free. Captioning the photograph "plaice" would have been a
small lie sitting on the page forever.

Two more things to check in the frame itself, because neither shows up
in a search result:

- **Legible signage.** A photo of a covered terrace was rejected from
  `restaurant-booking` for a large `PLECIDER MILL` sign across the back
  of it. §7 forbids real company names; a photograph is the easiest way
  for one to get in.
- **Whether it contradicts the surrounding claim.** `editorial-magazine`
  once illustrated a story arguing a joint needs no screws with a
  close-up of a metal screw.

---

## 7. Everything is fictional, and says so

Invent the company, the people, the quotes and the numbers. Say
plainly in the footer and the README that it isn't real. Never use a
real company's name, logo or trademark — customer logo rows are
rendered as invented wordmarks in plain text.

Write the copy properly. Placeholder lorem ipsum makes a template
useless for judging a design, and worthless for testing whether an edit
landed sensibly.

---

## 7b. Tune the invented numbers so the design can be judged

Inventing the data plausibly is not enough — it has to be tuned so
that every state a design has is **visible, and in the right
proportion**. A state that is meant to be exceptional has to be
exceptional in the data.

The worked example is `project-tracker`. Its first set of team
capacities left all six people over capacity, at 116% load. Every
number was defensible on its own and the page was useless: the amber
"over capacity" treatment was on every card, so it read as the normal
state rather than as a warning, and the whole thing looked like broken
data rather than a busy team. Adjusting the capacities so exactly one
person is over made the feature legible in one glance.

So, when the data is finished, look at each state the UI can show and
ask which of these it is:

- **Never reached** — the empty state, the over-limit warning, the
  error. Dead code as far as anyone can tell. Arrange for at least one.
- **Always reached** — the warning that fires on every row. It stops
  reading as a warning.
- **Reached about as often as it should be.** This is the target.

The same applies to a full column and an empty one, an unassigned
item, a long title that has to truncate, and a person with nothing on.
`project-tracker` deliberately holds one column over its limit, one
column empty under a filter, several unassigned issues and one person
with nothing in flight, for exactly this reason.

Sometimes the honest way to reach a state is to put it in the content
rather than tune the numbers until it appears. `restaurant-booking`
carries two closures — a private hire and a night the fire is being
relined — because otherwise no date in the booking calendar is ever
fully unavailable, and its "nothing free" state would never be seen by
anyone, including whoever wrote it.

### Pin the clock, and the timezone with it

Any template whose content is a story in time needs a fixed "now" in
`site.ts` that everything renders against. Without one, a template read
six months after it was written shows an inbox where everything
breached days ago, or a booking calendar with no future in it — a
different design from the one anyone intended.

Pinning the instant is only half of it. `support-inbox` pins the
display **timezone** too, because its conversations are a fixed story:
a firmware update lands overnight, someone writes in first thing, a
colleague adds a note mid-morning. Rendered in the reader's timezone
that story survives in London and falls apart everywhere else — the
same message reads 02:00 in California and 18:00 in Tokyo, so the
working day the content describes never happens. A real product wants
the opposite, which is worth saying in a comment next to the constant.

Two riders. Assert it with the machine's `TZ` set to something else
(`TZ=Asia/Tokyo node scripts/check-sla.mjs`), or the test agrees with
the bug on your laptop. And **"today" is a calendar question, not an
elapsed one**: snoozing until tomorrow morning at 14:20 lands 19 hours
out, and a `delta < 24h` test called that "today at 09:20" — a sentence
about a moment five hours in the past. Compare day keys in the display
timezone.

### Derived data has to preserve the orderings a user can compare

When the data is computed rather than listed, the relationships between
its answers are part of the design, and users check them by changing one
input and watching.

`restaurant-booking` computes which tables are free from a hash of the
date, the service and the time, compared against a threshold that falls
as the party grows. The first version hashed the party size **too** —
which re-rolled every slot independently for each size, so a table for
six came up free at times a table for two could not. Every individual
answer was defensible; the set of them was nonsense, and one click
between "2" and "6" showed it.

So decide what must hold as each input moves — bigger party never has
more choice, a later date never has less, a busier night never has more
— and make it structurally true rather than probably true.

### The column the reader scans must be the column the sort used

A list that displays one number and orders by another looks broken even
when it is right, and there is no way for the reader to discover which
half to trust. `almanac` produced this twice in one afternoon, from
opposite directions, and both were only visible by looking at the page.

Its "highest paid" sort keys on what a job actually pays, which for a
part-time post is not the figure on the advert. Showing the advertised
band in the headline — defensible, since it is what the employer
published — made the column read £27,600, then £38,626, then £24,404.
Every row was in the right place and the page was unusable. Swapping
them fixed it and lost nothing: the advertised figure is still there,
one line down, attributed to the employer, which is where a misleading
number belongs.

The other direction was a paid promotion lifted to the top of a board
whose sort control said "Closing soonest", above a vacancy closing that
afternoon. Featured listings now get a labelled strip above the board
and appear again in their proper place below. **A list must obey its own
sort** however well the promotion pays — and the pinning came out of the
comparator entirely, which also made it simpler.

Both of these pass every check that does not involve reading the page.

---

## 8. Before committing a template

```bash
npm run typecheck   # must pass
npm run lint        # must pass
npm run build       # must pass
npm run dev         # then click through every route
```

For Next templates, also run `npx next dev --webpack` once and confirm
it starts — that's the exact command Pare will use, and it's the one
path that a normal `npm run dev` won't exercise.

Look at the result in a browser before calling it done. A build can pass
while the page is visibly broken; the first version of the SaaS
template's bar chart compiled, typechecked and rendered nothing, because
a percentage height inside a flex column has no parent height to resolve
against and silently collapses to zero. **Compute pixel heights for
anything chart-shaped, and always look at the page.**

Then check every route at 375px wide and confirm
`document.documentElement.scrollWidth` equals `clientWidth`. A page
that scrolls sideways on a phone is the most common defect in this
repo and the easiest to miss on a laptop. Two causes account for
nearly all of it:

- **A flex or grid child will not shrink below its content.** A wide
  table inside an `overflow-x-auto` wrapper still pushes the page out
  unless that wrapper has `min-w-0` — the horizontal twin of the
  `min-h-0` rule that vertical scrollers need. Both `project-tracker`'s
  backlog table and its team cards needed it.
- **`sr-only` positions absolutely.** With no positioned ancestor, a
  visually-hidden label inside a horizontally scrolled container
  resolves against the page instead and lands hundreds of pixels off
  to the right. Give its parent `relative`.

And drive the interactions rather than assuming them, because the
interesting bugs are not visible in a screenshot: `project-tracker`'s
drag committed to the last pointer *move* rather than the pointer
*release*, so a quick flick dropped the card a column short — correct
in every slow test and wrong every time it mattered.

**Put `noValidate` on any form whose errors you have designed.** The
browser validates `type="email"` and friends before a submit handler
ever runs, so a form that styles its own error messages will mostly show
a native bubble instead — one that looks nothing like the page and
cannot be positioned. It also makes the handler's own branches
unreachable, so they go untested and then wrong. `almanac`'s two forms
both opt out and own their messages.

### Grep every route for unrendered markup

Fetch each page and search the HTML for the signatures of markup that did
not render: a literal `**`, a literal backtick, a double-escaped entity.
Strip `<pre>` blocks first, since all three are legitimate inside code.

Work out the *bug's* signature rather than the symptom's. A correctly
rendered apostrophe already serialises to `&#x27;`, so searching for that
matches every healthy page; the defect is the **double** escape,
`&amp;#x27;`. Get this wrong and the check passes either way.

It found a real one in `docs-site`: parameter descriptions on the
reference page rendered their `backticked` terms, and the libraries page
printed the same kind of string raw, because the helper that did the work
was local to the first page. Nothing errored — the second page just had
stray punctuation in it, which reads as a typo in the content rather than
a missing component.

**Strip `<script>` as well as `<pre>`, and strip the tags too.** Next's
RSC flight payload is embedded in a script tag on every page and is full
of the literal string `"$undefined"`, so an undefined-check over raw HTML
flags all 43 routes and tells you nothing. Same class of mistake as
searching for the symptom instead of the bug: a check that fires
everywhere has not found anything. Reduce each page to its visible text
first — drop `<pre>`, drop `<script>`, then drop the remaining tags —
and search that.

### Measure the layout; do not read it off the screenshot

The preview pane composites its own way, and it will show you a header
that stops short of the right edge, or a column that looks off-centre,
when `getBoundingClientRect` says both are exactly right. It has now been
wrong twice in one template. When something looks misaligned, ask the DOM
for the numbers before changing any CSS — otherwise you fix a bug that
does not exist and introduce one that does.

The reverse also happens: a click can look like it did nothing because
React had not committed yet. Read state in a *separate* call from the one
that triggered it, or await a tick first.

### Check the measuring context before believing the measurement

The rule above says to trust the DOM over the screenshot. The trap on
the other side is trusting a number taken from a context that is not
laid out at all — and that number arrives looking perfectly precise.

A thread in `support-inbox` would not open scrolled to its newest
message, and the effect reported the element as **26,458px tall** with
nothing overflowing it: exactly what a stylesheet arriving late would
look like. A confident explanation of Vite's dev-mode CSS injection got
written into a code comment on the strength of that one number. The
real cause was that the pane's `window.innerWidth` was **0**, so no
`lg:` rule matched and the whole document laid out unconstrained.
Reloading into a real viewport showed the original two-line effect had
been right the entire time.

So before drawing a conclusion from a layout number, ask the document
whether it is in a fit state to answer — `innerWidth`, `innerHeight`,
and whether a breakpoint you expect is actually applying. A zero there
means throw the measurement away, not that you have found something.
The tell for this class of mistake is a fix that keeps growing — a
timer, then an observer, then a fallback — while the symptom never
moves.

**The same trap has a green-tinted twin: a check that can pass on an
empty document.** Measuring all fourteen `almanac` routes at 375px by
fetching each one and `document.write`-ing it into an off-screen iframe
reported no overflow anywhere, in about a second, and was worthless —
`document.write` never produced a real document, and an empty page never
overflows. Setting `iframe.src` instead loads it properly.

Whenever a layout check comes back clean, make it prove the page was
there: assert something that could only be true if the CSS applied — a
computed background, a known colour, an element that only exists in the
real markup. `headerBg: "none"` is what the false pass looked like;
`rgb(19, 27, 43)` is what the real one looked like.

### If the environment cannot drive it, extract the part that can be wrong

The pane renders with the document hidden, which means `scroll` events,
`requestAnimationFrame` and `IntersectionObserver` **do not fire at all** —
verified, not assumed. No scroll-driven feature can be tested end to end
there, whatever you implement.

So separate the decision from the machinery that triggers it. In
`docs-site` the contents list asks `pickActiveHeading(positions, marker)`,
a pure function in its own zero-import module, and that function can be
checked against a list of numbers in a plain node script — including the
two cases the obvious implementation gets wrong (two short sections
visible together, and one long section with no heading on screen at all).
The wiring around it stays untested, but the wiring is not the part that
is going to be wrong.

The same reasoning applies to any logic sitting behind an input you cannot
generate: parsing, ordering, formatting, threshold decisions. Pull it out
into something you can call directly.

Node strips types out of a `.ts` file on its own, so these scripts import
the *real* module rather than a copy that drifts — with an explicit `.ts`
in the specifier, which node needs and TypeScript accepts. On a Next
template add `"type": "module"` to `package.json` as well, or every run
prints a `MODULE_TYPELESS_PACKAGE_JSON` warning above the results; the
Vite scaffold sets it already. It does not affect the build.

---

## 9. Registering it

Add an entry to `manifest.json` and a row to the table in `README.md`.
The manifest is what a future template picker inside Pare will read.
