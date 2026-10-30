import { getRequest } from "@tanstack/react-start/server";

// Per-instance sliding window. Serverless instances do not share it, so it is a brake on
// a runaway tab or a casual abuser, not a quota: the real cap is the account behind the key.
const hits = new Map<string, number[]>();

export function allow(bucket: string, max: number, windowMs: number): boolean {
  let who = "local";
  try {
    const forwarded = getRequest().headers.get("x-forwarded-for");
    if (forwarded) who = forwarded.split(",")[0].trim();
  } catch {
    /* no request context */
  }
  const key = `${bucket}:${who}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
