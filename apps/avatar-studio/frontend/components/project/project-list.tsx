import { SAMPLE_PROJECTS } from "@/types/studio";

export function ProjectList() {
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
          {SAMPLE_PROJECTS.map((project) => (
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
