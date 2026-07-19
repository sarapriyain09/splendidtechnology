"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAvatars, runPrompt, type PromptResult } from "@/lib/studio-api";
import { DEFAULT_GLOBAL_VOICE } from "@/lib/voice-defaults";
import { useWorkspaceStore } from "@/stores/workspace-store";

const LANGUAGE_OPTIONS = ["English (UK)", "English (US)", "Spanish", "French", "German"];
const BACKGROUND_OPTIONS = ["Office", "Studio", "Gradient", "Product Shelf", "Green Screen"];
const BRAND_OPTIONS = ["Velynxia Core", "Commerce", "Growth", "Media", "Custom"];
const RESOLUTION_OPTIONS = ["720p", "1080p", "1440p", "4K"];

export function VideoForm() {
  const avatarsQuery = useQuery({
    queryKey: ["studio", "avatars"],
    queryFn: fetchAvatars,
  });
  const { selectedAvatarId, setSelectedAvatarId, setSelectedProjectId } = useWorkspaceStore();
  const [voice] = useState(DEFAULT_GLOBAL_VOICE);
  const [language, setLanguage] = useState("");
  const [background, setBackground] = useState("");
  const [brand, setBrand] = useState("");
  const [resolution, setResolution] = useState("");
  const [script, setScript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [audioTestMessage, setAudioTestMessage] = useState<string | null>(null);

  const avatars = avatarsQuery.data ?? [];

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const timer = setInterval(() => {
      setProgress((value) => {
        if (value >= 90) {
          return value;
        }
        return Math.min(90, value + 10);
      });
    }, 280);

    return () => clearInterval(timer);
  }, [isSubmitting]);

  async function handleGenerate() {
    const trimmed = script.trim();
    if (!selectedAvatarId) {
      setError("Select an avatar before generating.");
      return;
    }
    if (trimmed.length < 5) {
      setError("Write at least 5 characters in script.");
      return;
    }

    const structuredPrompt = [
      `Generate a video using this script: ${trimmed}`,
      language ? `Language: ${language}` : "",
      background ? `Background: ${background}` : "",
      brand ? `Brand: ${brand}` : "",
      resolution ? `Resolution: ${resolution}` : "",
      `Voice preset: ${voice}`,
    ]
      .filter(Boolean)
      .join("\n");

    setIsSubmitting(true);
    setProgress(10);
    setError(null);
    setResult(null);
    try {
      const response = await runPrompt(structuredPrompt, selectedAvatarId);
      setResult(response);
      setSelectedProjectId(response.project.id);
      setProgress(100);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to generate video.";
      setError(message);
      setResult(null);
      setProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAudioTest() {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.value = 0.12;

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.8);

      setAudioTestMessage("Played audio test tone. If you could not hear it, check browser/site/system sound settings.");
      oscillator.onended = () => {
        void audioContext.close();
      };
    } catch {
      setAudioTestMessage("Audio test failed to play. Browser audio output may be blocked.");
    }
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-[color:var(--text)]">Video Creator</h2>
        <p className="text-sm text-[color:var(--muted)]">Build AI avatar videos with script, brand controls, and rendering presets.</p>
      </header>

      <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 md:grid-cols-2">
        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Avatar</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={selectedAvatarId ?? ""}
            onChange={(event) => setSelectedAvatarId(event.target.value || undefined)}
            disabled={avatarsQuery.isLoading || avatars.length === 0}
          >
            <option value="">{avatarsQuery.isLoading ? "Loading avatars..." : "Select avatar"}</option>
            {avatars.map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Voice</span>
          <input
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={voice}
            readOnly
            placeholder="Default voice"
          />
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Language</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="">Select language</option>
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Script</span>
          <textarea
            rows={5}
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            placeholder="Write or paste script..."
            value={script}
            onChange={(event) => setScript(event.target.value)}
          />
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Background</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
          >
            <option value="">Select background</option>
            {BACKGROUND_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Brand</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          >
            <option value="">Select brand</option>
            {BRAND_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-[color:var(--text)]">
          <span className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--muted)]">Resolution</span>
          <select
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 outline-none"
            value={resolution}
            onChange={(event) => setResolution(event.target.value)}
          >
            <option value="">Select resolution</option>
            {RESOLUTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isSubmitting}
        className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Generating..." : "Generate Video"}
      </button>

      <button
        type="button"
        onClick={handleAudioTest}
        className="ml-2 rounded-xl border border-[color:var(--border)] px-4 py-2 text-sm font-medium text-[color:var(--text)]"
      >
        Play Audio Test
      </button>

      {audioTestMessage && <p className="text-xs text-[color:var(--muted)]">{audioTestMessage}</p>}

      {(isSubmitting || progress > 0) && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
            <span>{isSubmitting ? "Rendering progress" : "Request submitted"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-soft)]">
            <div
              className="h-full bg-[color:var(--accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3 text-sm text-[color:var(--text)]">
          <p className="font-medium">Video request submitted</p>
          <p className="mt-1 text-[color:var(--muted)]">
            Project: {result.project.name} | Scene: {result.scene.title} | Video: {result.video.status}
          </p>
          {result.video.videoUrl ? (
            <div className="space-y-2">
              <video
                className="w-full rounded-lg border border-[color:var(--border)] bg-black"
                controls
                src={result.video.videoUrl}
              />
              <a
                href={result.video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg border border-[color:var(--border)] px-3 py-2 text-xs font-medium text-[color:var(--text)]"
              >
                Open video in new tab
              </a>
            </div>
          ) : (
            <p className="text-xs text-[color:var(--muted)]">
              Video is still processing. No playable URL is available yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
