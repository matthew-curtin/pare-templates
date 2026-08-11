/**
 * The five places this company is licensed to fire from.
 *
 * ONE number does almost all the work here: the distance to the nearest
 * spectator. It sets the largest shell that may legally leave the
 * ground (NFPA 1123, 21 metres of clear radius per inch of diameter),
 * and it sets how far behind the light the sound arrives. Those two
 * pull in opposite directions and there is no site where both are good.
 */
export interface FiringSite {
  id: string;
  name: string;
  where: string;
  /** Distance from the firing line to the nearest spectator, in metres. */
  crowdM: number;
  /** What the ground is like, and what that costs. */
  ground: string;
  /** The thing about this site nobody would guess. */
  catch: string;
}

export const SITES: readonly FiringSite[] = [
  {
    id: "north-quay",
    name: "North Quay",
    where: "Blyth harbour",
    crowdM: 240,
    ground:
      "Concrete, level, and drained — the easiest ground we fire from. Racks bolt down instead of being staked, which saves half a day.",
    catch:
      "The audience is across the water, so nothing between us and them can absorb a sound. It is the loudest site on this list by a distance, and the delay is the longest.",
  },
  {
    id: "bracken-fell",
    name: "Bracken Fell",
    where: "Above Kirkwhelpington",
    crowdM: 300,
    ground:
      "Peat over rock. Racks are staked and every stake is a fight. We allow an extra half-day on this site and we have never once not needed it.",
    catch:
      "The only site we hold that will take a twelve-inch shell, which is why every show that has one in it is fired from here whether the client asked for the hill or not.",
  },
  {
    id: "carrow-bowl",
    name: "Carrow Bowl",
    where: "The athletics ground, Cramlington",
    crowdM: 130,
    ground:
      "Grass over hard standing, with a cable run already buried from the floodlights. The only site where we do not have to lay our own line.",
    catch:
      "A bowl, so the sound comes back. Every break is heard twice, about four-tenths apart, and there is nothing to be done about it except not to write anything delicate.",
  },
  {
    id: "six-bells-rec",
    name: "Six Bells recreation ground",
    where: "Behind the pub, Widdrington",
    crowdM: 180,
    ground:
      "Football pitch. We fire from the far touchline and the club re-seeds the mortar line in March, which is written into the fee.",
    catch:
      "Room for an eight-inch shell and a budget for a four-inch. This is the only site on the list where the limit is money rather than ground.",
  },
  {
    id: "ravensmoor-lawn",
    name: "Ravensmoor lawn",
    where: "Ravensmoor Hall, Elsdon",
    crowdM: 88,
    ground:
      "Croquet lawn, and the family would like it back in the same condition. Plywood under every rack.",
    catch:
      "Eighty-eight metres to the terrace, which caps us at a four-inch shell — a hundred and twenty metres of altitude. Guests are looking up at sixty degrees all night, which is a decision made for us by the size of a lawn.",
  },
];

export function siteById(id: string): FiringSite {
  const found = SITES.find((s) => s.id === id);
  if (!found) throw new Error(`unknown site: ${id}`);
  return found;
}
