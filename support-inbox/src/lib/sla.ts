import type { Message, Status } from "../content/types";

/**
 * How long we have left to answer, and whether we already ran out.
 *
 * This module has no runtime imports on purpose. Everything else about
 * the clock — where it is drawn, what colour it goes, when the list
 * re-sorts — is wiring, and the wiring is not the part that is going to
 * be wrong. *This* is: which message starts the clock, which message
 * stops it, and which states have no clock at all. So it is separated
 * from all of that and checked directly, against a list of numbers, in
 * `scripts/check-sla.mjs`.
 *
 * See CONVENTIONS §8.
 */

export type SlaState =
  /** Nothing is owed. Either they have the ball, or it is finished. */
  | { kind: "stopped" }
  | { kind: "running"; dueAt: number; msLeft: number }
  | { kind: "overdue"; dueAt: number; msOver: number };

const HOUR = 60 * 60 * 1000;

/**
 * When the clock started: the first message from the customer that we
 * have not replied to since. `null` if there is no such message.
 *
 * Two things here are easy to get wrong and both are deliberate.
 *
 * The clock starts at the FIRST unanswered message, not the most
 * recent one. A customer who writes twice has been waiting since the
 * first time they wrote; starting again at the second would reward us
 * for their impatience by pushing the deadline out.
 *
 * And only a `reply` stops it. An internal note is a message to a
 * colleague, and writing one does not answer anybody — which is why
 * #4118 in the content sits there overdue with a thoughtful note on it.
 */
export function awaitingSince(messages: readonly Message[]): number | null {
  let lastReply = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].kind === "reply") {
      lastReply = i;
      break;
    }
  }
  for (let i = lastReply + 1; i < messages.length; i++) {
    if (messages[i].kind === "inbound") return Date.parse(messages[i].at);
  }
  return null;
}

/**
 * The clock for one conversation.
 *
 * `resolved` and `snoozed` stop it outright, because both are decisions
 * somebody made about when this needs looking at again and a promise we
 * measure ourselves against should not override them.
 *
 * `open` and `waiting` deliberately do NOT get that treatment — their
 * clock follows the thread instead. A conversation labelled "waiting on
 * customer" that in fact has an unanswered message in it is exactly the
 * one you want the list to shout about, and hard-coding "waiting means
 * stopped" would hide it.
 */
export function slaState(input: {
  status: Status;
  messages: readonly Message[];
  firstResponseHours: number;
  now: number;
}): SlaState {
  const { status, messages, firstResponseHours, now } = input;
  if (status === "resolved" || status === "snoozed") return { kind: "stopped" };

  const since = awaitingSince(messages);
  if (since === null) return { kind: "stopped" };

  const dueAt = since + firstResponseHours * HOUR;
  return now < dueAt
    ? { kind: "running", dueAt, msLeft: dueAt - now }
    : { kind: "overdue", dueAt, msOver: now - dueAt };
}

/** Under an hour left, which is when a row starts being worth noticing. */
export const DUE_SOON_MS = HOUR;

export function isDueSoon(state: SlaState): boolean {
  return state.kind === "running" && state.msLeft <= DUE_SOON_MS;
}

/**
 * A single number for sorting: milliseconds remaining, negative once
 * past, `null` when no clock is running.
 *
 * Collapsing the three cases to one comparable value is what lets the
 * list sort by urgency without every caller re-deriving the rule.
 */
export function msLeftOf(state: SlaState): number | null {
  if (state.kind === "running") return state.msLeft;
  if (state.kind === "overdue") return -state.msOver;
  return null;
}
