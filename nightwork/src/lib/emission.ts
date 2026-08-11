/**
 * The palette, computed from physics.
 *
 * Every colour in a firework is an EMISSION — a metal salt burning at a
 * temperature that makes it radiate at a particular wavelength. Those
 * wavelengths are published, so the colours on this site are not picked
 * by eye. Each one is the actual spectral line put through the CIE 1931
 * colour matching functions, into XYZ, into linear sRGB, into OKLCH.
 *
 * Two consequences fall out of doing it that way rather than by hand,
 * and both of them are the point:
 *
 *   1. Monochromatic light is OUTSIDE the sRGB gamut — every one of
 *      these is more saturated than a screen can show. So each colour is
 *      the most saturated thing displayable at its own hue, and the
 *      gamut mapping is the only lie in the palette.
 *
 *   2. The LIGHTNESS is not a design decision either. It comes from the
 *      emitter's relative luminous intensity, which is a real and very
 *      lopsided number: sodium is roughly twelve times the output of
 *      copper. So blue renders dim here, because blue IS dim, and the
 *      site's whole argument about why every show you have ever seen is
 *      gold is legible in its own swatches.
 *
 * This module has no runtime imports, so `scripts/check-colours.mjs` can
 * load it directly with plain node and validate the colours the site
 * actually ships rather than a copy of them.
 */

export type EmissionId =
  | "red"
  | "orange"
  | "amber"
  | "green"
  | "blue"
  | "purple"
  | "gold"
  | "silver";

/** One emission line, and how much of the star's output comes out of it. */
export interface Line {
  nm: number;
  weight: number;
}

export interface Emitter {
  id: EmissionId;
  /** What the trade calls it. */
  name: string;
  /** The compound doing the emitting. */
  salt: string;
  /**
   * The emission lines, weighted. Most emitters have one that matters;
   * purple has two, and having two is the whole of what purple is.
   * Null for the thermal emitters, which have no lines at all.
   */
  lines: readonly Line[] | null;
  /** Peak emission in nanometres — the headline number, shown on /colour. */
  peakNm: number | null;
  /** Colour temperature in kelvin, for the two that glow rather than emit. */
  kelvin: number | null;
  /**
   * Luminous output per unit of composition, with charcoal gold as 1.0.
   * The spread here is the single most important number on the site.
   */
  intensity: number;
  /** Cost per star relative to the cheapest, again with gold as 1.0. */
  cost: number;
  /** Why it behaves the way it does. Shown on /colour. */
  chemistry: string;
}

/**
 * The eight emitters, in the order a maker would list them: the coloured
 * salts by descending wavelength, then the two thermal ones.
 *
 * `intensity` and `cost` are the tuned numbers (CONVENTIONS §7b) and
 * they are tuned to be TRUE rather than to be even — the ratio between
 * sodium and copper is what makes every claim on this site work, so it
 * is left at its real, awkward size.
 */
