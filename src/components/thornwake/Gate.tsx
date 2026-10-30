import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Mark, Ornate, TextButton } from "@/components/thornwake/ui";
import { createTale } from "@/lib/game/logic";
import { useGame } from "@/lib/game/store";

export function Gate() {
  const setScreen = useGame((s) => s.setScreen);
  const setModal = useGame((s) => s.setModal);
  const sound = useGame((s) => s.sound);
  const setSound = useGame((s) => s.setSound);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <img
        src="/art/hero.jpg"
        alt="Un drac de bronze passant per una torre del castell al capvespre"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/20 to-ink/80" />
      <button
        type="button"
        aria-label={sound ? "Silencia la taula" : "Dona una mica de so a la taula"}
        onClick={() => setSound(!sound)}
        className="absolute top-4 left-4 z-10 flex size-11 items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-gold"
      >
        {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </button>
      <p className="absolute bottom-4 left-4 z-10 hidden font-serif text-sm text-mist/80 sm:block">
        La torre de ponent · al capvespre
      </p>
      <div className="relative z-10 flex min-h-dvh items-end justify-center p-4 sm:items-center sm:justify-end sm:p-10 lg:pr-20">
        <Ornate className="w-full max-w-md">
          <div className="flex flex-col items-center px-6 py-8 text-center sm:px-8">
            <Mark className="mb-3 size-10 text-gold" />
            <p className="font-sans text-xs tracking-widest text-mist">UN LLIBRE D'AVENTURES</p>
            <h1 className="gold-title mt-3 font-display text-4xl tracking-widest sm:text-5xl">THORNWAKE</h1>
            <p className="mt-2 font-serif text-sm text-gold-bright/90">La Campana d'Aiguaquieta</p>
            <div className="my-4 h-px w-16 bg-gold/40" />
            <p className="font-serif text-lg text-parchment">La teva taula t'espera.</p>
            <p className="mt-3 max-w-sm font-serif text-sm leading-relaxed text-mist">
              Un joc de rol de taula amb una narradora d'IA que parla. Una companyia, tres contes, perill suau.
              Seu i tria, o tasta el conte del riu.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <TextButton tone="solid" onClick={() => setScreen("select")}>
                <span className="inline-flex items-center justify-center gap-2">
                  Seu a la taula <ChevronRight className="size-4" />
                </span>
              </TextButton>
              <TextButton
                onClick={() => {
                  const { playerName, addTale } = useGame.getState();
                  addTale(createTale("stillwater", playerName));
                }}
              >
                Tasta un conte
              </TextButton>
            </div>
            <p className="mt-4 font-sans text-xs leading-relaxed text-mist">
              El tast obre Aiguaquieta. Qui vulgui pot seure; els contes es queden en aquest dispositiu.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs tracking-widest text-gold-dim">
              <button type="button" className="min-h-11" onClick={() => setModal("notes")}>
                NOTES DE LA TAULA
              </button>
              <button type="button" className="min-h-11" onClick={() => setModal("about")}>
                SOBRE EL JOC
              </button>
            </div>
          </div>
        </Ornate>
      </div>
    </main>
  );
}
