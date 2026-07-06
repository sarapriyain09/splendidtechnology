import { Copy, PlayCircle, Trash2 } from "lucide-react";
import type { Avatar } from "@/types/studio";

type Props = {
  avatar: Avatar;
  isSelected: boolean;
  onOpen: () => void;
  onGenerate: () => void;
};

export function AvatarCard({ avatar, isSelected, onOpen, onGenerate }: Props) {
  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        isSelected
          ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
          : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"
      }`}
    >
      <div className="mb-3 h-32 rounded-xl bg-[color:var(--surface)] p-3">
        <div className="h-full w-full rounded-lg border border-dashed border-[color:var(--border)]" />
      </div>
      <h3 className="text-sm font-semibold text-[color:var(--text)]">{avatar.name}</h3>
      <p className="mt-1 text-xs text-[color:var(--muted)]">{avatar.language} • {avatar.voice}</p>
      <p className="mt-1 text-xs text-[color:var(--muted)]">Status: {avatar.status} • Updated {avatar.updatedAt}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <button type="button" onClick={onOpen} className="rounded-lg border border-[color:var(--border)] px-2 py-2 text-[color:var(--text)]">
          Open
        </button>
        <button type="button" onClick={onGenerate} className="rounded-lg bg-[color:var(--accent)] px-2 py-2 text-white">
          Generate Video
        </button>
        <button type="button" className="inline-flex items-center justify-center gap-1 rounded-lg border border-[color:var(--border)] px-2 py-2 text-[color:var(--text)]">
          <Copy className="h-3 w-3" /> Duplicate
        </button>
        <button type="button" className="inline-flex items-center justify-center gap-1 rounded-lg border border-[color:var(--border)] px-2 py-2 text-[color:var(--text)]">
          <Trash2 className="h-3 w-3" /> Delete
        </button>
      </div>

      <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--muted)]">
        <PlayCircle className="h-3 w-3" /> Preview
      </button>
    </article>
  );
}
