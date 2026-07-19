import type {
  Avatar,
  Project,
  ProjectRenderResult,
  RenderJobStatus,
  Scene,
  SceneCreateInput,
  SceneUpdateInput,
} from "@/types/studio";

type AvatarApiItem = {
  id: string;
  name: string;
  language?: string;
  style?: string;
  cloneStatus?: string;
  imageUrl?: string;
  updatedAt?: string;
};

type ProjectApiItem = {
  id: string;
  name: string;
  status: string;
};

type AvatarsResponse = {
  avatars: AvatarApiItem[];
};

type AvatarResponse = {
  avatar: AvatarApiItem;
};

type ProjectsResponse = {
  projects: ProjectApiItem[];
};

type SceneApiItem = {
  id: string;
  orderIndex: number;
  title: string;
  narration: string;
  durationSeconds: number;
  background: string;
  imageUrl?: string;
  voiceAudioUrl?: string;
  music?: string;
};

type ScenesResponse = {
  scenes: SceneApiItem[];
};

let activeCorrelationId: string | null = null;

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `rid_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function buildRequestHeaders(extra?: Record<string, string>): Record<string, string> {
  const requestId = createId();
  const correlationId = activeCorrelationId || createId();
  return {
    "X-Request-Id": requestId,
    "X-Correlation-Id": correlationId,
    ...extra,
  };
}

function applyResponseCorrelation(response: Response): void {
  const responseCorrelationId = response.headers.get("x-correlation-id") || response.headers.get("X-Correlation-Id");
  if (responseCorrelationId) {
    activeCorrelationId = responseCorrelationId;
  }
}

export type PromptResult = {
  prompt: string;
  project: {
    id: string;
    name: string;
  };
  scene: {
    id: string;
    title: string;
  };
  script: {
    title: string;
    script: string;
    hook?: string;
    cta?: string;
  };
  video: {
    provider: string;
    status: string;
    videoJobId?: string;
    avatarId?: string;
    videoUrl?: string;
  };
};

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";
  const normalized = configured.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const headers = buildRequestHeaders();
  const response = await fetch(`${getApiBaseUrl()}${path}`, { headers });
  applyResponseCorrelation(response);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path} [correlationId=${headers["X-Correlation-Id"]}]`);
  }
  return (await response.json()) as T;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const headers = buildRequestHeaders({
    "Content-Type": "application/json",
  });
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  applyResponseCorrelation(response);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path} [correlationId=${headers["X-Correlation-Id"]}]`);
  }

  return (await response.json()) as T;
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const headers = buildRequestHeaders({
    "Content-Type": "application/json",
  });
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  applyResponseCorrelation(response);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path} [correlationId=${headers["X-Correlation-Id"]}]`);
  }

  return (await response.json()) as T;
}

async function deleteJson<T>(path: string): Promise<T> {
  const headers = buildRequestHeaders();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "DELETE",
    headers,
  });

  applyResponseCorrelation(response);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path} [correlationId=${headers["X-Correlation-Id"]}]`);
  }

  return (await response.json()) as T;
}

function mapScene(item: SceneApiItem): Scene {
  return {
    id: item.id,
    orderIndex: item.orderIndex,
    title: item.title,
    narration: item.narration,
    durationSeconds: item.durationSeconds,
    background: item.background,
    imageUrl: item.imageUrl ?? "",
    voiceAudioUrl: item.voiceAudioUrl ?? "",
    music: item.music ?? "none",
  };
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
    imageUrl: item.imageUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${item.id}`,
    updatedAt: item.updatedAt || "recently",
  }));
}

function mapAvatar(item: AvatarApiItem): Avatar {
  return {
    id: item.id,
    name: item.name,
    language: item.language || "Unknown",
    voice: item.style || "Default voice",
    status: mapAvatarStatus(item.cloneStatus),
    imageUrl: item.imageUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${item.id}`,
    updatedAt: item.updatedAt || "recently",
  };
}

export async function updateAvatar(avatarId: string, input: { name?: string; language?: string; style?: string }): Promise<Avatar> {
  const payload = await patchJson<AvatarResponse>(`/avatars/${avatarId}`, input);
  return mapAvatar(payload.avatar);
}

export async function duplicateAvatar(avatarId: string): Promise<Avatar> {
  const payload = await postJson<AvatarResponse>(`/avatars/${avatarId}/duplicate`, {});
  return mapAvatar(payload.avatar);
}

export async function deleteAvatar(avatarId: string): Promise<{ status: string; id: string }> {
  return deleteJson<{ status: string; id: string }>(`/avatars/${avatarId}`);
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

export async function runPrompt(prompt: string, avatarId?: string): Promise<PromptResult> {
  const payload: { prompt: string; avatar_id?: string } = { prompt };
  if (avatarId) {
    payload.avatar_id = avatarId;
  }
  return postJson<PromptResult>("/chat/prompt", payload);
}

export async function fetchProjectScenes(projectId: string): Promise<Scene[]> {
  const payload = await fetchJson<ScenesResponse>(`/timeline/${projectId}/scenes`);
  return payload.scenes.map(mapScene);
}

export async function createProjectScene(projectId: string, input: SceneCreateInput): Promise<Scene> {
  const payload = await postJson<SceneApiItem>(`/timeline/${projectId}/scenes`, {
    title: input.title,
    narration: input.narration,
    duration_seconds: input.durationSeconds ?? 10,
    background: input.background ?? "office",
    image_url: input.imageUrl ?? "",
    voice_audio_url: input.voiceAudioUrl ?? "",
    music: input.music ?? "none",
  });
  return mapScene(payload);
}

export async function updateProjectScene(projectId: string, sceneId: string, input: SceneUpdateInput): Promise<Scene> {
  const payload = await patchJson<SceneApiItem>(`/timeline/${projectId}/scenes/${sceneId}`, {
    title: input.title,
    narration: input.narration,
    duration_seconds: input.durationSeconds,
    background: input.background,
    image_url: input.imageUrl,
    voice_audio_url: input.voiceAudioUrl,
    music: input.music,
    order_index: input.orderIndex,
  });
  return mapScene(payload);
}

export async function renderProjectFromScenes(
  projectId: string,
  avatarId?: string,
  idempotencyKey?: string,
): Promise<ProjectRenderResult> {
  return postJson<ProjectRenderResult>(`/timeline/${projectId}/render`, {
    avatar_id: avatarId,
    idempotency_key: idempotencyKey,
  });
}

export async function fetchRenderJobStatus(projectId: string, jobId: string): Promise<RenderJobStatus> {
  return fetchJson<RenderJobStatus>(`/timeline/${projectId}/render/${jobId}`);
}