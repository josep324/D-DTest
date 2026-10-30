import { narrateAloud } from "@/lib/tts";
import type { Lang } from "@/lib/game/store";

const BCP47: Record<Lang, string> = { en: "en-US", ca: "ca-ES", es: "es-ES" };

let current: HTMLAudioElement | null = null;
let ticket = 0;
let cloudOk = false;
let cloudDown = false;
const cache = new Map<string, string>();

// Paragraphs that start with this mark are rules text (dice, hearts). Shown, never read aloud.
export const RULES_MARK = "▸";

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function stopSpeaking() {
  ticket += 1;
  if (current) {
    current.pause();
    current = null;
  }
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

function browserSpeak(text: string, lang: Lang): Promise<void> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === "undefined") return resolve();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = BCP47[lang];
    utter.rate = 0.96;
    const match = speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
    if (match) utter.voice = match;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    speechSynthesis.speak(utter);
  });
}

async function load(text: string, voice: string): Promise<string | null> {
  const key = `${voice}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  if (cloudDown) return null;
  try {
    const res = await narrateAloud({ data: { text: text.slice(0, 1500), voice: voice as never } });
    if (res.ok) {
      cloudOk = true;
      cache.set(key, res.audio);
      if (cache.size > 40) cache.delete(cache.keys().next().value as string);
      return res.audio;
    }
    // Never worked here (no key set): settle on the browser voice for the whole session.
    if (!cloudOk) cloudDown = true;
  } catch {
    if (!cloudOk) cloudDown = true;
  }
  return null;
}

function playClip(src: string, mine: number): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    current = audio;
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
    if (mine !== ticket) audio.pause();
  });
}

/**
 * Read narration aloud, paragraph by paragraph. Every paragraph is requested at once so the first
 * one starts quickly and the rest are ready when it ends. Once a cloud voice has worked, a failed
 * paragraph stays silent rather than swapping to a different-sounding voice mid-scene.
 */
export async function speak(
  raw: string,
  opts: { voice: string; lang: Lang; onEnd?: () => void },
): Promise<void> {
  const parts = raw
    .split(/\n\s*\n/)
    .map(clean)
    .filter((p) => p && !p.startsWith(RULES_MARK));
  if (!parts.length) return;
  stopSpeaking();
  const mine = ticket;
  const loads = parts.map((p) => load(p, opts.voice));
  for (let i = 0; i < parts.length; i += 1) {
    const src = await loads[i];
    if (mine !== ticket) return;
    if (src) await playClip(src, mine);
    else if (!cloudOk) await browserSpeak(parts[i], opts.lang);
    if (mine !== ticket) return;
  }
  opts.onEnd?.();
}

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canListen(): boolean {
  return recognitionCtor() !== null;
}

/** Push-to-talk. Returns a stop function. `onText` gets interim text; `onFinal` the finished sentence. */
export function listen(
  lang: Lang,
  handlers: { onText: (t: string) => void; onFinal: (t: string) => void; onEnd: () => void },
): () => void {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    handlers.onEnd();
    return () => {};
  }
  stopSpeaking();
  const rec = new Ctor();
  rec.lang = BCP47[lang];
  rec.interimResults = true;
  rec.continuous = false;
  let finalText = "";
  rec.onresult = (e) => {
    let interim = "";
    for (let i = 0; i < e.results.length; i += 1) {
      const part = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += part;
      else interim += part;
    }
    handlers.onText((finalText + interim).trim());
  };
  rec.onerror = () => handlers.onEnd();
  rec.onend = () => {
    if (finalText.trim()) handlers.onFinal(finalText.trim());
    handlers.onEnd();
  };
  try {
    rec.start();
  } catch {
    handlers.onEnd();
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
  };
}

/** "I rolled 14", "un 14", "14!" → 14. Digits only; the recogniser writes numerals. */
export function numberFromSpeech(text: string): number | null {
  const m = text.match(/\b(\d{1,2})\b/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= 20 ? n : null;
}
