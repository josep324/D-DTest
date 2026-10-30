import assert from "node:assert/strict";
import { test } from "node:test";
import {
  abilityMod,
  beginEncounter,
  classifyAction,
  levelForXp,
  makeCheck,
  restMechanics,
  strikeMechanics,
  xpAfter,
} from "./rules.ts";
import type { Character, Tale } from "./types.ts";

const hero = (id: string, heart: number, dex = 14): Character => ({
  id,
  name: id,
  role: "x",
  heart,
  heartMax: 14,
  guard: 12,
  abilities: { str: 10, dex, con: 10, int: 10, wis: 10, cha: 10 },
  proficient: ["dex"],
  attack: "dex",
  voice: "fable",
  portrait: "",
});

function tale(hearts = [14, 14, 14, 14]): Tale {
  const party = hearts.map((h, i) => hero(`h${i}`, h));
  return {
    id: "t",
    party,
    activeId: "h0",
    positions: { h0: "a", h1: "b", h2: "c", h3: "d" },
    level: 1,
    xp: 0,
    rests: 2,
    encounter: null,
    edge: null,
  } as unknown as Tale;
}

const spot = { id: "s", name: "Coal sacks", x: 0, y: 0, examine: "", threat: true };

test("ability modifiers follow the 5e table", () => {
  assert.equal(abilityMod(10), 0);
  assert.equal(abilityMod(16), 3);
  assert.equal(abilityMod(8), -1);
});

test("levels come from xp", () => {
  assert.equal(levelForXp(0), 1);
  assert.equal(levelForXp(80), 2);
  assert.equal(levelForXp(400), 4);
  assert.equal(xpAfter({ xp: 70, level: 1 } as Tale, 20).leveled, true);
});

test("a physical die is taken at its face value and clamped", () => {
  const t = tale();
  const show = makeCheck(t, t.party[0], "dex", 12, "x", "normal", 14);
  assert.equal(show.roll, 14);
  assert.equal(show.physical, true);
  assert.equal(show.success, true);
  assert.equal(makeCheck(t, t.party[0], "dex", 30, "x", "normal", 20).success, true, "natural 20 always lands");
  assert.equal(makeCheck(t, t.party[0], "dex", 1, "x", "normal", 1).success, false, "natural 1 always slips");
});

test("advantage keeps the better of two dice", () => {
  const t = tale();
  for (let i = 0; i < 50; i += 1) {
    const show = makeCheck(t, t.party[0], "dex", 12, "x", "advantage");
    assert.equal(show.roll, Math.max(...show.rolls));
  }
});

test("no hero is ever taken below 1 heart in a long fight", () => {
  for (let run = 0; run < 200; run += 1) {
    let t = tale([3, 2, 1, 2]);
    const start = beginEncounter(t, spot);
    t = { ...t, encounter: start.encounter ?? null } as Tale;
    for (const d of start.heartDelta) {
      const c = t.party.find((p) => p.id === d.id)!;
      c.heart = Math.max(1, c.heart + d.delta);
    }
    for (let round = 0; round < 40 && t.encounter; round += 1) {
      const turnId = t.encounter.order[t.encounter.turn];
      const attacker = t.party.find((p) => p.id === turnId) ?? t.party[0];
      const show = makeCheck(t, attacker, "dex", t.encounter.guard, "hit", "normal");
      const mech = strikeMechanics(t, show);
      for (const d of mech.heartDelta) {
        const c = t.party.find((p) => p.id === d.id)!;
        c.heart += d.delta;
        assert.ok(c.heart >= 1, `hero fell to ${c.heart}`);
      }
      t = { ...t, encounter: mech.encounter ?? null } as Tale;
    }
  }
});

test("a fight ends in calm and pays xp", () => {
  let t = tale();
  t = { ...t, encounter: beginEncounter(t, spot).encounter ?? null } as Tale;
  let paid = 0;
  for (let i = 0; i < 200 && t.encounter; i += 1) {
    const hero0 = t.party.find((p) => p.id === t.encounter!.order[t.encounter!.turn]) ?? t.party[0];
    const mech = strikeMechanics(t, makeCheck(t, hero0, "dex", 1, "hit", "normal", 15));
    paid += mech.xp;
    t = { ...t, encounter: mech.encounter ?? null } as Tale;
  }
  assert.equal(t.encounter, null);
  assert.ok(paid >= 30);
});

test("resting heals up to half and never past the maximum", () => {
  const t = tale([2, 14, 10, 13]);
  const mech = restMechanics(t);
  const byId = Object.fromEntries(mech.heartDelta.map((h) => [h.id, h.delta]));
  assert.equal(byId.h0, 7);
  assert.equal(byId.h1, undefined);
  assert.equal(byId.h2, 4);
  assert.equal(byId.h3, 1);
});

test("uncertain words ask for a roll, calm ones do not", () => {
  assert.equal(classifyAction("Calder: I sneak past the guard")?.ability, "dex");
  assert.equal(classifyAction("Vesper: I try to read the letters")?.ability, "int");
  assert.equal(classifyAction("busquem pistes al pou")?.ability, "wis");
  assert.equal(classifyAction("We say hello"), null);
});
