---
title: Going live
description: The checklist before you switch to live keys, and the first week afterwards.
order: 4
---

Test mode and live mode differ in exactly two ways: live mode makes real
requests to real URLs, and it requires `https://`. Everything else — the
signatures, the retry schedule, the response codes — behaves identically,
which is what makes this checklist short.

## Before

1. **Signature verification is on, and it can fail.** Confirm a request
   with a deliberately wrong signature is rejected. An endpoint that
   accepts everything looks identical to one that verifies correctly,
   right up until it does not.
2. **The handler acknowledges before it works.** Anything past 10 seconds
   is a timeout and a retry, whatever it eventually did.
3. **The handler is idempotent.** Replay the same delivery twice and check
   nothing doubles. Retries and manual replays both guarantee you will
   receive duplicates eventually.
4. **The handler tolerates unknown fields.** Payloads gain fields. A
   receiver that rejects unexpected keys will break on a day nothing about
   it changed.
5. **The live signing secret is deployed.** It is a different secret from
   your test endpoint's. This is the single most common go-live failure,
   and it presents as every request returning `400`.
6. **Something watches `exhausted`.** Subscribe to
   `rookery.delivery.exhausted`, or alert on the metric. Without it, a
   subscriber missing events is silent.
7. **Order-independence.** Deliveries retry independently, so they arrive
   out of order. [Events](/docs/concepts/events) covers the patterns that
   survive it.

## Switching

Create the live endpoint, store its secret, then move traffic:

```bash
rookery endpoints create \
  --url https://hooks.acme.example/rookery \
  --types invoice.paid,invoice.voided \
  --live
```

Leave the test endpoint in place for a week. It costs nothing and it is a
working comparison when something behaves differently from how it did on
Friday.

## The first week

Watch three things.

- **Attempts per delivery.** Should sit near 1.0. Consistently above 1.3
  means something is refusing the first attempt — often a cold start, or a
  load balancer with a shorter idle timeout than you think.
- **Duration.** If p95 is creeping toward 10 seconds, work is happening
  before the acknowledgement. It will start timing out under load rather
  than politely getting slower.
- **Exhausted count.** Should be zero. One is worth reading the log for;
  it is nearly always a deploy that took the receiver down for longer than
  25 hours, which is a different problem from the one it looks like.

## Rolling back

If you need to stop delivery in a hurry, disable the endpoint rather than
deleting it:

```bash
rookery endpoints update ep_9c4ktw02mn --disabled
```

Events keep being published and recorded; they simply are not delivered to
that endpoint. When the receiver is fixed, re-enable it and replay what
was missed — re-enabling on its own replays nothing.

```bash
rookery endpoints update ep_9c4ktw02mn --enabled
rookery deliveries list --endpoint ep_9c4ktw02mn --status exhausted --since 6h --retry
```

Deleting the endpoint instead would cancel everything queued and lose the
subscription, and the secret cannot be recovered afterwards.
