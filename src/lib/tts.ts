import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NANO_BASE, NANO_TTS_MODEL, nanoKey } from "@/lib/nano.server";
import { allow } from "@/lib/rate-limit.server";

const VOICES = ["onyx", "nova", "shimmer", "echo", "fable", "alloy"] as const;

const Input = z.object({
  text: z.string().min(1).max(1500),
  voice: z.enum(VOICES).default("fable"),
});

/** Narration as audio. Any failure is soft: the browser voice takes over on the client. */
export const narrateAloud = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; audio: string } | { ok: false }> => {
    const apiKey = nanoKey();
    if (!apiKey) return { ok: false };
    if (!allow("tts", 20, 60_000)) return { ok: false };
    try {
      const res = await fetch(`${NANO_BASE}/audio/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          model: NANO_TTS_MODEL,
          input: data.text,
          voice: data.voice,
          response_format: "mp3",
        }),
      });
      if (!res.ok) return { ok: false };
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("audio/") && !type.includes("octet-stream")) return { ok: false };
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length < 200 || bytes.length > 3_500_000) return { ok: false };
      return { ok: true, audio: `data:audio/mpeg;base64,${bytes.toString("base64")}` };
    } catch {
      return { ok: false };
    }
  });
