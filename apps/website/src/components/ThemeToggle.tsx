"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "velynxia-theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      applyTheme(storedTheme);
      return;
    }

    applyTheme("light");
  }, []);

  const setAndPersistTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1">
      <button
        type="button"
        onClick={() => setAndPersistTheme("light")}
        aria-label="Switch to light mode"
        aria-pressed={theme === "light"}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
          theme === "light"
            ? "bg-[color:var(--surface-soft)] text-[color:var(--text)]"
            : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setAndPersistTheme("dark")}
        aria-label="Switch to dark mode"
        aria-pressed={theme === "dark"}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
          theme === "dark"
            ? "bg-[color:var(--surface-soft)] text-[color:var(--text)]"
            : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
        }`}
      >
        Dark
      </button>
    </div>
  );
}
