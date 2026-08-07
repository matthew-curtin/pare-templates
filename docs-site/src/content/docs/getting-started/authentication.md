---
title: Authentication
description: API keys, the two modes, and the difference between an API key and a signing secret.
order: 3
---

Requests to the Rookery API authenticate with a bearer token.

```bash
curl https://api.rookery.dev/v1/events \
  -H "Authorization: Bearer rk_live_8fq2mx71cd04ptzw"
```

A missing or malformed header is a `401`. A well-formed key that has been
revoked is also a `401` — we do not distinguish, because telling an
attacker which of their guesses was once valid is free information.

## Two kinds of secret

These get confused constantly, and the confusion is expensive in both
directions, so it is worth being blunt about it.

| | API key | Signing secret |
| --- | --- | --- |
| Looks like | `rk_live_…` | `whsec_…` |
| Belongs to | your account | one endpoint |
| Used for | calling the API | verifying requests *from* us |
| Direction | you → Rookery | Rookery → you |
| If it leaks | anyone can publish as you | anyone can forge a webhook to that endpoint |

The rule of thumb: an **API key** proves you are you. A **signing secret**
proves a request really came from us. They are never interchangeable, and
a signing secret in an `Authorization` header is a sign that something has
gone wrong upstream of the code you are looking at.

## Test and live mode

Every account has two independent sets of keys.

- `rk_test_…` — events are recorded and deliveries are simulated. Nothing
  leaves our network. HTTP endpoints are permitted.
- `rk_live_…` — real requests to real URLs. `https://` is required.

Data does not cross between modes. A test event cannot be delivered to a
live endpoint, and the dashboard shows one mode at a time.

## Storing the key

- Read it from the environment, never from source. `rk_live_` is a
  distinctive prefix, which makes it easy for you to grep for — and easy
  for anyone scanning public repositories.
- Give each deployment its own key. Revoking a leaked key should not be an
  incident for every other service you run.
- Keys are shown once, at creation. There is no endpoint that returns one.

If a key does leak, revoke it first and investigate second. Revocation
takes effect within a few seconds, and the audit log will still be there
afterwards.

## Rotating

Rotation is additive, which means it never needs a maintenance window:

1. Create a second key.
2. Deploy it.
3. Confirm traffic has moved — the dashboard shows last-used-at per key.
4. Revoke the first.

Step 3 is the one people skip. A key that shows no traffic for a full
deploy cycle is safe to revoke; a key you *believe* is unused is not the
same thing, and finding out you were wrong is a production incident rather
than a chore.
