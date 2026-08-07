---
title: Introduction
description: What Rookery does, and the four ideas the rest of the documentation is built on.
order: 1
---

Rookery delivers webhooks on your behalf. You publish an event once; we
work out who is subscribed, sign each request, deliver it, retry the ones
that fail, and keep a log you can search when somebody says they never got
it.

The delivery problem looks small until you are in it. A subscriber's
server is down for ninety seconds. Another returns `200` but never
processed the body. A third has a certificate that expired on a Sunday. A
fourth is fine but slow enough that your request thread is now the
bottleneck for everyone else. None of that is your product, and all of it
becomes your on-call rotation.

## The four things

Almost everything in this documentation is one of four objects.

- **Event** — something that happened in your system. It has a `type` and
  a `data` payload. You publish it once, and it is immutable afterwards.
- **Endpoint** — a URL belonging to one of your subscribers, plus the list
  of event types they want and the secret their signatures are computed
  with.
- **Delivery** — one event on its way to one endpoint. Publishing an event
  that three endpoints subscribe to creates three deliveries.
- **Attempt** — one HTTP request. A delivery has up to seven of them.

The distinction between a delivery and an attempt is the one worth
holding on to, because it is where most confused support tickets come
from. "The webhook failed" is nearly always one attempt failing inside a
delivery that went on to succeed.

## What Rookery does not do

It is a delivery service, not a queue and not an event bus.

- **It does not fan events back into your own system.** If you want your
  own services to react to your own events, you want a message broker.
- **It does not transform payloads.** What you publish is what subscribers
  receive, byte for byte. That is what makes the signature meaningful.
- **It does not guarantee ordering.** Two events published a millisecond
  apart may arrive in either order, because they retry independently.
  Design receivers to be order-independent — [Events](/docs/concepts/events)
  explains how, and why the alternative is worse than it sounds.

> If ordering genuinely matters for a particular flow, put a sequence
> number in the payload and let the receiver reorder. Trying to enforce
> order in transit means one slow subscriber holds up everyone behind
> them.

## Where to go next

If you want it working in the next ten minutes, start with the
[Quickstart](/docs/getting-started/quickstart). If you are integrating on
the receiving side, the one page you cannot skip is
[Verifying signatures](/docs/guides/verifying-signatures) — an unverified
webhook endpoint is a public, unauthenticated write to your database.
