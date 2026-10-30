// NanoGPT is OpenAI-compatible. Everything the app needs from it goes through here.
export const NANO_BASE = (process.env.NANOGPT_BASE_URL ?? "https://nano-gpt.com/api/v1").replace(/\/$/, "");
export const NANO_CHAT_MODEL = process.env.NANOGPT_MODEL ?? "gpt-4o-mini";
// No default on purpose: NanoGPT text-to-speech is not part of the subscription and is billed per character.
export const NANO_TTS_MODEL = process.env.NANOGPT_TTS_MODEL ?? "";

export function nanoKey(): string | undefined {
  return process.env.NANOGPT_API_KEY || undefined;
}
