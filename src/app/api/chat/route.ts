import { NextResponse } from "next/server";

type ChatPayload = {
  name: string;
  email: string;
  message: string;
  pageUrl?: string;
};

function isValidEmail(value: string) {
  if (!value) return true; // allow empty email in chat
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<ChatPayload> | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const message = (body?.message ?? "").trim();
  const pageUrl = (body?.pageUrl ?? "").trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const payloadForCrm = {
    source: "website-chat",
    name: name || undefined,
    email: email || undefined,
    message,
    pageUrl: pageUrl || undefined,
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadForCrm),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Chat received, but CRM forwarding failed." },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Chat received, but CRM forwarding failed." },
        { status: 502 },
      );
    }
  } else {
    console.log("Chat message", {
      name,
      email,
      messagePreview: message.slice(0, 200),
      pageUrl,
    });
  }

  return NextResponse.json({ ok: true });
}
