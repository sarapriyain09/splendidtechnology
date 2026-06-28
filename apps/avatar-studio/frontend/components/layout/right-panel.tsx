"use client";

import { useMemo } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";

type PanelSection = {
  title: string;
  items: string[];
};

const panelConfig: Record<string, PanelSection[]> = {
  video: [
    { title: "Create Video", items: ["Avatar", "Voice", "Background", "Camera", "Captions"] },
    { title: "Production", items: ["Brand", "Timeline", "Music", "Resolution", "Export"] },
  ],
  training: [
    {
      title: "Training Requirements",
      items: ["Video Quality", "Lighting", "Audio Quality", "Estimated Training Time"],
    },
  ],
  project: [
    { title: "Project Editing", items: ["Properties", "Animations", "Transitions", "Voice", "Effects", "Export"] },
  ],
  general: [
    { title: "Workspace", items: ["AI Guidance", "Shortcuts", "Recent Activity", "Version"] },
  ],
};

export function RightPanel() {
  const { rightPanel } = useWorkspaceStore();
  const sections = useMemo(() => panelConfig[rightPanel], [rightPanel]);

  return (
    <aside className="hidden w-[320px] border-l border-[color:var(--border)] bg-[color:var(--surface)]/90 p-4 xl:block">
      <p className="mb-3 text-sm font-semibold text-[color:var(--text)]">Panel Controls</p>
      <div className="space-y-3">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{section.title}</h4>
            <ul className="mt-2 space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--text)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
