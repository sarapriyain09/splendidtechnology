import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY for /api/chat");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

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

  // Send email notification via Resend
  const { error: emailError } = await resend.emails.send({
    from: "Splendid Technology Website <noreply@splendidtechnology.co.uk>",
    to: ["info@splendidtechnology.co.uk"],
    ...(email ? { replyTo: email } : {}),
    subject: `New chat message${name ? ` from ${name}` : ""}`,
    text: [
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      pageUrl ? `Page: ${pageUrl}` : null,
      `\nMessage:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
      ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ""}
      ${pageUrl ? `<p><strong>Page:</strong> ${pageUrl}</p>` : ""}
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (emailError) {
    console.error("Resend error (chat):", emailError);
    return NextResponse.json({ error: "Message received, but notification failed." }, { status: 500 });
  }

  // Also forward to CRM webhook if configured
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadForCrm),
      });
    } catch {
      // Non-fatal — email already sent
      console.error("CRM webhook forwarding failed.");
    }
  }

  return NextResponse.json({ ok: true });
}
