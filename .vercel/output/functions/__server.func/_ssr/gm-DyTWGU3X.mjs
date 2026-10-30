import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as getScene, i as getCampaign } from "./content-BlwjfujB.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gm-DyTWGU3X.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({
	campaignId: string().max(40),
	sceneId: string().max(40),
	playerName: string().max(40),
	activeId: string().max(20),
	action: string().min(1).max(500),
	party: array(object({
		id: string().max(20),
		heart: number().int().min(0).max(40)
	})).max(4),
	recent: array(object({
		role: _enum(["you", "gm"]),
		text: string().max(500)
	})).max(6),
	roll: object({
		label: string().max(120),
		total: number().int(),
		dc: number().int(),
		success: boolean()
	}).optional()
});
var Out = object({
	narration: string().min(20).max(1400),
	choices: array(object({
		id: string().max(40),
		label: string().min(1).max(90),
		hint: string().max(90).optional()
	})).min(1).max(4),
	questTitle: string().max(90).optional(),
	questDetail: string().max(240).optional(),
	heartDelta: array(object({
		id: string().max(20),
		delta: number().int().min(-4).max(4)
	})).optional(),
	chronicleTitle: string().max(90).optional(),
	chronicleBody: string().max(400).optional(),
	moveTo: string().max(40).optional(),
	nextSceneId: string().max(40).optional(),
	daypart: string().max(40).optional(),
	weather: string().max(40).optional(),
	sky: string().max(40).optional(),
	clock: string().max(20).optional(),
	day: number().int().min(1).max(30).optional()
});
function extractJson(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("no json");
	return JSON.parse(text.slice(start, end + 1));
}
var consultStoryteller_createServerFn_handler = createServerRpc({
	id: "a3742cd4620cb4535adf58f82f1703136bc6cb142f4c94ad485f0a4121e9637e",
	name: "consultStoryteller",
	filename: "src/lib/gm.ts"
}, (opts) => consultStoryteller.__executeServer(opts));
var consultStoryteller = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(consultStoryteller_createServerFn_handler, async ({ data }) => {
	const campaign = getCampaign(data.campaignId);
	const scene = getScene(data.campaignId, data.sceneId);
	if (!campaign || !scene) return {
		ok: false,
		error: "Unknown tale"
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "The storyteller is away from the table"
	};
	const spots = scene.hotspots.map((h) => `${h.id} (${h.name}): ${h.examine}`).join("\n");
	const scenes = campaign.scenes.map((s) => s.id).join(", ");
	const party = data.party.map((p) => `${p.id} heart ${p.heart}`).join(", ");
	const log = data.recent.map((l) => `${l.role === "you" ? "Company" : "Storyteller"}: ${l.text}`).join("\n");
	const dice = data.roll ? `Dice already rolled. ${data.roll.label}. Total ${data.roll.total} vs DC ${data.roll.dc}. Success: ${data.roll.success}. Do not contradict the dice.` : "No dice were rolled.";
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
				Authorization: `Bearer ${apiKey}`
			},
			signal: AbortSignal.timeout(22e3),
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .8,
				max_tokens: 800,
				messages: [{
					role: "system",
					content: system
				}, {
					role: "user",
					content: user
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: "The storyteller lost the thread"
		};
		const text = (await res.json()).choices?.[0]?.message?.content ?? "";
		const parsed = Out.parse(extractJson(text));
		return {
			ok: true,
			result: {
				narration: parsed.narration.trim(),
				choices: parsed.choices,
				questTitle: parsed.questTitle || void 0,
				questDetail: parsed.questDetail || void 0,
				heartDelta: parsed.heartDelta,
				chronicleTitle: parsed.chronicleTitle || void 0,
				chronicleBody: parsed.chronicleBody || void 0,
				moveTo: parsed.moveTo || void 0,
				nextSceneId: parsed.nextSceneId || void 0,
				daypart: parsed.daypart || void 0,
				weather: parsed.weather || void 0,
				sky: parsed.sky || void 0,
				clock: parsed.clock || void 0,
				day: parsed.day
			}
		};
	} catch {
		return {
			ok: false,
			error: "The storyteller lost the thread"
		};
	}
});
//#endregion
export { consultStoryteller_createServerFn_handler };
