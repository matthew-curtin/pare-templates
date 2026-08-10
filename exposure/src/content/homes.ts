import type { Home } from "./types";

/**
 * Six homes, and the whole content discipline of this template.
 *
 * Nothing here states a number that can be derived from another one.
 * Floor areas come out of the plan geometry, a home's size comes out of
 * its rooms, and every compass bearing comes out of the room's wall plus
 * the home's `northOffset` — so turning a house on its plot turns all of
 * its light with it, and the drawing and the figure beside it cannot
 * disagree. `scripts/check-sun.mjs` asserts that every declared wall is
 * genuinely on the perimeter of its floor, which is the one way a plan
 * edit could quietly invent a window in the middle of a house.
 *
 * They are tuned so every state the design can show is reached, and
 * reached about as often as it should be (§7b):
 *
 *   - Ferry Lane is the cheapest and has the best light, which is the
 *     argument the site exists to make.
 *   - Cassel Avenue is the most expensive, has the most glass, and its
 *     principal room takes no direct sun at all for five months. It has
 *     also been on the market longest, which is the only thing on this
 *     site that reads as an opinion.
 *   - Hollow Road faces south and is dark anyway, because the ridge
 *     behind it stands two degrees higher than the December sun climbs.
 *     Upstairs clears the ridge; downstairs does not.
 *   - Orchard Row's best room is a bedroom, because the ground floor's
 *     floor-to-ceiling glass looks at a wall thirty feet away.
 *   - Exactly one home has no obstruction of any kind, so that the
 *     survey's "nothing in the way" state is something a reader sees
 *     rather than something they take on trust.
 */

const linden: Home = {
  slug: "linden-street",
  address: "214 Linden Street",
  kind: "Foursquare, four bedrooms over two floors",
  northOffset: 0,
  price: 429000,
  built: 1910,
  beds: 4,
  baths: 2,
  listedDaysAgo: 23,
  mainRoomId: "kitchen",
  blurb:
    "A square, sensible house on a street of them, with the rooms in the places a 1910 builder put rooms. The front faces the street and the street faces north.",
  candid:
    "The two rooms you see from the door are the two darkest rooms in the house between November and February, which is a fair description of most houses on Linden. The back half is the opposite, and it is where the kitchen is — so the house works, but not in the order you meet it.",
  works: [
    "Storm windows on the north elevation are original and three of the seven do not seat.",
    "The east chimney was capped rather than removed and takes water in a driving rain.",
    "Knob-and-tube remains in the attic run. Not live, not removed.",
  ],
  floors: [
    {
      id: "ground",
      name: "Ground floor",
      rooms: [
        {
          id: "living",
          name: "Living room",
          x: 0,
          y: 0,
          w: 16,
          h: 16,
          wall: "n",
          glazing: 36,
          note: "Two tall sashes onto the porch, which takes a further four degrees off the sky.",
        },
        {
          id: "dining",
          name: "Dining room",
          x: 16,
          y: 0,
          w: 12,
          h: 16,
          wall: "e",
          glazing: 18,
          obstruction: {
            what: "216 Linden, gable end, thirty feet away",
            from: 60,
            to: 120,
            elevation: 22,
          },
        },
        {
          id: "kitchen",
          name: "Kitchen and back room",
          x: 0,
          y: 16,
          w: 17,
          h: 14,
          wall: "s",
          glazing: 32,
          note: "The room the house is actually lived in, and the reason it survives a north front.",
        },
        {
          id: "utility",
          name: "Utility",
          x: 17,
          y: 16,
          w: 11,
          h: 14,
          wall: "s",
          glazing: 8,
        },
      ],
    },
    {
      id: "upper",
      name: "First floor",
      rooms: [
        {
          id: "bed-main",
          name: "Principal bedroom",
          x: 0,
          y: 0,
          w: 16,
          h: 16,
          wall: "n",
          glazing: 22,
        },
        {
          id: "bed-two",
          name: "Second bedroom",
          x: 16,
          y: 0,
          w: 12,
          h: 16,
          wall: "e",
          glazing: 14,
          obstruction: {
            what: "216 Linden again, but this floor sees over the ridge of it",
            from: 60,
            to: 120,
            elevation: 13,
          },
        },
        {
          id: "bed-three",
          name: "Third bedroom",
          x: 0,
          y: 16,
          w: 17,
          h: 14,
          wall: "s",
          glazing: 18,
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 17,
          y: 16,
          w: 11,
          h: 14,
          wall: "s",
          glazing: 6,
        },
      ],
    },
  ],
  shots: [],
};