export const EMITTERS: readonly Emitter[] = [
  {
    id: "red",
    name: "Strontium red",
    salt: "SrCl",
    lines: [{ nm: 645, weight: 1 }],
    peakNm: 645,
    kelvin: null,
    intensity: 0.55,
    cost: 1.5,
    chemistry:
      "Strontium monochloride, and it only exists in a narrow band of temperature — too cool and the star does not light, too hot and the molecule falls apart into strontium and chlorine, which emit nothing useful. Deep red is the easiest of the true colours and it is still a temperature problem.",
  },
  {
    id: "orange",
    name: "Calcium orange",
    salt: "CaCl",
    lines: [{ nm: 597, weight: 1 }],
    peakNm: 597,
    kelvin: null,
    intensity: 0.72,
    cost: 1.5,
    chemistry:
      "Calcium monochloride sits between red and yellow and is rarely used on its own, because at the distances an audience watches from it reads as a slightly disappointing red. It earns its place inside a mixed star, where it warms a gold without paling it.",
  },
  {
    id: "amber",
    name: "Sodium amber",
    salt: "Na",
    lines: [{ nm: 589, weight: 1 }],
    peakNm: 589,
    kelvin: null,
    intensity: 2.6,
    cost: 1.1,
    chemistry:
      "The sodium D-line, at 589 nanometres, which is almost exactly where the human eye is most sensitive. That is why it is the brightest thing in this table by a factor of nearly five, and why sodium contaminating a blue star ruins it completely — a trace of it will out-shout the copper entirely.",
  },
  {
    id: "green",
    name: "Barium green",
    salt: "BaCl",
    lines: [{ nm: 515, weight: 1 }],
    peakNm: 515,
    kelvin: null,
    intensity: 0.85,
    cost: 1.6,
    chemistry:
      "Barium monochloride, and the same fragile molecule problem as strontium, one notch worse. A green that has gone slightly white has burned too hot; a green that has gone dim has burned too cool. There is no third failure.",
  },
  {
    id: "blue",
    name: "Copper blue",
    salt: "CuCl",
    lines: [{ nm: 445, weight: 1 }],
    peakNm: 445,
    kelvin: null,
    intensity: 0.22,
    cost: 3.1,
    chemistry:
      "Copper monochloride, and the hardest colour there is. It decomposes above about 1200°C, so a blue star has to burn cooler than any other — and a cooler flame is a dimmer flame. Blue is not expensive because copper is expensive. It is expensive because you are paying to make a fire that is deliberately bad at being a fire.",
  },
  {
    id: "purple",
    name: "Copper-strontium purple",
    salt: "CuCl + SrCl",
    lines: [
      { nm: 445, weight: 0.72 },
      { nm: 645, weight: 0.28 },
    ],
    peakNm: null,
    kelvin: null,
    intensity: 0.3,
    cost: 2.6,
    chemistry:
      "Not a wavelength at all — two emitters in one star, at 445 and 645 nanometres, which the eye adds together into a colour that is nowhere in the spectrum. It inherits copper's temperature ceiling, so it inherits copper's dimness, and the strontium has to be held back or it simply wins.",
  },
  {
    id: "gold",
    name: "Charcoal gold",
    salt: "C",
    lines: null,
    peakNm: null,
    kelvin: 1700,
    intensity: 1.0,
    cost: 1.0,
    chemistry:
      "Not an emission line — burning charcoal, glowing at around 1700 kelvin, throwing a broad thermal spectrum the same way a poker does. It is the oldest effect in pyrotechnics, the cheapest, one of the brightest, and it is what almost every show you have ever seen is mostly made of.",
  },
  {
    id: "silver",
    name: "Titanium silver",
    salt: "Ti",
    lines: null,
    peakNm: null,
    // The EFFECTIVE colour temperature, not the flame temperature. A
    // magnesium star burns at about 3400K, and a 3400K blackbody is
    // tan — which is not a colour anyone has ever seen come out of a
    // magnesium star. The difference is that the burning oxide
    // particles are selective radiators with far higher emissivity in
    // the blue than a true blackbody, so the light that leaves reads
    // near-white. 5200K is what it reads AS, which is the number this
    // palette wants, and the distinction is the reason it is written
    // down here rather than quietly fudged.
    kelvin: 5200,
    intensity: 2.2,
    cost: 1.4,
    chemistry:
      "Titanium or magnesium burning at three thousand kelvin and upward — hot enough that the spectrum is broad and the eye reads it as white. The crackle is the metal fragmenting. It is the only bright effect in this table that does not depend on a molecule surviving its own flame.",
  },
];

const BY_ID = new Map<EmissionId, Emitter>(EMITTERS.map((e) => [e.id, e]));

export function emitter(id: EmissionId): Emitter {
  const found = BY_ID.get(id);
  if (!found) throw new Error(`unknown emitter: ${id}`);
  return found;
}

/* ── Colour science ────────────────────────────────────────────────── */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

/**
 * Wyman, Sloan and Shirley's multi-lobe Gaussian fit to the CIE 1931
 * 2-degree colour matching functions (JCGT 2013). Accurate to well
 * inside a perceptible step across the visible range, and short enough
 * to read, which a 471-row lookup table is not.
 */
function lobe(x: number, mu: number, s1: number, s2: number): number {
  const t = (x - mu) * (x < mu ? 1 / s1 : 1 / s2);
  return Math.exp(-0.5 * t * t);
}

function cieXyzAt(nm: number): [number, number, number] {
  const x =
    1.056 * lobe(nm, 599.8, 37.9, 31.0) +
    0.362 * lobe(nm, 442.0, 16.0, 26.7) -
    0.065 * lobe(nm, 501.1, 20.4, 26.2);
  const y = 0.821 * lobe(nm, 568.8, 46.9, 40.5) + 0.286 * lobe(nm, 530.9, 16.3, 31.1);
  const z = 1.217 * lobe(nm, 437.0, 11.8, 36.0) + 0.681 * lobe(nm, 459.0, 26.0, 13.8);
  return [x, y, z];
}

