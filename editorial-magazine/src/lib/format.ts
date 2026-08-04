const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "2026-07-22" -> "22 July 2026".
 *
 * Deliberately not `toLocaleDateString`: that reads the runtime's
 * locale and time zone, which differ between the server render and the
 * browser, and React reports the mismatch as a hydration error. Parsing
 * the parts by hand gives the same string in both places.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** "2026-07-22" -> "July 2026". Used where the day adds nothing. */
export function formatMonth(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "2026-07-22" -> 2026. Used to group the archive. */
export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4));
}
