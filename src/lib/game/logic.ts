import { CAMPAIGNS, getCampaign, getScene, INVENTORY, PARTY } from "@/lib/game/content";
import { MAX_LEVEL, REST_CHARGES, xpAfter } from "@/lib/game/rules";
import type { Choice, GmResult, Hotspot, Mechanics, Tale } from "@/lib/game/types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const endChoice: Choice = { id: "open-chronicle", label: "Llegeix la crònica", hint: "El capítol ja està contat" };

function beat(
  narration: string,
  choices: Choice[],
  extra: Partial<GmResult> = {},
): GmResult {
  return { narration, choices, ...extra };
}

const BOOK: Record<string, GmResult> = {
  "lantern-market:ask-baker": beat(
    "La fornera s'espolsa les mans i abaixa la veu, cosa innecessària: el mercat ja escolta.\n\n«Sorra al poal a l'alba. I la saca era tèbia, com una pedra que ha estat a la butxaca. Qui la portava va sortir del pou, no hi va entrar.» Fa un gest cap als sacs de carbó. «Aquells van arribar sense carreter. Cremen blaus a les vores.»",
    [
      { id: "search-satchel", label: "Buida la saca sobre les pedres" },
      { id: "well-rope", label: "Baixa tant com deixi la corda" },
      { id: "follow-coal", label: "Segueix l'olor de carbó cap a la sala" },
      { id: "sacks", label: "Obre un sac de carbó" },
    ],
    { moveTo: "stall", questTitle: "La sorra de la saca", questDetail: "La fornera jura que el portador va pujar del pou." },
  ),
  "lantern-market:search-satchel": beat(
    "En Holt buida la saca. Sorra, una engruna de pastís i una carta que ha sobreviscut amagada a la costura. La tinta ha corregut cap amunt per la pàgina.\n\nÉs una targeta de ruta: Pinassa, sota la sala, sortida a l'auroneda. Al peu, amb una lletra que no és del missatger: porta la campana cap a l'altre costat.",
    [
      { id: "well-rope", label: "Mira cap avall al pou" },
      { id: "follow-coal", label: "Porta la targeta de ruta a la sala" },
      { id: "ask-baker", label: "Ensenya la carta a la fornera" },
    ],
    {
      chronicleTitle: "Tinta que corre cap amunt",
      chronicleBody: "L'única carta que ha sobreviscut demana a la companyia que porti una campana cap a l'altre costat.",
      moveTo: "well",
    },
  ),
  "lantern-market:well-rope": beat(
    "En Calder agafa la corda. Deu passes avall, l'aire es torna amable. L'aigua és tèbia i clara i plena de còdols corrents, tret que estan arranjats com una frase.\n\nLa Bramble la llegeix des de dalt: no és una trampa. És una petició. El riu de sota la muntanya vol que el seu correu es lliuri cap al mar, i va agafar un missatger prestat per dir-ho.",
    [
      { id: "follow-coal", label: "Segueix la petició fins a la sala" },
      { id: "search-satchel", label: "Surt i regira la saca" },
      { id: "ask-baker", label: "Digues a la fornera que el pou és amable" },
    ],
    { moveTo: "well", heartDelta: [{ id: "calder", delta: -1 }] },
  ),
  "lantern-market:sacks": beat(
    "El sac pesa més que el carbó i fa menys soroll. Còdols de riu, cadascun marcat amb un segell de correu minúscul. Quan en Holt n'aixeca un, la foguera s'hi inclina.\n\nRes no ataca. Les pedres són correu perdut, que espera ser escalfat fins a convertir-se en paraules.",
    [
      { id: "follow-coal", label: "Porta un còdol a la sala" },
      { id: "ask-baker", label: "Pregunta qui va signar pels sacs" },
    ],
    { moveTo: "sacks" },
  ),
  "lantern-market:follow-coal": beat(
    "L'olor de carbó és un fil. Et treu de la neu i et porta per una escala que el mercat feia servir per recolzar-hi les pales. A baix, el llautó fa tic-tac.\n\nLa Sala de l'Orrery s'obre al teu voltant, i la neu no et segueix.",
    [
      { id: "read-letters", label: "Llegeix les cartes sota les pedres" },
      { id: "still-rings", label: "Demana a la Vesper que aturi els anells" },
      { id: "star-floor", label: "Puja a l'incrustació d'estels" },
      { id: "descend", label: "Segueix el so d'aigua cap avall" },
    ],
    {
      nextSceneId: "orrery-hall",
      daypart: "Capvespre",
      clock: "19:10",
      weather: "Calma",
      sky: "CAPVESPRE · CALMA",
      questTitle: "El corrent al llautó",
      questDetail: "La sala segueix un riu, no un cel.",
      chronicleTitle: "A la Sala de l'Orrery",
      chronicleBody: "La companyia deixa la neu i troba la casa de correus girant com un cel.",
    },
  ),
  "orrery-hall:read-letters": beat(
    "Les cartes són corrents i insuportables, com ho són les coses corrents. Un aniversari. Un deute perdonat. Una recepta de pastís que pot viatjar. Cadascuna té al damunt un còdol de riu perquè no se la dugui el vent cap a l'estació equivocada.\n\nLa Vesper diu que les pedres no són panys. Són bones maneres.",
    [
      { id: "still-rings", label: "Atura els anells" },
      { id: "descend", label: "Segueix el so d'aigua" },
      { id: "star-floor", label: "Planta't a l'estel mullat" },
    ],
    { moveTo: "desk" },
  ),
  "orrery-hall:still-rings": beat(
    "La Vesper no mana a l'armil·lar. El saluda i hi presenta la companyia. Els anells alenteixen, avergonyits, i s'obre un buit prou gran per veure una escala de pedra mullada que baixa cap a un aire de tardor.\n\nLa petjada del missatger és al primer graó, encara humida.",
    [
      { id: "descend", label: "Baixa per l'escala mullada" },
      { id: "read-letters", label: "Recull primer les cartes" },
    ],
    { moveTo: "armillary", heartDelta: [{ id: "vesper", delta: -1 }] },
  ),
  "orrery-hall:star-floor": beat(
    "La incrustació mullada només té un dit de fondària, però té corrent. La llum la creua com una bagra. Quan la Bramble hi posa una mà, sent un camí sota l'aigua, que baixa cap al fum d'auró.",
    [
      { id: "descend", label: "Segueix el camí sota l'aigua" },
      { id: "still-rings", label: "Demana als anells una porta" },
    ],
    { moveTo: "stars" },
  ),
  "orrery-hall:descend": beat(
    "L'escala us deixa sota uns auros que no tenen res a fer a aquesta banda d'un coll nevat. La farga és encesa. Algú seu en una caixa, viu, avergonyit, amb una campana del tamany d'un puny.\n\n«Vaig intentar lliurar-la costa amunt», diu el missatger. «Només volia anar cap avall.»",
    [
      { id: "take-bell", label: "Accepta la campana i les cartes" },
      { id: "ask-courier", label: "Demana al missatger que ho expliqui clar" },
      { id: "bank-fire", label: "Tapa la farga" },
      { id: "close-book", label: "Acompanya el missatger a casa" },
    ],
    {
      nextSceneId: "maple-forge",
      daypart: "Matí",
      clock: "07:05",
      weather: "Fum de llenya",
      sky: "MATÍ · FUM",
      day: 2,
      questTitle: "Porta-ho cap avall",
      questDetail: "El missatger és a salvo. La campana encara necessita una direcció.",
      chronicleTitle: "El missatger a la caixa",
      chronicleBody: "Viu, avergonyit i amb una campana que es nega a anar costa amunt.",
    },
  ),
  "maple-forge:take-bell": beat(
    "La campana és més lleugera que la culpa i més pesada del que sembla. No sona fins que en Calder l'apunta cap al camí baix. Llavors una sola nota, educada, com algú que s'aclareix la gola a la porta.\n\nEl missatger riu una vegada, d'alleujament. Les pedres de la farga passen del blau al gris corrent.",
    [
      { id: "ask-courier", label: "Pregunta què volia dir la nota" },
      { id: "bank-fire", label: "Tapa la farga" },
      { id: "close-book", label: "Acompanya'l a casa" },
    ],
    { moveTo: "camp" },
  ),
  "maple-forge:ask-courier": beat(
    "Parla com parla la gent que ha estat valenta en una sala confusa. Una veu al pou li va demanar un favor: portar la campana cap avall, cap a un riu que ha oblidat un nom. La sorra va ser un error. El missatger es va espantar i va omplir la saca amb el primer que va trobar sec.\n\n«Em sap greu l'olor de pastís», afegeix, i així saps que diu la veritat.",
    [
      { id: "take-bell", label: "Agafa la campana" },
      { id: "close-book", label: "Promet que l'acompanyaràs a casa" },
    ],
    { moveTo: "path" },
  ),
  "maple-forge:bank-fire": beat(
    "En Calder tapa la farga amb el pla de la pala, no amb el tall de res. El rierol deixa de pujar pels carrils i es posa a ser un rierol. Una fulla d'auró flota en la direcció correcta.\n\nLa Bramble marca el lloc amb guix vermell. Aquesta vegada, la ratlla es queda.",
    [
      { id: "take-bell", label: "Agafa la campana mentre està tranquil·la" },
      { id: "close-book", label: "Tanca el capítol" },
    ],
    { moveTo: "forge" },
  ),
  "maple-forge:close-book": beat(
    "Acompanyeu el missatger fins a la neu, que us rep sense fer cap comentari. La fornera plora a la manera eficient de qui té pastissos al forn i una persona que ha tornat.\n\nLa campana resta embolicada. En algun lloc, riu avall, un riu assaja un nom. El Correu de Pinassa és un capítol que podeu tancar.",
    [endChoice],
    {
      endTale: true,
      questTitle: "El correu és lliurat",
      questDetail: "El missatger és a casa. La campana baixarà un altre dia, i això és prou.",
      chronicleTitle: "A casa abans que es refredin els pastissos",
      chronicleBody: "La companyia torna el missatger. La campana no sona. La muntanya es calma.",
      moveTo: "path",
    },
  ),
  "reed-crossing:speak-grey": beat(
    "L'home de gris no és perdut. Espera que li parlin amb propietat. El seu abric és d'un barquer, i les seves botes fa temps que no es mullen.\n\n«Vaig posar la campana sota l'arc perquè deixés de cridar la gent pel nom equivocat», diu. «En va guardar un. M'agradaria recuperar-lo, però no puc entrar a l'aigua. He oblidat com es mulla un.»",
    [
      { id: "listen-arch", label: "Escolta a l'arc per ell" },
      { id: "blank-sign", label: "Pregunta pel rètol en blanc" },
      { id: "wade", label: "Endinsa't als joncs" },
      { id: "follow-chain", label: "Segueix la cadena riu amunt" },
    ],
    {
      moveTo: "reeds",
      questTitle: "Segueix el rastre de la campana",
      questDetail: "El barquer no pot mullar-se. El nom que va perdre és riu amunt, o sota l'arc.",
    },
  ),
  "reed-crossing:blank-sign": beat(
    "El picapedrer no alça els ulls. «Era un nom amb una V. Dues síl·labes. El vaig omplir perquè la campana el cridava de nit i els bols de la barra caminaven fins a la vora.»\n\nT'ofereix el cisell, després s'ho repensa i t'ofereix una pedra de fregar. «Si trobeu les lletres, les hi tornaré a posar. No hauria d'haver tingut por d'una paraula.»",
    [
      { id: "speak-grey", label: "Explica-ho al barquer" },
      { id: "listen-arch", label: "Escolta sota l'arc" },
      { id: "follow-chain", label: "Segueix la cadena riu amunt" },
    ],
    { moveTo: "hut" },
  ),
  "reed-crossing:shelter": beat(
    "L'hostal és càlid de la manera concreta de la llana mullada i la sopa de ceba. La hostalera deixa el bol que sostenia.\n\n«El riu es va endur un nom i va deixar el deute», diu. «No estem encantats. Estem inacabats. Si aneu riu amunt, porteu un pastís. El fortí del peatge fa eco, i els ecos tenen més gana que els viatgers.»",
    [
      { id: "speak-grey", label: "Torna a sortir cap al barquer" },
      { id: "blank-sign", label: "Visita el picapedrer" },
      { id: "follow-chain", label: "Agafa el pastís i segueix la cadena" },
    ],
    { moveTo: "inn" },
  ),
  "reed-crossing:listen-arch": beat(
    "Sota l'arc, la pluja sona com coberts que es guarden amb cura. Una nota s'enfila per la cadena — no forta, no un avís. Algú que diu aquí.\n\nLa perla de la Vesper fa tic-tac en resposta. La cadena no acaba al poble. Corre riu amunt, cap a l'antic peatge.",
    [
      { id: "follow-chain", label: "Segueix la cadena riu amunt" },
      { id: "wade", label: "Entra a l'aigua i busca la campana" },
      { id: "speak-grey", label: "Explica la nota al barquer" },
    ],
    { moveTo: "arch" },
  ),
  "reed-crossing:wade": beat(
    "Els joncs us arriben al genoll i no més enllà. La campana és allà, verda i pacient, massa pesada per a una persona i massa estimada per arrossegar-la. Hi ha lletres rascades al llavi interior. La pluja gairebé se les ha menjades.\n\nLa Bramble traça el que pot: una V, una O, l'ombra d'una doble S. La resta del nom no és aquí. La cadena estira, molt suaument, riu amunt.",
    [
      { id: "follow-chain", label: "Segueix la cadena fins a la resta del nom" },
      { id: "speak-grey", label: "Surt i explica-ho al barquer" },
    ],
    { moveTo: "reeds", heartDelta: [{ id: "bramble", delta: -1 }] },
  ),
  "reed-crossing:follow-chain": beat(
    "Camineu per la riba al capvespre fins que el capvespre es rendeix. La cadena és un rumor sota el camí, i després un fet al pati del fortí del peatge. El matí us hi troba, i el fortí us rep amable.\n\nA la torre, un nom s'ha amagat dins els seus propis solcs.",
    [
      { id: "copy-name", label: "Copia el nom amb guix de camí" },
      { id: "ask-maren", label: "Pregunta si el barquer és la Maren" },
      { id: "ring-once", label: "Toca la cadena una vegada, suaument" },
      { id: "close-book", label: "Porta el nom a casa, al rètol" },
    ],
    {
      nextSceneId: "toll-fort",
      daypart: "Matí",
      clock: "09:20",
      weather: "Serè",
      sky: "MATÍ · SERÈ",
      day: 2,
      questTitle: "Retorna el nom",
      questDetail: "La torre recorda la Maren Voss. El rètol del poble, encara no.",
      chronicleTitle: "Joncs a Aiguaquieta",
      chronicleBody: "La companyia segueix una cadena riu amunt i troba un nom amagat a la torre.",
    },
  ),
  "toll-fort:copy-name": beat(
    "El guix vermell de la Bramble no serveix. Fa servir el blanc. MAREN VOSS reposa en una llosa, clar com el pa. Les lletres no es difuminen quan el vent les prova.\n\nDes del pati, el barquer — no l'has sentit arribar — diu: «Sí. Aquest. Vaig deixar-lo aquí perquè una campana que et diu el nom tota la nit és un company de pis difícil.»",
    [
      { id: "ask-maren", label: "Deixa que digui la resta" },
      { id: "ring-once", label: "Toca la cadena una vegada" },
      { id: "close-book", label: "Porta el fregat a casa" },
    ],
    { moveTo: "tower" },
  ),
  "toll-fort:ask-maren": beat(
    "És la Maren Voss. Va deixar el bac l'any que l'arc es va esquerdar, i des de llavors ha estat sec, cosa que va creure que era seguretat i que va resultar ser un passadís llarg.\n\n«Torneu el nom al rètol», diu. «Em plantaré sota la pluja a propòsit. Estic cansat de ser un rumor amb botes.»",
    [
      { id: "close-book", label: "Acompanya'l a casa, al rètol" },
      { id: "ring-once", label: "Toca la cadena com a promesa" },
    ],
    { moveTo: "gate" },
  ),
  "toll-fort:ring-once": beat(
    "Una nota. La cadena la porta sense dramatisme. Lluny, els bols de l'hostal probablement fan un pas educat enrere de la vora i després s'ho repensen abans de saltar.\n\nEn Holt somriu. «Això és una campana a qui s'ha demanat, no manat.»",
    [
      { id: "copy-name", label: "Copia el nom" },
      { id: "close-book", label: "Torna mentre la nota encara és a l'aire" },
    ],
    { moveTo: "yard" },
  ),
  "toll-fort:close-book": beat(
    "El picapedrer plora, breument, i després fa la feina. MAREN VOSS torna al rètol. El barquer es queda sota la pluja fins que les espatlles se li enfosqueixen, i sembla tan alleujat que fa una mica de gràcia.\n\nSota l'arc, la campana sona una vegada, sola, i després guarda un silenci decent. Aiguaquieta ja es pot tancar.",
    [endChoice],
    {
      endTale: true,
      questTitle: "El nom és al rètol",
      questDetail: "La Maren Voss és mullada, recordada i ja no és un rumor.",
      chronicleTitle: "El rètol recorda",
      chronicleBody: "La companyia porta el nom a casa. La campana sona una vegada i accepta reposar.",
    },
  ),
  "salt-wharf:harbormaster": beat(
    "La capitana del port té sal a les celles i cap paciència amb misteris que retarden marees, és a dir, una mica en té.\n\n«La carta nocturna era sencera al migdia. Al vespre la costa havia desaparegut i un mariner havia desaparegut amb ella. L'Alosa no navega a cegues. Teniu cinc dies, i jo tinc una campana esquerdada i una reputació. Arregleu el problema més amable dels dos.»",
    [
      { id: "footprints", label: "Segueix les petjades mullades" },
      { id: "open-crate", label: "Obre la caixa de l'estrella" },
      { id: "cracked-bell", label: "Inspecciona la campana" },
    ],
    { moveTo: "warehouse" },
  ),
  "salt-wharf:footprints": beat(
    "Esquerra, dreta, i després la idea d'un peu. L'última petjada és freda. La Bramble s'estira sobre els taulons i mira de gairell, que és com les escoltes fan confessar els bassals.\n\nL'aigua de la petjada apunta, molt lleugerament, cap a una caixa marcada amb una estrella de guix.",
    [
      { id: "open-crate", label: "Obre la caixa de l'estrella" },
      { id: "harbormaster", label: "Explica-ho a la capitana del port" },
      { id: "cracked-bell", label: "Comprova la campana de passada" },
    ],
    { moveTo: "pier" },
  ),
  "salt-wharf:cracked-bell": beat(
    "L'esquerda és vella. El batall és nou, embolicat amb tela de vela perquè no desperti tot el port. Dins la tela, un nus que en Holt coneix: feina de mariner, curosa, avergonyida d'ella mateixa.\n\nQui va amagar la carta no volia escàndol. Volia un retard.",
    [
      { id: "open-crate", label: "Troba la carta abans que s'acabi el retard" },
      { id: "footprints", label: "Torna a les petjades" },
    ],
    { moveTo: "warehouse" },
  ),
  "salt-wharf:open-crate": beat(
    "La caixa de l'estrella conté un abric de llana, una taronja i una clau de la torre de les cartes. Cap carta. Una nota amb lletra rodona: Sala de nit. No navegueu a les fosques sense el Far de l'Estella.\n\nLa clau és tèbia. La torre és dalt de l'escala que l'escrivent va fer veure que no esmentava.",
    [
      { id: "search-room", label: "Regira la sala de cartes" },
      { id: "read-note", label: "Llegeix la nota en veu alta" },
      { id: "telescope", label: "Gira el telescopi cap avall" },
      { id: "to-gate", label: "Porta la nota cap a la comporta" },
    ],
    {
      nextSceneId: "night-chart",
      daypart: "Capvespre",
      clock: "21:40",
      weather: "Serè",
      sky: "CAPVESPRE · SERÈ",
      questTitle: "Adoba la costa",
      questDetail: "La sala de cartes té la resta de l'amabilitat, i el tros de costa que falta.",
      chronicleTitle: "Petjades que s'aturen",
      chronicleBody: "Una clau tèbia, una taronja i un avís de no navegar sense el far.",
      moveTo: "crates",
    },
  ),
  "night-chart:search-room": beat(
    "Regireu com la gent a qui han demanat que tingui cura amb el paper. La costa tallada no és a la taula. Pel telescopi, apuntat malament cap a un terrat, un tros pàl·lid es veu sota una teula com una llengua.\n\nEn Holt ja mesura la pujada amb els ulls i decideix agafar les escales.",
    [
      { id: "telescope", label: "Envia en Holt a buscar el tros" },
      { id: "read-note", label: "Llegeix primer la nota" },
      { id: "to-gate", label: "Porta el que tens a la comporta" },
    ],
    { moveTo: "telescope" },
  ),
  "night-chart:read-note": beat(
    "La Vesper la llegeix sense afegir-hi trons. El fanaler del Far de l'Estella no ha tornat. El mariner va amagar la carta perquè l'Alosa hagués d'esperar. És una bona idea maldestra, que és la classe més comuna.\n\nLa costa encara s'ha de cosir. Un vaixell que espera també hauria de poder veure.",
    [
      { id: "telescope", label: "Ves a buscar la costa tallada" },
      { id: "to-gate", label: "Porta la nota a la comporta" },
    ],
    { moveTo: "desk" },
  ),
  "night-chart:telescope": beat(
    "El tros sota la teula és la mitja lluna de costa que falta, embolicada amb tela encerada i amb un clau al damunt perquè el vent no millorés el pla. El tall és net. Es pot adobar.\n\nA baix, al mur de mar, els fanals ja s'agrupen. La tripulació de l'Alosa enrotlla corda quan és nerviosa.",
    [
      { id: "to-gate", label: "Porta la costa a la comporta" },
      { id: "read-note", label: "Porta també la nota" },
    ],
    { moveTo: "telescope", chronicleTitle: "La costa sota una teula", chronicleBody: "La riba que faltava era amagada, no destruïda." },
  ),
  "night-chart:to-gate": beat(
    "El vent del matí us porta fins a la comporta. El mariner és al pati amb la cara de qui ha assajat una confessió i voldria saltar-se a la disculpa.\n\nA l'aigua, un esquif amb una vela remendada intenta arribar a temps.",
    [
      { id: "speak-crew", label: "Demana a la tripulació una marea més" },
      { id: "mend-chart", label: "Adoba la carta al carro" },
      { id: "light-signal", label: "Fes senyals al Far de l'Estella" },
      { id: "close-book", label: "Espera que la llum respongui" },
    ],
    {
      nextSceneId: "tide-gate",
      daypart: "Matí",
      clock: "06:50",
      weather: "Vent",
      sky: "MATÍ · VENT",
      day: 2,
      questTitle: "Una marea de paciència",
      questDetail: "El fanaler gairebé és a port. Algú ha de demanar al vaixell que esperi, i dir-ho de debò.",
      chronicleTitle: "Cap a la comporta",
      chronicleBody: "La companyia porta una costa tallada i una bona raó a la comporta.",
    },
  ),
  "tide-gate:speak-crew": beat(
    "En Calder no crida. Diu el nom del fanaler — el heu après tots, és a la nota — i diu una marea. La contramestra mira l'esquif, després la possibilitat d'una carta adobada, i escup, pensativa, a favor del vent.\n\n«Una marea», diu. «Digueu al vostre mariner que els nusos eren bons. El pla era podrit. Totes dues coses poden ser certes.»",
    [
      { id: "mend-chart", label: "Adoba la carta mentre esperen" },
      { id: "light-signal", label: "Encén el senyal" },
      { id: "close-book", label: "Que aquest sigui el final" },
    ],
    { moveTo: "yard" },
  ),
  "tide-gate:mend-chart": beat(
    "Cola, pressió i un pes. La costa s'estira. La Bramble hi bufa com si fos sopa. La mitja lluna s'uneix tan bé que només qui busqués una cicatriu la trobaria.\n\nLa Vesper copeja el marge, on les cartes deixen lloc a l'honestedat, i escriu: una marea aguantada pel Far de l'Estella.",
    [
      { id: "light-signal", label: "Fes senyals al far" },
      { id: "close-book", label: "Tanca el llibre amb una costa sencera" },
    ],
    { moveTo: "cart", chronicleTitle: "Una costa tornada al seu lloc", chronicleBody: "La carta nocturna torna a ser sencera, amb una nota al marge sobre la paciència." },
  ),
  "tide-gate:light-signal": beat(
    "El fanal d'en Calder encaixa a la ranura de senyals com si la ranura hagués estat sola. Tres mostres lentes, el patró de la capitana del port per a «aguanteu». Una llumeta respon des de l'esquif, i després una de més forta des del cap quan el fanaler arriba a l'escala del Far de l'Estella i fa la seva feina.\n\nLa campana esquerdada del port sona igualment. Algú és feliç.",
    [
      { id: "close-book", label: "Mira la llum i tanca el llibre" },
      { id: "mend-chart", label: "Acaba la carta si encara et necessita" },
    ],
    { moveTo: "tower" },
  ),
  "tide-gate:close-book": beat(
    "L'Alosa espera una marea, que és un petit miracle fet de corda i bones maneres. El Far de l'Estella crema. Al mariner li fan cridar, el fan menjar i el tornen a posar al torn de guàrdia. La carta puja a bord amb la seva cicatriu i el seu marge honest.\n\nEl Port del Crepuscle conserva el seu vaixell, el seu fanaler i la seva història. Podeu tancar el llibre.",
    [endChoice],
    {
      endTale: true,
      questTitle: "La llum és encesa",
      questDetail: "El vaixell va esperar. La costa és sencera. El port fa soroll de bona manera.",
      chronicleTitle: "Una marea",
      chronicleBody: "Aguanten la porta, adoben la carta i miren com respon el Far de l'Estella.",
    },
  ),
};

