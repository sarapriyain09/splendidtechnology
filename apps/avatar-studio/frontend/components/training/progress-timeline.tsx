import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";

const steps = ["Upload Videos", "Upload Voice", "Training Progress", "Completed"];

type Props = {
  currentStep: number;
};

export function ProgressTimeline({ currentStep }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <li key={step} className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
            {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            {isCurrent && <LoaderCircle className="h-4 w-4 animate-spin text-[color:var(--accent)]" />}
            {!isDone && !isCurrent && <Circle className="h-4 w-4 text-[color:var(--muted)]" />}
            <span className="text-sm text-[color:var(--text)]">Step {index + 1}: {step}</span>
          </li>
        );
      })}
    </ol>
  );
}
