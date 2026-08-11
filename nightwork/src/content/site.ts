/**
 * The company, and the words that are not about any one show.
 *
 * NO PINNED CLOCK, and that is a decision rather than an omission.
 * CONVENTIONS §7b requires one of any template whose content is a story
 * in time — but the only time here is time WITHIN a display, measured in
 * tenths from its own start, so every instant on this site is already
 * fixed by construction. Nothing is dated: the shows are described by
 * occasion rather than by date, precisely so that no page can go stale
 * and no `Date` is needed to render one. `scripts/check-show.mjs`
 * asserts that no `Date` appears anywhere in `src`.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const SITE = {
  name: "Nightwork",
  legalName: "Nightwork Display Ltd",
  tagline: "Display design and firing, Northumberland",
  /** The sentence under the wordmark on every page. */
  standfirst:
    "We write displays and we fire them. Six on this site, with the whole script of each one published — every shell, what it cost, when it broke and when it actually left the ground, which are not the same moment.",
  where: "The old sand quarry, Ulgham, Northumberland",
  founded: "Trading since 2009",
  licence: "Licensed for professional display use under the Explosives Regulations 2014",
  email: "office@nightwork.example",
  phone: "01670 496 0113",
} as const;

export const NAV: readonly NavItem[] = [
  { href: "/shows", label: "Shows" },
  { href: "/shells", label: "Shells" },
  { href: "/colour", label: "Colour" },
  { href: "/sites", label: "Sites" },
  { href: "/commission", label: "Commission" },
];

/**
 * The front page's three claims. The WORDS live here; every number in
 * them is computed at render time from `src/content/` through
 * `src/lib/ballistics.ts`, so none of these can drift away from the
 * data by being edited in one place and not the other.
 *
 * All three were written AFTER running the model, and two of them are
 * not what was going to be written before it ran. The intended second
 * claim was that blue is the most expensive light in the trade; the
 * arithmetic says green is, because a ring shell is priced for its
 * geometry rather than its brightness. The intended third claim was
 * that one show fires before its announced start; it is five of six.
 */
export const CLAIMS = [
  {
    id: "delay",
    title: "You do not design the sky. You design the delays.",
    body: "A shell has to climb before it can do anything, and a big one climbs for much longer than a small one. So three shells that break at the same instant were fired at three different times, and the further apart in size they are, the further apart in time they go. The cue sheet a crew works from does not look like the show an audience sees. This site draws both, and lets you flip between them.",
  },
  {
    id: "start",
    title: "Most of our shows begin before they begin.",
    body: "The announced start is when the audience should see something. A twelve-inch shell takes 6.3 seconds to get where it is going, so if it is meant to open the show it has to leave the ground first. Five of the six displays here have a cue with a negative time on it, and on the fell the mortar is audible more than two seconds before anybody sees a light.",
  },
  {
    id: "gold",
    title: "Every show you have ever seen was mostly gold, for a reason.",
    body: "Colour in a firework is a metal salt burning at a temperature it can only just survive. Copper makes blue and falls apart above 1200°C, so a blue star has to burn cool, which means burning dim — you pay about twice as much for roughly a quarter of the light. Charcoal glowing at 1700 kelvin is cheap, bright and indestructible. That is the whole economics of the trade in three sentences.",
  },
] as const;

export const ABOUT = {
  heading: "What a display company actually does",
  paragraphs: [
    "Almost none of the work is on the night. A display is a document — a list of moments, each one a shell, a height and an instant — and writing it is the job. The firing is four hours of setup, eleven minutes of watching a screen, and two days of taking mortars out of the ground.",
    "The reason this site publishes its scripts is that nobody else does, and the effect of nobody doing it is that clients ask for the wrong things. They ask for bigger, when what they want is faster. They ask for more colours, when the colour they have in mind costs four times what they think and reads as grey from where they will be standing. A cue sheet with prices on it settles those conversations in about a minute.",
    "We are nine people, three of whom are also the crew, and we fire between fourteen and twenty displays a year from five licensed sites. We do not sell fireworks and we do not do weddings in July, when it does not get dark until half past ten and nobody stays.",
  ],
} as const;

export const FOOTER_NOTE =
  "Nightwork is an invented company. The displays, the sites, the clients, the prices and the people are all fictional. The chemistry, the ballistics and the safety distances are real, because the arithmetic on this site only means anything if they are.";

/** The commission form. Errors are designed, so the form sets noValidate. */
export const COMMISSION = {
  heading: "Commission a display",
  standfirst:
    "Four questions, and the last one is the only one that matters. We will come back with a shape and a price before we write a cue.",
  budgetOptions: [
    { value: "under-3", label: "Under £3,000", note: "A village-scale show. Two, three and four-inch shells, six to eight minutes." },
    { value: "3-8", label: "£3,000 to £8,000", note: "Six-inch shells become affordable, and a proper finale becomes possible." },
    { value: "8-15", label: "£8,000 to £15,000", note: "Ten and twelve-inch, given the ground for them. Fourteen minutes if you want it." },
    { value: "over-15", label: "Over £15,000", note: "Ask us what is possible rather than telling us what you want." },
  ],
  groundOptions: [
    { value: "unknown", label: "I do not know yet" },
    { value: "under-100", label: "Less than 100 metres to the nearest spectator" },
    { value: "100-200", label: "100 to 200 metres" },
    { value: "over-200", label: "More than 200 metres" },
  ],
} as const;
