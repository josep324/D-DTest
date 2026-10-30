import { AIGUAQUIETA } from "@/lib/game/module-aiguaquieta";
import { CORREU } from "@/lib/game/module-correu";
import { TUTORIAL } from "@/lib/game/module-tutorial";
import type { Campaign, Character, Choice, Item } from "@/lib/game/types";

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

const speak = (id: string, label: string, hint?: string): Choice => ({ id, label, hint });

export const CAMPAIGNS: Campaign[] = [
  TUTORIAL,
  CORREU,
  AIGUAQUIETA,
  {
    id: "harbor",
    name: "Port del Crepuscle",
    blurb: "El vaixell surt quan giri la cinquena marea. La carta és esquerdada. Les petjades són mullades.",
    chapters: "Tres capítols",
    levels: "Nivells 1–3",
    span: "Abans de la comporta",
    canon:
      "El Port del Crepuscle té cinc dies fins que s'obri la comporta de la marea i un vaixell llogat salpi sense la seva carta nocturna. La campana del capitana del port és esquerdada. Unes petjades mullades creuen el moll i s'aturen al mig. La companyia és Calder, Bramble, Vesper i Holt. La carta era guardada en una sala de cartes d'una torre (la Carta Nocturna) i la comporta és un mur de mar de pedra. Qui va amagar la carta és un mariner adult que volia aturar el vaixell abans que tornés el fanaler del far. Es resol trobant la marca del fanaler i adobant la carta. Sense sang.",
    scenes: [
      {
        id: "salt-wharf",
        name: "Moll de Vidre-sal",
        image: "/art/harbor.jpg",
        daypart: "Crepuscle",
        clock: "18:05",
        weather: "Bo",
        sky: "CREPUSCLE · BO",
        ambient: "Quitrà, sal i una campana amb una esquerda que se't nota a les dents.",
        chronicleTitle: "Petjades que s'aturen",
        opening:
          "Cinc dies fins que s'obri la comporta. El vaixell llogat salparà sense la seva carta nocturna si ningú no adoba el robatori. La campana del capitana del port és esquerdada de dalt a baix i encara la toquen, per orgull.\n\nPetjades mullades creuen el moll i s'aturen enmig de taulons secs, com si qui caminava recordés que no havia de ser aigua.",
        quest: {
          title: "La carta abans de la cinquena marea",
          detail: "Parla amb el capitana del port, segueix les petjades o obre la caixa marcada.",
        },
        choices: [
          speak("harbormaster", "Parla amb el capitana del port"),
          speak("footprints", "Segueix les petjades mullades"),
          speak("cracked-bell", "Mira la campana esquerdada"),
          speak("open-crate", "Obre la caixa marcada amb una estrella"),
        ],
        hotspots: [
          { id: "crates", name: "Piles de caixes", x: 30, y: 44, examine: "Una caixa porta una estrella de guix. Fa tic-tac, suau, com un bullidor que es refreda." },
          { id: "ship", name: "Vaixell amarrat", x: 64, y: 34, examine: "L'Alosa. El seu contramestre no navega una costa que no pot veure de nit." },
          { id: "pier", name: "El moll", x: 46, y: 56, examine: "Petjades. Peu esquerre, peu dret, i res més. Els taulons al voltant de l'última són secs.", threat: true },
          { id: "warehouse", name: "Magatzem", x: 76, y: 58, examine: "Les cartes viuen a dalt, diu l'escrivent, tret d'aquella que no." },
          { id: "water", name: "L'aigua", x: 48, y: 76, examine: "Els fanals es dupliquen. Un reflex saluda. Ningú al moll no saluda." },
        ],
      },
      {
        id: "night-chart",
        name: "La Carta Nocturna",
        image: "/art/orrery.jpg",
        daypart: "Capvespre",
        clock: "21:40",
        weather: "Serè",
        sky: "CAPVESPRE · SERÈ",
        ambient: "Una sala de torre que fa veure que és un cel. Les cartes estan clavades sobre els estels.",
        chronicleTitle: "La costa que falta",
        opening:
          "La sala de cartes fa olor de tinta i de taronges. Algú ha tallat la costa de la carta nocturna en una mitja lluna curosa — no estripada, tallada — i ha deixat un nus de mariner al telescopi.\n\nClavada sota l'armil·lar: una nota. «El fanaler del Far de l'Estella no ha tornat. No navegueu a les fosques sense ell.»",
        quest: {
          title: "Adoba la costa",
          detail: "Troba el tros tallat, o porta la nota a la comporta i atura el vaixell.",
        },
        choices: [
          speak("search-room", "Regira la sala a la recerca de la costa tallada"),
          speak("read-note", "Llegeix la nota en veu alta"),
          speak("telescope", "Gira el telescopi cap avall, no cap amunt"),
          speak("to-gate", "Porta la nota a la comporta"),
        ],
        hotspots: [
          { id: "window", name: "Finestra alta", x: 78, y: 22, examine: "Es veu el Far de l'Estella. És fosc. No ho hauria de ser." },
          { id: "armillary", name: "Armil·lar", x: 48, y: 40, examine: "La nota pesa amb una navalla de mariner. En Holt coneix el nus.", threat: true },
          { id: "telescope", name: "Telescopi", x: 74, y: 52, examine: "Apunta a un terrat dos carrers més enllà. Un tros pàl·lid és encallat sota una teula." },
          { id: "stars", name: "Terra d'estels", x: 52, y: 66, examine: "Guix, no màgia: un mapa del moll i una X a la caixa de l'estrella." },
          { id: "desk", name: "Taula de cartes", x: 26, y: 58, examine: "Pergamí de recanvi. Una mà pacient podria tornar a dibuixar la costa." },
        ],
      },
      {
        id: "tide-gate",
        name: "La Comporta",
        image: "/art/fort.jpg",
        daypart: "Matí",
        clock: "06:50",
        weather: "Vent",
        sky: "MATÍ · VENT",
        ambient: "El mur de mar manté el port a dins. El vent assaja amb les banderes.",
        chronicleTitle: "Aguanta la porta",
        opening:
          "La comporta és un fortí que va decidir convertir-se en porta. La tripulació de l'Alosa ja enrotlla cordes. Al pati, el mariner espera amb la costa tallada de la carta doblegada dins una camisa neta, i amb notícies: l'esquif del fanaler arriba amb una vela remendada.\n\nAra ningú no ha de robar res. Algú sí que ha de dir, en veu alta, que el vaixell esperarà una marea.",
        quest: {
          title: "Una marea de paciència",
          detail: "Parla pel fanaler, adoba la carta i deixa que la porta s'obri quan el far estigui encès.",
        },
        choices: [
          speak("speak-crew", "Demana a la tripulació una marea més"),
          speak("mend-chart", "Adoba la carta al carro"),
          speak("light-signal", "Fes senyals al Far de l'Estella amb el fanal"),
          speak("close-book", "Mira com respon la llum i tanca el llibre"),
        ],
        hotspots: [
          { id: "tower", name: "Torre de la porta", x: 30, y: 46, examine: "La ranura de senyals mira al mar. El fanal del Calder hi encaixa." },
          { id: "gate", name: "La porta", x: 44, y: 64, examine: "Fusta i marques de marea. S'obre cap enfora, com surt d'una sala una persona atenta." },
          { id: "yard", name: "Pati", x: 60, y: 48, examine: "El mariner. Cansat, no dolent. Va dormir aquí per no perdre el coratge.", threat: true },
          { id: "cart", name: "Carro de cartes", x: 74, y: 36, examine: "Pergamí, cola i un pes. La costa vol quedar plana." },
          { id: "wall", name: "Mur de mar", x: 82, y: 60, examine: "Un esquif. Una vela remendada. Una llumeta, acabada d'encendre, que respon a la teva." },
        ],
      },
    ],
  },
];

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function getScene(campaignId: string, sceneId: string) {
  return getCampaign(campaignId)?.scenes.find((s) => s.id === sceneId);
}
