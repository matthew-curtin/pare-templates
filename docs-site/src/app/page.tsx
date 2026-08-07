import Link from "next/link";
import { HighlightedCode, resolveLang } from "@/components/highlighted-code";
import { SampleTabs } from "@/components/sample-tabs";
import { quickstartSamples, site } from "@/content/site";

const PILLARS = [
  {
    title: "Publish once",
    body: "Send an event to one endpoint. We work out who is subscribed and fan it out, so adding a subscriber is not a deploy.",
    href: "/docs/concepts/events",
    linkText: "Events",
  },
  {
    title: "Signed, every time",
    body: "Each request carries an HMAC over the timestamp and the exact bytes of the body, so a receiver can prove it came from you.",
    href: "/docs/guides/verifying-signatures",
    linkText: "Verifying signatures",
  },
  {
    title: "Seven attempts, then told",
    body: "Failures retry over about a day with jittered backoff. When one finally gives up you get an event about it, not a silence.",
    href: "/docs/guides/retries-and-failure",
    linkText: "Retries and failure",
  },
];

const NEXT_STEPS = [
  {
    title: "Quickstart",
    body: "Register an endpoint, publish an event, watch it arrive.",
    href: "/docs/getting-started/quickstart",
  },
  {
    title: "API reference",
    body: "Ten endpoints, with parameters and example responses.",
    href: "/reference",
  },
  {
    title: "Client libraries",
    body: "Node, Python, Go and Ruby, each with verification built in.",
    href: "/sdks",
  },
  {
    title: "CLI",
    body: "Tunnel a webhook to localhost, and replay any delivery.",
    href: "/docs/tooling/cli",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="grid items-start gap-10 py-14 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-wide text-accent uppercase">
            API version {site.currentVersion}
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-7 text-ink-muted">{site.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started/quickstart"
              className="focus-ring rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Start the quickstart
            </Link>
            <Link
              href="/reference"
              className="focus-ring rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:border-border-strong hover:bg-surface"
            >
              API reference
            </Link>
          </div>

          <p className="mt-6 text-sm text-ink-subtle">
            New here? {""}
            <Link href="/docs/getting-started/introduction" className="prose-link focus-ring">
              The introduction
            </Link>{" "}
            explains the four objects everything else is built from.
          </p>
        </div>

        {/* Every panel is highlighted on the server; the tabs only choose
            which is visible. */}
        <div className="min-w-0">
          <SampleTabs labels={quickstartSamples.map((s) => s.label)}>
            {quickstartSamples.map((sample) => (
              <HighlightedCode
                key={sample.label}
                code={sample.code}
                lang={resolveLang(sample.language)}
              />
            ))}
          </SampleTabs>
          <p className="mt-3 text-xs text-ink-subtle">
            Publishing an event. Every subscribed endpoint gets its own delivery.
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-t border-border py-14 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="min-w-0">
            <h2 className="font-semibold tracking-tight">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{pillar.body}</p>
            <Link href={pillar.href} className="prose-link focus-ring mt-3 inline-block text-sm">
              {pillar.linkText} →
            </Link>
          </div>
        ))}
      </section>

      <section className="border-t border-border py-14">
        <h2 className="text-lg font-semibold tracking-tight">Where to go</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NEXT_STEPS.map((step) => (
            <li key={step.href} className="min-w-0">
              <Link
                href={step.href}
                className="focus-ring group block h-full rounded-lg border border-border p-4 transition hover:border-border-strong hover:bg-surface"
              >
                <span className="block font-medium group-hover:text-accent">{step.title}</span>
                <span className="mt-1 block text-sm leading-6 text-ink-muted">{step.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
