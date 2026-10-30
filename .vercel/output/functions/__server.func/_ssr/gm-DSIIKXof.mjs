import { t as createServerFn } from "./ssr.mjs";
import { a as createServerRpc, i as allow, n as NANO_CHAT_MODEL, o as nanoKey, t as NANO_BASE } from "./rate-limit.server-C9a05DD-.mjs";
import { a as getScene, i as getCampaign } from "./content-7n9J_wLk.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gm-DSIIKXof.js
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
	}).optional(),
	facts: array(string().max(300)).max(10).optional(),
	summary: string().max(600).optional(),
	level: number().int().min(1).max(10).optional(),
	lang: _enum([
		"en",
		"ca",
		"es"
	]).default("ca"),
	partner: string().max(40).optional(),
	inventory: array(string().max(40)).max(20).optional(),
	heroLine: string().max(160).optional(),
	encounter: string().max(200).optional()
});
var LANGUAGE = {
	en: "English",
	ca: "Catalan",
	es: "Spanish"
};
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
	day: number().int().min(1).max(30).optional(),
	summary: string().max(600).optional(),
	rollRequest: object({
		heroId: string().max(20).optional(),
		ability: _enum([
			"str",
			"dex",
			"con",
			"int",
			"wis",
			"cha"
		]),
		dc: number().int().min(8).max(18),
		reason: string().max(120)
	}).nullish(),
	endTale: boolean().nullish()
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
		error: "Conte desconegut"
	};
	const apiKey = nanoKey();
	if (!apiKey) return {
		ok: false,
		error: "La narradora és lluny de la taula"
	};
	if (!allow("gm", 14, 6e4)) return {
		ok: false,
		error: "La narradora necessita respirar"
	};
	const spots = scene.hotspots.map((h) => `${h.id} (${h.name}): ${h.examine}`).join("\n");
	const scenes = campaign.scenes.map((s) => s.id).join(", ");
	const party = data.party.map((p) => `${p.id} heart ${p.heart}`).join(", ");
	const log = data.recent.map((l) => `${l.role === "you" ? "Company" : "Storyteller"}: ${l.text}`).join("\n");
	const dice = data.roll ? `Dice already rolled. ${data.roll.label}. Total ${data.roll.total} vs DC ${data.roll.dc}. Success: ${data.roll.success}. Do not contradict the dice.` : "No dice were rolled.";
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
Exactly 3 or 4 choices. Keep quest fields if the goal is unchanged. moveTo must be a hotspot id from the list or empty. nextSceneId must be one of: ${scenes} — or empty.`;
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
Facts (final):
${(data.facts ?? []).join("\n") || "(none)"}
The company does: ${data.action}`;
	try {
		const res = await fetch(`${NANO_BASE}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: AbortSignal.timeout(22e3),
			body: JSON.stringify({
				model: NANO_CHAT_MODEL,
				temperature: .8,
				max_tokens: 900,
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
			error: "La narradora ha perdut el fil"
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
				day: parsed.day,
				summary: parsed.summary || void 0,
				rollRequest: data.roll ? void 0 : parsed.rollRequest ?? void 0,
				endTale: parsed.endTale || void 0
			}
		};
	} catch {
		return {
			ok: false,
			error: "La narradora ha perdut el fil"
		};
	}
});
//#endregion
export { consultStoryteller_createServerFn_handler };
