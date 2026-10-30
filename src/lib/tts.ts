import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NANO_BASE, NANO_TTS_MODEL, nanoKey } from "@/lib/nano.server";
import { allow } from "@/lib/rate-limit.server";

const VOICES = ["onyx", "nova", "shimmer", "echo", "fable", "alloy"] as const;

// The game names voices by hero; Azure gets the closest native Catalan voice.
const AZURE_VOICE: Record<(typeof VOICES)[number], string> = {
  fable: "ca-ES-JoanaNeural",
  shimmer: "ca-ES-JoanaNeural",
  nova: "ca-ES-AlbaNeural",
  alloy: "ca-ES-AlbaNeural",
  onyx: "ca-ES-EnricNeural",
  echo: "ca-ES-EnricNeural",
};

const Input = z.object({
  text: z.string().min(1).max(1500),
  voice: z.enum(VOICES).default("fable"),
});

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

type Audio = { ok: true; audio: string } | { ok: false };

function pack(bytes: Buffer): Audio {
  if (bytes.length < 200 || bytes.length > 3_500_000) return { ok: false };
  return { ok: true, audio: `data:audio/mpeg;base64,${bytes.toString("base64")}` };
}

async function azure(text: string, voice: (typeof VOICES)[number]): Promise<Audio> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region || !/^[a-z0-9-]+$/i.test(region)) return { ok: false };
  const ssml = `<speak version="1.0" xml:lang="ca-ES"><voice name="${AZURE_VOICE[voice]}"><prosody rate="-4%">${escapeXml(text)}</prosody></voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "thornwake",
    },
    signal: AbortSignal.timeout(25000),
    body: ssml,
  });
  if (!res.ok) return { ok: false };
  return pack(Buffer.from(await res.arrayBuffer()));
}

// Billed per character from the NanoGPT balance, so it only runs when NANOGPT_TTS_MODEL is set on purpose.
async function nano(text: string, voice: string): Promise<Audio> {
  const apiKey = nanoKey();
  if (!apiKey || !NANO_TTS_MODEL) return { ok: false };
  const res = await fetch(`${NANO_BASE}/audio/speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(25000),
    body: JSON.stringify({ model: NANO_TTS_MODEL, input: text, voice, response_format: "mp3" }),
  });
  if (!res.ok) return { ok: false };
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("audio/") && !type.includes("octet-stream")) return { ok: false };
  return pack(Buffer.from(await res.arrayBuffer()));
}

/** Narration as audio. Any failure is soft: the browser voice takes over on the client. */
export const narrateAloud = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<Audio> => {
    if (!allow("tts", 20, 60_000)) return { ok: false };
    try {
      if (process.env.AZURE_SPEECH_KEY) return await azure(data.text, data.voice);
      return await nano(data.text, data.voice);
    } catch {
      return { ok: false };
    }
  });
