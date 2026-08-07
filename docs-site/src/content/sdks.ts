import type { Sdk } from "./types";

export const sdks: Sdk[] = [
  {
    language: "Node.js",
    name: "@rookery/node",
    version: "4.2.0",
    install: "npm install @rookery/node",
    sampleLanguage: "javascript",
    sample: `import { Rookery } from "@rookery/node";

const rookery = new Rookery(process.env.ROOKERY_API_KEY);

// Publish
await rookery.events.publish({
  type: "invoice.paid",
  data: { invoiceId: "in_8121" },
});

// Verify an incoming request
const event = rookery.webhooks.verify(
  rawBody,
  req.headers["rookery-signature"],
  process.env.ROOKERY_SIGNING_SECRET,
);`,
    notes:
      "Ships its own types. `webhooks.verify` takes the raw body — a parsed object will not verify, because the signature covers the bytes.",
  },
  {
    language: "Python",
    name: "rookery",
    version: "3.8.1",
    install: "pip install rookery",
    sampleLanguage: "python",
    sample: `import os
from rookery import Rookery

rookery = Rookery(api_key=os.environ["ROOKERY_API_KEY"])

# Publish
rookery.events.publish(type="invoice.paid", data={"invoice_id": "in_8121"})

# Verify an incoming request
event = rookery.webhooks.verify(
    raw_body,
    request.headers["Rookery-Signature"],
    os.environ["ROOKERY_SIGNING_SECRET"],
)`,
    notes:
      "Synchronous by default. `from rookery.aio import Rookery` gives the same surface with awaitable methods.",
  },
  {
    language: "Go",
    name: "github.com/rookery/rookery-go",
    version: "2.1.4",
    install: "go get github.com/rookery/rookery-go",
    sampleLanguage: "go",
    sample: `client := rookery.New(os.Getenv("ROOKERY_API_KEY"))

// Publish
_, err := client.Events.Publish(ctx, &rookery.EventParams{
	Type: "invoice.paid",
	Data: map[string]any{"invoice_id": "in_8121"},
})

// Verify an incoming request
event, err := rookery.VerifyWebhook(
	rawBody,
	r.Header.Get("Rookery-Signature"),
	os.Getenv("ROOKERY_SIGNING_SECRET"),
)`,
    notes:
      "Every call takes a `context.Context`. Cancelling it cancels the request in flight rather than abandoning it.",
  },
  {
    language: "Ruby",
    name: "rookery",
    version: "3.0.2",
    install: "gem install rookery",
    sampleLanguage: "ruby",
    sample: `require "rookery"

rookery = Rookery::Client.new(ENV.fetch("ROOKERY_API_KEY"))

# Publish
rookery.events.publish(type: "invoice.paid", data: { invoice_id: "in_8121" })

# Verify an incoming request
event = Rookery::Webhook.verify(
  raw_body,
  request.headers["Rookery-Signature"],
  ENV.fetch("ROOKERY_SIGNING_SECRET")
)`,
    notes: "Rails users: read the body with `request.raw_post`, before any middleware parses it.",
  },
];
