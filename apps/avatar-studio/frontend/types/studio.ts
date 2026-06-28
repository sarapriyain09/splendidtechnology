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

export const SAMPLE_AVATARS: Avatar[] = [
  {
    id: "ava-1",
    name: "Emma - CEO",
    language: "English (UK)",
    voice: "Warm Corporate",
    status: "ready",
    updatedAt: "2h ago",
  },
  {
    id: "ava-2",
    name: "Ravi - Product",
    language: "English (US)",
    voice: "Dynamic Presenter",
    status: "training",
    updatedAt: "14m ago",
  },
  {
    id: "ava-3",
    name: "Sofia - Sales",
    language: "Spanish",
    voice: "Confident",
    status: "draft",
    updatedAt: "1d ago",
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  { id: "prj-1", name: "Q3 Product Demo", status: "draft", updatedAt: "1h ago" },
  { id: "prj-2", name: "LinkedIn Thought Leadership", status: "completed", updatedAt: "yesterday" },
  { id: "prj-3", name: "Onboarding Course", status: "archived", updatedAt: "4d ago" },
];
