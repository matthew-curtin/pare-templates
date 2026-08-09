import type { Macro } from "./types";

/**
 * Saved replies.
 *
 * These are openings rather than whole answers, on purpose. A macro
 * that reads like a finished message gets sent as one, and the customer
 * can tell — the useful ones do the greeting, the apology and the
 * boilerplate, and stop where the actual thinking starts.
 */
export const macros: Macro[] = [
  {
    id: "mac-shipping",
    name: "Shipping delay",
    hint: "Order is late and we do not yet know where it is",
    body: "Thank you for chasing this, and I am sorry you have had to.\n\nI can see the order left us and has not been scanned since. I have opened a trace with the courier — they have 48 hours to find it, and if they cannot, I will send a replacement rather than wait for the outcome.",
  },
  {
    id: "mac-pairing-reset",
    name: "Pairing reset steps",
    hint: "The full reset sequence, current as of firmware 2.4",
    body: "Let's start from a clean slate on both sides.\n\n1. On your phone, find the speaker in the Bluetooth list and choose Forget.\n2. On the speaker, hold power and volume-down together for ten seconds, until the ring flashes amber twice.\n3. Wait for the ring to settle to a slow white pulse, then pair from your phone as if it were new.\n\nIf it still will not connect after that, tell me what the ring does when you try — the colour and the rhythm both mean something.",
  },
  {
    id: "mac-return-label",
    name: "Return label",
    hint: "Sending a prepaid label, no questions asked",
    body: "A prepaid return label is on its way to you by email — it should arrive within the hour.\n\nAny box is fine as long as the speaker cannot move around inside it. Nothing to pay, and you do not need to wait in for a collection; any post office will take it.",
  },
  {
    id: "mac-refund-timing",
    name: "Refund timing",
    hint: "When money actually reappears",
    body: "The refund has been issued at our end.\n\nCard refunds take three to five working days to appear, and some banks only post them overnight, so it may show up dated the day it was sent rather than the day you see it. If it is not with you by then, reply here and I will trace it.",
  },
  {
    id: "mac-warranty-photos",
    name: "Warranty — request photos",
    hint: "What we need before raising a replacement",
    body: "I can raise this under warranty. To skip the inspection stage I need two photographs:\n\n- the fault itself, in daylight if you can\n- the serial number, on the underside next to the charging port\n\nWith those two I can send a replacement straight away rather than asking you to post the faulty one back first.",
  },
  {
    id: "mac-trade",
    name: "Trade enquiry",
    hint: "Volume pricing — hand to sales",
    body: "Thank you for thinking of us for this.\n\nAnything above ten units is priced by our trade team rather than from the website, and they can invoice on 30-day terms. I have passed your details to them and someone will be in touch within one working day. If it is urgent, say so here and I will chase.",
  },
  {
    id: "mac-battery-cold",
    name: "Battery in cold weather",
    hint: "Expected behaviour, not a fault",
    body: "Below about five degrees a lithium cell reports and delivers noticeably less than it holds, and it comes back once it warms up — so a speaker that runs for eight hours indoors might manage three outdoors in winter without anything being wrong with it.\n\nThe test worth running is a full charge and a full discharge at room temperature. If it falls well short there, it is a fault and I will replace it.",
  },
  {
    id: "mac-idea-logged",
    name: "Product idea logged",
    hint: "Say what actually happens next, not 'we'll consider it'",
    body: "Thank you — that is a good suggestion and I have put it in front of the product team with your note attached rather than summarising it.\n\nThey go through the month's requests at the end of each month. I will come back to you either way, so you are not left wondering.",
  },
];
