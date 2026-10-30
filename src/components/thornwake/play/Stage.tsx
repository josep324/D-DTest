import type { ReactNode } from "react";
import { Eye, DoorOpen, Hand, MapPin, MessageCircle, Swords } from "lucide-react";
import type { Hotspot, Scene, Tale } from "@/lib/game/types";

function weatherFx(weather: string): string {
  const w = weather.toLowerCase();
  if (w.includes("pluja")) return "fx-rain";
  if (w.includes("neu")) return "fx-snow";
  if (w.includes("boira") || w.includes("fum")) return "fx-fog";
  return "";
}

function tint(daypart: string): string {
  const d = daypart.toLowerCase();
  if (d.includes("capvespre") || d.includes("crepuscle") || d.includes("posta"))
    return "bg-ember/15 mix-blend-multiply";
  if (d.includes("nit")) return "bg-ink/45";
  return "";
}

function PinIcon({ spot }: { spot: Hotspot }) {
  const cls = "size-4";
  switch (spot.kind) {
    case "npc":
      return <MessageCircle className={cls} />;
    case "item":
      return <Hand className={cls} />;
    case "exit":
      return <DoorOpen className={cls} />;
    case "foe":
      return <Swords className={cls} />;
    case "feature":
      return <Eye className={cls} />;
    default:
      return <MapPin className={cls} />;
  }
}

export function Stage({
  tale,
  scene,
  spots,
  locked,
  onPin,
  children,
}: {
  tale: Tale;
  scene: Scene;
  spots: Hotspot[];
  locked: boolean;
  onPin: (spot: Hotspot) => void;
  children: ReactNode;
}) {
  const fx = weatherFx(scene.weather);
  const cast = tint(tale.daypart);
  return (
    <section
      className="relative min-h-0 flex-none basis-[40dvh] overflow-hidden bg-ink lg:flex-1 lg:basis-auto"
      aria-label={scene.name}
    >
      <div key={scene.id} className="stage-in absolute inset-0">
        <img
          src={scene.image}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full scale-110 object-cover opacity-55 blur-2xl"
        />
        <div className="stage-box">
          <div className="stage-cover">
            <div className="kb absolute inset-0">
              <img src={scene.image} alt={scene.name} className="size-full object-cover" />
              {spots.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  aria-label={h.name}
                  disabled={locked}
                  onClick={() => onPin(h)}
                  className={`pin ${h.kind === "foe" ? "foe" : ""} disabled:opacity-50`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  <span className="pin-dot">
                    <PinIcon spot={h} />
                  </span>
                  <span className="pin-label">{h.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {cast ? <div className={`pointer-events-none absolute inset-0 ${cast}`} /> : null}
      {fx ? <div className={`pointer-events-none absolute inset-0 ${fx}`} /> : null}
      <div className="vignette pointer-events-none absolute inset-0" />
      {children}
    </section>
  );
}