/**
 * Kim et al.'s cubic approximation of the Planckian locus in CIE xy,
 * which is how the two thermal emitters get their hue. Valid from 1667K
 * to 25000K; both of ours sit comfortably inside that.
 */
function blackbodyXyz(kelvin: number): [number, number, number] {
  const t = kelvin;
  const t2 = t * t;
  const t3 = t2 * t;
  const x =
    t <= 4000
      ? -0.2661239e9 / t3 - 0.2343589e6 / t2 + 0.8776956e3 / t + 0.17991
      : -3.0258469e9 / t3 + 2.1070379e6 / t2 + 0.2226347e3 / t + 0.24039;
  const x2 = x * x;
  const x3 = x2 * x;
  const y =
    t <= 2222
      ? -1.1063814 * x3 - 1.3481102 * x2 + 2.18555832 * x - 0.20219683
      : t <= 4000
        ? -0.9549476 * x3 - 1.37418593 * x2 + 2.09137015 * x - 0.16748867
        : 3.081758 * x3 - 5.8733867 * x2 + 3.75112997 * x - 0.37001483;
  // xy chromaticity at unit luminance.
  return [x / y, 1, (1 - x - y) / y];
}

/** CIE XYZ (D65) to linear sRGB. */
function xyzToLinear([x, y, z]: [number, number, number]): [number, number, number] {
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ];
}

