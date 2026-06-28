"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const showAvatarStudio = process.env.NODE_ENV !== "production";

const navItems = [
  { href: "/dashboard/voice-studio", label: "Voice Studio", available: true },
  { href: "/dashboard/script-studio", label: "Script Studio", available: true },
  { href: "/dashboard/one-pager-creator", label: "One Pager Creator", available: true },
  { href: "/dashboard/presentation-studio", label: "Presentation Studio", available: true },
  { href: "/dashboard/podcast-studio", label: "Podcast Studio", available: true },
  { href: "/dashboard/subtitle-studio", label: "Subtitle Studio", available: true },
  { href: "/dashboard/background-music-studio", label: "Background Music Studio", available: true },
  { href: "/dashboard/video-studio", label: "Video Studio", available: true },
  ...(showAvatarStudio ? [{ href: "/dashboard/avatar-studio", label: "Avatar Studio", available: true }] : []),
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("aimedia-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }
    setTheme("light");
  }, []);

  function handleTheme(nextTheme: "light" | "dark") {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("aimedia-theme", nextTheme);
  }

  return (
    <aside className="panel animate-float-in rounded-3xl bg-gradient-to-b from-[#061230] to-[#030814] p-4 text-slate-200">
      <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="rounded-xl bg-white p-1.5">
          <Image
            src="/velynxia-Logo.png"
            alt="Velynxia"
            width={300}
            height={200}
            className="mx-auto h-auto w-full max-w-[140px] object-contain"
            priority
          />
        </div>
      </div>

      <nav className="space-y-1.5">
        <Link href="/dashboard" className="group block rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
          Dashboard
        </Link>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group block rounded-xl px-3 py-2.5 text-sm transition ${
                active
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)]"
                  : item.available
                    ? "text-slate-300 hover:bg-white/10 hover:text-white"
                    : "text-slate-500"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : item.available ? "bg-cyan-300/70" : "bg-slate-600"}`} />
                  {item.label}
                </span>
                  <span className={`text-[10px] ${active ? "text-white/85" : "text-slate-500"}`}>
                  {item.available ? "Open" : "Soon"}
                </span>
              </span>
            </Link>
          );
        })}

          <div className="mt-3 border-t border-white/10 pt-3">
            <button className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">History</button>
          <Link
            href="/dashboard/settings"
            className={`mt-1 block rounded-xl px-3 py-2.5 text-left text-sm transition ${
              pathname === "/dashboard/settings"
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Settings
          </Link>
        </div>
      </nav>

      <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
        <div className="mb-4 flex items-center rounded-xl border border-[color:var(--line)] bg-[color:var(--panel-soft)] p-1">
          <button
            type="button"
            onClick={() => handleTheme("light")}
            className={`w-1/2 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
              theme === "light" ? "bg-[color:var(--surface-hover)] text-[color:var(--foreground)]" : "text-[color:var(--muted)]"
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => handleTheme("dark")}
            className={`w-1/2 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
              theme === "dark" ? "bg-[color:var(--surface-hover)] text-[color:var(--foreground)]" : "text-[color:var(--muted)]"
            }`}
          >
            Dark
          </button>
        </div>
        <p className="text-xs uppercase tracking-wide text-cyan-300/80">AI Credits</p>
        <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">8,450</p>
        <p className="text-xs text-[color:var(--muted)]">/ 20,000</p>
        <button className="mt-4 w-full rounded-xl bg-[color:var(--accent)] px-3 py-2 text-sm font-semibold text-white">Upgrade Plan</button>
      </div>
    </aside>
  );
}
