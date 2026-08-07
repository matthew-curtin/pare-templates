---
title: Verifying signatures
description: How the signature is computed, how to check it, and the four ways people get it wrong.
order: 1
---

An unverified webhook endpoint is a public, unauthenticated write to your
database. Anyone who learns the URL can post whatever they like to it.
This page is the one to read properly.

Every request we send carries three headers:

```http
Rookery-Id: dl_7ha20qsz13
Rookery-Timestamp: 1784021882
Rookery-Signature: v1=4f7a1c2e9b60d8835ac1f0e27d4b6a91c8e35f02d7b419ae6c0f8d23a5471bce
```

## How it is computed

The signed string is the timestamp, a full stop, and the raw request body:

```text
1784021882.{"id":"ev_2p8fq1x0kd","type":"invoice.paid",...}
```

That string is signed with HMAC-SHA256, keyed with the endpoint's signing
secret, and hex-encoded. The timestamp is included so that a captured
request cannot be replayed a week later — it is part of what is signed, so
it cannot be edited independently.

The `v1=` prefix is a version tag. During a secret roll you will see two
values separated by a comma; **accept the request if any one of them
matches.**

## Verifying it

Every client library does this for you, and using one is the recommendation:

```javascript
const event = Rookery.webhooks.verify(
  rawBody,
  req.header("Rookery-Signature"),
  process.env.ROOKERY_SIGNING_SECRET,
);
```

By hand, if you must — the whole algorithm is nine lines:

```python
import hashlib, hmac, time

def verify(raw_body: bytes, header: str, secret: str, tolerance: int = 300) -> bool:
    parts = dict(p.split("=", 1) for p in header.split(","))
    timestamp = int(parts["t"])

    if abs(time.time() - timestamp) > tolerance:
        return False

    signed = f"{timestamp}.".encode() + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()

    # Constant time. A plain == leaks how much of the signature matched.
    return hmac.compare_digest(expected, parts["v1"])
```

## The four ways this goes wrong

Nearly every "signature does not match" ticket is one of these.

### 1. Comparing a parsed body

The signature covers the exact bytes we sent. `JSON.parse` followed by
`JSON.stringify` produces an equivalent object and different bytes — key
order changes, whitespace changes, unicode escaping changes — and it will
not verify.

Most frameworks parse the body before your handler sees it, so this
usually means configuring a raw-body route:

```javascript
// Express: raw for this route only, JSON everywhere else.
app.post("/webhooks", express.raw({ type: "application/json" }), handler);
```

In Rails, use `request.raw_post`. In Next.js route handlers, use
`await req.text()` and parse it yourself *after* verifying.

### 2. A plain string comparison

`===` on a signature returns as soon as two characters differ, and how
long it took is measurable. Use the constant-time comparison your
language provides — `crypto.timingSafeEqual`, `hmac.compare_digest`,
`Rack::Utils.secure_compare`.

### 3. Not checking the timestamp

The signature stays valid forever unless you bound it. Reject anything
older than about five minutes. Too tight and ordinary clock drift starts
rejecting real requests; five minutes is comfortable on both sides.

### 4. Using the API key as the secret

They are different things — `rk_live_…` is not `whsec_…`. See
[Authentication](/docs/getting-started/authentication) for the full
distinction. If verification fails on every single request including the
first, this is the most likely reason.

## Answer first, work afterwards

Anything slower than 10 seconds is recorded as a timeout and retried,
however well your handler eventually did. Acknowledge as soon as you have
verified and stored the payload, then do the work.

```javascript
res.status(200).end();
void processInBackground(event);
```

Returning `200` before verifying is the opposite mistake, and a worse one.
Verify, persist, acknowledge, then work.

> Reject an invalid signature with `400`. Do not return `200` to make the
> retries stop — you will have hidden the fact that something is posting
> forged requests at you.
