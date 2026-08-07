import type { DocGroup, Sample, Site } from "./types";

export const site: Site = {
  name: "Rookery",
  tagline: "Webhooks that arrive.",
  description:
    "Rookery delivers your webhooks. Publish an event once and we fan it out to every subscribed endpoint, sign each request, retry the ones that fail, and keep a log you can search.",
  apiBase: "https://api.rookery.dev/v1",
  currentVersion: "2026-07-14",
  nav: [
    { label: "Documentation", href: "/docs" },
    { label: "API reference", href: "/reference" },
    { label: "Libraries", href: "/sdks" },
    { label: "Changelog", href: "/changelog" },
  ],
  footer: [
    {
      heading: "Documentation",
      links: [
        { label: "Introduction", href: "/docs/getting-started/introduction" },
        { label: "Quickstart", href: "/docs/getting-started/quickstart" },
        { label: "Authentication", href: "/docs/getting-started/authentication" },
        { label: "Verifying signatures", href: "/docs/guides/verifying-signatures" },
      ],
    },
    {
      heading: "Reference",
      links: [
        { label: "API reference", href: "/reference" },
        { label: "Client libraries", href: "/sdks" },
        { label: "CLI", href: "/docs/tooling/cli" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      heading: "Concepts",
      links: [
        { label: "Events", href: "/docs/concepts/events" },
        { label: "Endpoints", href: "/docs/concepts/endpoints" },
        { label: "Deliveries", href: "/docs/concepts/deliveries" },
        { label: "Retries and failure", href: "/docs/guides/retries-and-failure" },
      ],
    },
  ],
};

/**
 * The order the documentation appears in, and the label each folder gets.
 *
 * This is the one hand-maintained list in the docs pipeline. Everything
 * else — which pages exist, what they are called, what order they sit in
 * within a group — comes from the markdown files themselves. A folder that
 * is not named here is skipped rather than appended, so a scratch
 * directory cannot quietly turn up in the sidebar.
 */
export const docGroups: DocGroup[] = [
  { dir: "getting-started", label: "Getting started" },
  { dir: "concepts", label: "Core concepts" },
  { dir: "guides", label: "Guides" },
  { dir: "tooling", label: "Tooling" },
];

/** The landing page's tabbed sample: publish one event, five ways. */
export const quickstartSamples: Sample[] = [
  {
    language: "bash",
    label: "cURL",
    code: `curl https://api.rookery.dev/v1/events \\
  -H "Authorization: Bearer $ROOKERY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "invoice.paid",
    "data": { "invoice_id": "in_8121", "amount": 4200 }
  }'`,
  },
  {
    language: "javascript",
    label: "Node",
    code: `import { Rookery } from "@rookery/node";

const rookery = new Rookery(process.env.ROOKERY_API_KEY);

await rookery.events.publish({
  type: "invoice.paid",
  data: { invoiceId: "in_8121", amount: 4200 },
});`,
  },
  {
    language: "python",
    label: "Python",
    code: `import os
from rookery import Rookery

rookery = Rookery(api_key=os.environ["ROOKERY_API_KEY"])

rookery.events.publish(
    type="invoice.paid",
    data={"invoice_id": "in_8121", "amount": 4200},
)`,
  },
  {
    language: "go",
    label: "Go",
    code: `client := rookery.New(os.Getenv("ROOKERY_API_KEY"))

_, err := client.Events.Publish(ctx, &rookery.EventParams{
	Type: "invoice.paid",
	Data: map[string]any{"invoice_id": "in_8121", "amount": 4200},
})`,
  },
  {
    language: "ruby",
    label: "Ruby",
    code: `require "rookery"

rookery = Rookery::Client.new(ENV.fetch("ROOKERY_API_KEY"))

rookery.events.publish(
  type: "invoice.paid",
  data: { invoice_id: "in_8121", amount: 4_200 }
)`,
  },
];
