import type { Avatar, Project } from "@/types/studio";

type AvatarApiItem = {
  id: string;
  name: string;
  language?: string;
  style?: string;
  cloneStatus?: string;
};

type ProjectApiItem = {
  id: string;
  name: string;
  status: string;
};

type AvatarsResponse = {
  avatars: AvatarApiItem[];
};

type ProjectsResponse = {
  projects: ProjectApiItem[];
};

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";
  const normalized = configured.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`);
  }
  return (await response.json()) as T;
}

function mapAvatarStatus(status?: string): Avatar["status"] {
  const normalized = status?.toLowerCase();
  if (normalized === "ready") {
    return "ready";
  }
  if (normalized === "training") {
    return "training";
  }
  return "draft";
}

function mapProjectStatus(status: string): Project["status"] {
  const normalized = status.toLowerCase();
  if (normalized === "completed") {
    return "completed";
  }
  if (normalized === "archived") {
    return "archived";
  }
  return "draft";
}

export async function fetchAvatars(): Promise<Avatar[]> {
  const payload = await fetchJson<AvatarsResponse>("/avatars");
  return payload.avatars.map((item) => ({
    id: item.id,
    name: item.name,
    language: item.language || "Unknown",
    voice: item.style || "Default voice",
    status: mapAvatarStatus(item.cloneStatus),
    updatedAt: "recently",
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  const payload = await fetchJson<ProjectsResponse>("/projects");
  return payload.projects.map((item) => ({
    id: item.id,
    name: item.name,
    status: mapProjectStatus(item.status),
    updatedAt: "recently",
  }));
}