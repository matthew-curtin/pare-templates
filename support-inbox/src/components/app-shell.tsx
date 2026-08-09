import { NavLink, Outlet } from "react-router-dom";
import { nav, site } from "@/content/site";
import { team } from "@/content/team";
import { useConversations } from "@/lib/use-inbox";
import { Avatar } from "./avatar";
import { NavIcon } from "./nav-icon";

/**
 * The frame every page sits in: a fixed sidebar on desktop, a
 * horizontal strip on narrow screens.
 *
 * The sidebar is a real `<nav>` inside a `<header>`, and the page is a
 * `<main>` — a landmark structure, so a screen-reader user can jump
 * between them rather than tabbing the navigation on every page.
 *
 * On desktop the whole app is exactly one screen tall and nothing about
 * it scrolls; the inbox's two columns scroll independently inside it.
 * That is what a mail-shaped app has to do — a list whose header
 * scrolls away takes its filters with it. Below `lg` it becomes an
 * ordinary scrolling page, because two independent scrollers on a phone
 * is one too many.
 */
export function AppShell() {
  const conversations = useConversations();
  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;
  const me = team.find((member) => member.id === site.currentMemberId);

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex lg:h-dvh lg:overflow-hidden">
      <header className="border-b border-line bg-surface lg:flex lg:w-56 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:py-4">
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
          <div className="hidden lg:mt-4 lg:block">
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
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-ink-muted hover:bg-hover hover:text-ink",
                    ].join(" ")
                  }
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                  {item.to === "/" && openCount > 0 ? (
                    <span className="tabular ml-auto font-mono text-[11px] text-ink-subtle">
                      {openCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {me ? (
          <div className="mt-auto hidden items-center gap-2.5 border-t border-line px-4 py-3 lg:flex">
            <Avatar initials={me.initials} name={me.name} size="md" />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-medium">{me.name}</div>
              <div className="truncate text-[11px] text-ink-subtle">
                {me.role}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="min-w-0 flex-1 lg:h-dvh lg:overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

/** The Parley mark — two speech bubbles, one answering the other. */
function Mark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" className="fill-accent" />
      <path
        d="M7 8.5h13a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5h-6.7L10 23v-3.5H7A2.5 2.5 0 0 1 4.5 17v-6A2.5 2.5 0 0 1 7 8.5Z"
        fill="#ffffff"
        fillOpacity="0.45"
      />
      <path
        d="M15 13h10a2.5 2.5 0 0 1 2.5 2.5v5A2.5 2.5 0 0 1 25 23h-2.6v3.2L19 23h-4a2.5 2.5 0 0 1-2.5-2.5v-5A2.5 2.5 0 0 1 15 13Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function WorkspaceCard() {
  return (
    <div className="rounded-lg border border-line bg-canvas px-3 py-2.5">
      <div className="text-[11px] tracking-wide text-ink-subtle uppercase">
        Workspace
      </div>
      <div className="mt-0.5 text-sm font-medium">{site.workspace}</div>
      <div className="text-[11px] text-ink-subtle">{site.workspaceDetail}</div>
    </div>
  );
}
