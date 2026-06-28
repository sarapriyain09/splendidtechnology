"use client";

import { AvatarCard } from "@/components/avatar/avatar-card";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { SAMPLE_AVATARS } from "@/types/studio";

export function AvatarGrid() {
  const { selectedAvatarId, setSelectedAvatarId, setWorkspace } = useWorkspaceStore();

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Avatar Library</h2>
          <p className="text-sm text-[color:var(--muted)]">Manage your AI presenters and start new videos quickly.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {SAMPLE_AVATARS.map((avatar) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatarId === avatar.id}
            onOpen={() => setSelectedAvatarId(avatar.id)}
            onGenerate={() => {
              setSelectedAvatarId(avatar.id);
              setWorkspace("video-creator");
            }}
          />
        ))}
      </div>
    </section>
  );
}
