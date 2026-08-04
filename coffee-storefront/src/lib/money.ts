/**
 * Money is handled in whole pence everywhere in this shop, and only
 * turned into a string at the point it is displayed.
 *
 * The reason is that 0.1 + 0.2 is 0.30000000000000004 in JavaScript,
 * and a subtotal built by adding pounds together drifts. Adding
 * integers does not, so `pence` is the only representation the cart
 * ever does arithmetic on.
 */
export function formatPence(pence: number): string {
  const pounds = Math.trunc(pence / 100);
  const remainder = Math.abs(pence % 100);
  return `£${pounds}.${remainder.toString().padStart(2, "0")}`;
}

/** Applies a whole-number percentage discount, rounded to the penny. */
export function applyDiscount(pence: number, percent: number): number {
  return Math.round(pence * (1 - percent / 100));
}
