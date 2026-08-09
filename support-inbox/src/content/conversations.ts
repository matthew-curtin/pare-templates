import type { Conversation } from "./types";

/**
 * The inbox.
 *
 * Every timestamp is relative to `site.now` (12 March 2026, 14:20 UTC),
 * and they are tuned rather than sprinkled — CONVENTIONS §7b. What that
 * bought, and what to preserve if you rewrite this file:
 *
 * - **Exactly one conversation is past its promise.** #4118 is a Pro
 *   customer, so we owe a reply in two hours, and it has been sitting
 *   for over five. One is the right number: red on every third row
 *   reads as broken data rather than as a warning, and red on none at
 *   all means nobody ever sees the treatment.
 * - **Two are close to it** (#4117 with an hour left, #4116 with
 *   twenty-five minutes), so "nearly late" is visible as its own thing
 *   and not just as the absence of red.
 * - **Two are unassigned**, so the first saved filter is worth opening.
 * - **#4113's subject is far too long**, which is what a customer
 *   describing a fault properly actually writes, and it is how you find
 *   out whether the list truncates.
 * - **#4110 is eight messages deep** and #4101 is one message old, so a
 *   thread is exercised at both ends.
 * - **#4118 carries an internal note and is still overdue**, which is
 *   the rule in `lib/sla.ts` made visible: writing to a colleague is not
 *   answering the customer.
 * - **Ama has nothing**, so filtering to her shows the empty state.
 */