function choicesFor(sceneId: string): Choice[] {
  const scene = CAMPAIGNS.flatMap((c) => c.scenes).find((s) => s.id === sceneId);
  return scene?.choices.slice(0, 4) ?? [];
}

function findSpot(tale: Tale, text: string): Hotspot | undefined {
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return undefined;
  const low = text.toLowerCase();
  return scene.hotspots.find((h) => low.includes(h.name.toLowerCase()) || low.includes(h.id.replace("-", " ")));
}

export function createTale(campaignId: string, playerName: string): Tale {
  const campaign = getCampaign(campaignId);
  if (!campaign) throw new Error("Unknown tale");
  const scene = campaign.scenes[0];
  const party = PARTY.map((p) => ({ ...p }));
  const positions: Record<string, string> = {};
  party.forEach((p, i) => {
    positions[p.id] = scene.hotspots[i % scene.hotspots.length].id;
  });
  const name = playerName.trim() || "Viatger";
  return {
    id: uid(),
    playerName: name,
    campaignId,
    sceneId: scene.id,
    chapter: 1,
    day: 1,
    daypart: scene.daypart,
    clock: scene.clock,
    weather: scene.weather,
    sky: scene.sky,
    activeId: party[0].id,
    party,
    positions,
    quest: { ...scene.quest },
    inventory: INVENTORY.map((item) => ({ ...item })),
    chronicle: [
      {
        id: uid(),
        day: 1,
        title: scene.chronicleTitle,
        body: scene.opening,
        sceneName: scene.name,
        campaignName: campaign.name,
        image: scene.image,
      },
    ],
    narration: scene.opening,
    choices: scene.choices,
    log: [{ role: "gm", text: scene.opening }],
    updatedAt: Date.now(),
    beat: 0,
    level: 1,
    xp: 0,
    summary: "",
    finished: false,
    encounter: null,
    pendingRoll: null,
    edge: null,
    rests: REST_CHARGES,
    partner: "",
  };
}

