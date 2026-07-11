"use client";

import { useState } from "react";
import { Mic, Paperclip, Sparkles } from "lucide-react";
import { runPrompt, type PromptResult } from "@/lib/studio-api";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function PromptBar() {
  const { selectedAvatarId, setWorkspace } = useWorkspaceStore();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptResult | null>(null);

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (trimmed.length < 5) {
      setError("Enter at least 5 characters to generate.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const response = await runPrompt(trimmed, selectedAvatarId);
      setResult(response);
      setWorkspace("projects");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to generate content.";
      setError(message);
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="sticky bottom-0 z-30 border-t border-[color:var(--border)] bg-[color:var(--header)]/95 px-3 py-3 backdrop-blur-xl md:px-6">
      <div className="mx-auto max-w-[1700px] space-y-2">
        <div className="flex items-end gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-[0_16px_38px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text)]"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <textarea
            rows={1}
            className="max-h-40 w-full resize-y bg-transparent px-2 py-2 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
            placeholder="Ask Avatar Studio...\n\nExamples\nCreate a product demo\nClone my avatar\nCreate LinkedIn video\nGenerate onboarding video\nTurn this PDF into video"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text)]"
          aria-label="Voice input"
        >
          <Mic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-medium text-white"
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? "Generating..." : "Generate"}
        </button>
        </div>

        {error && <p className="px-2 text-xs text-rose-500">{error}</p>}

        {result && (
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text)]">
            <p className="font-medium">Prompt executed</p>
            <p className="text-[color:var(--muted)]">
              Project: {result.project.name} | Scene: {result.scene.title} | Video: {result.video.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
