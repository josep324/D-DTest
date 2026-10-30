import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

export type Float = { key: number; id: string; delta: number };

/** Watches numbers (hearts, foe hp) and emits a short-lived "-3" / "+2" whenever one changes. */
export function useFloats(values: Record<string, number>, sound = true): Float[] {
  const prev = useRef(values);
  const latest = useRef(values);
  latest.current = values;
  const [floats, setFloats] = useState<Float[]>([]);
  const sig = Object.entries(values)
    .map(([k, v]) => `${k}:${v}`)
    .join("|");

  useEffect(() => {
    const made: Float[] = [];
    for (const id of Object.keys(latest.current)) {
      const was = prev.current[id];
      if (was === undefined) continue;
      const delta = latest.current[id] - was;
      if (delta !== 0) made.push({ key: Math.random(), id, delta });
    }
    prev.current = latest.current;
    if (!made.length) return;
    if (sound) sfx(made.some((m) => m.delta < 0) ? "hit" : "heal");
    setFloats((f) => [...f, ...made]);
    window.setTimeout(() => setFloats((f) => f.filter((x) => !made.includes(x))), 1350);
  }, [sig, sound]);

  return floats;
}
