import { ChevronLeft, ChevronRight } from "lucide-react";
import { CAMPAIGNS } from "@/lib/game/content";
import { createTale } from "@/lib/game/logic";
import { useGame } from "@/lib/game/store";
import { Mark, Ornate, TextButton } from "@/components/thornwake/ui";

export function Select() {
  const worldIndex = useGame((s) => s.worldIndex);
  const setWorld = useGame((s) => s.setWorld);
  const pickedId = useGame((s) => s.pickedId);
  const pick = useGame((s) => s.pick);
  const playerName = useGame((s) => s.playerName);
  const setScreen = useGame((s) => s.setScreen);
  const setModal = useGame((s) => s.setModal);
  const addTale = useGame((s) => s.addTale);

  const focused = worldIndex >= 0 ? CAMPAIGNS[worldIndex] : null;
  const bg = focused ? focused.scenes[0].image : "/art/table.jpg";
  const picked = CAMPAIGNS.find((c) => c.id === pickedId) ?? null;

  function cycle(dir: -1 | 1) {
    const next = worldIndex + dir;
    if (next < -1) setWorld(CAMPAIGNS.length - 1);
    else if (next >= CAMPAIGNS.length) setWorld(-1);
    else setWorld(next);
    const id = next >= 0 && next < CAMPAIGNS.length ? CAMPAIGNS[next].id : null;
    if (id) pick(id);
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <img
        src={bg}
        alt={focused ? focused.scenes[0].name : "La taula d'una narradora amb un mapa, daus i miniatures"}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/55 to-ink/10" />
      {focused ? (
        <button
          type="button"
          onClick={() => setWorld(-1)}
          className="absolute top-4 left-1/2 z-10 -translate-x-1/2 border border-gold/50 bg-parchment px-4 py-2 font-sans text-xs tracking-widest text-soot"
        >
          TOTS ELS MONS
        </button>
      ) : null}
      <button
        type="button"
        aria-label="Món anterior"
        onClick={() => cycle(-1)}
        className="absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold sm:left-6"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label="Món següent"
        onClick={() => cycle(1)}
        className="absolute top-1/2 right-3 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold sm:flex"
      >
        <ChevronRight />
      </button>
      <button
        type="button"
        onClick={() => setModal("settings")}
        className="absolute bottom-4 left-4 z-10 flex min-h-11 items-center gap-2 rounded-full border border-gold/40 bg-ink/70 pr-3 pl-1 text-sm text-parchment"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-gold/20 font-display text-gold">
          {playerName.slice(0, 1).toUpperCase()}
        </span>
        {playerName}
      </button>
      <div className="relative z-10 flex min-h-dvh items-end justify-center p-4 sm:items-center sm:justify-end sm:p-8 lg:pr-16">
        <Ornate className="mb-16 w-full max-w-md sm:mb-0">
          <div className="px-5 py-6 sm:px-6">
            <h2 className="text-center font-serif text-2xl text-parchment">Tria la teva aventura</h2>
            <p className="mt-2 text-center font-serif text-sm leading-relaxed text-mist">
              {picked ? picked.blurb : "Quatre aventures reposen a la taula. Si és la primera vegada, comença per «El Cofre de la Fornera»: t'ensenya a jugar."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {CAMPAIGNS.map((c, i) => {
                const on = pickedId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      pick(c.id);
                      setWorld(i);
                    }}
                    className={`flex min-h-28 flex-col items-center gap-2 border px-1 py-3 text-center ${
                      on ? "border-gold bg-gold/10" : "border-gold/25 bg-ink/30"
                    }`}
                  >
                    <span className="size-12 overflow-hidden rounded-full border border-gold/50">
                      <img src={c.scenes[0].image} alt="" className="size-full object-cover" />
                    </span>
                    <span className="font-serif text-xs leading-tight text-parchment">{c.name}</span>
                    <span className="font-sans text-xs leading-tight text-mist">
                      {c.chapters}
                      <br />
                      {c.levels}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <TextButton
                tone="solid"
                disabled={!picked}
                onClick={() => {
                  if (!picked) return;
                  addTale(createTale(picked.id, playerName));
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Mark className="size-4" />
                  {picked ? `Comença ${picked.name}` : "Tria un conte"}
                  <Mark className="size-4" />
                </span>
              </TextButton>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <TextButton onClick={() => setModal("saves")}>Totes les partides</TextButton>
              <TextButton onClick={() => setModal("join")}>Continua un conte</TextButton>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-sans text-xs tracking-widest text-gold-dim">
              <button type="button" className="min-h-11" onClick={() => cycle(1)}>
                MIRA LA TAULA
              </button>
              <button type="button" className="min-h-11" onClick={() => setModal("about")}>
                SOBRE AQUEST MÓN
              </button>
              <button type="button" className="min-h-11" onClick={() => setModal("settings")}>
                AJUSTOS
              </button>
              <button type="button" className="min-h-11" onClick={() => setModal("notes")}>
                NOTES DE LA TAULA
              </button>
              <button type="button" className="min-h-11" onClick={() => setScreen("gate")}>
                SURT DE LA TAULA
              </button>
            </div>
          </div>
        </Ornate>
      </div>
    </main>
  );
}
