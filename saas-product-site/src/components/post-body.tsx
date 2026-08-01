import type { PostBlock } from "@/content/types";

/** Renders a post's structured body. One case per block type. */
export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="pt-4 text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p key={i} className="text-[17px] leading-8 text-ink-muted">
                {block.text}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-accent py-1 pl-5"
              >
                <p className="text-lg leading-8 text-ink italic">
                  {block.text}
                </p>
                {block.attribution && (
                  <cite className="mt-2 block text-sm text-ink-subtle not-italic">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case "list":
            return (
              <ul key={i} className="space-y-3 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-[17px] leading-8 text-ink-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg bg-inverse p-4 text-sm text-ink-inverse"
              >
                <code className="font-mono">{block.code}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}
