"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAvatars } from "@/lib/studio-api";
import { DEFAULT_GLOBAL_VOICE, DEFAULT_GLOBAL_VOICE_PRESETS } from "@/lib/voice-defaults";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function VoiceStudioPanel() {
  const { selectedAvatarId, setSelectedAvatarId } = useWorkspaceStore();
  const avatarsQuery = useQuery({
    queryKey: ["studio", "avatars"],
    queryFn: fetchAvatars,
  });

  const avatars = useMemo(() => avatarsQuery.data ?? [], [avatarsQuery.data]);
  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === selectedAvatarId),
    [avatars, selectedAvatarId],
  );
  const [preset] = useState(DEFAULT_GLOBAL_VOICE);
  const [sampleScript, setSampleScript] = useState("Welcome to Velynxia. We are ready to create your next video.");

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Voice Studio</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Pick a default voice preset and test script tone before rendering.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Avatar</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={selectedAvatarId ?? ""}
            onChange={(event) => setSelectedAvatarId(event.target.value || undefined)}
            disabled={avatarsQuery.isLoading || avatars.length === 0}
          >
            <option value="">{avatarsQuery.isLoading ? "Loading avatars..." : "Select avatar"}</option>
            {avatars.map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Default Voice Preset</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={preset}
            disabled
          >
            {DEFAULT_GLOBAL_VOICE_PRESETS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm text-[color:var(--text)]">
        <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Voice Test Script</span>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
          value={sampleScript}
          onChange={(event) => setSampleScript(event.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button type="button" className="rounded-xl bg-[color:var(--accent)] px-4 py-2 font-medium text-white">
          Preview Voice
        </button>
        <p className="text-[color:var(--muted)]">
          Active: {selectedAvatar?.name ?? "No avatar selected"} | Preset: {preset}
        </p>
      </div>
    </section>
  );
}
