"use client";

import { login } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner3@acme.co.uk");
  const [password, setPassword] = useState("StrongPass123!");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getSession()) {
      router.replace("/accounts");
    }
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/accounts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-2xl border border-teal/20 bg-white/90 p-7 shadow-[0_30px_60px_-35px_rgba(14,36,51,0.55)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Velynxia Accounting</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-ink/70">Use your accounting owner or team account to access Chart of Accounts.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-ink">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2 outline-none ring-teal focus:ring-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium text-ink">
            Password
            <input
              className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2 outline-none ring-teal focus:ring-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-teal px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
