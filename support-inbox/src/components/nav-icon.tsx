/**
 * Every icon in the app, drawn as inline SVG.
 *
 * No icon font and no library — CONVENTIONS §5. They inherit the
 * surrounding colour through `currentColor`, so a token change moves
 * them with everything else, and each one can be selected and edited in
 * Pare like any other element.
 */

const PATHS: Record<string, string> = {
  inbox: "M4 5h16v9h-5a3 3 0 0 1-6 0H4V5Zm0 9v5h16v-5",
  people:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16.5 11.5a3 3 0 1 0 0-6M17 20a6 6 0 0 0-2-4.6",
  macro: "M5 5h14M5 10h14M5 15h9M5 20h6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.7L14.2 2H9.8l-.3 2.7a8 8 0 0 0-3 1.7l-2.3-1-2 3.4 2 1.5a8 8 0 0 0 0 3.4l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.7l.3 2.7h4.4l.3-2.7a8 8 0 0 0 3-1.7l2.3 1 2-3.4-2-1.5c.13-.55.2-1.12.2-1.7Z",
  email: "M3 6h18v12H3V6Zm0 .5 9 6.5 9-6.5",
  chat: "M4 5h16v10h-9l-4.5 4v-4H4V5Z",
  social:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9m0-18C9.5 5.4 8.2 8.5 8.2 12s1.3 6.6 3.8 9M3.4 9h17.2M3.4 15h17.2",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2",
  tag: "M4 4h7l9 9-7 7-9-9V4Zm3.5 3.5h.01",
  check: "M4 12.5 9.5 18 20 6.5",
  snooze: "M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11ZM14 3h5l-5 5h5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4.5 4.5",
  back: "M19 12H5m0 0 6-6m-6 6 6 6",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  note: "M5 4h14v11l-5 5H5V4Zm14 11h-5v5",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  reply: "M10 5 3 11l7 6v-4h3a8 8 0 0 1 8 8V19a8 8 0 0 0-8-8h-3V5Z",
  building: "M4 21V6l7-3v18M11 21h9V10h-9M14 13h3M14 17h3M7 9v.01M7 13v.01M7 17v.01",
};

export function NavIcon({
  name,
  className = "size-[18px]",
}: {
  name: string;
  className?: string;
}) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={path} />
    </svg>
  );
}
