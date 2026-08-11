/**
 * The agreement, in words.
 *
 * The numbers on /sla all come out of the model — the bands are derived
 * from each service's own target and the credits are computed from the
 * incident archive. What lives here is the part arithmetic cannot supply:
 * what "unavailable" means for each service, what is excluded, and how a
 * customer actually gets the money.
 *
 * The definitions matter more than the percentages. An SLA that promises
 * 99.99% without saying what it is 99.99% OF is a promise about nothing,
 * and that is the usual shape of them.
 */

export interface Definition {
  serviceId: string;
  /** The condition that starts the clock. Written so it could be argued with. */
  unavailable: string;
  /** The thing customers assume counts and does not. */
  notCounted: string;
}

export const DEFINITIONS: Definition[] = [
  {
    serviceId: "compute",
    unavailable:
      "A running instance is unreachable on all of its network interfaces for more than sixty consecutive seconds, or the API refuses to create an instance in a region with published capacity.",
    notCounted:
      "An instance you stopped, an instance killed by its own workload, and any period in which the API is refusing you for quota rather than for capacity.",
  },
  {
    serviceId: "objects",
    unavailable:
      "More than one per cent of well-formed requests to a bucket return 5xx, measured per region in five-minute buckets.",
    notCounted:
      "403s, 404s, requests rejected for a malformed signature, and throttling of a bucket above its published request rate.",
  },
  {
    serviceId: "network",
    unavailable:
      "An anycast address does not complete a TLS handshake from at least two of our external probe networks, or ingress latency exceeds four times the trailing seven-day median for more than five minutes.",
    notCounted:
      "Loss between your users and our edge, which we can see and cannot control, and traffic dropped by a rule you configured.",
  },
  {
    serviceId: "postgres",
    unavailable:
      "A cluster refuses connections on its primary endpoint, or a write that was acknowledged is not durable. Replica lag is not unavailability unless it exceeds sixty seconds, at which point it is counted against the read endpoint only.",
    notCounted:
      "Connection refusals caused by exhausting your own connection limit, and the sub-thirty-second write pause during an announced failover.",
  },
  {
    serviceId: "queues",
    unavailable:
      "A publish is rejected, or a message is not delivered to a healthy subscriber within ten times the queue's published delivery target.",
    notCounted:
      "Delivery delayed by a subscriber returning errors or 429s, and messages held in a dead-letter queue you have not drained.",
  },
  {
    serviceId: "console",
    unavailable:
      "The API returns 5xx to more than one per cent of authenticated requests, or the dashboard fails to load its first meaningful frame within ten seconds.",
    notCounted:
      "Anything reached through the console that is itself a service with its own target — a console that loads and shows you a broken Postgres cluster is a working console.",
  },
];

export function definitionFor(serviceId: string): Definition {
  const found = DEFINITIONS.find((d) => d.serviceId === serviceId);
  if (!found) throw new Error(`No SLA definition for ${serviceId}`);
  return found;
}

export const EXCLUSIONS = [
  {
    title: "Announced maintenance",
    body: "Work published to this page at least seven days in advance, inside the window that was published. It costs no error budget and earns no credit. Both maintenance windows in the current record are listed in the incident history rather than hidden, because a record that drops them makes the surrounding months look better than they were.",
  },
  {
    title: "Your own code",
    body: "Quota, connection limits you set, rules you configured, and workloads that fail on their own. We will still tell you about it and we will not count it.",
  },
  {
    title: "The public internet",
    body: "Loss between your users and our edge. We measure from probe networks we do not buy transit from — see how we measure — and we publish what those probes see, but a broken path inside somebody else's network is not something we can promise you.",
  },
  {
    title: "Anything we did at your request",
    body: "A failover you asked us to run, a restore you asked us to perform, a limit you asked us to lift.",
  },
];

export const METHOD = [
  {
    title: "Probes, not tickets",
    body: "Availability is measured by synthetic probes running every fifteen seconds against every service in every region, from four networks we do not buy transit from. Tickets are how we learn we were wrong about what the probes were watching, which has happened once in the published record.",
  },
  {
    title: "Impact is a fraction, not a flag",
    body: "An hour in which four per cent of reads were slow is not an hour of downtime. Every incident carries the share of requests it affected, and the budget it spends is the duration multiplied by that share. It is the only reason the numbers on this page can be compared to each other.",
  },
  {
    title: "Five-minute buckets, per region",
    body: "A service is unavailable in a region for a five-minute bucket, or it is not. Regions are then weighted by the share of requests they served that day, so an outage in Ashburn costs more than the same outage in Singapore — because it affected more people, not because we like it less.",
  },
  {
    title: "We round against ourselves",
    body: "Bucket boundaries round outward and impact fractions round up. Where a judgement call could go either way it goes the expensive way, which is the only rule that survives contact with an incident review at two in the morning.",
  },
  {
    title: "The window is stated every time",
    body: "The same incidents give different verdicts over ninety days, over a quarter and over a calendar month. No figure on this site appears without the window it was measured over.",
  },
];

export const CLAIM_STEPS = [
  "Find the month and service in the credit table below, or work it out yourself from the incident history — everything needed is published.",
  "Email status@coldharbour.example with the account, the month and the service. No form, no ticket type, no justification required.",
  "The credit appears on the following month's invoice. If the account has closed we pay it out instead.",
];

export const CLAIM_NOTE =
  "You have sixty days from the end of the affected month. We do not apply credits automatically, and we are not going to pretend that is generous — it is the industry norm and it is the reason the expired column below has anything in it.";

/** What the reference customer on this page is assumed to run. */
export const REFERENCE_CUSTOMER = {
  name: "the reference account",
  body: "Credit amounts on this page are worked out against one invented customer who buys every service at the volumes below. Yours will be different; the percentages will not be.",
};
