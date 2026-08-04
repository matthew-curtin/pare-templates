"use client";

import { useMemo, useState } from "react";
import { StoryCard } from "./story-card";
import type { Section, Story } from "@/content/types";
import { yearOf } from "@/lib/format";

/**
 * The archive, filtered by section and year.
 *
 * Everything is already on the page — this narrows what is shown
 * rather than fetching. No request, no spinner, and it works with the
 * network off.
 */
export function ArchiveList({
  stories,
  sections,
}: {
  stories: Story[];
  sections: Section[];
}) {
  const [section, setSection] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const years = useMemo(() => {
    const set = new Set(stories.map((story) => yearOf(story.date)));
    return [...set].sort((a, b) => b - a);
  }, [stories]);

  const shown = useMemo(
    () =>
      stories.filter(
        (story) =>
          (section === null || story.section === section) &&
          (year === null || yearOf(story.date) === year)
      ),
    [stories, section, year]
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5">
        <FilterRow label="Section">
          <Chip active={section === null} onClick={() => setSection(null)}>
            All
          </Chip>
          {sections.map((s) => (
            <Chip
              key={s.slug}
              active={section === s.slug}
              onClick={() => setSection(s.slug)}
            >
              {s.name}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Year">
          <Chip active={year === null} onClick={() => setYear(null)}>
            All
          </Chip>
          {years.map((y) => (
            <Chip key={y} active={year === y} onClick={() => setYear(y)}>
              {y}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-subtle">
        {shown.length} {shown.length === 1 ? "story" : "stories"}
      </p>

      {shown.length > 0 ? (
        <div className="mt-2 divide-y divide-line">
          {shown.map((story) => (
            <StoryCard key={story.slug} story={story} variant="row" />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-sm border border-dashed border-line-strong bg-surface p-10 text-center">
          <p className="font-display text-xl font-semibold">Nothing here yet</p>
          <p className="mt-2 text-sm text-ink-muted">
            We have not published in that section that year. Try clearing one of
            the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSection(null);
              setYear(null);
            }}
            className="mt-5 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="eyebrow w-16 shrink-0 text-ink-subtle">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-ink-inverse"
          : "border-line-strong text-ink-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
