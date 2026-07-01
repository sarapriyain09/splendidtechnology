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

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-700">Configure default module preferences and persistence behavior.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Default Market</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={settings.defaultMarket}
            onChange={(event) => setSettings((prev) => ({ ...prev, defaultMarket: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-700">Default Country</span>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
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
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={settings.scoringThreshold}
            onChange={(event) => setSettings((prev) => ({ ...prev, scoringThreshold: Number(event.target.value) }))}
          />
        </label>

        <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(event) => setSettings((prev) => ({ ...prev, notificationsEnabled: event.target.checked }))}
          />
          Enable notifications
        </label>

        <div className="flex items-center gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={!loaded}
            className="rounded bg-[#10213d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Reset Defaults
          </button>
        </div>
      </form>

      {message ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>
      ) : null}
    </div>
  );
}
