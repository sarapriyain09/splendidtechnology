"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProgressTimeline } from "@/components/training/progress-timeline";
import { UploadArea } from "@/components/training/upload-area";
import { enqueueAvatarTraining, fetchAvatarTrainingStatus, startAvatarTraining } from "@/lib/studio-api";

export function TrainingWizard() {
  const [trainingId, setTrainingId] = useState<string>("");
  const [avatarName, setAvatarName] = useState<string>("My Avatar");
  const [mode, setMode] = useState<string>("clone");

  const startMutation = useMutation({
    mutationFn: () => startAvatarTraining(avatarName.trim() || "My Avatar", mode),
    onSuccess: async (result) => {
      setTrainingId(result.jobId);
      if (result.status === "QUEUED") {
        await enqueueAvatarTraining(result.jobId);
      }
    },
  });

  const trainingStatusQuery = useQuery({
    queryKey: ["studio", "training", trainingId],
    queryFn: () => fetchAvatarTrainingStatus(trainingId),
    enabled: Boolean(trainingId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "QUEUED" || status === "RUNNING") {
        return 1500;
      }
      return false;
    },
  });

  const currentStep = useMemo(() => {
    const stage = trainingStatusQuery.data?.stage;
    if (!stage) {
      return 0;
    }
    if (stage === "UPLOADING") {
      return 0;
    }
    if (stage === "EXTRACTING_VOICE") {
      return 1;
    }
    if (stage === "COMPLETED") {
      return 3;
    }
    return 2;
  }, [trainingStatusQuery.data?.stage]);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Avatar Training</h2>
        <p className="text-sm text-[color:var(--muted)]">Upload assets and monitor model training with a guided wizard.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 md:grid-cols-2">
            <label className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              Avatar Name
              <input
                className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm normal-case text-[color:var(--text)] outline-none"
                value={avatarName}
                onChange={(event) => setAvatarName(event.target.value)}
                placeholder="Enter avatar name"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              Mode
              <select
                className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm normal-case text-[color:var(--text)] outline-none"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                <option value="clone">clone</option>
                <option value="voice-only">voice-only</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
              className="md:col-span-2 rounded-xl bg-[color:var(--accent)] px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              {startMutation.isPending ? "Starting..." : "Start Training"}
            </button>
            {trainingId && <p className="md:col-span-2 text-xs text-[color:var(--muted)]">Training Job: {trainingId}</p>}
            {startMutation.isError && <p className="md:col-span-2 text-xs text-red-500">Failed to start training.</p>}
          </div>

          <UploadArea title="Step 1: Upload Videos" description="Provide clear clips with stable framing." />
          <UploadArea title="Step 2: Upload Voice" description="Upload clean voice recordings for cloning." />
          <UploadArea title="Step 3: Training Progress" description="Track queue, ingestion, and model fit metrics." />
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <h4 className="text-sm font-semibold text-[color:var(--text)]">Step 4: Completed</h4>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Your avatar will appear in the Avatar Library.</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <h3 className="text-sm font-semibold text-[color:var(--text)]">Progress Timeline</h3>
          <ProgressTimeline
            currentStep={currentStep}
            stageLabel={trainingStatusQuery.data?.stage}
            statusLabel={trainingStatusQuery.data?.status}
            progressPercent={trainingStatusQuery.data?.progress}
          />
          {trainingStatusQuery.isFetching && <p className="text-xs text-[color:var(--muted)]">Refreshing training status...</p>}
          {trainingStatusQuery.isError && <p className="text-xs text-red-500">Failed to load training status.</p>}
        </div>
      </div>
    </section>
  );
}
