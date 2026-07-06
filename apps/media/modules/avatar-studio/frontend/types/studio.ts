export type WorkspaceId =
  | "dashboard"
  | "avatars"
  | "avatar-training"
  | "voice-studio"
  | "video-creator"
  | "screen-recorder"
  | "presentation-studio"
  | "scene-builder"
  | "media-library"
  | "script-assistant"
  | "templates"
  | "projects"
  | "integrations"
  | "team"
  | "analytics"
  | "settings";

export type ThemeMode = "light" | "dark";

export type RightPanelMode = "video" | "training" | "project" | "general";

export type Avatar = {
  id: string;
  name: string;
  language: string;
  voice: string;
  status: "ready" | "training" | "draft";
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  status: "draft" | "completed" | "archived";
  updatedAt: string;
};

export const MENU_ITEMS: Array<{ id: WorkspaceId; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "avatars", label: "Avatars" },
  { id: "avatar-training", label: "Avatar Training" },
  { id: "voice-studio", label: "Voice Studio" },
  { id: "video-creator", label: "Video Creator" },
  { id: "screen-recorder", label: "Screen Recorder" },
  { id: "presentation-studio", label: "Presentation Studio" },
  { id: "scene-builder", label: "Scene Builder" },
  { id: "media-library", label: "Media Library" },
  { id: "script-assistant", label: "Script Assistant" },
  { id: "templates", label: "Templates" },
  { id: "projects", label: "Projects" },
  { id: "integrations", label: "Integrations" },
  { id: "team", label: "Team" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];
