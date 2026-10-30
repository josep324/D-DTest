import { t as createServerFn } from "./ssr.mjs";
import { a as createServerRpc, i as allow, o as nanoKey, r as NANO_TTS_MODEL, t as NANO_BASE } from "./rate-limit.server-C9a05DD-.mjs";
import { o as object, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tts-UPE2f1YM.js
var Input = object({
	text: string().min(1).max(1500),
	voice: _enum([
		"onyx",
		"nova",
		"shimmer",
		"echo",
		"fable",
		"alloy"
	]).default("fable")
});
/** Narration as audio. Any failure is soft: the browser voice takes over on the client. */
var narrateAloud_createServerFn_handler = createServerRpc({
	id: "c140a7ccb80857dcff13165823eab1f17c3dc57db2f8d87884fed2cdad3244b2",
	name: "narrateAloud",
	filename: "src/lib/tts.ts"
}, (opts) => narrateAloud.__executeServer(opts));
var narrateAloud = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(narrateAloud_createServerFn_handler, async ({ data }) => {
	const apiKey = nanoKey();
	if (!apiKey) return { ok: false };
	if (!allow("tts", 20, 6e4)) return { ok: false };
	try {
		const res = await fetch(`${NANO_BASE}/audio/speech`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: AbortSignal.timeout(25e3),
			body: JSON.stringify({
				model: NANO_TTS_MODEL,
				input: data.text,
				voice: data.voice,
				response_format: "mp3"
			})
		});
		if (!res.ok) return { ok: false };
		const type = res.headers.get("content-type") ?? "";
		if (!type.startsWith("audio/") && !type.includes("octet-stream")) return { ok: false };
		const bytes = Buffer.from(await res.arrayBuffer());
		if (bytes.length < 200 || bytes.length > 35e5) return { ok: false };
		return {
			ok: true,
			audio: `data:audio/mpeg;base64,${bytes.toString("base64")}`
		};
	} catch {
		return { ok: false };
	}
});
//#endregion
export { narrateAloud_createServerFn_handler };
