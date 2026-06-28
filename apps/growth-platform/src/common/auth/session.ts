import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export function getSession() {
  return getServerSession(authOptions);
}

// Route-handler guard. Usage:
//   const { session, response } = await requireSession();
//   if (response) return response;
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    } as const;
  }
  return { session, response: null } as const;
}
