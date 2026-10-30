import { getCampaign, getScene, INVENTORY } from "@/lib/game/content";
import {
  ABILITY_NAMES,
  abilityMod,
  describeRoll,
  die,
  heroOf,
  itemMechanics,
  restMechanics,
  rollDice,
} from "@/lib/game/rules";
import type {
  Check,
  DiceShow,
  Fight,
  FoeState,
  GmResult,
  Hotspot,
  Item,
  Mechanics,
  RollRequest,
  Scene,
  Tale,
} from "@/lib/game/types";

/** Paragraphs that start with this are rules text: shown small, never read aloud. */
const RULES = "▸";

export type Turn = { result: GmResult; mech: Mechanics };

// ───────────────────────── text helpers ─────────────────────────

export function norm(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9·\s|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return norm(text).split(" ").filter(Boolean);
}

function art(name: string, capital = false): string {
  const table: Record<string, string> = { Calder: "en Calder", Holt: "en Holt", Bramble: "la Bramble", Vesper: "la Vesper" };
  const out = table[name] ?? name;
  return capital ? out.charAt(0).toUpperCase() + out.slice(1) : out;
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** "a" is a flag, "a|b" is either, "a&b" is both ("a&b|c" is both, or c). */
function has(tale: Tale, flag: string): boolean {
  return flag.split("|").some((alt) => alt.split("&").every((f) => tale.flags.includes(f)));
}

/** A person or thing that cannot be tried yet, and why. */
function lockedHint(tale: Tale, spot: Hotspot): string | null {
  if (spot.kind === "exit" || spot.kind === "item") return null;
  if (spot.requires && !has(tale, spot.requires.flag)) return spot.requires.hint;
  return null;
}

function sceneOf(tale: Tale): Scene | undefined {
  return getScene(tale.campaignId, tale.sceneId);
}

export function isModule(tale: Tale): boolean {
  return getCampaign(tale.campaignId)?.kind === "module";
}

/** What is actually in the room right now: no beaten foes, no things already picked up. */
export function visibleSpots(tale: Tale): Hotspot[] {
  const scene = sceneOf(tale);
  if (!scene) return [];
  return scene.hotspots.filter((h) => {
    if (h.kind === "foe" && has(tale, `dead-${h.id}`)) return false;
    if (h.kind === "item" && has(tale, `taken-${h.id}`)) return false;
    return true;
  });
}

function matchSpot(tale: Tale, text: string, kinds?: Hotspot["kind"][]): Hotspot | undefined {
  const toks = tokens(text);
  const joined = ` ${toks.join(" ")} `;
  let best: { spot: Hotspot; score: number } | undefined;
  for (const spot of visibleSpots(tale)) {
    if (kinds && !(spot.kind && kinds.includes(spot.kind))) continue;
    let score = 0;
    const name = norm(spot.name).replace(/^(el|la|els|les|l|en)\s+/, "");
    if (name && joined.includes(` ${name} `)) score += 5;
    for (const kw of spot.keywords ?? []) {
      const k = norm(kw);
      if (!k) continue;
      if (toks.some((w) => w === k || (k.length >= 4 && w.length >= 4 && (w.startsWith(k) || k.startsWith(w))) || (k.length >= 4 && k.length < 6 && w.startsWith(k)))) score += 3;
    }
    if (score > 0 && (!best || score > best.score)) best = { spot, score };
  }
  return best?.spot;
}

// ───────────────────────── intent ─────────────────────────

const VERBS = {
  help: /\b(que puc fer|ajuda|ajudam|help|pistes?|no se que fer|opcions)\b/,
  rest: /\b(descans\w*|dormim|dormir|acamp\w*)\b/,
  use: /\b(fes servir|fem servir|faig servir|usa|usem|uso|menja\w*|beu|bec)\b/,
  attack: /\b(atac\w*|colpej\w*|lluit\w*|dispar\w*|apunyal\w*|mato|mata|matem|combat\w*|carrega\w*|clavo|clavem)\b/,
  take: /\b(agaf\w*|recull\w*|pren\w*|llev\w*|robo|robem)\b/,
  talk: /\b(parl\w*|pug\w*|aixec\w*|salv\w*|rescat\w*|promet\w*|jur\w*|acompany\w*|dic|diem|dona\w*|dono|doni|pag\w*|lliur\w*|entreg\w*|ofer\w*|recit\w*|digu\w*|pregunt\w*|saluda\w*|xerr\w*|demana\w*|convenc\w*|negoci\w*|enganya\w*|persuad\w*|amenac\w*|intimid\w*|suborn\w*|raon\w*|explic\w*)\b/,
  go: /\b(ves|vaig|vagi|anem|anar|entr\w*|surt\w*|sort\w*|camin\w*|puj\w*|baix\w*|segu\w*|torn\w*|avanc\w*|endavant|marxem|marxo)\b/,
  force: /\b(repar\w*|adob\w*|mend\w*|enganx\w*|senyal\w*|ences\w*|encen\w*|present\w*|salud\w*|tap\w*|calm\w*|prov\w*|intent\w*|netej\w*|frego\w*|fregu\w*|toc\w*|vad\w*|nad\w*|obr\w*|forc\w*|trenc\w*|empeny\w*|pic\w*|ganx\w*|moc|movem|sigil\w*|amag\w*|colo|colem|esquiv\w*|salt\w*|escal\w*|pas|passo|passem|passar|rodej\w*|sortej\w*)\b/,
  look: /\b(lleg\w*|mir\w*|examin\w*|observ\w*|inspeccion\w*|busc\w*|escorcoll\w*|regir\w*|escolt\w*|olor\w*|comprov\w*|ull|fixo|fixem)\b/,
};

type Intent = keyof typeof VERBS;

function intentOf(text: string): Intent | null {
  const t = norm(text);
  for (const key of ["help", "rest", "use", "attack", "take", "talk", "go", "force", "look"] as Intent[]) {
    if (VERBS[key].test(t)) return key;
  }
  return null;
}

// ───────────────────────── dice & fights ─────────────────────────

function tip(tale: Tale, flag: string, text: string, mech: Mechanics): string {
  if (has(tale, flag)) return "";
  mech.flags = [...(mech.flags ?? []), flag];
  return `Consell del DM: ${text}`;
}

function narrate(spoken: string[], rules: string[] = []): string {
  const body = spoken.filter(Boolean).join("\n\n");
  const rule = rules.length ? `${RULES} ${rules.join(" ")}` : "";
  return [body, rule].filter(Boolean).join("\n\n");
}

function foeSet(tale: Tale, scene: Scene): FoeState[] {
  const out: FoeState[] = [];
  for (const spot of scene.hotspots) {
    if (spot.kind !== "foe" || !spot.foe || has(tale, `dead-${spot.id}`)) continue;
    const n = spot.foe.count ?? 1;
    for (let i = 0; i < n; i += 1) {
      out.push({
        id: `${spot.id}#${i}`,
        spotId: spot.id,
        name: spot.foe.name,
        the: spot.foe.the ?? `el ${spot.foe.name.toLowerCase()}`,
        hp: spot.foe.hp,
        hpMax: spot.foe.hp,
        ac: spot.foe.ac,
        atk: spot.foe.atk,
        dmg: spot.foe.dmg,
        xp: spot.foe.xp,
      });
    }
  }
  return out;
}

type Sim = {
  tale: Tale;
  fight: Fight;
  hp: Record<string, number>;
  patch: Record<string, { down?: boolean; saves?: { ok: number; fail: number }; fallen?: boolean }>;
  spoken: string[];
  rules: string[];
  xp: number;
  flags: string[];
};

function heroDown(sim: Sim, id: string): boolean {
  const hero = sim.tale.party.find((p) => p.id === id);
  if (!hero || hero.fallen || sim.patch[id]?.fallen) return true;
  return sim.hp[id] <= 0;
}

function heroStable(sim: Sim, id: string): boolean {
  const saves = sim.patch[id]?.saves ?? sim.tale.party.find((p) => p.id === id)?.saves;
  return Boolean(saves && saves.ok >= 3);
}

function liveHeroes(sim: Sim): string[] {
  return sim.tale.party.filter((p) => !heroDown(sim, p.id)).map((p) => p.id);
}

function liveFoes(sim: Sim): FoeState[] {
  return sim.fight.foes.filter((f) => f.hp > 0);
}

function nameOf(sim: Sim, id: string): string {
  return sim.tale.party.find((p) => p.id === id)?.name ?? id;
}

function dropHero(sim: Sim, id: string) {
  sim.hp[id] = 0;
  sim.patch[id] = { ...sim.patch[id], down: true, saves: { ok: 0, fail: 0 } };
  sim.spoken.push(`${art(nameOf(sim, id), true)} cau a terra, sense coneixement.`);
}

function deathSave(sim: Sim, id: string) {
  const cur = sim.patch[id]?.saves ?? sim.tale.party.find((p) => p.id === id)?.saves ?? { ok: 0, fail: 0 };
  const saves = { ...cur };
  const roll = die(20);
  const name = nameOf(sim, id);
  if (roll === 20) {
    sim.hp[id] = 1;
    sim.patch[id] = { down: false, saves: { ok: 0, fail: 0 } };
    sim.spoken.push(`${art(name, true)} obre els ulls i es posa dret amb l'últim alè.`);
    sim.rules.push(`Salvació contra la mort de ${name}: 20 natural, es posa dret amb 1 cor.`);
    return;
  }
  if (roll >= 10) saves.ok += 1;
  else saves.fail += roll === 1 ? 2 : 1;
  sim.rules.push(`Salvació contra la mort de ${name}: ${roll} (${saves.ok} èxits, ${saves.fail} fracassos).`);
  if (saves.fail >= 3) {
    if (sim.tale.hardcore) {
      sim.patch[id] = { ...sim.patch[id], saves, fallen: true, down: true };
      sim.spoken.push(`${art(name, true)} no s'aixeca. La companyia l'haurà de plorar.`);
      return;
    }
    saves.fail = 0;
    saves.ok = 3;
    sim.spoken.push(`Els companys arriben a temps i estabilitzen ${art(name)}.`);
  } else if (saves.ok >= 3) {
    sim.spoken.push(`${art(name, true)} s'estabilitza: respira, tot i que no es pot moure.`);
  }
  sim.patch[id] = { ...sim.patch[id], saves, down: true };
}

function foeStrikes(sim: Sim, foe: FoeState) {
  const awake = liveHeroes(sim);
  const pool = awake.length ? awake : sim.tale.party.filter((p) => !p.fallen && !sim.patch[p.id]?.fallen).map((p) => p.id);
  if (!pool.length) return;
  const target = pick(pool);
  const hero = sim.tale.party.find((p) => p.id === target)!;
  const roll = die(20);
  const total = roll + foe.atk;
  const hit = roll === 20 || (roll !== 1 && total >= hero.guard);
  const name = hero.name;
  if (!hit) {
    sim.spoken.push(`${foe.the.charAt(0).toUpperCase() + foe.the.slice(1)} s'abraona sobre ${art(name)}, però falla.`);
    sim.rules.push(`${foe.name} ataca ${name}: ${roll}+${foe.atk} = ${total} contra defensa ${hero.guard}. Falla.`);
    return;
  }
  const dmg = rollDice(foe.dmg, roll === 20);
  sim.rules.push(`${foe.name} ataca ${name}: ${roll}+${foe.atk} = ${total} contra defensa ${hero.guard}. Encerta: ${dmg.total} de dany.`);
  if (sim.hp[target] <= 0) {
    // Hitting someone who is already down costs a failed save.
    const cur = sim.patch[target]?.saves ?? hero.saves ?? { ok: 0, fail: 0 };
    const saves = { ok: cur.ok, fail: cur.fail + (roll === 20 ? 2 : 1) };
    sim.patch[target] = { ...sim.patch[target], saves, down: true };
    sim.spoken.push(`${foe.the.charAt(0).toUpperCase() + foe.the.slice(1)} colpeja ${art(name)} mentre és a terra.`);
    if (saves.fail >= 3 && sim.tale.hardcore) sim.patch[target] = { ...sim.patch[target], fallen: true };
    return;
  }
  sim.hp[target] = Math.max(0, sim.hp[target] - dmg.total);
  sim.spoken.push(`${foe.the.charAt(0).toUpperCase() + foe.the.slice(1)} ${pick(["mossega", "colpeja", "esgarrapa"])} ${art(name)}.`);
  if (sim.hp[target] === 0) dropHero(sim, target);
}

/** Run turns until it is a standing hero's turn, the foes are gone, or the company is down. */
function advance(sim: Sim): "hero" | "won" | "lost" {
  const { fight } = sim;
  for (let guard = 0; guard < fight.order.length * 3 + 6; guard += 1) {
    if (!liveFoes(sim).length) return "won";
    if (!liveHeroes(sim).length && sim.tale.party.every((p) => heroStable(sim, p.id) || p.fallen || sim.patch[p.id]?.fallen)) return "lost";
    const id = fight.order[fight.turn];
    const foe = fight.foes.find((f) => f.id === id);
    if (foe) {
      if (foe.hp > 0) foeStrikes(sim, foe);
    } else if (sim.tale.party.some((p) => p.id === id)) {
      if (!heroDown(sim, id)) return "hero";
      if (!heroStable(sim, id) && !sim.patch[id]?.fallen && !sim.tale.party.find((p) => p.id === id)?.fallen) deathSave(sim, id);
    }
    fight.turn += 1;
    if (fight.turn >= fight.order.length) {
      fight.turn = 0;
      fight.round += 1;
    }
  }
  return liveHeroes(sim).length ? "hero" : "lost";
}

function sim(tale: Tale, fight: Fight): Sim {
  return {
    tale,
    fight: { ...fight, foes: fight.foes.map((f) => ({ ...f })), order: [...fight.order] },
    hp: Object.fromEntries(tale.party.map((p) => [p.id, p.heart])),
    patch: {},
    spoken: [],
    rules: [],
    xp: 0,
    flags: [],
  };
}

function finish(s: Sim, outcome: "hero" | "won" | "lost", mech: Mechanics, result: GmResult) {
  const { tale } = s;
  const deltas = tale.party
    .map((p) => ({ id: p.id, delta: s.hp[p.id] - p.heart }))
    .filter((d) => d.delta !== 0);
  mech.heartDelta = deltas;
  mech.xp += s.xp;
  mech.flags = [...(mech.flags ?? []), ...s.flags];
  const patch = { ...s.patch };
  if (outcome === "won") {
    mech.fight = null;
    for (const p of tale.party) {
      if (s.hp[p.id] <= 0 && !p.fallen && !patch[p.id]?.fallen) {
        s.hp[p.id] = 1;
        mech.heartDelta = mech.heartDelta.filter((d) => d.id !== p.id);
        mech.heartDelta.push({ id: p.id, delta: 1 - p.heart });
        patch[p.id] = { down: false, saves: { ok: 0, fail: 0 } };
      }
    }
  } else if (outcome === "lost") {
    mech.fight = null;
    mech.routed = true;
    s.spoken.push("Tot es torna fosc. Més tard, algú us arrossega fora de la cova i us desperteu a la plaça de Pinassa, adolorits però vius.");
  } else {
    mech.fight = s.fight;
    const next = s.fight.order[s.fight.turn];
    if (tale.party.some((p) => p.id === next)) mech.activeId = next;
  }
  mech.heroPatch = patch;
  result.narration = narrate(s.spoken, s.rules);
}

function attackRequest(tale: Tale, fight: Fight, heroId: string, targetId?: string): RollRequest | undefined {
  const hero = tale.party.find((p) => p.id === heroId);
  const foe = fight.foes.find((f) => f.id === targetId && f.hp > 0) ?? fight.foes.find((f) => f.hp > 0);
  if (!hero || !foe) return undefined;
  return {
    heroId: hero.id,
    ability: hero.weapon.ability,
    dc: foe.ac,
    reason: `Ataca ${foe.the} amb ${hero.weapon.name.toLowerCase()}`,
    kind: "attack",
    target: foe.id,
    line: `${hero.name} ataca ${foe.the}.`,
  };
}

function beginFight(tale: Tale, scene: Scene, lead: string[], mech: Mechanics): GmResult {
  const foes = foeSet(tale, scene);
  const inits = tale.party
    .filter((p) => p.heart > 0 && !p.fallen)
    .map((p) => ({ id: p.id, name: p.name, score: die(20) + abilityMod(p.abilities.dex) }));
  const enemies = foes.map((f) => ({ id: f.id, name: f.name, score: die(20) + 1 }));
  const order = [...inits, ...enemies].sort((a, b) => b.score - a.score);
  const fight: Fight = { foes, order: order.map((o) => o.id), turn: 0, round: 1 };
  const s = sim(tale, fight);
  s.spoken.push(...lead);
  s.rules.push(`Iniciativa: ${order.map((o) => `${o.name} ${o.score}`).join(", ")}.`);
  const t = tip(
    tale,
    "tip-fight",
    "ha començat un combat. Tothom tira iniciativa (un d20) per saber qui juga primer. Al teu torn, ataca: tires un d20 contra la defensa del monstre. Si hi arribes, el copeges i tires el dau de dany.",
    mech,
  );
  if (t) s.spoken.push(t);
  const outcome = advance(s);
  const result: GmResult = { narration: "", choices: [] };
  finish(s, outcome, mech, result);
  if (outcome === "hero") {
    const heroId = s.fight.order[s.fight.turn];
    result.rollRequest = attackRequest(tale, s.fight, heroId);
  }
  return result;
}

// ───────────────────────── actions ─────────────────────────

function askRoll(tale: Tale, spot: Hotspot, check: Check, text: string, lead: string, mech: Mechanics): Turn {
  const hero = heroOf(tale);
  let { ability, dc, reason } = check;
  const t = norm(text);
  for (const alt of check.alts ?? []) {
    if (alt.keywords.some((k) => t.includes(norm(k)))) {
      ability = alt.ability;
      dc = alt.dc;
      reason = alt.reason;
      break;
    }
  }
  const lines = [lead];
  const adv = tip(
    tale,
    "tip-roll",
    "quan el que intentes pot sortir bé o malament, es fa una tirada. Tires un d20 i hi sumes el teu bonus. Si arribes a la dificultat, ho aconsegueixes. Un 20 sempre reïx i un 1 sempre falla. Pots tirar tu o fer servir un dau de veritat de la taula.",
    mech,
  );
  if (adv) lines.push(adv);
  return {
    mech,
    result: {
      narration: narrate(lines, [`Cal una tirada de ${ABILITY_NAMES[ability]}, dificultat ${dc}.`]),
      choices: [],
      rollRequest: { heroId: hero.id, ability, dc, reason, kind: "check", target: spot.id, line: text },
    },
  };
}

function plain(narration: string, mech: Mechanics, extra: Partial<GmResult> = {}): Turn {
  return { mech, result: { narration, choices: [], ...extra } };
}

function emptyMech(): Mechanics {
  return { heartDelta: [], xp: 0, notes: [] };
}

function describeRoom(tale: Tale): string {
  const scene = sceneOf(tale);
  if (!scene) return "";
  const spots = visibleSpots(tale);
  const people = spots.filter((h) => h.kind === "npc" || h.kind === "foe").map((h) => h.name.toLowerCase());
  const things = spots.filter((h) => h.kind === "feature" || h.kind === "item").map((h) => h.name.toLowerCase());
  const exits = spots.filter((h) => h.kind === "exit").map((h) => h.name.toLowerCase());
  const parts = [scene.ambient];
  if (people.length) parts.push(`Hi veus: ${people.join(", ")}.`);
  if (things.length) parts.push(`També: ${things.join(", ")}.`);
  if (exits.length) parts.push(`Sortides: ${exits.join(", ")}.`);
  return parts.join(" ");
}

function helpText(tale: Tale): string {
  const scene = sceneOf(tale);
  const campaign = getCampaign(tale.campaignId);
  if (!scene) return "";
  const spots = visibleSpots(tale);
  const ideas: string[] = [];
  for (const h of spots) {
    const n = h.name.toLowerCase();
    if (h.kind === "npc") ideas.push(`parlar amb ${n}`);
    else if (h.kind === "foe") ideas.push(h.check ? `mirar si es pot passar ${n} sense lluitar, parlar-hi o atacar-lo` : `atacar ${n}`);
    else if (h.kind === "item") ideas.push(`agafar ${n}`);
    else if (h.kind === "feature") ideas.push(`mirar ${n}`);
    else if (h.kind === "exit") ideas.push(`anar a ${n}`);
  }
  const goal = campaign?.mission ? `Missió: ${campaign.mission} ` : "";
  return `${goal}Prova a dir coses com: ${ideas.slice(0, 6).join("; ")}. També pots dir «descansem» o «faig servir» un objecte.`;
}

function travel(tale: Tale, spot: Hotspot, mech: Mechanics): Turn {
  const dest = spot.to ? getScene(tale.campaignId, spot.to) : undefined;
  if (!dest) return plain("No sé per on anar.", mech);
  const visited = has(tale, `visited-${dest.id}`);
  mech.flags = [...(mech.flags ?? []), `visited-${dest.id}`];
  const lines = [visited ? (dest.back ?? `Tornes a ${dest.name}. ${dest.ambient}`) : dest.opening];
  const result: GmResult = {
    narration: "",
    choices: [],
    nextSceneId: dest.id,
    daypart: dest.daypart,
    clock: dest.clock,
    weather: dest.weather,
    sky: dest.sky,
    questTitle: dest.quest.title,
    questDetail: dest.quest.detail,
    chronicleTitle: visited ? undefined : dest.chronicleTitle,
    chronicleBody: visited ? undefined : dest.opening.split("\n\n")[0],
  };
  const arrival: Tale = { ...tale, sceneId: dest.id };
  const ambush = dest.hotspots.some((h) => h.kind === "foe" && h.foe?.ambush && !has(tale, `dead-${h.id}`));
  if (dest.id === "placa" && has(tale, "cofre")) {
    result.narration = narrate(["Tornes a la plaça de Pinassa amb el cofre sota el braç. La fornera ja t'ha vist des de lluny."]);
    result.questTitle = "Torna el cofre";
    result.questDetail = "Parla amb la fornera.";
    return { mech, result };
  }
  if (dest.id === "pas" && has(tale, "nom-trobat")) {
    result.narration = narrate(["Tornes a Aiguaquieta amb el nom a la boca. Els bols de l'hostal s'han quedat quiets, per una vegada. A la riba, entre els joncs, l'home de gris et mira venir."]);
    result.questTitle = "Torna el nom";
    result.questDetail = "Parla amb en Teodor, el picapedrer, i amb l'home de gris.";
    return { mech, result };
  }
  if (ambush) {
    const intro = lines[0].split("\n\n");
    const fightResult = beginFight(arrival, dest, [intro[0], ...intro.slice(1).filter((p) => !p.startsWith("Consell"))], mech);
    return { mech, result: { ...result, narration: fightResult.narration, rollRequest: fightResult.rollRequest } };
  }
  result.narration = narrate(lines);
  return { mech, result };
}

// ───────────────────────── entry points ─────────────────────────

/** Read what the table said and play it out. `null` means the DM did not understand. */
export function dmAct(tale: Tale, raw: string): Turn | null {
  const scene = sceneOf(tale);
  if (!scene || !isModule(tale)) return null;
  const text = raw.replace(/^[^:]{1,20}:\s*/, "");
  const intent = intentOf(text);
  const mech = emptyMech();
  const hero = heroOf(tale);
  const t = norm(text);

  if (tale.fight) {
    // Mid-fight the only real moves are attacking, using an item, or asking for help.
    if (intent === "help") return plain(helpText(tale), mech);
    if (intent !== "use") {
      if (intent !== "attack" && intent !== null) return plain("Estàs en plena batalla! Ataca, o fes servir un objecte.", mech);
      const turnId = tale.fight.order[tale.fight.turn];
      const actor = tale.party.find((p) => p.id === turnId);
      const foe = matchSpot(tale, text, ["foe"]);
      const targetFoe = tale.fight.foes.find((f) => f.spotId === foe?.id && f.hp > 0);
      if (!actor) return plain("Ara no és el teu torn.", mech);
      const req = attackRequest(tale, tale.fight, actor.id, targetFoe?.id);
      if (!req) return plain("No queda ningú a qui atacar.", mech);
      return plain(narrate([`${art(actor.name, true)} s'estreny al voltant de l'arma i s'hi llança.`]), mech, { rollRequest: req });
    }
  }

  switch (intent) {
    case "help":
      return plain(helpText(tale), mech);
    case "rest": {
      const foes = visibleSpots(tale).some((h) => h.kind === "foe");
      if (foes) return plain("No és un bon lloc per descansar: aquí encara hi ha perill.", mech);
      if (tale.rests <= 0) return plain("Ja no queda temps per descansar en aquesta aventura.", mech);
      const m = restMechanics(tale);
      return plain(narrate(["La companyia fa una estona de silenci, menja una mica i recupera forces."], m.notes), m);
    }
    case "use": {
      const item = tale.inventory.find((i) => t.includes(norm(i.name).split(" ")[0]) || tokens(i.name).some((w) => w.length > 4 && t.includes(w)));
      if (!item) return plain("No sé què vols fer servir. Mira la motxilla.", mech);
      const m = itemMechanics(tale, item, hero);
      if (!m) return plain(`${art(hero.name, true)} mira ${item.name.toLowerCase()}, però ara no li serveix de res.`, mech);
      return plain(narrate([`${art(hero.name, true)} fa servir ${item.name.toLowerCase()}.`], m.notes), m);
    }
    case "attack": {
      const foeSpot = matchSpot(tale, text, ["foe"]) ?? visibleSpots(tale).find((h) => h.kind === "foe");
      if (!foeSpot) return plain("No hi ha ningú a qui atacar. Ben aviat, potser.", mech);
      if (tale.fight) {
        const turnId = tale.fight.order[tale.fight.turn];
        const actor = tale.party.find((p) => p.id === turnId) ?? hero;
        const targetFoe = tale.fight.foes.find((f) => f.spotId === foeSpot.id && f.hp > 0);
        const req = attackRequest(tale, tale.fight, actor.id, targetFoe?.id);
        if (!req) return plain("No queda ningú a qui atacar.", mech);
        return plain(narrate([`${art(actor.name, true)} s'hi llança.`]), mech, { rollRequest: req });
      }
      const result = beginFight(tale, scene, [`${art(hero.name, true)} treu l'arma i es llança sobre ${foeSpot.foe?.the ?? foeSpot.name.toLowerCase()}!`], mech);
      return { mech, result };
    }
    case "take": {
      const spot = matchSpot(tale, text, ["item"]);
      if (!spot || !spot.itemId) return plain("No hi ha res d'això per agafar aquí.", mech);
      if (spot.requires && !has(tale, spot.requires.flag)) return plain(spot.requires.hint, mech);
      const campaign = getCampaign(tale.campaignId);
      const item: Item | undefined = campaign?.items?.find((i) => i.id === spot.itemId) ?? INVENTORY.find((i) => i.id === spot.itemId);
      if (!item) return plain("No ho pots agafar.", mech);
      if (!item.effect && tale.inventory.some((i) => i.id === item.id)) return plain(`Ja tens ${item.name.toLowerCase()}.`, mech);
      mech.flags = [`taken-${spot.id}`, ...(spot.flag ? [spot.flag] : [])];
      mech.give = item;
      mech.xp = spot.itemId === "cofre" ? 30 : 0;
      const extra: Partial<GmResult> =
        spot.itemId === "cofre"
          ? { questTitle: "Torna el cofre", questDetail: "Surt de la cova i porta el cofre a la fornera.", chronicleTitle: "El cofre recuperat", chronicleBody: "La companyia té el cofre de la fornera a les mans." }
          : {};
      return plain(narrate([spot.itemId === "cofre" ? "Aixeques el cofre. Pesa més del que sembla. Ara només cal sortir d'aquí amb ell." : `Agafes ${item.name.toLowerCase()}.`]), mech, extra);
    }
    case "talk":
    case "force":
    case "look":
    case "go":
    default:
      break;
  }

  if (intent === "talk") {
    const spot =
      matchSpot(tale, text, ["npc", "foe"]) ??
      visibleSpots(tale).find((h) => h.kind === "npc") ??
      visibleSpots(tale).find((h) => h.kind === "foe" && h.talk);
    if (!spot) return plain("No hi ha ningú aquí amb qui parlar.", mech);
    const persuade = /(convenc|negoci|enganya|persuad|amenac|intimid|suborn|raon)/.test(t);
    if (spot.check && persuade) {
      const locked = lockedHint(tale, spot);
      if (locked) return plain(narrate([spot.examine, locked]), mech);
      if (spot.check.flag && has(tale, spot.check.flag)) return plain("Ja ho heu resolt: no cal insistir.", mech);
      return askRoll(tale, spot, spot.check, raw, `${art(hero.name, true)} s'hi acosta i tria bé les paraules.`, mech);
    }
    const topics = (spot.talk ?? []).filter((tp) => !tp.requires || has(tale, tp.requires));
    const ender = topics.find((tp) => tp.ends);
    const hit = ender ?? topics.find((tp) => tp.keywords.some((k) => t.includes(norm(k))));
    if (hit) {
      mech.xp = hit.xp ?? 0;
      mech.flags = hit.flag ? hit.flag.split(",") : [];
      if (hit.ends) {
        const campaign = getCampaign(tale.campaignId);
        return plain(narrate([hit.say]), mech, {
          endTale: true,
          questTitle: "Missió complerta",
          questDetail: campaign?.mission ?? "",
          chronicleTitle: `El final de ${campaign?.name ?? "l'aventura"}`,
          chronicleBody: hit.say.split("\n\n")[0].slice(0, 280),
        });
      }
      return plain(narrate([hit.say]), mech);
    }
    if (spot.check) {
      return plain(narrate([spot.examine, "Podries provar de convèncer-lo, amenaçar-lo o buscar una altra sortida."]), mech);
    }
    return plain(narrate([spot.examine, topics.length ? "Li podries preguntar pel cofre, per la cova o per la recompensa." : ""]), mech);
  }

  if (intent === "go") {
    const exits = visibleSpots(tale).filter((h) => h.kind === "exit");
    const named = matchSpot(tale, text);
    const spot =
      matchSpot(tale, text, ["exit"]) ?? (named ? undefined : exits.length === 1 ? exits[0] : undefined);
    if (!spot) {
      const other = named;
      const lockedOther = other ? lockedHint(tale, other) : null;
      if (other && lockedOther) return plain(narrate([other.examine, lockedOther]), mech);
      if (other?.check && !(other.check.flag && has(tale, other.check.flag))) {
        return askRoll(tale, other, other.check, raw, other.examine, mech);
      }
      if (other) return plain(narrate([other.examine]), mech);
      return plain(`Cap on? Les sortides són: ${exits.map((e) => e.name.toLowerCase()).join(", ")}.`, mech);
    }
    if (spot.requires && !has(tale, spot.requires.flag)) return plain(spot.requires.hint, mech);
    if (spot.check && !(spot.check.flag && has(tale, spot.check.flag))) {
      return askRoll(tale, spot, spot.check, raw, spot.examine, mech);
    }
    return travel(tale, spot, mech);
  }

  if (intent === "force" || intent === "look") {
    // Something you can try beats a loose object that merely shares a word with the sentence.
    const spot = matchSpot(tale, text, ["feature", "npc", "foe", "exit"]) ?? matchSpot(tale, text);
    if (!spot) {
      if (intent === "look") return plain(describeRoom(tale), mech);
      return plain("No sé què vols fer exactament. Digues-m'ho amb més detall.", mech);
    }
    const locked = lockedHint(tale, spot);
    if (locked) return plain(narrate([spot.examine, locked]), mech);
    if (spot.check && !(spot.check.flag && has(tale, spot.check.flag))) {
      return askRoll(tale, spot, spot.check, raw, spot.examine, mech);
    }
    if (spot.kind === "exit" && intent === "force" && !spot.requires) return travel(tale, spot, mech);
    if (spot.requires && spot.kind === "exit" && !has(tale, spot.requires.flag)) return plain(narrate([spot.examine, spot.requires.hint]), mech);
    return plain(narrate([spot.examine]), mech);
  }

  return null;
}

/** Everything the room holds, for an AI DM that has to improvise inside it. */
export function roomBrief(tale: Tale): string {
  const campaign = getCampaign(tale.campaignId);
  const scene = sceneOf(tale);
  if (!scene) return "";
  const lines = visibleSpots(tale).map((h) => {
    const kind = { npc: "PERSON", foe: "FOE", exit: "EXIT", item: "ITEM", feature: "PLACE" }[h.kind ?? "feature"];
    const need = h.requires && !has(tale, h.requires.flag) ? ` (blocked: ${h.requires.hint})` : "";
    const chk = h.check && !(h.check.flag && has(tale, h.check.flag)) ? ` (test: ${h.check.reason}, ${h.check.ability} DC ${h.check.dc})` : "";
    return `- ${kind} ${h.name}: ${h.examine}${need}${chk}`;
  });
  return `Mission: ${campaign?.mission ?? ""}\nRoom: ${scene.name}. ${scene.ambient}\n${lines.join("\n")}\nDone so far: ${tale.flags.join(", ") || "nothing"}.`;
}

/** The roll is down: say what it did. */
export function dmResolve(tale: Tale, request: RollRequest, show: DiceShow): Turn {
  const scene = sceneOf(tale);
  const mech: Mechanics = { heartDelta: [], xp: 0, notes: [describeRoll(show)] };
  if (!scene) return { mech, result: { narration: "", choices: [] } };

  if (request.kind === "attack" && tale.fight) return resolveAttack(tale, request, show, mech);

  const spot = scene.hotspots.find((h) => h.id === request.target);
  const check = spot?.check;
  if (!spot || !check) {
    return { mech, result: { narration: narrate(["El resultat queda en l'aire."], mech.notes), choices: [] } };
  }
  const rules = [describeRoll(show)];
  if (show.success) {
    mech.xp = (check.xp ?? 10) + (show.crit === "hit" ? 5 : 0);
    mech.flags = check.flag ? [check.flag] : [];
    if (check.go && spot.kind === "exit") {
      const walked = travel({ ...tale, flags: [...tale.flags, ...(mech.flags ?? [])] }, spot, mech);
      walked.result.narration = narrate([check.success, ...walked.result.narration.split("\n\n")], rules);
      return walked;
    }
    const result: GmResult = {
      narration: narrate([check.success], rules),
      choices: [],
      chronicleTitle: check.flag ? spot.name : undefined,
      chronicleBody: check.flag ? check.success.split(". ")[0] + "." : undefined,
    };
    return { mech, result };
  }
  mech.xp = 4;
  if (show.crit === "fumble") mech.heartDelta.push({ id: show.heroId, delta: -1 });
  if (check.hurt) mech.heartDelta.push({ id: show.heroId, delta: -check.hurt });
  if (check.onFail === "fight") {
    const result = beginFight({ ...tale }, scene, [check.fail], mech);
    result.narration = result.narration.replace(/^/, "");
    return { mech, result };
  }
  return { mech, result: { narration: narrate([check.fail], rules), choices: [] } };
}

function resolveAttack(tale: Tale, request: RollRequest, show: DiceShow, mech: Mechanics): Turn {
  const fight = tale.fight!;
  const s = sim(tale, fight);
  const hero = heroOf(tale, request.heroId);
  const foe = s.fight.foes.find((f) => f.id === request.target) ?? s.fight.foes.find((f) => f.hp > 0)!;
  s.rules.push(describeRoll(show));
  const t = tip(tale, "tip-damage", "has encertat! Ara es tira el dau de dany de la teva arma i es resta a la vida del monstre. Quan arriba a zero, cau.", mech);
  if (show.success) {
    const weapon = hero.weapon;
    const crit = show.crit === "hit";
    const base = rollDice(weapon.dice, crit);
    const bonus = Math.max(0, abilityMod(hero.abilities[weapon.ability]));
    const dmg = base.total + bonus;
    foe.hp = Math.max(0, foe.hp - dmg);
    s.rules.push(`Dany: ${base.text}${bonus ? `+${bonus}` : ""} = ${dmg}. ${foe.name}: ${foe.hp} de ${foe.hpMax} de vida.`);
    s.spoken.push(
      foe.hp === 0
        ? `${art(hero.name, true)} fa caure ${foe.the} amb ${weapon.name.toLowerCase()}.`
        : `${art(hero.name, true)} encerta ${foe.the} amb ${weapon.name.toLowerCase()}${crit ? ", amb un cop perfecte" : ""}.`,
    );
    if (t) s.spoken.push(t);
    if (foe.hp === 0) {
      s.xp += foe.xp;
      const left = s.fight.foes.filter((f) => f.spotId === foe.spotId && f.hp > 0);
      if (!left.length) s.flags.push(`dead-${foe.spotId}`);
    }
  } else {
    const fumble = show.crit === "fumble";
    s.spoken.push(fumble ? `${art(hero.name, true)} s'estén massa i perd l'equilibri.` : `${art(hero.name, true)} falla: ${foe.the} esquiva el cop.`);
    if (fumble && s.hp[hero.id] > 1) s.hp[hero.id] -= 1;
  }

  s.fight.turn += 1;
  if (s.fight.turn >= s.fight.order.length) {
    s.fight.turn = 0;
    s.fight.round += 1;
  }
  const outcome = advance(s);
  const result: GmResult = { narration: "", choices: [] };
  if (outcome === "won") {
    s.spoken.push("El silenci torna a la sala. El combat s'ha acabat.");
    const name = foe.spotId;
    if (name === "rates") {
      result.questTitle = "Segueix endavant";
      result.questDetail = "El passadís del fons ja és lliure.";
    }
    result.chronicleTitle = "Victòria";
    result.chronicleBody = `La companyia ha vençut a ${scene(tale)?.name ?? "la sala"}.`;
  }
  finish(s, outcome, mech, result);
  if (outcome === "hero") result.rollRequest = attackRequest(tale, s.fight, s.fight.order[s.fight.turn]);
  return { mech, result };
}

function scene(tale: Tale): Scene | undefined {
  return sceneOf(tale);
}

export { RULES as DM_RULES_MARK };
