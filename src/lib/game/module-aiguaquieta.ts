import type { Campaign, Item } from "@/lib/game/types";

const ITEMS: Item[] = [
  { id: "llibre", name: "Llibre de passatges", detail: "El registre de la barca: noms, dates i monedes. L'última pàgina és arrencada.", ownerId: "vesper" },
  { id: "moneda", name: "Moneda de coure", detail: "Una moneda antiga del peatge, gastada per milers de mans.", ownerId: "holt" },
];

/**
 * Stillwater, played as real D&D: a village, a sunk bell, a ferryman who lost his name.
 * Clues can be found in several places and the toll gate has three honest answers (pay, recite, fight).
 */
export const AIGUAQUIETA: Campaign = {
  id: "campana",
  kind: "module",
  name: "La Campana d'Aiguaquieta",
  blurb: "Cada nit una campana submergida crida un nom equivocat. Un barquer no recorda el seu. Un rètol és en blanc.",
  chapters: "Quatre llocs",
  levels: "Nivells 1–3",
  span: "Una nit i un matí",
  mission: "Descobreix de qui és el nom que falta, torna'l al rètol i deixa descansar la campana.",
  items: ITEMS,
  canon:
    "Aventura de rol tipus D&D, to familiar, sense sang. Aiguaquieta és un poble de riba de riu. Cada nit sona sota l'arc en ruïnes una campana enfonsada que crida un nom equivocat, i els bols de coure de l'hostal caminen cap a la vora de la taula. La hostalera Odília diu que el riu es va endur un nom i va deixar el deute. El picapedrer Teodor va omplir el nom d'un rètol perquè la campana el cridava de nit, i ara té por de les paraules. Un home de gris, el barquer Maren Voss, és sempre als joncs: porta les botes seques des de fa anys i no sap com mullar-se; ha oblidat el seu propi nom. La cadena de la campana va riu amunt, per un camí de sirga, fins al fortí del peatge, on dues armadures buides guarden la porta i demanen «un nom o una moneda». A la torre del fortí hi ha el nom gravat: MAREN VOSS. Es resol portant el nom al picapedrer perquè el torni a gravar al rètol. Hi ha tres maneres de passar les armadures (pagar amb una moneda, dir la fórmula del llibre, o lluitar).",
  scenes: [
    {
      id: "pas",
      name: "Pas d'Aiguaquieta",
      image: "/art/crossing.jpg",
      daypart: "Posta de sol",
      clock: "17:30",
      weather: "Pluja",
      sky: "POSTA DE SOL · PLUJA",
      ambient: "Pluja suau sobre el riu. Els fanals s'encenen un a un entre les cases.",
      chronicleTitle: "Joncs a Aiguaquieta",
      back: "Tornes al Pas d'Aiguaquieta. La pluja no ha parat i el poble us espera.",
      opening:
        "Arribeu a Aiguaquieta amb la pluja de l'hora baixa. El poble és bonic, però té un aire d'estar escoltant alguna cosa. A la porta de l'hostal, una dona recompta bols de coure; al rètol de la plaça, un picapedrer fa passar el polze per una pedra completament en blanc. I als joncs, a la riba, hi ha un home amb abric gris que mira l'aigua sense atrevir-s'hi.\n\nA l'arc en ruïnes, riu amunt, quelcom ha fet una nota greu i curta. Ningú no s'ha girat: aquí tothom la sent cada nit.\n\nConsell del DM: aquí no hi ha botons. Parla amb la gent, mira el que et crida l'atenció i decideix on anar. Si t'encalles, digues «què puc fer?».",
      quest: { title: "Una campana sota l'aigua", detail: "Parla amb el poble: l'hostalera, el picapedrer i l'home de gris." },
      choices: [],
      hotspots: [
        {
          id: "odilia", kind: "npc", name: "Odília, l'hostalera", x: 77, y: 20, keywords: ["odilia", "hostalera", "dona", "hostal", "bols"],
          examine: "Una dona forta, amb un davantal vell i un bol de coure sempre a la mà. Recompta les peces cada cop que passes.",
          talk: [
            { keywords: ["bol", "bols", "deute", "nom", "riu", "campana"], say: "«Cada nit, quan sona la campana, els bols caminen fins a la vora de la taula i s'aturen allà, com si volguessin saltar. El riu es va endur un nom i va deixar el deute. No estem encantats, estem inacabats.»", flag: "odilia-parla", xp: 10 },
            { keywords: ["barquer", "maren", "gris", "home", "qui"], say: "«L'home dels joncs? Va arribar fa anys. Té les botes seques i mai no s'hi acosta ningú. Crec que va ser barquer, abans del peatge. Tinc el llibre de passatges, si en voleu veure la lletra.»", flag: "llibre-disponible" },
            { keywords: ["llibre", "registre", "passatges", "lletra", "veure"], requires: "odilia-parla", say: "«El tinc sota el taulell. Agafeu-lo, però porteu-lo de tornada.» Es posa a comptar bols per no mirar-vos.", flag: "llibre-disponible", xp: 5 },
            { keywords: ["peatge", "fortí", "fort", "armadura", "moneda", "pagar", "pago"], say: "«Al fortí del peatge hi ha armadures buides que demanen un nom o una moneda. Jo no hi aniria, però si ho feu, agafeu un dels meus bols: tinc monedes velles enganxades al fons de la taula.»", flag: "moneda-disponible" },
          ],
        },
        {
          id: "bols", kind: "item", name: "Els bols de coure", x: 65, y: 32, keywords: ["bol", "bols", "coure", "moneda", "taula"], itemId: "moneda", flag: "moneda",
          requires: { flag: "odilia-parla", hint: "Odília no et deixa tocar els bols. Potser si en parlessis amb ella." },
          examine: "Una filera de bols de coure, tots mirant cap a la vora de la taula. Al fons d'un d'ells hi ha una moneda vella enganxada.",
        },
        {
          id: "llibre", kind: "item", name: "El llibre de passatges", x: 85, y: 33, keywords: ["llibre", "registre", "passatges", "taulell"], itemId: "llibre", flag: "llibre",
          requires: { flag: "llibre-disponible", hint: "El llibre és darrere del taulell d'Odília. Demana-li." },
          examine: "Un llibre gruixut amb la tapa de cuir roent. Hi ha una pàgina arrencada.",
        },
        {
          id: "teodor", kind: "npc", name: "Teodor, el picapedrer", x: 87, y: 72, keywords: ["teodor", "picapedrer", "home", "cisell"],
          examine: "Un home alt, amb les mans plenes de pols i els ulls cansats. Té un cisell a la mà dreta i no se'n separa.",
          talk: [
            { keywords: ["maren", "voss", "nom", "ajuda", "gravar", "escriure", "cisell", "torna", "retol", "rètol", "posar"], requires: "nom-trobat", say: "En Teodor es queda quiet. «Maren Voss. Dues paraules. Dues. Sempre que ho vaig sentir, era això.» Alça el cisell, el mira, i el torna a baixar. «Aniré al rètol. Que ho vegi el poble. M'ha d'ajudar algú perquè no tremolin les mans.»", flag: "picapedrer-ajuda", xp: 40 },
            { keywords: ["retol", "rètol", "nom", "buit", "blanc", "que", "passat"], say: "«Era un nom amb una V. Dues síl·labes. El vaig omplir perquè la campana el cridava de nit i els bols s'acostaven a la vora. Ara en tinc un de buit i no sé quin era. Em fa por una paraula.»", flag: "teodor-parla", xp: 10 },
            { keywords: ["por", "pors", "campana", "arc", "nit"], say: "«La campana crida a les nits. Fa un so com si volgués una resposta. Jo no sé donar-la.»" },
          ],
        },
        {
          id: "maren", kind: "npc", name: "L'home de gris", x: 20, y: 80, keywords: ["maren", "gris", "home", "barquer", "joncs"],
          examine: "Un home d'edat difícil de dir, amb un abric de barquer gris i unes botes que no s'han mullat mai. Mira l'aigua com qui mira una porta tancada.",
          talk: [
            { keywords: ["maren", "voss", "nom", "recordes", "sap", "tu"], requires: "picapedrer-ajuda", ends: true, xp: 60, say: "Al rètol de la plaça, el cisell de Teodor mossega la pedra. Cada lletra cau com una gota: M, A, R, E, N. V, O, S, S.\n\nL'home de gris mira com es va omplint el rètol. Quan l'últim traç és fet, respira fort, com qui ha aguantat massa temps l'alè. Fa un pas a la pluja, i un altre, i es mulla. Riu, sorprès, i llavors plora.\n\nSota l'arc, la campana sona una vegada, suau, i ja no torna a cridar. Aquella nit, els bols de l'hostal es queden quiets sobre la taula. Aiguaquieta dorm sencera per primera vegada en anys." },
            { keywords: ["maren", "voss", "nom"], requires: "nom-trobat", say: "«Maren.» Ho diu amb una veu que no és seva. «Voss. Sí. Era una veu que ho deia. M'ho diran quan torni, oi? Digueu-ho al picapedrer, que ho posi al rètol i me'l faci veure.»", flag: "maren-recorda", xp: 20 },
            { keywords: ["campana", "arc", "nit", "per que", "perque"], say: "«La vaig posar jo sota l'arc perquè deixés de cridar-me pel nom equivocat. En va guardar un. M'agradaria recuperar-lo, però no puc entrar a l'aigua. He oblidat com es mulla un.»", flag: "maren-parla", xp: 10 },
            { keywords: ["qui", "ets", "barquer", "que", "fas", "home"], say: "«Un barquer, segurament. Em van dir que ho era. Però no recordo el meu nom, ni la meva barca, ni l'última travessia.»" },
          ],
        },
        {
          id: "pont", kind: "feature", name: "El pont", x: 50, y: 56, keywords: ["pont", "pedra", "clau", "volta"],
          examine: "Un pont de pedra vella amb quatre fanals. Si t'hi acostes, la clau de volta és tèbia.",
          check: {
            ability: "wis", dc: 10, reason: "Escoltar el que respon la pedra", flag: "nota-pont", xp: 10,
            success: "Estàs una estona amb l'orella a la pedra. De sota, un so fi i llarg. No és un avís: és com una veu que diu «aquí». I ve de més amunt del riu, no del poble.",
            fail: "Només sents l'aigua passar. Potser ho pots provar altre cop, o escoltar des d'un altre lloc.",
          },
        },
        {
          id: "retol", kind: "feature", name: "El rètol en blanc", x: 60, y: 40, keywords: ["retol", "rètol", "cartell", "pedra", "blanc"],
          examine: "Una gran llosa quadrada, polida, sense ni una lletra. Els costats encara tenen marques de cisell: algú hi va escriure un nom i després el va omplir de morter.",
        },
        {
          id: "horts", kind: "feature", name: "Els horts", x: 78, y: 50, keywords: ["horts", "herbes", "romani", "romaní", "plantes"],
          examine: "Fileres d'herbes i enciams. Tot s'inclina cap a l'aigua, fins i tot el romaní.",
        },
        {
          id: "cap-arc", kind: "exit", name: "L'arc en ruïnes", x: 22, y: 30, to: "arc", keywords: ["arc", "ruina", "ruïnes", "campana", "riu"],
          examine: "Un arc de pedra amb heura, ajupit sobre el riu. Una cadena hi entra a l'aigua i no en torna.",
        },
      ],
    },
    {
      id: "arc",
      name: "Sota l'arc",
      image: "/art/crossing.jpg",
      daypart: "Nit",
      clock: "22:10",
      weather: "Boira baixa",
      sky: "NIT · BOIRA",
      ambient: "L'aigua és negra i quieta. Una nota greu surt de sota la superfície i es perd.",
      chronicleTitle: "La campana sota l'arc",
      back: "Torneu a l'arc. L'aigua us espera, quieta i fosca.",
      opening:
        "Quan arribeu a l'arc, la nit ha caigut i la boira surt del riu com un alè. La cadena baixa en línia recta fins a l'aigua. Més avall, en la foscor, brillen unes llumetes petites que pugen i baixen sense motiu: els fanalets del riu.\n\nI llavors la campana sona. Una vegada, greu i neta, com algú que crida un nom des del fons d'un pou.\n\nConsell del DM: aquí pots provar dues coses diferents. Escoltar i mirar (Saviesa) o entrar a l'aigua a buscar la campana (Constitució). Si falles, els fanalets et poden atacar.",
      quest: { title: "Escolta la campana", detail: "Troba què diu i per on va la cadena." },
      choices: [],
      hotspots: [
        {
          id: "joncs", kind: "feature", name: "Els joncs", x: 18, y: 82, keywords: ["joncs", "riba", "escoltar", "boira"],
          examine: "Els joncs es mouen sense vent. Si et quedes quiet, sents que la campana sona un moment després del que toca.",
          check: {
            ability: "wis", dc: 10, reason: "Escoltar la campana entre els joncs", flag: "escoltat", xp: 15,
            success: "Esperes a la propera nota. Quan arriba, la sents amb claredat: no crida el teu nom, ni cap d'aquí. Crida una cosa de dues síl·labes, amb una V al davant. I la cadena estira, ben suau, riu amunt.",
            fail: "La boira se't menja el so. Potser amb una altra orella, o en un altre moment.",
          },
        },
        {
          id: "cadena", kind: "feature", name: "La cadena", x: 32, y: 44, keywords: ["cadena", "ferro", "anelles"],
          examine: "Una cadena gruixuda amb anelles del gruix d'un puny. Cobreix la vora com una serp, entra al riu i el tens es nota en cada anella: algú, molt lluny, l'estira cap amunt.",
        },
        {
          id: "campana", kind: "feature", name: "La campana submergida", x: 38, y: 68, keywords: ["campana", "aigua", "fons", "lletres", "bronze", "vadejar", "nedar"],
          examine: "Sota la superfície es veu un bronze verd, gros com un pou. Hi ha lletres rascades al llavi interior. Per llegir-les caldria ficar-hi el cap.",
          check: {
            ability: "con", dc: 12, reason: "Ficar-se a l'aigua freda per llegir la campana", flag: "lletres", xp: 25, onFail: "fight",
            alts: [
              { keywords: ["cord", "corda", "lliga", "ajuda", "ens lliga", "assegur"], ability: "str", dc: 11, reason: "Baixar lligat amb una corda" },
            ],
            success: "L'aigua és gelada, però aguantes. Al llavi de la campana, tres lletres: V, O i una doble S. La resta s'ha menjat el temps. Surts de l'aigua amb els llavis morats i la certesa que la campana crida una paraula, no un cop.",
            fail: "L'aigua et fa un pessic i tens ganes de tornar enrere. Llavors, de la boira, les llumetes s'ajunten: no eren fanals.",
          },
        },
        {
          id: "fanalets", kind: "foe", name: "Fanalets del riu", x: 54, y: 56, keywords: ["fanalets", "llums", "llumetes", "fanal", "ballen", "boira"], threat: true,
          examine: "Llumetes pàl·lides que ballen sobre l'aigua. De tant en tant una s'acosta, curiosa, i es retira. No són amigues de ningú.",
          foe: { name: "Fanalet del riu", the: "el fanalet del riu", hp: 7, ac: 12, atk: 3, dmg: "1d4+1", xp: 20, count: 2 },
        },
        {
          id: "sirga", kind: "exit", name: "Camí de sirga, riu amunt", x: 10, y: 20, to: "cami", keywords: ["sirga", "cami", "camí", "amunt", "peatge"],
          requires: { flag: "lletres|escoltat|nota-pont", hint: "No saps per on tirar. Potser val la pena escoltar bé la campana o el pont." },
          examine: "Un sender de terra a la vora del riu, que pugen els vells sirgadors. La cadena el segueix.",
        },
        { id: "poble", kind: "exit", name: "Tornar al poble", x: 72, y: 50, to: "pas", keywords: ["poble", "pas", "pinassa", "tornar", "enrere", "plaça", "placa"], examine: "El pont i les llums del poble." },
      ],
    },
    {
      id: "cami",
      name: "Pas de la Sirga",
      image: "/art/forge.jpg",
      daypart: "Matí",
      clock: "08:40",
      weather: "Boira baixa",
      sky: "MATÍ · BOIRA",
      ambient: "Un camí de sirgadors, amb fulles vermelles i el soroll d'una cadena tibant.",
      chronicleTitle: "Cap amunt, seguint la cadena",
      back: "Torneu al Pas de la Sirga. La cadena segueix tibant cap al fortí.",
      opening:
        "El matí us troba caminant per un sender estret entre les roques, sempre a l'ombra de la cadena. Hi ha una tenda vella i una foguera apagada: un campament de sirgadors que ningú no ha desmuntat. Més amunt, entre les roques, l'entrada d'una antiga farga encara fumeja una mica. A la porta d'aquesta farga, dues armadures buides, planes i mudes, guarden el camí que continua cap a un fortí.\n\nUna d'elles gira el cap quan us veu. «Un nom o una moneda», diu, amb una veu com de coure.\n\nConsell del DM: pots passar de tres maneres. Pagar la moneda (si la tens), dir la fórmula del peatge (si l'has llegida al llibre), o lluitar. Digues, per exemple, «pago la moneda» o «ataco les armadures».",
      quest: { title: "El peatge de la cadena", detail: "Passa les armadures i segueix la cadena fins al fortí." },
      choices: [],
      hotspots: [
        {
          id: "armadures", kind: "foe", name: "Armadures del peatge", x: 66, y: 28, keywords: ["armadures", "armadura", "guardians", "guardes", "peatge", "farga"], threat: true,
          examine: "Dues armadures buides, de colls estrets i genolls grossos. Fan un tic-tac de metall cada cop que es mouen, com un rellotge molt vell.",
          foe: { name: "Armadura buida", the: "l'armadura buida", hp: 11, ac: 13, atk: 3, dmg: "1d6+1", xp: 25, count: 2 },
          talk: [
            { keywords: ["moneda", "pago", "pagar", "paguem", "dono", "doni", "dona", "pago", "peatge"], requires: "moneda", say: "Poses la moneda de coure a la mà del guantelet. Les armadures la fan girar a la llum, la tasten, i, amb un cop sec, es fan a un costat. «Pagat. Pot passar.»", flag: "peatge-pagat", xp: 20 },
            { keywords: ["nom", "formula", "fórmula", "diu", "recit", "recito", "dic", "llibre", "barquer", "voss"], requires: "llibre", say: "Obres el llibre per la pàgina del peatge i llegeixes en veu alta: «Qui passa, deixa un nom o una moneda. Qui no té cap de les dues, deixa la veritat.» Les armadures s'immobilitzen. Llavors diuen, a l'uníson, «És veritat». I es fan a un costat.", flag: "peatge-pagat", xp: 25 },
          ],
          check: {
            ability: "cha", dc: 14, reason: "Convèncer les armadures de deixar-vos passar", flag: "peatge-pagat", xp: 25, onFail: "fight",
            alts: [{ keywords: ["amenac", "intimid", "espanto"], ability: "str", dc: 15, reason: "Fer-les recular amb una mirada" }],
            success: "Parles amb tanta calma, i tan clar, que les armadures dubten. Una gira el cap cap a l'altra, i s'aparten. «Ha dit la veritat. Passi.»",
            fail: "«No és un nom. No és una moneda.» Les armadures aixequen les armes amb un cruixit.",
          },
        },
        { id: "tenda", kind: "feature", name: "Tenda dels sirgadors", x: 23, y: 66, keywords: ["tenda", "campament", "sirgadors", "tela"], examine: "Una tenda de lona vella. Dins hi ha una manta i una pissarra on algú va apuntar: «Peatge: un nom o una moneda. Que no us enganyin els guardians: són bons si els parleu com cal.»" },
        { id: "foguera", kind: "feature", name: "Foguera apagada", x: 28, y: 76, keywords: ["foguera", "cendra", "foc"], examine: "Cendra freda i dos taulons de banc. Algú hi va dibuixar una barca amb carbó." },
        {
          id: "pas-sirga", kind: "exit", name: "Sender cap al fortí", x: 52, y: 52, to: "peatge", keywords: ["sender", "forti", "fortí", "rails", "sirga"],
          requires: { flag: "peatge-pagat|dead-armadures", hint: "Les armadures us barren el camí. Cal resoldre-ho abans." },
          examine: "El sender puja cap al fortí, per unes roques enllustrades per milers de peus.",
          check: {
            ability: "dex", dc: 11, reason: "Pujar per les roques mullades", flag: "sirga-passada", xp: 10,
            success: "Peu ferm, peu ferm, mà. Arribes a dalt amb les botes plenes de fang i un somriure prudent.",
            fail: "La roca llisca. Cau un genoll, una mà, un cop sec. Perds un cor, però continues.",
            hurt: 1,
            go: true,
          },
        },
        { id: "tornar", kind: "exit", name: "Tornar a l'arc", x: 12, y: 78, to: "arc", keywords: ["arc", "tornar", "enrere", "riu"], examine: "El camí que torna cap a l'arc i el poble." },
      ],
    },
    {
      id: "peatge",
      name: "Fortí del Peatge",
      image: "/art/fort.jpg",
      daypart: "Migdia",
      clock: "12:15",
      weather: "Clar",
      sky: "MIGDIA · CLAR",
      ambient: "El fortí és ple de silenci. La cadena creua el pati i s'enfila cap a una tapa de pou.",
      chronicleTitle: "El nom a la torre",
      back: "Torneu al pati del fortí. Tot continua igual de quiet.",
      opening:
        "El fortí del peatge fa anys que no cobra ni una moneda. El pati és ple de caixes i d'un carro de barquer sense rodes, i la cadena travessa les llosetes i s'enfila cap a una tapa de pou. Al costat, la torre rodona, amb heura i molsa fins als merlets.\n\nÉs hora de fer feina: algú ha gravat un nom en aquesta torre, i algú l'ha omplert de morter.",
      quest: { title: "El nom de la torre", detail: "Busca la gravació a la torre rodona." },
      choices: [],
      hotspots: [
        {
          id: "torre", kind: "feature", name: "La torre rodona", x: 21, y: 28, keywords: ["torre", "nom", "gravat", "gravacio", "gravació", "molsa", "heura", "pedra", "lletres"],
          examine: "Una torre rodona, de pedra gris, amb molsa a la part baixa. A l'alçada dels ulls, la pedra té una taca de morter on algú ha escrit alguna cosa i després ho ha tapat.",
          check: {
            ability: "wis", dc: 11, reason: "Netejar la molsa i llegir la gravació", flag: "nom-trobat", xp: 40,
            alts: [{ keywords: ["fregar", "netejar", "pedra de fregar", "polze", "tinta", "carbo", "carbó"], ability: "int", dc: 11, reason: "Fer un fregat de les lletres amb carbó" }],
            success: "Treus la molsa amb els dits i la taca de morter amb la punta d'un ganivet. Sota, lletres netes, fondes, de mà de picapedrer: MAREN VOSS. La pluja mai no ha aconseguit mullar aquestes sis lletres.",
            fail: "La molsa és tossuda, el morter també. Només hi veus ratlles. Potser provant-ho altre cop, o d'una altra manera.",
          },
        },
        {
          id: "carro", kind: "feature", name: "Carro de barquer", x: 46, y: 43, keywords: ["carro", "cordes", "nusos", "rodes"],
          examine: "Un carro sense rodes ple de cordes velles. En Holt reconeix els nusos al primer cop d'ull: són nusos de barquer, de gent que treballa a l'aigua.",
        },
        { id: "cadena-tapa", kind: "feature", name: "La tapa de la cadena", x: 46, y: 60, keywords: ["tapa", "pou", "cadena", "ferro"], examine: "Una tapa de ferro on la cadena entra a terra. Si hi poses la mà, sents la campana, molt lluny, preguntar alguna cosa." },
        { id: "caixes", kind: "feature", name: "Caixes del peatge", x: 72, y: 42, keywords: ["caixes", "peatge", "monedes", "diners", "pagament"], examine: "Caixes buides. Algú va emportar-se les monedes fa molt temps; només queden un parell de claus penjades." },
        { id: "baixar", kind: "exit", name: "Porta del fortí", x: 62, y: 75, to: "cami", keywords: ["porta", "baixar", "enrere", "sirga", "cami", "camí"], examine: "La porta per on heu entrat: l'altre cantó del pas de la sirga." },
        {
          id: "poble", kind: "exit", name: "Camí de tornada al poble", x: 80, y: 32, to: "pas", keywords: ["poble", "aiguaquieta", "tornar", "pas", "torno"],
          requires: { flag: "nom-trobat", hint: "Encara no tens res per portar al poble. Busca la gravació de la torre." },
          examine: "Un camí curt per un portal ruïnós que dóna al riu: baixa directament cap a Aiguaquieta.",
        },
      ],
    },
  ],
};
