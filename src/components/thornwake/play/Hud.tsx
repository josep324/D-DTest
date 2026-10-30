import { Heart, Zap } from "lucide-react";
import { Portrait } from "@/components/thornwake/ui";
import { useFloats } from "@/components/thornwake/play/useFloats";
import { useGame } from "@/lib/game/store";
import type { Character, Tale } from "@/lib/game/types";

function ownerName(tale: Tale, person: Character): string {
  const second = person.id === "vesper" || person.id === "holt";
  return second && tale.partner ? tale.partner : tale.playerName;
}

export function Hud({ tale }: { tale: Tale }) {
  const setActive = useGame((s) => s.setActive);
  const sound = useGame((s) => s.sound);
  const hearts = Object.fromEntries(tale.party.map((p) => [p.id, p.heart]));
  const floats = useFloats(hearts, sound);
  const turn = tale.fight ? tale.fight.order[tale.fight.turn] : null;

  return (
    <ul className="grid grid-cols-4 gap-1.5 px-2 pt-2 sm:gap-2 sm:px-3">
      {tale.party.map((p) => {
        const on = p.id === tale.activeId;
        const low = p.heart / p.heartMax <= 0.34;
        const mine = floats.filter((f) => f.id === p.id);
        return (
          <li key={p.id} className="relative">
            <button
              type="button"
              onClick={() => setActive(p.id)}
              aria-pressed={on}
              className={`flex w-full min-h-14 items-center gap-2 border bg-ink/80 p-1.5 text-left transition sm:p-2 ${
                on ? "border-gold-bright" : "border-gold/20"
              } ${turn === p.id ? "turn-glow" : ""} ${p.down || p.fallen ? "opacity-60 grayscale" : ""}`}
            >
              <span
                key={p.heart}
                className={`size-9 shrink-0 overflow-hidden rounded-full border-2 sm:size-11 ${low ? "border-ember" : on ? "border-gold-bright" : "border-gold/40"} ${mine.some((m) => m.delta < 0) ? "hit-shake" : ""}`}
              >
                <Portrait person={p} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1">
                  <span className="truncate font-serif text-xs text-parchment sm:text-sm">{p.name}</span>
                  {turn === p.id ? (
                    <span className="shrink-0 border border-gold-bright bg-gold/20 px-1 font-sans text-xs tracking-widest text-gold-bright">
                      TORN
                    </span>
                  ) : on && !turn ? (
                    <span className="hidden shrink-0 border border-gold/40 px-1 font-sans text-xs tracking-widest text-gold sm:inline">
                      PARLA
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 hidden bar-track sm:block">
                  <span
                    className={`block h-full transition-[width] duration-500 ${low ? "bg-ember" : "bar-fill"}`}
                    style={{ width: `${(p.heart / p.heartMax) * 100}%` }}
                  />
                </span>
                <span className="mt-0.5 flex items-center gap-1 font-sans text-xs text-mist">
                  <Heart className={`size-3 ${low ? "text-blood" : "text-gold"}`} aria-hidden />
                  {p.heart}/{p.heartMax}
                  {tale.edge === p.id ? <Zap className="size-3 text-gold-bright" aria-label="avantatge" /> : null}
                </span>
                {p.fallen ? (
                  <span className="hidden font-sans text-xs text-blood sm:block">caigut</span>
                ) : p.down ? (
                  <span className="hidden font-sans text-xs text-blood sm:block">
                    a terra · {p.saves?.ok ?? 0}✓ {p.saves?.fail ?? 0}✗
                  </span>
                ) : tale.partner ? (
                  <span className="hidden truncate font-sans text-xs text-gold-dim lg:block">{ownerName(tale, p)}</span>
                ) : null}
              </span>
            </button>
            {mine.map((f) => (
              <span
                key={f.key}
                className={`float-up pointer-events-none absolute -top-2 left-1/2 z-10 font-display text-xl ${f.delta < 0 ? "text-blood" : "text-gold-bright"}`}
              >
                {f.delta > 0 ? `+${f.delta}` : f.delta}
              </span>
            ))}
          </li>
        );
      })}
    </ul>
  );
}
