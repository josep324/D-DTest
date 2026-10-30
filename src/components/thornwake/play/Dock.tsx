import { useState } from "react";
import { Backpack, BookOpen, Dices, Eye, Footprints, Mic, Moon, Send, Sword } from "lucide-react";
import { restParty, say } from "@/lib/game/actions";
import { useGame } from "@/lib/game/store";
import type { Tale } from "@/lib/game/types";
import { canListen } from "@/lib/voice";
import { startTalk, useTalk } from "@/lib/talk";

function Tool({
  icon,
  label,
  onClick,
  on = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  on?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={`flex min-h-11 shrink-0 items-center gap-1.5 border px-3 font-sans text-xs transition disabled:opacity-35 ${
        on ? "border-gold bg-gold/15 text-gold-bright" : "border-gold/25 text-mist hover:text-parchment"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function Dock({ tale, module, onDice }: { tale: Tale; module: boolean; onDice: () => void }) {
  const writing = useGame((s) => s.writing);
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const setModal = useGame((s) => s.setModal);
  const hearing = useTalk((s) => s.hearing);
  const heard = useTalk((s) => s.heard);
  const [draft, setDraft] = useState("");
  const locked = writing || Boolean(tale.pendingRoll) || tale.finished;
  const resting = tale.rests <= 0 || Boolean(tale.encounter) || Boolean(tale.fight) || tale.finished || writing;

  return (
    <div className="border-t border-gold/20 bg-ink px-2 pb-3 pt-2 sm:px-3">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          if (!text || locked) return;
          setDraft("");
          say(text);
        }}
      >
        {canListen() ? (
          <button
            type="button"
            onClick={startTalk}
            aria-pressed={hearing}
            aria-label={hearing ? "Deixa d'escoltar" : "Digues què fas"}
            className={`flex size-14 shrink-0 items-center justify-center rounded-full border-2 transition ${
              hearing ? "mic-live border-blood bg-ember text-parchment" : "border-gold bg-gold/10 text-gold-bright hover:bg-gold/20"
            }`}
          >
            <Mic className="size-6" />
          </button>
        ) : null}
        <input
          value={hearing && heard ? heard : draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={hearing}
          maxLength={400}
          placeholder={
            hearing
              ? "T'escolto…"
              : tale.pendingRoll
                ? "Digues o escriu el número del dau"
                : module
                  ? "Què fa el teu personatge? Parla, mira, ves a…"
                  : "Què fa la companyia?"
          }
          className="h-12 min-w-0 flex-1 border border-gold/30 bg-ink px-3 font-serif text-base text-parchment outline-none placeholder:text-mist/70 focus:border-gold"
        />
        <button
          type="submit"
          disabled={locked || !draft.trim()}
          aria-label="Envia"
          className="flex size-12 shrink-0 items-center justify-center bg-ember text-parchment disabled:opacity-40"
        >
          <Send className="size-5" />
        </button>
      </form>
      <div className="scroll-thin mt-2 flex gap-1.5 overflow-x-auto">
        {!module ? (
          <>
            <Tool icon={<Footprints className="size-4" />} label="Mou" on={mode === "move"} onClick={() => setMode("move")} />
            <Tool icon={<Eye className="size-4" />} label="Mira" on={mode === "look"} onClick={() => setMode("look")} />
            <Tool icon={<Sword className="size-4" />} label="Ataca" on={mode === "strike"} onClick={() => setMode("strike")} />
          </>
        ) : null}
        <Tool icon={<Backpack className="size-4" />} label="Motxilla" onClick={() => setModal("pack")} />
        <Tool icon={<Dices className="size-4" />} label="Daus" onClick={onDice} disabled={locked} />
        <Tool icon={<Moon className="size-4" />} label={`Descans ${tale.rests}`} onClick={restParty} disabled={resting} />
        <Tool icon={<BookOpen className="size-4" />} label="Crònica" onClick={() => setModal("chronicle")} />
      </div>
    </div>
  );
}
