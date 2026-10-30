import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCampaign, getScene } from "@/lib/game/content";
import type { GmResult } from "@/lib/game/types";

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
});

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
    .min(1)
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
    if (!campaign || !scene) return { ok: false, error: "Unknown tale" };

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "The storyteller is away from the table" };

    const spots = scene.hotspots.map((h) => `${h.id} (${h.name}): ${h.examine}`).join("\n");
    const scenes = campaign.scenes.map((s) => s.id).join(", ");
    const party = data.party.map((p) => `${p.id} heart ${p.heart}`).join(", ");
    const log = data.recent.map((l) => `${l.role === "you" ? "Company" : "Storyteller"}: ${l.text}`).join("\n");
    const dice = data.roll
      ? `Dice already rolled. ${data.roll.label}. Total ${data.roll.total} vs DC ${data.roll.dc}. Success: ${data.roll.success}. Do not contradict the dice.`
      : "No dice were rolled.";

    const system = `You are the storyteller at Thornwake, a family tabletop game played by adults and children together.
Tone: wondrous, specific, sensory, mild peril. No gore, no body horror, no romance, no real-world politics, no slurs.
Never kill a hero. Heart deltas may be -2 to +2. A hero at 1 heart is pulled back by the others.
Do not invent a fifth hero. Heroes are only calder, bramble, vesper, holt.
Do not use trademarked Dungeons & Dragons creatures or settings.
The player at the table is ${data.playerName}. Address the company as "you".
Reply with JSON only. No markdown.
Schema:
{"narration":"two short paragraphs under 130 words","choices":[{"id":"slug","label":"concrete verb phrase","hint":"optional"}],"questTitle":"","questDetail":"","heartDelta":[{"id":"calder","delta":0}],"chronicleTitle":"","chronicleBody":"one sentence if this moment matters, else empty","moveTo":"hotspot id or empty","nextSceneId":"another scene id only if they truly travel, else empty","daypart":"","weather":"","sky":"SHORT · LABEL","clock":"HH:MM","day":1}
Exactly 3 or 4 choices. Keep quest fields if the goal is unchanged. moveTo must be a hotspot id from the list or empty. nextSceneId must be one of: ${scenes} — or empty.`;

    const user = `Campaign: ${campaign.name}
Canon: ${campaign.canon}
Scene: ${scene.name} (${scene.id}). ${scene.daypart}, ${scene.clock}, ${scene.weather}. ${scene.ambient}
Places:
${spots}
Party hearts: ${party}
Active hero id: ${data.activeId}
Current quest: ${scene.quest.title} — ${scene.quest.detail}
Recent:
${log || "(opening)"}
${dice}
The company does: ${data.action}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(22000),
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.8,
          max_tokens: 800,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: "The storyteller lost the thread" };
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
      };
      return { ok: true, result };
    } catch {
      return { ok: false, error: "The storyteller lost the thread" };
    }
  });
