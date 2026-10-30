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
  {
    id: "ashpine",
    name: "El Correu de Pinassa",
    blurb: "Un missatger va desaparèixer abans que es tanqués el coll. La saca va tornar plena de sorra de riu.",
    chapters: "Tres capítols",
    levels: "Nivells 1–3",
    span: "Una nit",
    canon:
      "Pinassa és un mercat nevat sota un coll de muntanya. La saca d'un missatger es va trobar a la corda del pou, buida de cartes i plena de sorra seca de riu. El forn de carbó sota la muntanya es va encendre al migdia, però ningú no en reclama el carbó. La companyia és Calder, Bramble, Vesper i Holt. El rastre va del Mercat dels Fanals a la Sala de l'Orrery i després a la Farga de l'Auró, a l'altra banda de la muntanya. To familiar, sense sang. El misteri és un esperit de riu desplaçat que fa servir el camí del correu per enviar un avís, no un dolent que s'hagi de vèncer.",
    scenes: [
      {
        id: "lantern-market",
        name: "Mercat dels Fanals",
        image: "/art/market.jpg",
        daypart: "Matí",
        clock: "08:40",
        weather: "Neu",
        sky: "MATÍ · NEU",
        ambient: "La neu cus les parades. Els fanals resten encesos perquè el sol mai no acaba d'arribar.",
        chronicleTitle: "Sorra a la saca",
        opening:
          "La neu ha cosit el mercat, tret del pou i d'una parada de pastissos tossuda. La saca del missatger penja de la corda del pou, buida de cartes, pesant de sorra seca de riu — i el coll no és un riu.\n\nLa fornera et fa senyals amb una mà enfarinada. Sota la muntanya, diu, el forn es va encendre al migdia. Ningú a Pinassa reclamarà el carbó.",
        quest: {
          title: "La sorra de la saca",
          detail: "Pregunta a la fornera, regira el pou o segueix l'olor del carbó estrany.",
        },
        choices: [
          speak("ask-baker", "Pregunta a la fornera què va veure", "Va ser la primera al pou"),
          speak("search-satchel", "Buida la saca sobre les pedres"),
          speak("well-rope", "Baixa tant com deixi la corda"),
          speak("follow-coal", "Segueix l'olor de carbó cap a la sala"),
        ],
        hotspots: [
          { id: "road", name: "Camí del coll", x: 50, y: 18, examine: "Les petjades s'acaben on la neu es posa seriosa. Una petjada és humida, com si qui caminava hagués sortit d'un rierol." },
          { id: "pines", name: "Pineda", x: 18, y: 58, examine: "Resina, i una tira de roba vermella de missatger enganxada massa amunt per ser d'una caiguda." },
          { id: "stall", name: "Parada de pastissos", x: 32, y: 46, examine: "La fornera guardava un bol de sorra perquè «taral·lejava» quan el forn era obert." },
          { id: "well", name: "El pou", x: 48, y: 60, examine: "El poal fa olor de riba de riu. L'aigua de baix és tèbia." },
          { id: "fire", name: "Foguera", x: 66, y: 72, examine: "Els viatgers la van deixar tapada. Algú hi va afegir carbó que crema blau a les vores." },
          { id: "sacks", name: "Sacs de carbó", x: 74, y: 44, examine: "Marcats amb el segell del correu. Un sac és ple de còdols de riu ben llisos.", threat: true },
        ],
      },
      {
        id: "orrery-hall",
        name: "Sala de l'Orrery",
        image: "/art/orrery.jpg",
        daypart: "Capvespre",
        clock: "19:10",
        weather: "Calma",
        sky: "CAPVESPRE · CALMA",
        ambient: "El terra d'estels fa tic-tac. Sota el llautó, l'aigua es mou on no hauria.",
        chronicleTitle: "Sota l'armil·lar",
        opening:
          "La sala era una oficina de correus abans de ser una sala de cel. Els anells de llautó giren sense que cap mà els toqui. Les cartes estan clavades sota pesos de pedra de riu.\n\nLa perla de la Vesper s'escalfa. L'armil·lar no segueix els estels. Segueix un corrent.",
        quest: {
          title: "El corrent al llautó",
          detail: "Llegeix les cartes amb pes, o segueix el tic-tac sota el terra.",
        },
        choices: [
          speak("read-letters", "Llegeix les cartes sota les pedres"),
          speak("still-rings", "Demana a la Vesper que aturi els anells"),
          speak("star-floor", "Puja a l'incrustació d'estels"),
          speak("descend", "Segueix el so d'aigua cap avall"),
        ],
        hotspots: [
          { id: "window", name: "Finestra alta", x: 78, y: 20, examine: "Fora és de nit, però el vidre sua com si la sala fos una cova de riu." },
          { id: "armillary", name: "Armil·lar", x: 46, y: 40, examine: "Els anells s'aturen quan dius en veu alta la ruta del missatger.", threat: true },
          { id: "telescope", name: "Telescopi", x: 74, y: 50, examine: "Apunta al terra, no al cel. Per ell, les rajoles semblen un gual." },
          { id: "stars", name: "Terra d'estels", x: 52, y: 66, examine: "Una incrustació és mullada. Una llumeta de bagra la creua i desapareix." },
          { id: "desk", name: "Taula de cartes", x: 24, y: 58, examine: "Una targeta de ruta: de Pinassa a la banda dels auronets. La tinta ha corregut cap al peu de la pàgina." },
        ],
      },
      {
        id: "maple-forge",
        name: "Farga de l'Auró",
        image: "/art/forge.jpg",
        daypart: "Matí",
        clock: "07:05",
        weather: "Fum de llenya",
        sky: "MATÍ · FUM",
        ambient: "Tardor, d'alguna manera, a aquesta banda de la muntanya. La farga respira com una marea.",
        chronicleTitle: "La farga que va beure un riu",
        opening:
          "Surts sota uns auros del color de les brases. La farga del cingle està encesa, i el carbó són còdols llisos. Un rierol baixet puja pels carrils del carro cap al foc, educat com un convidat.\n\nEl missatger seu en una caixa, eixut, avergonyit, amb una campana del tamany d'un puny. «Volia que les cartes anessin cap a l'altre costat», diu. «Cap avall. Cap al mar.»",
        quest: {
          title: "Porta-ho cap avall",
          detail: "Decidiu què fa la companyia amb la campana, les cartes i el missatger cansat.",
        },
        choices: [
          speak("take-bell", "Accepta la campana i les cartes"),
          speak("ask-courier", "Demana al missatger que ho expliqui clar"),
          speak("bank-fire", "Tapa la farga perquè les pedres es refredin"),
          speak("close-book", "Acompanya el missatger a casa i tanca el capítol"),
        ],
        hotspots: [
          { id: "maples", name: "Auroneda", x: 22, y: 30, examine: "Les fulles suren riu amunt. La Bramble ho marca amb guix vermell i la ratlla també es mou." },
          { id: "forge", name: "Farga del cingle", x: 66, y: 38, examine: "Calor sense gana. Els manxes sospiren soles.", threat: true },
          { id: "rails", name: "Carrils del carro", x: 54, y: 52, examine: "Mullats fins a la tenda. Costa amunt." },
          { id: "path", name: "El camí", x: 38, y: 64, examine: "Les botes del missatger. Totes dues. Va sortir caminant pel seu propi peu." },
          { id: "camp", name: "Tenda del campament", x: 48, y: 78, examine: "Una manta, un pastís embolicat amb el drap de la fornera, i la campaneta lligada perquè no soni sense voler." },
        ],
      },
    ],
  },
  {
    id: "stillwater",
    name: "La Campana d'Aiguaquieta",
    blurb: "Un misteri de riu amb noms perduts, jurament i una campana que encara respon.",
    chapters: "Dos capítols",
    levels: "Nivells 1–3",
    span: "Fins al vespre",
    canon:
      "El Pas d'Aiguaquieta és un poble de riba de riu. La hostalera compta bols de coure quan el pas queda en silenci. Un picapedrer fregueja un rètol en blanc. Una campana és enfonsada sota un arc en ruïnes i encara sona al gual. La companyia és Calder, Bramble, Vesper i Holt. El segon lloc és l'antic fortí del peatge riu amunt, on s'ancora la cadena de la campana. El misteri es resol retornant un nom al rètol i deixant reposar la campana. Sense sang, sense morts. La figura de gris és un barquer retirat que no sap com marxar.",
    scenes: [
      {
        id: "reed-crossing",
        name: "Pas d'Aiguaquieta",
        image: "/art/crossing.jpg",
        daypart: "Posta de sol",
        clock: "17:30",
        weather: "Pluja",
        sky: "POSTA DE SOL · PLUJA",
        ambient: "Pluja sobre el riu. Els fanals s'agrupen al gual entre les pedres.",
        chronicleTitle: "Joncs a Aiguaquieta",
        opening:
          "La hostalera compta bols de coure ara que el pas ha quedat en silenci. Un bol li resta a la mà. Pel camí, el picapedrer fregueja un rètol en blanc com si un nom perdut pogués tornar sota el polze.\n\nEls reflexos dels fanals s'ajunten als clots entre les pedres. Un home amb un abric gris de mortalla és on comencen els joncs, i assenyala — no cap a tu — l'aigua.",
        quest: {
          title: "Una campana sota l'aigua",
          detail: "Parla amb l'estrany, llegeix el rètol en blanc o escolta al pont.",
        },
        choices: [
          speak("speak-grey", "Parla amb la figura de gris"),
          speak("blank-sign", "Llegeix el rètol en blanc"),
          speak("shelter", "Aixopluga't a l'hostal"),
          speak("listen-arch", "Escolta sota l'arc"),
        ],
        hotspots: [
          { id: "inn", name: "L'hostal", x: 36, y: 34, examine: "Bols en fila. La hostalera diu que el riu es va endur un nom i va deixar el deute." },
          { id: "gardens", name: "Els horts", x: 20, y: 50, examine: "Les herbes s'inclinen cap a l'aigua. Fins i tot el romaní." },
          { id: "bridge", name: "El pont", x: 56, y: 52, examine: "La clau de volta és tèbia. Si t'hi acostes, alguna cosa respon amb una nota suau." },
          { id: "arch", name: "Arc en ruïnes", x: 80, y: 28, examine: "Heura, i una cadena que entra al riu i no en torna.", threat: true },
          { id: "reeds", name: "Els joncs", x: 28, y: 74, examine: "L'abric gris és d'un barquer. Té les botes seques. Fa anys que les té seques." },
          { id: "hut", name: "Cabana rodona", x: 70, y: 76, examine: "Els cisells del picapedrer, i una dotzena de rètols de prova, tots en blanc." },
        ],
      },
      {
        id: "toll-fort",
        name: "Fortí del Peatge",
        image: "/art/fort.jpg",
        daypart: "Matí",
        clock: "09:20",
        weather: "Serè",
        sky: "MATÍ · SERÈ",
        ambient: "Riu amunt, el fortí té l'altre cap d'una cadena que ja ningú no estira.",
        chronicleTitle: "La cadena del peatge",
        opening:
          "El fortí del peatge no ha cobrat cap moneda des que va caure l'arc. Al pati, la cadena surt d'una tapa de pou i corre cap al sud, vers el poble, sota la imaginació de les llosetes.\n\nTallat a la torre rodona, a l'alçada dels ulls, hi ha un nom que va ser gravat, després omplert i gairebé oblidat: MAREN VOSS. El barquer el diu com qui recorda les seves pròpies mans.",
        quest: {
          title: "Retorna el nom",
          detail: "Porta la Maren Voss fins al rètol en blanc, o toca la cadena una vegada i deixa dormir la campana.",
        },
        choices: [
          speak("copy-name", "Copia el nom amb guix de camí"),
          speak("ask-maren", "Pregunta si el barquer és la Maren"),
          speak("ring-once", "Toca la cadena, una vegada, suaument"),
          speak("close-book", "Porta el nom a casa, al rètol"),
        ],
        hotspots: [
          { id: "tower", name: "Torre rodona", x: 30, y: 46, examine: "El gravat omplert. La pluja mai no acaba d'enganxar-se a aquestes sis lletres." },
          { id: "gate", name: "Porta oberta", x: 42, y: 64, examine: "Sense caixa de peatge. Un bol, de coure, amb una sola fulla seca a dins." },
          { id: "yard", name: "Pati", x: 60, y: 48, examine: "La cadena taral·leja si dues persones hi pugen. És un instrument, no un pany.", threat: true },
          { id: "cart", name: "Carro de provisions", x: 74, y: 34, examine: "Corda vella. En Holt diu que els nusos són de barquer." },
          { id: "wall", name: "Passeig de muralla", x: 80, y: 60, examine: "Es veu el fum del poble. El riu entremig sembla, per un moment, un camí." },
        ],
      },
    ],
  },
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
