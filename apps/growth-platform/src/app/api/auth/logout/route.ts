import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.csrf-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "__Host-next-auth.callback-url",
  "next-auth.pkce.code_verifier",
  "__Secure-next-auth.pkce.code_verifier",
  "next-auth.state",
  "__Secure-next-auth.state",
  "next-auth.nonce",
  "__Secure-next-auth.nonce",
];

function expireCookie(response: NextResponse, name: string) {
  response.cookies.set({
    name,
    value: "",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: true,
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });

  const dynamicAuthCookies = request.cookies
    .getAll()
    .map((cookie) => cookie.name)
    .filter(
      (name) =>
        name.startsWith("next-auth") ||
        name.startsWith("__Secure-next-auth") ||
        name.startsWith("__Host-next-auth"),
    );

  for (const name of dynamicAuthCookies) {
    expireCookie(response, name);
  }

  for (const name of COOKIE_NAMES) {
    expireCookie(response, name);
  }

  return response;
}
