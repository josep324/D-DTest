import { useState } from "react";
import { Mic } from "lucide-react";
import { Portrait } from "@/components/thornwake/ui";
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
  const mode: RollMode = auto.mode;
  const [num, setNum] = useState("");
  const mod = checkMod(hero, request.ability, tale.level);
  const physical = Number(num);
  const validPhysical = Number.isInteger(physical) && physical >= 1 && physical <= 20;
  const attack = request.kind === "strike" || request.kind === "attack";

  const standing = tale.party.filter((p) => p.heart > 0 && !p.down && !p.fallen);
  const best = standing.reduce(
    (a, b) =>
      checkMod(b, request.ability, tale.level) > checkMod(a, request.ability, tale.level) ? b : a,
    standing[0],
  );

  function pickHero(id: string) {
    const who = tale.party.find((p) => p.id === id);
    if (!who) return;
    setPending({
      ...request,
      heroId: id,
      line: request.line ? request.line.replace(/^[^:]{1,20}:\s*/, `${who.name}: `) : request.line,
    });
  }

  return (
    <div
      className="rise fixed inset-x-3 bottom-3 z-40 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-md overflow-y-auto border border-gold bg-ink/95 p-4 backdrop-blur"
      role="dialog"
      aria-label="Tirada"
    >
      <p className="font-sans text-xs tracking-widest text-gold-dim">
        {attack ? "ATAC" : "ES DEMANEN ELS DAUS"}
      </p>
      <h2 className="mt-1 font-serif text-lg text-parchment">
        {hero.name} · {ABILITY_NAMES[request.ability]} {mod >= 0 ? "+" : ""}
        {mod} <span className="text-mist">contra {request.dc}</span>
      </h2>
      <p className="font-serif text-sm text-mist">{request.reason}</p>
      {!attack ? (
        <div className="mt-3" role="group" aria-label="Qui ho fa">
          <p className="font-sans text-xs tracking-widest text-gold-dim">QUI HO FA</p>
          <ul className="mt-1 grid grid-cols-4 gap-1">
            {tale.party.map((p) => {
              const ok = p.heart > 0 && !p.down && !p.fallen;
              const m = checkMod(p, request.ability, tale.level);
              const chosen = p.id === hero.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    disabled={!ok}
                    aria-pressed={chosen}
                    onClick={() => pickHero(p.id)}
                    className={`flex min-h-16 w-full flex-col items-center justify-center gap-0.5 border px-1 py-1 text-center disabled:opacity-35 ${
                      chosen
                        ? "border-gold-bright bg-gold/20"
                        : "border-gold/25 hover:border-gold/60"
                    }`}
                  >
                    <span className="size-7 overflow-hidden rounded-full border border-gold/40">
                      <Portrait person={p} />
                    </span>
                    <span className="font-serif text-xs text-parchment">{p.name}</span>
                    <span
                      className={`font-sans text-xs ${best?.id === p.id ? "text-gold-bright" : "text-mist"}`}
                    >
                      {m >= 0 ? "+" : "−"}
                      {Math.abs(m)}
                      {best?.id === p.id ? " ★" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-1 font-sans text-xs text-gold-dim">
            ★ és qui ho fa millor. Tothom pot provar-ho.
          </p>
        </div>
      ) : null}
      <div className="mt-3 border border-gold/25 bg-gold/5 p-2.5 font-serif text-sm leading-relaxed text-parchment">
        {mode === "advantage" ? (
          <p>
            <strong className="font-sans text-xs tracking-widest text-gold-bright">
              AVANTATGE
            </strong>
            <br />
            {auto.why ? `${auto.why.charAt(0).toUpperCase()}${auto.why.slice(1)}. ` : ""}
            Tires <strong>dos daus</strong> de 20 cares i et quedes <strong>el millor</strong>. Si
            tires un dau de veritat, tira&apos;n dos i escriu el més alt.
          </p>
        ) : mode === "disadvantage" ? (
          <p>
            <strong className="font-sans text-xs tracking-widest text-blood">DESAVANTATGE</strong>
            <br />
            Tires <strong>dos daus</strong> de 20 cares i et quedes <strong>el pitjor</strong>. Si
            tires un dau de veritat, tira&apos;n dos i escriu el més baix.
          </p>
        ) : (
          <p>
            <strong className="font-sans text-xs tracking-widest text-gold-bright">
              TIRADA NORMAL
            </strong>
            <br />
            Tires <strong>un sol dau</strong> de 20 cares.
          </p>
        )}
        <p className="mt-1 text-mist">
          Al dau hi sumes el bonus ({mod >= 0 ? "+" : "−"}
          {Math.abs(mod)}) i cal arribar a <strong className="text-parchment">{request.dc}</strong>{" "}
          o més. Un 20 sempre reïx i un 1 sempre falla.
        </p>
      </div>
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
      <button
        type="button"
        className="mt-2 min-h-11 font-sans text-xs tracking-widest text-mist"
        onClick={() => setPending(null)}
      >
        DEIXA-HO
      </button>
    </div>
  );
}
