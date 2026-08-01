"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/content/types";

/**
 * Filters the help centre as you type. Everything is already on the
 * page, so this is a filter rather than a search — no request, no
 * spinner, and it works with the network off.
 */
export function ArticleSearch({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? articles.filter((article) =>
          `${article.title} ${article.summary} ${article.category}`
            .toLowerCase()
            .includes(needle),
        )
      : articles;

    const result: { category: string; items: Article[] }[] = [];
    for (const article of matches) {
      const existing = result.find((g) => g.category === article.category);
      if (existing) {
        existing.items.push(article);
      } else {
        result.push({ category: article.category, items: [article] });
      }
    }
    return result;
  }, [articles, query]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search the help centre</span>
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle
              cx="8"
              cy="8"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12.2 12.2 16 16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search — try “alarm” or “cancel”"
          className="h-13 w-full rounded-full border border-line-strong bg-surface pr-5 pl-12 text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
        />
      </label>

      {groups.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-surface p-8 text-center text-ink-muted">
          Nothing matches “{query}”. Try a different word, or{" "}
          <a href="#contact" className="font-semibold text-accent">
            write to us
          </a>{" "}
          instead.
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
                {group.category}
              </h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {group.items.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/support/${article.slug}`}
                      className="group flex items-start justify-between gap-6 py-5 transition-colors hover:text-ink"
                    >
                      <span>
                        <span className="block font-semibold text-ink">
                          {article.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                          {article.summary}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5"
                      >
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
