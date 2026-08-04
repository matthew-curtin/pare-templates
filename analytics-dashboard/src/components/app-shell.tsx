import { NavLink, Outlet } from "react-router-dom";
import { NavIcon } from "./nav-icon";
import { currentUser, nav, site, workspace } from "@/content/site";

/**
 * The frame every page renders inside: a fixed sidebar on desktop, a
 * scrolling strip on small screens, and the routed page in the middle.
 */
export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="shrink-0 bg-inverse text-ink-inverse lg:flex lg:w-60 lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--color-series-1)" }}
              />
              {site.name}
            </p>
            <p className="mt-1 hidden text-xs text-white/50 lg:block">
              {workspace.name} · {site.environment}
            </p>
          </div>

          <p className="text-xs text-white/50 lg:hidden">{workspace.name}</p>
        </div>

        <nav
          aria-label="Sections"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-white/12 font-medium text-white"
                    : "text-white/65 hover:bg-white/6 hover:text-white"
                }`
              }
            >
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold"
            >
              {currentUser.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm">{currentUser.name}</p>
              <p className="truncate text-xs text-white/50">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

/** The title block at the top of each page. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-surface px-6 py-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
