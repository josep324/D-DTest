import { useGame } from "@/lib/game/store";

export type Sfx = "dice" | "win" | "fail" | "crit" | "hit" | "heal" | "level";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, vol: number, to?: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, at + dur);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function noise(c: AudioContext, at: number, dur: number, freq: number, vol: number) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(at);
}

/** Small synthesised table sounds. Follow the "so" setting; silent when it is off. */
export function sfx(name: Sfx) {
  if (!useGame.getState().sound) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  switch (name) {
    case "dice":
      for (let i = 0; i < 7; i += 1) noise(c, t + i * 0.09 + Math.random() * 0.03, 0.06, 1800 + Math.random() * 2400, 0.35);
      break;
    case "win":
      tone(c, 523, t, 0.25, "triangle", 0.12);
      tone(c, 659, t + 0.1, 0.25, "triangle", 0.12);
      tone(c, 784, t + 0.2, 0.4, "triangle", 0.12);
      break;
    case "crit":
      [523, 659, 784, 1047, 1568].forEach((f, i) => tone(c, f, t + i * 0.08, 0.45, "triangle", 0.11));
      break;
    case "fail":
      tone(c, 233, t, 0.35, "sawtooth", 0.07, 155);
      break;
    case "hit":
      tone(c, 150, t, 0.22, "sine", 0.3, 55);
      noise(c, t, 0.12, 900, 0.3);
      break;
    case "heal":
      tone(c, 660, t, 0.3, "sine", 0.1);
      tone(c, 880, t + 0.12, 0.4, "sine", 0.1);
      break;
    case "level":
      [392, 494, 587, 784].forEach((f, i) => tone(c, f, t + i * 0.12, 0.5, "triangle", 0.12));
      break;
  }
}
