import type {
  Ability,
  Character,
  DiceShow,
  Encounter,
  Hotspot,
  Item,
  Mechanics,
  RollMode,
  RollRequest,
  Tale,
} from "@/lib/game/types";

export const ABILITY_NAMES: Record<Ability, string> = {
  str: "Força",
  dex: "Destresa",
  con: "Constitució",
  int: "Intel·lecte",
  wis: "Saviesa",
  cha: "Encant",
};

export const LEVEL_XP = [0, 80, 200, 360];
export const MAX_LEVEL = LEVEL_XP.length;
export const REST_CHARGES = 2;

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function profBonus(level: number): number {
  return level >= 3 ? 3 : 2;
}

export function checkMod(hero: Character, ability: Ability, level: number): number {
  return abilityMod(hero.abilities[ability]) + (hero.proficient.includes(ability) ? profBonus(level) : 0);
}

export function levelForXp(xp: number): number {
  let level = 1;
  LEVEL_XP.forEach((need, i) => {
    if (xp >= need) level = i + 1;
  });
  return level;
}

export function die(sides: number): number {
  return 1 + Math.floor(Math.random() * sides);
}

export function heroOf(tale: Tale, id?: string): Character {
  return tale.party.find((p) => p.id === id) ?? tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
}

/** Advantage when an item set an edge for this hero or a companion stands at the same place. */
export function autoMode(tale: Tale, hero: Character): { mode: RollMode; why: string } {
  if (tale.edge === hero.id) return { mode: "advantage", why: "un objecte et dóna avantatge" };
  const here = tale.positions[hero.id];
  const helper = tale.party.find((p) => p.id !== hero.id && tale.positions[p.id] === here);
  if (helper) return { mode: "advantage", why: `${helper.name} fa costat` };
  return { mode: "normal", why: "" };
}

/**
 * Roll (or accept) a d20 for a hero. `physical` is a number read off a real die at the table.
 */
export function makeCheck(
  tale: Tale,
  hero: Character,
  ability: Ability,
  dc: number,
  label: string,
  mode: RollMode,
  physical?: number,
): DiceShow {
  const mod = checkMod(hero, ability, tale.level);
  let rolls: number[];
  if (physical !== undefined) rolls = [Math.max(1, Math.min(20, Math.round(physical)))];
  else rolls = mode === "normal" ? [die(20)] : [die(20), die(20)];
  const roll = mode === "advantage" ? Math.max(...rolls) : mode === "disadvantage" ? Math.min(...rolls) : rolls[0];
  const crit = roll === 20 ? "hit" : roll === 1 ? "fumble" : null;
  const success = crit === "hit" ? true : crit === "fumble" ? false : roll + mod >= dc;
  return {
    who: hero.name,
    heroId: hero.id,
    label,
    ability,
    mode: physical !== undefined ? "normal" : mode,
    rolls,
    roll,
    mod,
    dc,
    success,
    crit,
    physical: physical !== undefined,
  };
}

export function describeRoll(show: DiceShow): string {
  const how =
    show.mode === "advantage" ? " amb avantatge" : show.mode === "disadvantage" ? " amb desavantatge" : "";
  const tag = show.crit === "hit" ? " (un 20 natural!)" : show.crit === "fumble" ? " (un 1 natural)" : "";
  return `${show.who} tira ${ABILITY_NAMES[show.ability]}${how}: ${show.roll}${show.mod >= 0 ? "+" : ""}${show.mod} = ${show.roll + show.mod} contra ${show.dc}${tag}. ${show.success ? "Èxit" : "Fracàs"}.`;
}

type Intent = { ability: Ability; dc: number; reason: string; re: RegExp };

