/**
 * The company, the navigation, and the arguments the site is making.
 *
 * Every figure quoted in `CLAIMS` is a literal, and every one of them is
 * asserted against the model by `scripts/check-availability.mjs`. Nudge an
 * incident's impact fraction and the prose stops being true silently —
 * which is the failure this repo has been bitten by often enough to test
 * for. The checker names the sentence that went stale.
 */

export const SITE = {
  name: "Coldharbour",
  product: "status",
  tagline: "Compute, storage and network on hardware we own.",
  description:
    "The Coldharbour status page. Six services, five regions, and the error budget behind every promise.",
  founded: 2019,
  supportEmail: "status@coldharbour.example",
  // Not a real company. Said plainly in the footer as well as here.
  fictional: true,
};

export const NAV = [
  { href: "/", label: "Status" },
  { href: "/incidents", label: "Incidents" },
  { href: "/sla", label: "SLA & credits" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/subscribe", label: "Subscribe" },
] as const;

export const FOOTER = {
  blurb:
    "Coldharbour runs compute, object storage, an edge network, managed Postgres and message queues in five regions, on hardware we buy and rack ourselves.",
  columns: [
    {
      title: "Status",
      links: [
        { href: "/", label: "Current status" },
        { href: "/incidents", label: "Incident history" },
        { href: "/subscribe", label: "Notifications" },
      ],
    },
    {
      title: "The promise",
      links: [
        { href: "/sla", label: "Service level agreement" },
        { href: "/sla#method", label: "How we measure" },
        { href: "/sla#credits", label: "Credits owed" },
      ],
    },
    {
      title: "The metal",
      links: [
        { href: "/infrastructure", label: "Regions and hardware" },
        { href: "/infrastructure#redundancy", label: "Redundancy" },
      ],
    },
  ],
  fictionNote:
    "Coldharbour is not a real company. Every service, region, incident, post-mortem and credit on this site is invented, and the numbers are arithmetic over invented data rather than a record of anything that happened. It is a template — replace all of it before showing it to anyone.",
};

/**
 * The arguments, with their numbers.
 *
 * Kept here rather than in the components both because §3 says so and
 * because it puts every checkable claim on one screen, where a reader can
 * see what the site is asserting without reading seven pages.
 */
export const CLAIMS = {
  /** The front page's whole reason for existing. */
  budget: [
    "Every status page publishes a percentage. A percentage is a score, and a score tells you what already happened.",
    "The number underneath it is a budget. A target of 99.95% is not a boast — it is a permission slip for 66.2 minutes of failure a quarter, and the only useful question on any given morning is how much of it is left.",
    "Managed Postgres has spent 70.8% of this quarter's budget with 45.0% of the quarter gone. Nothing is down. It is still the most important thing on this page.",
  ],

  /** Two incidents eight days apart, and why duration is the wrong axis. */
  pair: [
    "On 31 July, read replicas in Dublin fell behind the primary for four hours and fifty-one minutes. On 23 July, every Postgres primary in every region was unreachable for twenty-two minutes.",
    "The first is thirteen times longer and cost 11.6 minutes of error budget. The second cost 22.0, because four per cent of requests were affected in one and all of them in the other.",
    "Duration is what a timeline shows you. Impact is what it costs. A page that publishes only the first is publishing the wrong one.",
  ],

  /** Same incidents, three windows, three verdicts. */
  windows: [
    "Managed Postgres has met its target over the last ninety days, at 99.962%, and missed it over this quarter, at 99.921%.",
    "Those are the same incidents counted over two different windows. Credits are settled against a third — the calendar month — which is why July owes you money and the ninety-day figure does not know about it.",
    "We publish all three rather than the flattering one.",
  ],

  /** Why there is no single Coldharbour number anywhere on the site. */
  noSingleNumber: [
    "There is no overall Coldharbour uptime figure on this page, and there is not going to be one.",
    "Six services against three different targets average to something arithmetically true that tells you nothing about whether the one you depend on was working. The row you care about is the only row that matters.",
  ],

  /** The half of an outage nobody publishes. */
  detection: [
    "Across the fifteen unplanned incidents we have closed, we have averaged 3.8 minutes to notice and 98.6 minutes to fix. The sixteenth is still running, so it has a detection time and not yet a repair one.",
    "One of the fifteen went the other way. On 25 June a transit provider withdrew our European routes; a customer told us twenty-three minutes later and we fixed it in fifteen. Our monitoring had been watching from inside the two networks that still worked, so from where we were looking nothing had happened.",
    "Mean time to repair is the number a vendor quotes because it is the number a vendor is best at. Detection is the half that is actually hard.",
  ],

  /** Money. */
  credits: [
    "We owe $1,012 in service credits across the last six complete months — five of which produced one.",
    "$699 of that can no longer be claimed. A credit has to be asked for within sixty days of the month it covers, and nobody asked.",
    "We publish the expired ones anyway. A credit record that quietly drops them is a record built to flatter.",
  ],

  /** The outage that changed the page. */
  february: [
    "February is the reason any of this is published.",
    "Managed Postgres went read-only for five hours and forty-one minutes across two regions. Availability for the month came out at 99.391%, which put it two bands down the schedule: a 25% credit, $495 against a $1,980 bill.",
    "Until then this page was a green tick and a number, and the number was an average over a year.",
  ],
};

/** Short page introductions, in one place so their voice stays level. */
export const PAGE_INTROS = {
  incidents:
    "Everything that has gone wrong since February, including the announced maintenance, with what each one cost. Nothing is removed from this list.",
  sla:
    "What we promise, how it is measured, what a miss is worth, and every credit the last six months have produced.",
  infrastructure:
    "Five sites, our own hardware, and the parts of it that have failed. Written up because a page that only shows the racks is a brochure.",
  subscribe:
    "Choose what you want to hear about and how. We send one notification per incident state change and nothing else — no newsletters, no product mail.",
};
