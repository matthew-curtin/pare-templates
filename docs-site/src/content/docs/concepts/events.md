---
title: Events
description: What an event is, how to name one, and why ordering is not guaranteed.
order: 1
---

An event is a record that something happened. It has a `type`, a `data`
payload, and a time. Once published it never changes — there is no update
endpoint, deliberately, because subscribers may already have acted on it.

```json
{
  "id": "ev_2p8fq1x0kd",
  "type": "invoice.paid",
  "data": { "invoice_id": "in_8121", "amount": 4200 },
  "occurred_at": "2026-07-14T09:41:22Z"
}
```

## Naming types

Use `noun.verb`, past tense: `invoice.paid`, `user.deleted`,
`shipment.delayed`. Subscriptions match the string exactly, so the naming
scheme is an API you are committing to — renaming a type later breaks
every subscriber silently, since they simply stop matching.

Two conventions worth adopting early:

- **Name what happened, not what you want done about it.** `invoice.paid`
  survives a change of mind about consequences; `send_receipt` does not.
- **Keep the noun stable and add verbs.** Subscribers filter on the whole
  string, but humans read the prefix, and a consistent one makes the list
  navigable at fifty types.

## What to put in the payload

Include enough that a receiver can act without calling you back, but not
so much that the payload becomes an API of its own.

```json
{
  "type": "invoice.paid",
  "data": {
    "invoice_id": "in_8121",
    "customer_id": "cus_41mz",
    "amount": 4200,
    "currency": "GBP",
    "paid_at": "2026-07-14T09:41:19Z"
  }
}
```

Three things not to put in:

1. **Anything secret.** The payload is stored, logged, and visible in the
   dashboard to anyone on your team.
2. **Anything you cannot commit to.** Fields are easy to add and painful
   to remove; every one is a promise to whoever started reading it.
3. **Whole nested object graphs.** Send ids and let the receiver fetch
   what it needs at the version it understands. Payloads are capped at
   256 KB, but the practical limit is much lower.

## Ordering

**Events are not delivered in order, and no setting changes that.**

Deliveries retry independently. If `invoice.created` is refused once and
`invoice.paid` succeeds first time, the second arrives before the first —
by about thirty seconds, in the common case.

This is a real constraint and it is worth designing for rather than
working around:

- **Make handlers idempotent and order-independent.** Set state from the
  payload rather than incrementing from it.
- **If order matters, carry a sequence number** in the payload and let the
  receiver hold or discard anything it has already passed.
- **Prefer events that carry the resulting state** over events that
  describe a transition. `subscription.updated` with the new plan is safe
  to apply twice, in any order; `plan_incremented` is not.

> The alternative — a strictly ordered stream — sounds better than it is
> in practice. It means one unreachable subscriber holds up the queue for
> everyone behind it, and the first slow receiver becomes everybody's
> outage.

## Idempotency when publishing

Publishing is a network call, and network calls fail after succeeding.
Pass an `idempotency_key` and a repeat within 24 hours returns the
original event rather than creating a second one.

```bash
curl https://api.rookery.dev/v1/events \
  -H "Authorization: Bearer $ROOKERY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "invoice.paid",
    "idempotency_key": "in_8121-paid",
    "data": { "invoice_id": "in_8121", "amount": 4200 }
  }'
```

Derive the key from the thing that happened, as above — not from a random
value generated at call time, which is a fresh key on every retry and
therefore does nothing at all.
