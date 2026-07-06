"use client";

import { useProjectsQuery } from "@/lib/studio-queries";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function ProjectGrid() {
  const { selectedProjectId, setSelectedProjectId } = useWorkspaceStore();
  const projectsQuery = useProjectsQuery();

  if (projectsQuery.isLoading) {
    return <p className="text-sm text-[color:var(--muted)]">Loading projects...</p>;
  }

  if (projectsQuery.isError) {
    return <p className="text-sm text-red-500">Failed to load projects. Please try again.</p>;
  }

  const projects = projectsQuery.data ?? [];

  if (projects.length === 0) {
    return <p className="text-sm text-[color:var(--muted)]">No projects found yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {projects.map((project) => (
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
