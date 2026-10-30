import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCampaign } from "@/lib/game/content";
import { consumeItem } from "@/lib/game/actions";
import { decodeTale, encodeTale } from "@/lib/game/logic";
import { activeTale, useGame } from "@/lib/game/store";
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
            <button type="button" aria-label="Tanca" className="flex size-11 items-center justify-center" onClick={() => setModal(null)}>
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
      return "Sobre aquest món";
    case "notes":
      return "Notes de la taula";
    case "settings":
      return "Ajustos";
    case "saves":
      return "Totes les partides";
    case "join":
      return "Continua un conte";
    case "pack":
      return "La motxilla";
    case "chronicle":
      return "La teva crònica";
    default:
      return "";
  }
}

function About() {
  return (
    <div className="space-y-3 font-serif text-sm leading-relaxed text-mist">
      <p>
        Thornwake és una taula per a aventures en família. Jugueu una companyia de quatre — Calder, Bramble, Vesper i
        Holt — a través de tres contes originals, dos jugadors i una narradora que parla.
      </p>
      <p>
        Una narradora d'IA seu al capdavant quan la taula pot arribar-hi. Si no, el llibre escrit pren el relleu i el
        capítol segueix avançant. Perill suau, sense sang, i a aquesta taula no es mor ningú.
      </p>
      <p>Els contes són El Correu de Pinassa, La Campana d'Aiguaquieta i Port del Crepuscle. Cap no és la masmorra de ningú altre.</p>
    </div>
  );
}

