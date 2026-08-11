import type { Photo } from "./types";

/**
 * The photographs, and what each one is FOR.
 *
 * THE DIRECTION, per CONVENTIONS §6, which every frame below had to
 * pass before it was downloaded:
 *
 *   the plant at the moment it is worth the walk — close enough that
 *   ONE thing is the subject, no people, and never a photograph of
 *   "a garden".
 *
 * The last clause did the work and cost three otherwise handsome
 * candidates. A wide shot of a lawn with shrubs round the edge is what
 * every garden's website is made of, and it cannot say anything this
 * site's arithmetic has not already said better. Each frame here has one
 * subject and settles one claim.
 *
 * `week` is the week the frame claims to show, and it is asserted:
 * `scripts/check-season.mjs` looks up the accession that carries the
 * photograph and fails if it is not actually above the bar that week.
 * A photograph quietly captioned into the wrong month is exactly the
 * kind of error that survives every other check in the repo, because
 * nothing about the page looks broken.
 *
 * Six things in this collection have NO photograph, and that is a
 * decision rather than a gap — see CREDITS.md. The tile falls back to a
 * flat field of the plant's own colour, which for the blue poppy is
 * arguably the more honest picture: its own note says the colour comes
 * out purple on every camera ever made.
 */
export const photos: Photo[] = [
  {
    key: "magnolia",
    file: "magnolia.jpg",
    alt: "Pink magnolia flowers wide open on bare branches, seen from below against a clear blue sky.",
    job: "Settles the site's central claim in one frame: this happens on bare wood, above your head, before anything in the garden has a leaf on it.",
    week: 11,
  },
  {
    key: "bluebells",
    file: "bluebells.jpg",
    alt: "A carpet of bluebells running back between straight grey trunks in a broadleaf wood.",
    job: "The only thing in the collection nobody planted, and the reason the first week of May is worth the drive on its own.",
    week: 18,
  },
  {
    key: "snowdrops",
    file: "snowdrops.jpg",
    alt: "A dense mass of snowdrops in full flower, heads down, packed shoulder to shoulder.",
    job: "Quantity, not a single flower — the note claims four hundred metres of path edged from one lifted clump, and a portrait of one snowdrop would contradict it.",
    week: 6,
  },
  {
    key: "witchhazel",
    file: "witchhazel.jpg",
    alt: "Pale yellow, strap-petalled witch hazel flowers clustered directly on a bare grey branch.",
    job: "February, on bare wood, with nothing else out. This is the frame that makes the winter half of the argument credible rather than merely stated.",
    week: 3,
  },
  {
    key: "bark",
    file: "bark.jpg",
    alt: "Bark peeling away from a trunk in thin translucent sheets, cream over rust.",
    job: "Twenty weeks of interest with no flower anywhere in it — the case that a garden in January is not empty, only differently occupied.",
    week: 2,
  },
  {
    key: "mimosa",
    file: "mimosa.jpg",
    alt: "Pale yellow mimosa pompoms massed along a branch of fine, ferny, grey-green leaves.",
    job: "Shows the foliage as well as the flower, which is the note's actual point — the plant is worth looking at for the eleven months it is not yellow.",
    week: 7,
  },
  {
    key: "camellia",
    file: "camellia.jpg",
    alt: "Pink camellia flowers open on a dark glossy bush, with tight buds behind them.",
    job: "Flowers and buds in the same frame, because the claim is that this one keeps going for ten weeks rather than peaking and browning.",
    week: 10,
  },
  {
    key: "ferns",
    file: "ferns.jpg",
    alt: "Tree ferns standing in mist, their fibrous trunks clear beneath the crowns.",
    job: "The trunk is the whole point: a hundred years of growth at two centimetres a year, and the reason these are alive here and dead forty miles inland.",
    week: 27,
  },
  {
    key: "gunnera",
    file: "gunnera.jpg",
    alt: "A single gunnera leaf filling the frame, its ribs and spines backlit, a path visible past it.",
    job: "Scale, which prose cannot do without sounding like a boast. The note says you can stand under one in a shower.",
    week: 30,
  },
  {
    key: "hydrangea",
    file: "hydrangea.jpg",
    alt: "A flat lacecap hydrangea head, dull mauve florets ringed with paler ray flowers.",
    job: "What actually carries late August here, and the proof that it is nothing like the mopheads in the village.",
    week: 34,
  },
  {
    key: "fuchsia",
    file: "fuchsia.jpg",
    alt: "Slim red and purple fuchsia flowers hanging in numbers along arching stems.",
    job: "Four months of flower on the most exposed ground in the garden — and the reason the worst week of the year is not completely empty.",
    week: 34,
  },
  {
    key: "acer",
    file: "acer.jpg",
    alt: "A Japanese maple in full scarlet, seen up into the canopy with the trunk dark behind.",
    job: "The one autumn plant here that does this every year rather than two years in three, which is the distinction the Arboretum page turns on.",
    week: 43,
  },

  // ── The areas ────────────────────────────────────────────────────
  {
    key: "hollow",
    file: "hollow.jpg",
    alt: "A broad oak seen from underneath, its lower limbs reaching out level over open ground.",
    job: "The shelter the entire garden depends on. It was two hundred years old before anyone planted a rhododendron under it, and it is why there is a garden here at all.",
    week: 11,
  },
  {
    key: "burnside",
    file: "burnside.jpg",
    alt: "A burn running fast over mossy boulders between wet banks.",
    job: "Wet ground, moving water and moss on everything — the three conditions the blue poppies need and the reason they are at this end of the garden.",
    week: 23,
  },
  {
    key: "glasshouse",
    file: "glasshouse.jpg",
    alt: "A white cast-iron spiral stair inside a glasshouse, glazing bars running away above it.",
    job: "The ironwork the garden spends more heating than it spends on everything else put together, photographed as a structure rather than as a plant collection.",
    week: 3,
  },
  {
    key: "shore",
    file: "shore.jpg",
    alt: "A sea loch under broken cloud, low wind-cut scrub in the foreground and hills on the far shore.",
    job: "Explains the Shore Walk's arithmetic without a word — everything growing in this frame is growing into salt wind, and there is not much of it.",
    week: 27,
  },
  {
    key: "arboretum",
    file: "arboretum.jpg",
    alt: "Birches turning on an open slope, rough grass below and a low horizon behind.",
    job: "The only part of the garden with a horizon in it, which is also the only reason it is better in October than in March.",
    week: 43,
  },
];
