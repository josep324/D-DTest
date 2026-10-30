import assert from "node:assert/strict";
import { test } from "node:test";
import { numberFromSpeech } from "./number-words.ts";

test("digits are read as they come", () => {
  assert.equal(numberFromSpeech("14"), 14);
  assert.equal(numberFromSpeech("he tret un 17"), 17);
  assert.equal(numberFromSpeech("he tret un 40"), null);
});

test("Catalan number words", () => {
  assert.equal(numberFromSpeech("catorze"), 14);
  assert.equal(numberFromSpeech("He tret un catorze!"), 14);
  assert.equal(numberFromSpeech("vint"), 20);
  assert.equal(numberFromSpeech("disset"), 17);
  assert.equal(numberFromSpeech("tretze"), 13);
  assert.equal(numberFromSpeech("un set"), 7);
});

test("Spanish number words and accents", () => {
  assert.equal(numberFromSpeech("dieciséis"), 16);
  assert.equal(numberFromSpeech("veinte"), 20);
});

test("nothing to read", () => {
  assert.equal(numberFromSpeech("tira per mi"), null);
});
