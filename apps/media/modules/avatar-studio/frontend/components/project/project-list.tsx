"use client";

import { useProjectsQuery } from "@/lib/studio-queries";

export function ProjectList() {
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
    <div className="overflow-hidden rounded-2xl border border-[color:var(--border)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[color:var(--surface)] text-[color:var(--muted)]">
          <tr>
            <th className="px-3 py-2">Project</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text)]">
              <td className="px-3 py-2">{project.name}</td>
              <td className="px-3 py-2">{project.status}</td>
              <td className="px-3 py-2">{project.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
