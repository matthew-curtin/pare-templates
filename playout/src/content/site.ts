import type { NavItem, Shot } from "./types.ts";

export const station = {
  name: "Wren",
  frequency: "91.5",
  callsign: "Wren 91.5",
  licensee: "Cape Wren Community Broadcasting",
  town: "Cape Wren, Oregon",
  /** Stated so a reader knows what the clock means. Deliberately NOT
   *  used for a computation anywhere — see the note at the top of
   *  `src/lib/schedule.ts`. */
  timezone: "Pacific",
  strapline: "Ninety-one point five, from the ridge above the slip.",
  transmitter: "1.8 kW from Kestrel Ridge, 340 m above the bay",
};

/**
 * The pinned clock (§7b).
 *
 * Everything on this console renders against this one instant. Without
 * it the template read six months from now would show a day that ended
 * long ago, a playhead past the end of the log, and an on-air badge lit
 * over nothing.
 *
 * It is an integer number of seconds from midnight at the head of the
 * broadcast day, and there is no `Date` anywhere in this app. That is
 * stronger than pinning a timestamp: a pinned timestamp still renders
 * through the reader's timezone, and the same schedule then tells a
 * different story in Tokyo. Seconds cannot be shifted by anybody.
 *
 * 14:52:40 is chosen rather than convenient. It is seven minutes from a
 * junction, a record is playing, and the record after it is long enough
 * that the hour cannot make the junction however the host plays it —
 * which is the one state a console exists to show you.
 */
export const NOW = 14 * 3600 + 52 * 60 + 40;

/** Monday is zero. Used only to decide whether a spot's flight covers
 *  today, which is the one calendar question this app asks. */
export const WEEKDAY = 3;

export const today = "Thursday 12 February";

export const nav: NavItem[] = [
  { to: "/", label: "On air", hint: "What is going out, and what is next" },
  { to: "/day", label: "The day", hint: "Every hour, and what it lands on" },
  { to: "/library", label: "Library", hint: "The wheels, and when each record is free" },
  { to: "/shows", label: "Shows", hint: "The clocks the hours are built from" },
  { to: "/spots", label: "Underwriting", hint: "Who is owed what, counted from the log" },
  { to: "/rules", label: "Rules", hint: "What the library can actually hold" },
];

/**
 * PHOTOGRAPHY — direction, per CONVENTIONS §6.
 *
 *   "Working equipment under whatever light was already on. Nobody in
 *    frame, nothing staged, and every picture answers a question the
 *    page next to it has just asked."
 *
 * That last clause did most of the rejecting. A great photograph of a
 * microphone is not a photograph of anything this console claims, and
 * three otherwise good frames went back for exactly that reason.
 *
 * Faces stay out for the usual rule: the hosts here are invented, so a
 * real person's face under an invented name is a small lie on the page
 * and initials are the honest answer. It is a rule about people and it
 * stops there — the desk, the empty studio, the turntable and the mast
 * are all fair, and they are what the station actually is.
 *
 * There are four rather than five, and the missing one is the record
 * shelf. §6's rule about legible signage turns out to be fatal to that
 * subject: every honest photograph of a record library is a photograph
 * of other people's trademarks, and three strong candidates were
 * rejected for Frank Sinatra, Fleetwood Mac and a hand-lettered divider
 * card reading Queen. The reasoning is written up in CREDITS.md, because
 * an absence with a reason is the thing §6 actually asks for.
 */
export const shots: Record<string, Shot> = {
  desk: {
    file: "desk.jpg",
    alt: "A broadcast desk: two channel strips with CUE and ON buttons, one ON lit blue, faders below.",
    job: "Says what a row of the log IS. One of those ON buttons is lit and the one beside it is not, which is this whole console rendered in hardware — and it is the only place that connection gets made.",
    caption: "Studio A. One channel on, one cued and waiting. Every row in the log is one of these lighting up.",
  },
  night: {
    file: "night-studio.jpg",
    alt: "A studio table at night, four microphones on stands, headphones and cable coiled on it, chairs pushed in, blue light from the windows.",
    job: "Settles what 'automated' means, which the word does not. Ten at night until two there is nobody in this room — and the four hours the station is least accurate are exactly the four hours this photograph is true of.",
    caption: "Ten past ten. The machine is on air and everybody has gone home.",
  },
  stylus: {
    file: "stylus.jpg",
    alt: "A turntable stylus down in the groove of a spinning record, tonearm and platter edge in close-up.",
    job: "Makes the argument physical. A record is as long as it is, and no wheel can be asked for three and a half minutes of one — which is the whole reason an hour of records lands worse than an hour with a person in it.",
    caption: "However long it is, that is how long it is.",
  },
  mast: {
    file: "mast.jpg",
    alt: "A guyed lattice mast on a grassy hillside, antennas at the head, stay wires running out of frame against a bright sky.",
    job: "Explains why a junction cannot be moved. The hour ends when it ends because something at the top of this hands over, and no amount of good radio changes it.",
    caption: "Kestrel Ridge, 340 m above the bay. It does not wait for the back-announce.",
  },
};

export const footer = {
  fiction:
    "Wren 91.5, Cape Wren, the shows, the records, the artists and the underwriters are all invented. The scheduling arithmetic is not — it is the same arithmetic a real station lands an hour with.",
  note: "A template for Pare.",
};
