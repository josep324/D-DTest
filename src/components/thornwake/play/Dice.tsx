import { useEffect, useState } from "react";
import type { DiceShow } from "@/lib/game/types";
import { sfx } from "@/lib/sfx";

/** The die tumbles, the number settles, and the verdict lands with a little fanfare. */
export function DiceOverlay({ show }: { show: DiceShow }) {
  const [face, setFace] = useState(() => 1 + Math.floor(Math.random() * 20));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(false);
    sfx("dice");
    const spin = window.setInterval(() => setFace(1 + Math.floor(Math.random() * 20)), 70);
    const stop = window.setTimeout(() => {
      window.clearInterval(spin);
      setFace(show.roll);
      setSettled(true);
      sfx(show.crit === "hit" ? "crit" : show.success ? "win" : "fail");
    }, 820);
    return () => {
      window.clearInterval(spin);
      window.clearTimeout(stop);
    };
  }, [show]);

  const total = show.roll + show.mod;
  const verdict =
    show.crit === "hit" ? "20 natural!" : show.crit === "fumble" ? "1 natural" : show.success ? "Ho aconsegueix" : "Se li escapa";
  const tone = !settled ? "text-gold-bright" : show.success ? "text-gold-bright" : "text-blood";

  return (
    <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-ink/55" aria-live="polite">
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <div className={`die ${settled ? "die-settled" : "die-rolling"}`}>
          <div className="die-face">
            <span key={settled ? "done" : "roll"} className={`font-display text-5xl ${tone}`}>
              {face}
            </span>
          </div>
        </div>
        <p className="max-w-xs font-serif text-sm text-parchment">{show.label}</p>
        {show.rolls.length > 1 ? (
          <p className="font-sans text-xs text-mist">
            {show.rolls.join(" · ")} → {show.mode === "advantage" ? "es queda la millor" : "es queda la pitjor"}
          </p>
        ) : null}
        {settled ? (
          <div className="rise">
            <p className={`font-display text-xl tracking-widest ${tone}`}>{verdict.toUpperCase()}</p>
            <p className="font-sans text-xs text-mist">
              {show.roll} {show.mod >= 0 ? "+" : "−"} {Math.abs(show.mod)} = {total} contra {show.dc}
              {show.physical ? " · dau de la taula" : ""}
            </p>
          </div>
        ) : (
          <p className="font-sans text-xs tracking-widest text-mist">TIRANT…</p>
        )}
      </div>
    </div>
  );
}
