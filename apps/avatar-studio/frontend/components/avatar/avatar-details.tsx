"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { SAMPLE_AVATARS } from "@/types/studio";

export function AvatarDetails() {
  const { selectedAvatarId } = useWorkspaceStore();
  const avatar = useMemo(() => SAMPLE_AVATARS.find((item) => item.id === selectedAvatarId), [selectedAvatarId]);

  if (!avatar) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
        Select an avatar to inspect details.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--text)]">
      <h3 className="font-semibold">{avatar.name}</h3>
      <p className="mt-1 text-[color:var(--muted)]">Language: {avatar.language}</p>
      <p className="text-[color:var(--muted)]">Voice: {avatar.voice}</p>
      <p className="text-[color:var(--muted)]">Status: {avatar.status}</p>
    </div>
  );
}
