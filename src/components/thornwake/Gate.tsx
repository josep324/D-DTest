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
        alt="A bronze dragon passing a castle turret at dusk"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/20 to-ink/80" />
      <button
        type="button"
        aria-label={sound ? "Silence the table" : "Give the table a little sound"}
        onClick={() => setSound(!sound)}
        className="absolute top-4 left-4 z-10 flex size-11 items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-gold"
      >
        {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </button>
      <p className="absolute bottom-4 left-4 z-10 hidden font-serif text-sm text-mist/80 sm:block">
        The western turret · at dusk
      </p>
      <div className="relative z-10 flex min-h-dvh items-end justify-center p-4 sm:items-center sm:justify-end sm:p-10 lg:pr-20">
        <Ornate className="w-full max-w-md">
          <div className="flex flex-col items-center px-6 py-8 text-center sm:px-8">
            <Mark className="mb-3 size-10 text-gold" />
            <p className="font-sans text-xs tracking-widest text-mist">A BOOK OF ADVENTURES</p>
            <h1 className="gold-title mt-3 font-display text-4xl tracking-widest sm:text-5xl">THORNWAKE</h1>
            <p className="mt-2 font-serif text-sm text-gold-bright/90">Stillwater Bell</p>
            <div className="my-4 h-px w-16 bg-gold/40" />
            <p className="font-serif text-lg text-parchment">Your table awaits.</p>
            <p className="mt-3 max-w-sm font-serif text-sm leading-relaxed text-mist">
              A tabletop roleplaying game with an AI storyteller. One company, three tales, mild peril.
              Sit down and choose, or preview the river story.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <TextButton tone="solid" onClick={() => setScreen("select")}>
                <span className="inline-flex items-center justify-center gap-2">
                  Sit at the table <ChevronRight className="size-4" />
                </span>
              </TextButton>
              <TextButton
                onClick={() => {
                  const { playerName, addTale } = useGame.getState();
                  addTale(createTale("stillwater", playerName));
                }}
              >
                Preview a tale
              </TextButton>
            </div>
            <p className="mt-4 font-sans text-xs leading-relaxed text-mist">
              Preview opens Stillwater. Anyone can sit; tales stay on this device.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs tracking-widest text-gold-dim">
              <button type="button" className="min-h-11" onClick={() => setModal("notes")}>
                TABLE NOTES
              </button>
              <button type="button" className="min-h-11" onClick={() => setModal("about")}>
                ABOUT
              </button>
            </div>
          </div>
        </Ornate>
      </div>
    </main>
  );
}
