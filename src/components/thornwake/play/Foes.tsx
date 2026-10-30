import { Shield } from "lucide-react";
import type { Tale } from "@/lib/game/types";
import { useFloats } from "@/components/thornwake/play/useFloats";

/** Whoever is on the other side of the fight: real foes with hit points, or the old "trouble" meter. */
export function Foes({ tale }: { tale: Tale }) {
  const fight = tale.fight;
  const enc = tale.encounter;
  const hp = Object.fromEntries((fight?.foes ?? []).map((f) => [f.id, f.hp]));
  const floats = useFloats(hp, false);
  if (!fight && !enc) return null;

  if (enc && !fight) {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-3">
        <div className="rise w-64 border border-ember/70 bg-ink/85 p-3 backdrop-blur">
          <p className="font-serif text-sm text-parchment">Problema a {enc.name}</p>
          <span className="bar-track mt-2 block" aria-label={`Resolució ${enc.resolve} de ${enc.resolveMax}`}>
            <span className="bar-fill block" style={{ width: `${(enc.resolve / enc.resolveMax) * 100}%` }} />
          </span>
        </div>
      </div>
    );
  }
  if (!fight) return null;
  const turn = fight.order[fight.turn];
  const foes = fight.foes.filter((f) => f.hp > 0);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex flex-col items-center gap-2 px-3">
      <ul className="flex flex-wrap justify-center gap-2">
        {foes.map((f) => (
          <li
            key={f.id}
            className={`rise relative w-40 border bg-ink/85 p-2 backdrop-blur ${turn === f.id ? "border-ember turn-glow" : "border-ember/40"}`}
          >
            <div key={f.hp} className="hit-shake">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-serif text-sm text-parchment">{f.name}</span>
                <span className="flex items-center gap-1 font-sans text-xs text-mist">
                  <Shield className="size-3" aria-hidden />
                  {f.ac}
                </span>
              </div>
              <span className="bar-track mt-1.5 block" aria-label={`${f.name}: ${f.hp} de ${f.hpMax}`}>
                <span className="block h-full bg-ember transition-[width] duration-500" style={{ width: `${(f.hp / f.hpMax) * 100}%` }} />
              </span>
              <p className="mt-1 text-right font-sans text-xs text-mist">
                {f.hp}/{f.hpMax}
              </p>
            </div>
            {floats
              .filter((x) => x.id === f.id)
              .map((x) => (
                <span key={x.key} className="float-up absolute top-1 left-1/2 font-display text-xl text-gold-bright">
                  {x.delta > 0 ? `+${x.delta}` : x.delta}
                </span>
              ))}
          </li>
        ))}
      </ul>
      <p className="bg-ink/70 px-3 py-1 font-sans text-xs tracking-widest text-mist">
        COMBAT · RONDA {fight.round}
      </p>
    </div>
  );
}
