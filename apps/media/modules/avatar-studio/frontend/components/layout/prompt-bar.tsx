"use client";

import { Mic, Paperclip, Sparkles } from "lucide-react";

export function PromptBar() {
  return (
    <div className="sticky bottom-0 z-30 border-t border-[color:var(--border)] bg-[color:var(--header)]/95 px-3 py-3 backdrop-blur-xl md:px-6">
      <div className="mx-auto flex max-w-[1700px] items-end gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-[0_16px_38px_rgba(0,0,0,0.2)]">
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
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-medium text-white"
        >
          <Sparkles className="h-4 w-4" />
          Generate
        </button>
      </div>
    </div>
  );
}
