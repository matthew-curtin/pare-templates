import { seasonVars } from "@/lib/ground";

/**
 * Dresses the whole document in one week's colour.
 *
 * The ground is a per-ROUTE value, so it cannot live in the layout —
 * and it has to reach `<body>`, so it cannot live on a wrapper div
 * either. A server-rendered `<style>` writing the seven custom
 * properties onto `:root` is the one place that satisfies both, with no
 * client JavaScript and no flash: the colour is in the HTML that
 * arrives.
 *
 * Every page names the week it is ABOUT rather than the week it is —
 * a plant's page is dressed in the season of its own peak, so the
 * magnolia is rose and the blue poppy is blue. That is the site's
 * argument applied to itself: nothing here is one fixed colour, because
 * nothing here is true all year.
 */
export function SeasonStyle({ week }: { week: number }) {
  const vars = seasonVars(week);
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return <style>{`:root{${body}}`}</style>;
}
