# Support inbox

A customer support helpdesk for a fictional speaker company called
**Thornbury Audio**, built on a tool called **Parley**. Six routes: the
inbox, a conversation, contacts, one contact, saved replies and
settings.

The fleet's first template you mostly *write in* rather than read.
Replying, assigning, snoozing, tagging and editing a saved reply all
work, and the list re-sorts and re-counts as they do.

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
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Types only, no output |
| `npm run lint` | oxlint |

Two extra checks, both plain node and both worth running after editing
the content or the palette:

```bash
node scripts/check-sla.mjs      # the rules, and the data they act on
node scripts/check-colours.mjs  # the palette, under three dichromacies
```

## What's in here

| Route | Page |
| --- | --- |
| `/` | The inbox — saved filters, search, sorting, bulk actions |
| `/c/:id` | One conversation — the thread, the customer, the composer |
| `/contacts` | Everyone who has bought something |
| `/contacts/:id` | One customer and their history |
| `/macros` | Saved replies, editable in place |
| `/settings` | The promises, the statuses, the team, the tags |

Keyboard: `j` and `k` move down and up the list, `/` jumps to search,
`⌘↵` sends.

## How it's organised

```
src/
  components/   The shell, the row, the thread, the composer, the chips
  content/      Everything the app says, as typed data
  lib/          The store, the rules, the formatting
  pages/        One file per route
scripts/        The two checks
```

## The parts worth understanding

**The clock is the whole app.** Every plan carries a promise — Pro is
two hours, Free is twenty-four — and a conversation is late or it is
not. That single rule decides what turns red, what sorts to the top,
and what the settings page is for.

Which message starts that clock is the only genuinely subtle thing
here, and it lives alone in `lib/sla.ts` with no imports so it can be
run directly by the checker:

- It starts at the **first** unanswered message, not the most recent.
  Someone who writes twice has been waiting since the first time.
- Only a **reply** stops it. An internal note is a message to a
  colleague and does not answer anybody — which is why #4118 sits there
  overdue with a thoughtful note attached to it.
- **Resolved** and **snoozed** have no clock. Those are decisions
  somebody made about when to look again.

`lib/filters.ts` is separated for the same reason: a comparator that is
not a total order reshuffles rows on every render, and a search that
needs its words in order finds nothing for a reasonable query.

**Status colour is a dot, not text.** A pill is its soft tint, a solid
dot in the state's hue, and the name in ordinary ink. That split came
out of running `scripts/check-colours.mjs` rather than from taste: the
amber that separates from red under deuteranopia is far too light to
read as text, and the amber that reads as text is the same colour as
red to roughly one man in twelve. Letting the dot carry the hue and the
ink carry the words satisfies both. The first four palettes written for
this template failed that check, one of them by a margin of 2.8.

**Only one thing is coloured for lateness.** Time merely running is the
normal state of most of an inbox, so it is plain muted text; past the
promise is red, and it is the one place in the app where a colour
appears with no words beside it — a rule down the left edge of the row.
Nothing else draws an edge rule, so that red competes with an empty
margin rather than with the pills.

**Nothing persists.** Every action changes the app in memory only, and
reloading puts `src/content/` back exactly as it was. A basket should
survive a refresh because it is the user's; these conversations are the
template's *content*, and content a stray storage entry can override
has stopped being editable.

## Notes

- **Times are shown in the workspace's timezone, not yours.** The
  conversations are a fixed story — a firmware update lands overnight,
  someone writes in first thing, a colleague adds a note mid-morning.
  Rendered in the reader's timezone that story survives in London and
  falls apart everywhere else: the same message reads 02:00 in
  California and 18:00 in Tokyo, so the working day it describes never
  happens. Building a real product on this? Drop `ZONE` in
  `lib/format.ts` and it follows whoever is reading.
- **The data is tuned, not sprinkled.** Exactly one conversation is
  past its promise, two are close to it, two are unassigned, one thread
  is eight messages and another is one, one subject is far too long,
  one teammate has nothing assigned and one customer has never written
  in. Every one of those is a state the design has to show, and
  `scripts/check-sla.mjs` asserts all of them so an edit cannot quietly
  leave six conversations overdue, or none.
- **A conversation opens at its newest message** on desktop, because
  that is the one needing an answer. On a phone the page scrolls rather
  than the thread, and it opens at the top — the subject, the status
  and the assignee are worth seeing first on a narrow screen.
- **Filters live in the query string**, so a filtered view is a URL you
  can refresh, share, or step back through.
- **Selecting rows and then filtering them away clears the selection.**
  Otherwise narrowing to one row and pressing Resolve resolves the nine
  you can no longer see.

Thornbury Audio, Parley, the team, the customers, the conversations and
every order number in them are invented. No address resolves and
nothing here talks to a server.
