import { Portrait } from "@/components/thornwake/ui";
import { ABILITY_NAMES, abilityMod, checkMod, profBonus } from "@/lib/game/rules";
import { activeTale, useGame } from "@/lib/game/store";
import type { Ability } from "@/lib/game/types";

const ORDER: Ability[] = ["str", "dex", "con", "int", "wis", "cha"];
const SHORT: Record<Ability, string> = {
  str: "Força",
  dex: "Destresa",
  con: "Const.",
  int: "Intel·lecte",
  wis: "Saviesa",
  cha: "Encant",
};

function signed(n: number): string {
  return `${n >= 0 ? "+" : "−"}${Math.abs(n)}`;
}

/** What each hero can do: six abilities with the bonus they actually roll with, and what they carry. */
export function Sheet() {
  const tale = useGame(activeTale);
  if (!tale) return null;
  return (
    <div>
      <p className="mb-3 font-serif text-sm leading-relaxed text-mist">
        El número gran és el bonus que se suma al dau. El punt <span className="text-gold">●</span>{" "}
        vol dir que aquest heroi hi és entrenat (hi suma {signed(profBonus(tale.level))} més). Quan
        una prova sigui incerta, tria qui la fa segons això.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tale.party.map((p) => {
          const on = p.id === tale.activeId;
          const owner =
            (p.id === "vesper" || p.id === "holt") && tale.partner ? tale.partner : tale.playerName;
          return (
            <li
              key={p.id}
              className={`border p-3 ${on ? "border-gold-bright bg-gold/10" : "border-gold/25 bg-ink/40"}`}
            >
              <div className="flex items-center gap-3">
                <span className="size-12 shrink-0 overflow-hidden rounded-full border border-gold/50">
                  <Portrait person={p} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg text-parchment">
                    {p.name} <span className="font-sans text-xs text-mist">· {p.role}</span>
                  </p>
                  <p className="font-sans text-xs text-gold-dim">
                    {owner}
                    {on ? " · parla ara" : ""}
                  </p>
                </div>
              </div>
              <p className="mt-2 font-sans text-xs text-mist">
                Vida {p.heart}/{p.heartMax} · Defensa {p.guard} · {p.weapon.name} ({p.weapon.dice})
              </p>
              <ul className="mt-2 grid grid-cols-3 gap-1.5">
                {ORDER.map((a) => {
                  const trained = p.proficient.includes(a);
                  return (
                    <li
                      key={a}
                      className={`border px-1.5 py-1 text-center ${trained ? "border-gold/60 bg-gold/10" : "border-gold/15"}`}
                    >
                      <p className="font-sans text-xs text-mist" title={ABILITY_NAMES[a]}>
                        {SHORT[a]}
                      </p>
                      <p className="font-display text-xl text-parchment">
                        {signed(checkMod(p, a, tale.level))}
                        {trained ? <span className="ml-1 text-sm text-gold">●</span> : null}
                      </p>
                      <p className="font-sans text-xs text-gold-dim">{p.abilities[a]}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 font-sans text-xs text-gold-dim">
                Ataca amb {ABILITY_NAMES[p.weapon.ability]} (
                {signed(abilityMod(p.abilities[p.weapon.ability]))})
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