const orchard: Home = {
  slug: "orchard-row",
  address: "8 Orchard Row",
  kind: "New terraced house, two bedrooms over two floors",
  northOffset: 90,
  price: 515000,
  built: 2023,
  beds: 2,
  baths: 2,
  listedDaysAgo: 11,
  mainRoomId: "living",
  blurb:
    "Finished last year, glazed floor to ceiling at the front, and thirty feet of paved court between that glass and the row opposite.",
  candid:
    "The living room has twenty-one per cent of its floor area in glass and takes two hours of direct sun on the shortest day. The kitchen behind it has eight per cent and takes four and a half. That is not a paradox, it is the wall opposite: it stands thirty-four degrees above the living-room sill and eleven degrees above the bedroom window one floor up, which is why the bedroom gets a winter morning and the room below it does not. If you work from home, work upstairs.",
  works: [
    "Nothing structural. It is two years old.",
    "The court is unadopted and the row shares its resurfacing.",
    "No shading on the west elevation; the kitchen is uncomfortable on a July evening.",
  ],
  floors: [
    {
      id: "ground",
      name: "Ground floor",
      rooms: [
        {
          id: "living",
          name: "Living room",
          x: 0,
          y: 0,
          w: 20,
          h: 18,
          wall: "n",
          glazing: 76,
          obstruction: {
            what: "the row opposite, across the court",
            from: 40,
            to: 150,
            elevation: 34,
          },
          note: "Glazed sill to soffit across the full width.",
        },
        {
          id: "kitchen",
          name: "Kitchen",
          x: 0,
          y: 18,
          w: 20,
          h: 16,
          wall: "s",
          glazing: 26,
        },
      ],
    },
    {
      id: "upper",
      name: "First floor",
      rooms: [
        {
          id: "bed-main",
          name: "Principal bedroom",
          x: 0,
          y: 0,
          w: 20,
          h: 16,
          wall: "n",
          glazing: 26,
          obstruction: {
            what: "the row opposite, seen over from a floor up",
            from: 40,
            to: 150,
            elevation: 11,
          },
          note: "Sees over the row opposite, and gets the winter mornings the room below it does not.",
        },
        {
          id: "bed-two",
          name: "Second bedroom",
          x: 0,
          y: 16,
          w: 12,
          h: 18,
          wall: "s",
          glazing: 16,
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 12,
          y: 16,
          w: 8,
          h: 18,
          wall: "s",
          glazing: 5,
        },
      ],
    },
  ],
  shots: [],
};

