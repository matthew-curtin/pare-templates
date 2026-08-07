---
title: Deliveries
description: One event, one endpoint, up to seven attempts — and how to read the log.
order: 3
---

A delivery is one event on its way to one endpoint. Publishing an event
that three endpoints subscribe to creates three deliveries, and they
succeed or fail independently of each other.

Inside a delivery are **attempts** — individual HTTP requests. This is the
distinction worth being precise about, because nearly every confused
support conversation is really about it: "the webhook failed" is usually
one attempt failing inside a delivery that went on to succeed.

## Status

| Status | Meaning |
| --- | --- |
| `pending` | Queued, or waiting for its next attempt |
| `succeeded` | An attempt got a 2xx. No more will be made |
| `failed` | The last attempt failed; another is scheduled |
| `exhausted` | All seven attempts failed. Nothing further is scheduled |

`failed` and `exhausted` are worth separating in your own alerting.
`failed` is normal — it happens thousands of times a day across any real
account and resolves itself. `exhausted` means a subscriber has now
genuinely missed an event, and is the one worth waking someone for.

## Reading a delivery

```bash
rookery deliveries get dl_7ha20qsz13
```

```json
{
  "id": "dl_7ha20qsz13",
  "event_id": "ev_2p8fq1x0kd",
  "endpoint_id": "ep_9c4ktw02mn",
  "status": "succeeded",
  "attempts": [
    {
      "number": 1,
      "at": "2026-07-14T09:41:23Z",
      "status_code": 502,
      "duration_ms": 3021,
      "error": "bad gateway"
    },
    {
      "number": 2,
      "at": "2026-07-14T09:41:53Z",
      "status_code": 200,
      "duration_ms": 184
    }
  ]
}
```

Each attempt records the status code, how long it took, and the first
2 KB of the response body. That last part is there because the single most
useful thing when a subscriber says "we never got it" is what *their*
server said at the time, and it is usually a stack trace they did not know
they were returning.

## Retrying by hand

```bash
rookery deliveries retry dl_7ha20qsz13
```

A manual retry runs immediately whatever the status, including
`succeeded`, and **does not consume one of the seven automatic attempts**.
Retrying an exhausted delivery after the receiver is fixed is the intended
use.

To replay a batch after an outage, filter and retry together:

```bash
rookery deliveries list \
  --status exhausted \
  --endpoint ep_9c4ktw02mn \
  --since 2026-07-14T08:00:00Z \
  --retry
```

That will re-send everything matching, so check the list without
`--retry` first. A receiver that is not idempotent will process all of it
twice, and [Events](/docs/concepts/events) explains why we cannot promise
it will arrive in the order it went out.

## Retention

Deliveries and their attempts are kept for 30 days on the standard plan,
90 on business. After that the delivery record goes and the event itself
remains, so you can see that something was published without being able to
see how it went.

If you need longer, subscribe an archival endpoint with `"types": ["*"]`
and keep the payloads yourself.
