import { RatingStars } from "./rating-stars";
import type { Review } from "@/content/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="edge-light flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
      <RatingStars rating={review.rating} />
      <blockquote className="mt-4 flex-1">
        <p className="font-bold text-ink">{review.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {review.body}
        </p>
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4 text-xs text-ink-subtle">
        <span className="font-semibold text-ink-muted">{review.author}</span>
        <span className="mx-1.5">·</span>
        {review.source}
      </figcaption>
    </figure>
  );
}
