import Link from "next/link";
import { Avatar } from "./avatar";
import { getContributor } from "@/content/contributors";
import { formatDate } from "@/lib/format";

type Props = {
  /** Contributor slug. */
  author: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  /** `full` shows the avatar and links the name; `compact` is one line
   *  of text for use inside a card. */
  variant?: "full" | "compact";
};

export function Byline({ author, date, readingMinutes, variant = "full" }: Props) {
  const person = getContributor(author);
  const name = person?.name ?? "Meridian";

  if (variant === "compact") {
    return (
      <p className="text-xs text-ink-subtle">
        {name} · {formatDate(date)} · {readingMinutes} min read
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {person && <Avatar initials={person.initials} />}
      <div className="text-sm leading-tight">
        <p className="text-ink">
          {person ? (
            <Link
              href={`/contributors#${person.slug}`}
              className="font-semibold transition-colors hover:text-accent"
            >
              {name}
            </Link>
          ) : (
            <span className="font-semibold">{name}</span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-ink-subtle">
          {formatDate(date)} · {readingMinutes} min read
        </p>
      </div>
    </div>
  );
}
