import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveImageFile } from "@/lib/storage/image-storage";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const schema = z.object({
  prompt: z.string().min(2).max(2000),
  orientation: z.enum(["landscape", "portrait", "square"]).optional().default("landscape"),
});

type GeneratedItem = {
  id: string;
  imageUrl: string;
  provider: "gemini";
};

function extensionFromMime(contentType: string | null) {
  const value = (contentType ?? "").toLowerCase();
  if (value.includes("image/jpeg") || value.includes("image/jpg")) return "jpeg";
  if (value.includes("image/webp")) return "webp";
  if (value.includes("image/gif")) return "gif";
  return "png";
}

function extensionFromDataUrl(value: string) {
  const match = value.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/i);
  if (!match) return "png";
  const ext = match[1].toLowerCase();
  if (ext === "jpg") return "jpeg";
  return ext;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildGeminiFallbackDataUrl(prompt: string, orientation: "landscape" | "portrait" | "square") {
  const width = orientation === "portrait" ? 832 : orientation === "square" ? 1024 : 1344;
  const height = orientation === "portrait" ? 1344 : orientation === "square" ? 1024 : 832;
  const title = escapeXml(prompt.trim().slice(0, 80) || "Scene Image");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="24" y="24" width="${Math.max(100, width - 48)}" height="${Math.max(100, height - 48)}" rx="20" fill="none" stroke="#38bdf8" stroke-opacity="0.45" stroke-width="3"/>
  <text x="50%" y="44%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(24, Math.round(width / 28))}" fill="#e2e8f0">Gemini Fallback</text>
  <text x="50%" y="54%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(16, Math.round(width / 54))}" fill="#cbd5e1">${title}</text>
  <text x="50%" y="63%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(13, Math.round(width / 74))}" fill="#94a3b8">Set GEMINI_API_KEY to enable real AI image output</text>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function toImageBuffer(raw: string): Promise<{ bytes: Buffer; extension: string }> {
  if (raw.startsWith("data:image/")) {
    const commaIndex = raw.indexOf(",");
    if (commaIndex < 0) {
      throw new Error("Invalid data URL image payload.");
    }

    const bytes = Buffer.from(raw.slice(commaIndex + 1), "base64");
    return { bytes, extension: extensionFromDataUrl(raw) };
  }

  if (/^https?:\/\//i.test(raw)) {
    const response = await fetch(raw, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch generated image: ${response.status}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return { bytes, extension: extensionFromMime(response.headers.get("content-type")) };
  }

  const stripped = raw.replace(/\s+/g, "");
  const bytes = Buffer.from(stripped, "base64");
  if (!bytes.length) {
    throw new Error("Generated image payload is empty.");
  }

  return { bytes, extension: "png" };
}

async function generateWithGemini(prompt: string, orientation: "landscape" | "portrait" | "square") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return buildGeminiFallbackDataUrl(prompt, orientation);
  }

  const orientedPrompt = `${prompt}\n\nCompose as a ${orientation} image.`;
  const model = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
  const endpoint = process.env.GEMINI_API_URL ?? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: orientedPrompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok) {
    const errorText = contentType.includes("application/json") ? JSON.stringify(await response.json()) : await response.text();
    throw new Error(`Gemini image generation failed: ${response.status} ${errorText}`);
  }

  if (contentType.includes("application/json") || contentType.includes("text/json")) {
    const json = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { mimeType?: string; data?: string };
            inline_data?: { mime_type?: string; data?: string };
            text?: string;
          }>;
        };
      }>;
    };

    const parts = json.candidates?.[0]?.content?.parts ?? [];
    const inline = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
    const payload = inline?.inlineData?.data ?? inline?.inline_data?.data ?? null;
    const mime = inline?.inlineData?.mimeType ?? inline?.inline_data?.mime_type ?? "image/png";

    if (payload) {
      return `data:${mime};base64,${payload}`;
    }

    throw new Error("Gemini returned JSON without an image payload.");
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());

    const rawImage = await generateWithGemini(input.prompt, input.orientation);

    const { bytes, extension } = await toImageBuffer(rawImage);
    const { urlPath } = await saveImageFile(bytes, extension);

    const item: GeneratedItem = {
      id: randomUUID(),
      imageUrl: urlPath,
      provider: "gemini",
    };

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate image.";
    return jsonError(message, 400);
  }
}
