"use client";

import { Bell, Menu, Moon, Search, Sun, UserCircle2 } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function Header() {
  const { toggleSidebar, setMobileSidebarOpen, theme, setTheme, toggleTheme } = useWorkspaceStore();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[color:var(--border)] bg-[color:var(--header)] backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1700px] items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] md:inline-flex"
          aria-label="Collapse sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent)] text-white">V</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[color:var(--text)]">Velynxia</p>
            <p className="truncate text-xs text-[color:var(--muted)]">Avatar Studio</p>
          </div>
        </div>

        <div className="ml-3 hidden flex-1 items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-[color:var(--muted)]" />
          <input
            className="w-full bg-transparent text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
            placeholder="Search avatars, projects, and templates"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1 md:flex">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                theme === "light"
                  ? "bg-[color:var(--surface-hover)] text-[color:var(--text)]"
                  : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
              }`}
              aria-label="Switch to light mode"
              aria-pressed={theme === "light"}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                theme === "dark"
                  ? "bg-[color:var(--surface-hover)] text-[color:var(--text)]"
                  : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
              }`}
              aria-label="Switch to dark mode"
              aria-pressed={theme === "dark"}
            >
              Dark
            </button>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] md:hidden"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-2 text-[color:var(--text)]"
            aria-label="Profile"
          >
            <UserCircle2 className="h-4 w-4" />
            <span className="hidden text-sm md:inline">Sarah</span>
          </button>
        </div>
      </div>
    </header>
  );
}
