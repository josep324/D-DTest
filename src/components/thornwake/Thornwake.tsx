import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCampaign } from "@/lib/game/content";
import { consumeItem } from "@/lib/game/actions";
import { decodeTale, encodeTale } from "@/lib/game/logic";
import { activeTale, useGame, type Lang } from "@/lib/game/store";
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
        through three original tales, as two players and a storyteller who speaks.
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
      <li>Two players share the table: one takes Calder and Bramble, the other Vesper and Holt. The app is the storyteller.</li>
      <li>Say or type what the company does. When it is uncertain, the storyteller asks for a roll: use the app’s die or a real d20 from the table, typed or spoken.</li>
      <li>Advantage when a companion stands beside you or an item gives an edge. A natural 20 always lands, a natural 1 always stumbles.</li>
      <li>Strike a tense place to start a scene of trouble. Roll initiative, take turns, and press the trouble back until it calms.</li>
      <li>Nobody dies. A hero at 1 heart is pulled back. Rest twice per tale, and use the honey-cake or splint-wrap to heal.</li>
      <li>Tales stay in this browser. Share a tale-code to continue on another device.</li>
    </ul>
  );
}

function Settings() {
  const playerName = useGame((s) => s.playerName);
  const setName = useGame((s) => s.setName);
  const partner = useGame((s) => s.partner);
  const setPartner = useGame((s) => s.setPartner);
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);
  const voice = useGame((s) => s.voice);
  const setVoice = useGame((s) => s.setVoice);
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const input =
    "mt-2 h-11 w-full border border-gold/40 bg-ink/40 px-3 font-serif text-base text-parchment outline-none";
  return (
    <div className="space-y-4">
      <label className="block font-sans text-xs tracking-widest text-mist">
        FIRST PLAYER · CALDER AND BRAMBLE
        <input value={playerName} onChange={(e) => setName(e.target.value)} maxLength={24} className={input} />
      </label>
      <label className="block font-sans text-xs tracking-widest text-mist">
        SECOND PLAYER · VESPER AND HOLT (OPTIONAL)
        <input value={partner} onChange={(e) => setPartner(e.target.value)} maxLength={24} className={input} />
      </label>
      <fieldset>
        <legend className="font-sans text-xs tracking-widest text-mist">LANGUAGE OF THE STORYTELLER</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ["en", "English"],
              ["ca", "Català"],
              ["es", "Español"],
            ] as [Lang, string][]
          ).map(([id, label]) => (
            <TextButton key={id} tone={lang === id ? "solid" : "ghost"} onClick={() => setLang(id)}>
              {label}
            </TextButton>
          ))}
        </div>
        <p className="mt-2 font-serif text-xs text-mist">
          The live storyteller writes and speaks in this language. The offline table book is English only.
        </p>
      </fieldset>
      <TextButton tone={voice ? "solid" : "ghost"} onClick={() => setVoice(!voice)}>
        {voice ? "The storyteller speaks aloud" : "The storyteller is silent"}
      </TextButton>
      <TextButton tone={sound ? "solid" : "ghost"} onClick={() => setSound(!sound)}>
        {sound ? "Room sound is on" : "Room sound is off"}
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
              {t.playerName}
              {t.partner ? ` & ${t.partner}` : ""} · Day {t.day} · Level {t.level}
              {t.finished ? " · Completed" : ""} · {new Date(t.updatedAt).toLocaleString()}
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
  return (
    <ul className="space-y-2">
      {tale.inventory.map((item) => {
        const owner = tale.party.find((p) => p.id === item.ownerId);
        return (
          <li key={item.id} className="flex items-start justify-between gap-3 border border-gold/25 p-3">
            <div>
              <p className="font-serif text-parchment">{item.name}</p>
              <p className="font-serif text-sm text-mist">{item.detail}</p>
              <p className="font-sans text-xs text-gold-dim">
                {owner?.name}
                {item.uses ? ` · ${item.uses} left` : ""}
                {item.effect === "edge" ? " · gives an edge" : ""}
              </p>
            </div>
            <button
              type="button"
              className="min-h-11 shrink-0 px-2 font-sans text-xs tracking-widest text-gold"
              onClick={() => {
                setModal(null);
                consumeItem(item);
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
