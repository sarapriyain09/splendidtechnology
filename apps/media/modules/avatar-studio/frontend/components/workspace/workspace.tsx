"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AvatarDetails } from "@/components/avatar/avatar-details";
import { AvatarGrid } from "@/components/avatar/avatar-grid";
import { PresentationUploader } from "@/components/presentation/presentation-uploader";
import { ProjectGrid } from "@/components/project/project-grid";
import { ProjectList } from "@/components/project/project-list";
import { TrainingWizard } from "@/components/training/training-wizard";
import { VoiceStudioPanel } from "@/components/voice/voice-studio-panel";
import { ExportDialog } from "@/components/video/export-dialog";
import { Timeline } from "@/components/video/timeline";
import { VideoForm } from "@/components/video/video-form";
import { useWorkspaceStore } from "@/stores/workspace-store";

function DashboardWorkspace() {
  const blocks = [
    "Quick Actions",
    "Recent Projects",
    "Recent Videos",
    "Training Jobs",
    "Storage Usage",
    "Rendering Queue",
  ];

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Dashboard</h2>
        <p className="text-sm text-[color:var(--muted)]">A clear command center for avatar and video operations.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => (
          <article key={block} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <h3 className="text-sm font-semibold text-[color:var(--text)]">{block}</h3>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Workspace insights appear here.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsWorkspace() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Projects</h2>
          <p className="text-sm text-[color:var(--muted)]">Track draft, completed, and archived AI video projects.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`rounded-lg px-3 py-2 text-xs ${
              view === "grid" ? "bg-[color:var(--accent)] text-white" : "border border-[color:var(--border)] text-[color:var(--text)]"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-lg px-3 py-2 text-xs ${
              view === "list" ? "bg-[color:var(--accent)] text-white" : "border border-[color:var(--border)] text-[color:var(--text)]"
            }`}
          >
            List
          </button>
        </div>
      </header>
      {view === "grid" ? <ProjectGrid /> : <ProjectList />}
    </section>
  );
}

function PlaceholderWorkspace({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
      <h2 className="text-xl font-semibold text-[color:var(--text)]">{title}</h2>
      <p className="mt-1 text-sm text-[color:var(--muted)]">This workspace is prepared for dedicated tools in the next iteration.</p>
    </section>
  );
}

export function Workspace() {
  const { workspace } = useWorkspaceStore();

  return (
    <motion.main
      key={workspace}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-4 p-4 md:p-6"
    >
      {workspace === "dashboard" && <DashboardWorkspace />}
      {workspace === "avatars" && (
        <div className="space-y-4">
          <AvatarGrid />
          <AvatarDetails />
        </div>
      )}
      {workspace === "avatar-training" && <TrainingWizard />}
      {workspace === "video-creator" && (
        <div className="space-y-4">
          <VideoForm />
          <div className="grid gap-3 xl:grid-cols-2">
            <Timeline />
            <ExportDialog />
          </div>
        </div>
      )}
      {workspace === "presentation-studio" && <PresentationUploader />}
      {workspace === "projects" && <ProjectsWorkspace />}

      {workspace === "voice-studio" && <VoiceStudioPanel />}
      {workspace === "screen-recorder" && <PlaceholderWorkspace title="Screen Recorder" />}
      {workspace === "scene-builder" && <PlaceholderWorkspace title="Scene Builder" />}
      {workspace === "media-library" && <PlaceholderWorkspace title="Media Library" />}
      {workspace === "script-assistant" && <PlaceholderWorkspace title="Script Assistant" />}
      {workspace === "templates" && <PlaceholderWorkspace title="Templates" />}
      {workspace === "integrations" && <PlaceholderWorkspace title="Integrations" />}
      {workspace === "team" && <PlaceholderWorkspace title="Team" />}
      {workspace === "analytics" && <PlaceholderWorkspace title="Analytics" />}
      {workspace === "settings" && <PlaceholderWorkspace title="Settings" />}
    </motion.main>
  );
}
