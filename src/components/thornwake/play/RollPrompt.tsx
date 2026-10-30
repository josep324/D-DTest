import { useState } from "react";
import { Mic } from "lucide-react";
import { rollFor } from "@/lib/game/actions";
import { ABILITY_NAMES, autoMode, checkMod, heroOf } from "@/lib/game/rules";
import { useGame } from "@/lib/game/store";
import type { RollMode, RollRequest, Tale } from "@/lib/game/types";
import { startTalk, useTalk } from "@/lib/talk";
import { canListen } from "@/lib/voice";

/** The table is asked for a roll: let the app throw it, or type or say the number on a real d20. */
export function RollPrompt({ tale, request }: { tale: Tale; request: RollRequest }) {
  const setPending = useGame((s) => s.setPending);
  const hearing = useTalk((s) => s.hearing);
  const hero = heroOf(tale, request.heroId);
  const auto = autoMode(tale, hero);
  const [mode, setMode] = useState<RollMode>(auto.mode);
  const [num, setNum] = useState("");
  const mod = checkMod(hero, request.ability, tale.level);
  const physical = Number(num);
  const validPhysical = Number.isInteger(physical) && physical >= 1 && physical <= 20;
  const attack = request.kind === "strike" || request.kind === "attack";

  return (
    <div
      className="rise fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md border border-gold bg-ink/95 p-4 backdrop-blur"
      role="dialog"
      aria-label="Tirada"
    >
      <p className="font-sans text-xs tracking-widest text-gold-dim">{attack ? "ATAC" : "ES DEMANEN ELS DAUS"}</p>
      <h2 className="mt-1 font-serif text-lg text-parchment">
        {hero.name} · {ABILITY_NAMES[request.ability]} {mod >= 0 ? "+" : ""}
        {mod} <span className="text-mist">contra {request.dc}</span>
      </h2>
      <p className="font-serif text-sm text-mist">{request.reason}</p>
      <div className="mt-3 grid grid-cols-3 gap-1" role="group" aria-label="Com cau el dau">
        {(
          [
            ["normal", "Normal"],
            ["advantage", "Avantatge"],
            ["disadvantage", "Desavantatge"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`min-h-11 border px-1 font-sans text-xs ${mode === id ? "border-gold bg-gold/15 text-gold-bright" : "border-gold/25 text-mist"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {auto.why ? <p className="mt-1 font-sans text-xs text-gold-dim">Suggeriment: avantatge, {auto.why}.</p> : null}
      <button
        type="button"
        onClick={() => rollFor(request, mode)}
        className="mt-3 min-h-12 w-full border border-ember bg-ember px-3 font-sans text-sm tracking-wide text-parchment hover:bg-ember/90"
      >
        Tira per mi
      </button>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (validPhysical) rollFor(request, mode, physical);
        }}
      >
        <input
          value={num}
          onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 2))}
          inputMode="numeric"
          placeholder="O el d20 de la taula"
          aria-label="El número del dau de la taula"
          className="h-11 min-w-0 flex-1 border border-gold/40 bg-ink px-2 font-serif text-sm text-parchment outline-none focus:border-gold"
        />
        {canListen() ? (
          <button
            type="button"
            onClick={startTalk}
            aria-label={hearing ? "Deixa d'escoltar" : "Digues el número"}
            aria-pressed={hearing}
            className={`flex size-11 items-center justify-center border ${hearing ? "mic-live border-blood text-blood" : "border-gold/40 text-gold"}`}
          >
            <Mic className="size-4" />
          </button>
        ) : null}
        <button
          type="submit"
          disabled={!validPhysical}
          className="min-h-11 border border-gold/70 bg-gold/10 px-3 font-sans text-xs tracking-widest text-gold-bright disabled:opacity-40"
        >
          USA
        </button>
      </form>
      <button type="button" className="mt-2 min-h-11 font-sans text-xs tracking-widest text-mist" onClick={() => setPending(null)}>
        DEIXA-HO
      </button>
    </div>
  );
}
