---
title: CLI
description: Installing the command line tool, and the commands worth knowing.
order: 1
---

The CLI covers everything the API does, plus the two things that only make
sense from a terminal: tunnelling and replaying.

## Install

```bash
# macOS
brew install rookery/tap/rookery

# Linux
curl -fsSL https://rookery.dev/install.sh | sh

# Anywhere with Node
npm install -g @rookery/cli
```

```bash
rookery --version
```

## Signing in

```bash
rookery login
```

Opens a browser, and stores the token in your system keychain — not in a
dotfile. On a server without a browser, set `ROOKERY_API_KEY` in the
environment instead and skip `login` entirely.

```bash
rookery whoami
```

```text
acme-payments (live)  ·  key rk_live_…ptzw  ·  last used 3 minutes ago
```

Check the mode in that output before running anything destructive.
`--test` and `--live` override it per command.

## Commands

### Listening

```bash
rookery listen --forward http://localhost:3000/webhooks
rookery listen --forward http://localhost:3000/webhooks --types invoice.paid
```

Registers a temporary endpoint, tunnels to it, prints every request. The
endpoint is deleted on exit.

### Endpoints

```bash
rookery endpoints list
rookery endpoints create --url https://hooks.acme.example/rookery --types invoice.paid
rookery endpoints update ep_9c4ktw02mn --types invoice.paid,invoice.voided
rookery endpoints ping ep_9c4ktw02mn
rookery endpoints roll-secret ep_9c4ktw02mn --grace 24h
rookery endpoints delete ep_9c4ktw02mn
```

### Events

```bash
rookery events publish --type invoice.paid --data '{"invoice_id":"in_8121"}'
rookery events list --type invoice.paid --limit 20
rookery events get ev_2p8fq1x0kd
```

### Deliveries

```bash
rookery deliveries list --status exhausted --since 24h
rookery deliveries get dl_7ha20qsz13
rookery deliveries retry dl_7ha20qsz13
rookery deliveries replay dl_7ha20qsz13 --to http://localhost:3000/webhooks
```

## Output

Human-readable by default, JSON on request. Every command takes `--json`,
which makes the CLI usable in a script without parsing a table:

```bash
rookery deliveries list --status exhausted --since 24h --json \
  | jq -r '.data[] | .endpoint_id' \
  | sort | uniq -c | sort -rn
```

```text
  14 ep_4m7bnq81zx
   2 ep_9c4ktw02mn
```

One subscriber accounting for fourteen of sixteen failures is the answer
to "is it us or them," and it takes one pipeline to find out.

## Exit codes

| Code | Meaning |
| ---: | --- |
| `0` | Success |
| `1` | The request was rejected — a `4xx` |
| `2` | Usage error: unknown flag, missing argument |
| `3` | Not signed in, or the key was refused |
| `4` | Network failure, or a `5xx` after retries |

`1` and `4` are worth distinguishing in a script: `1` means the command
was wrong and will fail again, `4` means it is worth trying later.