const cassel: Home = {
  slug: "cassel-avenue",
  address: "1140 Cassel Avenue",
  kind: "1936 house with a 2023 rear extension",
  northOffset: 180,
  price: 689000,
  built: 1936,
  beds: 3,
  baths: 2,
  listedDaysAgo: 96,
  mainRoomId: "garden-room",
  blurb:
    "The extension at the back is the best-built room in this listing and the best-photographed room in the county. It faces due north.",
  candid:
    "We are not going to pretend the garden room is a bad room. It is a beautiful room — even, never glaring, and a painter would take it over anything else on our books. It is also the most generously glazed room in this listing and it takes no direct sun for a hundred and eighty-three days of the year. The front rooms face the sun and the houses across Cassel Avenue take the middle out of their winter, so on the shortest day there is no direct sun anywhere on the ground floor of this house between twenty to ten in the morning and twenty-five past twelve. The principal bedroom above them clears the roofline opposite and is the only room here with the sun in it through the middle of a midwinter day. Ninety-six days on the market is what happens when a house is photographed in June and viewed in November.",
  works: [
    "The extension's rooflight gaskets are on a ten-year cycle and are seven years in.",
    "The front rooms have never been rewired; the extension has its own consumer unit.",
    "The lawn does not drain and the extension threshold is level with it.",
  ],
  floors: [
    {
      id: "ground",
      name: "Ground floor",
      rooms: [
        {
          id: "sitting",
          name: "Front sitting room",
          x: 0,
          y: 0,
          w: 18,
          h: 14,
          wall: "n",
          glazing: 26,
          obstruction: {
            what: "1139 and 1141 opposite, across Cassel Avenue",
            from: 140,
            to: 220,
            elevation: 26,
          },
          note: "Small, panelled, painted a deep green by somebody who had given up on it. Faces the street, and the street faces the sun — but so do the houses on the other side of it.",
        },
        {
          id: "study",
          name: "Study",
          x: 18,
          y: 0,
          w: 12,
          h: 14,
          wall: "e",
          glazing: 12,
        },
        {
          id: "hall",
          name: "Hall and stair",
          x: 0,
          y: 14,
          w: 10,
          h: 6,
          wall: "w",
          glazing: 0,
          interior: true,
        },
        {
          id: "kitchen",
          name: "Kitchen",
          x: 10,
          y: 14,
          w: 20,
          h: 6,
          wall: "e",
          glazing: 14,
        },
        {
          id: "garden-room",
          name: "Garden room",
          x: 0,
          y: 20,
          w: 30,
          h: 14,
          wall: "s",
          glazing: 92,
          note: "Full-width glazing and two rooflights. The most generously glazed room in this listing and the darkest one in January.",
        },
      ],
    },
    {
      id: "upper",
      name: "First floor",
      rooms: [
        {
          id: "bed-main",
          name: "Principal bedroom",
          x: 0,
          y: 0,
          w: 17,
          h: 20,
          wall: "n",
          glazing: 24,
          obstruction: {
            what: "the houses opposite, seen over from a floor up",
            from: 140,
            to: 220,
            elevation: 15,
          },
          note: "Directly above the front sitting room and clear of the roofline opposite, so it holds the sun through the middle of a midwinter day while the room below it does not.",
        },
        {
          id: "bed-two",
          name: "Second bedroom",
          x: 17,
          y: 0,
          w: 13,
          h: 12,
          wall: "e",
          glazing: 12,
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 17,
          y: 12,
          w: 13,
          h: 8,
          wall: "e",
          glazing: 5,
        },
      ],
    },
  ],
  shots: [
    {
      file: "garden-room.jpg",
      roomId: "garden-room",
      month: 6,
      day: 12,
      hour: 11 + 5 / 60,
      lit: false,
      alt: "Two pale armchairs facing a wall of sliding glass doors onto a garden of mature trees and a herbaceous border. The light in the room is completely flat — no patch of sun anywhere on the carpet, and nothing casting a shadow on the paving outside.",
      job: "Shows what 'generously glazed and no direct sun' actually looks like, which is calm and rather beautiful. That is the complication the whole site exists to make legible: the objection to this room is not that it is dark, it is that it is dark in a way nobody photographs.",
      caption:
        "Nine days before the longest day of the year, at five past eleven in the morning. There is no shadow anywhere in this photograph because there is no sun in this room, and on 21 December there is none at any hour.",
    },
    {
      file: "january-sun.jpg",
      roomId: "bed-main",
      month: 1,
      day: 4,
      hour: 12 + 40 / 60,
      lit: true,
      alt: "A tall panelled room with a herringbone parquet floor in low winter light. A hard-edged rectangle of sun comes through a window on the right and falls across a bench and the floor. The trees outside are bare.",
      job: "The beam, in the season the site keeps arguing about — and on the same page as a photograph with none. Bare trees date it; the hard edge on the floor is what 'direct' means.",
      caption:
        "Twenty to one on 4 January, in the room directly above the front sitting room. That room has been in shade for nearly three hours by the time this was taken and will be for nearly three more.",
    },
  ],
};

