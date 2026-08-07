import type { Issue } from "./types";

/**
 * Every issue on the board.
 *
 * This is the single source of truth for the board's contents. The
 * board deliberately does **not** persist card moves — drag a card,
 * reload, and it returns here. That is on purpose: this file is the
 * template's content, and content that a stray localStorage entry can
 * override stops being editable.
 *
 * Keys are non-contiguous, the way a real tracker's are after a year
 * of work. Change `issuePrefix` in site.ts to rename them all.
 */
export const issues: Issue[] = [
  /* ---------------------------------------------------------------- */
  /* Backlog — agreed, not scheduled                                   */
  /* ---------------------------------------------------------------- */
  {
    id: "LAN-241",
    title: "Bulk actions in the conversation list",
    summary: "Select many conversations and act on all of them at once.",
    description: [
      "Agents clearing a morning backlog currently open, tag and close one conversation at a time. On a Monday that is several hundred clicks before anyone has answered anything.",
      "Selection should work the way a file list does — click, shift-click for a range, and a modifier for individual additions. The action bar appears only once something is selected, and says how many.",
      "Deliberately out of scope for a first version: bulk reply. Sending the same message to forty people is a different feature with a much higher cost of being wrong.",
    ],
    column: "backlog",
    priority: "high",
    points: 8,
    assigneeId: null,
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Selection model agreed with design", done: true },
      { id: "c2", text: "Decide the undo window", done: false },
      { id: "c3", text: "Keyboard equivalents for every bulk action", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "simone",
        text: "Pulled this forward after three support calls asked for it in the same week.",
        at: "2026-07-22",
      },
    ],
    updated: "2026-07-22",
  },
  {
    id: "LAN-238",
    title: "Round-robin assignment rules",
    summary: "Distribute new conversations across a team automatically.",
    description: [
      "Larger workspaces want new conversations spread across whoever is on shift, rather than sitting unassigned until someone claims them. The rule needs to respect availability, so a person marked away is skipped rather than accumulating a queue they will never see.",
      "The hard part is not the rotation, it is what happens when the rule and a human disagree — an agent reassigning something by hand must win, and the rotation must not immediately hand it back.",
    ],
    column: "backlog",
    priority: "medium",
    points: 13,
    assigneeId: null,
    labelIds: ["inbox", "platform"],
    checklist: [
      { id: "c1", text: "Write down the precedence rules", done: false },
      { id: "c2", text: "Decide where availability is stored", done: false },
    ],
    activity: [],
    updated: "2026-07-20",
  },
  {
    id: "LAN-236",
    title: "Satisfaction survey after a conversation is resolved",
    summary: "Ask the customer how it went, once, and never twice.",
    description: [
      "A one-question rating sent when a conversation is resolved, with an optional comment. The number matters less than the comments, which are the only unprompted feedback most support teams ever receive.",
      "Sending rules need care. A conversation reopened and resolved again must not produce a second survey, and a customer who has been surveyed this week should not be surveyed again — survey fatigue produces silence, which reads identically to satisfaction.",
    ],
    column: "backlog",
    priority: "medium",
    points: 8,
    assigneeId: "simone",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Draft the question wording", done: true },
      { id: "c2", text: "Agree the cool-off period", done: false },
      { id: "c3", text: "Decide where results surface", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "simone",
        text: "Wrote up the sending rules — the reopen case is the one that trips every competitor.",
        at: "2026-07-19",
      },
    ],
    updated: "2026-07-19",
  },
  {
    id: "LAN-233",
    title: "Dark mode for the agent console",
    summary: "A second theme, chosen by the agent or followed from the OS.",
    description: [
      "Support agents sit in this tool for eight hours. A dark theme is a comfort feature, and comfort features on a tool people cannot choose to leave are worth more than they look.",
      "The work is mostly in the tokens rather than the components: anything that hardcodes a colour has to move into the theme file first, and that sweep is the real estimate.",
    ],
    column: "backlog",
    priority: "low",
    points: 5,
    assigneeId: "tomas",
    labelIds: ["design"],
    checklist: [
      { id: "c1", text: "Audit for hardcoded colours", done: false },
      { id: "c2", text: "Check contrast on both themes", done: false },
    ],
    activity: [],
    updated: "2026-07-16",
  },
  {
    id: "LAN-229",
    title: "Export a conversation as a PDF",
    summary: "One conversation, printable, with attachments listed.",
    description: [
      "Asked for almost entirely by teams who need a record for a dispute or a refund. The requirement is less about the format than about it being complete — a transcript missing the attachment names is not evidence of anything.",
    ],
    column: "backlog",
    priority: "low",
    points: 3,
    assigneeId: null,
    labelIds: ["inbox", "docs"],
    checklist: [],
    activity: [],
    updated: "2026-07-14",
  },
  {
    id: "LAN-226",
    title: "Audit log for workspace admins",
    summary: "Who changed what, when, and from where.",
    description: [
      "Every settings change, permission change and inbox deletion, recorded and searchable. This shows up in nearly every security review, and answering it with a screenshot of our application logs has stopped being convincing.",
      "The retention question needs deciding before the schema does. Ninety days is what most of our peers offer; a year is what buyers ask for.",
    ],
    column: "backlog",
    priority: "medium",
    points: 8,
    assigneeId: null,
    labelIds: ["platform", "infra"],
    checklist: [
      { id: "c1", text: "Decide retention", done: false },
      { id: "c2", text: "List the events worth recording", done: false },
    ],
    activity: [],
    updated: "2026-07-13",
  },
  {
    id: "LAN-222",
    title: "Detect and collapse quoted replies",
    summary: "Stop showing the whole thread again inside every email reply.",
    description: [
      "Email clients quote the entire previous message underneath a reply. After six exchanges a conversation is mostly its own history, and the new sentence — the only part anyone needs — is at the top of a very long card.",
      "Nobody has ever solved this perfectly, because the quoting format is a convention rather than a standard. The goal is to catch the common clients confidently and leave everything else expanded, which fails in the safe direction: showing too much beats hiding a sentence someone wrote.",
    ],
    column: "backlog",
    priority: "high",
    points: 5,
    assigneeId: null,
    labelIds: ["inbox", "bug"],
    checklist: [
      { id: "c1", text: "Collect real samples from the top five clients", done: true },
      { id: "c2", text: "Decide the fail-open behaviour", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "amara",
        text: "Saved a folder of real replies to test against — Outlook is the awkward one, as usual.",
        at: "2026-07-11",
      },
    ],
    updated: "2026-07-11",
  },
  {
    id: "LAN-218",
    title: "Per-inbox business hours",
    summary: "Different inboxes, different opening times and holidays.",
    description: [
      "A workspace with a European and an Australian inbox currently gets one set of hours, which is wrong for at least one of them. Hours drive the auto-reply, the first-response clock and the away indicator, so getting this wrong is visible to customers.",
    ],
    column: "backlog",
    priority: "medium",
    points: 5,
    assigneeId: null,
    labelIds: ["platform"],
    checklist: [],
    activity: [],
    updated: "2026-07-09",
  },

  /* ---------------------------------------------------------------- */
  /* To do — picked up this cycle                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "LAN-215",
    title: "Snooze a conversation until a chosen time",
    summary: "Hide it from the inbox and bring it back when it matters.",
    description: [
      "Waiting on a customer, a courier or a colleague is the most common reason a conversation sits open, and an open conversation nobody can act on is noise in everyone's count.",
      "Snoozing takes it out of the active view and returns it at the chosen time, or immediately if the customer replies first. That second rule is the one that makes the feature trustworthy — a snooze that swallows a reply is worse than no snooze.",
    ],
    column: "todo",
    priority: "high",
    points: 5,
    assigneeId: "mei",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Preset times agreed", done: true },
      { id: "c2", text: "Wake on customer reply", done: false },
      { id: "c3", text: "Show snoozed state in search results", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "simone",
        text: "Scoped for this cycle. Presets only — a full date picker can wait.",
        at: "2026-07-28",
      },
    ],
    updated: "2026-07-28",
  },
  {
    id: "LAN-213",
    title: "Search filters for tag and assignee",
    summary: "Narrow a search without learning a query syntax.",
    description: [
      "Search returns everything matching the text and nothing else. Agents work around it by typing a colleague's name and hoping, which finds conversations that merely mention them.",
      "Filters are a dropdown per facet, applied together, and written into the URL so a useful search can be sent to someone else. The query syntax stays available for the handful of people who already use it.",
    ],
    column: "todo",
    priority: "high",
    points: 8,
    assigneeId: "jonas",
    labelIds: ["inbox", "performance"],
    checklist: [
      { id: "c1", text: "Index the two new facets", done: false },
      { id: "c2", text: "Filters reflected in the URL", done: false },
      { id: "c3", text: "Measure query time on the largest workspace", done: false },
    ],
    activity: [],
    updated: "2026-07-30",
  },
  {
    id: "LAN-211",
    title: "Empty states for every inbox view",
    summary: "Say what the view is for, not just that it is empty.",
    description: [
      "Six views currently render a blank panel when they have nothing in them, which reads as broken rather than clear. A new agent's first hour is mostly empty views.",
      "Each one gets a line explaining what will appear there and, where there is one, the action that fills it.",
    ],
    column: "todo",
    priority: "medium",
    points: 3,
    assigneeId: "tomas",
    labelIds: ["design"],
    checklist: [
      { id: "c1", text: "Write the six lines", done: true },
      { id: "c2", text: "Illustration or no illustration", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "tomas",
        text: "Copy drafted. Leaning toward no illustration — they date badly and add weight.",
        at: "2026-07-29",
      },
    ],
    updated: "2026-07-29",
  },
  {
    id: "LAN-209",
    title: "Rate-limit the public webhook endpoint",
    summary: "One noisy integration should not be able to slow everyone down.",
    description: [
      "A customer's misconfigured integration sent us roughly forty thousand webhook deliveries in nine minutes on Thursday. Nothing fell over, but queue latency was visible to unrelated workspaces for about half an hour, which means the next one might.",
      "Per-workspace limits with a documented ceiling, a Retry-After header, and a clear error rather than a silent drop. Silently discarding a customer's data to protect ourselves is the wrong trade even when it is the easy one.",
    ],
    column: "todo",
    priority: "urgent",
    points: 3,
    assigneeId: "priya",
    labelIds: ["infra", "platform"],
    checklist: [
      { id: "c1", text: "Agree the ceiling", done: true },
      { id: "c2", text: "Retry-After on every rejection", done: false },
      { id: "c3", text: "Alert when a workspace is being limited", done: false },
      { id: "c4", text: "Document it on the developer page", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "priya",
        text: "Wrote up Thursday's incident. We got lucky with the timing more than anything else.",
        at: "2026-07-27",
      },
      {
        id: "a2",
        memberId: "simone",
        text: "Agreed to take this into the cycle over the snooze work if it comes to a choice.",
        at: "2026-07-28",
      },
    ],
    updated: "2026-08-03",
  },
  {
    id: "LAN-207",
    title: "Screen-reader labels on the triage toolbar",
    summary: "Eight icon-only buttons currently announce as \"button\".",
    description: [
      "The triage toolbar is the most-used surface in the product and the least usable one without sight. Every control is an icon with a tooltip, and a tooltip is not an accessible name.",
      "Names, states and a live region announcing the result of each action. The state part matters most: an agent needs to hear that a conversation was assigned, not merely that a button was pressed.",
    ],
    column: "todo",
    priority: "high",
    points: 3,
    assigneeId: "mei",
    labelIds: ["accessibility"],
    checklist: [
      { id: "c1", text: "Name every control", done: false },
      { id: "c2", text: "Announce the outcome, not the click", done: false },
      { id: "c3", text: "Pass with VoiceOver and NVDA", done: false },
    ],
    activity: [],
    updated: "2026-07-31",
  },

  /* ---------------------------------------------------------------- */
  /* Building — someone is on it now                                   */
  /* ---------------------------------------------------------------- */
  {
    id: "LAN-204",
    title: "Saved replies with merge fields",
    summary: "Reusable answers that fill in the customer's details.",
    description: [
      "Teams keep their common answers in a shared document and paste them in, which means the answers drift, nobody knows which version is current, and the customer's name has to be edited in by hand every time.",
      "Saved replies live in the workspace, support a small set of merge fields, and are insertable from the composer by name. The field set is deliberately small — name, inbox, agent, order reference — because every one we add is one more thing that can render blank in front of a customer.",
    ],
    column: "building",
    priority: "high",
    points: 8,
    assigneeId: "amara",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Field set agreed", done: true },
      { id: "c2", text: "Insertion from the composer", done: true },
      { id: "c3", text: "Preview before sending", done: false },
      { id: "c4", text: "Never send an unresolved field", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "amara",
        text: "Insertion works. Now on the guard that stops a blank field ever reaching a customer.",
        at: "2026-08-04",
      },
    ],
    updated: "2026-08-04",
  },
  {
    id: "LAN-201",
    title: "Attachment previews in the thread",
    summary: "Show images and PDFs inline instead of as a filename.",
    description: [
      "Half of all support conversations contain a screenshot, and every one of them currently requires a download to see. Agents describe this as the single slowest part of their day, which is a strong claim for something so small.",
      "Images render inline at a sensible size, PDFs get a first-page thumbnail, everything else keeps its filename and icon. Nothing renders until the agent opens the conversation, so a mailbox full of large attachments does not become a slow inbox.",
    ],
    column: "building",
    priority: "medium",
    points: 5,
    assigneeId: "jonas",
    labelIds: ["inbox", "design"],
    checklist: [
      { id: "c1", text: "Inline images", done: true },
      { id: "c2", text: "PDF first page", done: false },
      { id: "c3", text: "Lazy-load below the fold", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "jonas",
        text: "Images are in. The PDF thumbnail needs a worker or it blocks the thread on big files.",
        at: "2026-08-05",
      },
    ],
    updated: "2026-08-05",
  },
  {
    id: "LAN-198",
    title: "Move conversation history off the primary database",
    summary: "Archive anything older than a year to cold storage.",
    description: [
      "The conversations table is the largest thing we own and most of it has not been read in eighteen months. It is now the reason our backups take four hours and the reason schema changes are frightening.",
      "History older than a year moves to cold storage, still searchable, with a slower first read. The migration runs workspace by workspace and is reversible at every step — a one-way migration of the only copy of a customer's history is not a risk worth taking to save an afternoon.",
    ],
    column: "building",
    priority: "urgent",
    points: 13,
    assigneeId: "priya",
    labelIds: ["infra", "performance"],
    checklist: [
      { id: "c1", text: "Storage decision signed off", done: true },
      { id: "c2", text: "Dual-write in place", done: true },
      { id: "c3", text: "Backfill the three largest workspaces", done: false },
      { id: "c4", text: "Rollback rehearsed on staging", done: false },
      { id: "c5", text: "Search still returns archived results", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "priya",
        text: "Dual-write has been on for a week with no drift. Starting the backfill on the smallest of the three first.",
        at: "2026-08-05",
      },
      {
        id: "a2",
        memberId: "amara",
        text: "Rehearse the rollback before the backfill, not after — it is the only step we cannot undo by waiting.",
        at: "2026-08-05",
      },
    ],
    updated: "2026-08-06",
  },
  {
    id: "LAN-195",
    title: "Keyboard shortcuts for triage",
    summary: "Assign, tag, snooze and resolve without reaching for the mouse.",
    description: [
      "The people who use this product most are the people who would benefit most from never touching a pointing device. Every competitor has this and ours is the reason at least two evaluations went the other way.",
      "A small set that covers the triage loop, discoverable from a shortcut sheet, and never bound to a bare letter while a text field has focus — which is the bug every implementation of this ships at least once.",
    ],
    column: "building",
    priority: "medium",
    points: 5,
    assigneeId: "mei",
    labelIds: ["inbox", "accessibility"],
    checklist: [
      { id: "c1", text: "Bindings agreed", done: true },
      { id: "c2", text: "Shortcut sheet", done: true },
      { id: "c3", text: "Never fire while composing", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "mei",
        text: "Sheet is in. Now making sure a bare key never fires while the composer has focus.",
        at: "2026-08-04",
      },
    ],
    updated: "2026-08-04",
  },
  {
    id: "LAN-192",
    title: "Redesign the composer",
    summary: "One surface for replying, noting and forwarding.",
    description: [
      "Replying to a customer, leaving an internal note and forwarding to another team are three different boxes that look almost identical. Notes get sent to customers about once a fortnight, which is the kind of mistake an interface causes rather than a person.",
      "One composer, with the mode chosen explicitly and the surface changing colour when it is a note. Making the dangerous state look different is worth more than any warning dialog.",
    ],
    column: "building",
    priority: "high",
    points: 8,
    assigneeId: "tomas",
    labelIds: ["design", "inbox"],
    checklist: [
      { id: "c1", text: "Mode switch pattern agreed", done: true },
      { id: "c2", text: "Note state visually unmistakable", done: true },
      { id: "c3", text: "Test with agents who have sent a note by mistake", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "tomas",
        text: "Second round of the note treatment. The colour alone was not enough — it needs the label too.",
        at: "2026-08-03",
      },
    ],
    updated: "2026-08-03",
  },

  /* ---------------------------------------------------------------- */
  /* In review — waiting on another pair of eyes                       */
  /* ---------------------------------------------------------------- */
  {
    id: "LAN-188",
    title: "Merge duplicate conversations",
    summary: "Combine two threads from the same person into one history.",
    description: [
      "A customer who emails, gets no reply within an hour and emails again now exists twice, usually assigned to two different agents who each answer without knowing about the other.",
      "Merging joins the histories in time order and keeps both original addresses on the result, so a reply reaches the person however they wrote in. The merge is reversible for a day afterwards, because the wrong two conversations will eventually be merged and un-merging by hand is not possible.",
    ],
    column: "review",
    priority: "high",
    points: 8,
    assigneeId: "amara",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Time-ordered merge", done: true },
      { id: "c2", text: "Both addresses kept on the result", done: true },
      { id: "c3", text: "Undo window", done: true },
      { id: "c4", text: "Review", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "amara",
        text: "Up for review. The undo window is 24 hours — happy to argue about the number.",
        at: "2026-08-02",
      },
      {
        id: "a2",
        memberId: "priya",
        text: "Reading it today. Mostly want to check what happens if both sides have an unsent draft.",
        at: "2026-08-04",
      },
    ],
    updated: "2026-08-04",
  },
  {
    id: "LAN-185",
    title: "Fix the flash of unassigned state on first load",
    summary: "The inbox shows every conversation as unassigned for a beat.",
    description: [
      "Assignments arrive in a second request, so for a few hundred milliseconds after load the whole inbox claims that nothing is assigned to anyone. Agents have started refreshing twice out of habit, which tells you how much they trust the first render.",
      "The fix is to not render an assignment state we do not have yet, rather than to render the wrong one quickly.",
    ],
    column: "review",
    priority: "medium",
    points: 2,
    assigneeId: "jonas",
    labelIds: ["bug", "performance"],
    checklist: [
      { id: "c1", text: "Reproduce reliably", done: true },
      { id: "c2", text: "Hold the row until assignment resolves", done: true },
      { id: "c3", text: "Review", done: false },
    ],
    activity: [
      {
        id: "a1",
        memberId: "jonas",
        text: "Turned out to be two requests where there should have been one. Small diff.",
        at: "2026-08-01",
      },
    ],
    updated: "2026-08-01",
  },

  /* ---------------------------------------------------------------- */
  /* Done — shipped this cycle                                         */
  /* ---------------------------------------------------------------- */
  {
    id: "LAN-181",
    title: "Typing indicators between agents",
    summary: "See when a colleague is already answering.",
    description: [
      "Two agents answering the same conversation at the same time was our most-reported irritation, and the fix is the oldest one in chat software.",
      "Shipped to everyone on Tuesday. Duplicate replies in the following two days were down by roughly two thirds.",
    ],
    column: "done",
    priority: "medium",
    points: 5,
    assigneeId: "mei",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Presence channel", done: true },
      { id: "c2", text: "Indicator in the list and the thread", done: true },
      { id: "c3", text: "Shipped", done: true },
    ],
    activity: [
      {
        id: "a1",
        memberId: "mei",
        text: "Out to everyone. Duplicate replies down about two thirds over two days.",
        at: "2026-07-30",
      },
    ],
    updated: "2026-07-30",
  },
  {
    id: "LAN-177",
    title: "Retire the v1 webhook payload",
    summary: "Six months after the notice, the old shape is gone.",
    description: [
      "The v1 payload has been deprecated since February, with a notice in the developer docs, three emails to affected workspaces and a warning header on every delivery.",
      "Eleven workspaces were still on it at the start of the cycle; all eleven were contacted directly and have migrated. The code is out.",
    ],
    column: "done",
    priority: "high",
    points: 5,
    assigneeId: "priya",
    labelIds: ["platform", "infra"],
    checklist: [
      { id: "c1", text: "Contact the remaining eleven", done: true },
      { id: "c2", text: "Remove the code path", done: true },
      { id: "c3", text: "Update the developer docs", done: true },
    ],
    activity: [
      {
        id: "a1",
        memberId: "priya",
        text: "All eleven migrated. Removing it turned out to delete more than it added, which is always a good sign.",
        at: "2026-07-29",
      },
    ],
    updated: "2026-07-29",
  },
  {
    id: "LAN-174",
    title: "Inline images in saved replies",
    summary: "A saved reply can carry a screenshot.",
    description: [
      "Small addition to the saved replies work, pulled forward because the two most-used replies in every workspace we looked at were instructions that badly wanted a picture.",
    ],
    column: "done",
    priority: "low",
    points: 3,
    assigneeId: "amara",
    labelIds: ["inbox"],
    checklist: [
      { id: "c1", text: "Upload and store", done: true },
      { id: "c2", text: "Size limit", done: true },
    ],
    activity: [],
    updated: "2026-07-28",
  },
  {
    id: "LAN-170",
    title: "Contrast pass on the conversation list",
    summary: "Nine text and icon colours were below the threshold.",
    description: [
      "An accessibility audit ahead of a procurement review found nine failures in the busiest view in the product, most of them muted metadata on a tinted row.",
      "All nine now pass at 4.5:1, and the tokens they came from were the problem rather than the components, so the fix landed in one file.",
    ],
    column: "done",
    priority: "high",
    points: 3,
    assigneeId: "tomas",
    labelIds: ["accessibility", "design"],
    checklist: [
      { id: "c1", text: "Audit", done: true },
      { id: "c2", text: "Fix at the token level", done: true },
      { id: "c3", text: "Re-check", done: true },
    ],
    activity: [
      {
        id: "a1",
        memberId: "tomas",
        text: "All nine were downstream of two tokens. Fixed there instead of in eleven components.",
        at: "2026-07-27",
      },
    ],
    updated: "2026-07-27",
  },
  {
    id: "LAN-166",
    title: "Cut cold-start time on the agent console",
    summary: "First paint down from 4.1s to 1.3s on a cold cache.",
    description: [
      "The console shipped its entire icon set, three date libraries and the full editor bundle before rendering anything. Two of the date libraries were unused.",
      "Splitting the editor out of the initial bundle did most of the work; removing the duplicated dependencies did the rest.",
    ],
    column: "done",
    priority: "high",
    points: 8,
    assigneeId: "jonas",
    labelIds: ["performance"],
    checklist: [
      { id: "c1", text: "Measure honestly, cold cache", done: true },
      { id: "c2", text: "Split the editor bundle", done: true },
      { id: "c3", text: "Remove duplicate dependencies", done: true },
      { id: "c4", text: "Add a budget so it cannot regress", done: true },
    ],
    activity: [
      {
        id: "a1",
        memberId: "jonas",
        text: "4.1s to 1.3s. The budget check is the part that matters — without it this comes back in a quarter.",
        at: "2026-07-24",
      },
    ],
    updated: "2026-07-24",
  },
  {
    id: "LAN-161",
    title: "Onboarding checklist for new workspaces",
    summary: "Four steps between signing up and answering a real message.",
    description: [
      "New workspaces were connecting an inbox and then stopping, because the remaining setup was discoverable only by exploring settings.",
      "A four-step checklist that disappears once it is finished and never returns. Activation over the first two weeks after shipping was up by a bit under a fifth.",
    ],
    column: "done",
    priority: "medium",
    points: 5,
    assigneeId: "simone",
    labelIds: ["docs", "design"],
    checklist: [
      { id: "c1", text: "Pick the four steps", done: true },
      { id: "c2", text: "Dismiss permanently once complete", done: true },
    ],
    activity: [
      {
        id: "a1",
        memberId: "simone",
        text: "Activation up just under a fifth over two weeks. Keeping it to four steps was the whole trick.",
        at: "2026-07-23",
      },
    ],
    updated: "2026-07-23",
  },
];

export const issueById = new Map(issues.map((i) => [i.id, i]));
