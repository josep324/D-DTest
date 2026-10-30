// "catorze", "catorce", "14": whatever the speech recogniser writes, find the number on the die (1–20).
const WORDS: Record<string, number> = {
  un: 1, u: 1, una: 1, uno: 1,
  dos: 2, dues: 2,
  tres: 3,
  quatre: 4, cuatro: 4,
  cinc: 5, cinco: 5,
  sis: 6, seis: 6,
  set: 7, siete: 7,
  vuit: 8, ocho: 8,
  nou: 9, nueve: 9,
  deu: 10, diez: 10,
  onze: 11, once: 11,
  dotze: 12, doce: 12,
  tretze: 13, trece: 13,
  catorze: 14, catorce: 14,
  quinze: 15, quince: 15,
  setze: 16, dieciseis: 16,
  disset: 17, diecisiete: 17,
  divuit: 18, dieciocho: 18,
  dinou: 19, diecinueve: 19,
  vint: 20, veinte: 20,
};

function strip(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Digits win; otherwise the last number word said ("he tret un catorze" → 14). */
export function numberFromSpeech(text: string): number | null {
  const t = strip(text);
  const digits = t.match(/\b(\d{1,2})\b/g);
  if (digits) {
    const n = Number(digits[digits.length - 1]);
    return n >= 1 && n <= 20 ? n : null;
  }
  let found: number | null = null;
  for (const word of t.split(/[^a-z]+/)) {
    if (word in WORDS) found = WORDS[word];
  }
  return found;
}
