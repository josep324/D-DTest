import { getScene } from "@/lib/game/content";
import { dmAct, dmResolve, isModule, roomBrief, type Turn } from "@/lib/game/dm";
import { localGm } from "@/lib/game/logic";
import {
  ABILITY_NAMES,
  autoMode,
  beginEncounter,
  checkMechanics,
  classifyAction,
  heroNamed,
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
  /** Module tale: the engine did not understand, so an AI DM improvises inside the room. */
  free?: boolean;
};

/** How long the die tumbles and the verdict stays on screen before the story answers. */
const ROLL_MS = 1900;

function commitTurn(line: string, turn: Turn): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale) return;
  state.commit(tale.id, line, turn.result, "book", turn.mech);
}

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
  const local = opts.free
    ? {
        narration:
          "No t'he acabat d'entendre. Prova de dir-ho d'una altra manera, o digues «què puc fer?» perquè et doni idees.",
        choices: [],
      }
    : localGm(current, { choiceId: opts.choiceId, text: line, roll, notes: mech?.notes });
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
        freeform: opts.free || isModule(current) || undefined,
        roomNotes: isModule(current) ? roomBrief(current) : undefined,
      },
    });
    if (res.ok && opts.free) delete res.result.heartDelta;
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
  const line = request.line ?? `${hero.name} ho intenta: ${request.reason}.`;
  if (isModule(tale) && request.target) {
    window.setTimeout(
      () => {
        const fresh = activeTale(useGame.getState());
        if (fresh) commitTurn(line, dmResolve(fresh, request, show));
      },
      ROLL_MS,
    );
    return;
  }
  const mech = request.kind === "strike" ? strikeMechanics(tale, show) : checkMechanics(show);
  window.setTimeout(() => void perform(line, { rolled: show, mech, resume: true }), ROLL_MS);
}

/** Free-form words from the table. If they sound uncertain, ask for a roll first. */
export function say(text: string, viaVoice = false): void {
  const state = useGame.getState();
  let tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  // Saying a hero's name hands them the action; in a fight the turn order decides instead.
  const named = heroNamed(tale, text);
  if (named && !tale.fight && named.id !== tale.activeId && named.heart > 0 && !named.down && !named.fallen) {
    state.setActive(named.id, "nom");
    tale = activeTale(useGame.getState()) ?? tale;
  }
  const hero = heroOf(tale);
  const line = `${hero.name}: ${text}`;
  if (viaVoice) state.addFlag("veu-usada");
  if (isModule(tale)) {
    const turn = dmAct(tale, line);
    if (turn) commitTurn(line, turn);
    else void perform(line, { free: true });
    return;
  }
  const check = tale.encounter ? null : classifyAction(text);
  if (check) {
    state.setPending({ ...check, heroId: hero.id, line, kind: "check" });
    return;
  }
  void perform(line);
}

/** Tapping a thing on the board is the same as saying what you would say about it. */
export function tapSpot(spot: Hotspot, mode: "move" | "look" | "strike"): void {
  const kind = spot.kind ?? "feature";
  let verb = "mira";
  if (mode === "strike" && kind === "foe") verb = "ataca";
  else if (mode === "move" && kind === "exit") verb = "ves a";
  else if (mode === "move" && kind === "npc") verb = "parla amb";
  else if (mode === "move" && kind === "item") verb = "agafa";
  else if (mode === "move" && kind === "foe") verb = "mira";
  say(`${verb} ${spot.name}`);
}

export function strikeAt(spot: Hotspot): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  if (isModule(tale)) {
    tapSpot(spot, "strike");
    return;
  }
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
  if (!tale || state.writing || tale.finished || tale.encounter || tale.fight || tale.rests <= 0) return;
  if (isModule(tale)) {
    say("descansem");
    return;
  }
  void perform("La companyia fa campament i descansa.", { mech: restMechanics(tale) });
}

export function consumeItem(item: Item): void {
  const state = useGame.getState();
  const tale = activeTale(state);
  if (!tale || state.writing || tale.finished) return;
  const hero = heroOf(tale);
  if (isModule(tale)) {
    say(`fes servir ${item.name}`);
    return;
  }
  const mech = itemMechanics(tale, item, hero) ?? undefined;
  void perform(`${hero.name} fa servir ${item.name.toLowerCase()}. ${item.detail}`, { mech });
}

export function onPlaceMove(spot: Hotspot, mode: "move" | "look"): void {
  const tale = activeTale(useGame.getState());
  if (!tale) return;
  const hero = heroOf(tale);
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return;
  if (isModule(tale)) {
    tapSpot(spot, mode);
    return;
  }
  if (mode === "look") void perform(`${hero.name} mira de prop ${spot.name}.`);
  else void perform(`${hero.name} va a ${spot.name}.`);
}
