import { create } from "zustand";
import { rollFor, say } from "@/lib/game/actions";
import { activeTale, useGame } from "@/lib/game/store";
import { canListen, listen, numberFromSpeech } from "@/lib/voice";

export const useTalk = create<{ hearing: boolean; heard: string }>(() => ({ hearing: false, heard: "" }));

let stop: (() => void) | null = null;

export function stopTalk() {
  stop?.();
}

/**
 * Open the microphone. What is said becomes an action, or, when a roll is waiting,
 * the number on the table die ("un 14") or a request for the app to roll ("tira per mi").
 */
export function startTalk() {
  if (useTalk.getState().hearing) {
    stop?.();
    return;
  }
  if (!canListen()) return;
  useTalk.setState({ hearing: true, heard: "" });
  stop = listen(useGame.getState().lang, {
    onText: (heard) => useTalk.setState({ heard }),
    onFinal: (text) => {
      useTalk.setState({ heard: "" });
      const pending = activeTale(useGame.getState())?.pendingRoll;
      if (pending) {
        const n = numberFromSpeech(text);
        if (n) rollFor(pending, undefined, n);
        else if (/tir|dau|per mi|endavant/i.test(text)) rollFor(pending);
        return;
      }
      say(text);
    },
    onEnd: () => useTalk.setState({ hearing: false }),
  });
}
