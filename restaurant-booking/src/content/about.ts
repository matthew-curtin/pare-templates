import type { Person, Supplier } from "./types";

/** The story, as paragraphs. Rendered in order on /about. */
export const story: string[] = [
  "Coppice started in 2021 as a fire in a yard behind a hardware shop, cooking one thing a night for thirty people who had booked by replying to an email. It was supposed to run for a summer.",
  "We took the room on Colston Yard the following spring, largely because it already had a chimney. Everything else about it was wrong — thirty-four covers, a kitchen the size of a corridor, and no gas — and it turned out those constraints were the whole point. One fire means one menu. A short menu means we can buy properly.",
  "So the menu is written on a Tuesday, after the week's growers have said what they actually have, and it stays up until the following Tuesday. Sometimes a dish lasts a fortnight. Occasionally something comes off on a Friday because we ran out, and we would rather that than buy in something worse.",
  "We are not doing anything new. Cooking over wood is the oldest way there is, and every restaurant we learned it from is still better at it than we are. What we can promise is that the fire is lit at eleven every morning, and that nobody here will describe your food to you for longer than a sentence.",
];

export const people: Person[] = [
  {
    name: "Rosalind Achebe",
    role: "Chef and co-owner",
    initials: "RA",
    bio: "Cooked at St John and then for six years in Copenhagen before deciding she missed hedgerows. Lights the fire.",
  },
  {
    name: "Milo Trevaskis",
    role: "Co-owner, front of house",
    initials: "MT",
    bio: "Was going to be an archaeologist. Runs the room, writes the wine list, and answers the phone more often than he should.",
  },
  {
    name: "Nadia Berkoff",
    role: "Head chef",
    initials: "NB",
    bio: "Grew up in her family's bakery in Sheffield, which is why the sourdough is the way it is.",
  },
  {
    name: "Tam Okonjo",
    role: "Sommelier",
    initials: "TO",
    bio: "Keeps a list of about forty bottles and can tell you where every one of them was grown, at length, if you let him.",
  },
];

export const suppliers: Supplier[] = [
  {
    name: "Tamar Valley Growers",
    what: "Tomatoes, courgettes, leaves",
    where: "Cornwall, 90 miles",
  },
  {
    name: "Brixham day boats",
    what: "Plaice, mackerel, crab",
    where: "Devon, 80 miles",
  },
  {
    name: "Creedy Carver",
    what: "Chicken and duck",
    where: "Devon, 75 miles",
  },
  {
    name: "Hill & Sons",
    what: "Longhorn beef, hogget",
    where: "Somerset, 30 miles",
  },
  {
    name: "Ashley Hill allotments",
    what: "Honey, gluts, hedgerow fruit",
    where: "Bristol, 2 miles",
  },
  {
    name: "Wraxall coppice",
    what: "Oak and ash, seasoned two years",
    where: "Somerset, 12 miles",
  },
];
