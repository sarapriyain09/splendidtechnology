import { NextResponse } from "next/server";
import { Resend } from "resend";

type DemoPayload = {
  name: string;
  email: string;
  phone?: string;
  business: string;
  industry: string;
  needs: string[];
  currentProcess: string;
  plan: string;
};

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY for /api/crm-demo");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  const body = (await request.json().catch(() => null)) as Partial<DemoPayload> | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const phone = (body?.phone ?? "").trim();
  const business = (body?.business ?? "").trim();
  const industry = (body?.industry ?? "").trim();
  const needs: string[] = Array.isArray(body?.needs) ? body.needs : [];
  const currentProcess = (body?.currentProcess ?? "").trim();
  const plan = (body?.plan ?? "").trim();

  if (!name || !email || !business || !industry) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const needsList = needs.length > 0 ? needs.join(", ") : "Not specified";
  const planLabel = plan || "Not specified";

  const { error } = await resend.emails.send({
    from: "Splendid Technology Website <noreply@splendidtechnology.co.uk>",
    to: ["info@splendidtechnology.co.uk"],
    replyTo: email,
    subject: `CRM Demo Request — ${name} (${business})`,
    text: [
      `CRM DEMO REQUEST`,
      ``,
      `Name:        ${name}`,
      `Email:       ${email}`,
      `Phone:       ${phone || "Not provided"}`,
      `Business:    ${business}`,
      `Industry:    ${industry}`,
      `Plan interest: ${planLabel}`,
      ``,
      `Needs:`,
      `  ${needsList}`,
      ``,
      `Current process:`,
      `  ${currentProcess || "Not provided"}`,
      ``,
      `Action: Set up demo account on crm.splendidtechnology.co.uk and reply to ${email}`,
    ].join("\n"),
    html: `
      <h2 style="color:#0b1f3a">CRM Demo Request</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 12px;color:#666;width:160px">Name</td><td style="padding:6px 12px;font-weight:600">${name}</td></tr>
        <tr style="background:#f7f7f7"><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#666">Phone</td><td style="padding:6px 12px">${phone || "Not provided"}</td></tr>
        <tr style="background:#f7f7f7"><td style="padding:6px 12px;color:#666">Business</td><td style="padding:6px 12px;font-weight:600">${business}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Industry</td><td style="padding:6px 12px">${industry}</td></tr>
        <tr style="background:#f7f7f7"><td style="padding:6px 12px;color:#666">Plan interest</td><td style="padding:6px 12px">${planLabel}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Needs</td><td style="padding:6px 12px">${needsList}</td></tr>
      </table>
      <h3 style="color:#0b1f3a;margin-top:20px">Current sales process</h3>
      <p style="font-size:14px;color:#333">${currentProcess ? currentProcess.replace(/\n/g, "<br />") : "Not provided"}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:13px;color:#16a34a;font-weight:600">
        &#9654; Action: Set up a demo account on crm.splendidtechnology.co.uk and reply to ${email}
      </p>
    `,
  });

  if (error) {
    console.error("Resend error (crm-demo):", error);
    return NextResponse.json({ error: "Failed to submit request. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
