import Image from "next/image";
import { getStory } from "@/content/stories";
import { site } from "@/content/site";
import type { Issue } from "@/content/types";

/**
 * The print edition, drawn rather than photographed.
 *
 * Everything here is HTML and CSS over one photograph: the masthead is
 * live text, the cover line is live text, the spine and the paper edge
 * are gradients. That means it stays sharp at any size, weighs nothing
 * beyond the photo it already needed, and — the real reason — every
 * part of it can be clicked and edited. A screenshot of a cover would
 * be a dead end.
 */
export function CoverMockup({
  issue,
  className = "",
  priority = false,
}: {
  issue: Issue;
  className?: string;
  priority?: boolean;
}) {
  const lead = getStory(issue.leadStory);

  // `@container` makes the cqw units used below resolve against the
  // cover itself rather than the viewport, so its type scales with the
  // cover at whatever size it is placed at.
  return (
    <div
      className={`@container cover-shadow relative aspect-[8.5/11] w-full overflow-hidden rounded-[3px] bg-inverse ${className}`}
    >
      {lead && (
        <Image
          src={lead.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 26rem, 70vw"
          className="object-cover"
        />
      )}

      {/* Darkened top and bottom so the type holds against any photo.
          Two separate gradients rather than one full-height wash, so
          the middle of the picture stays untouched. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
      />

      {/* The spine: a narrow highlight down the left edge that reads as
          a folded, printed object rather than a flat rectangle. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/45 via-white/10 to-transparent"
      />

      <div className="relative flex h-full flex-col justify-between p-[7%]">
        <div className="text-center">
          <p className="font-display text-[clamp(1.5rem,7cqw,2.75rem)] leading-none font-semibold tracking-[-0.02em] text-ink-inverse">
            {site.name}
          </p>
          <p
            className="eyebrow mt-2 text-ink-inverse/70"
            style={{ fontSize: "clamp(0.5rem, 1.6cqw, 0.6875rem)" }}
          >
            Issue {issue.number} · {issue.season}
          </p>
        </div>

        <div>
          <p
            className="eyebrow text-accent-soft"
            style={{ fontSize: "clamp(0.5rem, 1.6cqw, 0.6875rem)" }}
          >
            In this issue
          </p>
          <p className="mt-2 font-display text-[clamp(1.1rem,4.4cqw,1.9rem)] leading-[1.08] font-semibold text-balance text-ink-inverse">
            {issue.coverLine}
          </p>
          <div
            aria-hidden="true"
            className="mt-4 h-px w-10 bg-accent"
          />
          <p className="mt-3 text-[clamp(0.6rem,2cqw,0.8rem)] leading-snug text-ink-inverse/65">
            {site.standfirst}
          </p>
        </div>
      </div>
    </div>
  );
}
