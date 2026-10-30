import { i as getRequest, n as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rate-limit.server-C9a05DD-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var NANO_BASE = (process.env.NANOGPT_BASE_URL ?? "https://nano-gpt.com/api/v1").replace(/\/$/, "");
var NANO_CHAT_MODEL = process.env.NANOGPT_MODEL ?? "gpt-4o-mini";
var NANO_TTS_MODEL = process.env.NANOGPT_TTS_MODEL ?? "tts-1";
function nanoKey() {
	return process.env.NANOGPT_API_KEY || void 0;
}
var hits = /* @__PURE__ */ new Map();
function allow(bucket, max, windowMs) {
	let who = "local";
	try {
		const forwarded = getRequest().headers.get("x-forwarded-for");
		if (forwarded) who = forwarded.split(",")[0].trim();
	} catch {}
	const key = `${bucket}:${who}`;
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (recent.length >= max) {
		hits.set(key, recent);
		return false;
	}
	recent.push(now);
	hits.set(key, recent);
	if (hits.size > 2e3) {
		for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
	}
	return true;
}
//#endregion
export { createServerRpc as a, allow as i, NANO_CHAT_MODEL as n, nanoKey as o, NANO_TTS_MODEL as r, NANO_BASE as t };
