import { clsx } from "@/lib/clsx";

/** Five stars, the first `rating` of them filled. */
export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={clsx("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={n <= rating ? "text-accent" : "text-line-strong"}
        >
          <path
            d="M10 1.6l2.47 5.28 5.53.72-4.08 3.9 1.05 5.66L10 14.4l-4.97 2.76 1.05-5.66L2 7.6l5.53-.72z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}
