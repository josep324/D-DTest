import type { Campaign, Item } from "@/lib/game/types";

const ITEMS: Item[] = [
  { id: "clau", name: "Clau de la torre", detail: "Una clau petita de llautó, encara tèbia. Té una taronja pintada al ferro.", ownerId: "holt" },
  { id: "retall", name: "El retall de la costa", detail: "Una mitja lluna de pergamí tallada amb cura, embolicada en tela encerada. És la costa que falta a la carta nocturna.", ownerId: "vesper" },
];

/**
 * Dusk Harbor, played as real D&D: a cut chart, wet footprints, a ship that will not wait and a
 * lighthouse tender who never came home. Nobody is a villain; somebody is just afraid of sailing in the dark.
 * Operators: "a|b" is either flag, "a&b" is both.
 */
export const PORT: Campaign = {
  id: "port",
  kind: "module",
  name: "Port del Crepuscle",
  blurb: "El vaixell surt quan giri la marea. La carta és tallada. Les petjades són mullades. El far és fosc.",
  chapters: "Cinc llocs",
  levels: "Nivells 1–3",
  span: "Una nit",
  mission: "Recupera la costa que falta a la carta nocturna, troba el fanaler del far i aconsegueix que el vaixell esperi una marea.",
  items: ITEMS,
  canon:
    "Aventura de rol tipus D&D, to familiar, sense sang. El Port del Crepuscle té un vaixell llogat, l'Alosa, que salpa amb la marea sense la seva carta nocturna: algú n'ha tallat la costa en una mitja lluna curosa. La campana del port és esquerdada i amb el batall embolicat en tela de vela; unes petjades mullades creuen el moll i s'aturen enmig de taulons secs; una caixa marcada amb una estrella de guix conté una clau de la torre de les cartes. Qui ha amagat la carta és un mariner, en Biel, que només volia retardar el vaixell fins que el fanaler del Far de l'Estella (en Quim), que no ha tornat, arribés a port; el far és fosc. La contramestra Ona no navega a cegues. A la torre de les cartes hi ha una nota i, per un telescopi, es veu el retall amagat a un terrat. El fanaler és encallat a unes roques, amb un rem trencat i uns crancs de roca. Es resol persuadint la contramestra que esperi una marea, rescatant en Quim, reparant la carta amb el retall (i la marca del fanaler) i fent senyals al far des de la comporta.",
  scenes: [
    {
      id: "moll",
      name: "Moll de Vidre-sal",
      image: "/art/harbor.jpg",
      daypart: "Crepuscle",
      clock: "18:05",
      weather: "Bo",
      sky: "CREPUSCLE · BO",
      ambient: "Quitrà, sal i una campana amb una esquerda que se't nota a les dents.",
      chronicleTitle: "Petjades que s'aturen",
      back: "Torneu al Moll de Vidre-sal. La marea puja sense pressa però sense aturar-se.",
      opening:
        "Cinc dies de l'any només obre la comporta la marea alta. Aquesta nit n'és un, i el vaixell llogat, l'Alosa, salparà sense la seva carta nocturna si ningú no adoba el robatori. La campana de la capitana del port és esquerdada de dalt a baix i encara la toquen, per orgull.\n\nPetjades mullades creuen el moll i s'aturen enmig de taulons secs, com si qui caminava recordés que no havia de ser aigua. A l'altra banda de l'aigua, el Far de l'Estella hauria de brillar. No ho fa.\n\nConsell del DM: aquí tens moltes coses a fer i cap d'obligatòria al principi. Parla amb la capitana i amb l'escrivent, mira les petjades i la campana, obre la caixa de l'estrella. Digues «què puc fer?» si t'encalles.",
      quest: { title: "La carta abans de la marea", detail: "Parla amb la capitana i investiga les petjades, la campana i la caixa." },
      choices: [],
      hotspots: [
        {
          id: "capitana", kind: "npc", name: "La capitana del port", x: 67, y: 38, keywords: ["capitana", "marga", "port", "dona"],
          examine: "Té sal a les celles i cap paciència amb misteris que retarden marees, és a dir, una mica en té.",
          talk: [
            { keywords: ["carta", "nocturna", "tallada", "robatori", "qui", "que", "passat", "ajuda"], say: "«La carta nocturna era sencera al migdia. Al vespre, la costa era tallada i un mariner havia desaparegut. L'Alosa no navega a cegues. Teniu fins a la marea, i jo tinc una campana esquerdada i una reputació. Arregleu el problema més amable dels dos.»", flag: "capitana-parla", xp: 10 },
            { keywords: ["far", "fanaler", "estella", "llum", "fosc", "quim"], say: "«El Far de l'Estella hauria d'estar encès des del vespre. Em preocupa en Quim, el fanaler: sempre torna abans de l'últim sol. Si us hi voleu acostar, teniu l'esquif del moll.»", flag: "far-explicat", xp: 10 },
            { keywords: ["torre", "cartes", "clau", "estrella", "caixa"], say: "«La torre de les cartes és sempre tancada. La clau l'ha de tenir l'escrivent, però no la tinc a la vista. Aquella caixa de l'estrella de guix no és meva.»", flag: "torre-explicada" },
          ],
        },
        {
          id: "pau", kind: "npc", name: "Pau, l'escrivent", x: 82, y: 30, keywords: ["pau", "escrivent", "magatzem", "home"],
          examine: "Un home prim amb mànigues de tinta i una ploma a l'orella. Mira l'hora a cada instant.",
          talk: [
            { keywords: ["torre", "escala", "cartes", "clau", "pujar", "sala"], say: "«La torre de les cartes és amunt per aquella escala. Les cartes viuen allà, excepte la que no. Si busqueu la clau, jo no la tinc: algú me la va prendre, i va deixar en el seu lloc una taronja.»", flag: "torre-explicada", xp: 5 },
            { keywords: ["mariner", "biel", "desaparegut", "qui", "mosso", "marinero"], say: "«En Biel, un dels mariners de l'Alosa. Fa tres dies que no mou ni un pal. L'últim cop que el vaig veure, era a la comporta, assegut, amb una camisa neta embolicada als genolls.»", flag: "biel-sabut", xp: 10 },
            { keywords: ["vaixell", "alosa", "salpar", "marea", "temps", "hora"], say: "«Salpen amb la marea alta. La contramestra no fa tard: és la seva única superstició.»" },
          ],
        },
        {
          id: "empremtes", kind: "feature", name: "Les petjades mullades", x: 49, y: 68, keywords: ["petjades", "empremtes", "taulons", "moll", "peus", "esquerra"],
          examine: "Esquerra, dreta, i després la idea d'un peu. L'última petjada és freda i els taulons al voltant són secs.",
          check: {
            ability: "wis", dc: 10, reason: "Seguir les petjades fins al final", flag: "empremtes", xp: 15,
            alts: [{ keywords: ["estiro", "ajupo", "ajupim", "de gairell", "gairell", "tombo"], ability: "wis", dc: 9, reason: "Ajupir-se i mirar de gairell" }],
            success: "T'estires sobre els taulons i mires de gairell, que és com les escoltes fan confessar els bassals. L'aigua de la petjada apunta, molt lleugerament, cap a una caixa marcada amb una estrella de guix.",
            fail: "Només veus taulons mullats i secs. Potser amb més temps, o ajupint-te, ho veuries.",
          },
        },
        {
          id: "campana", kind: "feature", name: "La campana esquerdada", x: 62, y: 52, keywords: ["campana", "batall", "tela", "nus", "esquerda"],
          examine: "Una campana de bronze amb una esquerda llarga. Se sent quan sona i, ara, no sona.",
          check: {
            ability: "int", dc: 11, reason: "Examinar el batall embolicat", flag: "nus-vist", xp: 15,
            success: "L'esquerda és vella; el batall, nou, embolicat amb tela de vela perquè no desperti el port. Dins la tela, un nus que en Holt coneix: feina de mariner, curosa i avergonyida d'ella mateixa. Qui ho va fer no volia escàndol, volia un retard.",
            fail: "Veus tela, ferro i un esquerdill. Res que et digui res.",
          },
        },
        {
          id: "caixa", kind: "feature", name: "La caixa de l'estrella", x: 78, y: 65, keywords: ["caixa", "estrella", "guix", "caixes", "pany"],
          examine: "Una caixa de fusta amb una estrella dibuixada amb guix. Fa tic-tac, suau, com un bullidor que es refreda.",
          check: {
            ability: "dex", dc: 11, reason: "Obrir el pany de la caixa", flag: "caixa-oberta", xp: 20,
            alts: [{ keywords: ["forço", "forca", "força", "trenco", "obre", "obrir"], ability: "str", dc: 12, reason: "Forçar la tapa" }],
            success: "El pany cedeix amb un clic. Dins hi ha un abric de llana, una taronja i una clau petita de llautó. Cap carta. Sota la taronja, una nota amb lletra rodona: «Sala de nit. No navegueu a les fosques sense el Far de l'Estella.»",
            fail: "El pany és tossut. Fa un soroll que no hauria de fer, però no cedeix. Es pot provar altre cop, o d'una altra manera.",
          },
        },
        {
          id: "clau", kind: "item", name: "La clau de la torre", x: 66, y: 77, keywords: ["clau", "llauto", "llautó"], itemId: "clau", flag: "clau",
          requires: { flag: "caixa-oberta", hint: "La clau és dins la caixa de l'estrella, que està tancada." },
          examine: "Una clau petita de llautó, amb una taronja pintada al ferro.",
        },
        {
          id: "alosa", kind: "feature", name: "L'Alosa", x: 38, y: 43, keywords: ["alosa", "vaixell", "nau", "balandra", "veles"],
          examine: "Un vaixell bonic de dos pals amb les veles recollides. La tripulació enrotlla cordes: fa tard.",
        },
        {
          id: "esquif", kind: "exit", name: "L'esquif del moll", x: 9, y: 78, to: "escull", keywords: ["esquif", "barca", "remar", "rems", "far", "estella", "roques", "mar"],
          requires: { flag: "una-marea", hint: "Si surts ara, el vaixell salparà sense vosaltres. Cal que la contramestra accepti esperar una marea abans d'anar a mar." },
          examine: "Una barqueta de fusta, amb dos rems i una corda gastada. Fa olor de pega.",
          check: {
            ability: "str", dc: 11, reason: "Remar contra el corrent fins a les roques", flag: "remat", xp: 15, go: true, hurt: 1,
            success: "Ben coordinats i amb una mica d'empenta, l'esquif talla l'aigua negra. El moll es fa petit darrere vostre.",
            fail: "Una onada us pica el costat, els rems s'enreden i perds un cor. Tornareu a provar-ho.",
          },
        },
        {
          id: "torre", kind: "exit", name: "L'escala de la torre de les cartes", x: 88, y: 48, to: "torre", keywords: ["torre", "cartes", "escala", "pujar", "sala"],
          requires: { flag: "clau", hint: "La porta de la torre és tancada. Et falta una clau." },
          examine: "Una escala de pedra per sobre del magatzem, que arriba a una torre amb una finestra encesa.",
        },
        {
          id: "comporta", kind: "exit", name: "El camí de la comporta", x: 12, y: 45, to: "comporta", keywords: ["comporta", "mur", "fortí", "forti", "camí", "cami", "mar"],
          requires: { flag: "nota-llegida|nus-vist", hint: "No saps per què hi hauries d'anar. Troba abans la nota de la torre o el nus de la campana." },
          examine: "Un camí de llosetes que baixa al mur de mar, cap a la comporta.",
        },
      ],
    },
    {
      id: "torre",
      name: "La Torre de les Cartes",
      image: "/art/orrery.jpg",
      daypart: "Nit",
      clock: "21:40",
      weather: "Serè",
      sky: "NIT · SERÈ",
      ambient: "Una sala de torre que fa veure que és un cel. Les cartes estan clavades sobre els estels.",
      chronicleTitle: "La costa que falta",
      back: "Torneu a la torre. Les cartes continuen clavades sobre els estels.",
      opening:
        "La sala de cartes fa olor de tinta i de taronges. Algú ha tallat la costa de la carta nocturna en una mitja lluna curosa, no estripada, tallada, i ha deixat un nus de mariner al telescopi. Pel finestral s'albira el Far de l'Estella, i és fosc.\n\nClavada sota l'armil·lar, hi ha una nota.\n\nConsell del DM: no cal que ho resolguis tot aquí. Llegeix la nota, mira el telescopi i, si hi veus alguna cosa, decideix si vols pujar al terrat. Hi ha corbs, i alguna d'aquestes proves pot sortir malament.",
      quest: { title: "Mendra la costa", detail: "Llegeix la nota i busca el retall que falta." },
      choices: [],
      hotspots: [
        {
          id: "nota", kind: "feature", name: "La nota de sota l'armil·lar", x: 50, y: 29, keywords: ["nota", "armillar", "armil·lar", "paper", "llegir", "llegeixo"],
          examine: "Un tros de paper sota el peu de l'armil·lar, pesat amb una navalla de mariner.",
          check: {
            ability: "wis", dc: 8, reason: "Llegir la nota amb calma", flag: "nota-llegida", xp: 15,
            success: "«El fanaler del Far de l'Estella no ha tornat. No navegueu a les fosques sense ell.» Ho llegeixes dues vegades. No és una amenaça: és un avís. Qui ha tallat la carta volia retardar el vaixell per no perdre en Quim.",
            fail: "La lletra és petita i el temps, poc. Potser val la pena llegir-la dues vegades.",
          },
        },
        {
          id: "telescopi", kind: "feature", name: "El telescopi", x: 72, y: 45, keywords: ["telescopi", "lent", "mirar", "terrat", "teulada"],
          examine: "Un telescopi de llautó que apunta a un terrat dos carrers més enllà.",
          check: {
            ability: "wis", dc: 11, reason: "Mirar pel telescopi cap al terrat", flag: "retall-vist", xp: 10,
            success: "Per la lent veus un tros pàl·lid encallat sota una teula, com una llengua. Enrotllat amb tela encerada i pesat amb un clau: és el retall de la costa.",
            fail: "Només veus teules i un gat. Potser amb un altre angle.",
          },
        },
        {
          id: "trapa", kind: "feature", name: "La trapa del terrat", x: 86, y: 58, keywords: ["trapa", "terrat", "teulada", "pujar", "escala", "escalar"],
          examine: "Una trapa de fusta al sostre, amb una escala de ma. Per damunt s'hi sent el soroll de dues ales fosques.",
          requires: { flag: "retall-vist", hint: "No saps què hi ha al terrat. Primer mira pel telescopi." },
          check: {
            ability: "dex", dc: 12, reason: "Pujar al terrat i agafar el retall", flag: "terrat", xp: 25, hurt: 1, onFail: "fight",
            alts: [{ keywords: ["corda", "lligat", "assegut", "ajudo", "ajuda"], ability: "str", dc: 11, reason: "Pujar amb ajuda d'una corda" }],
            success: "Surts al terrat amb el cor a la boca. Els corbs miren de lluny i es queden quiets. Sota una teula, ben tapat amb una peça de roba, el retall: net, sec, tallat amb una mà ferma. El poses a la bossa.",
            fail: "Una teula llisca i dos corbs s'aixequen del terrat, enfadats. Un cor de menys i un parell de becs davant teu.",
          },
        },
        {
          id: "corbs", kind: "foe", name: "Els corbs de la torre", x: 70, y: 34, keywords: ["corbs", "corb", "ocells", "ales"], threat: true,
          examine: "Dos corbs grassos observen la trapa amb ulls de joiell. No són dolents; són posseïdors.",
          foe: { name: "Corb de la torre", the: "el corb de la torre", hp: 5, ac: 12, atk: 3, dmg: "1d4", xp: 10, count: 2 },
        },
        {
          id: "retall", kind: "item", name: "El retall de la costa", x: 84, y: 40, keywords: ["retall", "costa", "pergami", "pergamí", "mitja lluna"], itemId: "retall", flag: "retall",
          requires: { flag: "terrat", hint: "Encara no has tret el retall del terrat." },
          examine: "Una mitja lluna de pergamí tallada amb cura, tapada amb tela encerada.",
        },
        { id: "terra", kind: "feature", name: "El terra d'estels", x: 50, y: 62, keywords: ["terra", "estels", "guix", "mapa", "creu"], examine: "Guix, no màgia: un mapa del moll i una X dibuixada on hi ha la caixa de l'estrella." },
        { id: "taula", kind: "feature", name: "La taula de cartes", x: 24, y: 64, keywords: ["taula", "cartes", "pergamí", "pergami", "vitel", "paper"], examine: "Pergamí de recanvi. Una mà pacient podria tornar a dibuixar la costa, però no és el mateix: cal el retall autèntic." },
        { id: "finestral", kind: "feature", name: "El finestral", x: 77, y: 20, keywords: ["finestral", "far", "estella", "finestra", "vidre"], examine: "Veus el Far de l'Estella. És fosc. No hauria de ser-ho." },
        { id: "baixar", kind: "exit", name: "L'escala cap al moll", x: 10, y: 78, to: "moll", keywords: ["escala", "moll", "tornar", "baixar", "enrere"], examine: "L'escala per on heu pujat." },
      ],
    },
    {
      id: "comporta",
      name: "La Comporta",
      image: "/art/fort.jpg",
      daypart: "Nit",
      clock: "23:30",
      weather: "Vent",
      sky: "NIT · VENT",
      ambient: "El mur de mar manté el port a dins. El vent assaja amb les banderes.",
      chronicleTitle: "Aguanta la porta",
      back: "Torneu a la comporta. El vent segueix assajant amb les banderes.",
      opening:
        "La comporta és un fortí que va decidir convertir-se en porta. La tripulació de l'Alosa ja enrotlla cordes al pati. En un racó, assegut sobre una caixa, hi ha un mariner amb una camisa neta embolicada al genoll: en Biel. A la porta, amb els braços creuats, la contramestra Ona us mira arribar.\n\nNo hi ha més pressa que la que es fa un mateix.\n\nConsell del DM: aquí no hi ha cap monstre, només gent. Hi ha dues converses difícils: la d'en Biel i la de la contramestra. Pots convèncer-los, amb sinceritat o amb el que has trobat. No et cal pressa; però sí paraules.",
      quest: { title: "Una marea de paciència", detail: "Parla amb en Biel i amb la contramestra. El vaixell ha d'esperar." },
      choices: [],
      hotspots: [
        {
          id: "biel", kind: "npc", name: "Biel, el mariner", x: 46, y: 52, keywords: ["biel", "mariner", "home", "noi", "camisa"],
          examine: "Un mariner jove, amb ulls cansats. Ha dormit aquí per no perdre el coratge.",
          check: {
            ability: "cha", dc: 13, reason: "Convèncer en Biel perquè confessi", flag: "biel-confessa", xp: 30,
            alts: [{ keywords: ["nota", "nus", "fanaler", "quim", "veritat", "comprenc", "entenc"], ability: "cha", dc: 11, reason: "Parlar-li amb honestedat, amb la nota a la mà" }],
            success: "En Biel s'asseu millor i respira. «Vaig tallar la carta perquè l'Alosa havia de salpar sense en Quim. No ho podia permetre. He passat tres dies amb ganes de confessar-ho. Té raó, la contramestra.» Desplega la camisa: al seu interior, el retall.",
            fail: "En Biel mira cap a una altra banda. «No sé de què parleu.» Però se li escapa una mirada a la camisa.",
          },
          talk: [
            { keywords: ["retall", "costa", "carta", "camisa", "donar", "dona", "dono"], requires: "biel-confessa", say: "En Biel us allarga la camisa neta, i dins el retall de la costa, ben cuidat. «Per favor, que ningú no es perdi», murmura.", xp: 10 },
            { keywords: ["quim", "fanaler", "far", "estella", "tender", "per que", "perque", "per què", "qui"], say: "«En Quim és el fanaler del far. Sempre torna abans de l'últim sol. Avui no. I el vaixell salpa sense llum. M'he espantat.»", flag: "tender-perdut", xp: 10 },
          ],
        },
        {
          id: "retall-b", kind: "item", name: "El retall de la camisa", x: 52, y: 58, keywords: ["retall", "camisa", "costa"], itemId: "retall", flag: "retall",
          requires: { flag: "biel-confessa", hint: "En Biel encara no te l'ha lliurat." },
          examine: "El retall de la costa, embolicat amb cura en una camisa neta.",
        },
        {
          id: "ona", kind: "npc", name: "Ona, la contramestra", x: 62, y: 68, keywords: ["ona", "contramestra", "dona", "tripulacio", "tripulació"],
          examine: "Una dona forta, amb el cabell recollit i la mirada clara. No navega a cegues, i no té gaires dubtes.",
          requires: { flag: "nota-llegida|biel-confessa", hint: "La contramestra no t'escoltarà sense un motiu. Troba la nota de la torre o fes parlar en Biel." },
          check: {
            ability: "cha", dc: 13, reason: "Demanar-li una marea més d'espera", flag: "una-marea", xp: 40,
            alts: [{ keywords: ["nota", "retall", "carta", "biel", "quim", "fanaler", "far"], ability: "int", dc: 12, reason: "Mostrar-li la nota i raonar" }],
            success: "L'Ona mira la nota, el retall i els vostres ulls. Sospira com qui deixa anar un pes. «Una marea», diu. «Una. I que el vostre mariner aprengui que els nusos eren bons i el pla, podrit. Les dues coses poden ser certes.»",
            fail: "«No ho tinc clar», diu l'Ona, i es creua més els braços. «La carta és incompleta. I els plans dolents no es fan millors parlant.» Pots provar de nou, amb altres paraules.",
          },
          talk: [
            { keywords: ["torna", "far", "encesa", "llum", "gracies", "gràcies", "salpar", "salpem"], requires: "senyal", ends: true, xp: 70, say: "Des de la comporta es veu l'esquif del fanaler arribar amb una vela remendada. Una llum petita respon des de l'esquif, i després una de més forta des de la roca, quan en Quim aconsegueix pujar al far i encendre'l.\n\nL'Alosa espera una marea, que és un petit miracle fet de corda i bones maneres. En Biel és renyat, alimentat i tornat a la llista de guàrdies. La carta puja a bord amb la seva cicatriu i el seu marge honest.\n\nLa campana esquerdada del port sona igualment. Algú és feliç. El Port del Crepuscle conserva el seu vaixell, el seu fanaler i la seva història." },
            { keywords: ["marea", "esperar", "espera", "temps", "carta", "salpa"], say: "«La marea no espera. Jo tampoc, però avui puc fer una excepció si em doneu una raó que no sigui una excusa.»" },
          ],
        },
        {
          id: "carro", kind: "feature", name: "El carro de cartes", x: 46, y: 43, keywords: ["carro", "cartes", "carta", "pergami", "pergamí", "cola", "mendar", "reparar", "adobar"],
          examine: "Pergamí, cola i un pes. La costa vol quedar plana.",
          requires: { flag: "retall&fanaler-salvat", hint: "Encara et falta el retall de la costa i la marca del fanaler perquè la carta sigui bona." },
          check: {
            ability: "int", dc: 12, reason: "Enganxar el retall i validar la carta amb la marca del fanaler", flag: "carta-reparada", xp: 35,
            alts: [{ keywords: ["destre", "pols", "cuido", "cuidadosa", "enganxo", "enganxar"], ability: "dex", dc: 12, reason: "Enganxar el retall amb mà ferma" }],
            success: "Cola, pressió i un pes. La costa s'estira i el retall s'uneix tan bé que només qui busqués una cicatriu la trobaria. La marca d'en Quim, al marge, la fa vàlida. A sota, algú escriu: «Una marea aguantada pel Far de l'Estella».",
            fail: "El retall se't enganxa als dits i a mig camí es plega. No és irrecuperable, però cal tornar-ho a provar.",
          },
        },
        {
          id: "senyals", kind: "feature", name: "La ranura de senyals", x: 21, y: 28, keywords: ["ranura", "senyals", "fanal", "lantern", "llum", "torre", "senyalitzar"],
          examine: "La ranura de senyals mira al mar. El fanal d'en Calder hi encaixa.",
          requires: { flag: "carta-reparada", hint: "No toca encara fer senyals al far: primer cal que la carta sigui bona." },
          check: {
            ability: "dex", dc: 10, reason: "Fer senyals amb el fanal: tres llums lentes, el patró de la capitana per a «aguanteu»", flag: "senyal", xp: 20,
            success: "El fanal encaixa a la ranura com si hagués estat sol. Tres mostres lentes. Lluny, una llumeta respon, després una altra de més forta des de la roca: el far torna a respirar.",
            fail: "La llum balla massa. El patró no queda net. Reprova-ho amb la mà més ferma.",
          },
        },
        { id: "caixes", kind: "feature", name: "Caixes de l'equipatge", x: 72, y: 42, keywords: ["caixes", "equipatge", "sacs"], examine: "Caixes de la tripulació: ropa, sal, i un manxe de ferrer que ningú sap perquè porten." },
        { id: "portal", kind: "exit", name: "El camí al moll", x: 80, y: 32, to: "moll", keywords: ["moll", "port", "tornar", "camí", "cami"], examine: "El camí de llosetes que torna al moll de Vidre-sal." },
      ],
    },
    {
      id: "escull",
      name: "Les Roques de l'Estella",
      image: "/art/harbor.jpg",
      daypart: "Nit",
      clock: "00:10",
      weather: "Vent",
      sky: "NIT · VENT",
      ambient: "Mar negra, roques fosques i un far apagat que sembla una promesa trencada.",
      chronicleTitle: "L'esquif a la nit",
      back: "Torneu a les roques. El mar no s'ha calmat.",
      opening:
        "L'esquif s'acosta a les roques amb el soroll sec dels rems i l'aigua negra. Al cim d'una d'elles, un home us fa senyals amb els braços. Té un rem trencat al costat i la cama d'una manera estranya: és en Quim, el fanaler del Far de l'Estella.\n\nEntre vosaltres i ell, uns crancs de roca grossos com gossos estan a punt de decidir què pensen de vosaltres.\n\nConsell del DM: pots passar-los sense fer soroll (Destresa), distreure'ls amb menjar (Encant) o lluitar. Tria. En Quim espera.",
      quest: { title: "Rescata el fanaler", detail: "Arriba fins a en Quim i porta'l a bord." },
      choices: [],
      hotspots: [
        {
          id: "quim", kind: "npc", name: "Quim, el fanaler", x: 9, y: 27, keywords: ["quim", "fanaler", "home", "far", "encallat"],
          examine: "Un home amb la cara cremada pel vent i la cama mal posada. Té els ulls ben oberts i l'humor a prova de nit.",
          talk: [
            { keywords: ["pugeu", "pujar", "puja", "esquif", "barca", "portem", "porto", "ajudo", "ajuda", "tornem", "marxem", "a bord"], requires: "crancs-passats|dead-crancs", say: "Entre tots, aixequeu en Quim fins a l'esquif. Ell riu entre dents de dolor. «Aneu amb compte amb la marca del far: l'he guardada a la butxaca.» Us la dóna: un segell de llautó amb una estrella. «Sense això, la carta no val res.» Remeu cap al port amb el far darrere, encara apagat.", flag: "fanaler-salvat", xp: 50 },
            { keywords: ["far", "llum", "estella", "apagat", "fosc", "que", "passat", "qui", "per que", "perque"], say: "«Em vaig trencar el rem anant per una llum d'una barca que no tenia. Em va agafar la nit. El far és apagat perquè l'oli és dins, i jo, aquí fora. Pugeu-me, si podeu: tinc la marca del far a la butxaca, la que fa vàlida la carta.»", flag: "quim-parla", xp: 10 },
          ],
        },
        {
          id: "crancs", kind: "foe", name: "Els crancs de roca", x: 12, y: 58, keywords: ["crancs", "cranc", "bestioles", "roca", "pinces"], threat: true,
          examine: "Dos crancs grossos com gossos, amb pinces de color de rovell. Observen amb atenció les teves botes.",
          foe: { name: "Cranc de roca", the: "el cranc de roca", hp: 8, ac: 12, atk: 3, dmg: "1d6", xp: 20, count: 2 },
          check: {
            ability: "dex", dc: 12, reason: "Passar entre els crancs sense fer-los enfadar", flag: "crancs-passats", xp: 25, onFail: "fight",
            alts: [{ keywords: ["menjar", "distreure", "distrec", "llenço", "llenco", "ofereixo", "pa", "peix", "taronja"], ability: "cha", dc: 12, reason: "Distreure'ls amb una mica de menjar" }],
            success: "Amb passos de gat i el vent a favor, passeu per sobre les roques mullades. Els crancs aixequen les pinces, però no es mouen. Un d'ells es gira per mirar una gavina.",
            fail: "Una pedra rellisca sota el peu. Els crancs giren les pinces d'un cop i us miren amb nou interès.",
          },
        },
        { id: "far", kind: "feature", name: "El Far de l'Estella (apagat)", x: 92, y: 18, keywords: ["far", "estella", "llum", "torre"], examine: "A l'altra roca, un far de pedra amb la llanterna apagada. Seria visible des de tot el port, si estigués encès." },
        { id: "rem", kind: "feature", name: "El rem trencat", x: 18, y: 38, keywords: ["rem", "trencat", "fusta"], examine: "Un rem partit en dues parts, amb una taca de sang vella. Un nus de mariner fa de curiós empalme provisional." },
        { id: "tornar", kind: "exit", name: "L'esquif cap al moll", x: 9, y: 78, to: "moll", keywords: ["esquif", "moll", "tornar", "port", "remar", "enrere"], examine: "L'esquif us espera, amarrat entre dues roques." },
      ],
    },
  ],
};
