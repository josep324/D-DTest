import { getScene } from "@/lib/game/content";
import { localGm } from "@/lib/game/logic";
import {
  ABILITY_NAMES,
  autoMode,
  beginEncounter,
  checkMechanics,
  classifyAction,
  heroOf,
  itemMechanics,
  makeCheck,
  restMechanics,
  strikeMechanics,
} from "@/lib/game/rules";
import { activeTale, useGame } from "@/lib/game/store";
import type { DiceShow, Hotspot, Item, Mechanics, RollMode, RollRequest, Tale } from "@/lib/game/types";
import { consultStoryteller } from "@/lib/gm";
import { stopSpeaking } from "@/lib/voice";

type Opts = {
  choiceId?: string;
  rolled?: DiceShow;
  mech?: Mechanics;
  /** The caller already holds the writing lock (a roll animation is in flight). */
  resume?: boolean;
};

function encounterFacts(tale: Tale): string | undefined {
  const enc = tale.encounter;
  if (!enc) return undefined;
  const turn = enc.order[enc.turn];
  const who = tale.party.find((p) => p.id === turn)?.name ?? "el problema";
  return `Problema a ${enc.name}, resolució ${enc.resolve}/${enc.resolveMax}, ronda ${enc.round}, torn: ${who}`;
}

/** Ask the storyteller (or the table book) what happens, then fold the result into the tale. */
export async function perform(line: string, opts: Opts = {}): Promise<void> {
  const state = useGame.getState();
  const current = activeTale(state);
  if (!current || current.finished) return;
  if (state.writing && !opts.resume) return;
  if (opts.choiceId === "open-chronicle") {
    state.setModal("chronicle");
    return;
  }
  stopSpeaking();
  state.setWriting(true);
  if (!opts.rolled) state.setDice(null);

  const rolled = opts.rolled;
  const mech = opts.mech ?? (rolled ? checkMechanics(rolled) : undefined);
  const roll = rolled
    ? { label: rolled.label, total: rolled.roll + rolled.mod, dc: rolled.dc, success: rolled.success }
    : undefined;
  const local = localGm(current, { choiceId: opts.choiceId, text: line, roll, notes: mech?.notes });
  const actor = heroOf(current);

  try {
    const res = await consultStoryteller({
      data: {
        campaignId: current.campaignId,
        sceneId: current.sceneId,
        playerName: current.playerName,
        partner: current.partner || undefined,
        activeId: current.activeId,
        action: line,
        party: current.party.map((p) => ({ id: p.id, heart: p.heart })),
        recent: current.log.slice(-6).map((l) => ({ role: l.role, text: l.text.slice(0, 480) })),
        roll,
        facts: mech?.notes,
        summary: current.summary || undefined,
        level: current.level,
        lang: state.lang,
        inventory: current.inventory.map((i) => i.name),
        heroLine: `${actor.name}, ${actor.role}, ${actor.heart}/${actor.heartMax} hearts`,
        encounter: encounterFacts(current),
      },
    });
    if (res.ok) state.commit(current.id, line, res.result, "live", mech);
    else state.commit(current.id, line, local, "book", mech);
  } catch {
    state.commit(current.id, line, local, "book", mech);
  }
}

/** Roll for a request (or accept a physical die), show it, then let the story answer. */
export function rollFor(request: RollRequest, mode?: RollMode, physical?: number): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  const hero = heroOf(tale, request.heroId);
  const auto = autoMode(tale, hero);
  const label = `${hero.name} · ${ABILITY_NAMES[request.ability]} — ${request.reason}`;
  const show = makeCheck(tale, hero, request.ability, request.dc, label, mode ?? auto.mode, physical);
  state.setWriting(true);
  state.setPending(null);
  state.setDice(show);
  const mech = request.kind === "strike" ? strikeMechanics(tale, show) : checkMechanics(show);
  const line = request.line ?? `${hero.name} ho intenta: ${request.reason}.`;
  window.setTimeout(() => void perform(line, { rolled: show, mech, resume: true }), physical !== undefined ? 400 : 1000);
}

/** Free-form words from the table. If they sound uncertain, ask for a roll first. */
export function say(text: string): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  const hero = heroOf(tale);
  const line = `${hero.name}: ${text}`;
  const check = tale.encounter ? null : classifyAction(text);
  if (check) {
    state.setPending({ ...check, heroId: hero.id, line, kind: "check" });
    return;
  }
  void perform(line);
}

export function strikeAt(spot: Hotspot): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  const hero = heroOf(tale);
  const enc = tale.encounter;

  if (!enc) {
    if (!spot.threat) {
      void perform(`${hero.name} busca baralla a ${spot.name} i només hi troba el temps.`);
      return;
    }
    void perform(`${hero.name} s'encara amb el problema de ${spot.name}.`, { mech: beginEncounter(tale, spot) });
    return;
  }
  if (spot.id !== enc.spotId) {
    void perform(`${hero.name} mira ${spot.name}, però el problema és a ${enc.name}.`);
    return;
  }
  if (enc.order[enc.turn] !== hero.id) {
    const who = tale.party.find((p) => p.id === enc.order[enc.turn]);
    if (who) state.setActive(who.id);
    return;
  }
  state.setPending({
    heroId: hero.id,
    ability: hero.attack,
    dc: enc.guard,
    reason: `Fes recular el problema de ${spot.name}`,
    kind: "strike",
    line: `${hero.name} fa recular el problema de ${spot.name}.`,
  });
}

export function stepBack(): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale?.encounter || state.writing) return;
  const hero = heroOf(tale);
  void perform(`${hero.name} fa recular la companyia de ${tale.encounter.name}.`, {
    mech: { heartDelta: [], xp: 0, encounter: null, notes: [`La companyia es retira del problema de ${tale.encounter.name}. Ningú no queda ferit.`] },
  });
}

export function restParty(): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished || tale.encounter || tale.rests <= 0) return;
  void perform("La companyia fa campament i descansa.", { mech: restMechanics(tale) });
}

export function consumeItem(item: Item): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  const hero = heroOf(tale);
  const mech = itemMechanics(tale, item, hero) ?? undefined;
  void perform(`${hero.name} fa servir ${item.name.toLowerCase()}. ${item.detail}`, { mech });
}

export function onPlaceMove(spot: Hotspot, mode: "move" | "look"): void {
  const tale = activeTale(useGame.getState());
  if (!tale) return;
  const hero = heroOf(tale);
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return;
  if (mode === "look") void perform(`${hero.name} mira de prop ${spot.name}.`);
  else void perform(`${hero.name} va a ${spot.name}.`);
}
