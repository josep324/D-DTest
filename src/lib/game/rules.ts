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
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intellect",
  wis: "Wisdom",
  cha: "Charm",
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
  if (tale.edge === hero.id) return { mode: "advantage", why: "an item gives an edge" };
  const here = tale.positions[hero.id];
  const helper = tale.party.find((p) => p.id !== hero.id && tale.positions[p.id] === here);
  if (helper) return { mode: "advantage", why: `${helper.name} lends a hand` };
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
    show.mode === "advantage" ? " with advantage" : show.mode === "disadvantage" ? " with disadvantage" : "";
  const tag = show.crit === "hit" ? " (a natural 20!)" : show.crit === "fumble" ? " (a natural 1)" : "";
  return `${show.who} rolls ${ABILITY_NAMES[show.ability]}${how}: ${show.roll}${show.mod >= 0 ? "+" : ""}${show.mod} = ${show.roll + show.mod} against ${show.dc}${tag}. ${show.success ? "Success" : "Failure"}.`;
}

type Intent = { ability: Ability; dc: number; reason: string; re: RegExp };

// English first, then the Catalan and Spanish stems the table is likely to say out loud.
const INTENTS: Intent[] = [
  { ability: "dex", dc: 13, reason: "Moving quietly", re: /\b(sneak|creep|tiptoe|hide|slip past|pick|lockpick|dodge|balance|juggle)|(sigil|amag|esquiv|furt|colar|ganxo|sigilos|esconde)/i },
  { ability: "str", dc: 13, reason: "Hard physical effort", re: /\b(push|pull|lift|force|break|smash|haul|drag|shove|heave|climb)|(empeny|estira|aixec|trenc|força|forzar|empuj|levant|escal)/i },
  { ability: "wis", dc: 12, reason: "Noticing what is easy to miss", re: /\b(look|search|inspect|examine|listen|watch|notice|track|follow|study the)|(mira|busc|busqu|inspecciona|escolta|observa|segueix|rastre|escucha|examina)/i },
  { ability: "int", dc: 13, reason: "Working something out", re: /\b(read|decipher|recall|figure|solve|translate|analy[sz]e|remember|puzzle|study)|(llegeix|desxifra|recorda|resol|descifra|lee|resuelve)/i },
  { ability: "cha", dc: 12, reason: "Choosing the right words", re: /\b(ask|persuade|convince|charm|talk|bargain|plead|reassure|haggle|speak to)|(pregunta|convenc|parla|regateja|demana|habla|pide)/i },
  { ability: "con", dc: 12, reason: "Holding on a little longer", re: /\b(endure|brace|hold (?:on|out)|wade|push through|swim|carry on)|(aguanta|resisteix|nada|nedar|aguanta)/i },
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
    notes.push(`${show.who} loses 1 heart to the stumble. The others pull them back.`);
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
    `Trouble stirs at ${spot.name}. Initiative: ${order.map((o) => `${o.name} ${o.score}`).join(", ")}.`,
    "The company can calm the trouble. Nobody here dies; a hero at 1 heart is pulled back by the others.",
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
      notes.push(`The trouble at ${enc.name} huffs and finds every hero already worn thin. It holds back.`);
    } else {
      const target = live[Math.floor(Math.random() * live.length)];
      const swing = die(20) + 3;
      if (swing >= target.guard) {
        const dmg = Math.min(enc.bite, hearts[target.id] - 1);
        hearts[target.id] -= dmg;
        deltas[target.id] = (deltas[target.id] ?? 0) - dmg;
        notes.push(`The trouble at ${enc.name} strikes ${target.name} (${swing} vs guard ${target.guard}) and costs ${dmg} heart.`);
      } else {
        notes.push(`The trouble at ${enc.name} swings at ${target.name} (${swing} vs guard ${target.guard}) and misses.`);
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
    notes.push(`${hero.name} overreaches and loses ${dmg} heart.`);
  } else if (show.success) {
    const dmg = die(4) + Math.max(0, abilityMod(hero.abilities[hero.attack])) + (show.crit === "hit" ? 3 : 0);
    resolve = Math.max(0, resolve - dmg);
    notes.push(`${hero.name} presses the trouble back by ${dmg}. It has ${resolve} of ${enc.resolveMax} resolve left.`);
  } else {
    notes.push(`${hero.name} cannot find the opening. The trouble is unmoved.`);
  }

  if (resolve <= 0) {
    notes.push(`The trouble at ${enc.name} is calmed. Nobody has to be hurt further.`);
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
    notes: [`The company rests. Each hero recovers up to half their hearts. ${tale.rests - 1} rests remain.`],
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
      notes: [`${hero.name} uses the ${item.name.toLowerCase()} on ${target.name}, who recovers ${Math.max(0, delta)} heart.`],
    };
  }
  if (item.effect === "edge") {
    return {
      heartDelta: [],
      xp: 0,
      edge: hero.id,
      notes: [`${hero.name} uses the ${item.name.toLowerCase()}. The next check has advantage.`],
    };
  }
  return null;
}
