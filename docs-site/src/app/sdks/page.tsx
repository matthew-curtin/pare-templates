import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { HighlightedCode, resolveLang } from "@/components/highlighted-code";
import { InlineCodeText } from "@/components/inline-code-text";
import { sdks } from "@/content/sdks";

export const metadata: Metadata = {
  title: "Client libraries",
  description: "Official libraries for Node, Python, Go and Ruby.",
};

export default function SdksPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Client libraries</h1>
        <p className="mt-2 text-[17px] leading-7 text-ink-muted">
          Every library covers the whole API and includes signature verification. Use the
          verification helper rather than writing your own — it is nine lines, and{" "}
          <Link href="/docs/guides/verifying-signatures" className="prose-link focus-ring">
            four of them are easy to get wrong
          </Link>
          .
        </p>
      </header>

      <div className="space-y-12">
        {sdks.map((sdk) => (
          <section key={sdk.name} id={sdk.language.toLowerCase().replace(/[^a-z]/g, "")}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight">{sdk.language}</h2>
              <code className="break-path font-mono text-sm text-ink-muted">{sdk.name}</code>
              <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11px] text-ink-subtle">
                v{sdk.version}
              </span>
            </div>

            <div className="mt-4">
              <CodeBlock code={sdk.install} label="bash">
                <HighlightedCode code={sdk.install} lang="bash" />
              </CodeBlock>
            </div>

            <CodeBlock code={sdk.sample} label={sdk.sampleLanguage}>
              <HighlightedCode code={sdk.sample} lang={resolveLang(sdk.sampleLanguage)} />
            </CodeBlock>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              <InlineCodeText text={sdk.notes} />
            </p>
          </section>
        ))}
      </div>

      <section className="mt-14 rounded-lg border border-border bg-surface p-6">
        <h2 className="font-semibold tracking-tight">No library for your language?</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          The API is plain HTTP and JSON, and signature verification is HMAC-SHA256 over the
          timestamp and the raw body — about nine lines in anything.{" "}
          <Link href="/docs/guides/verifying-signatures" className="prose-link focus-ring">
            Verifying signatures
          </Link>{" "}
          gives the algorithm in full, and the{" "}
          <Link href="/reference" className="prose-link focus-ring">
            API reference
          </Link>{" "}
          covers every endpoint.
        </p>
      </section>
    </main>
  );
}
