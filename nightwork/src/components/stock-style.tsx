import {
  EMITTERS,
  emissionInkOn,
  paperFor,
  stockVars,
  toCss,
  type EmissionId,
} from "@/lib/emission";

/**
 * Prints the page on a coloured stock.
 *
 * A page is printed on the stock of whatever it is ABOUT — a show wears
 * its own signature emitter, a shell page wears its own colour, and
 * /colour, which is an argument about copper, is printed on blue paper.
 * The front page and the indexes wear charcoal gold, because that is
 * what this company mostly fires.
 *
 * It also emits an INK variant of all eight emitters against this
 * particular paper. Emission colours are light and most of them cannot
 * carry text — copper blue sits at lightness 0.27 and clears 1.2:1
 * against the night field — so anywhere a colour has to be a WORD
 * rather than a mark, it uses the constructed variant instead. Which
 * paper it is constructed against changes the answer, so it has to be
 * done here rather than once in the theme.
 */
export function StockStyle({ emission }: { emission: EmissionId }) {
  const paper = paperFor(emission);
  const declarations = [
    ...Object.entries(stockVars(emission)).map(([k, v]) => `${k}:${v}`),
    ...EMITTERS.map((e) => `--em-${e.id}-ink:${toCss(emissionInkOn(e.id, paper))}`),
  ].join(";");

  return <style>{`:root{${declarations}}`}</style>;
}
