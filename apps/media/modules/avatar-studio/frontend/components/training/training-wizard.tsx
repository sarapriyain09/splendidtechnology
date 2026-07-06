"use client";

import { useState } from "react";
import { ProgressTimeline } from "@/components/training/progress-timeline";
import { UploadArea } from "@/components/training/upload-area";

export function TrainingWizard() {
  const [step, setStep] = useState(1);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Avatar Training</h2>
        <p className="text-sm text-[color:var(--muted)]">Upload assets and monitor model training with a guided wizard.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
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
          <ProgressTimeline currentStep={step} />
          <button
            type="button"
            className="w-full rounded-xl bg-[color:var(--accent)] px-3 py-2 text-sm text-white"
            onClick={() => setStep((prev) => (prev + 1) % 4)}
          >
            Advance Step
          </button>
        </div>
      </div>
    </section>
  );
}
