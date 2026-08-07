import { NavLink, Outlet } from "react-router-dom";
import { nav, site } from "@/content/site";
import { NavIcon } from "./nav-icon";

/**
 * The frame every page sits in: a fixed sidebar on desktop, a
 * horizontal strip on narrow screens.
 *
 * The sidebar is a real `<nav>` inside a `<header>`, and the page is a
 * `<main>` — a landmark structure, so a screen-reader user can jump
 * between them rather than tabbing through the navigation on every
 * page.
 */
export function AppShell() {
  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex">
      {/*
        Sticky on desktop. Without it the navigation scrolls away with
        the page on any view long enough to need scrolling — which is
        most of them — and an app shell whose nav leaves is not a shell.
        On narrow screens it is a strip above the content and scrolling
        it away is the right behaviour, so the stickiness is scoped to
        the sidebar layout.
      */}
      <header className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:shrink-0 lg:self-start lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:px-4 lg:py-5">
          <div className="flex items-center gap-2.5">
            <Mark />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">
                {site.appName}
              </div>
              <div className="text-[11px] text-ink-subtle">
                {site.appTagline}
              </div>
            </div>
          </div>

          <div className="hidden lg:mt-5 lg:block">
            <WorkspaceCard />
          </div>
        </div>

        <nav
          aria-label="Sections"
          className="scroll-thin overflow-x-auto px-2 pb-2 lg:overflow-visible lg:px-3 lg:pb-0"
        >
          <ul className="flex gap-1 lg:flex-col">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "focus-ring flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-ink-muted hover:bg-raised hover:text-ink",
                    ].join(" ")
                  }
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden px-4 lg:mt-6 lg:block">
          <CycleCard />
        </div>
      </header>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

/** The Cadence mark — three columns at rising heights. */
function Mark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" className="fill-raised" />
      <rect x="7" y="17" width="5" height="8" rx="1.6" className="fill-stage-1" />
      <rect
        x="13.5"
        y="12"
        width="5"
        height="13"
        rx="1.6"
        className="fill-stage-2"
      />
      <rect x="20" y="7" width="5" height="18" rx="1.6" className="fill-accent" />
    </svg>
  );
}

function WorkspaceCard() {
  return (
    <div className="rounded-lg border border-line bg-raised px-3 py-2.5">
      <div className="text-[11px] tracking-wide text-ink-subtle uppercase">
        Workspace
      </div>
      <div className="mt-0.5 text-sm font-medium">{site.workspace}</div>
      <div className="text-[11px] text-ink-subtle">{site.workspaceDetail}</div>
    </div>
  );
}

function CycleCard() {
  return (
    <div className="rounded-lg border border-line px-3 py-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] tracking-wide text-ink-subtle uppercase">
          {site.cycle.name}
        </span>
        <span className="tabular font-mono text-[11px] text-ink-subtle">
          2 days left
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-canvas">
        {/* Eight working days of ten. */}
        <div className="h-full w-4/5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
