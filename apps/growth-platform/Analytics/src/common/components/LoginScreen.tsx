"use client";

import { useState } from "react";

interface LoginScreenProps {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginScreen({
  title,
  subtitle,
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-300/70 px-6 py-10">
      <div className="w-full max-w-[460px] origin-center scale-[0.75]">
        <div className="mb-8 text-center">
          <svg viewBox="0 0 760 320" className="mx-auto w-full max-w-[360px]" aria-hidden="true">
            <path d="M220 40 L380 220 L540 40 L490 40 L380 160 L270 40 Z" fill="#16c6d4" />
            <path d="M260 40 L380 175 L500 40 L460 40 L380 120 L300 40 Z" fill="#0b4698" />
            <text x="380" y="252" textAnchor="middle" fill="#0b4698" fontSize="86" fontWeight="800" letterSpacing="2">VELYNXIA</text>
            <text x="380" y="295" textAnchor="middle" fill="#0b4698" fontSize="33" fontWeight="500">Grow Faster. Sell Smarter.</text>
          </svg>
          <p className="mt-3 text-lg text-slate-600">{title} · {subtitle}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-slate-300 bg-white px-9 py-9 shadow-sm">
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <label className="block text-left text-lg font-semibold text-slate-600">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@velynxia.com"
              className="mt-3 h-14 w-full rounded-2xl border border-slate-300 px-4 text-xl text-slate-700 outline-none transition focus:border-blue-500"
              required
            />
          </label>

          <label className="block text-left text-lg font-semibold text-slate-600">
            <span>Password</span>
            <div className="relative mt-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 px-4 pr-20 text-xl text-slate-700 outline-none transition focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="-mt-1 text-right">
            <a href="#" className="text-base text-blue-600 underline underline-offset-4 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 w-full rounded-2xl bg-blue-600 text-3xl font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-xl text-slate-500">Internal use only - Velynxia</p>
      </div>
    </main>
  );
}
