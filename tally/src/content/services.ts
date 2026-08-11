import type { Service } from "../lib/availability.ts";
import { utc } from "../lib/availability.ts";

/**
 * Six services, three targets.
 *
 * The targets are not decoration. Over a 92-day quarter, 99.99% buys the
 * edge network 13.2 minutes of budget and 99.9% buys the queues 132.5 —
 * a factor of ten — which is why the same size of incident is a crisis on
 * one row and a rounding error on another. That comparison is most of
 * what the front page is for.
 *
 * `monthlyUsd` is what the reference customer on /sla pays. Credits are a
 * percentage of it, so it has to be a real number rather than a token —
 * an SLA quoted in percentages of an unstated fee says nothing.
 */
export const SERVICES: Service[] = [
  {
    id: "compute",
    slug: "compute",
    name: "Compute",
    group: "Core",
    blurb: "Virtual machines and bare metal, billed by the second.",
    target: 0.9995,
    liveFrom: utc(2019, 4, 8),
    monthlyUsd: 2400,
    regionIds: ["us-east", "us-west", "eu-west", "ap-south"],
  },
  {
    id: "objects",
    slug: "object-storage",
    name: "Object storage",
    group: "Core",
    blurb: "S3-compatible buckets with erasure coding across zones.",
    target: 0.9995,
    liveFrom: utc(2019, 4, 8),
    monthlyUsd: 890,
    regionIds: ["us-east", "us-west", "eu-west", "ap-south"],
  },
  {
    id: "network",
    slug: "edge-network",
    name: "Edge network",
    group: "Core",
    blurb: "Anycast ingress, TLS termination and DDoS absorption.",
    target: 0.9999,
    liveFrom: utc(2020, 9, 21),
    monthlyUsd: 1150,
    regionIds: ["us-east", "us-west", "eu-west", "ap-south", "eu-central"],
  },
  {
    id: "postgres",
    slug: "managed-postgres",
    name: "Managed Postgres",
    group: "Data",
    blurb: "Primaries, replicas and point-in-time restore, managed by us.",
    target: 0.9995,
    liveFrom: utc(2021, 6, 14),
    monthlyUsd: 1980,
    regionIds: ["us-east", "us-west", "eu-west"],
  },
  {
    id: "queues",
    slug: "message-queues",
    name: "Message queues",
    group: "Data",
    blurb: "At-least-once delivery with a dead-letter path you can replay.",
    target: 0.999,
    // Generally available forty days before the pinned clock, which is
    // why its strip opens with fifty days of nothing rather than fifty
    // days of green. §7b: somebody has to have launched recently.
    liveFrom: utc(2026, 7, 2, 9, 0),
    monthlyUsd: 420,
    regionIds: ["us-east", "eu-west"],
  },
  {
    id: "console",
    slug: "console-and-api",
    name: "Console & API",
    group: "Platform",
    blurb: "The control plane: dashboard, API, audit log and billing.",
    target: 0.999,
    liveFrom: utc(2019, 4, 8),
    monthlyUsd: 320,
    regionIds: ["us-east", "eu-west"],
  },
];

export function serviceById(id: string): Service {
  const found = SERVICES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown service: ${id}`);
  return found;
}

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_GROUPS = ["Core", "Data", "Platform"];
