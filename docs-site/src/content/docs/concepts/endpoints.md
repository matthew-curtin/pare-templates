---
title: Endpoints
description: Registering a destination, subscribing to types, and what happens when one goes bad.
order: 2
---

An endpoint is a URL that receives events, together with the types it is
subscribed to and the secret its signatures are computed with.

```json
{
  "id": "ep_9c4ktw02mn",
  "url": "https://hooks.acme.example/rookery",
  "types": ["invoice.paid", "invoice.voided"],
  "enabled": true,
  "created_at": "2026-07-14T09:38:04Z"
}
```

## Subscriptions

`types` matches exactly. `invoice.paid` does not match `invoice.paid.late`,
and there is no prefix matching — a rule that is occasionally annoying and
prevents a much worse failure, where adding a type quietly starts
delivering it to subscribers who never asked.

The one wildcard is `"*"`, which subscribes to everything **including
types added later**. That is genuinely useful for an internal archiver and
almost always wrong for a customer's endpoint.

```bash
rookery endpoints update ep_9c4ktw02mn \
  --types invoice.paid,invoice.voided,invoice.refunded
```

`types` is replaced, not merged. Send the full list you want, every time.

## The secret

Each endpoint has its own signing secret, returned once when the endpoint
is created and never readable again.

Per-endpoint rather than per-account, for a reason worth stating: if one
subscriber's secret leaks, only requests to that subscriber can be forged.
A single account-wide secret would make one leak a problem for every
destination you have.

Rolling a secret is a two-step so that it does not drop requests:

```bash
rookery endpoints roll-secret ep_9c4ktw02mn --grace 24h
```

Both the old and the new secret verify for the grace period. Deploy the
new one, confirm traffic verifies against it, and the old expires on its
own.

## Disabling

An endpoint can be turned off without deleting it. Disabling stops future
deliveries; anything already queued still runs.

We disable endpoints automatically in one case: **seven consecutive
exhausted deliveries**. The account owner gets an email, the dashboard
shows the reason, and nothing is deleted. Re-enabling replays nothing —
use [delivery retry](/docs/concepts/deliveries) for that.

The threshold is high on purpose. A subscriber who is down for an hour
should not need a support ticket to come back.

## Requirements

- **`https://` only** in live mode. Plain HTTP is accepted in test mode
  and nowhere else.
- **A valid certificate chain.** Self-signed certificates are refused; the
  attempt is recorded with the TLS error so it is visible in the log
  rather than looking like a timeout.
- **Answer within 10 seconds.** Slower than that is recorded as a timeout
  and retried, no matter what your handler eventually did.
- **Any 2xx is success.** `200`, `201` and `204` are equivalent to us. A
  `3xx` is *not* followed — a redirect on a webhook endpoint is nearly
  always a proxy misconfiguration, and following it would deliver your
  payload somewhere nobody registered.

## Testing one

`ping` sends a `rookery.ping` event to a single endpoint, which is a fast
way to confirm the URL, the certificate and the signature check all work
before real traffic depends on them.

```bash
rookery endpoints ping ep_9c4ktw02mn
```

```text
→ POST https://hooks.acme.example/rookery
← 200 in 143ms
✓ delivered
```
