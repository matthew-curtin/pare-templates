---
title: Retries and failure
description: The schedule, what counts as a failure, and what to do about an exhausted delivery.
order: 2
---

A delivery gets seven attempts over roughly a day. The schedule is fixed
and not configurable.

| Attempt | When | Elapsed |
| ---: | --- | ---: |
| 1 | immediately | — |
| 2 | 30 seconds later | 30s |
| 3 | 2 minutes later | 2m 30s |
| 4 | 10 minutes later | 12m 30s |
| 5 | 1 hour later | 1h 12m |
| 6 | 6 hours later | 7h 12m |
| 7 | 18 hours later | 25h 12m |

Each interval is jittered by up to 10% so that a subscriber recovering
from an outage does not get every queued delivery in the same instant —
which is a reliable way to knock over a server that has only just come
back.

After the seventh, the delivery is `exhausted` and nothing further is
scheduled automatically.

## What counts as a failure

- Any status outside `2xx`
- A connection that could not be established, or was refused
- A TLS error, including an expired or self-signed certificate
- No response within 10 seconds
- A `3xx` — redirects are not followed

`4xx` is retried along with everything else. A `404` is usually a deploy
in progress rather than a permanent statement about the URL, and treating
it as fatal would mean losing events during every rollout.

The one exception is `410 Gone`, which we take at its word: the delivery
is marked exhausted immediately and no further attempts are made. Use it
if you have genuinely retired a receiver and cannot deregister it.

## Reading the pattern

The shape of the failures usually says what is wrong.

- **First attempt fails, second succeeds.** Normal. A restart, a brief
  network blip. No action.
- **Every attempt times out at exactly 10 seconds.** The handler is doing
  the work before acknowledging. Answer first, work afterwards.
- **Every attempt returns `401` or `403`.** Something in front of the
  application — a WAF, basic auth, an IP allowlist — is refusing the
  request before it reaches the handler.
- **Every attempt returns `400`.** Signature verification is failing.
  [Verifying signatures](/docs/guides/verifying-signatures) lists the four
  usual causes.
- **Attempts 1–4 fail, 5 succeeds.** A real outage of a few minutes, ridden
  out exactly as intended.

## When a delivery is exhausted

Fix the receiver, then replay:

```bash
rookery deliveries list \
  --status exhausted \
  --endpoint ep_9c4ktw02mn \
  --since 2026-07-14T08:00:00Z
```

Check that list before you act on it. Then add `--retry`:

```bash
rookery deliveries list \
  --status exhausted \
  --endpoint ep_9c4ktw02mn \
  --since 2026-07-14T08:00:00Z \
  --retry
```

Manual retries do not consume automatic attempts, and they arrive in no
guaranteed order — a receiver that is not idempotent will have a bad time
with a large replay.

## Being told about it

Subscribe an endpoint to `rookery.delivery.exhausted` and you will receive
an event whenever one gives up. It is delivered like any other event, with
the usual caveat that a receiver watching for its own failures should not
be the receiver that is failing.

```json
{
  "type": "rookery.delivery.exhausted",
  "data": {
    "delivery_id": "dl_6gz19prx02",
    "endpoint_id": "ep_4m7bnq81zx",
    "event_id": "ev_2p8fq1x0kd",
    "last_status_code": 503,
    "attempts": 7
  }
}
```

Seven consecutive exhausted deliveries disable the endpoint automatically
and email the account owner. Nothing is deleted, and re-enabling replays
nothing — see [Endpoints](/docs/concepts/endpoints).
