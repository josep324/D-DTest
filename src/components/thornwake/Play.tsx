import { useEffect, useState, type ReactNode } from "react";
import {
  Backpack,
  BookOpen,
  Dices,
  Feather,
  Footprints,
  Search,
  Send,
  Sword,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { getScene } from "@/lib/game/content";
import { localGm, rollCheck, skillMod } from "@/lib/game/logic";
import { activeTale, useGame } from "@/lib/game/store";
import { consultStoryteller } from "@/lib/gm";
import type { DiceShow, Hotspot } from "@/lib/game/types";
import { Mark, Ornate, Portrait, TextButton } from "@/components/thornwake/ui";

const OFFSETS = [
  { dx: -3.2, dy: -1.5 },
  { dx: 3.4, dy: 0.8 },
  { dx: -1.6, dy: 3.6 },
  { dx: 3.8, dy: 3.2 },
];

export function Play() {
  const tale = useGame(activeTale);
  const setScreen = useGame((s) => s.setScreen);
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const storyOpen = useGame((s) => s.storyOpen);
  const setStoryOpen = useGame((s) => s.setStoryOpen);
  const writing = useGame((s) => s.writing);
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);
  const setModal = useGame((s) => s.setModal);
  const dice = useGame((s) => s.dice);
  const toldBy = useGame((s) => s.toldBy);
  const setActive = useGame((s) => s.setActive);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!tale) setScreen("select");
  }, [tale, setScreen]);

  if (!tale) return null;
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return null;
  const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];

  async function perform(line: string, choiceId?: string, rolled?: DiceShow) {
    const state = useGame.getState();
    const current = activeTale(state);
    if (!current || state.writing) return;
    if (choiceId === "open-chronicle") {
      state.setModal("chronicle");
      return;
    }
    state.setWriting(true);
    if (!rolled) state.setDice(null);
    const local = localGm(current, {
      choiceId,
      text: line,
      roll: rolled
        ? {
            total: rolled.roll + rolled.mod,
            dc: rolled.dc,
            success: rolled.success,
            label: rolled.label,
          }
        : undefined,
    });
    try {
      const res = await consultStoryteller({
        data: {
          campaignId: current.campaignId,
          sceneId: current.sceneId,
          playerName: current.playerName,
          activeId: current.activeId,
          action: line,
          party: current.party.map((p) => ({ id: p.id, heart: p.heart })),
          recent: current.log.slice(-6).map((l) => ({ role: l.role, text: l.text.slice(0, 480) })),
          roll: rolled
            ? { label: rolled.label, total: rolled.roll + rolled.mod, dc: rolled.dc, success: rolled.success }
            : undefined,
        },
      });
      if (res.ok) state.commit(current.id, line, res.result, "live");
      else state.commit(current.id, line, local, "book");
    } catch {
      state.commit(current.id, line, local, "book");
    }
  }

  function onPlace(spot: Hotspot) {
    if (mode === "look") {
      void perform(`${actor.name} looks closely at ${spot.name}.`);
      return;
    }
    if (mode === "strike") {
      if (!spot.threat) {
        void perform(`${actor.name} searches ${spot.name} for a fight and finds only weather.`);
        return;
      }
      const check = rollCheck(skillMod(actor.id), 13);
      const shown: DiceShow = {
        who: actor.name,
        label: `${actor.name} presses at ${spot.name}`,
        roll: check.roll,
        mod: check.mod,
        dc: check.dc,
        success: check.success,
      };
      useGame.getState().setDice(shown);
      window.setTimeout(() => void perform(shown.label, undefined, shown), 900);
      return;
    }
    void perform(`${actor.name} goes to ${spot.name}.`);
  }

  function onDice() {
    const check = rollCheck(skillMod(actor.id), 12);
    const shown: DiceShow = {
      who: actor.name,
      label: `${actor.name} asks the dice`,
      roll: check.roll,
      mod: check.mod,
      dc: check.dc,
      success: check.success,
    };
    useGame.getState().setDice(shown);
    window.setTimeout(
      () => void perform(`${shown.label} and gets ${check.total} against ${check.dc}.`, undefined, shown),
      900,
    );
  }

  return (
    <div className="wood relative flex min-h-dvh flex-col overflow-x-hidden lg:block lg:h-dvh lg:overflow-hidden">
      <header className="z-30 flex items-start justify-between gap-2 px-3 py-3 lg:absolute lg:inset-x-0 lg:top-0">
        <div className="flex items-center gap-2">
          <Mark className="size-9 shrink-0 text-gold" />
          <div>
            <p className="font-display text-xs tracking-widest text-gold sm:text-sm">THORNWAKE</p>
            <h1 className="font-serif text-sm text-parchment sm:text-base">{scene.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Chronicle" onClick={() => setModal("chronicle")}>
            <BookOpen className="size-4" />
          </IconButton>
          <IconButton label={sound ? "Silence" : "Sound"} onClick={() => setSound(!sound)}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </IconButton>
          <button
            type="button"
            onClick={() => setStoryOpen(!storyOpen)}
            className="hidden h-11 items-center border border-gold/50 px-3 font-serif text-sm text-parchment sm:flex"
          >
            The Storyteller
          </button>
          <IconButton label="Leave the table" onClick={() => setScreen("select")}>
            <X className="size-4" />
          </IconButton>
        </div>
      </header>

      <div className="pointer-events-none absolute top-16 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto border border-gold/30 bg-ink/75 px-4 py-2 text-center">
          <p className="font-serif text-sm text-parchment">
            Day {tale.day} · {tale.daypart}
          </p>
          <p className="font-sans text-xs text-mist">
            {tale.clock} · {scene.hotspots.length} places in view · Journey
          </p>
        </div>
      </div>
      <p className="absolute top-16 right-3 z-20 hidden font-sans text-xs tracking-widest text-mist lg:block">
        {tale.sky}
      </p>

      <div className="board-perspective z-10 flex justify-center px-2 py-2 lg:absolute lg:inset-0 lg:items-center">
        <div className="board-plane">
          <div className="board-frame">
            <div className="board-stage">
              <img src={scene.image} alt={scene.name} className="absolute inset-0 size-full object-cover" />
              {scene.hotspots.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  aria-label={h.name}
                  disabled={writing}
                  onClick={() => onPlace(h)}
                  className={`place-pip ${mode === "move" || mode === "look" ? "on" : ""}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  <span className="pointer-events-none absolute top-5 left-1/2 hidden -translate-x-1/2 bg-ink/80 px-1 font-sans text-xs whitespace-nowrap text-parchment group-hover:block lg:block">
                    {mode === "move" || mode === "look" ? h.name : ""}
                  </span>
                </button>
              ))}
              {tale.party.map((person, index) => {
                const spot = scene.hotspots.find((h) => h.id === tale.positions[person.id]) ?? scene.hotspots[0];
                const off = OFFSETS[index % OFFSETS.length];
                const on = person.id === actor.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    className="token"
                    style={{ left: `${spot.x + off.dx}%`, top: `${spot.y + off.dy}%` }}
                    onClick={() => setActive(person.id)}
                  >
                    <span
                      className={`mx-auto block size-8 overflow-hidden rounded-full border-2 ${on ? "border-gold-bright" : "border-gold/50"}`}
                    >
                      <Portrait person={person} />
                    </span>
                    <span className="mt-0.5 block bg-ink/80 px-1 font-sans text-xs text-parchment">{person.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <aside className="party-rail z-20 flex gap-2 overflow-x-auto px-3 pb-2 lg:absolute lg:top-24 lg:left-3 lg:w-60 lg:flex-col lg:overflow-y-auto">
        {tale.party.map((person) => {
          const on = person.id === actor.id;
          return (
            <button
              key={person.id}
              type="button"
              onClick={() => setActive(person.id)}
              className={`flex w-52 shrink-0 gap-2 border p-2 text-left lg:w-full ${on ? "border-gold bg-ink/70" : "border-gold/20 bg-ink/50"}`}
            >
              <span className="size-12 shrink-0 overflow-hidden border border-gold/40">
                <Portrait person={person} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-sm text-parchment">{person.name}</span>
                  <span className="font-sans text-xs text-mist">{person.role}</span>
                </span>
                <span className="bar-track mt-2 block">
                  <span className="bar-fill block" style={{ width: `${(person.heart / person.heartMax) * 100}%` }} />
                </span>
                <span className="mt-1 block font-sans text-xs text-mist">
                  {person.heart}/{person.heartMax} · Guard {person.guard}
                </span>
              </span>
            </button>
          );
        })}
      </aside>

      <section className="z-20 mx-3 mb-2 max-w-sm border border-gold/25 bg-ink/75 p-3 lg:absolute lg:bottom-28 lg:left-4">
        <h2 className="font-serif text-sm text-parchment">{tale.quest.title}</h2>
        <p className="mt-1 font-serif text-sm leading-relaxed text-mist">{tale.quest.detail}</p>
        <button type="button" className="mt-2 font-sans text-xs tracking-widest text-gold" onClick={() => setModal("chronicle")}>
          View journey
        </button>
      </section>

      {storyOpen ? (
        <div className="z-30 mx-3 mb-2 lg:absolute lg:top-20 lg:right-4 lg:bottom-28 lg:mx-0 lg:w-96">
          <StoryPanel
            narration={tale.narration}
            choices={tale.choices}
            writing={writing}
            toldBy={toldBy}
            draft={draft}
            setDraft={setDraft}
            onChoice={(id, label) => void perform(label, id)}
            onSend={() => {
              const line = draft.trim();
              if (!line) return;
              setDraft("");
              void perform(`${actor.name}: ${line}`);
            }}
            onClose={() => setStoryOpen(false)}
          />
        </div>
      ) : (
        <div className="z-30 mx-3 mb-2 lg:absolute lg:right-4 lg:bottom-28">
          <TextButton onClick={() => setStoryOpen(true)}>Open the storyteller</TextButton>
        </div>
      )}

      <p className="z-20 px-3 text-center font-sans text-xs text-mist lg:absolute lg:bottom-24 lg:left-1/2 lg:-translate-x-1/2">
        {mode === "move"
          ? `Move ${actor.name} · choose a place`
          : mode === "look"
            ? `Look with ${actor.name} · choose a place`
            : `Strike with ${actor.name} · choose a tense place`}
      </p>

      <div className="sticky bottom-0 z-30 mt-auto flex justify-center px-2 py-3 lg:absolute lg:inset-x-0 lg:bottom-3 lg:mt-0">
        <div className="flex max-w-full gap-1 overflow-x-auto border border-gold/40 bg-ink/85 p-1">
          <Act icon={<Footprints className="size-4" />} label="Move" on={mode === "move"} onClick={() => setMode("move")} />
          <Act icon={<Sword className="size-4" />} label="Strike" on={mode === "strike"} onClick={() => setMode("strike")} />
          <Act icon={<Search className="size-4" />} label="Look" on={mode === "look"} onClick={() => setMode("look")} />
          <Act icon={<Backpack className="size-4" />} label="Pack" on={false} onClick={() => setModal("pack")} />
          <Act icon={<Dices className="size-4" />} label="Dice" on={false} onClick={onDice} />
          <button
            type="button"
            onClick={() => setModal("chronicle")}
            className="flex h-16 w-28 shrink-0 flex-col items-center justify-center bg-ember px-2 text-center font-sans text-xs tracking-widest text-parchment"
          >
            FOLLOW
            <span>THE STORY</span>
          </button>
        </div>
      </div>

      {dice ? (
        <div className="fixed bottom-28 left-1/2 z-40 w-64 -translate-x-1/2 border border-gold bg-ink/95 px-4 py-3 text-center">
          <p className="font-display text-4xl text-gold-bright">{dice.roll}</p>
          <p className="font-serif text-sm text-parchment">{dice.label}</p>
          <p className="font-sans text-xs text-mist">
            +{dice.mod} = {dice.roll + dice.mod} vs {dice.dc} · {dice.success ? "it turns" : "it slips"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center border border-gold/30 bg-ink/60 text-gold"
    >
      {children}
    </button>
  );
}

function Act({
  icon,
  label,
  on,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 font-sans text-xs ${on ? "bg-gold/15 text-gold-bright" : "text-mist"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function StoryPanel({
  narration,
  choices,
  writing,
  toldBy,
  draft,
  setDraft,
  onChoice,
  onSend,
  onClose,
}: {
  narration: string;
  choices: { id: string; label: string; hint?: string }[];
  writing: boolean;
  toldBy: "live" | "book" | null;
  draft: string;
  setDraft: (v: string) => void;
  onChoice: (id: string, label: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const [count, setCount] = useState(narration.length);
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    setSkip(false);
    setCount(0);
  }, [narration]);

  useEffect(() => {
    if (writing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip || reduce) {
      setCount(narration.length);
      return;
    }
    const id = window.setInterval(() => {
      setCount((v) => {
        if (v >= narration.length) {
          window.clearInterval(id);
          return v;
        }
        return Math.min(narration.length, v + 5);
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [narration, skip, writing]);

  const done = !writing && count >= narration.length;
  const body = narration.slice(0, count);

  return (
    <Ornate variant="light" className="story-panel flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="font-sans text-xs tracking-widest text-gold-dim">THE STORYTELLER</p>
        <button type="button" className="min-h-11 px-2 text-soot lg:hidden" onClick={onClose} aria-label="Hide storyteller">
          <X className="size-4" />
        </button>
      </div>
      <div className="scroll-thin flex-1 overflow-y-auto px-4 py-3">
        {writing ? (
          <p className="flex items-center gap-2 font-serif text-soot">
            <Feather className="size-4" /> Writing the tale…
          </p>
        ) : (
          body.split("\n\n").map((para, i) => (
            <p key={i} className="mb-3 font-serif text-sm leading-relaxed text-soot">
              {para}
            </p>
          ))
        )}
        {toldBy === "book" && done ? (
          <p className="font-sans text-xs text-gold-dim">Told from the table book.</p>
        ) : null}
      </div>
      {!writing && !done ? (
        <div className="px-4 pb-2">
          <button type="button" className="ml-auto block min-h-11 border border-gold-dim/40 px-3 font-sans text-xs text-soot" onClick={() => setSkip(true)}>
            Skip narration
          </button>
        </div>
      ) : null}
      {done ? (
        <div className="flex flex-col gap-2 px-4 pb-2">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChoice(c.id, c.label)}
              className="min-h-11 border border-gold-dim/50 bg-parchment-deep/40 px-3 py-2 text-left font-serif text-sm text-soot hover:bg-parchment-deep"
            >
              {c.label}
              {c.hint ? <span className="mt-0.5 block font-sans text-xs text-gold-dim">{c.hint}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
      <form
        className="flex gap-2 border-t border-gold-dim/30 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!writing) onSend();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`What does the company do?`}
          maxLength={400}
          className="h-11 min-w-0 flex-1 border border-gold-dim/40 bg-parchment/40 px-2 font-serif text-sm text-soot outline-none"
        />
        <button
          type="submit"
          disabled={writing || !draft.trim()}
          className="flex size-11 items-center justify-center bg-ember text-parchment disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </Ornate>
  );
}
