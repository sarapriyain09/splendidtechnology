"use client";

import type { ComponentType } from "react";
import {
  Activity,
  Blocks,
  Bot,
  FolderKanban,
  Gauge,
  Library,
  Link,
  Mic2,
  MonitorPlay,
  PanelsTopLeft,
  Presentation,
  ScanFace,
  ScrollText,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { MENU_ITEMS, type WorkspaceId } from "@/types/studio";
import { useWorkspaceStore } from "@/stores/workspace-store";

const iconByWorkspace: Record<WorkspaceId, ComponentType<{ className?: string }>> = {
  dashboard: Gauge,
  avatars: ScanFace,
  "avatar-training": Activity,
  "voice-studio": Mic2,
  "video-creator": Video,
  "screen-recorder": MonitorPlay,
  "presentation-studio": Presentation,
  "scene-builder": PanelsTopLeft,
  "media-library": Library,
  "script-assistant": ScrollText,
  templates: Blocks,
  projects: FolderKanban,
  integrations: Link,
  team: Users,
  analytics: Bot,
  settings: Settings,
};

export function Sidebar() {
  const { workspace, setWorkspace, sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useWorkspaceStore();

  function handleMobileWorkspaceSelect(workspaceId: WorkspaceId) {
    // Close the overlay first so the selection click is not swallowed by overlay transitions.
    setMobileSidebarOpen(false);
    requestAnimationFrame(() => {
      setWorkspace(workspaceId);
    });
  }

  return (
    <>
      <aside
        className={`hidden border-r border-[color:var(--border)] bg-[color:var(--surface)]/90 p-3 md:block ${
          sidebarCollapsed ? "w-[78px]" : "w-[270px]"
        }`}
      >
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = iconByWorkspace[item.id];
            const active = workspace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setWorkspace(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[color:var(--accent)] text-white"
                    : "text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted)]">Workspace</p>
            <p className="mt-1 text-sm text-[color:var(--text)]">Dedicated AI avatar platform</p>
          </div>
        )}
      </aside>

      {mobileSidebarOpen && (
        <>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/45 md:hidden"
            aria-label="Close menu overlay"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] p-3 md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[color:var(--text)]">Avatar Studio</p>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)]"
                aria-label="Close mobile sidebar"
              >
                <X className="h-4 w-4 text-[color:var(--text)]" />
              </button>
            </div>
            <nav className="h-[calc(100vh-84px)] space-y-1 overflow-y-auto pr-1">
              {MENU_ITEMS.map((item) => {
                const Icon = iconByWorkspace[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleMobileWorkspaceSelect(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                      workspace === item.id
                        ? "bg-[color:var(--accent)] text-white"
                        : "text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
