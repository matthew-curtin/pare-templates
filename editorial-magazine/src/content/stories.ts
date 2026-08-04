import type { Story } from "./types";

/**
 * Every story in the magazine. The article page, the home page, the
 * section indexes and the archive all read from this one array.
 *
 * Order here is the order stories appear in the archive, newest first.
 * Exactly one story carries `featured: true`.
 *
 * All of it is invented — the towns, the people, the quotes and the
 * numbers. See the footer and the README.
 */
export const stories: Story[] = [
  {
    slug: "the-city-that-learned-to-flood",
    title: "The City That Learned to Flood",
    dek: "For forty years Nieuwhaven spent everything it had keeping the North Sea out. Then it built a square that fills up on purpose.",
    section: "cities",
    author: "ada-fenwick",
    date: "2026-07-22",
    readingMinutes: 18,
    image: "/images/stories/harbour.jpg",
    imageAlt:
      "A harbour at dusk, cranes and moored boats reflected in flat water",
    imageCredit: "Photograph by Elke Roos for Meridian",
    featured: true,
    body: [
      {
        type: "paragraph",
        text: "The first thing Marjan Voss wants you to understand about Wilhelmsplein is that it is a square. Not a reservoir with paving on it, not a basin dressed up as public space — a square, with a tram stop and a bad coffee kiosk and a chess table that is always occupied by the same two men. It is only a reservoir eleven or twelve days a year, and even then only for a few hours, and even then people stand at the railings and watch it happen as though it were weather rather than infrastructure. Which, she points out, is exactly the idea.",
      },
      {
        type: "paragraph",
        text: "Nieuwhaven sits four metres below the sea at its lowest point, on ground that was water until somebody decided otherwise in 1602. For most of the twentieth century the city's relationship with that fact was straightforward and expensive: build the wall higher. Every decade or so the wall went up, and every decade or so a storm arrived that had not read the design brief.",
      },
      {
        type: "paragraph",
        text: "In 1998 a surge came over the eastern defences and put two metres of water through eleven hundred ground floors in a night. Nobody drowned. The clean-up took fourteen months and cost more than the entire defence programme of the preceding twenty years. When the review committee reported, it did something unusual for a review committee: it questioned the premise.",
      },
      {
        type: "heading",
        text: "Somewhere for it to go",
      },
      {
        type: "paragraph",
        text: "The argument the committee made has since been made in a hundred cities, but in 1999 it was close to heresy. Water that comes over a wall has to go somewhere. If you have not decided where, it decides for you, and it will choose the places where people keep their possessions. The alternative is not a higher wall. The alternative is to choose the somewhere yourself, in advance, and to make it a place you do not mind losing for an afternoon.",
      },
      {
        type: "quote",
        text: "We stopped asking how to keep the water out. We started asking where we would like it to be.",
        attribution: "Marjan Voss, city engineer, Nieuwhaven",
      },
      {
        type: "paragraph",
        text: "Wilhelmsplein was the first. It is a shallow bowl, about the area of two football pitches, dropped a metre and a half below the surrounding streets and reached by broad stepped terraces on three sides. On an ordinary Tuesday the terraces are where people eat lunch. In a surge, sluices open under the tram platform and the bowl takes on nine thousand cubic metres of the harbour, which is roughly the volume that used to end up in the basements of the Kastanjestraat.",
      },
      {
        type: "figure",
        image: "/images/stories/harbour-detail.jpg",
        alt: "Wet granite setts catching a low, raking light",
        caption:
          "The terraces are laid in granite setts rather than concrete: cheaper to lift and relay when the silt has to come out.",
      },
      {
        type: "paragraph",
        text: "The engineering is not the difficult part. Voss is blunt about this. Any competent hydraulic engineer can design a basin. What took eleven years was the other thing — persuading a city that a square which floods is not a broken square.",
      },
      {
        type: "heading",
        text: "The politics of a wet afternoon",
      },
      {
        type: "paragraph",
        text: "The objections arrived in a predictable order, and Voss can still recite them. It will smell. It will be unusable. It will flood when we do not want it to. Property values on the square will collapse. Somebody's child will drown in it.",
      },
      {
        type: "list",
        items: [
          "It does smell, for about two days afterwards, of harbour.",
          "It is unusable roughly eleven days a year, which is fewer days than it rains hard enough to empty the terraces anyway.",
          "It has never filled unintentionally; the sluices are mechanical and require a decision by two people.",
          "Property values on the square are now the highest in the district, which surprised everybody including Voss.",
          "Nobody has drowned. The fill takes forty minutes and is preceded by a siren that the whole district can hear.",
        ],
      },
      {
        type: "paragraph",
        text: "The property-value result is the one that gets quoted in conference papers, usually as evidence that resilient design pays for itself. Voss thinks the causation runs the other way and says so at every opportunity. The square did not become desirable because it floods. It became desirable because the city spent eleven years and a great deal of money making it the best-designed public space in Nieuwhaven, and the flooding was the excuse.",
      },
      {
        type: "quote",
        text: "If you want to build something well, find a reason nobody can argue with. Ours was the sea.",
        attribution: "Marjan Voss",
      },
      {
        type: "paragraph",
        text: "There are six of them now — Wilhelmsplein, two smaller basins in the eastern districts, a sunken sports pitch, a park at Havenkade that takes the largest volume of all, and, most recently and most contentiously, a stretch of the ring road that closes and fills. Together they hold about a fifth of what a severe surge puts over the defences. The wall is still there. It is simply no longer expected to do the job alone.",
      },
      {
        type: "paragraph",
        text: "On the afternoon I visited, the chess table was occupied. Neither man looked up when I asked whether it bothered them, the square filling. One of them said that it was good for the paving, which I have not been able to verify with anybody. The other said he had lost a sofa in 1998 and this arrangement suited him better.",
      },
    ],
  },
  {
    slug: "nine-minutes-to-the-sea",
    title: "Nine Minutes to the Sea",
    dek: "A single tram extension put the coast within reach of the people who clean its hotels. Then the rents followed.",
    section: "cities",
    author: "jonah-mbeki",
    date: "2026-06-18",
    readingMinutes: 14,
    image: "/images/stories/tram.jpg",
    imageAlt: "A tram waiting at a platform in low evening light",
    imageCredit: "Photograph by Nuno Aires for Meridian",
    body: [
      {
        type: "paragraph",
        text: "Before the extension opened, getting from Alvorada to the beach at Praia Norte took an hour and ten minutes and two changes, or forty minutes and about a fifth of a shift's wages in a shared taxi. After it opened, it took nine minutes and cost the same as any other ride in the city. This is a story about what those nine minutes were worth, and to whom.",
      },
      {
        type: "paragraph",
        text: "Alvorada is where a large share of the coast's hotel staff live: housekeepers, kitchen porters, the people who set out four hundred sun loungers before seven in the morning. For thirty years they commuted to a beach they could not practically visit on a day off, because the journey ate the day.",
      },
      {
        type: "heading",
        text: "What the line was for",
      },
      {
        type: "paragraph",
        text: "The extension was not built for them. The published case was tourism — reduce car traffic on the coast road, move visitors from the old town to the beach hotels. The Alvorada stop was added late, at the insistence of a single councillor, and appears in the original modelling as a rounding error.",
      },
      {
        type: "quote",
        text: "The line was designed to bring people to the sea. It was not really designed to bring these people to the sea.",
        attribution: "Beatriz Antunes, transport researcher",
      },
      {
        type: "paragraph",
        text: "In the first summer, ridership at Alvorada ran at four times the modelled figure. It was not commuters — the commuting flow was already there and already counted. It was weekends. Families, in the late afternoon, going to the beach.",
      },
      {
        type: "figure",
        image: "/images/stories/coast.jpg",
        alt: "An empty stretch of coastline in flat afternoon light",
        caption:
          "Praia Norte on a Tuesday in May. In August the same frame holds about nine hundred people.",
      },
      {
        type: "heading",
        text: "And then the arithmetic",
      },
      {
        type: "paragraph",
        text: "Three years on, advertised rents in Alvorada are up by a little over half, against nineteen per cent for the city as a whole. The listings mention the tram in the first line. Antunes has been tracking the composition of the neighbourhood and puts it plainly: the extension made Alvorada a place worth living for people who had never previously considered it, and those people can outbid the people already there.",
      },
      {
        type: "paragraph",
        text: "None of which is an argument against the tram. Antunes is emphatic on this point, because she has watched her research get quoted as one. The nine minutes are real, and they were a genuine gift to about eleven thousand households. The problem is that a transport intervention arrived on its own, into a housing market with no rent regulation and very little new supply, and did the only thing it could have done under those conditions.",
      },
      {
        type: "quote",
        text: "A tram cannot build flats. We keep being surprised by this.",
        attribution: "Beatriz Antunes",
      },
      {
        type: "paragraph",
        text: "On the platform at Alvorada in late June, the four-fifteen was standing room. Two women in hotel uniform, off shift, both carrying folded beach chairs. One of them told me she had moved to a flat two stops further out in March, and now takes eighteen minutes to the sea instead of nine, and considers this a fair trade for eighty euros a month.",
      },
    ],
  },
  {
    slug: "the-quietest-street-in-the-city",
    title: "The Quietest Street in the City",
    dek: "Nairobi measured every street it had, then asked what the quiet ones had in common. The answer was not money.",
    section: "cities",
    author: "sam-oduya",
    date: "2026-05-30",
    readingMinutes: 11,
    image: "/images/stories/street.jpg",
    imageAlt: "A narrow residential street lined with mature trees",
    imageCredit: "Photograph by Wanjiru Kamau for Meridian",
    body: [
      {
        type: "paragraph",
        text: "The survey took two years and produced, among a great deal else, a single map that has been arguing with the city ever since. It shows average night-time sound pressure across eleven thousand street segments, in a gradient from pale to near-black. The dark parts are loud. Most of the map is dark.",
      },
      {
        type: "paragraph",
        text: "The expectation, going in, was that the pale streets would track income. They partly do. But the correlation is weaker than anybody predicted, and the pale streets include several in districts with no money at all — which is the finding that made the map interesting rather than merely confirmatory.",
      },
      {
        type: "heading",
        text: "Four things quiet streets share",
      },
      {
        type: "paragraph",
        text: "Dr Achieng Otieno, who ran the survey, lists them in order of effect size, and is careful to note that only the first is expensive.",
      },
      {
        type: "list",
        items: [
          "They are not through-routes. Nothing crosses them that is not going to them.",
          "They have a continuous canopy — mature trees on both sides, meeting overhead.",
          "The buildings are set back at least four metres, and the setback is planted rather than paved.",
          "Ground floors are residential or closed at night. One late bar undoes everything above it.",
        ],
      },
      {
        type: "quote",
        text: "Three of the four are decisions somebody made in about 1970 and nobody has undone. That is the whole finding, really.",
        attribution: "Dr Achieng Otieno",
      },
      {
        type: "paragraph",
        text: "The canopy result is the one that has travelled furthest. Trees do less acoustically than people assume — a mature street canopy is worth perhaps three decibels, which is real but modest. What the canopy does more powerfully is change what the remaining sound is like. Leaves scatter high frequencies, and high frequencies are the ones people report as intrusive. A street at fifty-two decibels under trees is described by residents as quiet. The same street at fifty-two decibels with the trees removed is described as loud.",
      },
      {
        type: "paragraph",
        text: "Otieno has spent three years trying to get this distinction into policy and has mostly failed, because the regulation is written in decibels and decibels do not capture it. Her current proposal is a canopy target rather than a noise target — simpler to specify, cheaper to enforce, and it happens to deliver shade in a city that will need a great deal more of it by 2050.",
      },
      {
        type: "paragraph",
        text: "The quietest street in the survey is in Jericho, and it is not much to look at. Two rows of low houses, deep verges, a canopy so complete that the road surface is dappled at noon. Forty-one decibels at two in the morning. Nobody planned it. The trees were planted by residents over about a decade, for shade.",
      },
    ],
  },
  {
    slug: "the-last-foundry-on-the-river",
    title: "The Last Foundry on the River",
    dek: "A bell is a machine with one moving part and a four-hundred-year service life. Only eleven people left know how to tune one.",
    section: "craft",
    author: "toma-ishikawa",
    date: "2026-05-02",
    readingMinutes: 16,
    image: "/images/stories/foundry.jpg",
    imageAlt: "Molten metal pouring in a dark workshop, sparks rising",
    imageCredit: "Photograph by Inés Caballero for Meridian",
    body: [
      {
        type: "paragraph",
        text: "A bell has one moving part, and strictly speaking the bell is not it. The clapper moves; the bell rings. Everything that makes a bell good or bad was decided before it ever left the foundry, in the shape of a curve that has been refined for about eight hundred years and can still be got wrong by a millimetre.",
      },
      {
        type: "paragraph",
        text: "There were nine foundries on this stretch of river in 1890. There is one. It employs fourteen people, casts between six and eleven bells a year, and has a waiting list running to 2029.",
      },
      {
        type: "heading",
        text: "Five notes at once",
      },
      {
        type: "paragraph",
        text: "The thing that makes bell-founding difficult, and the reason it did not industrialise, is that a bell does not produce a note. It produces at least five, from different parts of its body, and they must be in tune with each other or the bell sounds wrong in a way most listeners cannot name but all of them notice.",
      },
      {
        type: "list",
        items: [
          "The hum, an octave below the nominal, from the thickest part near the mouth.",
          "The prime, at the nominal, from the waist.",
          "The tierce, a minor third above — the note that makes bells sound melancholy.",
          "The quint, a fifth above.",
          "The nominal itself, from the rim, which is the note you think you are hearing.",
        ],
      },
      {
        type: "paragraph",
        text: "Getting five partials into tune simultaneously is not a matter of tuning five things. They are all consequences of one shape. Move metal to correct the tierce and the quint moves too, in a direction that takes years to learn to predict.",
      },
      {
        type: "quote",
        text: "You are not tuning a note. You are tuning a curve, and the notes are what the curve says back to you.",
        attribution: "Elsa Bergström, head founder",
      },
      {
        type: "figure",
        image: "/images/stories/lathe.jpg",
        alt: "A close view of metal shavings curling from a lathe tool",
        caption:
          "Tuning is subtractive: metal comes off the inside on a vertical lathe, and cannot go back on.",
      },
      {
        type: "paragraph",
        text: "Bergström has been doing it for twenty-six years and describes the first eight as more or less useless. She can now hear a partial three or four cents out, which is well under half of what most trained musicians reliably detect, and she does this in a room with a lathe running.",
      },
      {
        type: "heading",
        text: "The eleven",
      },
      {
        type: "paragraph",
        text: "By her own count there are eleven people in Europe who can tune a bell to cathedral standard. Four are over sixty-five. The foundry has taken on two apprentices in the last decade; one is still here.",
      },
      {
        type: "paragraph",
        text: "This is the point at which a story like this usually turns elegiac, and Bergström refuses to let it. The craft is not dying, she says, it is small — which is a different condition and has been the normal one for most of its history. Nine foundries on this river was the anomaly, a product of a century in which every parish in the country was building or rebuilding a church tower.",
      },
      {
        type: "quote",
        text: "We do not need nine foundries. The bells last four hundred years. Nine foundries was always going to end.",
        attribution: "Elsa Bergström",
      },
      {
        type: "paragraph",
        text: "What she does worry about is the waiting list, which is now long enough that a parish deciding today will not hear its bell until the current vicar has probably retired. Long lead times put customers off, fewer customers means less work, less work means fewer apprentices. It is the ordinary arithmetic of a shrinking trade, and it does not require anybody to lose interest in bells.",
      },
    ],
  },
  {
    slug: "two-hundred-coats",
    title: "Two Hundred Coats",
    dek: "Urushi dries in humidity, hardens for decades, and cannot be hurried. Ryo Nakamura has been finishing the same cabinet since 2019.",
    section: "craft",
    author: "toma-ishikawa",
    date: "2026-04-14",
    readingMinutes: 13,
    image: "/images/stories/lacquer.jpg",
    imageAlt:
      "Dark polished wood grain, the surface catching a low horizontal sheen",
    imageCredit: "Photograph by Inés Caballero for Meridian",
    body: [
      {
        type: "paragraph",
        text: "Urushi is the sap of a tree, and it does not dry. It cures, by an enzymatic reaction that requires warmth and a relative humidity somewhere between seventy and eighty-five per cent. Left in a dry room it will stay tacky indefinitely. Put in a damp cupboard it will harden into a surface that resists acid, alkali, alcohol and about four hundred years.",
      },
      {
        type: "paragraph",
        text: "Nakamura's damp cupboard is called a furo, it is the size of a wardrobe, and it has been running at seventy-eight per cent since he inherited it.",
      },
      {
        type: "heading",
        text: "The arithmetic of a coat",
      },
      {
        type: "paragraph",
        text: "A coat of urushi is applied at a thickness measured in tens of microns. It goes into the furo for a day, sometimes two. It comes out and is polished back — much of what went on comes straight off, which is the part that surprises people. Then the next coat.",
      },
      {
        type: "quote",
        text: "People ask how long the drying takes. That is the wrong question. The drying takes a day. The waiting takes a decade.",
        attribution: "Ryo Nakamura",
      },
      {
        type: "paragraph",
        text: "The cabinet in the corner of his workshop has had, at the time of writing, a hundred and ninety-one coats. He began it in the spring of 2019. It is not late; it is a cabinet with a hundred and ninety-one coats on it, and that is simply how long that takes when the workshop is also producing the bowls and trays that pay for the electricity.",
      },
      {
        type: "list",
        items: [
          "Ground coats, on a fabric-and-clay foundation, to make the wood dimensionally irrelevant.",
          "Middle coats, each polished nearly flat, building a body with no visible substrate.",
          "Finishing coats, applied in a room he cleans for an hour beforehand, because one airborne fibre is a coat wasted.",
        ],
      },
      {
        type: "paragraph",
        text: "The hardening does not stop when the object leaves the workshop. Urushi continues to cross-link for decades; a piece is meaningfully harder at thirty years than at three, and its colour continues to clear. Nakamura has a tray made by his grandfather that has been getting slightly more transparent since 1961.",
      },
      {
        type: "paragraph",
        text: "This is, he points out, an unusual property for a manufactured object. Almost everything else we make begins deteriorating on completion. Lacquer improves for a human lifetime and then holds. He finds it steadying, and says it is the main reason he did not leave for industrial finishing work in his thirties, when he nearly did.",
      },
      {
        type: "quote",
        text: "I am making something that will be at its best when I am not here. That is not sad. It is the arrangement.",
        attribution: "Ryo Nakamura",
      },
    ],
  },
  {
    slug: "a-chair-that-outlives-you",
    title: "A Chair That Outlives You",
    dek: "In a workshop outside Oaxaca, a joint that needs no glue, no screw and no apology.",
    section: "craft",
    author: "ines-caballero",
    date: "2026-03-21",
    readingMinutes: 9,
    image: "/images/stories/workshop.jpg",
    imageAlt: "A long row of chisels laid out on a well-used workbench",
    imageCredit: "Photograph by Inés Caballero for Meridian",
    body: [
      {
        type: "paragraph",
        text: "The joint is a wedged through-tenon, and it is roughly as old as furniture. A tenon passes right through its mortise and out the other side; a wedge is driven into a saw kerf in the projecting end, spreading it so that the tenon can no longer withdraw. There is no glue in it. There does not need to be.",
      },
      {
        type: "paragraph",
        text: "Rosa Jiménez makes about forty chairs a year with them, in a workshop with a tin roof and a view of a car park. She is not a traditionalist and finds the framing irritating. She uses the joint because in this climate it is the joint that works.",
      },
      {
        type: "quote",
        text: "Glue is a promise about humidity. Here, that is not a promise anyone should make.",
        attribution: "Rosa Jiménez",
      },
      {
        type: "heading",
        text: "Wood does not stop moving",
      },
      {
        type: "paragraph",
        text: "Timber expands and contracts across the grain with moisture, and never stops, and a chair spends its life being pushed and pulled by a person who leans back. A glued joint resists that until it does not. A wedged tenon is a mechanical fit, and when the wood moves the fit changes slightly and the joint remains a joint.",
      },
      {
        type: "paragraph",
        text: "It also announces itself. The wedge is visible from the outside, usually in a contrasting timber, and Jiménez makes no effort to hide it. She regards a chair that conceals how it is held together as a chair that is expecting not to be repaired.",
      },
      {
        type: "figure",
        image: "/images/stories/chair-detail.jpg",
        alt: "A hand-shaped chair rail on a bench, its end left square",
        caption:
          "A back rail, shaped by hand. The end is left square until last: the tenon is cut once the curve has settled, not before.",
      },
      {
        type: "paragraph",
        text: "Two of her chairs have come back for repair in eleven years. Both had been reupholstered by somebody else, badly, and neither had a failed joint. She re-wedged them anyway, on the grounds that it took four minutes and she was already holding the mallet.",
      },
    ],
  },
  {
    slug: "the-orchard-that-moved-north",
    title: "The Orchard That Moved North",
    dek: "Apples have been walking north for thirty years. Greta Lindqvist went to meet the people walking with them.",
    section: "land",
    author: "greta-lindqvist",
    date: "2026-02-27",
    readingMinutes: 15,
    image: "/images/stories/orchard.jpg",
    imageAlt:
      "Rows of apple trees at sunset, a mown path running between them",
    imageCredit: "Photograph by Karin Möller for Meridian",
    body: [
      {
        type: "paragraph",
        text: "My grandfather planted Cox's Orange Pippin because that is what the county planted. By the time my father took the farm the Cox were splitting on the tree in wet Augusts, and by the time it came to me they were a hobby block kept for sentiment. We now grow varieties that were, within living memory, considered unviable this far north.",
      },
      {
        type: "paragraph",
        text: "This is not a story about a catastrophe. It is a story about a slow, mostly commercial migration that has been running for three decades, is visible in nursery order books before it is visible anywhere else, and has made some people a good deal of money.",
      },
      {
        type: "heading",
        text: "Chill hours",
      },
      {
        type: "paragraph",
        text: "An apple tree needs a certain accumulation of cold before it will flower properly — hours below about seven degrees, banked over winter. Too few and the blossom comes irregular and thin. Every variety has its own requirement, and the requirement is the thing that fixes a variety to a latitude.",
      },
      {
        type: "paragraph",
        text: "Winters here have lost, on the standard measure, something like a fortnight of chill accumulation since 1990. That is not enough to matter for a hardy variety with a low requirement. It is more than enough to matter for a variety sitting near its limit — which most commercial orchards were, because commercial growers plant as far south as they dare for the sugar.",
      },
      {
        type: "quote",
        text: "Every orchard in Europe was planted at the edge of what it could get away with. Then the edge moved.",
        attribution: "Petra Halvorsen, pomologist",
      },
      {
        type: "figure",
        image: "/images/stories/apples.jpg",
        alt: "Apples in a wooden crate set down in long grass",
        caption:
          "A variety trial block. Of nineteen varieties planted here in 2014, six are now in commercial production on the farm.",
      },
      {
        type: "paragraph",
        text: "Halvorsen's group has been running trials for eighteen years, which is roughly the minimum useful length for a question like this: an apple tree takes four to six years to bear properly and a decade to say anything reliable about yield.",
      },
      {
        type: "paragraph",
        text: "The results are not tidy. Some southern varieties have moved north and done well. Others have moved north and met a different problem — a late frost that the south does not get, a fungal pressure that follows the wet, a pollination window that no longer overlaps with anything else in the block. Roughly a third of what should have worked, on the chill-hour arithmetic alone, has not.",
      },
      {
        type: "heading",
        text: "The part nobody plans for",
      },
      {
        type: "paragraph",
        text: "The growers who have come through this well are, almost without exception, the ones who planted trial blocks in the 1990s for no better reason than curiosity. They had a decade of data before they needed it. The growers in trouble are the ones who did what the advice said, which was to plant the recommended variety for the region, and who now hold twelve thousand trees of something that no longer likes it here.",
      },
      {
        type: "quote",
        text: "The advice was right when it was written. That is the difficulty with advice about land.",
        attribution: "Petra Halvorsen",
      },
      {
        type: "paragraph",
        text: "My own trial block went in the year my father died, partly because I did not know what else to do that autumn. It is nineteen varieties, four trees each, and it is the reason I still have a farm. I would like to report that this was foresight. It was grief and a nursery catalogue.",
      },
    ],
  },
  {
    slug: "reading-a-field-by-its-weeds",
    title: "Reading a Field by Its Weeds",
    dek: "Every weed in a field is a sentence about the soil underneath it. Some farmers can read the whole paragraph.",
    section: "land",
    author: "greta-lindqvist",
    date: "2026-01-16",
    readingMinutes: 10,
    image: "/images/stories/field.jpg",
    imageAlt: "A field edge with tall grasses and wildflowers going to seed",
    imageCredit: "Photograph by Karin Möller for Meridian",
    body: [
      {
        type: "paragraph",
        text: "A weed is a plant growing where somebody would rather it did not, which makes it a category of opinion rather than botany. It is also, if you know the species, a fairly precise instrument. Plants are fussy. What grows tells you what the ground is like, and it tells you for free, continuously, without a laboratory.",
      },
      {
        type: "quote",
        text: "The field has been writing you a report every year of your life. Most people never learn to read it.",
        attribution: "Tomas Ek, agronomist",
      },
      {
        type: "heading",
        text: "A short vocabulary",
      },
      {
        type: "list",
        items: [
          "Horsetail in quantity: the drainage has failed, probably at depth, probably years ago.",
          "Sheep's sorrel spreading: acidity, and usually a lime application that stopped being made.",
          "Fat hen and chickweed thriving: high nitrogen, often the sign of a muck heap that used to sit there.",
          "Creeping thistle in patches: compaction, and the patches will map a tractor's turning circle.",
          "Moss through a ley: shade, wet, low fertility, or all three arriving together.",
        ],
      },
      {
        type: "paragraph",
        text: "Ek is careful to say that none of these is diagnostic on its own. Horsetail can also mean a field that was under water in 1953 and has never quite forgiven it. The reading comes from combinations, from quantity, and above all from change — what is there this year that was not there five years ago.",
      },
      {
        type: "paragraph",
        text: "He teaches a two-day course and says the second day is entirely about resisting the temptation to over-read. The failure mode of a newly enthusiastic farmer is to see one thistle and re-plan the drainage.",
      },
      {
        type: "paragraph",
        text: "The reason any of this matters commercially is timing. A soil test tells you where you are now, three weeks after you took the sample and paid for it. Weeds tell you where you are heading, this afternoon, for nothing. Ek has clients who have not stopped testing — he would not recommend it — but who now test where the field has already told them to look.",
      },
    ],
  },
  {
    slug: "salt-road",
    title: "Salt Road",
    dek: "The flats are the flattest surface on earth and the least forgiving. Twice a year, a convoy crosses them anyway.",
    section: "land",
    author: "ada-fenwick",
    date: "2025-11-08",
    readingMinutes: 12,
    image: "/images/stories/salt.jpg",
    imageAlt: "A vast white salt flat meeting a pale sky at the horizon",
    imageCredit: "Photograph by Elke Roos for Meridian",
    body: [
      {
        type: "paragraph",
        text: "There is no road. That is the first thing to understand about the salt road. There is a bearing, a set of waypoints that shift a little every year, and about forty people who know them.",
      },
      {
        type: "paragraph",
        text: "The flats are the flattest large surface on the planet — the variation across a hundred kilometres is under a metre — which makes them useful for calibrating satellites and almost useless for navigation. There is nothing to take a bearing from. In the dry season the horizon is a white line in every direction and the sky sits on it.",
      },
      {
        type: "heading",
        text: "Why cross at all",
      },
      {
        type: "paragraph",
        text: "Going around adds four hundred kilometres of mountain track and about three days. The convoy carries salt out and carries in everything the settlements on the far edge do not produce, which is nearly everything. Twice a year, at the end of each dry season, it is worth the risk.",
      },
      {
        type: "quote",
        text: "The danger is not the crossing. The danger is being wrong about the crust.",
        attribution: "Cirilo Mamani, convoy leader",
      },
      {
        type: "paragraph",
        text: "Beneath the salt is brine, and beneath the brine is mud. The crust in the dry season carries a loaded truck comfortably. In the wet it does not, and the transition is not gradual — a vehicle that breaks through sinks to the axles in a substance with the consistency of wet cement and the chemistry of a battery.",
      },
      {
        type: "figure",
        image: "/images/stories/salt-crust.jpg",
        alt: "The polygonal cracked pattern of a dried salt crust, running to the horizon",
        caption:
          "The polygons are a reliable sign of a crust that has dried fully. Their absence is the sign Mamani watches for.",
      },
      {
        type: "paragraph",
        text: "Mamani has led the convoy for nineteen years and has turned it back twice. Both times the sky was clear and the surface looked, to me, identical to every other part of it. He reads the polygon pattern, the sound under a boot heel, and a particular grey cast that appears where brine is close to the surface.",
      },
      {
        type: "paragraph",
        text: "He is training his niece, which involves walking, because the reading cannot be done from a cab at fifty kilometres an hour. They walk the first hour of each crossing.",
      },
      {
        type: "quote",
        text: "You cannot learn this quickly. There is no way to make the flats teach you faster than they want to.",
        attribution: "Cirilo Mamani",
      },
    ],
  },
];

/** Newest first — the order in the array. */
export function getStory(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function storiesInSection(sectionSlug: string): Story[] {
  return stories.filter((story) => story.section === sectionSlug);
}

export function storiesByContributor(contributorSlug: string): Story[] {
  return stories.filter((story) => story.author === contributorSlug);
}

export function featuredStory(): Story {
  // Falling back to the newest keeps every page rendering even if the
  // `featured` flag is removed while editing.
  return stories.find((story) => story.featured) ?? stories[0];
}
