import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Backpack,
  BookOpen,
  Dices,
  Feather,
  Footprints,
  Mic,
  MicOff,
  Moon,
  Search,
  Send,
  Sword,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { getScene } from "@/lib/game/content";
import { onPlaceMove, perform, restParty, rollFor, say, stepBack, strikeAt } from "@/lib/game/actions";
import { createTale } from "@/lib/game/logic";
import {
  ABILITY_NAMES,
  LEVEL_XP,
  MAX_LEVEL,
  autoMode,
  checkMod,
  heroOf,
} from "@/lib/game/rules";
import { activeTale, useGame } from "@/lib/game/store";
import type { Character, Hotspot, RollMode, RollRequest, Tale } from "@/lib/game/types";
import { Mark, Ornate, Portrait, TextButton } from "@/components/thornwake/ui";
import { canListen, listen, numberFromSpeech, speak, stopSpeaking } from "@/lib/voice";

function ownerName(tale: Tale, person: Character): string {
  const second = person.id === "vesper" || person.id === "holt";
  return second && tale.partner ? tale.partner : tale.playerName;
}

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
  const voice = useGame((s) => s.voice);
  const setVoice = useGame((s) => s.setVoice);
  const lang = useGame((s) => s.lang);
  const [draft, setDraft] = useState("");
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
      const t = window.setTimeout(() => setLevelUp(null), 4500);
      lastLevel.current = taleLevel;
      return () => window.clearTimeout(t);
    }
    lastLevel.current = taleLevel;
  }, [taleLevel, taleKey]);

  useEffect(() => () => stopSpeaking(), []);

  if (!tale) return null;
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return null;
  const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];

  function onPlace(spot: Hotspot) {
    if (tale?.pendingRoll) return;
    if (mode === "strike") strikeAt(spot);
    else onPlaceMove(spot, mode);
  }

  function onDice() {
    if (!tale || writing || tale.pendingRoll || tale.finished) return;
    const hero = heroOf(tale);
    const best = (Object.keys(hero.abilities) as (keyof Character["abilities"])[]).sort(
      (x, y) => checkMod(hero, y, tale.level) - checkMod(hero, x, tale.level),
    )[0];
    useGame.getState().setPending({
      heroId: hero.id,
      ability: best,
      dc: 12,
      reason: "Confiar en una bona mà",
      kind: "check",
      line: `${hero.name} pregunta als daus què guarda el moment.`,
    });
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
          <IconButton label="Crònica" onClick={() => setModal("chronicle")}>
            <BookOpen className="size-4" />
          </IconButton>
          <IconButton
            label={voice ? "Silencia la veu de la narradora" : "Deixa parlar la narradora"}
            onClick={() => {
              if (voice) stopSpeaking();
              setVoice(!voice);
            }}
          >
            {voice ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          </IconButton>
          <IconButton label={sound ? "Silencia la sala" : "So de la sala"} onClick={() => setSound(!sound)}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </IconButton>
          <button
            type="button"
            onClick={() => setStoryOpen(!storyOpen)}
            className="hidden h-11 items-center border border-gold/50 px-3 font-serif text-sm text-parchment sm:flex"
          >
            La narradora
          </button>
          <IconButton label="Surt de la taula" onClick={() => setScreen("select")}>
            <X className="size-4" />
          </IconButton>
        </div>
      </header>

      <div className="pointer-events-none absolute top-16 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto border border-gold/30 bg-ink/75 px-4 py-2 text-center">
          <p className="font-serif text-sm text-parchment">
            Dia {tale.day} · {tale.daypart}
          </p>
          <p className="font-sans text-xs text-mist">
            {tale.clock} · Nivell {tale.level}
            {tale.level < MAX_LEVEL ? ` · ${tale.xp}/${LEVEL_XP[tale.level]} XP` : " · al màxim"}
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
                  <span className="font-sans text-xs text-mist">
                    {person.role}
                    {tale.partner ? ` · ${ownerName(tale, person)}` : ""}
                  </span>
                </span>
                <span className="bar-track mt-2 block">
                  <span className="bar-fill block" style={{ width: `${(person.heart / person.heartMax) * 100}%` }} />
                </span>
                <span className="mt-1 block font-sans text-xs text-mist">
                  {person.heart}/{person.heartMax} · Defensa {person.guard}
                  {tale.edge === person.id ? " · avantatge" : ""}
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
          Veure el viatge
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
            voice={voice}
            lang={lang}
            heroVoice="fable"
            finished={tale.finished}
            blocked={Boolean(tale.pendingRoll)}
            tale={tale}
            onChoice={(id, label) => void perform(label, { choiceId: id })}
            onSend={(text) => {
              const line = (text ?? draft).trim();
              if (!line) return;
              setDraft("");
              say(line);
            }}
            onClose={() => setStoryOpen(false)}
          />
        </div>
      ) : (
        <div className="z-30 mx-3 mb-2 lg:absolute lg:right-4 lg:bottom-28">
          <TextButton onClick={() => setStoryOpen(true)}>Obre la narradora</TextButton>
        </div>
      )}

      <p className="z-20 px-3 text-center font-sans text-xs text-mist lg:absolute lg:bottom-24 lg:left-1/2 lg:-translate-x-1/2">
        {mode === "move"
          ? `Mou ${actor.name} · tria un lloc`
          : mode === "look"
            ? `Mira amb ${actor.name} · tria un lloc`
            : tale.encounter
              ? `Ataca amb ${actor.name} · fes recular el problema de ${tale.encounter.name}`
              : `Ataca amb ${actor.name} · tria un lloc tens`}
      </p>

      <div className="sticky bottom-0 z-30 mt-auto flex justify-center px-2 py-3 lg:absolute lg:inset-x-0 lg:bottom-3 lg:mt-0">
        <div className="flex max-w-full gap-1 overflow-x-auto border border-gold/40 bg-ink/85 p-1">
          <Act icon={<Footprints className="size-4" />} label="Mou" on={mode === "move"} onClick={() => setMode("move")} />
          <Act icon={<Sword className="size-4" />} label="Ataca" on={mode === "strike"} onClick={() => setMode("strike")} />
          <Act icon={<Search className="size-4" />} label="Mira" on={mode === "look"} onClick={() => setMode("look")} />
          <Act icon={<Backpack className="size-4" />} label="Motxilla" on={false} onClick={() => setModal("pack")} />
          <Act icon={<Dices className="size-4" />} label="Daus" on={false} onClick={onDice} />
          <Act
            icon={<Moon className="size-4" />}
            label={`Descans ${tale.rests}`}
            on={false}
            onClick={restParty}
            disabled={tale.rests <= 0 || Boolean(tale.encounter) || tale.finished || writing}
          />
          <button
            type="button"
            onClick={() => setModal("chronicle")}
            className="flex h-16 w-28 shrink-0 flex-col items-center justify-center bg-ember px-2 text-center font-sans text-xs tracking-widest text-parchment"
          >
            SEGUEIX
            <span>EL CONTE</span>
          </button>
        </div>
      </div>

      {tale.encounter ? <EncounterBar tale={tale} /> : null}

      {tale.pendingRoll && !writing ? (
        <RollPrompt
          key={`${tale.pendingRoll.ability}-${tale.pendingRoll.reason}-${tale.beat}`}
          tale={tale}
          request={tale.pendingRoll}
          lang={lang}
        />
      ) : null}

      {dice ? (
        <div className="fixed bottom-28 left-1/2 z-40 w-72 -translate-x-1/2 border border-gold bg-ink/95 px-4 py-3 text-center">
          <p className="font-display text-4xl text-gold-bright">
            {dice.roll}
            {dice.rolls.length > 1 ? (
              <span className="ml-2 font-sans text-xs text-mist">
                ({dice.rolls.join(" / ")} · {dice.mode === "advantage" ? "la millor" : "la pitjor"})
              </span>
            ) : null}
          </p>
          <p className="font-serif text-sm text-parchment">{dice.label}</p>
          <p className="font-sans text-xs text-mist">
            {dice.mod >= 0 ? "+" : ""}
            {dice.mod} = {dice.roll + dice.mod} vs {dice.dc} ·{" "}
            {dice.crit === "hit"
              ? "un 20 natural!"
              : dice.crit === "fumble"
                ? "un 1 natural"
                : dice.success
                  ? "surt bé"
                  : "s'escapa"}
            {dice.physical ? " · dau de la taula" : ""}
          </p>
        </div>
      ) : null}

      {levelUp ? (
        <div className="pointer-events-none fixed top-24 left-1/2 z-50 -translate-x-1/2 border border-gold-bright bg-ink/95 px-5 py-3 text-center">
          <p className="font-display text-lg tracking-widest text-gold-bright">NIVELL {levelUp}</p>
          <p className="font-serif text-sm text-parchment">La companyia creix. Cada cor arriba una mica més lluny.</p>
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
  disabled,
}: {
  icon: ReactNode;
  label: string;
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 font-sans text-xs disabled:opacity-35 ${on ? "bg-gold/15 text-gold-bright" : "text-mist"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function EncounterBar({ tale }: { tale: Tale }) {
  const enc = tale.encounter;
  if (!enc) return null;
  const turnId = enc.order[enc.turn];
  return (
    <section className="z-30 mx-3 mb-2 border border-ember/70 bg-ink/90 p-3 lg:absolute lg:top-36 lg:left-1/2 lg:mx-0 lg:w-80 lg:-translate-x-1/2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-serif text-sm text-parchment">Problema a {enc.name}</h2>
        <span className="font-sans text-xs text-mist">Ronda {enc.round}</span>
      </div>
      <span className="bar-track mt-2 block" aria-label={`Resolució ${enc.resolve} de ${enc.resolveMax}`}>
        <span className="bar-fill block" style={{ width: `${(enc.resolve / enc.resolveMax) * 100}%` }} />
      </span>
      <ol className="mt-2 flex flex-wrap gap-1">
        {enc.order.map((id) => {
          const hero = tale.party.find((p) => p.id === id);
          const on = id === turnId;
          return (
            <li
              key={id}
              className={`px-2 py-1 font-sans text-xs ${on ? "bg-gold/25 text-gold-bright" : "text-mist"} border ${on ? "border-gold" : "border-gold/20"}`}
            >
              {hero ? hero.name : "Problema"}
            </li>
          );
        })}
      </ol>
      <button type="button" className="mt-2 min-h-11 font-sans text-xs tracking-widest text-gold" onClick={stepBack}>
        RETIRA'T
      </button>
    </section>
  );
}

function RollPrompt({ tale, request, lang }: { tale: Tale; request: RollRequest; lang: "en" | "ca" | "es" }) {
  const setPending = useGame((s) => s.setPending);
  const hero = heroOf(tale, request.heroId);
  const auto = autoMode(tale, hero);
  const [mode, setMode] = useState<RollMode>(auto.mode);
  const [num, setNum] = useState("");
  const [hearing, setHearing] = useState(false);
  const stop = useRef<(() => void) | null>(null);
  const mod = checkMod(hero, request.ability, tale.level);
  const physical = Number(num);
  const validPhysical = Number.isInteger(physical) && physical >= 1 && physical <= 20;

  useEffect(() => () => stop.current?.(), []);

  const hear = () => {
    if (hearing) {
      stop.current?.();
      return;
    }
    setHearing(true);
    stop.current = listen(lang, {
      onText: () => {},
      onFinal: (t) => {
        const n = numberFromSpeech(t);
        if (n) rollFor(request, mode, n);
      },
      onEnd: () => setHearing(false),
    });
  };

  return (
    <div className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-md border border-gold bg-ink/95 p-4 sm:bottom-28" role="dialog" aria-label="Tirada">
      <p className="font-sans text-xs tracking-widest text-gold-dim">
        {request.kind === "strike" ? "ATAC" : "ES DEMANEN ELS DAUS"}
      </p>
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
      <div className="mt-3">
        <TextButton tone="ember" onClick={() => rollFor(request, mode)}>
          Tira per mi
        </TextButton>
      </div>
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
          className="h-11 min-w-0 flex-1 border border-gold/40 bg-ink/40 px-2 font-serif text-sm text-parchment outline-none"
        />
        {canListen() ? (
          <button
            type="button"
            onClick={hear}
            aria-label={hearing ? "Deixa d'escoltar" : "Digues el número"}
            aria-pressed={hearing}
            className={`flex size-11 items-center justify-center border ${hearing ? "border-gold-bright text-gold-bright" : "border-gold/40 text-gold"}`}
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

function EndCard({ tale }: { tale: Tale }) {
  const setModal = useGame((s) => s.setModal);
  const setScreen = useGame((s) => s.setScreen);
  const addTale = useGame((s) => s.addTale);
  return (
    <div className="px-4 pb-3">
      <div className="border border-gold-dim/50 bg-parchment-deep/50 p-3 text-center">
        <p className="font-display text-sm tracking-widest text-gold-dim">EL CONTE ÉS CONTAT</p>
        <p className="mt-1 font-serif text-sm text-soot">
          Dia {tale.day} · Nivell {tale.level} · {tale.xp} XP · {tale.chronicle.length} pàgines a la crònica
        </p>
      </div>
      <div className="mt-2 grid gap-2">
        <button
          type="button"
          onClick={() => setModal("chronicle")}
          className="min-h-11 border border-gold-dim/60 bg-parchment-deep/60 px-3 font-serif text-sm text-soot"
        >
          Llegeix la crònica
        </button>
        <button
          type="button"
          onClick={() => addTale(createTale(tale.campaignId, tale.playerName))}
          className="min-h-11 border border-gold-dim/60 px-3 font-serif text-sm text-soot"
        >
          Torna a jugar aquest conte
        </button>
        <button type="button" onClick={() => setScreen("select")} className="min-h-11 border border-gold-dim/60 px-3 font-serif text-sm text-soot">
          Tria un altre conte
        </button>
      </div>
    </div>
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
  voice,
  lang,
  heroVoice,
  finished,
  blocked,
  tale,
}: {
  narration: string;
  choices: { id: string; label: string; hint?: string }[];
  writing: boolean;
  toldBy: "live" | "book" | null;
  draft: string;
  setDraft: (v: string) => void;
  onChoice: (id: string, label: string) => void;
  onSend: (text?: string) => void;
  onClose: () => void;
  voice: boolean;
  lang: "en" | "ca" | "es";
  heroVoice: string;
  finished: boolean;
  blocked: boolean;
  tale: Tale;
}) {
  const [count, setCount] = useState(narration.length);
  const [skip, setSkip] = useState(true);
  const [hearing, setHearing] = useState(false);
  const stopListen = useRef<(() => void) | null>(null);
  const spoken = useRef<string>("");

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

  useEffect(() => {
    if (!voice || writing || spoken.current === narration) return;
    spoken.current = narration;
    void speak(narration, { voice: heroVoice, lang });
  }, [voice, writing, narration, heroVoice, lang]);

  useEffect(
    () => () => {
      stopListen.current?.();
    },
    [],
  );

  const done = !writing && count >= narration.length;
  const body = narration.slice(0, count);
  const canTalk = canListen();

  const talk = () => {
    if (hearing) {
      stopListen.current?.();
      return;
    }
    setHearing(true);
    stopListen.current = listen(lang, {
      onText: setDraft,
      onFinal: (text) => {
        setDraft("");
        onSend(text);
      },
      onEnd: () => setHearing(false),
    });
  };

  return (
    <Ornate variant="light" className="story-panel flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="font-sans text-xs tracking-widest text-gold-dim">LA NARRADORA</p>
        <div className="flex items-center">
          <button
            type="button"
            className="min-h-11 px-2 text-soot"
            aria-label="Torna-ho a escoltar"
            onClick={() => void speak(narration, { voice: heroVoice, lang })}
          >
            <Volume2 className="size-4" />
          </button>
          <button type="button" className="min-h-11 px-2 text-soot lg:hidden" onClick={onClose} aria-label="Amaga la narradora">
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="scroll-thin flex-1 overflow-y-auto px-4 py-3">
        {writing ? (
          <p className="flex items-center gap-2 font-serif text-soot">
            <Feather className="size-4" /> Escrivint el conte…
          </p>
        ) : (
          body.split("\n\n").map((para, i) => (
            <p key={i} className="mb-3 font-serif text-sm leading-relaxed text-soot">
              {para}
            </p>
          ))
        )}
        {toldBy === "book" && done ? (
          <p className="font-sans text-xs text-gold-dim">Contat des del llibre de la taula.</p>
        ) : null}
      </div>
      {!writing && !done ? (
        <div className="px-4 pb-2">
          <button type="button" className="ml-auto block min-h-11 border border-gold-dim/40 px-3 font-sans text-xs text-soot" onClick={() => setSkip(true)}>
            Salta la narració
          </button>
        </div>
      ) : null}
      {done && finished ? <EndCard tale={tale} /> : null}
      {done && !finished && !blocked ? (
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
      {done && blocked ? (
        <p className="px-4 pb-2 font-serif text-sm text-soot">Els daus esperen a la taula.</p>
      ) : null}
      {!finished ? (
        <form
          className="flex gap-2 border-t border-gold-dim/30 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!writing && !blocked) onSend();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={hearing ? "Escoltant…" : "Què fa la companyia?"}
            maxLength={400}
            className="h-11 min-w-0 flex-1 border border-gold-dim/40 bg-parchment/40 px-2 font-serif text-sm text-soot outline-none"
          />
          {canTalk ? (
            <button
              type="button"
              onClick={talk}
              disabled={writing || blocked}
              aria-pressed={hearing}
              aria-label={hearing ? "Deixa d'escoltar" : "Digues la teva acció"}
              className={`flex size-11 items-center justify-center border disabled:opacity-40 ${hearing ? "border-ember bg-ember/20 text-ember" : "border-gold-dim/50 text-soot"}`}
            >
              <Mic className="size-4" />
            </button>
          ) : null}
          <button
            type="submit"
            disabled={writing || blocked || !draft.trim()}
            className="flex size-11 items-center justify-center bg-ember text-parchment disabled:opacity-40"
            aria-label="Envia"
          >
            <Send className="size-4" />
          </button>
        </form>
      ) : null}
    </Ornate>
  );
}
