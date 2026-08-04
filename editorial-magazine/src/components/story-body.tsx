import Image from "next/image";
import type { StoryBlock } from "@/content/types";

/**
 * Renders a story's body from typed blocks.
 *
 * Typed blocks rather than a markdown string on purpose: each kind of
 * block gets a deliberate treatment (a pull quote is not an indented
 * paragraph), the editor catches a malformed one, and there is no
 * parser and no dependency. A template that is *about* long-form
 * markdown is the place to test a markdown pipeline; this is not it.
 */
export function StoryBody({ blocks }: { blocks: StoryBlock[] }) {
  // The drop cap belongs to the opening paragraph only. Found up front
  // rather than tracked with a flag inside the map — mutating a
  // variable while rendering is unreliable once React can re-run a
  // component body, and the linter is right to refuse it.
  const firstParagraph = blocks.findIndex((b) => b.type === "paragraph");

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph": {
            const isFirst = i === firstParagraph;
            return (
              <p
                key={i}
                className={`text-[1.0625rem] leading-[1.75] text-ink ${
                  isFirst ? "drop-cap" : ""
                }`}
              >
                {block.text}
              </p>
            );
          }

          case "heading":
            return (
              <h2
                key={i}
                className="pt-6 font-display text-2xl leading-snug font-semibold text-balance"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-10 border-l-2 border-accent pl-6"
              >
                <p className="font-display text-xl leading-snug font-medium text-balance text-ink sm:text-2xl">
                  “{block.text}”
                </p>
                {block.attribution && (
                  <footer className="mt-3 text-sm text-ink-subtle">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );

          case "list":
            return (
              <ul key={i} className="space-y-3 py-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="relative pl-6 text-[1.0625rem] leading-[1.7] text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.7em] left-0 h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "figure":
            return (
              <figure key={i} className="my-10">
                <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-sunk">
                  <Image
                    src={block.image}
                    alt={block.alt}
                    fill
                    sizes="(min-width: 640px) 38rem, 92vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm leading-relaxed text-ink-subtle">
                  {block.caption}
                </figcaption>
              </figure>
            );
        }
      })}
    </div>
  );
}