const ferry: Home = {
  slug: "ferry-lane",
  address: "27 Ferry Lane",
  kind: "Single-storey ranch, two bedrooms",
  northOffset: 0,
  price: 338000,
  built: 1954,
  beds: 2,
  baths: 1,
  listedDaysAgo: 4,
  mainRoomId: "living",
  blurb:
    "Long, low, and turned so that the living side runs the full length of the south elevation. Nothing stands within two hundred feet of it in any direction.",
  candid:
    "This is the least expensive home on our books and the best lit by a wide margin, which is the whole reason the survey exists. It is also small, has one bathroom, and the kitchen was fitted in 1978. Light is not the only thing a house is for. It is simply the one thing nobody prices.",
  works: [
    "Kitchen is original and functional. It will not be to your taste.",
    "Single glazing throughout, on aluminium frames that conduct enthusiastically.",
    "Roof was stripped and re-felted in 2019; the rest is 1954.",
  ],
  floors: [
    {
      id: "ground",
      name: "Ground floor",
      rooms: [
        {
          id: "bed-main",
          name: "Principal bedroom",
          x: 0,
          y: 0,
          w: 17,
          h: 9,
          wall: "n",
          glazing: 18,
        },
        {
          id: "bed-two",
          name: "Second bedroom",
          x: 17,
          y: 0,
          w: 14,
          h: 9,
          wall: "n",
          glazing: 14,
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 31,
          y: 0,
          w: 15,
          h: 9,
          wall: "n",
          glazing: 6,
        },
        {
          id: "living",
          name: "Living room",
          x: 0,
          y: 9,
          w: 20,
          h: 17,
          wall: "s",
          glazing: 40,
          note: "Runs the width of the south side. Sun on the floor from breakfast to dusk on the shortest day of the year.",
        },
        {
          id: "kitchen",
          name: "Kitchen",
          x: 20,
          y: 9,
          w: 14,
          h: 17,
          wall: "s",
          glazing: 22,
        },
        {
          id: "dining",
          name: "Dining room",
          x: 34,
          y: 9,
          w: 12,
          h: 17,
          wall: "s",
          glazing: 18,
        },
      ],
    },
  ],
  shots: [
    {
      file: "south-side.jpg",
      roomId: "living",
      month: 5,
      day: 9,
      hour: 16 + 15 / 60,
      lit: true,
      alt: "Two low swivel chairs and a small round table in a bay window, with late-afternoon sun raking across bare floorboards and up the side of one chair. Green shrubs fill the window behind them.",
      job: "The cheapest house doing the thing the most expensive one cannot. It is also the only frame on this site where the sun is low and warm rather than overhead, which is what a south room looks like at the end of an afternoon rather than in the middle of one.",
      caption:
        "A quarter past four on 9 May. This room also has sun in it from sunrise to sunset on 21 December, which no other principal room on our books manages.",
    },
  ],
};

const mill: Home = {
  slug: "mill-court",
  address: "5 Mill Court",
  kind: "Top-floor conversion, one bedroom",
  northOffset: 45,
  price: 412000,
  built: 1889,
  beds: 1,
  baths: 1,
  listedDaysAgo: 47,
  mainRoomId: "main",
  blurb:
    "The upper floor of a grain mill, converted in 2016, standing at forty-five degrees to the street because the mill was built to the river and not to the road.",
  candid:
    "The main room faces north-west. In June that means nothing at all until ten to three and then six hours of it, ending at ten past nine — which is genuinely one of the best evenings in this town. In December it means seventy minutes, from ten to four until the sun goes. Every viewing we have ever done here has been in the morning, and the morning is the one part of the day this room has nothing to show you.",
  works: [
    "Single-aspect main room; there is no cross ventilation and it holds heat.",
    "The stair is the original mill stair and is steep enough to be a real consideration.",
    "Service charge covers the roof, which is slate and is due.",
  ],
  floors: [
    {
      id: "ground",
      name: "Top floor",
      rooms: [
        {
          id: "main",
          name: "Main room",
          x: 0,
          y: 0,
          w: 22,
          h: 24,
          wall: "w",
          glazing: 84,
          note: "Six original openings, widened on conversion, all in one wall.",
        },
        {
          id: "bed",
          name: "Bedroom",
          x: 22,
          y: 0,
          w: 12,
          h: 14,
          wall: "e",
          glazing: 16,
          obstruction: {
            what: "the mill's own north block, still standing",
            from: 95,
            to: 165,
            elevation: 32,
          },
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 22,
          y: 14,
          w: 12,
          h: 10,
          wall: "s",
          glazing: 4,
        },
      ],
    },
  ],
  shots: [
    {
      file: "one-wall.jpg",
      roomId: "main",
      month: 3,
      day: 21,
      hour: 17.5,
      lit: true,
      alt: "A run of tall steel-framed industrial windows down one side of a concrete and glazed-tile interior, with bare trees outside and hard afternoon sun striping the piers and the floor. Every opening in the frame is in the same wall.",
      job: "Single aspect, shown rather than stated. Every window in this room is in one wall, which is why its day begins when the sun comes round rather than when the sun comes up.",
      caption:
        "Half past five on the spring equinox. Direct sun reaches this room at one minute past four that day and not one minute earlier, which is the whole character of a single-aspect room facing north-west.",
    },
  ],
};

