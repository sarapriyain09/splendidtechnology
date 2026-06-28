import { create } from "zustand";
import type { RightPanelMode, ThemeMode, WorkspaceId } from "@/types/studio";

type WorkspaceState = {
  workspace: WorkspaceId;
  rightPanel: RightPanelMode;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  selectedAvatarId?: string;
  selectedProjectId?: string;
  theme: ThemeMode;
  setWorkspace: (workspace: WorkspaceId) => void;
  setRightPanel: (rightPanel: RightPanelMode) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  setSelectedAvatarId: (avatarId?: string) => void;
  setSelectedProjectId: (projectId?: string) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const panelByWorkspace: Record<WorkspaceId, RightPanelMode> = {
  dashboard: "general",
  avatars: "video",
  "avatar-training": "training",
  "voice-studio": "video",
  "video-creator": "video",
  "screen-recorder": "project",
  "presentation-studio": "project",
  "scene-builder": "project",
  "media-library": "project",
  "script-assistant": "video",
  templates: "project",
  projects: "project",
  integrations: "general",
  team: "general",
  analytics: "general",
  settings: "general",
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: "dashboard",
  rightPanel: "general",
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  selectedAvatarId: undefined,
  selectedProjectId: undefined,
  theme: "light",
  setWorkspace: (workspace) =>
    set({
      workspace,
      rightPanel: panelByWorkspace[workspace],
      mobileSidebarOpen: false,
    }),
  setRightPanel: (rightPanel) => set({ rightPanel }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (isOpen) => set({ mobileSidebarOpen: isOpen }),
  setSelectedAvatarId: (avatarId) => set({ selectedAvatarId: avatarId }),
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
