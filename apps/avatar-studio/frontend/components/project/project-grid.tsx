"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { SAMPLE_PROJECTS } from "@/types/studio";

export function ProjectGrid() {
  const { selectedProjectId, setSelectedProjectId } = useWorkspaceStore();

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {SAMPLE_PROJECTS.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => setSelectedProjectId(project.id)}
          className={`rounded-2xl border p-4 text-left ${
            selectedProjectId === project.id
              ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
              : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"
          }`}
        >
          <h3 className="text-sm font-semibold text-[color:var(--text)]">{project.name}</h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{project.status} • {project.updatedAt}</p>
        </button>
      ))}
    </div>
  );
}
