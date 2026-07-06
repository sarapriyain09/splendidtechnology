import { useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onAttach?: (files: FileList) => void;
  disabled?: boolean;
};

export function PromptInput({ value, onChange, onSubmit, onAttach, disabled }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask Voice Studio to generate a voice-over..."
          className="min-h-24 w-full resize-none rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 outline-none"
          disabled={disabled}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              Attach
            </button>
            <button type="button" className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-400" disabled>
              Voice
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files && onAttach) {
                  onAttach(event.target.files);
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
