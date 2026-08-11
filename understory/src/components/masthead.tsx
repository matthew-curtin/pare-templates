import { site } from "@/content/site";

const LINKS = [
  { href: "/plants", label: "Collection" },
  { href: "/plan", label: "Plan a visit" },
  { href: "/visit", label: "Visiting" },
  { href: "/about", label: "The garden" },
];

/**
 * The masthead is a TILE, not a bar.
 *
 * Six templates in this repo open with a sticky bar over a centred
 * column and the register grandfathers them rather than endorsing them.
 * Putting the name and the navigation into the first cell of the wall
 * is the one move that keeps the architecture honest all the way to the
 * top of the page: there is no chrome layer, nothing is pinned, and the
 * garden's own name has to compete for space with whatever is flowering
 * — which, in the third week of March, it loses.
 */
export function Masthead({ cols = 2, rows = 1 }: { cols?: number; rows?: number }) {
  return (
    <div
      className="cell cell-prose"
      style={
        {
          "--cols": cols,
          "--rows": rows,
          background: "var(--color-ink)",
          color: "var(--color-ground)",
          justifyContent: "space-between",
          viewTransitionName: "masthead",
        } as React.CSSProperties
      }
    >
      <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
        <div className="display fit-display">{site.name}</div>
        <div className="label" style={{ opacity: 0.66, marginTop: "0.2rem" }}>
          {site.where}
        </div>
      </a>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.15rem 0.9rem" }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="label link-quiet">
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/** The same navigation for the pages that are not a wall. Still not a
 *  bar: it sits in the flow at the top of the sheet and scrolls away
 *  with everything else. */
export function SheetNav() {
  return (
    <header
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: "0.6rem 1.4rem",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--color-line)",
        paddingBottom: "0.9rem",
        marginBottom: "clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
        <span className="display" style={{ fontSize: "var(--text-title)" }}>
          {site.name}
        </span>
        <span className="label" style={{ color: "var(--color-ink-muted)", marginLeft: "0.6rem" }}>
          {site.where}
        </span>
      </a>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.15rem 1.1rem" }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="label link-quiet">
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
