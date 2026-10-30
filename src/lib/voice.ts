import { narrateAloud } from "@/lib/tts";
import type { Lang } from "@/lib/game/store";

const BCP47: Record<Lang, string> = { en: "en-US", ca: "ca-ES", es: "es-ES" };

let current: HTMLAudioElement | null = null;
let ticket = 0;
let nanoDown = false;
const cache = new Map<string, string>();

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

function browserSpeak(text: string, lang: Lang, onEnd?: () => void) {
  if (typeof speechSynthesis === "undefined") {
    onEnd?.();
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = BCP47[lang];
  utter.rate = 0.96;
  const voices = speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
  if (match) utter.voice = match;
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  speechSynthesis.speak(utter);
}

/** Read narration aloud: NanoGPT voice first, the browser's own voice if that is unavailable. */
export async function speak(
  raw: string,
  opts: { voice: string; lang: Lang; onEnd?: () => void },
): Promise<void> {
  const text = clean(raw);
  if (!text) return;
  stopSpeaking();
  const mine = ticket;
  const key = `${opts.voice}|${text}`;
  let src = cache.get(key);
  if (!src && !nanoDown) {
    try {
      const res = await narrateAloud({ data: { text: text.slice(0, 1500), voice: opts.voice as never } });
      if (res.ok) {
        src = res.audio;
        cache.set(key, src);
        if (cache.size > 24) cache.delete(cache.keys().next().value as string);
      } else {
        nanoDown = true;
      }
    } catch {
      nanoDown = true;
    }
  }
  if (mine !== ticket) return;
  if (!src) {
    browserSpeak(text, opts.lang, opts.onEnd);
    return;
  }
  const audio = new Audio(src);
  current = audio;
  audio.onended = () => opts.onEnd?.();
  audio.onerror = () => {
    nanoDown = true;
    if (mine === ticket) browserSpeak(text, opts.lang, opts.onEnd);
  };
  try {
    await audio.play();
  } catch {
    if (mine === ticket) browserSpeak(text, opts.lang, opts.onEnd);
  }
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
