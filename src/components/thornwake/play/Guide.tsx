import { Compass, Play as PlayIcon, X } from "lucide-react";
import type { GuideStep } from "@/lib/game/types";

/** The coach: one thing to try, how to say it, and a button that says it for you. */
export function Guide({
  step,
  index,
  total,
  busy,
  onSay,
  onHide,
}: {
  step: GuideStep;
  index: number;
  total: number;
  busy: boolean;
  onSay: (phrase: string) => void;
  onHide: () => void;
}) {
  return (
    <section aria-label="Guia" className="rise mx-4 mb-2 border border-gold-bright bg-gold/10 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-sans text-xs tracking-widest text-gold">
          <Compass className="size-3.5" aria-hidden />
          PAS {index + 1} DE {total}
        </p>
        <button
          type="button"
          aria-label="Amaga la guia"
          onClick={onHide}
          className="flex size-8 items-center justify-center text-mist hover:text-parchment"
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 className="mt-1 font-serif text-base text-gold-bright">{step.title}</h2>
      <p className="mt-1 font-serif text-sm leading-relaxed text-parchment">{step.text}</p>
      {step.phrase ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onSay(step.phrase as string)}
          className="mt-2 flex min-h-11 w-full items-center gap-2 border border-gold bg-gold/15 px-3 text-left font-serif text-sm text-gold-bright hover:bg-gold/25 disabled:opacity-40"
        >
          <PlayIcon className="size-4 shrink-0" aria-hidden />
          <span>
            <span className="block font-sans text-xs tracking-widest text-gold">DIGUES-HO</span>«
            {step.phrase}»
          </span>
        </button>
      ) : (
        <p className="mt-2 border border-gold/40 px-3 py-2 font-sans text-xs tracking-widest text-gold">
          ARA TOCA-HO TU
        </p>
      )}
      <div className="mt-2 h-1 bg-gold/20" aria-hidden>
        <div
          className="h-full bg-gold transition-[width] duration-500"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>
    </section>
  );
}
