"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectScene,
  fetchRenderJobStatus,
  fetchProjectScenes,
  renderProjectFromScenes,
  updateProjectScene,
} from "@/lib/studio-api";
import { useWorkspaceStore } from "@/stores/workspace-store";
import type { RenderExecutionTelemetry, Scene } from "@/types/studio";

const MUSIC_OPTIONS = ["none", "ambient", "cinematic", "corporate", "energetic"];

function createRenderAttemptKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `render_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function SceneCard({
  scene,
  onSave,
}: {
  scene: Scene;
  onSave: (sceneId: string, patch: Partial<Scene>) => Promise<void>;
}) {
  const [draft, setDraft] = useState(scene);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onSave(scene.id, draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Scene {scene.orderIndex}</span>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs text-[color:var(--text)] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <input
        className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
        value={draft.title}
        onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
        placeholder="Scene title"
      />

      <textarea
        rows={3}
        className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
        value={draft.narration}
        onChange={(event) => setDraft((prev) => ({ ...prev, narration: event.target.value }))}
        placeholder="Scene narration"
      />

      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
          value={draft.background}
          onChange={(event) => setDraft((prev) => ({ ...prev, background: event.target.value }))}
          placeholder="Background"
        />
        <input
          type="number"
          min={1}
          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
          value={draft.durationSeconds}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              durationSeconds: Number(event.target.value) || 1,
            }))
          }
          placeholder="Duration (seconds)"
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
          value={draft.imageUrl}
          onChange={(event) => setDraft((prev) => ({ ...prev, imageUrl: event.target.value }))}
          placeholder="Scene image URL"
        />
        <input
          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
          value={draft.voiceAudioUrl}
          onChange={(event) => setDraft((prev) => ({ ...prev, voiceAudioUrl: event.target.value }))}
          placeholder="Scene voice URL"
        />
      </div>

      <select
        className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none"
        value={draft.music}
        onChange={(event) => setDraft((prev) => ({ ...prev, music: event.target.value }))}
      >
        {MUSIC_OPTIONS.map((music) => (
          <option key={music} value={music}>
            {music}
          </option>
        ))}
      </select>
    </article>
  );
}

export function Timeline() {
  const queryClient = useQueryClient();
  const { selectedProjectId, selectedAvatarId } = useWorkspaceStore();
  const isMountedRef = useRef(true);
  const selectedProjectIdRef = useRef<string | null>(selectedProjectId);
  const renderPollTokenRef = useRef(0);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderUrl, setRenderUrl] = useState<string>("");
  const [renderIdempotencyKey, setRenderIdempotencyKey] = useState<string>("");
  const [renderWasReplayed, setRenderWasReplayed] = useState(false);
  const [renderStatus, setRenderStatus] = useState<string>("");
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [activeRenderJobId, setActiveRenderJobId] = useState<string>("");
  const [lastRenderInputKey, setLastRenderInputKey] = useState<string>("");
  const [isRenderSubmitting, setIsRenderSubmitting] = useState(false);
  const [renderExecution, setRenderExecution] = useState<RenderExecutionTelemetry | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      renderPollTokenRef.current += 1;
    };
  }, []);

  useEffect(() => {
    selectedProjectIdRef.current = selectedProjectId;
    renderPollTokenRef.current += 1;
    setRenderError(null);
    setRenderUrl("");
    setRenderIdempotencyKey("");
    setRenderWasReplayed(false);
    setRenderStatus("");
    setRenderProgress(0);
    setActiveRenderJobId("");
    setIsRenderSubmitting(false);
    setRenderExecution(null);
  }, [selectedProjectId]);

  function canApplyRenderUpdate(projectId: string, pollToken: number): boolean {
    return (
      isMountedRef.current &&
      selectedProjectIdRef.current === projectId &&
      renderPollTokenRef.current === pollToken
    );
  }

  const scenesQuery = useQuery({
    queryKey: ["studio", "timeline", selectedProjectId],
    queryFn: () => fetchProjectScenes(selectedProjectId as string),
    enabled: Boolean(selectedProjectId),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ sceneId, patch }: { sceneId: string; patch: Partial<Scene> }) => {
      if (!selectedProjectId) {
        throw new Error("Select a project first.");
      }
      return updateProjectScene(selectedProjectId, sceneId, {
        title: patch.title,
        narration: patch.narration,
        durationSeconds: patch.durationSeconds,
        background: patch.background,
        imageUrl: patch.imageUrl,
        voiceAudioUrl: patch.voiceAudioUrl,
        music: patch.music,
        orderIndex: patch.orderIndex,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["studio", "timeline", selectedProjectId] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProjectId) {
        throw new Error("Select a project first.");
      }
      const current = scenesQuery.data ?? [];
      const nextIndex = current.length + 1;
      return createProjectScene(selectedProjectId, {
        title: `Scene ${nextIndex}`,
        narration: "",
        durationSeconds: 10,
        background: "office",
        imageUrl: "",
        voiceAudioUrl: "",
        music: "none",
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["studio", "timeline", selectedProjectId] });
    },
  });

  const renderMutation = useMutation({
    mutationFn: async ({ projectId, avatarId, idempotencyKey }: { projectId: string; avatarId?: string; idempotencyKey: string; pollToken: number }) => {
      return renderProjectFromScenes(projectId, avatarId, idempotencyKey);
    },
    onSuccess: (result, variables) => {
      if (!canApplyRenderUpdate(variables.projectId, variables.pollToken)) {
        return;
      }
      setRenderError(null);
      setRenderIdempotencyKey(result.idempotencyKey || "");
      setRenderWasReplayed(Boolean(result.replayed));
      setRenderStatus(result.status || "");
      setRenderProgress(result.progressPercent || 0);
      setActiveRenderJobId(result.jobId || "");
      if (result.video?.outputUrl) {
        setRenderUrl(result.video.outputUrl);
      }
      setRenderExecution(result.video?.renderExecution ?? null);
      void queryClient.invalidateQueries({ queryKey: ["studio", "projects"] });
    },
    onError: (error, variables) => {
      if (variables && !canApplyRenderUpdate(variables.projectId, variables.pollToken)) {
        return;
      }
      const message = error instanceof Error ? error.message : "Failed to render project.";
      setRenderError(message);
      setRenderUrl("");
      setRenderIdempotencyKey("");
      setRenderWasReplayed(false);
      setRenderStatus("");
      setRenderProgress(0);
      setActiveRenderJobId("");
      setRenderExecution(null);
    },
  });

  async function waitForRenderCompletion(projectId: string, jobId: string, pollToken: number): Promise<void> {
    const maxAttempts = 45;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (!canApplyRenderUpdate(projectId, pollToken)) {
        return;
      }

      const status = await fetchRenderJobStatus(projectId, jobId);
      if (!canApplyRenderUpdate(projectId, pollToken)) {
        return;
      }

      setRenderStatus(status.status || "");
      setRenderProgress(status.progressPercent || 0);

      if (status.idempotencyKey) {
        setRenderIdempotencyKey(status.idempotencyKey);
      }

      if (status.video?.outputUrl) {
        setRenderUrl(status.video.outputUrl);
      }
      if (status.video?.renderExecution) {
        setRenderExecution(status.video.renderExecution);
      }

      if (status.status === "COMPLETED" || status.status === "FAILED") {
        return;
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), 1000);
      });
    }
  }

  async function handleRenderProject(): Promise<void> {
    if (isRenderSubmitting || renderMutation.isPending || !selectedProjectId) {
      return;
    }

    const projectId = selectedProjectId;
    const pollToken = renderPollTokenRef.current + 1;
    renderPollTokenRef.current = pollToken;

    setIsRenderSubmitting(true);
    const idempotencyKey = createRenderAttemptKey();
    try {
      const result = await renderMutation.mutateAsync({
        projectId,
        avatarId: selectedAvatarId,
        idempotencyKey,
        pollToken,
      });
      if (canApplyRenderUpdate(projectId, pollToken) && result.jobId) {
        await waitForRenderCompletion(projectId, result.jobId, pollToken);
      }
      if (canApplyRenderUpdate(projectId, pollToken)) {
        setLastRenderInputKey(idempotencyKey);
        setRenderError(null);
      }
    } finally {
      if (canApplyRenderUpdate(projectId, pollToken)) {
        setIsRenderSubmitting(false);
      }
    }
  }

  async function handleRetryLastRender(): Promise<void> {
    if (isRenderSubmitting || renderMutation.isPending || !lastRenderInputKey || !selectedProjectId) {
      return;
    }

    const projectId = selectedProjectId;
    const pollToken = renderPollTokenRef.current + 1;
    renderPollTokenRef.current = pollToken;

    setIsRenderSubmitting(true);
    try {
      const result = await renderMutation.mutateAsync({
        projectId,
        avatarId: selectedAvatarId,
        idempotencyKey: lastRenderInputKey,
        pollToken,
      });
      if (canApplyRenderUpdate(projectId, pollToken) && result.jobId) {
        await waitForRenderCompletion(projectId, result.jobId, pollToken);
      }
      if (canApplyRenderUpdate(projectId, pollToken)) {
        setRenderError(null);
      }
    } finally {
      if (canApplyRenderUpdate(projectId, pollToken)) {
        setIsRenderSubmitting(false);
      }
    }
  }

  const scenes = useMemo(() => scenesQuery.data ?? [], [scenesQuery.data]);

  if (!selectedProjectId) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
        <h3 className="text-sm font-semibold text-[color:var(--text)]">Scene Timeline</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">Select a project in Projects first, then return here to edit scene frames.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--text)]">Scene Timeline</h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Per-scene image, voice, and music setup for project rendering.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--text)] disabled:opacity-60"
          >
            {createMutation.isPending ? "Adding..." : "Add Scene"}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleRenderProject();
            }}
            disabled={renderMutation.isPending || isRenderSubmitting}
            className="rounded-lg bg-[color:var(--accent)] px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
          >
            {renderMutation.isPending || isRenderSubmitting ? "Rendering..." : "Render Project"}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleRetryLastRender();
            }}
            disabled={renderMutation.isPending || isRenderSubmitting || !lastRenderInputKey}
            className="rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--text)] disabled:opacity-60"
          >
            Retry Last Render
          </button>
        </div>
      </div>

      {scenesQuery.isLoading && <p className="text-xs text-[color:var(--muted)]">Loading scenes...</p>}
      {scenesQuery.isError && <p className="text-xs text-red-500">Failed to load scenes.</p>}

      {!scenesQuery.isLoading && scenes.length === 0 && (
        <div className="rounded-lg border border-dashed border-[color:var(--border)] p-4 text-xs text-[color:var(--muted)]">
          No scenes yet. Add your first scene.
        </div>
      )}

      <div className="space-y-2">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onSave={async (sceneId, patch) => {
              await updateMutation.mutateAsync({ sceneId, patch });
            }}
          />
        ))}
      </div>

      {renderError && <p className="text-xs text-red-500">{renderError}</p>}

      {activeRenderJobId && !renderUrl && (
        <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <p className="text-xs font-medium text-[color:var(--text)]">Render in progress</p>
          <p className="text-xs text-[color:var(--muted)]">Job: {activeRenderJobId}</p>
          <p className="text-xs text-[color:var(--muted)]">Status: {renderStatus || "QUEUED"}</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-soft)]">
            <div
              className="h-full bg-[color:var(--accent)] transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, renderProgress))}%` }}
            />
          </div>
          {renderExecution && (
            <div className="grid gap-1 text-xs text-[color:var(--muted)] md:grid-cols-3">
              <p>Attempts: {renderExecution.attemptCount}</p>
              <p>Fallback used: {renderExecution.fallbackUsed ? "Yes" : "No"}</p>
              <p>Duration: {renderExecution.durationMs} ms</p>
            </div>
          )}
        </div>
      )}

      {renderUrl && (
        <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <p className="text-xs font-medium text-[color:var(--text)]">Latest render</p>
          {renderIdempotencyKey && (
            <p className="text-xs text-[color:var(--muted)]">Idempotency key: {renderIdempotencyKey}</p>
          )}
          {renderWasReplayed && (
            <p className="text-xs text-[color:var(--muted)]">Replayed result: duplicate render request was safely deduplicated.</p>
          )}
          {renderExecution && (
            <div className="grid gap-1 text-xs text-[color:var(--muted)] md:grid-cols-3">
              <p>Attempts: {renderExecution.attemptCount}</p>
              <p>Fallback used: {renderExecution.fallbackUsed ? "Yes" : "No"}</p>
              <p>Render duration: {renderExecution.durationMs} ms</p>
            </div>
          )}
          <video className="w-full rounded-lg border border-[color:var(--border)] bg-black" controls src={renderUrl} />
          <a
            href={renderUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--text)]"
          >
            Open video in new tab
          </a>
        </div>
      )}
    </div>
  );
}
