/**
 * The fleet as it stood when the craft and imagery directives landed.
 *
 * Both checkers carry lists of templates that are excused something —
 * §4c grandfathering in `check-craft.mjs`, owed imagery and owed photo
 * treatments in both files. Every one of those lists is HISTORICAL: it
 * exists because rewriting eleven templates at once would have been a
 * worse use of a week than making the next ten good.
 *
 * The failure mode that costs nothing to prevent and everything to
 * discover late is a list like that quietly growing. A template built
 * next month that skips photography, gets added to IMAGERY_DEBT with a
 * plausible note, and passes every check is exactly how the cliff §6
 * was written about happened the first time — six locally reasonable
 * omissions in a row, none of them decided.
 *
 * So the lists are closed. A name that is not below may not appear in
 * any of them, and the checkers fail if one does. The lists can only
 * shrink from here, which is the whole point of their existing.
 *
 * The one carve-out that stays OPEN is `NO_IMAGERY` in check-craft.mjs:
 * a future template really might have nothing to photograph, the way
 * docs-site does. That one takes a written reason and prints it on
 * every run, which is a different mechanism — visible rather than
 * closed — and is the right shape for a decision somebody has to make
 * deliberately rather than for a debt somebody has to pay.
 */
export const PRE_RULE_FLEET = new Set([
  "saas-product-site",
  "mobile-app-landing",
  "editorial-magazine",
  "coffee-storefront",
  "analytics-dashboard",
  "project-tracker",
  "restaurant-booking",
  "docs-site",
  "support-inbox",
  "almanac",
  "conference-schedule",
]);

/**
 * Check a debt list against the frozen fleet, and against reality.
 *
 * Two ways it fails. A name not in `PRE_RULE_FLEET` is a NEW template
 * being excused, which is the thing this file exists to stop. A name
 * that matches no template on disk is a list that has gone stale — a
 * rename or a deletion left an entry behind, and the entry is now
 * silently excusing nothing while looking like it excuses something.
 */
export function auditDebtList(label, names, existing) {
  const problems = [];
  for (const name of names) {
    if (!PRE_RULE_FLEET.has(name)) {
      problems.push(
        `${label} names "${name}", which is not in the pre-rule fleet — new templates meet the bar, they do not join the debt (see scripts/fleet.mjs)`,
      );
    } else if (!existing.includes(name)) {
      problems.push(`${label} names "${name}", which is not a template in this repo`);
    }
  }
  return problems;
}
