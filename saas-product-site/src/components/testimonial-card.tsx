import { Avatar } from "./avatar";
import type { Testimonial } from "@/content/types";

export function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-line bg-canvas p-6">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar name={testimonial.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{testimonial.name}</p>
          <p className="truncate text-sm text-ink-subtle">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
