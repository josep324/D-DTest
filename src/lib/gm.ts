import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCampaign, getScene } from "@/lib/game/content";
import type { GmResult } from "@/lib/game/types";
import { NANO_BASE, NANO_CHAT_MODEL, nanoKey } from "@/lib/nano.server";
import { allow } from "@/lib/rate-limit.server";

const Input = z.object({
  campaignId: z.string().max(40),
  sceneId: z.string().max(40),
  playerName: z.string().max(40),
  activeId: z.string().max(20),
  action: z.string().min(1).max(500),
  party: z
    .array(
      z.object({
        id: z.string().max(20),
        heart: z.number().int().min(0).max(40),
      }),
    )
    .max(4),
  recent: z
    .array(
      z.object({
        role: z.enum(["you", "gm"]),
        text: z.string().max(500),
      }),
    )
    .max(6),
  roll: z
    .object({
      label: z.string().max(120),
      total: z.number().int(),
      dc: z.number().int(),
      success: z.boolean(),
    })
    .optional(),
  facts: z.array(z.string().max(300)).max(10).optional(),
  summary: z.string().max(600).optional(),
  level: z.number().int().min(1).max(10).optional(),
  lang: z.enum(["en", "ca", "es"]).default("ca"),
  partner: z.string().max(40).optional(),
  inventory: z.array(z.string().max(40)).max(20).optional(),
  heroLine: z.string().max(160).optional(),
  encounter: z.string().max(200).optional(),
  freeform: z.boolean().optional(),
  roomNotes: z.string().max(2400).optional(),
});

const LANGUAGE = { en: "English", ca: "Catalan", es: "Spanish" } as const;

const Out = z.object({
  narration: z.string().min(20).max(1400),
  choices: z
    .array(
      z.object({
        id: z.string().max(40),
        label: z.string().min(1).max(90),
        hint: z.string().max(90).optional(),
      }),
    )
    .min(0)
    .max(4),
  questTitle: z.string().max(90).optional(),
  questDetail: z.string().max(240).optional(),
  heartDelta: z
    .array(z.object({ id: z.string().max(20), delta: z.number().int().min(-4).max(4) }))
    .optional(),
  chronicleTitle: z.string().max(90).optional(),
  chronicleBody: z.string().max(400).optional(),
  moveTo: z.string().max(40).optional(),
  nextSceneId: z.string().max(40).optional(),
  daypart: z.string().max(40).optional(),
  weather: z.string().max(40).optional(),
  sky: z.string().max(40).optional(),
  clock: z.string().max(20).optional(),
  day: z.number().int().min(1).max(30).optional(),
  summary: z.string().max(600).optional(),
  rollRequest: z
    .object({
      heroId: z.string().max(20).optional(),
      ability: z.enum(["str", "dex", "con", "int", "wis", "cha"]),
      dc: z.number().int().min(8).max(18),
      reason: z.string().max(120),
    })
    .nullish(),
  endTale: z.boolean().nullish(),
});

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no json");
  return JSON.parse(text.slice(start, end + 1));
}