// English first, then the Catalan and Spanish stems the table is likely to say out loud.
const INTENTS: Intent[] = [
  { ability: "dex", dc: 13, reason: "Moure's sense fer soroll", re: /\b(sneak|creep|tiptoe|hide|slip past|pick|lockpick|dodge|balance|juggle)|(sigil|amag|esquiv|furt|colar|ganxo|sigilos|esconde)/i },
  { ability: "str", dc: 13, reason: "Un esforç físic dur", re: /\b(push|pull|lift|force|break|smash|haul|drag|shove|heave|climb)|(empeny|estira|aixec|trenc|força|forzar|empuj|levant|escal)/i },
  { ability: "wis", dc: 12, reason: "Notar el que costa de veure", re: /\b(look|search|inspect|examine|listen|watch|notice|track|follow|study the)|(mira|busc|busqu|inspecciona|escolta|observa|segueix|rastre|escucha|examina)/i },
  { ability: "int", dc: 13, reason: "Descobrir com funciona", re: /\b(read|decipher|recall|figure|solve|translate|analy[sz]e|remember|puzzle|study)|(llegeix|desxifra|recorda|resol|descifra|lee|resuelve)/i },
  { ability: "cha", dc: 12, reason: "Trobar les paraules justes", re: /\b(ask|persuade|convince|charm|talk|bargain|plead|reassure|haggle|speak to)|(pregunta|convenc|parla|regateja|demana|habla|pide)/i },
  { ability: "con", dc: 12, reason: "Aguantar una mica més", re: /\b(endure|brace|hold (?:on|out)|wade|push through|swim|carry on)|(aguanta|resisteix|nada|nedar|aguanta)/i },
];

export function classifyAction(text: string): RollRequest | null {
  const body = text.replace(/^[^:]{1,20}:\s*/, "");
  for (const it of INTENTS) {
    if (it.re.test(body)) return { ability: it.ability, dc: it.dc, reason: it.reason, line: text };
  }
  return null;
}

export function xpAfter(tale: Tale, gained: number): { xp: number; level: number; leveled: boolean } {
  const xp = tale.xp + gained;
  const level = Math.max(tale.level, levelForXp(xp));
  return { xp, level, leveled: level > tale.level };
}

export function xpForCheck(show: DiceShow): number {
  return (show.success ? 10 : 4) + (show.crit === "hit" ? 5 : 0);
}

export function checkMechanics(show: DiceShow): Mechanics {
  const notes = [describeRoll(show)];
  const heartDelta: Mechanics["heartDelta"] = [];
  if (show.crit === "fumble") {
    heartDelta.push({ id: show.heroId, delta: -1 });
    notes.push(`${show.who} perd 1 cor per l'entrebanc. Els altres l'ajuden a aixecar-se.`);
  }
  return { heartDelta, xp: xpForCheck(show), notes };
}

export function startEncounter(tale: Tale, spot: Hotspot): { encounter: Encounter; notes: string[] } {
  const inits = tale.party.map((p) => ({
    id: p.id,
    name: p.name,
    score: die(20) + abilityMod(p.abilities.dex),
  }));
  const foe = { id: "foe", name: spot.name, score: die(20) + 1 };
  const order = [...inits, foe].sort((a, b) => b.score - a.score);
  const resolveMax = 5 + tale.level * 3;
  const encounter: Encounter = {
    spotId: spot.id,
    name: spot.name,
    resolve: resolveMax,
    resolveMax,
    guard: 11 + tale.level,
    bite: tale.level >= 3 ? 3 : 2,
    order: order.map((o) => o.id),
    turn: 0,
    round: 1,
  };
  const notes = [
    `El problema es desperta a ${spot.name}. Iniciativa: ${order.map((o) => `${o.id === "foe" ? "el problema" : o.name} ${o.score}`).join(", ")}.`,
    "La companyia pot calmar el problema. Aquí no es mor ningú; un heroi amb 1 cor és retirat pels altres.",
  ];
  return { encounter, notes };
}

