"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function LoginForm() {
  const [email, setEmail] = useState("admin@velynxia.com");
  const [password, setPassword] = useState("Velynxia@2024!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/dashboard/voice-studio";
  };

  return (
    <form className="panel animate-float-in w-full max-w-md rounded-2xl p-7" onSubmit={onSubmit}>
      <div className="mb-3 flex justify-center">
        <Image
          src="/velynxia-Logo.png"
          alt="Velynxia"
          width={340}
          height={230}
          className="h-auto w-full max-w-[260px] object-contain"
          priority
        />
      </div>
      <h1 className="display-font text-center text-2xl font-semibold text-[color:var(--foreground)]">Admin Login</h1>
      <p className="mt-1 text-center text-sm text-[color:var(--muted)]">Sign in to continue</p>

      <label className="mt-5 block text-sm text-[color:var(--muted)]">Email</label>
      <input
        type="email"
        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label className="mt-4 block text-sm text-[color:var(--muted)]">Password</label>
      <input
        type="password"
        className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
