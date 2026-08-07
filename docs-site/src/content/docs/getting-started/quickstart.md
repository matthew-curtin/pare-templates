---
title: Quickstart
description: Publish your first event and watch it arrive, in about five minutes.
order: 2
---

By the end of this page you will have registered an endpoint, published an
event, and seen the delivery it produced. You need an API key from the
dashboard and somewhere for the webhook to land.

## 1. Somewhere to receive it

If you do not already have a receiver, the CLI will give you one. It opens
a tunnel and prints a public URL that forwards to your machine.

```bash
rookery listen --forward http://localhost:3000/webhooks
```

```text
→ Listening as ep_9c4ktw02mn
→ https://rk-quiet-fern-2841.rookery.dev  →  localhost:3000/webhooks
→ Signing secret: whsec_5f2b1a9d7e3c4086
```

Leave that running. Every request it forwards is printed, so this doubles
as the log for the rest of this page.

## 2. Register the endpoint

If you used `rookery listen`, this is already done — it registers the
tunnel for you and prints the id. Otherwise, register your own URL:

```bash
curl https://api.rookery.dev/v1/endpoints \
  -H "Authorization: Bearer $ROOKERY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://hooks.acme.example/rookery",
    "types": ["invoice.paid"]
  }'
```

The response contains a `secret`. **It is shown once and never again.**
Store it now — you need it to verify incoming requests, and the only
recovery is to roll the endpoint's secret and update the receiver.

```json
{
  "id": "ep_9c4ktw02mn",
  "url": "https://hooks.acme.example/rookery",
  "types": ["invoice.paid"],
  "secret": "whsec_5f2b1a9d7e3c4086",
  "enabled": true
}
```

## 3. Publish an event

```bash
curl https://api.rookery.dev/v1/events \
  -H "Authorization: Bearer $ROOKERY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "invoice.paid",
    "data": { "invoice_id": "in_8121", "amount": 4200 }
  }'
```

The response tells you how many deliveries were queued. If that number is
`0`, nothing is subscribed to `invoice.paid` — check the `types` on your
endpoint, since they match exactly and not by prefix.

```json
{
  "id": "ev_2p8fq1x0kd",
  "type": "invoice.paid",
  "occurred_at": "2026-07-14T09:41:22Z",
  "deliveries_queued": 1
}
```

## 4. Receive it

The request that arrives carries your payload untouched, plus the headers
that let you trust it.

```http
POST /webhooks HTTP/1.1
Content-Type: application/json
Rookery-Id: dl_7ha20qsz13
Rookery-Timestamp: 1784021882
Rookery-Signature: v1=4f7a1c2e9b60d8835ac1f0e27d4b6a91c8e35f02d7b419ae6c0f8d23a5471bce

{"id":"ev_2p8fq1x0kd","type":"invoice.paid","data":{"invoice_id":"in_8121","amount":4200}}
```

Verify it before you trust a byte of it. In Node:

```javascript
import express from "express";
import { Rookery } from "@rookery/node";

const app = express();

// The raw body, not a parsed one — the signature covers the exact bytes,
// so a re-serialised object will not verify even when it is equivalent.
app.post("/webhooks", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  try {
    event = Rookery.webhooks.verify(
      req.body,
      req.header("Rookery-Signature"),
      process.env.ROOKERY_SIGNING_SECRET,
    );
  } catch {
    return res.status(400).send("bad signature");
  }

  // Acknowledge first, work afterwards. Anything slower than 10 seconds
  // is recorded as a timeout and retried, however well it went.
  res.status(200).end();
  void handle(event);
});
```

## 5. See what happened

```bash
rookery deliveries list --limit 3
```

```text
dl_7ha20qsz13  invoice.paid   ep_9c4ktw02mn  succeeded   2 attempts   184ms
dl_6gz19prx02  invoice.paid   ep_4m7bnq81zx  exhausted   7 attempts   —
dl_5fy08oqw91  user.created   ep_9c4ktw02mn  succeeded   1 attempt     91ms
```

Two attempts on a successful delivery is normal and not a problem — the
first was refused while the receiver was still starting up, and the second
went through thirty seconds later. That is the system working.

## Next

- [Verifying signatures](/docs/guides/verifying-signatures) — do this
  before you go anywhere near production.
- [Retries and failure](/docs/guides/retries-and-failure) — the schedule,
  and what `exhausted` means.
- [Local development](/docs/guides/local-development) — the tunnel, replay
  and fixtures.
