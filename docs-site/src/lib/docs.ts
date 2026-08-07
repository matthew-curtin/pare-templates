import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, type Token, type Tokens } from "marked";
import { docGroups } from "@/content/site";
import { uniqueSlug } from "./slug";

const DOCS_DIR = path.join(process.cwd(), "src/content/docs");
const CHANGELOG_DIR = path.join(process.cwd(), "src/content/changelog");

/**
 * A heading token, once we have given it an id.
 *
 * The id is written onto the token rather than recomputed by whoever needs
 * it. Two things consume it — the renderer, which puts it on the <h2>, and
 * the table of contents, which builds the #fragment that jumps there — and
 * if they each derived it from the text they would agree right up until
 * one of them changed. Computing it once and reading it twice makes them
 * agree structurally instead of coincidentally.
 */
export type IdentifiedHeading = Tokens.Heading & { id: string };

export type Heading = { id: string; text: string; depth: number };

export type DocMeta = {
  /** Route slug, e.g. `guides/verifying-signatures`. */
  slug: string;
  title: string;
  description: string;
  /** Directory name, which is also the group key in `docGroups`. */
  group: string;
  order: number;
};

export type Doc = DocMeta & {
  tokens: Token[];
  headings: Heading[];
};

export type NavGroup = { dir: string; label: string; items: DocMeta[] };

function readMarkdownFiles(dir: string): { relPath: string; raw: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((p) => p.endsWith(".md"))
    // readdir returns the platform separator; routes are always forward slashes.
    .map((p) => ({
      relPath: p.split(path.sep).join("/"),
      raw: fs.readFileSync(path.join(dir, p), "utf8"),
    }));
}

/**
 * Lex the body once, then walk it once to assign heading ids.
 *
 * Everything downstream — the page, the table of contents, the search
 * index — works from this single result.
 */
function prepare(body: string): { tokens: Token[]; headings: Heading[] } {
  const tokens = marked.lexer(body);
  const taken = new Set<string>();
  const headings: Heading[] = [];

  for (const token of tokens) {
    if (token.type !== "heading") continue;
    const heading = token as IdentifiedHeading;
    heading.id = uniqueSlug(heading.text, taken);
    // h1 is the page title, rendered from frontmatter above the body, so
    // it never appears in the contents list.
    if (heading.depth >= 2 && heading.depth <= 3) {
      headings.push({ id: heading.id, text: heading.text, depth: heading.depth });
    }
  }

  return { tokens, headings };
}

function parseDoc(relPath: string, raw: string): Doc {
  const { data, content } = matter(raw);
  const slug = relPath.replace(/\.md$/, "");
  const group = slug.includes("/") ? slug.split("/")[0] : "";

  return {
    slug,
    group,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    order: typeof data.order === "number" ? data.order : 999,
    ...prepare(content),
  };
}

export function getAllDocs(): Doc[] {
  return readMarkdownFiles(DOCS_DIR).map(({ relPath, raw }) => parseDoc(relPath, raw));
}

export function getDoc(slug: string): Doc | null {
  return getAllDocs().find((d) => d.slug === slug) ?? null;
}

/**
 * The sidebar, built from the files on disk rather than a hand-written
 * list. Adding a markdown file to a group folder puts it in the navigation
 * with no second edit — which is the whole reason the docs are markdown
 * and not typed data.
 *
 * Group order comes from `docGroups`; a folder nobody has declared there
 * is skipped rather than appended, so a stray directory cannot quietly
 * appear in the navigation.
 */
export function getNav(): NavGroup[] {
  const docs = getAllDocs();
  return docGroups
    .map(({ dir, label }) => ({
      dir,
      label,
      items: docs
        .filter((d) => d.group === dir)
        .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
        .map(({ slug, title, description, group, order }) => ({
          slug,
          title,
          description,
          group,
          order,
        })),
    }))
    .filter((g) => g.items.length > 0);
}

/** Flat reading order, which is what prev/next walks. */
export function getReadingOrder(): DocMeta[] {
  return getNav().flatMap((g) => g.items);
}

export function getAdjacent(slug: string): { prev: DocMeta | null; next: DocMeta | null } {
  const order = getReadingOrder();
  const i = order.findIndex((d) => d.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: order[i - 1] ?? null, next: order[i + 1] ?? null };
}

export type Release = {
  version: string;
  date: string;
  kind: string;
  tokens: Token[];
};

export function getReleases(): Release[] {
  return readMarkdownFiles(CHANGELOG_DIR)
    .map(({ raw }) => {
      const { data, content } = matter(raw);
      return {
        version: String(data.version ?? "0.0.0"),
        date: String(data.date ?? ""),
        kind: String(data.kind ?? "Release"),
        tokens: marked.lexer(content),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type SearchEntry = {
  title: string;
  href: string;
  /** Where this sits, shown under the title in the results list. */
  context: string;
};

/**
 * A flat index built at build time and handed to the search dialog as
 * plain data. Every doc contributes its own title plus each of its h2/h3
 * headings, so searching for "signature" finds the section rather than
 * only the page it lives on.
 */
export function getSearchIndex(): SearchEntry[] {
  const labelFor = new Map(docGroups.map((g) => [g.dir, g.label]));
  const entries: SearchEntry[] = [];

  for (const group of getNav()) {
    for (const item of group.items) {
      const doc = getDoc(item.slug);
      entries.push({
        title: item.title,
        href: `/docs/${item.slug}`,
        context: group.label,
      });
      for (const heading of doc?.headings ?? []) {
        entries.push({
          title: heading.text,
          href: `/docs/${item.slug}#${heading.id}`,
          context: `${labelFor.get(group.dir) ?? group.label} · ${item.title}`,
        });
      }
    }
  }

  // The pages that are typed data rather than markdown still belong in
  // search — a reader looking for "list endpoints" does not know or care
  // which of the two pipelines produced the page.
  entries.push(
    { title: "API reference", href: "/reference", context: "Reference" },
    { title: "Client libraries", href: "/sdks", context: "Reference" },
    { title: "Changelog", href: "/changelog", context: "Reference" },
  );

  return entries;
}
