import { clearSession, getSession, setSession, type SessionTokens, type SessionUser } from "@/lib/auth";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type Account = {
  id: string;
  code: string;
  name: string;
  category: string;
  subtype: string;
  vat_rate: string;
  is_active: boolean;
  is_system: boolean;
};

const baseUrl = process.env.NEXT_PUBLIC_ACCOUNTING_API_URL ?? "http://localhost:8010/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getSession();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (session?.tokens.access_token) {
    headers.set("Authorization", `Bearer ${session.tokens.access_token}`);
  }

  const res = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const payload = (await res.json()) as ApiEnvelope<T> | { detail?: string };

  if (!res.ok) {
    const detail = "detail" in payload && payload.detail ? payload.detail : "Request failed";
    if (res.status === 401) {
      clearSession();
    }
    throw new Error(detail);
  }

  if (!("success" in payload) || !payload.success) {
    throw new Error("Unexpected API response");
  }

  return payload.data;
}

export async function login(email: string, password: string): Promise<{ tokens: SessionTokens; user: SessionUser }> {
  const data = await request<{ tokens: SessionTokens; user: SessionUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setSession(data.tokens, data.user);
  return data;
}

export async function getAccounts(): Promise<Account[]> {
  const data = await request<{ accounts: Account[] }>("/accounts", { method: "GET" });
  return data.accounts;
}

export async function createAccount(input: Omit<Account, "id" | "is_system" | "is_active">): Promise<Account> {
  return request<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAccount(accountId: string, input: Pick<Account, "name" | "category" | "subtype" | "vat_rate" | "is_active">): Promise<Account> {
  return request<Account>(`/accounts/${accountId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deactivateAccount(accountId: string): Promise<Account> {
  return request<Account>(`/accounts/${accountId}/deactivate`, { method: "POST" });
}
