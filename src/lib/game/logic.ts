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
    flags: [],
    fight: null,
    hardcore: false,
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
    flags: raw.flags ?? [],
    fight: raw.fight ?? null,
    hardcore: raw.hardcore ?? false,
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
    const facts = (action.notes ?? []).length ? `▸ ${(action.notes ?? []).join(" ")}` : "";
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
  const isModule = campaign.kind === "module";

  const next = result.nextSceneId ? getScene(tale.campaignId, result.nextSceneId) : undefined;
  const travelled = Boolean(next && next.id !== scene.id);
  if (next && travelled) {
    scene = next;
    sceneId = next.id;
    chapter += 1;
    if (!isModule) gained += 40;
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
    // Module tales are real D&D: a hero can fall to 0 and make death saves. Story tales never go below 1.
    const heart = Math.max(isModule ? 0 : 1, Math.min(c.heartMax, c.heart + delta));
    const patch = mech?.heroPatch?.[c.id];
    const merged = { ...c, ...patch, heart };
    if (isModule) {
      if (heart > 0 && !merged.fallen) {
        merged.down = false;
        merged.saves = undefined;
      } else if (heart === 0) {
        merged.down = true;
      }
    }
    return merged;
  });
  let routed = false;
  if (mech?.routed && isModule) {
    routed = true;
    party = party.map((c) => ({ ...c, heart: Math.max(1, Math.ceil(c.heartMax / 2)), down: false, saves: undefined }));
    sceneId = campaign.scenes[0].id;
    scene = campaign.scenes[0];
    positions = {};
    party.forEach((p, i) => {
      positions[p.id] = scene.hotspots[i % scene.hotspots.length].id;
    });
  }

  const finished =
    tale.finished ||
    Boolean(result.endTale) ||
    (result.choices.length > 0 && result.choices.every((c) => c.id === "open-chronicle"));
  if (finished && !tale.finished && !isModule) gained += 60;

  const grown = xpAfter(tale, gained);
  if (grown.leveled && grown.level <= MAX_LEVEL) {
    const steps = grown.level - tale.level;
    party = party.map((c) => ({ ...c, heartMax: c.heartMax + 3 * steps, heart: c.heart > 0 ? c.heart + 3 * steps : c.heart }));
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
  if (travelled || routed) encounter = null;
  if (!party.some((p) => p.id === activeId)) activeId = party[0].id;

  let inventory = tale.inventory;
  if (mech?.consume) {
    inventory = inventory
      .map((i) => (i.id === mech.consume ? { ...i, uses: (i.uses ?? 1) - 1 } : i))
      .filter((i) => i.uses === undefined || i.uses > 0);
  }

  if (mech?.give) {
    const given = mech.give;
    const held = inventory.find((i) => i.id === given.id);
    inventory = held
      ? inventory.map((i) => (i.id === given.id ? { ...i, uses: (i.uses ?? 0) + (given.uses ?? 2) } : i))
      : [...inventory, { ...given }];
  }

  const flags = Array.from(new Set([...tale.flags, ...(mech?.flags ?? [])]));
  const fight = routed ? null : mech && "fight" in mech ? (mech.fight ?? null) : travelled ? null : tale.fight;

  let edge = tale.edge;
  if (mech?.edge) edge = mech.edge;
  else if (mech?.notes.some((n) => n.includes(" tira "))) edge = null;

  return {
    ...tale,
    sceneId: sceneId,
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
    flags,
    fight,
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