/** Björn Ottosson's linear sRGB to OKLab. */
export function linearToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLCH to linear sRGB. The inverse of the pair above. */
export function oklchToLinear({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const bb = c * Math.sin(rad);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

export function inGamut(colour: Oklch): boolean {
  return oklchToLinear(colour).every((v) => v >= -0.0001 && v <= 1.0001);
}

/** The most chromatic version of a hue that a screen can actually show. */
export function clampChroma(colour: Oklch): Oklch {
  if (inGamut(colour)) return colour;
  let lo = 0;
  let hi = colour.c;
  for (let i = 0; i < 28; i += 1) {
    const mid = (lo + hi) / 2;
    if (inGamut({ ...colour, c: mid })) lo = mid;
    else hi = mid;
  }
  // FLOOR, not round. `lo` is the largest in-gamut chroma the search
  // found, and rounding to three places can round it back UP past the
  // boundary — which is how two of the eight paper stocks came out
  // marginally out of gamut while every other check passed.
  return { ...colour, c: Math.floor(lo * 1000) / 1000 };
}

/** sRGB relative luminance, for WCAG. Takes a linear triple. */
export function luminance(linear: [number, number, number]): number {
  const [r, g, b] = linear.map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Oklch, b: Oklch): number {
  const la = luminance(oklchToLinear(a));
  const lb = luminance(oklchToLinear(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function toCss({ l, c, h }: Oklch): string {
  return `oklch(${l} ${c} ${h})`;
}

/* ── The palette itself ────────────────────────────────────────────── */

/**
 * Lightness from luminous output, on a log scale because perception is.
 * Charcoal gold is the reference and sits at 0.55; sodium lands near
 * 0.73 and copper near 0.27, which is a ladder no designer would draw
 * and is the entire reason this is derived rather than chosen.
 */
export function lightnessFor(intensity: number): number {
  return Math.round((0.55 + 0.13 * Math.log2(intensity)) * 1000) / 1000;
}

/**
 * An emitter's own light, as CIE XYZ. A line spectrum is the weighted
 * sum of its lines — which is literally what the eye does with a purple
 * star, and why purple needs no special case here. A thermal emitter has
 * no lines, so it takes the Planckian locus at its temperature.
 */
function nativeXyz(e: Emitter): [number, number, number] {
  if (!e.lines) return blackbodyXyz(e.kelvin ?? 1700);
  let x = 0;
  let y = 0;
  let z = 0;
  for (const line of e.lines) {
    const [lx, ly, lz] = cieXyzAt(line.nm);
    x += lx * line.weight;
    y += ly * line.weight;
    z += lz * line.weight;
  }
  return [x, y, z];
}

/** The hue of an emitter, straight off its own spectrum. */
export function hueFor(e: Emitter): number {
  const [, a, b] = linearToOklab(xyzToLinear(nativeXyz(e)));
  const deg = (Math.atan2(b, a) * 180) / Math.PI;
  return Math.round(((deg % 360) + 360) % 360);
}

/**
 * The colour a burst is drawn in.
 *
 * Hue and CHROMA both come off the spectrum; only lightness is
 * substituted, because the raw luminance of a spectral fit is not the
 * luminous output of a burning star. Taking chroma from the light rather
 * than maxing it is the thing that stops this palette lying twice:
 *
 *   • A monochromatic line is fully saturated and lands far outside the
 *     sRGB gamut, so red, green and blue clamp to the most a screen can
 *     hold — correct, and what maxing would have given anyway.
 *   • A THERMAL emitter is broadband and barely saturated at all. Maxing
 *     its chroma turned titanium silver into a neon tangerine, which is
 *     both wrong and the exact thing every hand-picked palette does to
 *     white. Off its own spectrum it comes out nearly neutral, which is
 *     what silver looks like.
 */
export function emissionColour(id: EmissionId): Oklch {
  const e = emitter(id);
  const [nl, na, nb] = linearToOklab(xyzToLinear(nativeXyz(e)));
  const nativeChroma = Math.hypot(na, nb);
  const l = lightnessFor(e.intensity);
  // Chroma scales with lightness: the same light, dimmer, is less
  // colourful, which is why a low star reads washed out and not merely
  // darker.
  const c = nl > 0 ? (nativeChroma / nl) * l : 0;
  return clampChroma({ l, c, h: hueFor(e) });
}

/**
 * A version of an emission colour that can carry TEXT on a given
 * surface, rather than only light.
 *
 * Constructed rather than chosen, because choosing fails: at the
 * lightnesses this palette actually produces, neither black nor white
 * clears 4.5:1 against a mid-tone, and the two dimmest emitters cannot
 * clear it against the night field at their own lightness at all. So
 * this walks outward from the emitter's own lightness in both
 * directions until it finds one that does, tapering chroma as it goes
 * so the result stays in gamut. It returns the FIRST one that clears,
 * which is the closest to the true colour that is also legible.
 */
export function emissionInkOn(id: EmissionId, surface: Oklch, ratio = 4.5): Oklch {
  const base = emissionColour(id);
  const surfaceLight = luminance(oklchToLinear(surface)) > 0.18;
  // Walk toward the far end first — away from the surface — so the
  // nearest legible colour is found rather than the nearest legible
  // colour in an arbitrary direction.
  const dirs = surfaceLight ? [-1, 1] : [1, -1];
  for (const dir of dirs) {
    for (let i = 0; i <= 60; i += 1) {
      const l = base.l + dir * i * 0.011;
      if (l <= 0.06 || l >= 0.98) break;
      const candidate = clampChroma({
        l,
        c: Math.min(base.c, l * 0.34, (1 - l) * 0.62),
        h: base.h,
      });
      if (contrast(candidate, surface) >= ratio) return candidate;
    }
  }
  // Unreachable for this palette, and asserted so in check-colours.mjs.
  return { l: surfaceLight ? 0.1 : 0.97, c: 0, h: base.h };
}

/* ── Paper ─────────────────────────────────────────────────────────── */

/**
 * The page is printed on a coloured stock, and the colour is the show's
 * SIGNATURE emission — not its most common one.
 *
 * Most-common would print four of the six shows on the same amber,
 * because most-common is gold in almost every show ever fired, which is
 * the site's own argument. Signature asks a better question: which
 * emitter is over-represented HERE against the rest of the work. That
 * makes the stock say what is unusual about the show rather than what
 * is unremarkable about the trade.
 */
export const PAPER_LIGHTNESS = 0.905;
export const PAPER_CHROMA = 0.072;
export const INK_LIGHTNESS = 0.225;
export const INK_CHROMA = 0.031;
/** The night panel: the hole cut in the paper that the show is drawn in. */
export const FIELD_LIGHTNESS = 0.145;
export const FIELD_CHROMA = 0.028;

export function paperFor(id: EmissionId): Oklch {
  return clampChroma({ l: PAPER_LIGHTNESS, c: PAPER_CHROMA, h: emissionColour(id).h });
}

export function inkFor(id: EmissionId): Oklch {
  return clampChroma({ l: INK_LIGHTNESS, c: INK_CHROMA, h: emissionColour(id).h });
}

export function fieldFor(id: EmissionId): Oklch {
  return clampChroma({ l: FIELD_LIGHTNESS, c: FIELD_CHROMA, h: emissionColour(id).h });
}

/** Every custom property a page needs to be printed on a given stock. */
export function stockVars(id: EmissionId): Record<string, string> {
  return {
    "--stock-paper": toCss(paperFor(id)),
    "--stock-ink": toCss(inkFor(id)),
    "--stock-field": toCss(fieldFor(id)),
  };
}
