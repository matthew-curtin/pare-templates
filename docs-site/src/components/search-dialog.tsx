"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/docs";

/**
 * Search over the documentation, built from the same markdown the pages
 * render. The index arrives as plain data from the server — see
 * `getSearchIndex` — so nothing is fetched and nothing is indexed in the
 * browser.
 *
 * Substring matching is deliberate. A fuzzy matcher is worth its weight
 * over thousands of entries; over a few dozen headings it mostly produces
 * confident wrong answers.
 */
export function SearchDialog({
  index,
  onClose,
}: {
  index: SearchEntry[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);

    /* Ranking, in the order these matter.
     *
     * The context tier is the one that has to exist. Every heading carries
     * its page's title as context, so searching "signatures" matches every
     * heading on the signatures page as well as the page itself — and
     * without this, a short sub-heading that mentions the word nowhere in
     * its own title outranks the page you obviously meant. Ask for a title
     * match first, and only fall back to context. */
    const rank = (entry: SearchEntry) => {
      const title = entry.title.toLowerCase();
      if (title.startsWith(q)) return 0;
      if (title.includes(q)) return 1;
      return 2; // Matched only on where it sits.
    };

    return index
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) || entry.context.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        // A page before the headings inside it, at the same rank.
        const aPage = a.href.includes("#") ? 1 : 0;
        const bPage = b.href.includes("#") ? 1 : 0;
        return rank(a) - rank(b) || aPage - bPage || a.title.length - b.title.length;
      })
      .slice(0, 12);
  }, [index, query]);

  // The dialog is mounted only while it is open, so opening it gives fresh
  // state for free. Resetting in an effect instead would be a render
  // caused by a render — which is what `react-hooks/set-state-in-effect`
  // is pointing at, and it is right.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function search(next: string) {
    setQuery(next);
    // The highlight belongs to a result list that is about to change, so
    // it resets here — in the event that changes the query — rather than
    // in an effect watching for the change afterwards.
    setActive(0);
  }

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = results[active];
      if (hit) go(hit.href);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-canvas shadow-2xl shadow-ink/20"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span aria-hidden className="text-ink-subtle">
            ⌕
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search the documentation"
            aria-label="Search the documentation"
            className="w-full min-w-0 bg-transparent py-3.5 text-[15px] outline-none placeholder:text-ink-subtle"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-ink-subtle sm:block">
            esc
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-muted">
            Nothing matches <span className="font-medium text-ink">{query}</span>.
          </p>
        ) : (
          <ul ref={listRef} className="max-h-[46vh] overflow-y-auto py-1.5">
            {results.map((entry, i) => (
              <li key={`${entry.href}-${i}`} data-index={i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(entry.href)}
                  className={`flex w-full min-w-0 flex-col items-start gap-0.5 px-4 py-2 text-left ${
                    i === active ? "bg-accent-soft" : ""
                  }`}
                >
                  <span className="w-full truncate text-sm font-medium text-ink">
                    {entry.title}
                  </span>
                  <span className="w-full truncate text-xs text-ink-subtle">{entry.context}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-border bg-surface px-4 py-2 text-[11px] text-ink-subtle">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
