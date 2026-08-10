import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { nav, footer, site } from "@/content/site";
import { horizon, productViews } from "@/lib/shop";
import { shortDate } from "@/lib/calendar";

/**
 * The frame.
 *
 * A thin bar and then nothing — no centred column anywhere on this
 * site. Pages run to the edges because the tree runs to the edges, and
 * a max-width wrapper would put a margin between the hierarchy and the
 * numbers that describe it, which is the one relationship every page is
 * about.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex-1">{children}</main>
      <Foot />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ground/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
        <Link to="/" className="focus-ring flex items-baseline gap-2">
          <Mark />
          <span className="text-[1.0625rem] font-[560] tracking-[-0.02em]">{site.name}</span>
        </Link>

        <nav className="-mx-1 flex min-w-0 flex-1 flex-wrap items-center gap-x-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `focus-ring rounded-sm px-2 py-1 text-[0.875rem] transition-colors duration-[--dur-quick] ${
                  isActive ? "bg-sunk text-ink" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* The two answers, always visible. They are what the whole site
            computes, and burying them one click deep on the very bar
            that is on every page would be perverse. */}
        <div className="fig flex shrink-0 items-baseline gap-3 text-[0.8125rem] text-ink-muted">
          {productViews.map((v) => (
            <Link
              key={v.id}
              to={`/tree/${v.id}`}
              className="focus-ring rounded-sm hover:text-ink"
              title={`${v.count} buildable from stock today`}
            >
              <span className="text-ink">{v.count}</span> {v.item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

/** Drawn, not shipped as an image (§5): a hub with eight spokes, which
 *  is the tree this whole site is about seen end-on. */
function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={12 + 2.6 * Math.cos(r)}
            y1={12 + 2.6 * Math.sin(r)}
            x2={12 + 10 * Math.cos(r)}
            y2={12 + 10 * Math.sin(r)}
            stroke="currentColor"
            strokeWidth="0.75"
          />
        );
      })}
    </svg>
  );
}

function Foot() {
  return (
    <footer className="mt-16 border-t border-line bg-sheet">
      <div className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <Mark />
            <span className="text-[1.0625rem] font-[560]">{site.name}</span>
          </div>
          <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-ink-muted">
            {footer.note}
          </p>
          <p className="fig mt-4 text-[0.8125rem] text-ink-subtle">
            {site.address} · {site.hours}
          </p>
          <p className="fig mt-1 text-[0.8125rem] text-ink-subtle">
            The board is drawn against a fixed day — everything on this site reads as if it
            were the morning of {shortDate(0)}, and the queue runs to {shortDate(horizon)}.
          </p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title} className="min-w-0">
            <h3 className="text-[0.8125rem] text-ink-subtle">{col.title}</h3>
            <ul className="mt-2 list-none space-y-1.5 p-0">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="focus-ring text-[0.875rem] text-ink-muted hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

/** A page band. Full width, generous inline padding, nothing centred. */
export function Band({
  children,
  top = false,
  tint = false,
}: {
  children: ReactNode;
  top?: boolean;
  tint?: boolean;
}) {
  return (
    <section
      className={`px-4 sm:px-6 ${top ? "pt-8 pb-10 sm:pt-12" : "py-10"} ${
        tint ? "border-y border-line bg-sheet" : ""
      }`}
    >
      {children}
    </section>
  );
}
