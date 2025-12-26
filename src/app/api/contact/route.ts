import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function POST(request: Request) {
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

  // Placeholder: wire this up to email/CRM (e.g. Resend, SendGrid, HubSpot) later.
  console.log("Contact submission", {
    name,
    email,
    messagePreview: message.slice(0, 200),
  });

  return NextResponse.json({ ok: true });
}
