import type { NavItem } from "@/content/types";

/**
 * The sidebar glyphs, drawn rather than shipped as an icon font or a
 * sprite. Five paths weigh less than any dependency that would draw
 * them, and each one is editable in place.
 */
export function NavIcon({ name }: { name: NavItem["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "board":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="5" height="16" rx="1.5" />
          <rect x="9.5" y="4" width="5" height="11" rx="1.5" />
          <rect x="16" y="4" width="5" height="7" rx="1.5" />
        </svg>
      );
    case "backlog":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "roadmap":
      return (
        <svg {...common}>
          <path d="M4 7h9M8 12h12M4 17h7" />
          <circle cx="17" cy="7" r="1.6" />
          <circle cx="12" cy="17" r="1.6" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" />
          <path d="M16 5.6a3.2 3.2 0 0 1 0 6M17.5 14.9c2 .5 3.4 2.2 3.9 4.6" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.8v2.4M12 18.8v2.4M4.5 7.5l2 1.2M17.5 15.3l2 1.2M4.5 16.5l2-1.2M17.5 8.7l2-1.2" />
        </svg>
      );
  }
}
