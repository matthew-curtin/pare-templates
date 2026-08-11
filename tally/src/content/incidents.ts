import type { Incident } from "../lib/availability.ts";
import { utc } from "../lib/availability.ts";

/**
 * Six months of incidents, oldest first.
 *
 * Four of these are load-bearing and the rest are texture:
 *
 *   `postgres-failover-loop`  22 minutes at 100% impact — 22.0 budget min
 *   `postgres-replica-lag`   291 minutes at   4% impact — 11.6 budget min
 *
 * The second reads far worse on a timeline and cost half as much. That
 * pair is the argument the whole site is built to make, which is why they
 * sit eight days apart on the same service.
 *
 *   `edge-bgp-withdrawal`    the only one a customer told us about first,
 *                            and the only one where we were slower to
 *                            notice than to fix.
 *   `postgres-storage-exhaustion`  the February outage that is the reason
 *                            any of this is published at all.
 *
 * `fraction` is the share of requests affected and it is the number that
 * makes an error budget mean anything — see the note on `Impact`.
 */
export const INCIDENTS: Incident[] = [
  {
    id: "postgres-storage-exhaustion",
    slug: "postgres-storage-exhaustion",
    title: "Managed Postgres primaries went read-only in two regions",
    severity: "major",
    startMin: utc(2026, 2, 17, 21, 3),
    endMin: utc(2026, 2, 18, 2, 44),
    detectedMin: utc(2026, 2, 17, 21, 5),
    detectedBy: "alert",
    regionIds: ["us-east", "eu-west"],
    impacts: [
      {
        serviceId: "postgres",
        fraction: 0.72,
        note: "Writes rejected on every primary with WAL archiving enabled; reads unaffected throughout.",
      },
    ],
    summary:
      "A change to the write-ahead log retention policy stopped archived segments being reclaimed. Volumes filled over about nine hours and every affected primary took itself read-only, which is the correct behaviour and the worst outcome.",
    cause:
      "Retention was moved from a fixed seven days to a policy expressed in segment count, on the reasoning that segment count is what actually consumes the volume. The new policy was correct and the reclaim job that enforced it was matching on the old naming scheme, so it found nothing to delete and reported success. Free space fell steadily from 21:03 with no alarm, because the disk alert was set at 90% and the volumes went from 88% to full inside twenty minutes once compaction started competing for the same space.",
    fix: "Retention was reverted, orphaned segments were removed by hand, and each primary was brought back out of read-only in sequence with a replica promoted where recovery would have taken longer than a failover.",
    prevention: [
      "Disk alerts are now on rate of change as well as level, so a volume losing 4% an hour pages at 60% rather than waiting for 90%.",
      "The reclaim job fails loudly when it matches zero segments in a run where it expected some, instead of reporting a successful no-op.",
      "Retention changes go through the same staged rollout as engine upgrades: one region, one week, then the rest.",
    ],
    updates: [
      { atMin: utc(2026, 2, 17, 21, 19), status: "investigating", body: "We are investigating write failures on Managed Postgres in iad1 and dub1." },
      { atMin: utc(2026, 2, 17, 22, 2), status: "identified", body: "Primaries have gone read-only after exhausting local volume capacity. We are reclaiming space." },
      { atMin: utc(2026, 2, 18, 0, 30), status: "monitoring", body: "Writes have been restored in iad1. dub1 is following, one cluster at a time." },
      { atMin: utc(2026, 2, 18, 2, 44), status: "resolved", body: "All primaries are accepting writes. No data was lost; the read-only transition is designed to make sure of that." },
    ],
  },
  {
    id: "network-ddos-absorb",
    slug: "edge-volumetric-attack",
    title: "Edge network degraded while absorbing a volumetric attack",
    severity: "partial",
    startMin: utc(2026, 3, 9, 14, 22),
    endMin: utc(2026, 3, 9, 15, 38),
    detectedMin: utc(2026, 3, 9, 14, 24),
    detectedBy: "probe",
    regionIds: ["us-east", "us-west", "eu-west", "ap-south"],
    impacts: [
      {
        serviceId: "network",
        fraction: 0.19,
        note: "Elevated handshake latency and some connection resets at ingress; origins were never reached.",
      },
    ],
    summary:
      "A 1.4 Tbit/s reflected attack against a single customer's addresses was absorbed at the edge. It was absorbed successfully, and it still cost other customers about nineteen minutes of degraded ingress across the hour.",
    cause:
      "Our scrubbing capacity is shared. The filters engaged within ninety seconds, but the ninety seconds before they did saturated the transit links in two sites, and traffic for unrelated customers queued behind it.",
    fix: "Filters were applied at the transit edge rather than at the site edge, moving the drop point upstream of the saturated links.",
    prevention: [
      "Per-customer ingress budgets are now enforced at the transit edge by default rather than after a threshold is crossed.",
      "We have doubled scrubbing headroom in iad1 and dub1, the two sites that saturated.",
    ],
    updates: [
      { atMin: utc(2026, 3, 9, 14, 31), status: "identified", body: "We are mitigating a volumetric attack. Some ingress connections are seeing elevated latency." },
      { atMin: utc(2026, 3, 9, 15, 38), status: "resolved", body: "Mitigation is stable and latency has returned to baseline." },
    ],
  },
  {
    id: "compute-scheduler-wedge",
    slug: "compute-scheduler-wedge",
    title: "Scheduler stopped placing new instances in us-west",
    severity: "partial",
    startMin: utc(2026, 4, 21, 8, 5),
    endMin: utc(2026, 4, 21, 9, 20),
    detectedMin: utc(2026, 4, 21, 8, 9),
    detectedBy: "alert",
    regionIds: ["us-west"],
    impacts: [
      {
        serviceId: "compute",
        fraction: 0.24,
        note: "New instance creation failed in pdx1. Running instances were not affected at any point.",
      },
    ],
    summary:
      "The placement service in pdx1 deadlocked against its own capacity cache and stopped answering. Instances already running were untouched; anything trying to start was not.",
    cause:
      "A capacity refresh and a placement request can both take the same two locks, and until this week they took them in the same order every time. A change to make refreshes incremental reversed that order for one code path.",
    fix: "The placement service was restarted in pdx1, which cleared the deadlock, and the incremental refresh was reverted the same morning.",
    prevention: [
      "Lock ordering is now asserted in a test rather than in a comment.",
      "The placement service has a watchdog that restarts it if it stops answering health checks for ninety seconds, which would have cut this to under two minutes.",
    ],
    updates: [
      { atMin: utc(2026, 4, 21, 8, 22), status: "identified", body: "New Compute instances are failing to start in pdx1. Running instances are healthy." },
      { atMin: utc(2026, 4, 21, 9, 20), status: "resolved", body: "Placement has recovered in pdx1 and the queued creations have drained." },
    ],
  },
  {
    id: "objects-durability-scare",
    slug: "object-cold-read-latency",
    title: "Elevated read latency on cold objects in eu-west",
    severity: "degraded",
    startMin: utc(2026, 4, 30, 19, 12),
    endMin: utc(2026, 4, 30, 21, 0),
    detectedMin: utc(2026, 4, 30, 19, 12),
    detectedBy: "probe",
    regionIds: ["eu-west"],
    impacts: [
      {
        serviceId: "objects",
        fraction: 0.05,
        note: "Reads of objects not touched in thirty days took up to nine seconds. Warm reads were normal.",
      },
    ],
    summary:
      "A failed drive in dub1 put two erasure groups into reconstruction at once. Reads succeeded throughout — reconstruction is what erasure coding is for — but cold reads served from the reconstructing groups were slow.",
    cause:
      "Reconstruction is rate-limited so that it cannot starve foreground traffic, and the limit is per-node. Two groups reconstructing on overlapping nodes exceeded what the limit was set to protect against.",
    fix: "Reconstruction was throttled by hand until the first group completed, then allowed to resume at full rate.",
    prevention: [
      "The reconstruction limit is now per-node across all groups rather than per-group, which is what it was always described as doing.",
    ],
    updates: [
      { atMin: utc(2026, 4, 30, 19, 40), status: "identified", body: "Cold object reads in dub1 are slow while two erasure groups rebuild. No object is at risk." },
      { atMin: utc(2026, 4, 30, 21, 0), status: "resolved", body: "Rebuild has completed and latency is back to baseline." },
    ],
  },
  {
    id: "objects-multipart-stalls",
    slug: "multipart-upload-stalls",
    title: "Multipart uploads stalling above 5 GB",
    severity: "degraded",
    startMin: utc(2026, 5, 14, 6, 30),
    endMin: utc(2026, 5, 14, 8, 12),
    detectedMin: utc(2026, 5, 14, 6, 34),
    detectedBy: "probe",
    regionIds: ["us-east"],
    impacts: [
      {
        serviceId: "objects",
        fraction: 0.09,
        note: "Completion of multipart uploads over roughly 5 GB timed out. Parts uploaded successfully and could be completed later.",
      },
    ],
    summary:
      "The completion step for large multipart uploads timed out in iad1 for an hour and forty-two minutes. No parts were lost, and every affected upload completed on retry.",
    cause:
      "Completion validates every part's checksum in one request. A metadata index change made that a sequential read where it had been a batch, and past about a thousand parts the request exceeded its own gateway timeout.",
    fix: "The index change was rolled back in iad1 and re-landed a week later with the batch read restored.",
    prevention: [
      "Completion now streams its validation and has no fixed part ceiling.",
      "The synthetic probe suite gained a 20 GB upload, which is what would have caught this before a customer did.",
    ],
    updates: [
      { atMin: utc(2026, 5, 14, 6, 51), status: "investigating", body: "We are looking at timeouts when completing large multipart uploads in iad1." },
      { atMin: utc(2026, 5, 14, 8, 12), status: "resolved", body: "Rolled back. Completions are succeeding again; uploads already in progress can be completed as normal." },
    ],
  },
  {
    id: "edge-intermediate-expiry",
    slug: "expired-intermediate-certificate",
    title: "Two edge sites served an expired intermediate certificate",
    severity: "partial",
    startMin: utc(2026, 5, 19, 0, 7),
    endMin: utc(2026, 5, 19, 0, 41),
    detectedMin: utc(2026, 5, 19, 0, 7),
    detectedBy: "probe",
    regionIds: ["eu-west", "ap-south"],
    impacts: [
      {
        serviceId: "network",
        fraction: 0.11,
        note: "TLS handshakes failed for clients that validate the full chain. Clients with the intermediate cached were unaffected, which is why this was 11% and not everything.",
      },
    ],
    summary:
      "An intermediate certificate expired at midnight UTC and two sites had not picked up its replacement. Thirty-four minutes.",
    cause:
      "The replacement had been distributed nine days earlier. The reload that picks it up is triggered by a file watch, and on these two hosts the watch had been silently detached since a kernel upgrade in April — the process was healthy, the file was correct on disk, and the running configuration was three weeks stale.",
    fix: "The edge processes were reloaded explicitly in dub1 and sin1.",
    prevention: [
      "Every edge host now reports the expiry date of the chain it is actually serving, not the one on disk, and we alert at fourteen days.",
      "The file watch is no longer trusted on its own; a timer reloads configuration every six hours regardless.",
    ],
    updates: [
      { atMin: utc(2026, 5, 19, 0, 14), status: "identified", body: "TLS failures at dub1 and sin1 from an expired intermediate. Reloading now." },
      { atMin: utc(2026, 5, 19, 0, 41), status: "resolved", body: "Both sites are serving the current chain." },
    ],
  },
  {
    id: "objects-list-latency",
    slug: "list-operations-slow",
    title: "List operations slow on buckets over ten million keys",
    severity: "degraded",
    startMin: utc(2026, 5, 27, 13, 22),
    endMin: utc(2026, 5, 27, 17, 5),
    detectedMin: utc(2026, 5, 27, 13, 31),
    detectedBy: "alert",
    regionIds: ["us-east", "us-west"],
    impacts: [
      {
        serviceId: "objects",
        fraction: 0.06,
        note: "Listing a very large bucket took seconds rather than milliseconds. Gets and puts were normal throughout.",
      },
    ],
    summary:
      "Three hours and forty-three minutes of slow listings on the largest buckets, after a compaction ran during the working day for the first time.",
    cause:
      "Metadata compaction is scheduled by free space rather than by clock, and a bulk import the previous night brought it forward into business hours. The compaction is correct and it competes for the same read path as listing.",
    fix: "Compaction was paused until 22:00 and allowed to run overnight.",
    prevention: [
      "Compaction now has a window as well as a threshold: it can be triggered by free space at any hour, but it runs at a tenth of the rate between 08:00 and 20:00 local to the site.",
    ],
    updates: [
      { atMin: utc(2026, 5, 27, 13, 55), status: "identified", body: "Slow LIST responses on large buckets in iad1 and pdx1 caused by metadata compaction. Other operations are normal." },
      { atMin: utc(2026, 5, 27, 17, 5), status: "resolved", body: "Compaction has been deferred and listing latency has recovered." },
    ],
  },
  {
    id: "postgres-16-upgrade",
    slug: "postgres-16-rolling-upgrade",
    title: "Managed Postgres 16 rolling upgrade",
    severity: "maintenance",
    startMin: utc(2026, 6, 4, 2, 0),
    endMin: utc(2026, 6, 4, 3, 40),
    detectedMin: utc(2026, 6, 4, 2, 0),
    detectedBy: "engineer",
    regionIds: ["us-east", "us-west", "eu-west"],
    impacts: [
      {
        serviceId: "postgres",
        fraction: 1,
        note: "One failover per cluster, announced eighteen days in advance. Typically under thirty seconds of write unavailability each.",
      },
    ],
    summary:
      "Announced maintenance. Every Managed Postgres cluster was moved to Postgres 16 by promoting an already-upgraded replica, one cluster at a time.",
    cause:
      "Planned. Postgres 15 leaves community support in November and we do not run an engine we cannot get security fixes for.",
    fix: "Not applicable — the window completed twenty minutes early.",
    prevention: [
      "Nothing to prevent. The window is recorded here because a maintenance that vanishes from the record makes the surrounding months look better than they were.",
    ],
    updates: [
      { atMin: utc(2026, 5, 17, 10, 0), status: "scheduled", body: "Managed Postgres will move to Postgres 16 on 4 June between 02:00 and 04:00 UTC. Expect one failover per cluster." },
      { atMin: utc(2026, 6, 4, 3, 40), status: "resolved", body: "All clusters are on Postgres 16. The window closed twenty minutes early." },
    ],
  },
  {
    id: "compute-zone-c-power",
    slug: "us-east-zone-c-power-loss",
    title: "Loss of utility power in us-east zone C",
    severity: "major",
    startMin: utc(2026, 6, 19, 9, 14),
    endMin: utc(2026, 6, 19, 9, 36),
    detectedMin: utc(2026, 6, 19, 9, 14),
    detectedBy: "probe",
    regionIds: ["us-east"],
    impacts: [
      {
        serviceId: "compute",
        fraction: 0.33,
        note: "One of three zones in iad1. Instances in zone C stopped; the other two zones were unaffected.",
      },
      {
        serviceId: "postgres",
        fraction: 0.09,
        note: "Clusters with their primary in zone C failed over automatically, at a median of eleven seconds.",
      },
    ],
    summary:
      "A utility feed failed and the generator serving zone C did not pick up the load. Twenty-two minutes, one zone of three, and the first time in six years the backup path has not worked.",
    cause:
      "The transfer switch tested clean in May. It failed to close on the day because a control relay had been replaced during that test with a part of the correct rating and the wrong coil voltage. The generator started and ran, connected to nothing, for the entire outage.",
    fix: "The switch was closed by hand at 09:31 and the zone was back within five minutes.",
    prevention: [
      "Every part fitted during a maintenance window is now recorded against the drawing, and the drawing is checked before the switch is signed off rather than after.",
      "Transfer tests now run under load rather than into a bank, which is what would have found this in May.",
      "This zone's generator has been added to the monthly under-load rotation instead of the quarterly one.",
    ],
    updates: [
      { atMin: utc(2026, 6, 19, 9, 21), status: "identified", body: "Power loss affecting zone C in iad1. Zones A and B are unaffected. Engineers are on site." },
      { atMin: utc(2026, 6, 19, 9, 36), status: "resolved", body: "Zone C is back on utility power. Instances are restarting; Postgres clusters failed over automatically and are healthy." },
    ],
  },
  {
    id: "edge-bgp-withdrawal",
    slug: "transit-route-withdrawal",
    title: "A transit provider withdrew our European routes",
    severity: "partial",
    startMin: utc(2026, 6, 25, 21, 48),
    endMin: utc(2026, 6, 25, 22, 26),
    // Twenty-three minutes to notice, fifteen to fix. The only incident in
    // the archive where those are the wrong way round, and the reason the
    // method page publishes detection time at all.
    detectedMin: utc(2026, 6, 25, 22, 11),
    detectedBy: "customer",
    regionIds: ["us-east", "eu-west"],
    impacts: [
      {
        serviceId: "network",
        fraction: 0.44,
        note: "European ingress fell back to transatlantic paths. Nothing was unreachable; a great deal of it was slow.",
      },
    ],
    summary:
      "One of our three transit providers withdrew our prefixes in Europe after a maintenance script on their side matched the wrong community tag. It took us twenty-three minutes to notice and fifteen to fix.",
    cause:
      "Their change was correct for the customer it was aimed at and matched us as well. On our side, the monitoring that would have caught it was measuring reachability from probes that all sat inside the two remaining providers, so from where we were looking nothing had happened.",
    fix: "We announced the affected prefixes over the two unaffected providers with a longer path and asked for the withdrawal to be reversed, which it was.",
    prevention: [
      "External probes now run from networks we do not buy transit from, which is the only place this was visible.",
      "We alert on a change in the number of providers announcing a prefix, rather than on whether the prefix is reachable.",
      "Route objects are checked against a public looking glass every fifteen minutes.",
    ],
    updates: [
      { atMin: utc(2026, 6, 25, 22, 14), status: "investigating", body: "We are investigating reports of slow ingress in Europe. Reported to us by a customer at 22:11." },
      { atMin: utc(2026, 6, 25, 22, 26), status: "resolved", body: "Routes have been restored. A full note on why our own monitoring did not see this will follow." },
    ],
  },
  {
    id: "edge-frankfurt-turnup",
    slug: "frankfurt-edge-turn-up",
    title: "Frankfurt edge site turn-up",
    severity: "maintenance",
    startMin: utc(2026, 7, 15, 1, 0),
    endMin: utc(2026, 7, 15, 2, 30),
    detectedMin: utc(2026, 7, 15, 1, 0),
    detectedBy: "engineer",
    regionIds: ["eu-central"],
    impacts: [
      {
        serviceId: "network",
        fraction: 0.2,
        note: "European anycast was drained through Dublin while Frankfurt was brought into the announcement. Slightly longer paths for ninety minutes; no loss.",
      },
    ],
    summary:
      "Announced maintenance. fra1 was added to the European anycast announcement, which required draining and re-balancing the region.",
    cause:
      "Planned. fra1 is our fifth site and the first new one in three years. Adding it to the European anycast announcement means draining Dublin's share of the traffic, re-balancing, and putting it back, and there is no way to do that without moving somebody's packets around for an hour and a half.",
    fix: "Not applicable.",
    prevention: [
      "Nothing to prevent. Listed so the strip shows what actually happened in the window rather than an unbroken run.",
    ],
    updates: [
      { atMin: utc(2026, 7, 1, 9, 0), status: "scheduled", body: "We will add fra1 to the European edge announcement on 15 July between 01:00 and 03:00 UTC." },
      { atMin: utc(2026, 7, 15, 2, 30), status: "resolved", body: "fra1 is live and taking traffic. Median European ingress latency is down about 6 ms." },
    ],
  },
  {
    id: "edge-anycast-drain",
    slug: "singapore-drain-overrun",
    title: "Anycast drain in Singapore outlasted its own timeout",
    severity: "degraded",
    startMin: utc(2026, 7, 19, 3, 12),
    endMin: utc(2026, 7, 19, 3, 41),
    detectedMin: utc(2026, 7, 19, 3, 12),
    detectedBy: "probe",
    regionIds: ["ap-south"],
    impacts: [
      {
        serviceId: "network",
        fraction: 0.12,
        note: "Long-lived connections into sin1 were reset rather than drained. New connections were served normally throughout.",
      },
    ],
    summary:
      "A routine drain ahead of a kernel patch took twenty-nine minutes instead of the ten it allows, and cut the connections it had not finished draining.",
    cause:
      "The drain waits for connections to close on their own and then forces the rest. A customer's long-poll workload keeps connections open for up to an hour, so almost none of them closed inside the window.",
    fix: "The remaining connections were reset and the patch went ahead. Clients reconnected without intervention.",
    prevention: [
      "Drains now report the connection age distribution before they start, so the operator sees a ten-minute window is not enough before committing to it.",
    ],
    updates: [
      { atMin: utc(2026, 7, 19, 3, 41), status: "resolved", body: "Drain complete in sin1. Some long-lived connections were reset and will have reconnected automatically." },
    ],
  },
  {
    id: "postgres-failover-loop",
    slug: "simultaneous-primary-failover",
    title: "Every Postgres primary failed over at once",
    severity: "major",
    startMin: utc(2026, 7, 23, 4, 11),
    endMin: utc(2026, 7, 23, 4, 33),
    detectedMin: utc(2026, 7, 23, 4, 12),
    detectedBy: "probe",
    regionIds: ["us-east", "us-west", "eu-west"],
    impacts: [
      {
        serviceId: "postgres",
        fraction: 1,
        note: "Total. Every managed cluster in every region was unavailable for writes and reads for the duration.",
      },
    ],
    summary:
      "Twenty-two minutes in which no Managed Postgres cluster anywhere would accept a connection. It is the shortest major outage in this archive and the most expensive thing on the page.",
    cause:
      "The health checker that decides whether a primary is alive resolves the cluster's own DNS name to do it. An internal resolver rolled out at 04:11 with a configuration that returned SERVFAIL for our internal zone. Every checker in every region concluded, correctly given what it could see, that every primary was dead, and every cluster began a failover at the same moment. The replicas were healthy; they were also, briefly, all being promoted.",
    fix: "The resolver change was rolled back at 04:19. Failovers were allowed to complete rather than interrupted, which took a further fourteen minutes and was the safer of the two options.",
    prevention: [
      "The health checker no longer resolves anything. It is given addresses.",
      "Failover requires agreement from a checker in a different region, so a single region's view cannot promote a cluster on its own.",
      "Resolver changes roll out to one region at a time with a thirty-minute soak, which is the same rule Postgres engine changes have had since February.",
    ],
    updates: [
      { atMin: utc(2026, 7, 23, 4, 17), status: "investigating", body: "Managed Postgres is unavailable in all regions. We are investigating." },
      { atMin: utc(2026, 7, 23, 4, 21), status: "identified", body: "An internal DNS change caused simultaneous failovers. The change has been reverted and failovers are completing." },
      { atMin: utc(2026, 7, 23, 4, 33), status: "resolved", body: "All clusters are accepting connections. No data was lost." },
    ],
  },
  {
    id: "compute-image-pull",
    slug: "image-pull-timeouts",
    title: "Image pulls timing out from the internal registry",
    severity: "degraded",
    startMin: utc(2026, 7, 28, 12, 15),
    endMin: utc(2026, 7, 28, 13, 7),
    detectedMin: utc(2026, 7, 28, 12, 20),
    detectedBy: "alert",
    regionIds: ["us-west", "ap-south"],
    impacts: [
      {
        serviceId: "compute",
        fraction: 0.11,
        note: "Instances using images not already cached on their host took several minutes to start, or failed and retried.",
      },
    ],
    summary:
      "Fifty-two minutes of slow and failing image pulls in pdx1 and sin1, after a registry cache node was drained without its traffic being moved first.",
    cause:
      "A cache node was taken out for a disk replacement. The drain removed it from the pool and the pool did not re-balance, so a third of pulls in both sites went to the origin registry across the Pacific.",
    fix: "The pool was re-balanced by hand and the node returned an hour later.",
    prevention: [
      "The registry pool now re-balances on membership change rather than on a timer.",
    ],
    updates: [
      { atMin: utc(2026, 7, 28, 12, 39), status: "identified", body: "Slow image pulls in pdx1 and sin1. Running instances are unaffected." },
      { atMin: utc(2026, 7, 28, 13, 7), status: "resolved", body: "Registry caching is rebalanced and pull times are normal." },
    ],
  },
  {
    id: "postgres-replica-lag",
    slug: "eu-west-replica-lag",
    title: "Read replicas in eu-west fell behind the primary",
    severity: "degraded",
    startMin: utc(2026, 7, 31, 11, 2),
    endMin: utc(2026, 7, 31, 15, 53),
    detectedMin: utc(2026, 7, 31, 11, 6),
    detectedBy: "probe",
    regionIds: ["eu-west"],
    impacts: [
      {
        serviceId: "postgres",
        fraction: 0.04,
        note: "Replica lag peaked at four minutes. Only reads explicitly routed to a replica saw stale data; writes and primary reads were normal.",
      },
    ],
    summary:
      "Four hours and fifty-one minutes of replica lag in dub1 — the longest entry in this archive, and the second-cheapest. It looks far worse on the timeline above than it cost, which is the point the front page is making.",
    cause:
      "A customer's bulk delete generated write volume that replay could not keep up with on the replica hardware in dub1, which is a generation behind the primaries there. Nothing was broken; the machine was simply slower than the work.",
    fix: "Replay was given more memory and the bulk delete was rate-limited at the customer's request once we called them.",
    prevention: [
      "Replicas in dub1 are being moved to the same generation as the primaries, which was already scheduled for Q4 and has been brought forward.",
      "Replica lag over sixty seconds now pages rather than warns, because at four minutes it is a correctness problem for anyone reading replicas.",
    ],
    updates: [
      { atMin: utc(2026, 7, 31, 11, 24), status: "identified", body: "Read replicas in dub1 are lagging. Writes and primary reads are unaffected." },
      { atMin: utc(2026, 7, 31, 13, 40), status: "monitoring", body: "Lag is falling. We expect it to clear within two hours." },
      { atMin: utc(2026, 7, 31, 15, 53), status: "resolved", body: "Replicas in dub1 are caught up." },
    ],
  },
  {
    id: "objects-eu-west-reads",
    slug: "object-reads-failing-eu-west",
    title: "Object reads failing in eu-west",
    severity: "partial",
    startMin: utc(2026, 8, 2, 5, 44),
    endMin: utc(2026, 8, 2, 6, 29),
    detectedMin: utc(2026, 8, 2, 5, 44),
    detectedBy: "probe",
    regionIds: ["eu-west"],
    impacts: [
      {
        serviceId: "objects",
        fraction: 0.28,
        note: "Roughly a quarter of GET requests in dub1 returned 503. Writes succeeded throughout.",
      },
    ],
    summary:
      "Forty-five minutes of failing reads in dub1 after a gateway deployment landed with a connection limit an order of magnitude too low.",
    cause:
      "The limit is expressed per gateway process and the deployment halved the process count while keeping the per-process limit, which had been sized for the old count. Nobody noticed because the two numbers live in different files.",
    fix: "The previous build was redeployed.",
    prevention: [
      "The two numbers now live in one file and the deployment fails if their product falls below the previous release's.",
    ],
    updates: [
      { atMin: utc(2026, 8, 2, 5, 58), status: "identified", body: "Object reads are failing in dub1 after a gateway deploy. Rolling back." },
      { atMin: utc(2026, 8, 2, 6, 29), status: "resolved", body: "Rollback complete. Read success rate is back to normal." },
    ],
  },
  {
    id: "postgres-pool-exhaustion",
    slug: "connection-pool-exhaustion",
    title: "Connection pools exhausted on shared Postgres",
    severity: "partial",
    startMin: utc(2026, 8, 6, 16, 40),
    endMin: utc(2026, 8, 6, 17, 58),
    detectedMin: utc(2026, 8, 6, 16, 43),
    detectedBy: "alert",
    regionIds: ["us-east"],
    impacts: [
      {
        serviceId: "postgres",
        fraction: 0.17,
        note: "New connections to shared-tier clusters in iad1 were refused. Dedicated clusters and existing connections were unaffected.",
      },
    ],
    summary:
      "One hour and eighteen minutes in which shared-tier clusters in iad1 refused new connections, because a single customer's deployment opened forty thousand of them in four minutes.",
    cause:
      "Shared tiers share a pooler and the pooler has a global ceiling with no per-tenant limit. That was a deliberate simplification when the shared tier launched, on the reasoning that a per-tenant limit would be the thing that broke first. It was the thing that was missing instead.",
    fix: "The customer's clients were rate-limited at the pooler and the ceiling was raised by half while connections drained.",
    prevention: [
      "Per-tenant connection limits are now enforced on the shared tier, defaulting to a fifth of the pool.",
      "The pooler reports the top five tenants by connection count on its dashboard, which is what turned a thirty-minute investigation into a three-minute one the moment somebody looked.",
    ],
    updates: [
      { atMin: utc(2026, 8, 6, 16, 57), status: "identified", body: "Shared Postgres clusters in iad1 are refusing new connections. Existing connections are fine." },
      { atMin: utc(2026, 8, 6, 17, 58), status: "resolved", body: "Connection limits are in place and the pool has drained. New connections are being accepted." },
    ],
  },
  {
    id: "queues-delivery-backlog",
    slug: "queue-delivery-backlog",
    title: "Delivery backlog on message queues",
    severity: "degraded",
    startMin: utc(2026, 8, 11, 8, 57),
    // Open at the pinned clock. §7b: the ongoing state has to be reachable
    // or nobody, including whoever wrote it, ever sees it.
    endMin: null,
    detectedMin: utc(2026, 8, 11, 8, 59),
    detectedBy: "probe",
    regionIds: ["us-east", "eu-west"],
    impacts: [
      {
        serviceId: "queues",
        fraction: 0.22,
        note: "Delivery to HTTP subscribers is behind by up to nine minutes. Nothing has been dropped; publish is unaffected.",
      },
    ],
    summary:
      "Delivery to HTTP subscribers is running behind in iad1 and dub1. Messages are queued, not lost, and the backlog is falling.",
    cause:
      "Under investigation. The current reading is that a subscriber returning 429 to a large fraction of deliveries is causing our retry path to hold workers that other subscribers need.",
    fix: "Not yet resolved. We have isolated the affected subscriber onto its own worker pool and the backlog has begun to fall.",
    prevention: [
      "To be written once this is closed. We publish the note within five working days of resolution.",
    ],
    updates: [
      { atMin: utc(2026, 8, 11, 9, 4), status: "investigating", body: "Delivery to HTTP subscribers is behind in iad1 and dub1. Publish is unaffected and nothing has been dropped." },
      { atMin: utc(2026, 8, 11, 9, 31), status: "identified", body: "Retries to one slow subscriber are holding shared workers. We are isolating it." },
    ],
  },
];

export function incidentBySlug(slug: string): Incident | undefined {
  return INCIDENTS.find((i) => i.slug === slug);
}

export function incidentById(id: string): Incident {
  const found = INCIDENTS.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown incident: ${id}`);
  return found;
}
