import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCampaign } from "@/lib/game/content";
import { decodeTale, encodeTale, localGm } from "@/lib/game/logic";
import { activeTale, useGame } from "@/lib/game/store";
import { consultStoryteller } from "@/lib/gm";
import { Gate } from "@/components/thornwake/Gate";
import { Play } from "@/components/thornwake/Play";
import { Select } from "@/components/thornwake/Select";
import { Ornate, TextButton } from "@/components/thornwake/ui";

export function Thornwake() {
  const screen = useGame((s) => s.screen);
  const hydrate = useGame((s) => s.hydrate);
  const sound = useGame((s) => s.sound);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!sound) return;
    const ac = new AudioContext();
    const gain = ac.createGain();
    gain.gain.value = 0.012;
    const low = ac.createOscillator();
    low.type = "sine";
    low.frequency.value = 92;
    const high = ac.createOscillator();
    high.type = "triangle";
    high.frequency.value = 146;
    const highGain = ac.createGain();
    highGain.gain.value = 0.4;
    low.connect(gain);
    high.connect(highGain).connect(gain);
    gain.connect(ac.destination);
    low.start();
    high.start();
    return () => {
      low.stop();
      high.stop();
      void ac.close();
    };
  }, [sound]);

  return (
    <>
      {screen === "gate" ? <Gate /> : null}
      {screen === "select" ? <Select /> : null}
      {screen === "play" ? <Play /> : null}
      <Modals />
    </>
  );
}

function Modals() {
  const modal = useGame((s) => s.modal);
  const setModal = useGame((s) => s.setModal);
  const tale = useGame(activeTale);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, setModal]);

  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/75 p-3 sm:items-center"
      role="presentation"
      onClick={() => setModal(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="modal-card w-full max-w-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Ornate variant={modal === "chronicle" ? "light" : "dark"} className="p-5 sm:p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className={`font-serif text-2xl ${modal === "chronicle" ? "text-soot" : "text-parchment"}`}>
              {titleFor(modal)}
            </h2>
            <button type="button" aria-label="Close" className="flex size-11 items-center justify-center" onClick={() => setModal(null)}>
              <X className="size-4" />
            </button>
          </div>
          {modal === "about" ? <About /> : null}
          {modal === "notes" ? <Notes /> : null}
          {modal === "settings" ? <Settings /> : null}
          {modal === "saves" ? <Saves /> : null}
          {modal === "join" ? <Join /> : null}
          {modal === "pack" && tale ? <Pack /> : null}
          {modal === "chronicle" && tale ? <Chronicle /> : null}
        </Ornate>
      </div>
    </div>
  );
}

function titleFor(modal: string) {
  switch (modal) {
    case "about":
      return "About this world";
    case "notes":
      return "Table notes";
    case "settings":
      return "Settings";
    case "saves":
      return "All saves";
    case "join":
      return "Join a friend";
    case "pack":
      return "The pack";
    case "chronicle":
      return "Your chronicle";
    default:
      return "";
  }
}

function About() {
  return (
    <div className="space-y-3 font-serif text-sm leading-relaxed text-mist">
      <p>
        Thornwake is a table for family quests. You play one company of four — Calder, Bramble, Vesper, and Holt —
        through three original tales.
      </p>
      <p>
        An AI storyteller sits at the head when the table can reach one. If it cannot, the written book takes over,
        and the chapter still moves. Mild peril, no gore, and nobody at this table dies.
      </p>
      <p>The tales are Ashpine Post, Stillwater Bell, and Dusk Harbor. None of them are someone else’s dungeon.</p>
    </div>
  );
}

function Notes() {
  return (
    <ul className="space-y-3 font-serif text-sm leading-relaxed text-mist">
      <li>Choose who acts by tapping a portrait. The ring on the board is the one who moves.</li>
      <li>Move, look, or strike by picking a marked place. Or write what the company does.</li>
      <li>Dice are honest. A high roll opens a door. A low one costs a little heart, never a life.</li>
      <li>Follow the story to read the chronicle. Tales stay in this browser until you retire them.</li>
      <li>Join a friend by pasting their tale-code. It is long on purpose: it is the whole chapter.</li>
    </ul>
  );
}

function Settings() {
  const playerName = useGame((s) => s.playerName);
  const setName = useGame((s) => s.setName);
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);
  return (
    <div className="space-y-4">
      <label className="block font-sans text-xs tracking-widest text-mist">
        NAME AT THE TABLE
        <input
          value={playerName}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          className="mt-2 h-11 w-full border border-gold/40 bg-ink/40 px-3 font-serif text-base text-parchment outline-none"
        />
      </label>
      <TextButton tone={sound ? "solid" : "ghost"} onClick={() => setSound(!sound)}>
        {sound ? "Sound is on" : "Sound is off"}
      </TextButton>
    </div>
  );
}

