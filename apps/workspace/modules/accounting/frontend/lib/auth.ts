export type SessionUser = {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: string;
};

export type SessionTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

const SESSION_KEY = "velynxia.accounting.session";

export function setSession(tokens: SessionTokens, user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ tokens, user }));
}

export function getSession(): { tokens: SessionTokens; user: SessionUser } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { tokens: SessionTokens; user: SessionUser };
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