export const conversations: Conversation[] = [
  {
    id: "c-4118",
    ref: "4118",
    subject: "Speaker won't pair after the 2.4 firmware update",
    customerId: "cu-marta",
    channel: "email",
    status: "open",
    assigneeId: "m-jonas",
    tagIds: ["t-firmware", "t-pairing"],
    unread: true,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4118-1",
        kind: "inbound",
        authorId: "cu-marta",
        at: "2026-03-12T09:00:00Z",
        body: [
          "All four of our Harrow 2s updated to 2.4 overnight and none of them will pair now. They show up in the Bluetooth list, I tap one, it sits on Connecting for about fifteen seconds and then disappears from the list entirely.",
          "I have tried forgetting the device and re-pairing, and I have tried it from a second phone and from the studio Mac. Same on all three.",
          "We are recording on Saturday and I need at least two of them working by then.",
        ],
      },
      {
        id: "m-4118-2",
        kind: "note",
        authorId: "m-jonas",
        at: "2026-03-12T10:10:00Z",
        body: [
          "This is the third 2.4 pairing report this morning — the other two are on Android, Marta is on iOS and a Mac, so it is not platform-specific.",
          "Asked firmware to look at it. Not replying to her until I know whether we are rolling 2.4 back, because I do not want to send four studio speakers through a reset that will not fix it.",
        ],
      },
    ],
  },
  {
    id: "c-4117",
    ref: "4117",
    subject: "Where is my order? Shipped nine days ago",
    customerId: "cu-colin",
    channel: "email",
    status: "open",
    assigneeId: "m-nadia",
    tagIds: ["t-shipping"],
    unread: true,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4117-1",
        kind: "inbound",
        authorId: "cu-colin",
        at: "2026-03-12T07:20:00Z",
        body: [
          "Order THA-88104. The tracking has said In transit since the 3rd and has not moved since. Nine days for a next-day delivery.",
          "Can you tell me where it actually is, or send another one?",
        ],
      },
      {
        id: "m-4117-2",
        kind: "inbound",
        authorId: "cu-colin",
        at: "2026-03-12T11:05:00Z",
        body: [
          "Just checked again and it now says Delivered, on the 5th. Nothing has been delivered here. Nobody has signed for anything.",
        ],
      },
    ],
  },
  {
    id: "c-4116",
    ref: "4116",
    subject: "Battery drains overnight when idle",
    customerId: "cu-priyanka",
    channel: "chat",
    status: "open",
    assigneeId: null,
    tagIds: ["t-battery"],
    unread: true,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4116-1",
        kind: "inbound",
        authorId: "cu-priyanka",
        at: "2026-03-12T12:45:00Z",
        body: [
          "Hi — we charge all twelve units to full on Friday evening and by Monday morning about half of them are flat. They are switched off, sitting on a shelf, not connected to anything.",
          "Is that expected? It did not do this when we bought them last year.",
        ],
      },
    ],
  },
  {
    id: "c-4115",
    ref: "4115",
    subject: "Can I add a second speaker to the same account?",
    customerId: "cu-dan",
    channel: "email",
    status: "open",
    assigneeId: "m-tom",
    tagIds: ["t-pairing"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4115-1",
        kind: "inbound",
        authorId: "cu-dan",
        at: "2026-03-12T08:20:00Z",
        body: [
          "I am thinking of buying a second one for the kitchen. Can both be registered to the same account, and can I play the same thing on both at once?",
        ],
      },
    ],
  },
  {
    id: "c-4114",
    ref: "4114",
    subject: "Refund for the returned Harrow 2 still not showing",
    customerId: "cu-fiona",
    channel: "email",
    status: "open",
    assigneeId: "m-ruth",
    tagIds: ["t-returns", "t-billing"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4114-1",
        kind: "inbound",
        authorId: "cu-fiona",
        at: "2026-03-10T09:40:00Z",
        body: [
          "You received the returned speaker on the 2nd — I have the signature. When should I expect the refund?",
        ],
      },
      {
        id: "m-4114-2",
        kind: "reply",
        authorId: "m-ruth",
        at: "2026-03-10T10:25:00Z",
        body: [
          "Hello Fiona — thank you for chasing, and sorry you have had to.",
          "I can see it was received and inspected on the 3rd. Refunds go back to the original card and take three to five working days to appear once they leave us, so it should be with you by the end of this week. If it is not there by Friday, reply here and I will trace it from our side.",
        ],
      },
      {
        id: "m-4114-3",
        kind: "inbound",
        authorId: "cu-fiona",
        at: "2026-03-12T11:20:00Z",
        body: [
          "It is Thursday and there is still nothing. I have checked the statement twice and rung the bank, who say they have had nothing from you.",
        ],
      },
    ],
  },
  {
    id: "c-4113",
    ref: "4113",
    subject:
      "Left channel cuts out intermittently when the speaker is more than about four metres from the phone, but only since the newer firmware",
    customerId: "cu-sam",
    channel: "email",
    status: "waiting",
    assigneeId: "m-jonas",
    tagIds: ["t-firmware"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4113-1",
        kind: "inbound",
        authorId: "cu-sam",
        at: "2026-03-10T16:00:00Z",
        body: [
          "Since 2.3 I get a dropout on the left channel only, roughly every forty seconds, when I am more than about four metres away. Right channel is unaffected. Under four metres it never happens.",
          "Same in two different rooms and outdoors, so I do not think it is reflections.",
        ],
      },
      {
        id: "m-4113-2",
        kind: "note",
        authorId: "m-jonas",
        at: "2026-03-10T16:40:00Z",
        body: [
          "Left channel only, at range, one side dropping — that is the secondary link in a stereo pair, not the phone link. Worth having him swap which unit is primary before we go any further.",
        ],
      },
      {
        id: "m-4113-3",
        kind: "reply",
        authorId: "m-jonas",
        at: "2026-03-10T17:15:00Z",
        body: [
          "Thanks Sam, that is a genuinely useful description.",
          "In a stereo pair one speaker talks to your phone and then relays to the other, so a fault on one side at range usually means the relay rather than the phone link. Could you swap which of the two you power on first, so the other becomes primary, and tell me whether the dropout moves to the right channel or stays on the left?",
        ],
      },
      {
        id: "m-4113-4",
        kind: "inbound",
        authorId: "cu-sam",
        at: "2026-03-11T18:30:00Z",
        body: [
          "Swapped them. The dropout moved to the right channel — so it follows the secondary, not the physical unit.",
          "I also tried it with the two speakers about a metre apart instead of six and it stopped completely.",
        ],
      },
      {
        id: "m-4113-5",
        kind: "reply",
        authorId: "m-jonas",
        at: "2026-03-12T10:20:00Z",
        body: [
          "That confirms it — it is the link between the two speakers, and 2.3 dropped its transmit power to buy back some battery life. It is a bug and it is ours, not yours.",
          "The fix is in 2.5, which is with test now and should be out in about a fortnight. Until then keeping the pair within roughly three metres of each other will avoid it. I will write back here the day it ships so you are not watching for it.",
        ],
      },
    ],
  },
  {
    id: "c-4112",
    ref: "4112",
    subject: "Invoice address is wrong on my last three receipts",
    customerId: "cu-ilse",
    channel: "email",
    status: "waiting",
    assigneeId: "m-ruth",
    tagIds: ["t-billing"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4112-1",
        kind: "inbound",
        authorId: "cu-ilse",
        at: "2026-03-11T11:00:00Z",
        body: [
          "We moved offices in January and the receipts still show the old address. Our accounts team cannot file them like this. Can you reissue the last three?",
        ],
      },
      {
        id: "m-4112-2",
        kind: "reply",
        authorId: "m-ruth",
        at: "2026-03-11T13:40:00Z",
        body: [
          "Of course. I have updated the billing address on the account, so anything from here on will be correct.",
          "For the three already issued I can reissue them, but I need the address exactly as your accounts team wants it printed, including the postcode formatting. Send that over and I will have them back to you the same day.",
        ],
      },
    ],
  },
  {
    id: "c-4111",
    ref: "4111",
    subject: "Does the Harrow 2 support aptX?",
    customerId: "cu-greg",
    channel: "social",
    status: "open",
    assigneeId: "m-tom",
    tagIds: [],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4111-1",
        kind: "inbound",
        authorId: "cu-greg",
        at: "2026-03-11T18:20:00Z",
        body: [
          "Quick one — does the Harrow 2 do aptX, or is it SBC and AAC only? The spec page does not say.",
        ],
      },
    ],
  },
  {
    id: "c-4110",
    ref: "4110",
    subject: "Warranty claim — cracked grille out of the box",
    customerId: "cu-neve",
    channel: "email",
    status: "open",
    assigneeId: "m-nadia",
    tagIds: ["t-warranty", "t-returns"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4110-1",
        kind: "inbound",
        authorId: "cu-neve",
        at: "2026-03-05T08:30:00Z",
        body: [
          "The speaker arrived this morning and there is a crack across the metal grille, about four centimetres, on the front face. The box was not damaged.",
          "It plays fine but I have paid full price for something that looks second hand.",
        ],
      },
      {
        id: "m-4110-2",
        kind: "reply",
        authorId: "m-nadia",
        at: "2026-03-05T10:15:00Z",
        body: [
          "I am sorry, Neve — that should not have left us like that, and an undamaged box makes it ours rather than the courier's.",
          "Could you send a photograph of the grille and one of the serial number on the underside? With those two I can raise the replacement straight away rather than sending it for inspection first.",
        ],
      },
      {
        id: "m-4110-3",
        kind: "inbound",
        authorId: "cu-neve",
        at: "2026-03-06T07:50:00Z",
        body: [
          "Photos attached. Serial is THA2-4471-9930.",
          "How long will the replacement take? I bought it as a present and it is needed on the 21st.",
        ],
      },
      {
        id: "m-4110-4",
        kind: "note",
        authorId: "m-nadia",
        at: "2026-03-06T09:05:00Z",
        body: [
          "Serial is in the batch flagged in February for grille seating. Third one this month.",
          "Sending a replacement without asking for the faulty unit back first — she needs it for the 21st and a there-and-back return will not make it.",
        ],
      },
      {
        id: "m-4110-5",
        kind: "reply",
        authorId: "m-nadia",
        at: "2026-03-06T11:30:00Z",
        body: [
          "Thank you — that is enough to go on. A replacement is going out today and should reach you on Monday, well inside the 21st.",
          "Do not worry about sending the cracked one back before then. There is a prepaid label in the box with the new one; post it whenever suits you.",
        ],
      },
      {
        id: "m-4110-6",
        kind: "inbound",
        authorId: "cu-neve",
        at: "2026-03-09T19:10:00Z",
        body: [
          "Replacement arrived and the grille is perfect. Thank you for sorting it so quickly.",
        ],
      },
      {
        id: "m-4110-7",
        kind: "reply",
        authorId: "m-nadia",
        at: "2026-03-10T08:45:00Z",
        body: [
          "Glad it got there. Enjoy the 21st, and there is no rush at all on the return label.",
        ],
      },
      {
        id: "m-4110-8",
        kind: "inbound",
        authorId: "cu-neve",
        at: "2026-03-12T08:20:00Z",
        body: [
          "Sorry to reopen this — I posted the old one back on Tuesday and the tracking says it was refused at your depot. Is the label wrong?",
        ],
      },
    ],
  },
  {
    id: "c-4109",
    ref: "4109",
    subject: "Bluetooth drops whenever I lock my phone",
    customerId: "cu-marcus",
    channel: "chat",
    status: "waiting",
    assigneeId: "m-priya",
    tagIds: ["t-pairing"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4109-1",
        kind: "inbound",
        authorId: "cu-marcus",
        at: "2026-03-11T14:05:00Z",
        body: [
          "Every time my phone screen locks the music stops. Unlock it and it comes back. Is there a setting?",
        ],
      },
      {
        id: "m-4109-2",
        kind: "reply",
        authorId: "m-priya",
        at: "2026-03-11T14:35:00Z",
        body: [
          "That is almost always the phone rather than the speaker — battery optimisation suspending whichever app is playing when the screen goes off.",
          "Which phone and which app are you using? If it is Android, the setting is under Apps, then the app, then Battery, and you want it set to Unrestricted.",
        ],
      },
    ],
  },
  {
    id: "c-4108",
    ref: "4108",
    subject: "Bulk order for twelve units — do you do trade pricing?",
    customerId: "cu-hannah",
    channel: "email",
    status: "open",
    assigneeId: "m-nadia",
    tagIds: ["t-billing"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4108-1",
        kind: "inbound",
        authorId: "cu-hannah",
        at: "2026-03-12T12:20:00Z",
        body: [
          "We are fitting out twenty-four rooms and want a Harrow 2 in each. Starting with twelve this quarter and twelve in the summer.",
          "Is there a trade rate at that volume, and can you invoice rather than take a card?",
        ],
      },
    ],
  },
  {
    id: "c-4107",
    ref: "4107",
    subject: "Feature request: a sleep timer",
    customerId: "cu-otto",
    channel: "email",
    status: "snoozed",
    assigneeId: "m-priya",
    tagIds: ["t-idea"],
    unread: false,
    snoozedUntil: "2026-03-13T09:00:00Z",
    messages: [
      {
        id: "m-4107-1",
        kind: "inbound",
        authorId: "cu-otto",
        at: "2026-03-09T10:00:00Z",
        body: [
          "I fall asleep listening and the speaker plays all night. A timer that switches it off after thirty or sixty minutes would be perfect. The app has room for it next to the alarm.",
        ],
      },
      {
        id: "m-4107-2",
        kind: "reply",
        authorId: "m-priya",
        at: "2026-03-09T15:20:00Z",
        body: [
          "That is a good one, and you are not the first to ask. I have put it in front of the product team with your note attached.",
          "I have set myself a reminder to come back to you on Friday once they have been through this month's requests, so you get a real answer rather than a maybe.",
        ],
      },
    ],
  },
  {
    id: "c-4106",
    ref: "4106",
    subject: "Speaker arrived in the wrong colour",
    customerId: "cu-colin",
    channel: "email",
    status: "resolved",
    assigneeId: "m-ruth",
    tagIds: ["t-shipping", "t-returns"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4106-1",
        kind: "inbound",
        authorId: "cu-colin",
        at: "2026-03-02T13:10:00Z",
        body: [
          "I ordered the slate one and a sand one has turned up. Order THA-87740.",
        ],
      },
      {
        id: "m-4106-2",
        kind: "reply",
        authorId: "m-ruth",
        at: "2026-03-02T14:05:00Z",
        body: [
          "Sorry about that — a picking error, and entirely ours.",
          "The slate one is going out today. Keep the sand one until it arrives, then send it back with the label in the box. Nothing to pay either way.",
        ],
      },
      {
        id: "m-4106-3",
        kind: "inbound",
        authorId: "cu-colin",
        at: "2026-03-04T09:15:00Z",
        body: ["Slate one here, sand one posted back. All good, thanks."],
      },
    ],
  },
  {
    id: "c-4105",
    ref: "4105",
    subject: "How do I reset it to factory settings?",
    customerId: "cu-dan",
    channel: "chat",
    status: "resolved",
    assigneeId: "m-tom",
    tagIds: ["t-firmware"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4105-1",
        kind: "inbound",
        authorId: "cu-dan",
        at: "2026-03-08T16:40:00Z",
        body: ["How do I factory reset it? Selling my old phone."],
      },
      {
        id: "m-4105-2",
        kind: "reply",
        authorId: "m-tom",
        at: "2026-03-08T16:48:00Z",
        body: [
          "Hold the power button and the volume-down button together for ten seconds, until the ring flashes amber twice.",
          "That clears every paired device, so you will need to pair your new phone from scratch afterwards.",
        ],
      },
      {
        id: "m-4105-3",
        kind: "inbound",
        authorId: "cu-dan",
        at: "2026-03-08T17:02:00Z",
        body: ["Done, thank you."],
      },
    ],
  },
  {
    id: "c-4104",
    ref: "4104",
    subject: "Thank you",
    customerId: "cu-marta",
    channel: "social",
    status: "resolved",
    assigneeId: "m-priya",
    tagIds: [],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4104-1",
        kind: "inbound",
        authorId: "cu-marta",
        at: "2026-03-07T11:30:00Z",
        body: [
          "Just wanted to say the replacement grille cloth arrived and matches perfectly. Lovely bit of service.",
        ],
      },
      {
        id: "m-4104-2",
        kind: "reply",
        authorId: "m-priya",
        at: "2026-03-07T12:15:00Z",
        body: ["Thank you for saying so — I have passed it on to the team."],
      },
    ],
  },
  {
    id: "c-4103",
    ref: "4103",
    subject: "Charging case not holding charge",
    customerId: "cu-aleksy",
    channel: "email",
    status: "waiting",
    assigneeId: "m-jonas",
    tagIds: ["t-battery", "t-warranty"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4103-1",
        kind: "inbound",
        authorId: "cu-aleksy",
        at: "2026-03-11T07:30:00Z",
        body: [
          "The case charges the speaker once and then is empty. It used to do three or four.",
          "I am recording outdoors most days, usually between minus five and plus two.",
        ],
      },
      {
        id: "m-4103-2",
        kind: "reply",
        authorId: "m-jonas",
        at: "2026-03-11T09:10:00Z",
        body: [
          "Cold is a large part of that — below about five degrees a lithium cell will report and deliver a good deal less than it holds, and it comes back when it warms up.",
          "Could you charge the case indoors, leave it at room temperature overnight, and then tell me how many full charges it manages without going outside? If it is still one, it is a fault and I will replace it under warranty.",
        ],
      },
    ],
  },
  {
    id: "c-4102",
    ref: "4102",
    subject: "Cancel the extended warranty plan",
    customerId: "cu-ilse",
    channel: "email",
    status: "snoozed",
    assigneeId: "m-ruth",
    tagIds: ["t-billing"],
    unread: false,
    snoozedUntil: "2026-03-16T09:00:00Z",
    messages: [
      {
        id: "m-4102-1",
        kind: "inbound",
        authorId: "cu-ilse",
        at: "2026-03-08T10:20:00Z",
        body: [
          "We would like to cancel the extended warranty on the four units bought last May. What is the notice period?",
        ],
      },
      {
        id: "m-4102-2",
        kind: "reply",
        authorId: "m-ruth",
        at: "2026-03-08T11:45:00Z",
        body: [
          "There is no notice period — it stops at the end of the month you cancel in, and there is nothing to pay after that.",
          "One thing worth knowing before I action it: the cover runs to next May, so cancelling now gives up fourteen months you have already paid for. I will leave it until Monday in case you would rather let it run out, and cancel then if I have not heard otherwise.",
        ],
      },
    ],
  },
  {
    id: "c-4101",
    ref: "4101",
    subject: "Stereo pairing guide is wrong on step 4",
    customerId: "cu-sam",
    channel: "email",
    status: "open",
    assigneeId: null,
    tagIds: ["t-firmware"],
    unread: true,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4101-1",
        kind: "inbound",
        authorId: "cu-sam",
        at: "2026-03-12T14:08:00Z",
        body: [
          "Step 4 of the stereo pairing guide says hold both volume buttons. On 2.3 onwards it is power and volume-up. Took me a while to work that out.",
        ],
      },
    ],
  },
  {
    id: "c-4100",
    ref: "4100",
    subject: "Did you receive the returned unit?",
    customerId: "cu-fiona",
    channel: "chat",
    status: "resolved",
    assigneeId: "m-ruth",
    tagIds: ["t-returns"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4100-1",
        kind: "inbound",
        authorId: "cu-fiona",
        at: "2026-03-03T15:20:00Z",
        body: ["Just checking the returned speaker got to you?"],
      },
      {
        id: "m-4100-2",
        kind: "reply",
        authorId: "m-ruth",
        at: "2026-03-03T15:31:00Z",
        body: [
          "It did — signed for on the 2nd and inspected this morning. Nothing else needed from you.",
        ],
      },
    ],
  },
  {
    id: "c-4099",
    ref: "4099",
    subject: "Popping sound at high volume",
    customerId: "cu-neve",
    channel: "email",
    status: "waiting",
    assigneeId: "m-jonas",
    tagIds: ["t-warranty"],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4099-1",
        kind: "inbound",
        authorId: "cu-neve",
        at: "2026-03-11T20:05:00Z",
        body: [
          "Above about three quarters volume there is a pop on bass notes. Quieter than that it is fine.",
        ],
      },
      {
        id: "m-4099-2",
        kind: "reply",
        authorId: "m-jonas",
        at: "2026-03-12T08:05:00Z",
        body: [
          "That could be the driver or it could be the source file clipping before it reaches us, and the two want different fixes.",
          "Could you try the same track from a different app, and a different track from the original app, and tell me which combinations pop? If it follows the track it is the recording; if it follows the speaker it is ours.",
        ],
      },
    ],
  },
  {
    id: "c-4098",
    ref: "4098",
    subject: "Do you sell replacement grille cloth?",
    customerId: "cu-otto",
    channel: "email",
    status: "resolved",
    assigneeId: "m-tom",
    tagIds: [],
    unread: false,
    snoozedUntil: null,
    messages: [
      {
        id: "m-4098-1",
        kind: "inbound",
        authorId: "cu-otto",
        at: "2026-03-06T09:00:00Z",
        body: ["The cat has had a go at mine. Can I buy the cloth separately?"],
      },
      {
        id: "m-4098-2",
        kind: "reply",
        authorId: "m-tom",
        at: "2026-03-06T09:40:00Z",
        body: [
          "We do — it is in the spares section of the shop, in all three colours.",
          "It pulls off from the bottom edge; there are no clips to break.",
        ],
      },
    ],
  },
];
