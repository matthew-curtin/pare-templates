import type { Metadata } from "next";
import { HighlightedCode } from "@/components/highlighted-code";
import { InlineCodeText } from "@/components/inline-code-text";
import { endpointGroups } from "@/content/reference";
import { site } from "@/content/site";
import type { Endpoint } from "@/content/types";

export const metadata: Metadata = {
  title: "API reference",
  description: "Every endpoint, with its parameters and an example response.",
};

/* Method colours come from the status tokens rather than being invented
   here, so a badge on this page matches a badge anywhere else. */
const METHOD_STYLE: Record<Endpoint["method"], string> = {
  GET: "bg-note-soft text-note",
  POST: "bg-good-soft text-good",
  PATCH: "bg-warn-soft text-warn",
  DELETE: "bg-danger-soft text-danger",
};

export default function ReferencePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6">
      {/* This page's own contents list. It is built from typed data rather
          than extracted from markdown, which is the point — see the note
          in content/reference.ts. */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
          <nav aria-label="API reference">
            {endpointGroups.map((group) => (
              <div key={group.id} className="mb-6 last:mb-0">
                <h2 className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">
                  {group.title}
                </h2>
                <ul className="space-y-0.5">
                  {group.endpoints.map((endpoint) => (
                    <li key={endpoint.id}>
                      <a
                        href={`#${endpoint.id}`}
                        className="focus-ring block rounded-md px-2 py-1.5 text-sm text-ink-muted transition hover:bg-surface-hover hover:text-ink"
                      >
                        {endpoint.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 py-8 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">API reference</h1>
          <p className="mt-2 max-w-2xl text-[17px] leading-7 text-ink-muted">
            Every request is authenticated with a bearer token and returns JSON. The base URL is{" "}
            <code className="break-path rounded border border-border bg-surface px-1 py-0.5 font-mono text-[0.875em]">
              {site.apiBase}
            </code>
            .
          </p>
        </header>

        <div className="space-y-16">
          {endpointGroups.map((group) => (
            <section key={group.id} id={group.id}>
              <h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
              <p className="mt-2 max-w-2xl leading-7 text-ink-muted">{group.description}</p>

              <div className="mt-8 space-y-12">
                {group.endpoints.map((endpoint) => (
                  <article key={endpoint.id} id={endpoint.id} className="scroll-mt-24">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${METHOD_STYLE[endpoint.method]}`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="break-path font-mono text-sm text-ink">{endpoint.path}</code>
                    </div>

                    <h3 className="mt-3 text-base font-semibold">{endpoint.title}</h3>
                    <p className="mt-1.5 max-w-2xl leading-7 text-ink-muted">
                      {endpoint.description}
                    </p>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className="min-w-0">
                        <h4 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                          Parameters
                        </h4>
                        <dl className="divide-y divide-border rounded-lg border border-border">
                          {endpoint.params.map((param) => (
                            <div key={param.name} className="px-3 py-2.5">
                              <dt className="flex flex-wrap items-baseline gap-2">
                                <code className="font-mono text-[13px] font-medium text-ink">
                                  {param.name}
                                </code>
                                <span className="font-mono text-[11px] text-ink-subtle">
                                  {param.type}
                                </span>
                                {param.required && (
                                  <span className="rounded bg-danger-soft px-1 py-px text-[10px] font-medium text-danger">
                                    required
                                  </span>
                                )}
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-ink-muted">
                                <InlineCodeText text={param.description} />
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className="min-w-0">
                        <h4 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                          Response
                        </h4>
                        <div className="overflow-hidden rounded-lg border border-code-border bg-code">
                          <HighlightedCode code={endpoint.response} lang="json" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
