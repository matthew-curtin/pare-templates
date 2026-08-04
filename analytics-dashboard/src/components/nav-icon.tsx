import type { NavItem } from "@/content/types";

/**
 * Sidebar icons, drawn as inline SVG rather than shipped as files:
 * they inherit the current text colour, stay sharp, and every path is
 * editable.
 */
const PATHS: Record<NavItem["icon"], string> = {
  overview: "M3 13h4v6H3zM10 7h4v12h-4zM17 10h4v9h-4z",
  audience:
    "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16 14.5a6 6 0 0 1 6 5.5",
  funnels: "M3 4h18l-7 8v7l-4 2v-9z",
  events: "M4 6h16M4 12h16M4 18h10",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1.5a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V1.5a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
};

export function NavIcon({ name }: { name: NavItem["icon"] }) {
  // The settings cog is drawn at a different scale from the rest, so
  // it gets its own viewBox rather than being nudged with a transform.
  const isCog = name === "settings";
  return (
    <svg
      viewBox={isCog ? "0 0 24 24" : "0 0 24 24"}
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={isCog ? "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" : PATHS[name]} />
      {isCog && (
        <path d="M18.7 14.6a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.5 1.1v.3a1.8 1.8 0 1 1-3.6 0v-.2a1.5 1.5 0 0 0-2.6-1.1l-.1.1A1.8 1.8 0 1 1 5 16.4l.1-.1a1.5 1.5 0 0 0-1.1-2.5H3.7a1.8 1.8 0 0 1 0-3.6h.2a1.5 1.5 0 0 0 1-2.6l-.1-.1A1.8 1.8 0 1 1 7.4 5l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4V3.7a1.8 1.8 0 1 1 3.6 0v.2a1.5 1.5 0 0 0 2.5 1.1l.1-.1A1.8 1.8 0 1 1 19 7.4l-.1.1a1.5 1.5 0 0 0 1 2.6h.3a1.8 1.8 0 0 1 0 3.6h-.2a1.5 1.5 0 0 0-1.3.9z" />
      )}
    </svg>
  );
}
