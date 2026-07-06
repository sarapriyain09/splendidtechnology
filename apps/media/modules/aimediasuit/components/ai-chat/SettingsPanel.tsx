import type { VoiceType } from "@/types/media";
import { voiceList } from "@/types/media";

type Props = {
  open: boolean;
  onToggle: () => void;
  voice: VoiceType;
  speed: number;
  onVoiceChange: (voice: VoiceType) => void;
  onSpeedChange: (speed: number) => void;
};

export function SettingsPanel({ open, onToggle, voice, speed, onVoiceChange, onSpeedChange }: Props) {
  return (
    <aside className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${open ? "block" : "hidden lg:block"}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Generation Settings</h3>
        <button type="button" onClick={onToggle} className="text-xs text-slate-500 hover:text-slate-700">
          {open ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="space-y-3 p-4 text-sm">
        <label className="block text-slate-600">
          Voice
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700"
            value={voice}
            onChange={(event) => onVoiceChange(event.target.value as VoiceType)}
          >
            {voiceList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-slate-600">
          Speed: {speed.toFixed(1)}x
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="mt-1 w-full"
          />
        </label>

        <label className="block text-slate-600">
          Language
          <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700">
            <option>English (US)</option>
          </select>
        </label>

        <label className="block text-slate-600">
          Tone
          <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700">
            <option>Professional</option>
            <option>Friendly</option>
          </select>
        </label>

        <label className="block text-slate-600">
          Output Format
          <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700">
            <option>MP3</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