/** Fill in anything an older save or a pasted code does not know about yet. */
export function normalizeTale(raw: Tale): Tale {
  const base = PARTY.map((p) => ({ ...p }));
  const party = (raw.party ?? base).map((c) => {
    const ref = base.find((b) => b.id === c.id);
    return ref ? { ...ref, ...c, abilities: c.abilities ?? ref.abilities, proficient: c.proficient ?? ref.proficient, attack: c.attack ?? ref.attack, voice: c.voice ?? ref.voice } : c;
  });
  return {
    ...raw,
    party,
    level: raw.level ?? 1,
    xp: raw.xp ?? 0,
    summary: raw.summary ?? "",
    finished: raw.finished ?? false,
    encounter: raw.encounter ?? null,
    pendingRoll: raw.pendingRoll ?? null,
    edge: raw.edge ?? null,
    rests: raw.rests ?? REST_CHARGES,
    partner: raw.partner ?? "",
    inventory: (raw.inventory ?? []).map((item) => {
      const ref = INVENTORY.find((i) => i.id === item.id);
      return ref ? { ...ref, uses: item.uses ?? ref.uses } : item;
    }),
  };
}

export function localGm(
  tale: Tale,
  action: {
    choiceId?: string;
    text: string;
    roll?: { total: number; dc: number; success: boolean; label: string };
    notes?: string[];
  },
): GmResult {
  const key = action.choiceId ? `${tale.sceneId}:${action.choiceId}` : "";
  if (key && BOOK[key]) return BOOK[key];

  const scene = getScene(tale.campaignId, tale.sceneId);
  const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
  const spot = findSpot(tale, action.text) ?? scene?.hotspots.find((h) => h.id === tale.positions[actor.id]);

  if (!scene || !spot) {
    return beat(`${actor.name} espera. La taula és en silenci.`, choicesFor(tale.sceneId));
  }

  if (action.roll || action.notes?.length) {
    const facts = (action.notes ?? []).join(" ");
    const win = action.roll?.success ?? true;
    const lead = win
      ? `Compta. ${spot.examine}`
      : `Es resisteix, i els altres aturen l'entrebanc abans que sigui una ferida. ${spot.examine}`;
    return beat(`${lead}\n\n${facts}`.trim(), choicesFor(tale.sceneId).slice(0, 4), { moveTo: spot.id });
  }

  if (action.choiceId === "open-chronicle") {
    return beat(tale.narration, [endChoice]);
  }

  return beat(
    `${actor.name} s'hi posa de debò. ${action.text.trim()} ${scene.ambient} ${spot.examine}`,
    choicesFor(tale.sceneId).slice(0, 3),
    { moveTo: spot.id },
  );
}

