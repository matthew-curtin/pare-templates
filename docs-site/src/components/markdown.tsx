import Link from "next/link";
import type { ReactNode } from "react";
import type { Token, Tokens } from "marked";
import { decodeEntities } from "@/lib/entities";
import { CodeBlock } from "./code-block";
import { HighlightedCode, resolveLang } from "./highlighted-code";

/**
 * Markdown, rendered by walking the parser's token tree into React
 * elements.
 *
 * Nothing here builds an HTML string, and there is no
 * `dangerouslySetInnerHTML` anywhere in this template. That is a stronger
 * guarantee than parsing to HTML and sanitising afterwards: every element
 * that can appear on the page is one this file explicitly names. A token
 * type with no case — including the `html` token a raw `<script>` in a
 * markdown file produces — has no path to a live DOM element. It falls
 * through to text, which React escapes, so it shows up as visible
 * characters on the page.
 *
 * Two things about this parser's tokens are worth knowing before you
 * change anything, because both are invisible until they are wrong:
 *
 * 1. `.text` is NOT escaped, and entities are left exactly as authored.
 *    `&amp;` in a source file stays `&amp;`. Handed to a browser as HTML
 *    that renders as `&`; handed to React it renders as the literal five
 *    characters. Hence `decodeEntities` on every leaf. Some versions of
 *    some parsers escape this field instead — check what yours actually
 *    contains rather than inferring it from the type name.
 *
 * 2. Every list item wraps its content in a token of type `text`, not
 *    `paragraph`. A renderer that only handles `paragraph` silently drops
 *    to raw source and shows literal `**` inside list items.
 */

type MaybeIdentified = Tokens.Heading & { id?: string };

const HEADING_STYLES: Record<number, string> = {
  1: "mt-0 mb-4 text-3xl font-semibold tracking-tight",
  2: "mt-10 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight",
  3: "mt-8 mb-2 scroll-mt-24 text-base font-semibold",
  4: "mt-6 mb-2 scroll-mt-24 text-sm font-semibold text-ink-muted uppercase tracking-wide",
};

function renderInline(tokens: Token[] | undefined): ReactNode {
  if (!tokens) return null;
  return tokens.map((token, i) => <InlineToken key={i} token={token} />);
}

function InlineToken({ token }: { token: Token }): ReactNode {
  switch (token.type) {
    case "text":
    case "escape": {
      // A `text` token is either a leaf (a string) or a container with
      // nested inline tokens — which is the shape every list item takes.
      const nested = (token as Tokens.Text).tokens;
      if (nested?.length) return renderInline(nested);
      return decodeEntities((token as Tokens.Text).text);
    }

    case "strong":
      return (
        <strong className="font-semibold text-ink">
          {renderInline((token as Tokens.Strong).tokens)}
        </strong>
      );

    case "em":
      return <em className="italic">{renderInline((token as Tokens.Em).tokens)}</em>;

    case "del":
      return (
        <del className="text-ink-subtle line-through">
          {renderInline((token as Tokens.Del).tokens)}
        </del>
      );

    case "codespan":
      return (
        <code className="break-path rounded border border-border bg-surface px-1 py-0.5 font-mono text-[0.875em] text-ink">
          {decodeEntities((token as Tokens.Codespan).text)}
        </code>
      );

    case "br":
      return <br />;

    case "link": {
      const link = token as Tokens.Link;
      const children = renderInline(link.tokens) ?? decodeEntities(link.text);
      const external = /^https?:\/\//.test(link.href);
      if (external) {
        return (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link focus-ring"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={link.href} className="prose-link focus-ring">
          {children}
        </Link>
      );
    }

    // `html`, `image` and anything else this file does not name have no
    // case on purpose. See the note at the top.
    default: {
      const raw = (token as { raw?: string }).raw;
      return raw ? decodeEntities(raw) : null;
    }
  }
}

function ListItems({ list }: { list: Tokens.List }): ReactNode {
  return list.items.map((item, i) => (
    <li key={i} className="pl-1.5 marker:text-ink-subtle">
      {item.tokens.map((child, j) =>
        child.type === "list" ? (
          <BlockToken key={j} token={child} />
        ) : child.type === "text" ? (
          <InlineToken key={j} token={child} />
        ) : (
          <BlockToken key={j} token={child} />
        ),
      )}
    </li>
  ));
}

function BlockToken({ token }: { token: Token }): ReactNode {
  switch (token.type) {
    case "space":
      return null;

    case "heading": {
      const heading = token as MaybeIdentified;
      const depth = Math.min(Math.max(heading.depth, 1), 4);
      const Tag = `h${depth}` as "h1" | "h2" | "h3" | "h4";
      const className = HEADING_STYLES[depth];
      const children = renderInline(heading.tokens);

      // Without an id there is nothing to link to, so no anchor is drawn.
      // Ids are assigned once, in lib/docs.ts, and read here and by the
      // table of contents.
      if (!heading.id) return <Tag className={className}>{children}</Tag>;

      return (
        <Tag id={heading.id} className={`group/heading ${className}`}>
          {children}
          <a
            href={`#${heading.id}`}
            aria-label={`Link to this section`}
            className="heading-anchor focus-ring ml-2 font-normal text-accent no-underline"
          >
            #
          </a>
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p className="my-4 leading-7 text-ink-muted">
          {renderInline((token as Tokens.Paragraph).tokens)}
        </p>
      );

    case "list": {
      const list = token as Tokens.List;
      const className = "my-4 space-y-1.5 pl-5 leading-7 text-ink-muted";
      return list.ordered ? (
        <ol
          start={typeof list.start === "number" ? list.start : undefined}
          className={`${className} list-decimal`}
        >
          <ListItems list={list} />
        </ol>
      ) : (
        <ul className={`${className} list-disc`}>
          <ListItems list={list} />
        </ul>
      );
    }

    case "code": {
      const code = token as Tokens.Code;
      const lang = resolveLang(code.lang);
      return (
        <CodeBlock code={code.text} label={code.lang || null}>
          <HighlightedCode code={code.text} lang={lang} />
        </CodeBlock>
      );
    }

    case "blockquote":
      return (
        <blockquote className="my-5 border-l-2 border-accent-ring bg-accent-soft/50 py-1 pl-4 text-ink-muted">
          <Markdown tokens={(token as Tokens.Blockquote).tokens} />
        </blockquote>
      );

    case "table": {
      const table = token as Tokens.Table;
      const align = (i: number) =>
        table.align[i] === "right"
          ? "text-right"
          : table.align[i] === "center"
            ? "text-center"
            : "text-left";
      return (
        // min-w-0 on the scroll wrapper: a flex or grid child will not
        // shrink below its content, so without it a wide table pushes the
        // whole page sideways instead of scrolling inside its own box.
        <div className="my-5 min-w-0 overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {table.header.map((cell, i) => (
                  <th
                    key={i}
                    className={`px-3 py-2 font-semibold whitespace-nowrap text-ink ${align(i)}`}
                  >
                    {renderInline(cell.tokens)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r} className="border-b border-border last:border-0">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 align-top text-ink-muted ${align(i)}`}>
                      {renderInline(cell.tokens)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "hr":
      return <hr className="my-8 border-border" />;

    // Including `html`. See the note at the top of the file.
    default: {
      const raw = (token as { raw?: string }).raw;
      return raw ? <p className="my-4 leading-7 text-ink-muted">{decodeEntities(raw)}</p> : null;
    }
  }
}

export function Markdown({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, i) => <BlockToken key={i} token={token} />);
}
