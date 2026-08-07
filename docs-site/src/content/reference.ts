import type { EndpointGroup } from "./types";

/**
 * The HTTP reference is typed data, not markdown — deliberately, and it is
 * the counter-example to the rest of the content in this template.
 *
 * Every endpoint has exactly the same shape: a method, a path, a table of
 * parameters, a response body. Written as markdown, that shape would be a
 * convention nobody enforces, and the tenth endpoint would quietly be laid
 * out differently from the first. As typed data the shape is the type, a
 * missing field is a red squiggle, and the page renders all ten
 * identically for free.
 *
 * The rule that falls out: markdown for prose that varies, typed data for
 * records that repeat.
 */
export const endpointGroups: EndpointGroup[] = [
  {
    id: "events",
    title: "Events",
    description:
      "An event is something that happened in your system. You publish it once; Rookery works out who is subscribed and delivers it to each of them.",
    endpoints: [
      {
        id: "publish-event",
        method: "POST",
        path: "/v1/events",
        title: "Publish an event",
        description:
          "Publishes an event and queues a delivery for every endpoint subscribed to its type. Returns before the deliveries are attempted.",
        params: [
          {
            name: "type",
            type: "string",
            required: true,
            description:
              "The event type, in `noun.verb` form — `invoice.paid`, `user.deleted`. Endpoints subscribe by type.",
          },
          {
            name: "data",
            type: "object",
            required: true,
            description:
              "The payload delivered to subscribers, verbatim. Maximum 256 KB once serialised.",
          },
          {
            name: "idempotency_key",
            type: "string",
            description:
              "If you publish twice with the same key inside 24 hours, the second call returns the first event instead of creating another.",
          },
          {
            name: "occurred_at",
            type: "timestamp",
            description:
              "When the event happened, if that is not now. Defaults to the time the request is received.",
          },
        ],
        response: `{
  "id": "ev_2p8fq1x0kd",
  "type": "invoice.paid",
  "data": { "invoice_id": "in_8121", "amount": 4200 },
  "occurred_at": "2026-07-14T09:41:22Z",
  "deliveries_queued": 3
}`,
      },
      {
        id: "list-events",
        method: "GET",
        path: "/v1/events",
        title: "List events",
        description:
          "Returns events most recent first. Events are retained for 30 days on the standard plan.",
        params: [
          { name: "type", type: "string", description: "Only events of this type." },
          {
            name: "since",
            type: "timestamp",
            description: "Only events that occurred at or after this time.",
          },
          {
            name: "limit",
            type: "integer",
            description: "Between 1 and 100. Defaults to 20.",
          },
          {
            name: "cursor",
            type: "string",
            description: "The `next_cursor` from a previous response.",
          },
        ],
        response: `{
  "data": [
    {
      "id": "ev_2p8fq1x0kd",
      "type": "invoice.paid",
      "occurred_at": "2026-07-14T09:41:22Z"
    }
  ],
  "has_more": true,
  "next_cursor": "ev_2p8fq1x0kd"
}`,
      },
      {
        id: "retrieve-event",
        method: "GET",
        path: "/v1/events/{id}",
        title: "Retrieve an event",
        description: "Returns a single event, including the payload as published.",
        params: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The event id, in the path.",
          },
        ],
        response: `{
  "id": "ev_2p8fq1x0kd",
  "type": "invoice.paid",
  "data": { "invoice_id": "in_8121", "amount": 4200 },
  "occurred_at": "2026-07-14T09:41:22Z"
}`,
      },
    ],
  },
  {
    id: "endpoints",
    title: "Endpoints",
    description:
      "An endpoint is a URL belonging to one of your subscribers, together with the event types it wants and the secret its signatures are computed with.",
    endpoints: [
      {
        id: "create-endpoint",
        method: "POST",
        path: "/v1/endpoints",
        title: "Create an endpoint",
        description:
          "Registers a URL to receive events. The signing secret is returned once, at creation, and never again — store it when you get it.",
        params: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "An `https://` URL. Plain HTTP is rejected outside test mode.",
          },
          {
            name: "types",
            type: "string[]",
            required: true,
            description:
              "Event types to subscribe to. `[\"*\"]` subscribes to everything, including types added later.",
          },
          {
            name: "description",
            type: "string",
            description: "A label for your own use. Shown in the dashboard and the CLI.",
          },
          {
            name: "enabled",
            type: "boolean",
            description: "Defaults to true. A disabled endpoint is skipped, not deleted.",
          },
        ],
        response: `{
  "id": "ep_9c4ktw02mn",
  "url": "https://hooks.acme.example/rookery",
  "types": ["invoice.paid", "invoice.voided"],
  "secret": "whsec_5f2b1a9d7e3c4086",
  "enabled": true,
  "created_at": "2026-07-14T09:38:04Z"
}`,
      },
      {
        id: "list-endpoints",
        method: "GET",
        path: "/v1/endpoints",
        title: "List endpoints",
        description: "Returns every endpoint on the account. Secrets are never included.",
        params: [
          {
            name: "enabled",
            type: "boolean",
            description: "Filter to only enabled, or only disabled, endpoints.",
          },
          { name: "limit", type: "integer", description: "Between 1 and 100. Defaults to 20." },
        ],
        response: `{
  "data": [
    {
      "id": "ep_9c4ktw02mn",
      "url": "https://hooks.acme.example/rookery",
      "types": ["invoice.paid", "invoice.voided"],
      "enabled": true
    }
  ],
  "has_more": false
}`,
      },
      {
        id: "update-endpoint",
        method: "PATCH",
        path: "/v1/endpoints/{id}",
        title: "Update an endpoint",
        description:
          "Changes the URL, the subscription list or the enabled flag. Fields you leave out are untouched.",
        params: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The endpoint id, in the path.",
          },
          { name: "url", type: "string", description: "A new destination URL." },
          {
            name: "types",
            type: "string[]",
            description: "Replaces the subscription list entirely; it is not merged.",
          },
          {
            name: "enabled",
            type: "boolean",
            description: "Disabling stops future deliveries. Queued attempts still run.",
          },
        ],
        response: `{
  "id": "ep_9c4ktw02mn",
  "url": "https://hooks.acme.example/rookery/v2",
  "types": ["invoice.paid"],
  "enabled": true,
  "updated_at": "2026-07-14T11:02:51Z"
}`,
      },
      {
        id: "delete-endpoint",
        method: "DELETE",
        path: "/v1/endpoints/{id}",
        title: "Delete an endpoint",
        description:
          "Removes the endpoint and cancels anything still queued for it. Its delivery history is kept.",
        params: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The endpoint id, in the path.",
          },
        ],
        response: `{
  "id": "ep_9c4ktw02mn",
  "deleted": true
}`,
      },
    ],
  },
  {
    id: "deliveries",
    title: "Deliveries",
    description:
      "A delivery is one event on its way to one endpoint. It holds every attempt made, with the status code and response body we saw each time.",
    endpoints: [
      {
        id: "list-deliveries",
        method: "GET",
        path: "/v1/deliveries",
        title: "List deliveries",
        description:
          "Returns deliveries most recent first. This is the endpoint behind the dashboard's delivery log.",
        params: [
          { name: "endpoint_id", type: "string", description: "Only deliveries to this endpoint." },
          { name: "event_id", type: "string", description: "Only deliveries of this event." },
          {
            name: "status",
            type: "string",
            description: "One of `pending`, `succeeded`, `failed`, `exhausted`.",
          },
          { name: "limit", type: "integer", description: "Between 1 and 100. Defaults to 20." },
        ],
        response: `{
  "data": [
    {
      "id": "dl_7ha20qsz13",
      "event_id": "ev_2p8fq1x0kd",
      "endpoint_id": "ep_9c4ktw02mn",
      "status": "succeeded",
      "attempts": 2
    }
  ],
  "has_more": true,
  "next_cursor": "dl_7ha20qsz13"
}`,
      },
      {
        id: "retrieve-delivery",
        method: "GET",
        path: "/v1/deliveries/{id}",
        title: "Retrieve a delivery",
        description:
          "Returns a delivery with the full attempt history — what we sent, what came back, and when the next attempt is due.",
        params: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The delivery id, in the path.",
          },
        ],
        response: `{
  "id": "dl_7ha20qsz13",
  "status": "succeeded",
  "attempts": [
    {
      "number": 1,
      "at": "2026-07-14T09:41:23Z",
      "status_code": 502,
      "duration_ms": 3021,
      "error": "bad gateway"
    },
    {
      "number": 2,
      "at": "2026-07-14T09:41:53Z",
      "status_code": 200,
      "duration_ms": 184
    }
  ]
}`,
      },
      {
        id: "retry-delivery",
        method: "POST",
        path: "/v1/deliveries/{id}/retry",
        title: "Retry a delivery",
        description:
          "Attempts a delivery again immediately, whatever its status. A manual retry does not consume one of the seven automatic attempts.",
        params: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The delivery id, in the path.",
          },
        ],
        response: `{
  "id": "dl_7ha20qsz13",
  "status": "pending",
  "attempts": 3
}`,
      },
    ],
  },
];
