import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { generateChatCompletion, type ChatMessage } from "@/common/services/openai";

interface AiRequestBody {
  prompt?: string;
  history?: Array<{ role?: string; content?: string }>;
}

const SYSTEM_PROMPT = [
  "You are the Velynxia Growth Platform assistant.",
  "Velynxia is a UK customer growth platform with connected apps: CRM, Sales, Marketing, CallCRM, Automation and Analytics.",
  "Help the user understand the platform, plan growth and sales activities, draft messaging, and decide which app to use for a task.",
  "Be concise, practical and friendly. Use UK English. When you are unsure, say so rather than inventing facts.",
].join(" ");

const MAX_HISTORY = 10;

export async function POST(req: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  const body = (await req.json().catch(() => ({}))) as AiRequestBody;
  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (Array.isArray(body.history)) {
    for (const item of body.history.slice(-MAX_HISTORY)) {
      const role = item?.role === "assistant" ? "assistant" : item?.role === "user" ? "user" : null;
      const content = typeof item?.content === "string" ? item.content.trim() : "";
      if (role && content) messages.push({ role, content });
    }
  }

  messages.push({ role: "user", content: prompt });

  try {
    const output = await generateChatCompletion(messages, { maxTokens: 900 });
    return NextResponse.json({ output, model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", user: session?.user?.email });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assistant request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
