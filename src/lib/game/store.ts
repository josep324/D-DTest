import { create } from "zustand";
import { applyTale, normalizeTale } from "@/lib/game/logic";
import type { DiceShow, GmResult, Mechanics, RollRequest, Tale } from "@/lib/game/types";

const KEY = "thornwake.v1";

export type ModalName = "saves" | "join" | "about" | "settings" | "chronicle" | "pack" | "notes" | null;
export type Screen = "gate" | "select" | "play";
export type Mode = "move" | "look" | "strike";

export type Lang = "en" | "ca" | "es";

type Persisted = {
  playerName: string;
  tales: Tale[];
  sound: boolean;
  voice: boolean;
  lang: Lang;
  partner: string;
};

type Store = {
  screen: Screen;
  playerName: string;
  tales: Tale[];
  taleId: string | null;
  worldIndex: number;
  pickedId: string | null;
  mode: Mode;
  storyOpen: boolean;
  modal: ModalName;
  sound: boolean;
  voice: boolean;
  lang: Lang;
  partner: string;
  writing: boolean;
  toldBy: "live" | "book" | null;
  dice: DiceShow | null;
  hydrated: boolean;
  setScreen: (screen: Screen) => void;
  setWorld: (index: number) => void;
  pick: (id: string | null) => void;
  setMode: (mode: Mode) => void;
  setStoryOpen: (open: boolean) => void;
  setModal: (modal: ModalName) => void;
  setSound: (sound: boolean) => void;
  setVoice: (voice: boolean) => void;
  setLang: (lang: Lang) => void;
  setPartner: (partner: string) => void;
  setPending: (request: RollRequest | null) => void;
  setWriting: (writing: boolean) => void;
  setToldBy: (toldBy: "live" | "book" | null) => void;
  setDice: (dice: DiceShow | null) => void;
  setName: (playerName: string) => void;
  hydrate: () => void;
  addTale: (tale: Tale) => void;
  openTale: (id: string) => void;
  retireTale: (id: string) => void;
  commit: (id: string, line: string, result: GmResult, toldBy: "live" | "book", mech?: Mechanics) => void;
  setActive: (id: string) => void;
};

function snapshot(patch: Partial<Persisted> = {}): Persisted {
  const s = useGame.getState();
  return {
    playerName: s.playerName,
    tales: s.tales,
    sound: s.sound,
    voice: s.voice,
    lang: s.lang,
    partner: s.partner,
    ...patch,
  };
}

function persist(slice: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slice));
  } catch {
    /* private mode */
  }
}

export const useGame = create<Store>((set, get) => ({
  screen: "gate",
  playerName: "Viatger",
  tales: [],
  taleId: null,
  worldIndex: -1,
  pickedId: null,
  mode: "move",
  storyOpen: true,
  modal: null,
  sound: false,
  voice: true,
  lang: "ca",
  partner: "",
  writing: false,
  toldBy: null,
  dice: null,
  hydrated: false,
  setScreen: (screen) => set({ screen, modal: null }),
  setWorld: (worldIndex) => set({ worldIndex }),
  pick: (pickedId) => set({ pickedId }),
  setMode: (mode) => set({ mode }),
  setStoryOpen: (storyOpen) => set({ storyOpen }),
  setModal: (modal) => set({ modal }),
  setSound: (sound) => {
    set({ sound });
    persist(snapshot({ sound }));
  },
  setVoice: (voice) => {
    set({ voice });
    persist(snapshot({ voice }));
  },
  setLang: (lang) => {
    set({ lang });
    persist(snapshot({ lang }));
  },
  setPartner: (value) => {
    const partner = value.slice(0, 24);
    set((s) => ({
      partner,
      tales: s.tales.map((t) => (t.id === s.taleId ? { ...t, partner } : t)),
    }));
    persist(snapshot({ partner }));
  },
  setPending: (request) => {
    set((s) => ({
      tales: s.tales.map((t) => (t.id === s.taleId ? { ...t, pendingRoll: request } : t)),
    }));
  },
  setWriting: (writing) => set({ writing }),
  setToldBy: (toldBy) => set({ toldBy }),
  setDice: (dice) => set({ dice }),
  setName: (playerName) => {
    const name = playerName.slice(0, 24);
    set((s) => ({
      playerName: name,
      tales: s.tales.map((t) => (t.id === s.taleId ? { ...t, playerName: name || t.playerName } : t)),
    }));
    persist(snapshot({ playerName: name }));
  },
  hydrate: () => {
    if (get().hydrated) return;
    set({ hydrated: true });
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Persisted;
      if (!data || !Array.isArray(data.tales)) return;
      set({
        playerName: typeof data.playerName === "string" && data.playerName ? data.playerName : "Viatger",
        tales: data.tales.map(normalizeTale),
        sound: Boolean(data.sound),
        voice: data.voice !== false,
        lang: data.lang === "en" || data.lang === "es" ? data.lang : "ca",
        partner: typeof data.partner === "string" ? data.partner : "",
      });
    } catch {
      /* ignore broken saves */
    }
  },
  addTale: (tale) => {
    tale = { ...tale, partner: tale.partner || get().partner };
    const tales = [tale, ...get().tales].slice(0, 12);
    set({ tales, taleId: tale.id, screen: "play", storyOpen: true, mode: "move", modal: null, toldBy: null });
    persist(snapshot({ playerName: tale.playerName, tales }));
  },
  openTale: (id) => set({ taleId: id, screen: "play", modal: null, storyOpen: true, mode: "move" }),
  retireTale: (id) => {
    const tales = get().tales.filter((t) => t.id !== id);
    set({ tales, taleId: get().taleId === id ? null : get().taleId });
    persist(snapshot({ tales }));
  },
  commit: (id, line, result, toldBy, mech) => {
    const tales = get().tales.map((t) => (t.id === id ? applyTale(t, line, result, mech) : t));
    set({ tales, toldBy, writing: false, dice: null });
    persist(snapshot({ tales }));
  },
  setActive: (id) => {
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.taleId && !(t.encounter && t.encounter.order[t.encounter.turn] !== id) ? { ...t, activeId: id } : t,
      ),
    }));
  },
}));

export function activeTale(state: Store): Tale | null {
  return state.tales.find((t) => t.id === state.taleId) ?? null;
}
