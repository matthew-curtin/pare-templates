# Restaurant booking

A site for a fictional wood-fired restaurant in Bristol called
**Coppice**, with a working reservation flow. Six routes: home, menus,
booking, private dining, about and visit.

The fleet's first **booking** template. Everything you would need to
turn it into a real restaurant's site is here except a back end.

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
| `/` | The room, the fire, what is on this week |
| `/menu` | Dinner, lunch and drinks — `?m=lunch` picks one |
| `/book` | The reservation flow |
| `/private-dining` | Three spaces, and an enquiry form |
| `/about` | The story, the people, the suppliers |
| `/visit` | Getting here, opening hours, questions |

## How it's organised

```
src/
  app/          One folder per route
  components/   Header, footer, the booking flow, the enquiry form
  content/      All the words, prices and hours
  lib/          Availability
```

**Content is separate from presentation.** Every dish, price, opening
time and answer lives under `src/content/`. Components read from it and
never hardcode a sentence.

## The booking flow

The part worth understanding before you change it.

- **Every step lives in the URL.** Party size, date, service, time and
  step are all search parameters. That is what makes the browser's back
  button work through the flow, lets a half-finished booking survive a
  refresh, and turns "here, this time on Friday" into a link you can
  send someone. It costs nothing over component state.
- **Availability is derived, never listed.** `src/lib/availability.ts`
  computes which times are free from the date, the service and the party
  size. A hand-written table would go stale the moment anyone edited a
  service and would run out at the end of whatever range someone thought
  to fill in.
- **It is deterministic.** The same request always gives the same
  answer, so the page does not reshuffle when React re-renders and a
  reload does not silently free up the table you were about to lose.
  There is no randomness in that file.
- **Availability shrinks as the party grows, and never the reverse.**
  The party size is part of the *threshold*, not of the hash. Putting it
  in the hash re-rolls every slot independently for each size, so a
  table for six can come up free at a time a table for two cannot —
  which is nonsense, and obvious to anyone who changes the number and
  watches the grid.
- **The step is not trusted.** It arrives from the URL, so
  `?step=confirmed` with nothing chosen falls back to the first step
  rather than rendering a confirmation for a booking nobody made. Party
  size is clamped the same way.
- **The reference is derived from the booking**, so reloading the
  confirmation shows the same code rather than issuing a new one.

Nothing is submitted anywhere. Both the booking and the private-dining
enquiry validate, then say plainly that nothing was sent.

## Making it yours

1. `src/content/site.ts` — name, address, opening hours, services and
   their times, closures, and the date the calendar starts from.
2. `src/app/globals.css` — the `@theme` block holds every colour and font.
3. `src/content/menus.ts` — the food and the prices.
4. `src/content/about.ts`, `visit.ts`, `private-dining.ts` — the rest.

## Notes

- **The calendar starts from a fixed date**, `site.today`, not the real
  clock, so the first bookable day is always a Wednesday and the
  template reads the same whenever it is opened. Point it at
  `new Date()` when you make this real.
- **Two closures are in the data on purpose.** Without them the
  "nothing available" state never appears, and a state nobody has ever
  looked at is a state nobody has ever checked.
- **`/book` renders on the client.** `useSearchParams` requires it, and
  Next requires a Suspense boundary around it — without one the build
  fails rather than warning. The fallback is shaped like the real thing
  so the page does not jump.
- **`/menu` is server-rendered on demand** because it reads a search
  parameter. It ships no JavaScript of its own; the menu switcher is
  three links.
- The telephone number is inside the range Ofcom reserves for drama and
  examples, so it cannot ring a real person.

Coppice, its people, its suppliers and every booking made here are
invented. Nothing on this site talks to a server.