function Saves() {
  const tales = useGame((s) => s.tales);
  const openTale = useGame((s) => s.openTale);
  const retireTale = useGame((s) => s.retireTale);
  const setModal = useGame((s) => s.setModal);
  const [armed, setArmed] = useState<string | null>(null);
  if (tales.length === 0) {
    return <p className="font-serif text-sm text-mist">No tales yet. Choose one and begin.</p>;
  }
  return (
    <ul className="space-y-3">
      {tales.map((t) => {
        const campaign = getCampaign(t.campaignId);
        return (
          <li key={t.id} className="border border-gold/30 p-3">
            <p className="font-serif text-parchment">{campaign?.name ?? "A tale"}</p>
            <p className="font-sans text-xs text-mist">
              {t.playerName} · Day {t.day} · {new Date(t.updatedAt).toLocaleString()}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <TextButton
                tone="solid"
                onClick={() => {
                  openTale(t.id);
                }}
              >
                Continue
              </TextButton>
              <TextButton
                onClick={() => {
                  if (armed === t.id) {
                    retireTale(t.id);
                    setArmed(null);
                  } else setArmed(t.id);
                }}
              >
                {armed === t.id ? "Retire it" : "Retire"}
              </TextButton>
            </div>
            <button
              type="button"
              className="mt-2 min-h-11 font-sans text-xs tracking-widest text-gold"
              onClick={() => {
                sessionStorage.setItem("thornwake-share", encodeTale(t));
                setModal("join");
              }}
            >
              Share tale-code
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Join() {
  const addTale = useGame((s) => s.addTale);
  const [code, setCode] = useState(() => sessionStorage.getItem("thornwake-share") ?? "");
  const [error, setError] = useState("");
  return (
    <div className="space-y-3">
      <p className="font-serif text-sm leading-relaxed text-mist">
        Paste a tale-code from another table, or copy one from your saves to pass along. Nothing is uploaded.
      </p>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={5}
        className="w-full border border-gold/40 bg-ink/40 p-3 font-sans text-xs text-parchment outline-none"
        placeholder="Tale-code"
      />
      {error ? <p className="font-serif text-sm text-gold-bright">{error}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        <TextButton
          tone="solid"
          onClick={() => {
            const tale = decodeTale(code);
            if (!tale) {
              setError("That code does not open. Check that the whole line was copied.");
              return;
            }
            sessionStorage.removeItem("thornwake-share");
            addTale(tale);
          }}
        >
          Sit down
        </TextButton>
        <TextButton
          onClick={() => {
            if (!code) return;
            void navigator.clipboard?.writeText(code);
          }}
        >
          Copy
        </TextButton>
      </div>
    </div>
  );
}

function Pack() {
  const tale = useGame(activeTale);
  const setModal = useGame((s) => s.setModal);
  if (!tale) return null;
  const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
  return (
    <ul className="space-y-2">
      {tale.inventory.map((item) => {
        const owner = tale.party.find((p) => p.id === item.ownerId);
        return (
          <li key={item.id} className="flex items-start justify-between gap-3 border border-gold/25 p-3">
            <div>
              <p className="font-serif text-parchment">{item.name}</p>
              <p className="font-serif text-sm text-mist">{item.detail}</p>
              <p className="font-sans text-xs text-gold-dim">{owner?.name}</p>
            </div>
            <button
              type="button"
              className="min-h-11 shrink-0 px-2 font-sans text-xs tracking-widest text-gold"
              onClick={() => {
                setModal(null);
                const line = `${actor.name} uses the ${item.name.toLowerCase()}. ${item.detail}`;
                void runLine(line);
              }}
            >
              Use
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Chronicle() {
  const tale = useGame(activeTale);
  const [tab, setTab] = useState<"read" | "scenes" | "finds">("read");
  if (!tale) return null;
  const campaign = getCampaign(tale.campaignId);
  const latest = tale.chronicle[tale.chronicle.length - 1];
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {(
          [
            ["read", "Read"],
            ["scenes", "Scenes"],
            ["finds", "Discoveries"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-11 border text-sm ${tab === id ? "border-gold-dim bg-parchment-deep text-soot" : "border-gold-dim/30 text-soot"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "read" ? (
        <div>
          <p className="font-sans text-xs tracking-widest text-gold-dim">
            Day {tale.day} of your adventure · {campaign?.name}
          </p>
          {latest ? (
            <>
              <h3 className="mt-3 font-serif text-2xl text-soot">{latest.title}</h3>
              <img src={latest.image} alt="" className="mt-3 aspect-video w-full object-cover" />
              <div className="mt-4 space-y-4">
                {[...tale.chronicle].reverse().map((entry) => (
                  <article key={entry.id}>
                    <p className="font-sans text-xs text-gold-dim">
                      {entry.sceneName} · Day {entry.day}
                    </p>
                    <h4 className="font-serif text-lg text-soot">{entry.title}</h4>
                    <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap text-soot">{entry.body}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      {tab === "scenes" ? (
        <ul className="space-y-2">
          {(campaign?.scenes ?? []).map((scene) => {
            const seen = tale.chronicle.some((c) => c.sceneName === scene.name) || tale.sceneId === scene.id;
            return (
              <li key={scene.id} className="flex items-center gap-3 border border-gold-dim/30 p-2">
                <img src={scene.image} alt="" className="size-14 object-cover" />
                <div>
                  <p className="font-serif text-soot">{scene.name}</p>
                  <p className="font-sans text-xs text-gold-dim">{seen ? "Visited" : "Not yet"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {tab === "finds" ? (
        <div className="space-y-3 font-serif text-sm text-soot">
          <p>
            <span className="font-sans text-xs tracking-widest text-gold-dim">NOW</span>
            <br />
            {tale.quest.title}. {tale.quest.detail}
          </p>
          <ul className="space-y-2">
            {tale.inventory.map((item) => (
              <li key={item.id}>
                {item.name} — {item.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

async function runLine(line: string) {
  const state = useGame.getState();
  const current = activeTale(state);
  if (!current || state.writing) return;
  state.setWriting(true);
  const local = localGm(current, { text: line });
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
      },
    });
    if (res.ok) state.commit(current.id, line, res.result, "live");
    else state.commit(current.id, line, local, "book");
  } catch {
    state.commit(current.id, line, local, "book");
  }
}
