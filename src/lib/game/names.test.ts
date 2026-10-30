import assert from "node:assert/strict";
import { test } from "node:test";
import { betterHero, heroNamed } from "./rules.ts";
import type { Character, Tale } from "./types.ts";

const hero = (id: string, name: string, abilities: Character["abilities"], proficient: Character["proficient"] = []): Character =>
  ({ id, name, role: "x", heart: 10, heartMax: 10, guard: 12, abilities, proficient, attack: "str", voice: "fable", weapon: { name: "x", dice: "1d4", ability: "str" }, portrait: "" }) as Character;
const base = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
const tale = {
  level: 1,
  party: [
    hero("calder", "Calder", { ...base, str: 16 }, ["str"]),
    hero("bramble", "Bramble", { ...base, dex: 16 }),
    hero("vesper", "Vesper", { ...base, int: 16 }),
    hero("holt", "Holt", base),
  ],
} as unknown as Tale;

test("the hero named at the start of a sentence acts", () => {
  assert.equal(heroNamed(tale, "Holt, forço la porta")?.id, "holt");
  assert.equal(heroNamed(tale, "la Bramble escolta els joncs")?.id, "bramble");
  assert.equal(heroNamed(tale, "vaig jo, la Vesper")?.id, "vesper");
  assert.equal(heroNamed(tale, "en Calder obre la caixa")?.id, "calder");
});

test("what a speech recogniser writes still counts", () => {
  assert.equal(heroNamed(tale, "Brambel mira el pou")?.id, "bramble");
  assert.equal(heroNamed(tale, "Kalder força la porta")?.id, "calder");
});

test("a name after 'amb' or 'a' is someone talked to, not the actor", () => {
  assert.equal(heroNamed(tale, "parlo amb la Vesper"), null);
  assert.equal(heroNamed(tale, "dono la clau a en Holt"), null);
  assert.equal(heroNamed(tale, "forço la porta"), null);
});

test("suggest the clearly better hero for an ability", () => {
  assert.equal(betterHero(tale, "str", "holt")?.hero.id, "calder");
  assert.equal(betterHero(tale, "str", "calder"), null);
  assert.equal(betterHero(tale, "cha", "holt"), null);
});