function Notes() {
  return (
    <ul className="space-y-3 font-serif text-sm leading-relaxed text-mist">
      <li>Dos jugadors comparteixen la taula: un porta en Calder i la Bramble, l'altre la Vesper i en Holt. L'app és la narradora.</li>
      <li>A les aventures de rol (com «El Cofre de la Fornera») no hi ha botons: digueu o escriviu el que fa el vostre personatge, com «parlo amb la fornera», «forço la porta» o «ataco la rata». Digueu «què puc fer?» si us encalleu.</li>
      <li>Digueu o escriviu què fa la companyia. Quan és incert, la narradora demana una tirada: feu servir el dau de l'app o un d20 real de la taula, escrit o dit en veu alta.</li>
      <li>Avantatge si un company és al costat o un objecte et dóna avantatge. Un 20 natural sempre reïx, un 1 natural sempre falla.</li>
      <li>Ataca un lloc tens per començar un problema. Tireu iniciativa, feu torns i feu recular el problema fins que es calmi.</li>
      <li>No es mor ningú. Un heroi amb 1 cor és retirat pels altres. Descanseu dues vegades per conte i feu servir el pastís de mel o l'embenat per curar.</li>
      <li>Els contes es queden en aquest navegador. Compartiu un codi de conte per continuar en un altre dispositiu.</li>
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
  const handsFree = useGame((s) => s.handsFree);
  const setHandsFree = useGame((s) => s.setHandsFree);
  const hardcore = useGame((s) => s.hardcore);
  const setHardcore = useGame((s) => s.setHardcore);
  const input =
    "mt-2 h-11 w-full border border-gold/40 bg-ink/40 px-3 font-serif text-base text-parchment outline-none";
  return (
    <div className="space-y-4">
      <label className="block font-sans text-xs tracking-widest text-mist">
        PRIMER JUGADOR · CALDER I BRAMBLE
        <input value={playerName} onChange={(e) => setName(e.target.value)} maxLength={24} className={input} />
      </label>
      <label className="block font-sans text-xs tracking-widest text-mist">
        SEGON JUGADOR · VESPER I HOLT (OPCIONAL)
        <input value={partner} onChange={(e) => setPartner(e.target.value)} maxLength={24} className={input} />
      </label>
      <TextButton tone={voice ? "solid" : "ghost"} onClick={() => setVoice(!voice)}>
        {voice ? "La narradora parla en veu alta" : "La narradora és en silenci"}
      </TextButton>
      <TextButton tone={handsFree ? "solid" : "ghost"} onClick={() => setHandsFree(!handsFree)}>
        {handsFree ? "Mode veu: la narradora t'escolta sola" : "Mode veu desactivat (prem el micròfon)"}
      </TextButton>
      <TextButton tone={hardcore ? "solid" : "ghost"} onClick={() => setHardcore(!hardcore)}>
        {hardcore ? "Mort real: tres salvacions fallides i l'heroi cau" : "Mort suau: els companys sempre arriben a temps"}
      </TextButton>
      <p className="font-serif text-xs text-mist">La mort real només s'aplica a les aventures noves de rol i a les partides que comencis a partir d'ara.</p>
      <TextButton tone={sound ? "solid" : "ghost"} onClick={() => setSound(!sound)}>
        {sound ? "Efectes de so i ambient activats" : "Efectes de so i ambient desactivats"}
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
    return <p className="font-serif text-sm text-mist">Encara no hi ha cap conte. Tria'n un i comença.</p>;
  }
  return (
    <ul className="space-y-3">
      {tales.map((t) => {
        const campaign = getCampaign(t.campaignId);
        return (
          <li key={t.id} className="border border-gold/30 p-3">
            <p className="font-serif text-parchment">{campaign?.name ?? "Un conte"}</p>
            <p className="font-sans text-xs text-mist">
              {t.playerName}
              {t.partner ? ` & ${t.partner}` : ""} · Dia {t.day} · Nivell {t.level}
              {t.finished ? " · Acabat" : ""} · {new Date(t.updatedAt).toLocaleString("ca-ES")}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <TextButton
                tone="solid"
                onClick={() => {
                  openTale(t.id);
                }}
              >
                Continua
              </TextButton>
              <TextButton
                onClick={() => {
                  if (armed === t.id) {
                    retireTale(t.id);
                    setArmed(null);
                  } else setArmed(t.id);
                }}
              >
                {armed === t.id ? "Confirma" : "Retira"}
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
              Comparteix el codi del conte
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
        Enganxa un codi de conte d'una altra taula, o copia'n un de les teves partides per passar-lo. No es puja res enlloc.
      </p>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={5}
        className="w-full border border-gold/40 bg-ink/40 p-3 font-sans text-xs text-parchment outline-none"
        placeholder="Codi del conte"
      />
      {error ? <p className="font-serif text-sm text-gold-bright">{error}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        <TextButton
          tone="solid"
          onClick={() => {
            const tale = decodeTale(code);
            if (!tale) {
              setError("Aquest codi no s'obre. Comprova que s'hagi copiat tota la línia.");
              return;
            }
            sessionStorage.removeItem("thornwake-share");
            addTale(tale);
          }}
        >
          Seu
        </TextButton>
        <TextButton
          onClick={() => {
            if (!code) return;
            void navigator.clipboard?.writeText(code);
          }}
        >
          Copia
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
                {item.uses ? ` · en queden ${item.uses}` : ""}
                {item.effect === "edge" ? " · dóna avantatge" : ""}
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
              Usa
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
            ["read", "Llegeix"],
            ["scenes", "Escenes"],
            ["finds", "Descobertes"],
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
            Dia {tale.day} de la teva aventura · {campaign?.name}
          </p>
          {latest ? (
            <>
              <h3 className="mt-3 font-serif text-2xl text-soot">{latest.title}</h3>
              <img src={latest.image} alt="" className="mt-3 aspect-video w-full object-cover" />
              <div className="mt-4 space-y-4">
                {[...tale.chronicle].reverse().map((entry) => (
                  <article key={entry.id}>
                    <p className="font-sans text-xs text-gold-dim">
                      {entry.sceneName} · Dia {entry.day}
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
                  <p className="font-sans text-xs text-gold-dim">{seen ? "Visitada" : "Encara no"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {tab === "finds" ? (
        <div className="space-y-3 font-serif text-sm text-soot">
          <p>
            <span className="font-sans text-xs tracking-widest text-gold-dim">ARA</span>
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