/** Let the trouble act until it is a hero's turn again. Mutates nothing; returns deltas. */
function runFoeTurns(
  tale: Tale,
  enc: Encounter,
  hearts: Record<string, number>,
  notes: string[],
  deltas: Record<string, number>,
): Encounter {
  let turn = enc.turn;
  let round = enc.round;
  for (let guardLoop = 0; guardLoop < enc.order.length + 1; guardLoop += 1) {
    if (enc.order[turn] !== "foe") break;
    const live = tale.party.filter((p) => hearts[p.id] > 1);
    if (live.length === 0) {
      notes.push(`El problema de ${enc.name} bufa i veu tots els herois ja esgotats. Es reté.`);
    } else {
      const target = live[Math.floor(Math.random() * live.length)];
      const swing = die(20) + 3;
      if (swing >= target.guard) {
        const dmg = Math.min(enc.bite, hearts[target.id] - 1);
        hearts[target.id] -= dmg;
        deltas[target.id] = (deltas[target.id] ?? 0) - dmg;
        notes.push(`El problema de ${enc.name} colpeja ${target.name} (${swing} contra defensa ${target.guard}) i costa ${dmg} cor.`);
      } else {
        notes.push(`El problema de ${enc.name} ataca ${target.name} (${swing} contra defensa ${target.guard}) i falla.`);
      }
    }
    turn += 1;
    if (turn >= enc.order.length) {
      turn = 0;
      round += 1;
    }
  }
  return { ...enc, turn, round };
}

export function beginEncounter(tale: Tale, spot: Hotspot): Mechanics {
  const { encounter, notes } = startEncounter(tale, spot);
  const hearts = Object.fromEntries(tale.party.map((p) => [p.id, p.heart]));
  const deltas: Record<string, number> = {};
  const next = runFoeTurns(tale, encounter, hearts, notes, deltas);
  const active = next.order[next.turn];
  return {
    heartDelta: Object.entries(deltas).map(([id, delta]) => ({ id, delta })),
    xp: 0,
    encounter: next,
    activeId: active === "foe" ? undefined : active,
    notes,
  };
}

export function strikeMechanics(tale: Tale, show: DiceShow): Mechanics {
  const enc = tale.encounter;
  if (!enc) return checkMechanics(show);
  const hero = heroOf(tale, show.heroId);
  const notes = [describeRoll(show)];
  const hearts = Object.fromEntries(tale.party.map((p) => [p.id, p.heart]));
  const deltas: Record<string, number> = {};
  let resolve = enc.resolve;
  let xp = 0;

  if (show.crit === "fumble") {
    const dmg = Math.min(1, hearts[hero.id] - 1);
    if (dmg > 0) {
      hearts[hero.id] -= dmg;
      deltas[hero.id] = -dmg;
    }
    notes.push(`${hero.name} s'estén massa i perd ${dmg} cor.`);
  } else if (show.success) {
    const dmg = die(4) + Math.max(0, abilityMod(hero.abilities[hero.attack])) + (show.crit === "hit" ? 3 : 0);
    resolve = Math.max(0, resolve - dmg);
    notes.push(`${hero.name} fa recular el problema ${dmg}. Li queden ${resolve} de ${enc.resolveMax} de resolució.`);
  } else {
    notes.push(`${hero.name} no troba l'escletxa. El problema no es mou.`);
  }

  if (resolve <= 0) {
    notes.push(`El problema de ${enc.name} queda calmat. Ningú no ha de patir més.`);
    return {
      heartDelta: Object.entries(deltas).map(([id, delta]) => ({ id, delta })),
      xp: 30 + xpForCheck(show),
      encounter: null,
      notes,
    };
  }

  let turn = enc.turn + 1;
  let round = enc.round;
  if (turn >= enc.order.length) {
    turn = 0;
    round += 1;
  }
  const next = runFoeTurns(tale, { ...enc, resolve, turn, round }, hearts, notes, deltas);
  const active = next.order[next.turn];
  xp += xpForCheck(show);
  return {
    heartDelta: Object.entries(deltas).map(([id, delta]) => ({ id, delta })),
    xp,
    encounter: next,
    activeId: active === "foe" ? undefined : active,
    notes,
  };
}

export function restMechanics(tale: Tale): Mechanics {
  const heartDelta = tale.party
    .map((p) => ({ id: p.id, delta: Math.min(p.heartMax - p.heart, Math.ceil(p.heartMax / 2)) }))
    .filter((h) => h.delta > 0);
  return {
    heartDelta,
    xp: 0,
    rest: true,
    notes: [`La companyia descansa. Cada heroi recupera fins a la meitat dels cors. Queden ${tale.rests - 1} descansos.`],
  };
}