const hollow: Home = {
  slug: "hollow-road",
  address: "61 Hollow Road",
  kind: "Detached, four bedrooms over two floors",
  northOffset: 0,
  price: 455000,
  built: 1972,
  beds: 4,
  baths: 2,
  listedDaysAgo: 61,
  mainRoomId: "living",
  blurb:
    "South-facing across the whole of its long elevation, which is the first line of every listing this house has ever had. The ground rises behind it.",
  candid:
    "The ridge behind Hollow Road stands twenty-six degrees above the ground-floor windows. The sun here never gets above twenty-four and a quarter degrees in December. Those two numbers are the house: from half past ten until twenty to three on the shortest day, a home that faces due south is in shade, and then the sun comes back low and to the side for the last two hours. Nobody expects the middle of the day to be the dark part. The first-floor windows see the ridge five degrees lower, at twenty-one, which is just under where the sun gets to — so the principal bedroom takes nearly eight hours where the living room directly beneath it takes under five.",
  works: [
    "Ridge is mature woodland in third-party ownership. Assume it gets taller.",
    "1972 flat-roof section over the kitchen has been patched twice.",
    "Oil tank is above ground and out of date on its bund.",
  ],
  floors: [
    {
      id: "ground",
      name: "Ground floor",
      rooms: [
        {
          id: "dining",
          name: "Dining room",
          x: 0,
          y: 0,
          w: 18,
          h: 14,
          wall: "n",
          glazing: 20,
        },
        {
          id: "hall",
          name: "Hall",
          x: 18,
          y: 0,
          w: 14,
          h: 14,
          wall: "e",
          glazing: 8,
          obstruction: {
            what: "the ridge, from the ground floor",
            from: 150,
            to: 210,
            elevation: 26,
          },
        },
        {
          id: "living",
          name: "Living room",
          x: 0,
          y: 14,
          w: 18,
          h: 14,
          wall: "s",
          glazing: 34,
          obstruction: {
            what: "the ridge, from the ground floor",
            from: 150,
            to: 210,
            elevation: 26,
          },
          note: "Faces due south across the terrace, and straight into the hill.",
        },
        {
          id: "kitchen",
          name: "Kitchen",
          x: 18,
          y: 14,
          w: 14,
          h: 14,
          wall: "s",
          glazing: 22,
          obstruction: {
            what: "the ridge, from the ground floor",
            from: 150,
            to: 210,
            elevation: 26,
          },
        },
      ],
    },
    {
      id: "upper",
      name: "First floor",
      rooms: [
        {
          id: "bed-three",
          name: "Third bedroom",
          x: 0,
          y: 0,
          w: 18,
          h: 14,
          wall: "n",
          glazing: 16,
        },
        {
          id: "bath",
          name: "Bathroom",
          x: 18,
          y: 0,
          w: 14,
          h: 14,
          wall: "e",
          glazing: 5,
          obstruction: {
            what: "the ridge, from the first floor",
            from: 150,
            to: 210,
            elevation: 21,
          },
        },
        {
          id: "bed-main",
          name: "Principal bedroom",
          x: 0,
          y: 14,
          w: 18,
          h: 14,
          wall: "s",
          glazing: 22,
          obstruction: {
            what: "the ridge, from the first floor",
            from: 150,
            to: 210,
            elevation: 21,
          },
          note: "Two degrees of extra height, and a completely different winter from the room directly beneath it.",
        },
        {
          id: "bed-two",
          name: "Second bedroom",
          x: 18,
          y: 14,
          w: 14,
          h: 14,
          wall: "e",
          glazing: 14,
          obstruction: {
            what: "the ridge, from the first floor",
            from: 150,
            to: 210,
            elevation: 21,
          },
        },
      ],
    },
  ],
  shots: [
    {
      file: "the-ridge.jpg",
      roomId: "living",
      month: 12,
      day: 11,
      hour: 12.25,
      lit: false,
      alt: "A band of windows above a radiator, looking out at a dense stand of conifers and bare trees that fills the view to well above the head of the window. There is snow on the ground and the room itself is dark.",
      job: "Settles a claim that prose can only assert. The survey says a ridge stands twenty-six degrees above these windows; here it is, at midday in December, standing between a south-facing room and the sun.",
      caption:
        "A quarter past twelve on 11 December. Noon, a south-facing window, and no sun in the room — the trees in this photograph are the twenty-six degrees the survey keeps referring to.",
    },
  ],
};

export const homes: Home[] = [ferry, linden, orchard, mill, hollow, cassel];

export function homeBySlug(slug: string): Home | undefined {
  return homes.find((h) => h.slug === slug);
}
