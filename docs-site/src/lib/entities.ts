/**
 * Decoding HTML entities back to the characters they stand for.
 *
 * This exists because of a mismatch that is easy to get wrong in both
 * directions. Markdown parsers are written on the assumption that you are
 * about to build an HTML string, so `&amp;` in a source file is left
 * alone: handed to a browser as HTML it renders as `&`, which is what the
 * author meant.
 *
 * We are not building an HTML string. We hand text to React, which escapes
 * on output, so `&amp;` passed straight through renders on the page as the
 * literal five characters `&amp;`. Decoding first, then letting React
 * escape, gets back to the character the author wrote.
 *
 * Note this is the *opposite* correction from the one some parser versions
 * need — a few escape the text field themselves, in which case decoding is
 * still what you want, but for a different reason. Check what your parser
 * actually puts in the field rather than inferring it from the type name.
 */

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  times: "×",
  rarr: "→",
  larr: "←",
};

/** `&amp;` -> `&`, `&#39;` -> `'`, `&#x2014;` -> em dash. */
export function decodeEntities(input: string): string {
  if (!input.includes("&")) return input;

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body: string) => {
    if (body[0] === "#") {
      const isHex = body[1] === "x" || body[1] === "X";
      const code = Number.parseInt(isHex ? body.slice(2) : body.slice(1), isHex ? 16 : 10);
      // Lone surrogates and out-of-range values are not characters; leave
      // the reference alone rather than emitting a replacement character.
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return whole;
      if (code >= 0xd800 && code <= 0xdfff) return whole;
      return String.fromCodePoint(code);
    }
    const named = NAMED[body];
    return named ?? whole;
  });
}
