"use client";

import { FormEvent, useEffect, useState } from "react";

type SettingsState = {
  defaultMarket: string;
  defaultCountry: string;
  scoringThreshold: number;
  notificationsEnabled: boolean;
};

const STORAGE_KEY = "product-intelligence.settings.v1";

const DEFAULT_SETTINGS: SettingsState = {
  defaultMarket: "amazon_uk",
  defaultCountry: "UK",
  scoringThreshold: 75,
  notificationsEnabled: true,
};

export function SettingsWorkbench() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<SettingsState>;
      setSettings((prev) => ({
        ...prev,
        ...parsed,
      }));
    } catch {
      // Keep defaults on malformed storage payload.
    } finally {
      setLoaded(true);
    }
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    setMessage("Settings saved locally for this browser profile.");
  }

  function resetDefaults() {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setMessage("Settings reset to defaults.");
  }

  function applyQuickPreset(preset: "uk" | "india" | "aggressive" | "safe") {
    if (preset === "uk") {
      setSettings((prev) => ({ ...prev, defaultMarket: "amazon_uk", defaultCountry: "UK" }));
      setMessage("Applied UK-focused preset.");
      return;
    }

    if (preset === "india") {
      setSettings((prev) => ({ ...prev, defaultMarket: "amazon_in", defaultCountry: "India" }));
      setMessage("Applied India-focused preset.");
      return;
    }

    if (preset === "aggressive") {
      setSettings((prev) => ({ ...prev, scoringThreshold: 68 }));
      setMessage("Applied aggressive scoring preset.");
      return;
    }

    setSettings((prev) => ({ ...prev, scoringThreshold: 82 }));
    setMessage("Applied safe scoring preset.");
  }

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="workspace-scroll min-h-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">Settings Assistant</h2>
          <p className="text-sm text-slate-600">Tell Product Studio how you prefer to run discovery and approvals.</p>
        </header>

        <div className="mt-4 space-y-3">
          <article className="max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Assistant</p>
            <p className="mt-1 text-sm text-slate-800">I can tune your defaults. Choose a preset or use the controls on the right.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyQuickPreset("uk")}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                UK Focused
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset("india")}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                India Focused
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset("aggressive")}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                Aggressive Scoring
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset("safe")}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                Safe Scoring
              </button>
            </div>
          </article>

          <article className="ml-auto max-w-xl rounded-2xl border border-blue-800/60 bg-blue-900/30 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-300">Current Preferences</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-100">
              <li>Default Market: {settings.defaultMarket}</li>
              <li>Default Country: {settings.defaultCountry}</li>
              <li>Opportunity Threshold: {settings.scoringThreshold}</li>
              <li>Notifications: {settings.notificationsEnabled ? "Enabled" : "Disabled"}</li>
            </ul>
          </article>

          {message ? (
            <article className="max-w-xl rounded-2xl border border-emerald-700/50 bg-emerald-900/20 p-4 text-sm text-emerald-100">
              {message}
            </article>
          ) : null}
        </div>
      </section>

      <aside className="workspace-scroll min-h-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Manual Controls</h3>
        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">Default Market</span>
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              value={settings.defaultMarket}
              onChange={(event) => setSettings((prev) => ({ ...prev, defaultMarket: event.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">Default Country</span>
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              value={settings.defaultCountry}
              onChange={(event) => setSettings((prev) => ({ ...prev, defaultCountry: event.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">Opportunity Threshold</span>
            <input
              type="number"
              min={0}
              max={100}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              value={settings.scoringThreshold}
              onChange={(event) => setSettings((prev) => ({ ...prev, scoringThreshold: Number(event.target.value) }))}
            />
          </label>

          <label className="flex items-center gap-2 pt-1 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(event) => setSettings((prev) => ({ ...prev, notificationsEnabled: event.target.checked }))}
            />
            Enable notifications
          </label>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={!loaded}
              className="rounded-lg bg-[#2f65c8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Reset
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
