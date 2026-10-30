import { NANO_BASE, NANO_CHAT_MODEL, nanoKey } from "@/lib/nano.server";

export type ChatTarget = {
  url: string;
  key: string;
  model: string;
  headers: Record<string, string>;
  /** Extra body fields for this provider. */
  extra: Record<string, unknown>;
};

// Free models change often. Pick one from https://openrouter.ai/models?max_price=0 and set OPENROUTER_MODEL.
const OPENROUTER_DEFAULT = "thinkingmachines/inkling-small:free";

/** Where the storyteller's text comes from: OpenRouter if a key is set, otherwise NanoGPT, otherwise nowhere. */
export function chatTarget(): ChatTarget | null {
  const openrouter = process.env.OPENROUTER_API_KEY;
  if (openrouter) {
    return {
      url: `${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`,
      key: openrouter,
      model: process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT,
      headers: { "X-Title": "Thornwake" },
      // Several free models think first by default; the story has to answer inside a few seconds.
      extra: { reasoning: { enabled: false } },
    };
  }
  const nano = nanoKey();
  if (nano) return { url: `${NANO_BASE}/chat/completions`, key: nano, model: NANO_CHAT_MODEL, headers: {}, extra: {} };
  return null;
}
