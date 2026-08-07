import { createHighlighter, type Highlighter } from "shiki";
import type { CSSProperties, ReactNode } from "react";

/**
 * Syntax highlighting, walked into React elements rather than injected as
 * HTML.
 *
 * Shiki will happily hand back an HTML string, and using it would mean
 * `dangerouslySetInnerHTML`. Even though this input is our own markdown
 * and the output comes from a trusted tool, the moment one surface in a
 * codebase interprets a string as markup, "we never do that" stops being
 * true and every later reader has to check. `codeToHast` returns a tree
 * instead, and a tree is walkable — see the markdown renderer, which does
 * the same thing with the same reasoning.
 */

// Only the languages the documentation actually uses. Shiki loads a
// grammar per language, so listing them explicitly keeps the highlighter
// small; a fence in an unknown language renders unhighlighted rather than
// throwing the build.
const LANGS = [
  "bash",
  "go",
  "http",
  "javascript",
  "json",
  "python",
  "ruby",
  "tsx",
  "typescript",
  "yaml",
] as const;

const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  console: "bash",
  curl: "bash",
  py: "python",
  rb: "ruby",
  yml: "yaml",
};

// One highlighter for the whole build. Creating one per code block loads
// every grammar again and turns a fast build into a slow one.
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ["tokyo-night"],
    langs: [...LANGS],
  });
  return highlighterPromise;
}

export function resolveLang(lang: string | undefined): string | null {
  if (!lang) return null;
  const normalized = ALIASES[lang.toLowerCase()] ?? lang.toLowerCase();
  return (LANGS as readonly string[]).includes(normalized) ? normalized : null;
}

/* Shiki's tree. Narrow on purpose — these are the only node shapes it
   emits, and anything else falls through to nothing. */
type HastText = { type: "text"; value: string };
type HastElement = {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};
type HastRoot = { type: "root"; children?: HastNode[] };
type HastNode = HastRoot | HastElement | HastText | { type: string };

/** `color:#F97583;font-style:italic` -> a React style object. */
function parseStyle(value: unknown): CSSProperties | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const style: Record<string, string> = {};
  for (const declaration of value.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const property = declaration.slice(0, colon).trim();
    const propertyValue = declaration.slice(colon + 1).trim();
    if (!property || !propertyValue) continue;
    style[property.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = propertyValue;
  }
  return Object.keys(style).length ? (style as CSSProperties) : undefined;
}

function renderNodes(nodes: HastNode[] | undefined): ReactNode {
  if (!nodes) return null;
  return nodes.map((node, i) => <HastFragment key={i} node={node} />);
}

function HastFragment({ node }: { node: HastNode }): ReactNode {
  if (node.type === "text") return (node as HastText).value;

  if (node.type === "root") return renderNodes((node as HastRoot).children);

  if (node.type === "element") {
    const element = node as HastElement;
    const children = renderNodes(element.children);

    // Shiki nests pre > code > span. `pre` and `code` are re-created here
    // with our own classes rather than Shiki's, because the surrounding
    // chrome owns the padding, the scrolling and the background — the
    // theme only decides the colour of the words.
    if (element.tagName === "pre") {
      return (
        <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed">
          {children}
        </pre>
      );
    }
    if (element.tagName === "code") return <code className="font-mono">{children}</code>;
    if (element.tagName === "span") {
      return <span style={parseStyle(element.properties?.style)}>{children}</span>;
    }
    // Any other tag: keep the words, drop the element.
    return <>{children}</>;
  }

  return null;
}

export async function HighlightedCode({ code, lang }: { code: string; lang: string | null }) {
  if (!lang) {
    return (
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed text-code-ink">
        <code className="font-mono">{code}</code>
      </pre>
    );
  }

  const highlighter = await getHighlighter();
  const tree = highlighter.codeToHast(code, { lang, theme: "tokyo-night" });
  return <>{renderNodes(tree.children as HastNode[])}</>;
}
