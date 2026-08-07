/**
 * A single sentence of typed content that may contain `backticked` terms.
 *
 * Parameter descriptions and library notes are one line each and carry the
 * occasional identifier. Running the whole markdown pipeline over them
 * would be silly; leaving the backticks as literal characters looks like a
 * bug, which is exactly what it did on the libraries page before this
 * existed.
 *
 * It lives in its own file because two pages need it. The first version
 * was a local helper inside the reference page, and the libraries page
 * simply printed `notes` raw — which is the ordinary way one concern ends
 * up with two implementations, one of them missing.
 *
 * Splitting on the backtick means the odd-numbered pieces are the code
 * spans. Nothing here can render anything but text either way.
 */
export function InlineCodeText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((piece, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="break-path rounded border border-border bg-surface px-1 py-px font-mono text-[0.875em] text-ink"
          >
            {piece}
          </code>
        ) : (
          <span key={i}>{piece}</span>
        ),
      )}
    </>
  );
}
