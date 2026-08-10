import { NavLink, Outlet } from "react-router-dom";
import { nav, station, today } from "@/content/site";
import { footer } from "@/content/site";
import { Console } from "./console";

/**
 * The frame.
 *
 * Three regions and no page column anywhere: a thin identification strip
 * at the top, the route full-bleed between, and the console docked to
 * the bottom edge. The log runs to both margins on purpose — a schedule
 * that stops two hundred pixels short of the screen edge is a document
 * about a schedule rather than the schedule itself.
 *
 * The scroller is the middle region rather than the page, so the console
 * cannot be scrolled off. That is the whole point of docking it.
 */
export function Shell() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-x-4 gap-y-1 border-b border-line bg-panel px-4 py-2 sm:px-6">
        <div className="flex shrink-0 items-baseline gap-2">
          <span className="text-[1.0625rem] leading-none" style={{ fontVariationSettings: '"wdth" 92' }}>
            {station.name}
          </span>
          <span className="tnum text-[0.8125rem] text-live">{station.frequency}</span>
        </div>

        <nav className="-mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              title={item.hint}
              className={({ isActive }) =>
                `focus-ring shrink-0 rounded-console px-2.5 py-1 text-[0.8125rem] transition-colors ${
                  isActive
                    ? "bg-raised text-ink"
                    : "text-ink-muted hover:bg-[var(--wash-raised)] hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <span className="hidden shrink-0 text-[0.8125rem] text-ink-subtle md:inline">
          {today} · all times {station.timezone}
        </span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
        <footer className="border-t border-line px-4 py-6 text-[0.75rem] leading-relaxed text-ink-subtle sm:px-6">
          <p className="max-w-[70ch]">{footer.fiction}</p>
          <p className="mt-1">{footer.note}</p>
        </footer>
      </main>

      <div className="shrink-0">
        <Console />
      </div>
    </div>
  );
}