function recap(tale: Tale, result: GmResult, chronicleBody?: string): string {
  if (result.summary) return result.summary.slice(0, 600);
  const line = chronicleBody ?? result.narration.split("\n\n")[0];
  return `${tale.summary} ${line}`.trim().slice(-600);
}

export function applyTale(tale: Tale, playerLine: string, result: GmResult, mech?: Mechanics): Tale {
  const campaign = getCampaign(tale.campaignId);
  if (!campaign) return tale;
  let scene = getScene(tale.campaignId, tale.sceneId) ?? campaign.scenes[0];
  let sceneId = tale.sceneId;
  let chapter = tale.chapter;
  let positions = { ...tale.positions };
  const day = result.day ?? tale.day;
  let activeId = mech?.activeId ?? tale.activeId;
  let gained = mech?.xp ?? 0;

  const next = result.nextSceneId ? getScene(tale.campaignId, result.nextSceneId) : undefined;
  const travelled = Boolean(next && next.id !== scene.id);
  if (next && travelled) {
    scene = next;
    sceneId = next.id;
    chapter += 1;
    gained += 40;
    positions = {};
    tale.party.forEach((p, i) => {
      positions[p.id] = next.hotspots[i % next.hotspots.length].id;
    });
  } else if (result.moveTo && scene.hotspots.some((h) => h.id === result.moveTo)) {
    positions[tale.activeId] = result.moveTo;
  }

  // The rules own hearts whenever they spoke; otherwise the storyteller may nudge them a little.
  const deltas = mech
    ? mech.heartDelta
    : (result.heartDelta ?? []).map((h) => ({ id: h.id, delta: Math.max(-2, Math.min(2, h.delta)) }));
  let party = tale.party.map((c) => {
    const delta = deltas.filter((h) => h.id === c.id).reduce((n, h) => n + h.delta, 0);
    const heart = Math.max(1, Math.min(c.heartMax, c.heart + delta));
    return heart === c.heart ? c : { ...c, heart };
  });

  const finished = tale.finished || Boolean(result.endTale) || result.choices.every((c) => c.id === "open-chronicle");
  if (finished && !tale.finished) gained += 60;

  const grown = xpAfter(tale, gained);
  if (grown.leveled && grown.level <= MAX_LEVEL) {
    const steps = grown.level - tale.level;
    party = party.map((c) => ({ ...c, heartMax: c.heartMax + 3 * steps, heart: c.heart + 3 * steps }));
  }

  const chronicle = [...tale.chronicle];
  if (result.chronicleTitle && result.chronicleBody) {
    chronicle.push({
      id: uid(),
      day,
      title: result.chronicleTitle,
      body: result.chronicleBody,
      sceneName: scene.name,
      campaignName: campaign.name,
      image: scene.image,
    });
  }

  const quest =
    result.questTitle && result.questDetail
      ? { title: result.questTitle, detail: result.questDetail }
      : tale.quest;

  const log = tale.log.slice(-10);
  log.push({ role: "you", text: playerLine }, { role: "gm", text: result.narration });

  let encounter = mech && "encounter" in mech ? (mech.encounter ?? null) : tale.encounter;
  if (travelled) encounter = null;
  if (!party.some((p) => p.id === activeId)) activeId = party[0].id;

  let inventory = tale.inventory;
  if (mech?.consume) {
    inventory = inventory
      .map((i) => (i.id === mech.consume ? { ...i, uses: (i.uses ?? 1) - 1 } : i))
      .filter((i) => i.uses === undefined || i.uses > 0);
  }

  let edge = tale.edge;
  if (mech?.edge) edge = mech.edge;
  else if (mech?.notes.some((n) => n.includes(" tira "))) edge = null;

  return {
    ...tale,
    sceneId,
    chapter,
    day,
    daypart: result.daypart || (next ? next.daypart : tale.daypart),
    clock: result.clock || (next ? next.clock : tale.clock),
    weather: result.weather || (next ? next.weather : tale.weather),
    sky: result.sky || (next ? next.sky : tale.sky),
    activeId,
    party,
    positions,
    quest,
    chronicle,
    inventory,
    narration: result.narration,
    choices: result.choices.slice(0, 4),
    log,
    level: grown.level,
    xp: grown.xp,
    summary: recap(tale, result, result.chronicleBody),
    finished,
    encounter,
    pendingRoll: finished ? null : (result.rollRequest ?? null),
    edge,
    rests: mech?.rest ? Math.max(0, tale.rests - 1) : tale.rests,
    beat: tale.beat + 1,
    updatedAt: Date.now(),
  };
}

export function encodeTale(tale: Tale): string {
  const bytes = new TextEncoder().encode(JSON.stringify(tale));
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeTale(code: string): Tale | null {
  try {
    const pad = code.trim().replaceAll("-", "+").replaceAll("_", "/");
    const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const tale = JSON.parse(new TextDecoder().decode(bytes)) as Tale;
    if (!getCampaign(tale.campaignId) || !getScene(tale.campaignId, tale.sceneId)) return null;
    if (!tale.narration || !Array.isArray(tale.party) || tale.party.length < 1) return null;
    return normalizeTale({ ...tale, id: uid(), updatedAt: Date.now() });
  } catch {
    return null;
  }
}