export function itemMechanics(tale: Tale, item: Item, hero: Character): Mechanics | null {
  if (item.effect === "heal") {
    const target = [...tale.party].sort((a, b) => a.heart / a.heartMax - b.heart / b.heartMax)[0];
    const delta = Math.min(item.amount ?? 3, target.heartMax - target.heart);
    return {
      heartDelta: delta > 0 ? [{ id: target.id, delta }] : [],
      xp: 0,
      consume: item.id,
      notes: [`${hero.name} fa servir ${item.name.toLowerCase()} amb ${target.name}, que recupera ${Math.max(0, delta)} cor.`],
    };
  }
  if (item.effect === "edge") {
    return {
      heartDelta: [],
      xp: 0,
      edge: hero.id,
      notes: [`${hero.name} fa servir ${item.name.toLowerCase()}. La propera tirada té avantatge.`],
    };
  }
  return null;
}

/** "1d6+1" → a total and the dice behind it. A critical hit doubles the dice. */
export function rollDice(expr: string, crit = false): { total: number; text: string } {
  const m = expr.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!m) return { total: 0, text: expr };
  const count = Number(m[1]) * (crit ? 2 : 1);
  const sides = Number(m[2]);
  const bonus = m[3] ? Number(m[3]) : 0;
  const rolls = Array.from({ length: count }, () => die(sides));
  const total = Math.max(0, rolls.reduce((a, b) => a + b, 0) + bonus);
  return { total, text: `${rolls.join("+")}${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ""}` };
}

// How a hero may be called out loud, including what a speech recogniser tends to write.
const CALLS: Record<string, string[]> = {
  calder: ["calder", "kalder", "calde", "caldeer"],
  bramble: ["bramble", "brambel", "brambol", "brambol"],
  vesper: ["vesper", "besper", "vespe", "vesper"],
  holt: ["holt", "olt", "hold", "jolt"],
};

const CONNECTORS = new Set(["en", "la", "l", "el", "jo", "soc", "som", "vaig", "faig", "ho", "ara", "ei", "hola", "ve", "va"]);
const TARGET_WORDS = new Set(["amb", "a", "al", "per", "de", "pel", "cap", "vers", "des", "sobre", "que"]);

function plainWord(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function near(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (a.length < b.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/**
 * "Holt, força la porta", "la Bramble escolta", "vaig jo, la Vesper": the hero whose name opens the sentence.
 * A name after "amb" or "a" is somebody being talked to, not the one acting.
 */
export function heroNamed(tale: Tale, text: string): Character | null {
  const words = plainWord(text).slice(0, 5);
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (i > 0 && !CONNECTORS.has(words[i - 1]) && i > 1) break;
    if (i > 0 && TARGET_WORDS.has(words[i - 1])) break;
    for (const [id, calls] of Object.entries(CALLS)) {
      if (calls.some((c) => near(word, c))) return tale.party.find((p) => p.id === id) ?? null;
    }
  }
  return null;
}

/** The standing hero best suited to an ability, if clearly better than whoever is acting. */
export function betterHero(tale: Tale, ability: Ability, actingId: string): { hero: Character; mod: number } | null {
  const acting = tale.party.find((p) => p.id === actingId);
  if (!acting) return null;
  const mine = checkMod(acting, ability, tale.level);
  const best = tale.party
    .filter((p) => p.id !== actingId && p.heart > 0 && !p.down && !p.fallen)
    .map((hero) => ({ hero, mod: checkMod(hero, ability, tale.level) }))
    .sort((a, b) => b.mod - a.mod)[0];
  return best && best.mod - mine >= 2 ? best : null;
}

/** "de la Bramble", "d'en Calder": how a hero's name sits after "torn". */
export function ofHero(name: string): string {
  return { Calder: "d'en Calder", Holt: "d'en Holt", Bramble: "de la Bramble", Vesper: "de la Vesper" }[name] ?? `de ${name}`;
}
