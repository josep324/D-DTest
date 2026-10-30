import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AudioLines, BookOpen, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";
import { getCampaign, getScene } from "@/lib/game/content";
import { onPlaceMove, perform, strikeAt } from "@/lib/game/actions";
import { has, isModule, visibleSpots } from "@/lib/game/dm";
import { LEVEL_XP, MAX_LEVEL, checkMod, heroOf } from "@/lib/game/rules";
import { say } from "@/lib/game/actions";
import { activeTale, useGame } from "@/lib/game/store";
import type { Character, Hotspot } from "@/lib/game/types";
import { Mark } from "@/components/thornwake/ui";
import { Caption } from "@/components/thornwake/play/Caption";
import { DiceOverlay } from "@/components/thornwake/play/Dice";
import { Dock } from "@/components/thornwake/play/Dock";
import { Foes } from "@/components/thornwake/play/Foes";
import { Guide } from "@/components/thornwake/play/Guide";
import { Hud } from "@/components/thornwake/play/Hud";
import { RollPrompt } from "@/components/thornwake/play/RollPrompt";
import { Stage } from "@/components/thornwake/play/Stage";
import { sfx } from "@/lib/sfx";
import { stopSpeaking } from "@/lib/voice";

function useDesktop(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const q = window.matchMedia("(min-width: 1024px)");
      q.addEventListener("change", notify);
      return () => q.removeEventListener("change", notify);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function IconButton({
  children,
  label,
  onClick,
  on = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  on?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={`flex size-11 items-center justify-center border bg-ink/70 backdrop-blur ${on ? "border-gold-bright text-gold-bright" : "border-gold/30 text-gold"}`}
    >
      {children}
    </button>
  );
}

export function Play() {
  const tale = useGame(activeTale);
  const setScreen = useGame((s) => s.setScreen);
  const mode = useGame((s) => s.mode);
  const writing = useGame((s) => s.writing);
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);
  const setModal = useGame((s) => s.setModal);
  const dice = useGame((s) => s.dice);
  const voice = useGame((s) => s.voice);
  const setVoice = useGame((s) => s.setVoice);
  const handsFree = useGame((s) => s.handsFree);
  const setHandsFree = useGame((s) => s.setHandsFree);
  const desktop = useDesktop();
  const [guideHidden, setGuideHidden] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const lastLevel = useRef<number | null>(null);

  useEffect(() => {
    if (!tale) setScreen("select");
  }, [tale, setScreen]);

  const taleLevel = tale?.level;
  const taleKey = tale?.id;
  useEffect(() => {
    if (taleLevel === undefined) return;
    if (lastLevel.current !== null && taleLevel > lastLevel.current) {
      setLevelUp(taleLevel);
      sfx("level");
      const t = window.setTimeout(() => setLevelUp(null), 4500);
      lastLevel.current = taleLevel;
      return () => window.clearTimeout(t);
    }
    lastLevel.current = taleLevel;
  }, [taleLevel, taleKey]);

  if (!tale) return null;
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return null;
  const module = isModule(tale);
  const spots = module ? visibleSpots(tale) : scene.hotspots;
  const actor = heroOf(tale);

  // The coach shows the step after the furthest one already done, so doing things out of order never traps you.
  const steps = getCampaign(tale.campaignId)?.guide;
  let guideIndex = -1;
  if (steps && !tale.finished) {
    let last = -1;
    steps.forEach((s, i) => {
      if (has(tale, s.done)) last = i;
    });
    guideIndex = Math.min(last + 1, steps.length - 1);
  }
  const guideStep = steps && guideIndex >= 0 ? steps[guideIndex] : null;

  function onPin(spot: Hotspot) {
    if (tale?.pendingRoll || writing) return;
    if (mode === "strike") strikeAt(spot);
    else onPlaceMove(spot, mode === "look" ? "look" : "move");
  }

  function onDice() {
    if (!tale || writing || tale.pendingRoll || tale.finished) return;
    const best = (Object.keys(actor.abilities) as (keyof Character["abilities"])[]).sort(
      (x, y) => checkMod(actor, y, tale.level) - checkMod(actor, x, tale.level),
    )[0];
    useGame.getState().setPending({
      heroId: actor.id,
      ability: best,
      dc: 12,
      reason: "Confiar en una bona mà",
      kind: "check",
      line: `${actor.name} pregunta als daus què guarda el moment.`,
    });
  }

  const xpNext = tale.level < MAX_LEVEL ? LEVEL_XP[tale.level] : null;
  const xpFrom = LEVEL_XP[tale.level - 1] ?? 0;
  const xpPct = xpNext ? Math.min(100, ((tale.xp - xpFrom) / (xpNext - xpFrom)) * 100) : 100;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-ink lg:flex-row">
      <div className="flex flex-none flex-col lg:min-h-0 lg:min-w-0 lg:flex-1">
        <Stage
          tale={tale}
          scene={scene}
          spots={spots}
          locked={writing || Boolean(tale.pendingRoll)}
          onPin={onPin}
          guideTarget={guideStep && !guideHidden ? guideStep.target : undefined}
        >
          <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 bg-gradient-to-b from-ink/90 via-ink/60 to-transparent p-3 pb-10">
            <div className="flex min-w-0 items-center gap-2">
              <Mark className="size-8 shrink-0 text-gold" />
              <div className="min-w-0">
                <h1 className="truncate font-serif text-base text-parchment sm:text-lg">
                  {scene.name}
                </h1>
                <p className="truncate font-sans text-xs text-mist">
                  Dia {tale.day} · {tale.daypart} · {tale.clock} · {scene.weather}
                </p>
                <p className="mt-1 flex items-center gap-2 font-sans text-xs text-gold">
                  Nivell {tale.level}
                  <span
                    className="bar-track inline-block w-16"
                    aria-label={`Experiència ${tale.xp}`}
                  >
                    <span className="bar-fill block" style={{ width: `${xpPct}%` }} />
                  </span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IconButton
                label={
                  handsFree ? "Desactiva el mode veu" : "Mode veu: la narradora t'escolta sola"
                }
                on={handsFree}
                onClick={() => setHandsFree(!handsFree)}
              >
                <AudioLines className="size-4" />
              </IconButton>
              <IconButton
                label={voice ? "Silencia la veu de la narradora" : "Deixa parlar la narradora"}
                on={voice}
                onClick={() => {
                  if (voice) stopSpeaking();
                  setVoice(!voice);
                }}
              >
                {voice ? <Mic className="size-4" /> : <MicOff className="size-4" />}
              </IconButton>
              <IconButton
                label={sound ? "Silencia els efectes" : "Activa els efectes"}
                on={sound}
                onClick={() => setSound(!sound)}
              >
                {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </IconButton>
              <span className="hidden sm:block">
                <IconButton label="Crònica" onClick={() => setModal("chronicle")}>
                  <BookOpen className="size-4" />
                </IconButton>
              </span>
              <IconButton label="Surt de la taula" onClick={() => setScreen("select")}>
                <X className="size-4" />
              </IconButton>
            </div>
          </header>

          <Foes tale={tale} />

          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[min(20rem,70%)]">
            <div className="border border-gold/25 bg-ink/75 px-3 py-2 backdrop-blur">
              <p className="font-sans text-xs tracking-widest text-gold-dim">MISSIÓ</p>
              <p className="font-serif text-sm text-parchment">{tale.quest.title}</p>
              <p className="hidden font-serif text-xs text-mist sm:block">{tale.quest.detail}</p>
              {guideStep && guideHidden ? (
                <button
                  type="button"
                  className="pointer-events-auto mt-1 min-h-11 font-sans text-xs tracking-widest text-gold"
                  onClick={() => setGuideHidden(false)}
                >
                  MOSTRA LA GUIA
                </button>
              ) : null}
            </div>
          </div>
        </Stage>
        {desktop ? (
          <div>
            <Hud tale={tale} />
            <Dock tale={tale} module={module} onDice={onDice} />
          </div>
        ) : null}
      </div>

      <Caption
        tale={tale}
        module={module}
        banner={
          guideStep && steps && !guideHidden ? (
            <Guide
              step={guideStep}
              index={guideIndex}
              total={steps.length}
              busy={writing || Boolean(tale.pendingRoll)}
              onSay={(phrase) => say(phrase)}
              onHide={() => setGuideHidden(true)}
            />
          ) : undefined
        }
        onChoice={(id, label) => void perform(label, { choiceId: id })}
      />

      {!desktop ? (
        <div className="flex-none">
          <Hud tale={tale} />
          <Dock tale={tale} module={module} onDice={onDice} />
        </div>
      ) : null}

      {tale.pendingRoll && !writing && !dice ? (
        <RollPrompt
          key={`${tale.pendingRoll.target ?? tale.pendingRoll.reason}-${tale.beat}`}
          tale={tale}
          request={tale.pendingRoll}
        />
      ) : null}

      {dice ? <DiceOverlay show={dice} /> : null}

      {levelUp ? (
        <div className="rise pointer-events-none fixed top-24 left-1/2 z-50 -translate-x-1/2 border border-gold-bright bg-ink/95 px-5 py-3 text-center">
          <p className="font-display text-lg tracking-widest text-gold-bright">NIVELL {levelUp}</p>
          <p className="font-serif text-sm text-parchment">
            La companyia creix. Cada cor arriba una mica més lluny.
          </p>
        </div>
      ) : null}
    </div>
  );
}
