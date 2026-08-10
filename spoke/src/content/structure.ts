import type { Line } from "@/lib/bom.ts";

/**
 * The tree itself: one row per edge, `qty` of `child` in one `parent`.
 *
 * Written in the order the shop builds in rather than alphabetically,
 * because this array IS the order every tree on the site renders in,
 * and a frame that appears after its own mudguards reads as a filing
 * system rather than as a machine.
 *
 * Quantities are per ONE of the parent. Nothing here is exploded — that
 * two wheels of thirty-two spokes comes to sixty-four is the model's
 * job, and writing 64 anywhere in this file would be the beginning of
 * two numbers that disagree.
 */
export const lines: Line[] = [
  // ── Kade 3 ────────────────────────────────────────────────────────
  { parent: "kade", child: "fs-kade", qty: 1 },
  { parent: "kade", child: "ws-kade", qty: 1 },
  { parent: "kade", child: "dt-kade", qty: 1 },
  { parent: "kade", child: "brakes-kade", qty: 1 },
  { parent: "kade", child: "cockpit-kade", qty: 1 },
  { parent: "kade", child: "seating", qty: 1 },
  { parent: "kade", child: "lighting", qty: 1 },
  { parent: "kade", child: "guards-kade", qty: 1 },
  { parent: "kade", child: "carrier", qty: 1 },
  { parent: "kade", child: "packing", qty: 1 },

  // ── Vaart L ───────────────────────────────────────────────────────
  { parent: "vaart", child: "fs-vaart", qty: 1 },
  { parent: "vaart", child: "ws-vaart", qty: 1 },
  { parent: "vaart", child: "dt-vaart", qty: 1 },
  { parent: "vaart", child: "brakes-vaart", qty: 1 },
  { parent: "vaart", child: "cockpit-vaart", qty: 1 },
  { parent: "vaart", child: "seating", qty: 1 },
  { parent: "vaart", child: "lighting", qty: 1 },
  { parent: "vaart", child: "guards-vaart", qty: 1 },
  { parent: "vaart", child: "deck", qty: 1 },
  { parent: "vaart", child: "packing", qty: 1 },

  // ── Framesets ─────────────────────────────────────────────────────
  { parent: "fs-kade", child: "frame-kade", qty: 1 },
  { parent: "fs-kade", child: "fork-28", qty: 1 },
  { parent: "fs-kade", child: "headset", qty: 1 },

  { parent: "fs-vaart", child: "frame-vaart", qty: 1 },
  { parent: "fs-vaart", child: "fork-vaart", qty: 1 },
  { parent: "fs-vaart", child: "headset", qty: 1 },

  { parent: "frame-kade", child: "tube-main-kade", qty: 1 },
  { parent: "frame-kade", child: "tube-rear-kade", qty: 1 },
  { parent: "frame-kade", child: "dropout", qty: 2 },
  { parent: "frame-kade", child: "head-tube", qty: 1 },
  { parent: "frame-kade", child: "bb-shell", qty: 1 },
  { parent: "frame-kade", child: "braze-rod", qty: 0.6 },
  { parent: "frame-kade", child: "flux", qty: 0.02 },
  { parent: "frame-kade", child: "coat-kade", qty: 1 },
  { parent: "frame-kade", child: "decal-set", qty: 1 },

  { parent: "frame-vaart", child: "tube-main-vaart", qty: 1 },
  { parent: "frame-vaart", child: "tube-tail-vaart", qty: 1 },
  { parent: "frame-vaart", child: "dropout", qty: 2 },
  { parent: "frame-vaart", child: "head-tube", qty: 1 },
  { parent: "frame-vaart", child: "bb-shell", qty: 1 },
  { parent: "frame-vaart", child: "braze-rod", qty: 1.1 },
  { parent: "frame-vaart", child: "flux", qty: 0.03 },
  { parent: "frame-vaart", child: "coat-vaart", qty: 1 },
  { parent: "frame-vaart", child: "decal-set", qty: 1 },

  { parent: "headset", child: "hs-cup", qty: 2 },
  { parent: "headset", child: "bearing-hs", qty: 2 },
  { parent: "headset", child: "crown-race", qty: 1 },
  { parent: "headset", child: "hs-topcap", qty: 1 },
  { parent: "headset", child: "hs-spacer", qty: 3 },

  // ── Wheels ────────────────────────────────────────────────────────
  { parent: "ws-kade", child: "wheel-front", qty: 1 },
  { parent: "ws-kade", child: "wheel-rear-kade", qty: 1 },

  { parent: "ws-vaart", child: "wheel-front", qty: 1 },
  { parent: "ws-vaart", child: "wheel-rear-vaart", qty: 1 },

  { parent: "wheel-front", child: "rim-28", qty: 1 },
  { parent: "wheel-front", child: "hub-front", qty: 1 },
  { parent: "wheel-front", child: "spoke-292", qty: 32 },
  { parent: "wheel-front", child: "nipple", qty: 32 },
  { parent: "wheel-front", child: "rim-tape", qty: 1 },
  { parent: "wheel-front", child: "tyre-28", qty: 1 },
  { parent: "wheel-front", child: "tube-28", qty: 1 },
  { parent: "wheel-front", child: "axle-nut", qty: 2 },

  { parent: "hub-front", child: "hub-shell-dyn", qty: 1 },
  { parent: "hub-front", child: "bearing-6001", qty: 2 },

  { parent: "wheel-rear-kade", child: "rim-28", qty: 1 },
  { parent: "wheel-rear-kade", child: "hub-rear-gear", qty: 1 },
  { parent: "wheel-rear-kade", child: "spoke-292", qty: 32 },
  { parent: "wheel-rear-kade", child: "nipple", qty: 32 },
  { parent: "wheel-rear-kade", child: "rim-tape", qty: 1 },
  { parent: "wheel-rear-kade", child: "tyre-28", qty: 1 },
  { parent: "wheel-rear-kade", child: "tube-28", qty: 1 },
  { parent: "wheel-rear-kade", child: "axle-nut", qty: 2 },

  { parent: "wheel-rear-vaart", child: "rim-26", qty: 1 },
  { parent: "wheel-rear-vaart", child: "hub-rear-cargo", qty: 1 },
  { parent: "wheel-rear-vaart", child: "spoke-264", qty: 32 },
  { parent: "wheel-rear-vaart", child: "nipple", qty: 32 },
  { parent: "wheel-rear-vaart", child: "rim-tape", qty: 1 },
  { parent: "wheel-rear-vaart", child: "tyre-26", qty: 1 },
  { parent: "wheel-rear-vaart", child: "tube-26", qty: 1 },
  { parent: "wheel-rear-vaart", child: "axle-nut", qty: 2 },

  // ── Drivetrain ────────────────────────────────────────────────────
  { parent: "dt-kade", child: "crankset", qty: 1 },
  { parent: "dt-kade", child: "bb-cartridge", qty: 1 },
  { parent: "dt-kade", child: "chain", qty: 1 },
  { parent: "dt-kade", child: "sprocket", qty: 1 },
  { parent: "dt-kade", child: "chain-guard", qty: 1 },
  { parent: "dt-kade", child: "shifter", qty: 1 },

  { parent: "dt-vaart", child: "crankset", qty: 1 },
  { parent: "dt-vaart", child: "bb-cartridge", qty: 1 },
  { parent: "dt-vaart", child: "chain", qty: 1 },
  { parent: "dt-vaart", child: "sprocket", qty: 1 },
  { parent: "dt-vaart", child: "chain-guard", qty: 1 },
  { parent: "dt-vaart", child: "tensioner", qty: 1 },

  // ── Brakes ────────────────────────────────────────────────────────
  { parent: "brakes-kade", child: "brake-lever", qty: 2 },
  { parent: "brakes-kade", child: "roller-brake", qty: 2 },
  { parent: "brakes-kade", child: "brake-cable", qty: 2 },
  { parent: "brakes-kade", child: "brake-housing", qty: 1.6 },
  { parent: "brakes-kade", child: "cable-ferrule", qty: 6 },

  { parent: "brakes-vaart", child: "brake-lever", qty: 2 },
  { parent: "brakes-vaart", child: "roller-brake", qty: 2 },
  { parent: "brakes-vaart", child: "brake-cable", qty: 2 },
  { parent: "brakes-vaart", child: "brake-housing", qty: 2.4 },
  { parent: "brakes-vaart", child: "cable-ferrule", qty: 6 },

  // ── Cockpit and seat ──────────────────────────────────────────────
  { parent: "cockpit-kade", child: "bar-kade", qty: 1 },
  { parent: "cockpit-kade", child: "stem", qty: 1 },
  { parent: "cockpit-kade", child: "grip", qty: 2 },
  { parent: "cockpit-kade", child: "bell", qty: 1 },

  { parent: "cockpit-vaart", child: "bar-vaart", qty: 1 },
  { parent: "cockpit-vaart", child: "stem", qty: 1 },
  { parent: "cockpit-vaart", child: "grip", qty: 2 },
  { parent: "cockpit-vaart", child: "bell", qty: 1 },

  { parent: "seating", child: "saddle", qty: 1 },
  { parent: "seating", child: "seatpost", qty: 1 },
  { parent: "seating", child: "seat-clamp", qty: 1 },

  // ── Lighting ──────────────────────────────────────────────────────
  { parent: "lighting", child: "light-front", qty: 1 },
  { parent: "lighting", child: "light-rear", qty: 1 },
  { parent: "lighting", child: "loom-wire", qty: 3 },
  { parent: "lighting", child: "spade", qty: 6 },
  { parent: "lighting", child: "cable-tie", qty: 12 },
  { parent: "lighting", child: "bolt-m5x16", qty: 2 },

  // ── Mudguards ─────────────────────────────────────────────────────
  { parent: "guards-kade", child: "guard-28-front", qty: 1 },
  { parent: "guards-kade", child: "guard-28-rear", qty: 1 },
  { parent: "guards-kade", child: "guard-stay", qty: 4 },
  { parent: "guards-kade", child: "bolt-m5x16", qty: 8 },
  { parent: "guards-kade", child: "washer-m5", qty: 8 },
  { parent: "guards-kade", child: "nut-m5", qty: 8 },

  { parent: "guards-vaart", child: "guard-28-front", qty: 1 },
  { parent: "guards-vaart", child: "guard-26-rear", qty: 1 },
  { parent: "guards-vaart", child: "guard-stay", qty: 4 },
  { parent: "guards-vaart", child: "bolt-m5x16", qty: 8 },
  { parent: "guards-vaart", child: "washer-m5", qty: 8 },
  { parent: "guards-vaart", child: "nut-m5", qty: 8 },

  // ── Carrier and deck ──────────────────────────────────────────────
  { parent: "carrier", child: "rack-tube", qty: 1 },
  { parent: "carrier", child: "bolt-m6x20", qty: 6 },
  { parent: "carrier", child: "bolt-m5x16", qty: 4 },

  { parent: "deck", child: "rack-tube", qty: 1 },
  { parent: "deck", child: "deck-slat", qty: 7 },
  { parent: "deck", child: "deck-strap", qty: 2 },
  { parent: "deck", child: "footboard", qty: 2 },
  { parent: "deck", child: "bolt-m6x20", qty: 10 },
  { parent: "deck", child: "bolt-m5x16", qty: 6 },

  // ── Packing ───────────────────────────────────────────────────────
  { parent: "packing", child: "carton", qty: 1 },
  { parent: "packing", child: "manual", qty: 1 },
  { parent: "packing", child: "toolkit", qty: 1 },
];
