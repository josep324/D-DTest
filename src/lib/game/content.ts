import { AIGUAQUIETA } from "@/lib/game/module-aiguaquieta";
import { CORREU } from "@/lib/game/module-correu";
import { PORT } from "@/lib/game/module-port";
import { TUTORIAL } from "@/lib/game/module-tutorial";
import type { Campaign, Character, Item } from "@/lib/game/types";

export const PARTY: Character[] = [
  {
    id: "calder",
    name: "Calder",
    role: "Guarda",
    heart: 18,
    heartMax: 18,
    guard: 15,
    abilities: { str: 15, dex: 12, con: 14, int: 10, wis: 13, cha: 11 },
    proficient: ["str", "con"],
    attack: "str",
    voice: "onyx",
    weapon: { name: "Espasa llarga", dice: "1d8", ability: "str" },
    portrait: "/art/calder.jpg",
  },
  {
    id: "bramble",
    name: "Bramble",
    role: "Escolta",
    heart: 14,
    heartMax: 14,
    guard: 13,
    abilities: { str: 10, dex: 16, con: 12, int: 12, wis: 14, cha: 10 },
    proficient: ["dex", "wis"],
    attack: "dex",
    voice: "nova",
    weapon: { name: "Arc curt", dice: "1d6", ability: "dex" },
    portrait: "/art/bramble.jpg",
  },
  {
    id: "vesper",
    name: "Vesper",
    role: "Arcanista",
    heart: 12,
    heartMax: 12,
    guard: 11,
    abilities: { str: 8, dex: 12, con: 11, int: 16, wis: 14, cha: 12 },
    proficient: ["int", "wis"],
    attack: "int",
    voice: "shimmer",
    weapon: { name: "Raig de guspira", dice: "1d8", ability: "int" },
    portrait: "",
    cameo: "vesper",
  },
  {
    id: "holt",
    name: "Holt",
    role: "Navalla",
    heart: 13,
    heartMax: 13,
    guard: 14,
    abilities: { str: 11, dex: 16, con: 12, int: 13, wis: 10, cha: 14 },
    proficient: ["dex", "cha"],
    attack: "dex",
    voice: "echo",
    weapon: { name: "Daga", dice: "1d4", ability: "dex" },
    portrait: "",
    cameo: "holt",
  },
];

export const INVENTORY: Item[] = [
  { id: "lantern", name: "Fanal de llautó", detail: "Crema net. El vidre està ratllat pel riu.", ownerId: "calder", effect: "edge" },
  { id: "rope", name: "Corda tova", detail: "Deu passes, amb un nus a cada braçada.", ownerId: "calder", effect: "edge" },
  { id: "chalk", name: "Guix de camí", detail: "Blanc, i un tros vermell.", ownerId: "bramble", effect: "edge" },
  { id: "string", name: "Corda d'arc de recanvi", detail: "Encerada. També serveix per lligar una canyella.", ownerId: "bramble" },
  { id: "bead", name: "Perla de l'orrery", detail: "Escalfa quan hi ha un nord veritable a prop.", ownerId: "vesper", effect: "edge" },
  { id: "circle", name: "Cercle de guix de butxaca", detail: "Per escoltar, no per tancar portes.", ownerId: "vesper" },
  { id: "picks", name: "Ganxos de forrellat", detail: "Per a caixes, reixes i finestres tossudes.", ownerId: "holt", effect: "edge" },
  { id: "knife", name: "Navalla plegable", detail: "Corda, fruita i, de tant en tant, un avís.", ownerId: "holt" },
  { id: "honey", name: "Pastís de mel", detail: "Dens, dolç i més amable del que sembla. Cura 4.", ownerId: "calder", effect: "heal", amount: 4, uses: 2 },
  { id: "wrap", name: "Embenat de canyella", detail: "Lli net i un bon nus. Cura 3.", ownerId: "bramble", effect: "heal", amount: 3, uses: 2 },
];

export const CAMPAIGNS: Campaign[] = [
  TUTORIAL,
  CORREU,
  AIGUAQUIETA,
  PORT,
];

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function getScene(campaignId: string, sceneId: string) {
  return getCampaign(campaignId)?.scenes.find((s) => s.id === sceneId);
}
