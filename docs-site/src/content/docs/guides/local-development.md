---
title: Local development
description: Receiving real webhooks on your laptop, replaying them, and testing without a network.
order: 3
---

Webhooks are awkward to develop against because they arrive from outside,
and your laptop is not somewhere the internet can reach. There are three
ways round it, and they suit different moments.

## The tunnel

`rookery listen` registers a temporary endpoint, opens a tunnel, and
forwards everything it receives to a local URL.

```bash
rookery listen --forward http://localhost:3000/webhooks --types invoice.paid
```

```text
→ Listening as ep_9c4ktw02mn (test mode)
→ https://rk-quiet-fern-2841.rookery.dev  →  localhost:3000/webhooks
→ Signing secret: whsec_5f2b1a9d7e3c4086

09:41:23  invoice.paid   dl_7ha20qsz13  → 200  184ms
09:41:47  invoice.paid   dl_8ib31rta24  → 400  12ms   bad signature
```

Signatures are computed with the printed secret, so verification works
exactly as it will in production. That matters more than it sounds — a
local setup that skips verification is a local setup that cannot catch the
most common integration bug.

The endpoint is deleted when you stop the process. If it exits badly, the
next `rookery listen` cleans up whatever it left behind.

## Replaying

The far quicker loop, once you have a delivery worth iterating on: send a
past one at your local server as many times as you like.

```bash
rookery deliveries replay dl_7ha20qsz13 --to http://localhost:3000/webhooks
```

The payload, the headers and the signature are all reproduced. It never
touches the real subscriber, so this is safe against production
deliveries.

```bash
# Everything that failed in the last hour, at the local server.
rookery deliveries list --status exhausted --since 1h \
  --replay-to http://localhost:3000/webhooks
```

## Fixtures

For tests, you want none of the above — no network, no tunnel, no account.
Every client library can build a signed request offline.

```javascript
import { fixtures } from "@rookery/node/testing";

const { body, headers } = fixtures.signedRequest({
  type: "invoice.paid",
  data: { invoiceId: "in_8121", amount: 4200 },
  secret: "whsec_test_0000000000000000",
});

const response = await app.inject({
  method: "POST",
  url: "/webhooks",
  headers,
  payload: body,
});

expect(response.statusCode).toBe(200);
```

Use this to test the cases that are painful to produce for real:

- a signature that does not match
- a timestamp outside the tolerance
- the same delivery twice, to prove the handler is idempotent
- a payload with a field your handler does not know about

That last one is worth an assertion of its own. New fields get added to
event payloads, and a receiver that throws on an unexpected key will break
on a day when nothing about it changed.

## Choosing between them

| Situation | Use |
| --- | --- |
| First integration, want to see it work | Tunnel |
| Iterating on one payload | Replay |
| Automated tests, CI | Fixtures |
| Reproducing a customer's failure | Replay their delivery |

The tunnel is the one to reach for least. It is the slowest loop of the
three, and once you have received a delivery you can replay it forever.
