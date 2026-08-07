/**
 * Turning a heading into the id you can link to.
 *
 * Kept separate from the markdown renderer because two things need to
 * agree on the answer: the renderer, which puts the id on the heading, and
 * the table of contents, which builds the `#fragment` that jumps to it. If
 * they ever compute it differently the links silently go nowhere, and a
 * link that scrolls to the wrong place looks like a design problem rather
 * than a string problem.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Headings repeat — "Parameters" appears under every endpoint. Ids have to
 * be unique on a page or the browser jumps to whichever came first, so the
 * second occurrence becomes `parameters-2`.
 */
export function uniqueSlug(text: string, taken: Set<string>): string {
  const base = slugify(text) || "section";
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  taken.add(slug);
  return slug;
}
