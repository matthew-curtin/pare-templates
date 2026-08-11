# Credits

Coldharbour is invented. The company, the regions, the services, every
incident, every post-mortem and every credit on this site are fiction, and
the numbers are arithmetic over invented data rather than a record of
anything that happened.

## Photography

**Direction: the plant rather than the product — wide enough to show how it
is built, available light, nobody in frame, and something in every shot
that this page makes a claim about.**

That sentence is a rejection tool, and it did its job three times below.

Every photograph settles a claim the prose beside it makes. The test §6
sets is whether you could say what an image is *for*; if you could swap it
for a different picture of the same subject without anybody noticing, it is
decoration, and decoration is what makes a template look like a template.

| File | Source | What it is asked to prove |
| --- | --- | --- |
| `src/images/cold-aisle.jpg` | [Pexels 4508751](https://www.pexels.com/photo/server-racks-on-data-center-4508751/) | That the redundancy claimed on the page is visible from the floor — two separate tray runs overhead feeding the same cabinets. |
| `src/images/switchgear.jpg` | [Pexels 33706880](https://www.pexels.com/photo/industrial-electrical-control-room-interior-33706880/) | The power claim, and the June incident specifically: the failed control relay was behind one of these doors. One panel is one feed. |
| `src/images/cross-connect.jpg` | [Pexels 4508748](https://www.pexels.com/photo/structured-cabling-system-with-numerous-network-cables-4508748/) | That the fibre into the building is ours rather than a leased wavelength, which is what makes a third transit provider a purchase instead of a negotiation. |
| `src/images/dry-coolers.jpg` | [Pexels 37913513](https://www.pexels.com/photo/industrial-cooling-system-infrastructure-outdoors-37913513/) | Free cooling on outside air — the reason the Hillsboro site pencils out, and why chillers are the fallback rather than the design. |

All four are from [Pexels](https://www.pexels.com/license/), free to use
and modify with no attribution required. They are listed anyway.

### Treatment

```css
--photo-filter: grayscale(1) sepia(0.34) hue-rotate(176deg) saturate(0.85)
  contrast(1.09) brightness(0.9);
```

Declared once in `globals.css` and applied by exactly one rule
(`.plate img`), so a replacement image inherits the grade automatically and
changing the grade re-grades the set.

These four arrived under blue LED, warm fluorescent, an orange line card
and full daylight — five white balances in four photographs, which is
§6's point that no amount of searching turns a stock library into a shoot.
The treatment crushes them, rather than grading lightly, because **hue is
carrying nothing here**: the argument is about structure and redundancy,
not about colour, so removing it costs the page nothing and buys a set. The
cool cast puts what is left on the same ground as the page instead of
leaving a warm hole in it.

### What was rejected, and why

- **A portrait close-up of cabinet doors** ([Pexels 5203849](https://www.pexels.com/photo/black-server-racks-5203849/)) —
  a good photograph of a rack and a poor one for this page. It fails the
  direction's first clause: it is not wide enough to show how anything is
  built, and it would have said the same thing as `cold-aisle.jpg` less
  well.
- **An indoor chiller plant room** ([Pexels 37604386](https://www.pexels.com/photo/industrial-hvac-system-in-modern-facility-37604386/)) —
  rejected on the last clause rather than the first. It is a fine picture
  of some machinery and it settles no claim this page makes; the free
  cooling argument is about *outside air*, which is what the rooftop frame
  actually shows.
- **The switchgear frame as it was shot.** Its far-left edge carried a
  vendor's contact label with a URL and a freephone number. §7 forbids a
  real company's name and a photograph is the easiest way for one to get
  in, so it was cropped 6% from each side and re-checked enlarged. What
  remains legible is site asset tagging — `13.8kV TRANSF. INCOMING FDR`,
  `T-606`, `A302` — which is not a trademark.
- **A standby generator**, which was the first choice for the power claim,
  because the June incident is a generator that started, ran for twenty-two
  minutes and was connected to nothing. Every honest candidate was either a
  power station in another country or an engine on a pallet in a yard.
  Three misses is the signal to stop looking and change which picture
  proves the claim — so the switchgear lineup carries it instead, which is
  where the relay actually was.

There is deliberately no photograph beside the erasure-coding claim. The
fragments are spread across cabinets indistinguishable from the ones
already shown, and an image there would be decoration standing in for
evidence. The page says so in words rather than leaving a gap.

## Typefaces

- **[Archivo](https://fonts.google.com/specimen/Archivo)** — SIL Open Font
  License 1.1. Self-hosted via `@fontsource-variable/archivo`, using the
  `standard.css` entry point because it is the one carrying **both** the
  `wght` and `wdth` axes. The width axis does a job rather than a
  flourish: row labels and date ticks condense to 86% and 80% instead of
  wrapping when their container narrows.
- **[Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono)** — SIL
  Open Font License 1.1, via `@fontsource-variable/roboto-mono`. Every
  figure on the site is set in it, because a page whose whole content is
  numbers in columns wants them to line up.

Both are self-hosted, so the template works offline and makes no
third-party request.