export const consultStoryteller = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; result: GmResult } | { ok: false; error: string }> => {
    const campaign = getCampaign(data.campaignId);
    const scene = getScene(data.campaignId, data.sceneId);
    if (!campaign || !scene) return { ok: false, error: "Conte desconegut" };

    const apiKey = nanoKey();
    if (!apiKey) return { ok: false, error: "La narradora és lluny de la taula" };
    if (!allow("gm", 14, 60_000)) return { ok: false, error: "La narradora necessita respirar" };

    const spots = scene.hotspots.map((h) => `${h.id} (${h.name}): ${h.examine}`).join("\n");
    const scenes = campaign.scenes.map((s) => s.id).join(", ");
    const party = data.party.map((p) => `${p.id} heart ${p.heart}`).join(", ");
    const log = data.recent.map((l) => `${l.role === "you" ? "Company" : "Storyteller"}: ${l.text}`).join("\n");
    const dice = data.roll
      ? `Dice already rolled. ${data.roll.label}. Total ${data.roll.total} vs DC ${data.roll.dc}. Success: ${data.roll.success}. Do not contradict the dice.`
      : "No dice were rolled.";

    const dmRules = data.freeform
      ? `
You are now the Dungeon Master of a real tabletop adventure. The company acts freely and you improvise, but only inside the ROOM NOTES below: the places, people, foes and exits listed are all that exist. Decide like a DM: if the action is safe, say yes with no roll; if it could fail and failing is interesting, set rollRequest with the right ability and a DC (easy 10, normal 15, hard 20); if it is impossible, say no and suggest what is possible. Never invent treasure, exits or foes. Never narrate the result of an uncertain action before the dice. Do not offer a list of choices: return "choices": [].`
      : "";
    const system = `You are the storyteller at Thornwake, a family tabletop game played by adults and children together.
Tone: wondrous, specific, sensory, mild peril. No gore, no body horror, no romance, no real-world politics, no slurs.
Never kill a hero. Hearts and dice are decided by the rules engine: the "Facts" list is true and final, so narrate it faithfully and never contradict a roll, a heart total or an initiative order.
Put heartDelta only for peril that has no entry in Facts (-1 to +1). A hero at 1 heart is pulled back by the others.
When a character attempts something uncertain and no dice were rolled yet, set rollRequest {"heroId":"","ability":"str|dex|con|int|wis|cha","dc":8-18,"reason":"short"} and end the narration on the moment before the outcome; do not narrate the result. Never set rollRequest when dice were already rolled.
Set endTale true only when the quest is truly resolved and the last scene is told.
Keep "summary" as a running memory of the story so far, under 80 words, rewritten every turn.
Do not invent a fifth hero. Heroes are only calder, bramble, vesper, holt.
Do not use trademarked Dungeons & Dragons creatures or settings.
The players at the table are ${data.playerName}${data.partner ? ` and ${data.partner}` : ""}. Address the company as "you". Write narration, choice labels, quest and chronicle text in ${LANGUAGE[data.lang]}; keep ids as short English slugs. Narration is read aloud, so keep sentences speakable.
Reply with JSON only. No markdown.
Schema:
{"narration":"two short paragraphs under 130 words","choices":[{"id":"slug","label":"concrete verb phrase","hint":"optional"}],"questTitle":"","questDetail":"","heartDelta":[{"id":"calder","delta":0}],"chronicleTitle":"","chronicleBody":"one sentence if this moment matters, else empty","moveTo":"hotspot id or empty","nextSceneId":"another scene id only if they truly travel, else empty","daypart":"","weather":"","sky":"SHORT · LABEL","clock":"HH:MM","day":1,"summary":"","rollRequest":null,"endTale":false}
Exactly 3 or 4 choices (none in freeform mode). Keep quest fields if the goal is unchanged. moveTo must be a hotspot id from the list or empty. nextSceneId must be one of: ${scenes} — or empty.${dmRules}`;

    const user = `Campaign: ${campaign.name}
Canon: ${campaign.canon}
Scene: ${scene.name} (${scene.id}). ${scene.daypart}, ${scene.clock}, ${scene.weather}. ${scene.ambient}
Places:
${spots}
Party hearts: ${party}
Active hero id: ${data.activeId}
Current quest: ${scene.quest.title} — ${scene.quest.detail}
Company level: ${data.level ?? 1}. Pack: ${(data.inventory ?? []).join(", ") || "(empty)"}
${data.heroLine ? `Acting hero: ${data.heroLine}` : ""}
${data.encounter ? `Encounter: ${data.encounter}` : ""}
Story so far: ${data.summary || "(just begun)"}
Recent:
${log || "(opening)"}
${dice}
Room notes:
${data.roomNotes ?? "(none)"}
Facts (final):
${(data.facts ?? []).join("\n") || "(none)"}
The company does: ${data.action}`;

    try {
      const res = await fetch(`${NANO_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(22000),
        body: JSON.stringify({
          model: NANO_CHAT_MODEL,
          temperature: 0.8,
          max_tokens: 900,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: "La narradora ha perdut el fil" };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = Out.parse(extractJson(text));
      const result: GmResult = {
        narration: parsed.narration.trim(),
        choices: parsed.choices,
        questTitle: parsed.questTitle || undefined,
        questDetail: parsed.questDetail || undefined,
        heartDelta: parsed.heartDelta,
        chronicleTitle: parsed.chronicleTitle || undefined,
        chronicleBody: parsed.chronicleBody || undefined,
        moveTo: parsed.moveTo || undefined,
        nextSceneId: parsed.nextSceneId || undefined,
        daypart: parsed.daypart || undefined,
        weather: parsed.weather || undefined,
        sky: parsed.sky || undefined,
        clock: parsed.clock || undefined,
        day: parsed.day,
        summary: parsed.summary || undefined,
        rollRequest: data.roll ? undefined : parsed.rollRequest ?? undefined,
        endTale: parsed.endTale || undefined,
      };
      return { ok: true, result };
    } catch {
      return { ok: false, error: "La narradora ha perdut el fil" };
    }
  });
