import { useEffect, useRef, useState, type ReactNode } from "react";
import { Lightbulb, Volume2 } from "lucide-react";
import { createTale } from "@/lib/game/logic";
import { say } from "@/lib/game/actions";
import { useGame } from "@/lib/game/store";
import type { Tale } from "@/lib/game/types";
import { RULES_MARK, speak, stopSpeaking } from "@/lib/voice";
import { startTalk } from "@/lib/talk";

function Paragraphs({ text, dim = false }: { text: string; dim?: boolean }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => {
        if (para.startsWith(RULES_MARK)) {
          return (
            <p
              key={i}
              className="mb-2 border-l-2 border-gold-dim/60 pl-2 font-sans text-xs leading-relaxed text-gold-dim"
            >
              {para.slice(1).trim()}
            </p>
          );
        }
        if (para.startsWith("Consell del DM:")) {
          return (
            <p
              key={i}
              className="mb-3 flex gap-2 border border-gold/30 bg-gold/10 p-2.5 font-serif text-sm leading-relaxed text-gold-bright"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <strong className="font-sans text-xs tracking-widest">CONSELL DEL DM</strong>
                <br />
                {para
                  .replace("Consell del DM:", "")
                  .trim()
                  .replace(/^./, (c) => c.toUpperCase())}
              </span>
            </p>
          );
        }
        return (
          <p
            key={i}
            className={`mb-3 font-serif text-base leading-relaxed ${dim ? "text-mist/80" : "text-parchment"}`}
          >
            {para}
          </p>
        );
      })}
    </>
  );
}

function EndCard({ tale }: { tale: Tale }) {
  const setModal = useGame((s) => s.setModal);
  const setScreen = useGame((s) => s.setScreen);
  const addTale = useGame((s) => s.addTale);
  const btn =
    "min-h-11 border border-gold/50 bg-gold/10 px-3 font-serif text-sm text-gold-bright hover:bg-gold/20";
  return (
    <div className="rise mt-2 space-y-2 border border-gold/40 bg-ink/60 p-3">
      <p className="text-center font-display text-sm tracking-widest text-gold">
        EL CONTE ÉS CONTAT
      </p>
      <p className="text-center font-serif text-sm text-mist">
        Dia {tale.day} · Nivell {tale.level} · {tale.xp} XP · {tale.chronicle.length} pàgines a la
        crònica
      </p>
      <div className="grid gap-2">
        <button type="button" className={btn} onClick={() => setModal("chronicle")}>
          Llegeix la crònica
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => addTale(createTale(tale.campaignId, tale.playerName))}
        >
          Torna a jugar aquest conte
        </button>
        <button type="button" className={btn} onClick={() => setScreen("select")}>
          Tria un altre conte
        </button>
      </div>
    </div>
  );
}

/** The storyteller: past turns fade up the page, the new narration types in and is read aloud. */
export function Caption({
  tale,
  module,
  banner,
  onChoice,
}: {
  tale: Tale;
  module: boolean;
  banner?: ReactNode;
  onChoice: (id: string, label: string) => void;
}) {
  const writing = useGame((s) => s.writing);
  const voice = useGame((s) => s.voice);
  const lang = useGame((s) => s.lang);
  const handsFree = useGame((s) => s.handsFree);
  const narration = tale.narration;
  const [count, setCount] = useState(narration.length);
  const [skip, setSkip] = useState(true);
  const spoken = useRef("");
  const scroller = useRef<HTMLDivElement>(null);

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
        return Math.min(narration.length, v + 4);
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [narration, skip, writing]);

  useEffect(() => {
    if (!voice || writing || spoken.current === narration) return;
    spoken.current = narration;
    void speak(narration, {
      voice: "fable",
      lang,
      onEnd: () => {
        const now = useGame.getState();
        const current = now.tales.find((t) => t.id === now.taleId);
        if (handsFree && current && !current.finished && !now.writing) startTalk();
      },
    });
  }, [voice, writing, narration, lang, handsFree]);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [count, writing, narration, tale.finished]);

  const done = !writing && count >= narration.length;
  const past = tale.log.slice(0, -1).slice(-6);
  const blocked = Boolean(tale.pendingRoll);

  return (
    <section
      aria-label="La narradora"
      className="flex min-h-0 flex-1 flex-col border-t border-gold/20 bg-ink/90 backdrop-blur lg:w-[27rem] lg:flex-none lg:border-t-0 lg:border-l"
    >
      <header className="flex items-center justify-between px-4 pt-3">
        <p className="font-sans text-xs tracking-widest text-gold-dim">LA NARRADORA</p>
        <div className="flex items-center">
          {!done && !writing ? (
            <button
              type="button"
              className="min-h-11 px-2 font-sans text-xs text-mist"
              onClick={() => {
                stopSpeaking();
                setSkip(true);
              }}
            >
              Salta
            </button>
          ) : null}
          <button
            type="button"
            className="flex size-11 items-center justify-center text-mist"
            aria-label="Torna-ho a escoltar"
            onClick={() => void speak(narration, { voice: "fable", lang })}
          >
            <Volume2 className="size-4" />
          </button>
        </div>
      </header>

      <div ref={scroller} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {past.map((entry, i) =>
          entry.role === "you" ? (
            <p key={i} className="mb-3 ml-8 text-right font-serif text-sm italic text-gold">
              {entry.text}
            </p>
          ) : (
            <div key={i} className="opacity-70">
              <Paragraphs text={entry.text} dim />
            </div>
          ),
        )}
        {writing ? (
          <p className="font-serif text-base text-mist" aria-live="polite">
            La narradora escriu<span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </p>
        ) : (
          <div key={tale.beat} className="rise">
            <Paragraphs text={narration.slice(0, count)} />
          </div>
        )}
        {blocked && done ? (
          <p className="font-serif text-sm text-gold">Els daus esperen a la taula.</p>
        ) : null}
        {done && !tale.finished && banner ? (
          <div className="-mx-4 mt-2">{banner}</div>
        ) : null}
        {done && tale.finished ? <EndCard tale={tale} /> : null}
      </div>

      {done && !tale.finished && !blocked ? (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {tale.choices.length > 0 && !module
            ? tale.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChoice(c.id, c.label)}
                  className="min-h-11 border border-gold/40 bg-gold/10 px-3 py-2 text-left font-serif text-sm text-gold-bright hover:bg-gold/20"
                >
                  {c.label}
                </button>
              ))
            : null}
          {module ? (
            <button
              type="button"
              onClick={() => say("què puc fer?")}
              className="min-h-11 border border-gold/25 px-3 font-sans text-xs tracking-widest text-gold-dim hover:text-gold"
            >
              QUÈ PUC FER?
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
