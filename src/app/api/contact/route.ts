import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY for /api/contact");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  const body = (await request.json().catch(() => null)) as Partial<ContactPayload> | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const message = (body?.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Splendid Technology Website <noreply@splendidtechnology.co.uk>",
    to: ["info@splendidtechnology.co.uk"],
    replyTo: email,
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error (contact):", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
