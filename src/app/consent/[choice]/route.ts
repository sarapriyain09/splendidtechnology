import { NextResponse } from "next/server";

type ConsentChoice = "accepted" | "rejected";

function isConsentChoice(value: string): value is ConsentChoice {
  return value === "accepted" || value === "rejected";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ choice: string }> }
) {
  const { choice } = await params;
  const url = new URL(request.url);
  const origin = url.origin;
  const referer = request.headers.get("referer");

  const redirectTarget =
    referer && referer.startsWith(origin) ? referer : `${origin}/`;

  if (!isConsentChoice(choice)) {
    return NextResponse.redirect(redirectTarget);
  }

  const response = NextResponse.redirect(redirectTarget);
  response.cookies.set("cookie_consent", choice, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: url.protocol === "https:",
  });

  return response;
}
