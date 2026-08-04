import Image from "next/image";
import Link from "next/link";
import { Byline } from "./byline";
import { getSection } from "@/content/sections";
import type { Story } from "@/content/types";

type Props = {
  story: Story;
  /**
   * `standard` — image above, for grids.
   * `lead` — large, side by side, for the top of a section.
   * `row` — no image, for dense lists like the archive.
   */
  variant?: "standard" | "lead" | "row";
  /** Passed to next/image so the browser can pick a source before
   *  layout. Wrong values here cost bandwidth, not correctness. */
  sizes?: string;
};

export function StoryCard({
  story,
  variant = "standard",
  sizes = "(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw",
}: Props) {
  const section = getSection(story.section);

  if (variant === "row") {
    return (
      <article className="group py-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {section && (
            <Link
              href={`/section/${section.slug}`}
              className="eyebrow text-accent transition-colors hover:text-accent-hover"
            >
              {section.name}
            </Link>
          )}
          <Byline
            author={story.author}
            date={story.date}
            readingMinutes={story.readingMinutes}
            variant="compact"
          />
        </div>
        <h3 className="mt-2 font-display text-2xl leading-snug font-semibold text-balance">
          <Link href={`/story/${story.slug}`} className="link-rule">
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted text-pretty">
          {story.dek}
        </p>
      </article>
    );
  }

  if (variant === "lead") {
    return (
      <article className="group grid gap-8 lg:grid-cols-2 lg:items-center">
        <Link
          href={`/story/${story.slug}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-sunk"
        >
          <Image
            src={story.image}
            alt={story.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 34rem, 92vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <div>
          {section && (
            <Link
              href={`/section/${section.slug}`}
              className="eyebrow text-accent transition-colors hover:text-accent-hover"
            >
              {section.name}
            </Link>
          )}
          <h2 className="mt-3 font-display text-3xl leading-[1.1] font-semibold text-balance sm:text-4xl lg:text-5xl">
            <Link href={`/story/${story.slug}`} className="link-rule">
              {story.title}
            </Link>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
            {story.dek}
          </p>
          <div className="mt-6">
            <Byline
              author={story.author}
              date={story.date}
              readingMinutes={story.readingMinutes}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <Link
        href={`/story/${story.slug}`}
        className="relative mb-4 block aspect-[4/3] overflow-hidden rounded-sm bg-sunk"
      >
        <Image
          src={story.image}
          alt={story.imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      {section && (
        <Link
          href={`/section/${section.slug}`}
          className="eyebrow text-accent transition-colors hover:text-accent-hover"
        >
          {section.name}
        </Link>
      )}
      <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-balance">
        <Link href={`/story/${story.slug}`} className="link-rule">
          {story.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
        {story.dek}
      </p>
      <div className="mt-4">
        <Byline
          author={story.author}
          date={story.date}
          readingMinutes={story.readingMinutes}
          variant="compact"
        />
      </div>
    </article>
  );
}
