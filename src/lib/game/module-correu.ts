import type { Campaign, Item } from "@/lib/game/types";

const ITEMS: Item[] = [
  { id: "codol", name: "Còdol amb segell", detail: "Un còdol llis de riu amb un segell de correu esquerdat. Està calent, com si hagués viatjat en una butxaca.", ownerId: "vesper" },
  { id: "campana", name: "La campana del riu", detail: "Una campaneta de la mida d'un puny. No sona sola: espera que algú l'apunti cap avall.", ownerId: "calder" },
];

/**
 * Ashpine, played as real D&D: a courier who vanished, a satchel full of river sand,
 * a hall that follows a current instead of the stars. Nobody has to die; the mystery is a request.
 */
export const CORREU: Campaign = {
  id: "correu",
  kind: "module",
  name: "El Correu de Pinassa",
  blurb: "Un missatger va desaparèixer abans que es tanqués el coll. La saca va tornar plena de sorra de riu.",
  chapters: "Tres llocs",
  levels: "Nivells 1–3",
  span: "Una nit i un matí",
  mission: "Troba el missatger desaparegut i descobreix què vol de debò el riu que s'ha perdut sota la muntanya.",
  items: ITEMS,
  canon:
    "Aventura de rol tipus D&D, to familiar, sense sang. Pinassa és un mercat nevat sota un coll de muntanya. Fa tres dies que el missatger Jan va desaparèixer; la seva saca va aparèixer penjada a la corda del pou, buida de cartes i plena de sorra seca de riu. El carbó sota la muntanya es va encendre al migdia i ningú no el reclama; els sacs van arribar sense carreter i cremen blaus. Sota el mercat hi ha una escala que porta a la Sala de l'Orrery, una antiga oficina de correus convertida en sala de cel, on el rellotger Anselm porta tres dies lluitant amb un armil·lar que segueix un corrent i no un estel; dos autòmats de llautó vigilen l'armil·lar. Un camí humit baixa fins a una farga de cingle a l'altra banda de la muntanya, on és en Jan, assegut, sec i avergonyit, amb una campaneta. Un rierol puja pels carrils del carro cap al foc: és un esperit de riu desplaçat que només vol que el seu correu baixi cap al mar. La farga és plena de pedres de riu vives que el vigilen. El misteri no és un dolent, és una petició. Es resol portant la campaneta riu avall (prometent-ho a l'esperit del riu) i acompanyant en Jan a casa.",
  scenes: [
    {
      id: "mercat",
      name: "Mercat dels Fanals",
      image: "/art/market.jpg",
      daypart: "Matí",
      clock: "08:40",
      weather: "Neu",
      sky: "MATÍ · NEU",
      ambient: "La neu cus les parades. Els fanals resten encesos perquè el sol mai no acaba d'arribar.",
      chronicleTitle: "Sorra a la saca",
      back: "Torneu al Mercat dels Fanals. La neu continua caient, mandrosa.",
      opening:
        "La neu ha cosit el mercat, tret del pou i d'una parada de pastissos tossuda. La saca del missatger penja de la corda del pou, buida de cartes, pesant de sorra seca de riu, i el coll no és un riu.\n\nLa fornera us fa senyals amb una mà enfarinada. Una mica més enllà, uns sacs de carbó, sense carreter, treuen fum blau. I al fons, entre dues cases, hi ha una escala que el mercat fa servir per recolzar pales.\n\nConsell del DM: aquest conte té un misteri. No et cal lluitar res. Parla amb la gent, mira els objectes i investiga. Quan una cosa és incerta, et demano una tirada. Si t'encalles, digues «què puc fer?».",
      quest: { title: "La sorra de la saca", detail: "Pregunta a la fornera i busca pistes: el pou, la saca i els sacs de carbó." },
      choices: [],
      hotspots: [
        {
          id: "fornera", kind: "npc", name: "La fornera", x: 32, y: 46, keywords: ["fornera", "dona", "forn", "parada"],
          examine: "Té les mans enfarinades i la veu baixa, que és innecessari: el mercat ja escolta.",
          talk: [
            { keywords: ["escala", "orrery", "sala", "baix", "sota", "pales"], say: "«Al fons, entre aquelles dues cases, hi ha una escala. La fem servir per tenir pales i no hi baixa ningú. Però des de fa dos dies fa olor de carbó i s'hi sent un tic-tac. Si busqueu el missatger, jo hi baixaria.»", flag: "escala-coneguda", xp: 10 },
            { keywords: ["carbo", "carbó", "forn", "migdia", "foc", "sacs", "blau"], say: "«El forn de sota la muntanya es va encendre al migdia i ningú el reclama. Els sacs van arribar sense carreter i criden blau a les vores quan els poses a la foguera. No hi deixo ni un nen a prop.»", flag: "carbo-explicat", xp: 5 },
            { keywords: ["pou", "aigua", "calenta", "tebia", "tèbia", "corda"], say: "«L'aigua del pou és tèbia, no hauria de ser-ho. I el poal fa olor de riba. El missatger no hi va caure, juraria: la saca penjava de la corda com un abric.»", flag: "pou-explicat" },
            { keywords: ["missatger", "jan", "desaparegut", "saca", "sorra", "qui", "que", "passat", "pas"], say: "«En Jan va sortir fa tres dies cap al coll, amb el correu de tot el poble. Va aparèixer només la saca, penjada del pou, buida de cartes i plena de sorra seca de riu. I el coll no és un riu. Busqueu-lo, si us plau: és un bon noi.»", flag: "fornera-parla", xp: 10 },
          ],
        },
        {
          id: "saca", kind: "feature", name: "La saca del missatger", x: 46, y: 52, keywords: ["saca", "bossa", "sorra", "costura", "corda"],
          examine: "Una saca de cuir de missatger, penjada de la corda del pou. Pesa com una pedra: és plena de sorra.",
          check: {
            ability: "wis", dc: 10, reason: "Buscar entre la sorra i les costures", flag: "targeta", xp: 15,
            alts: [{ keywords: ["buido", "buida", "tombo", "buido la", "buidem", "escampo"], ability: "dex", dc: 9, reason: "Buidar la saca sobre les pedres" }],
            success: "A la costura hi ha una carta que ha sobreviscut amagada. És una targeta de ruta: «Pinassa, sota la sala, sortida a l'auroneda». La tinta ha corregut cap amunt per la pàgina. Al peu, amb una lletra que no és d'en Jan: «porteu la campana cap a l'altre costat».",
            fail: "Només hi ha sorra, una engruna de pastís i el cuir fred. Potser ho pots provar un altre cop, o d'una altra manera.",
          },
        },
        {
          id: "pou", kind: "feature", name: "El pou", x: 48, y: 60, keywords: ["pou", "poal", "aigua", "pedres", "baixar"],
          examine: "Una vora de pedra, una corda i un fil d'aigua tèbia que puja de baix. No olora a pedra: olora a riba de riu.",
          check: {
            ability: "str", dc: 11, reason: "Baixar pel pou amb la corda", flag: "pou-llegit", xp: 25, hurt: 1,
            success: "Deu passes avall, l'aire es torna amable. L'aigua és tèbia i clara i plena de còdols corrents, però arranjats com una frase. Els llegeixes des de dalt: no és una trampa, és una petició. El riu de sota la muntanya vol que el seu correu es lliuri cap al mar, i va agafar un missatger prestat per dir-ho.",
            fail: "La corda et crema les mans i el poal et pica el braç. Perds el pas i has de pujar a mitges. Es pot provar de nou, amb més cura.",
          },
        },
        {
          id: "sacs", kind: "feature", name: "Els sacs de carbó", x: 70, y: 52, keywords: ["sacs", "sac", "carbo", "carbó", "fum", "blau", "pedres"],
          examine: "Tres sacs amb el segell del correu, sense carreter. Fan un fum blau a les vores, com un carbó que no vol cremar.",
          check: {
            ability: "dex", dc: 10, reason: "Obrir un sac amb cura", flag: "sacs-oberts", xp: 10,
            success: "El sac pesa més que el carbó i fa menys soroll. Dins hi ha còdols de riu, tots marcats amb un segell de correu minúscul. Quan en tries un, la foguera s'hi inclina. Res no ataca: són cartes perdudes, esperant que algú les escalfi.",
            fail: "El sac se't escapa de les mans i el carbó roda sobre la neu. No passa res, però fa un soroll que atrau mirades.",
          },
        },
        {
          id: "codol", kind: "item", name: "Un còdol de riu amb segell", x: 66, y: 60, keywords: ["codol", "còdol", "pedra", "segell"], itemId: "codol", flag: "codol",
          requires: { flag: "sacs-oberts", hint: "Primer caldria obrir un dels sacs." },
          examine: "Un còdol llis, calent al tacte, amb un segell de correu esquerdat.",
        },
        { id: "foguera", kind: "feature", name: "La foguera", x: 54, y: 66, keywords: ["foguera", "foc", "flames", "brases"], examine: "Una foguera que els viatgers van deixar tapada. Algú hi ha afegit carbó que crema blau a les vores i s'estira cap als sacs, com un gat." },
        { id: "tauler", kind: "feature", name: "Tauler d'avisos", x: 66, y: 34, keywords: ["tauler", "cartell", "avisos", "paper"], examine: "Un cartell de gos perdut, el preu del gra i un avís escrit a mà: «Qui vegi el missatger Jan, que avisi la fornera». Algú l'ha subratllat dues vegades." },
        {
          id: "escala", kind: "exit", name: "L'escala del carbó", x: 84, y: 34, to: "orrery", keywords: ["escala", "orrery"],
          requires: { flag: "escala-coneguda|targeta|pou-llegit|sacs-oberts", hint: "No saps per on tirar. Parla amb la fornera o investiga el pou, la saca o els sacs." },
          examine: "Una escala de pedra que baixa entre dues cases. Per sota fa tic-tac.",
        },
      ],
    },
    {
      id: "orrery",
      name: "Sala de l'Orrery",
      image: "/art/orrery.jpg",
      daypart: "Capvespre",
      clock: "19:10",
      weather: "Calma",
      sky: "CAPVESPRE · CALMA",
      ambient: "El terra d'estels fa tic-tac. Sota el llautó, l'aigua es mou on no hauria.",
      chronicleTitle: "Sota l'armil·lar",
      back: "Torneu a la Sala de l'Orrery. El tic-tac us rep com un vell conegut.",
      opening:
        "La sala era una oficina de correus abans de ser una sala de cel. Els anells de llautó d'un armil·lar gegant giren sense que cap mà els toqui, i al terra una incrustació d'estels blaus brilla amb la lentitud d'una marea. Dos autòmats de llautó vigilen l'armil·lar amb els braços creuats. Un home amb davantal i ulleres rellisca per darrere dels anells amb una clau a la mà.\n\nLa perla de la Vesper s'escalfa. L'armil·lar no segueix els estels: segueix un corrent.\n\nConsell del DM: aquí hi ha un obstacle de veritat, els anells. Hi ha tres maneres de resoldre'l: presentar-s'hi amb educació (Encant), esbrinar com funcionen (Intel·lecte) o atacar els guardians. Parla amb en Anselm per saber què conviu.",
      quest: { title: "El corrent al llautó", detail: "Aturar els anells i seguir el corrent que sent la sala." },
      choices: [],
      hotspots: [
        {
          id: "anselm", kind: "npc", name: "Anselm, el rellotger", x: 22, y: 46, keywords: ["anselm", "rellotger", "home", "ulleres", "davantal"],
          examine: "Un home petit, amb ulleres gruixudes i dits tacats d'oli. Porta tres dies sense dormir, i això es nota més a les mans que a la cara.",
          talk: [
            { keywords: ["anells", "aturar", "aturo", "armillar", "armil·lar", "parar", "presentar", "presento"], say: "«Els anells no es manen: s'hi parla. Cal presentar-s'hi, dir qui sou i què busqueu, amb veu clara i sense pressa. Els autòmats són bons, però de molt mal geni si les coses s'enreden.»", flag: "anells-coneguts", xp: 10 },
            { keywords: ["cartes", "pedres", "pesos", "carta", "sobres"], say: "«Les pedres que pesen les cartes no són panys. Són bones maneres. Qui obri una carta ha de desfer-ho amb la mateixa cura.»", flag: "cartes-explicades" },
            { keywords: ["riu", "corrent", "aigua", "terra", "estels"], say: "«Sota el terra hi ha aigua que no hauria de ser aquí. L'armil·lar la segueix. Si pareu els anells, la incrustació d'estels us mostrarà per on va. Jo no m'hi atreveixo: no sé nedar.»", flag: "corrent-explicat", xp: 5 },
            { keywords: ["qui", "ets", "que", "fas", "sala", "anselm", "aquí"], say: "«Sóc el rellotger de la sala. Vaig venir a posar a punt l'armil·lar i fa tres dies que no segueix cap estel. I això, entre els de la meva professió, és una vergonya.»", flag: "anselm-parla", xp: 5 },
          ],
        },
        {
          id: "cartes", kind: "feature", name: "La taula de cartes", x: 24, y: 64, keywords: ["cartes", "carta", "taula", "pedres", "pesos", "sobres", "llegir"],
          examine: "Una filera de cartes velles, cada una amb un còdol de riu al damunt perquè el vent no se les endugui.",
          check: {
            ability: "int", dc: 11, reason: "Llegir les cartes amb cura i desfer els pesos", flag: "cartes-llegides", xp: 15,
            success: "Les cartes són corrents i insuportables, com ho són les coses corrents: un aniversari, un deute perdonat, una recepta de pastís que pot viatjar. Una, escrita amb una mà humida, diu només: «porteu-ho avall». Cada còdol és una bona manera.",
            fail: "Els còdols rellisquen i les cartes es barregen. No en treus res, però les tornes a posar tal com eren.",
          },
        },
        {
          id: "armillar", kind: "feature", name: "L'armil·lar", x: 50, y: 29, keywords: ["armillar", "armil·lar", "anells", "llautó", "llauto", "esfera", "rings"],
          examine: "Una esfera de llautó amb anells que giren en tres direccions. Dins, una esfera blava batega al ritme d'un corrent.",
          check: {
            ability: "cha", dc: 11, reason: "Presentar-se als anells amb educació", flag: "anells-aturats", xp: 30, onFail: "fight",
            alts: [
              { keywords: ["entenc", "mecanisme", "engranatge", "estudio", "esbrino", "calculo", "rellotge"], ability: "int", dc: 12, reason: "Entendre i frenar el mecanisme" },
            ],
            success: "Dius qui sou i què busqueu, sense pressa. Els anells dubten i alenteixen, avergonyits. Un buit s'obre al mig i la incrustació d'estels es torna humida, com una finestra sobre un riu. «Moltes gràcies», murmura en Anselm.",
            fail: "Els anells s'acceleren i fan un soroll de ferros. Els dos autòmats descreuen els braços.",
          },
        },
        {
          id: "automats", kind: "foe", name: "Autòmats de llautó", x: 42, y: 42, keywords: ["automats", "automat", "autòmats", "autòmat", "guardians", "llautó"], threat: true,
          examine: "Dues figures de llautó, amb els braços creuats. Els seus ulls són dos vidres blaus que us segueixen sense pressa.",
          foe: { name: "Autòmat de llautó", the: "l'autòmat de llautó", hp: 9, ac: 13, atk: 3, dmg: "1d6", xp: 20, count: 2 },
        },
        {
          id: "telescopi", kind: "feature", name: "El telescopi", x: 72, y: 45, keywords: ["telescopi", "mirar", "canonada", "ullera"],
          examine: "Un telescopi de llautó que apunta al terra, no al cel.",
          check: {
            ability: "wis", dc: 11, reason: "Mirar pel telescopi cap al terra", flag: "telescopi", xp: 10,
            success: "Per la lent, les rajoles del terra semblen un gual poc profund. I, més enllà, un camí sota l'aigua que puja cap a un fum d'auró.",
            fail: "Només hi veus rajoles i un reflex del teu propi ull. Potser en un altre moment.",
          },
        },
        { id: "finestra", kind: "feature", name: "El finestral", x: 77, y: 20, keywords: ["finestral", "vidriera", "finestra", "vidre"], examine: "Fora és de nit, però el vidre sua com si la sala fos una cova de riu." },
        {
          id: "estels", kind: "exit", name: "La incrustació d'estels", x: 50, y: 64, to: "farga", keywords: ["estels", "incrustacio", "incrustació"],
          requires: { flag: "anells-aturats|dead-automats", hint: "La incrustació és plana i seca: primer cal aturar els anells." },
          examine: "Un camí d'estels blaus sota una lleugera capa d'aigua, que baixa en una escala mullada.",
        },
        { id: "tornar", kind: "exit", name: "L'escala cap al mercat", x: 86, y: 80, to: "mercat", keywords: ["escala", "mercat", "tornar", "pujar", "enrere"], examine: "Els graons de pedra pugen fins al mercat de la neu." },
      ],
    },
    {
      id: "farga",
      name: "Farga de l'Auró",
      image: "/art/forge.jpg",
      daypart: "Matí",
      clock: "07:05",
      weather: "Fum de llenya",
      sky: "MATÍ · FUM",
      ambient: "Tardor, d'alguna manera, a aquesta banda de la muntanya. La farga respira com una marea.",
      chronicleTitle: "La farga que va beure un riu",
      back: "Torneu a la Farga de l'Auró. El rierol segueix pujant pels carrils, educat com un convidat.",
      opening:
        "L'escala mullada us deixa sota uns auros del color de les brases. La farga del cingle és encesa, i el que hi crema són còdols llisos. Un rierol baixet puja pels carrils del carro cap al foc, sense pressa i amb cortesia. Al costat d'una tenda, assegut sobre una caixa, hi ha un home sec, avergonyit, amb una campaneta a l'abast: en Jan, el missatger.\n\nLes pedres de la farga es mouen una mica, quan ningú no les mira.\n\nConsell del DM: aquí hi ha tres converses importants: amb en Jan, amb el rierol i la farga. No tothom vol lluitar. Parla amb el rierol quan tinguis la campana.",
      quest: { title: "Porta-ho cap avall", detail: "Parla amb en Jan i amb el rierol. La campana ha d'anar cap al mar." },
      choices: [],
      hotspots: [
        {
          id: "jan", kind: "npc", name: "Jan, el missatger", x: 26, y: 70, keywords: ["jan", "missatger", "home", "noi", "caixa"],
          examine: "Un noi de poc més de vint anys, amb els cabells enganxats i les botes seques. Mira la campaneta com qui mira una promesa.",
          talk: [
            { keywords: ["torna", "casa", "acompanyo", "acompanyem", "tornem", "portem", "marxem"], requires: "promesa", ends: true, xp: 70, say: "Acompanyeu en Jan fins a la neu, que us rep sense fer cap comentari. La fornera plora a la manera eficient de qui té pastissos al forn i una persona que ha tornat.\n\nLa campana va embolicada: baixarà cap al mar quan el riu pugui. Al rierol de la farga, mentrestant, l'aigua es posa a córrer en el sentit correcte. Una fulla d'auró hi flota la direcció bona.\n\nEl misteri de Pinassa és un capítol que podeu tancar." },
            { keywords: ["campana", "campaneta", "porto", "agafo", "quina", "riu", "veu"], say: "«La campana és seva, no meva. Una veu al pou em va demanar un favor: portar-la cap avall, cap a un riu que ha oblidat un nom. Ho vaig intentar. Vaig prendre-la i vaig pujar, perquè la farga era a prop, i el camí cap amunt era més curt. El riu no podia pujar amb mi.» Dubta. «Preneu-la, si la porteu avall.»", flag: "jan-confia", xp: 10 },
            { keywords: ["sorra", "saca", "pastis", "pastís", "qui", "ets", "que", "passat", "per que", "perque"], say: "«Sóc en Jan. Em va agafar el pànic i vaig omplir la saca amb el primer sec que vaig trobar: sorra. Vaig deixar el correu a la farga i vaig seure a esperar que algú vingués. Em sap greu l'olor de pastís.»", flag: "jan-parla", xp: 10 },
          ],
        },
        {
          id: "campana", kind: "item", name: "La campana del riu", x: 30, y: 74, keywords: ["campana", "campaneta", "bronze"], itemId: "campana", flag: "campana",
          requires: { flag: "jan-confia", hint: "En Jan no la deixa anar: encara no confia en vosaltres." },
          examine: "Una campaneta de bronze, de la mida d'un puny, embolicada en un drap perquè no soni per accident.",
        },
        {
          id: "rierol", kind: "npc", name: "El rierol que puja", x: 52, y: 56, keywords: ["rierol", "riu", "aigua", "voz", "veu", "corrent", "carrils"],
          examine: "Un fil d'aigua clara que puja pels carrils com si fos el més natural del món. Quan us acosteu, l'aigua fa una onadeta cap a vosaltres.",
          talk: [
            { keywords: ["promet", "prometo", "porto", "portem", "mar", "avall", "campana", "baixar"], requires: "campana", say: "«Porteu-la. Fins a l'aigua gran, on cap carta no s'ha de tornar a pujar. I que el foc es refredi: les pedres no són d'aquí.» El rierol us toca els peus amb una carícia freda. Darrere vostre, els còdols de la farga es desperten, miren al voltant, i tornen a ser pedres.", flag: "promesa,foc-calmat,dead-pedres", xp: 50 },
            { keywords: ["codol", "còdol", "segell", "pedra", "correu", "cartes"], requires: "codol", say: "El rierol agafa el còdol amb una onada i el fa girar a l'aigua. Es posa tebi. «Això és el meu correu. Cada carta és una veu. Em vau portar un tros de casa.»", flag: "riu-confia", xp: 20 },
            { keywords: ["qui", "ets", "que", "voleu", "vols", "nom", "per que", "perque", "riu"], say: "«Em vaig quedar sense nom quan van tancar el pas. Porto cartes al mar des de fa mil anys: el correu ha de baixar, no pujar. Un missatger de les terres altes em va fer de veu. No volia espantar ningú.»", flag: "riu-parla", xp: 15 },
          ],
        },
        {
          id: "pedres", kind: "foe", name: "Les pedres de la farga", x: 64, y: 26, keywords: ["pedres", "pedra", "farga", "foc", "carbo", "carbó", "cingle", "foc"], threat: true,
          examine: "Les pedres que cremen a la farga són llises com a còdols de riu, i es belluguen una mica quan no les mireu. Estan calentes.",
          foe: { name: "Còdol viu", the: "el còdol viu", hp: 10, ac: 12, atk: 3, dmg: "1d6", xp: 20, count: 2 },
          check: {
            ability: "str", dc: 13, reason: "Tapar la farga amb la pala", flag: "foc-calmat", xp: 25, onFail: "fight",
            alts: [{ keywords: ["parlo", "demano", "calmo", "convenço", "rierol"], ability: "cha", dc: 14, reason: "Demanar-los que es refredin" }],
            success: "Amb el pla de la pala i tota la seva força, tapes la farga. Les pedres es queden quietes i es refreden poc a poc. El rierol deixa de pujar i es posa a ser un rierol.",
            fail: "La pala rebota en una pedra, que se t'obre a l'esquena. Les pedres s'incorporen amb un cruixit.",
          },
        },
        { id: "carrils", kind: "feature", name: "Els carrils del carro", x: 56, y: 52, keywords: ["carrils", "carro", "rails", "vagons"], examine: "Carrils mullats de dalt a baix. L'aigua puja: ho fa, com un fil, a favor de la costa." },
        { id: "foguera", kind: "feature", name: "Foguera del campament", x: 28, y: 78, keywords: ["foguera", "foc", "campament", "tenda"], examine: "Una foguera petita i un parell de pastissos embolicats amb el drap de la fornera: en Jan s'ha menjat un, de pànic." },
        { id: "amunt", kind: "exit", name: "L'escala humida cap amunt", x: 88, y: 62, to: "orrery", keywords: ["escala", "orrery", "tornar", "pujar", "enrere"], examine: "L'escala mullada per on heu vingut, que torna a la sala del cel." },
      ],
    },
  ],
};
