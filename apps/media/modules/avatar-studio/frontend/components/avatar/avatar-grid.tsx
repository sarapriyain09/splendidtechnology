"use client";

import { AvatarCard } from "@/components/avatar/avatar-card";
import { useAvatarsQuery } from "@/lib/studio-queries";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function AvatarGrid() {
  const { selectedAvatarId, setSelectedAvatarId, setWorkspace } = useWorkspaceStore();
  const avatarsQuery = useAvatarsQuery();

  if (avatarsQuery.isLoading) {
    return <p className="text-sm text-[color:var(--muted)]">Loading avatars...</p>;
  }

  if (avatarsQuery.isError) {
    return <p className="text-sm text-red-500">Failed to load avatars. Please try again.</p>;
  }

  const avatars = avatarsQuery.data ?? [];

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Avatar Library</h2>
          <p className="text-sm text-[color:var(--muted)]">Manage your AI presenters and start new videos quickly.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {avatars.map((avatar) => (
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

      {avatars.length === 0 && (
        <p className="text-sm text-[color:var(--muted)]">No avatars found yet. Start a training job to create one.</p>
      )}
    </section>
  );
}
