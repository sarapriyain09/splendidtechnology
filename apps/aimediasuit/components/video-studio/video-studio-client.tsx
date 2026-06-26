"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import type {
  VideoAspectRatio,
  VideoHistoryItem,
  VideoMusicTrack,
  VideoSceneItem,
  VideoStatistics,
  VideoStyle,
  VoiceType,
} from "@/types/media";

type StudioTab = "create" | "my-videos" | "templates" | "history";
type HistoryFilter = "all" | "favorites";

type GenerateVideoResponse = {
  id: string;
  title: string;
  outputText: string;
  sceneCount: number;
  includeVoiceover: boolean;
  outputUrl: string | null;
  isFavorite: boolean;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  generatedAt: string;
  meta: {
    topic: string;
    audience: string;
    style: VideoStyle;
    aspectRatio: VideoAspectRatio;
    durationSec: number;
  };
};

type RenderVideoResponse = {
  outputUrl: string;
  sceneCount: number;
  totalDurationSec: number;
};

type SceneVoicePreviewResponse = {
  id: string;
  outputUrl: string | null;
};

type AssetSearchResponse = {
  items: Array<{
    id: string;
    previewUrl: string;
    sourceUrl: string;
    author: string;
    provider: "pexels" | "pixabay";
  }>;
};

type AssetGenerateResponse = {
  id: string;
  imageUrl: string;
  provider: "gemini";
};

type Template = {
  id: string;
  title: string;
  topic: string;
  audience: string;
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
  prompt: string;
};

const templates: Template[] = [
  {
    id: "saas-launch",
    title: "SaaS Launch Teaser",
    topic: "New AI automation release",
    audience: "founders and growth teams",
    style: "cinematic",
    aspectRatio: "16:9",
    durationSec: 60,
    prompt: "Build a bold launch teaser with hook, problem, solution, and strong CTA.",
  },
  {
    id: "social-reel",
    title: "Social Reel Promo",
    topic: "Campaign performance highlights",
    audience: "social media audience",
    style: "social",
    aspectRatio: "9:16",
    durationSec: 30,
    prompt: "Create a high-energy reel with short scenes and punchy captions.",
  },
  {
    id: "product-explainer",
    title: "Product Explainer",
    topic: "Workflow onboarding",
    audience: "new product users",
    style: "explainer",
    aspectRatio: "16:9",
    durationSec: 90,
    prompt: "Explain setup flow in a clear sequence with practical visuals and voiceover.",
  },
];

async function fetchJson<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({ error: "Request failed" }))) as { error?: string };
    throw new Error(err.error ?? "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function parseScenesFromPlan(outputText: string): VideoSceneItem[] {
  const lines = outputText.split(/\r?\n/);
  const scenes: VideoSceneItem[] = [];
  let current: VideoSceneItem | null = null;

  for (const line of lines) {
    const raw = line.trim();
    const sceneHeader = raw.match(/^Scene\s+(\d+)\s*:/i);
    if (sceneHeader) {
      if (current) {
        scenes.push(current);
      }
      current = {
        sceneNumber: Number(sceneHeader[1]),
        duration: 6,
        caption: "",
        voiceover: "",
        image: "",
        transition: "cut",
      };
      continue;
    }

    if (!current) {
      continue;
    }

    if (raw.toLowerCase().startsWith("- caption:")) {
      current.caption = raw.replace(/^-\s*caption\s*:/i, "").trim();
      continue;
    }

    if (raw.toLowerCase().startsWith("- voiceover:")) {
      current.voiceover = raw.replace(/^-\s*voiceover\s*:/i, "").trim();
      continue;
    }
  }

  if (current) {
    scenes.push(current);
  }

  if (scenes.length === 0) {
    return [
      {
        sceneNumber: 1,
        duration: 6,
        caption: "",
        voiceover: "",
        image: "",
        transition: "cut",
      },
    ];
  }

  return scenes;
}

function getScenePreviewSrc(image: string): string | null {
  const value = image.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith("data:image/")) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return null;
}

export function VideoStudioClient() {
  const [activeTab, setActiveTab] = useState<StudioTab>("create");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState<VideoStyle>("cinematic");
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>("16:9");
  const [durationSec, setDurationSec] = useState(60);
  const [prompt, setPrompt] = useState("");
  const [includeVoiceover, setIncludeVoiceover] = useState(true);

  const [scenes, setScenes] = useState<VideoSceneItem[]>([
    {
      sceneNumber: 1,
      duration: 6,
      caption: "",
      voiceover: "",
      image: "",
      transition: "cut",
    },
  ]);
  const [activeSceneTab, setActiveSceneTab] = useState<number | "build">(1);
  const [musicTrack, setMusicTrack] = useState<VideoMusicTrack>("none");
  const [musicVolume, setMusicVolume] = useState(35);
  const [voiceVolume, setVoiceVolume] = useState(100);
  const [quality, setQuality] = useState<"1080p" | "720p">("720p");
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [voice, setVoice] = useState<VoiceType>("alloy");
  const [speed, setSpeed] = useState(1);
  const [speechLeadInSec, setSpeechLeadInSec] = useState(0.35);
  const [speechTailSec, setSpeechTailSec] = useState(0.7);
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [assetLoadingScene, setAssetLoadingScene] = useState<number | null>(null);
  const [voicePreviewLoadingScene, setVoicePreviewLoadingScene] = useState<number | null>(null);
  const [sceneVoicePreview, setSceneVoicePreview] = useState<Record<number, string>>({});
  const [sceneVideoPreviewLoadingScene, setSceneVideoPreviewLoadingScene] = useState<number | null>(null);
  const [sceneVideoPreview, setSceneVideoPreview] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateVideoResponse | null>(null);
  const [editablePlan, setEditablePlan] = useState("");
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [stats, setStats] = useState<VideoStatistics>({
    totalVideosGenerated: 0,
    mostUsedStyle: "N/A",
    recentVideos: 0,
  });

  const refreshAll = async () => {
    const [newHistory, newStats] = await Promise.all([
      fetchJson<VideoHistoryItem[]>("/api/media/video/history"),
      fetchJson<VideoStatistics>("/api/media/video/statistics"),
    ]);

    setHistory(newHistory);
    setStats(newStats);
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  useEffect(() => {
    if (activeSceneTab === "build") {
      return;
    }

    const exists = scenes.some((scene) => scene.sceneNumber === activeSceneTab);
    if (!exists) {
      setActiveSceneTab(scenes[0]?.sceneNumber ?? "build");
    }
  }, [scenes, activeSceneTab]);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return templates;
    }

    return templates.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const filteredHistory = useMemo(() => {
    const base = historyFilter === "favorites" ? history.filter((item) => item.isFavorite) : history;
    const q = search.trim().toLowerCase();
    if (!q) {
      return base;
    }

    return base.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.outputText.toLowerCase().includes(q)
      );
    });
  }, [history, historyFilter, search]);

  const styleDistribution = useMemo(() => {
    const counts = new Map<VideoStyle, number>();
    history.forEach((item) => counts.set(item.style, (counts.get(item.style) ?? 0) + 1));

    return (["cinematic", "social", "explainer", "product"] as VideoStyle[])
      .map((name) => ({ name, count: counts.get(name) ?? 0 }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [history]);

  const applyTemplate = (template: Template) => {
    setTitle(template.title);
    setTopic(template.topic);
    setAudience(template.audience);
    setStyle(template.style);
    setAspectRatio(template.aspectRatio);
    setDurationSec(template.durationSec);
    setPrompt(template.prompt);
    setScenes([
      {
        sceneNumber: 1,
        duration: 6,
        caption: template.topic,
        voiceover: template.prompt,
        image: "",
        transition: "cut",
      },
    ]);
    setActiveTab("create");
    toast.success("Template loaded.");
  };

  const removeVideo = async (id: string) => {
    try {
      await fetchJson<null>(`/api/media/video/${id}`, { method: "DELETE" });
      await refreshAll();
      toast.success("Video plan deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const duplicateVideo = async (id: string) => {
    try {
      await fetchJson<{ id: string }>(`/api/media/video/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "duplicate" }),
      });
      await refreshAll();
      toast.success("Video plan duplicated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Duplicate failed.");
    }
  };

  const toggleFavorite = async (item: VideoHistoryItem) => {
    try {
      await fetchJson<{ id: string; isFavorite: boolean }>(`/api/media/video/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: !item.isFavorite }),
      });
      await refreshAll();
      toast.success(item.isFavorite ? "Removed from favorites." : "Marked as favorite.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const loadFromHistory = (item: VideoHistoryItem) => {
    setTitle(item.title);
    setTopic(item.topic);
    setAudience(item.audience);
    setStyle(item.style);
    setAspectRatio(item.aspectRatio);
    setDurationSec(item.durationSec);
    setPrompt(item.prompt);
    setIncludeVoiceover(item.includeVoiceover);
    setEditablePlan(item.outputText);
    setScenes(parseScenesFromPlan(item.outputText));
    setRenderedUrl(item.outputUrl);
    setResult({
      id: item.id,
      title: item.title,
      outputText: item.outputText,
      sceneCount: item.sceneCount,
      includeVoiceover: item.includeVoiceover,
      outputUrl: item.outputUrl,
      isFavorite: item.isFavorite,
      status: item.status,
      createdAt: item.createdAt,
      generatedAt: item.createdAt,
      meta: {
        topic: item.topic,
        audience: item.audience,
        style: item.style,
        aspectRatio: item.aspectRatio,
        durationSec: item.durationSec,
      },
    });
    setActiveTab("create");
    toast.success("Loaded from history.");
  };

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a video topic.");
      return;
    }

    if (!audience.trim()) {
      toast.error("Enter a target audience.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Enter your prompt.");
      return;
    }

    setLoading(true);
    try {
      const generated = await fetchJson<GenerateVideoResponse>("/api/media/video/generate", {
        method: "POST",
        body: JSON.stringify({
          title,
          topic,
          audience,
          style,
          aspectRatio,
          durationSec,
          prompt,
          includeVoiceover,
        }),
      });

      setResult(generated);
      setEditablePlan(generated.outputText);
      setScenes(parseScenesFromPlan(generated.outputText));
      setRenderedUrl(generated.outputUrl);
      toast.success("Video plan generated successfully.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate video plan.");
    } finally {
      setLoading(false);
    }
  };

  const updateScene = (sceneNumber: number, patch: Partial<VideoSceneItem>) => {
    setScenes((prev) => prev.map((scene) => (scene.sceneNumber === sceneNumber ? { ...scene, ...patch } : scene)));
  };

  const addScene = () => {
    setScenes((prev) => {
      const nextSceneNumber = prev.length + 1;
      setActiveSceneTab(nextSceneNumber);
      return [
        ...prev,
        {
          sceneNumber: nextSceneNumber,
          duration: 6,
          caption: "",
          voiceover: "",
          image: "",
          transition: "cut",
        },
      ];
    });
  };

  const removeScene = (sceneNumber: number) => {
    setScenes((prev) => {
      const filtered = prev.filter((scene) => scene.sceneNumber !== sceneNumber);
      return filtered.map((scene, index) => ({ ...scene, sceneNumber: index + 1 }));
    });
  };

  const renderVideo = async () => {
    if (scenes.length === 0) {
      toast.error("Add at least one scene.");
      return;
    }

    const isHeavyRender = scenes.length >= 8;
    const effectiveQuality = isHeavyRender && quality === "1080p" ? "720p" : quality;
    const effectiveIncludeSubtitles = isHeavyRender && includeSubtitles ? false : includeSubtitles;

    if (effectiveQuality !== quality || effectiveIncludeSubtitles !== includeSubtitles) {
      toast("Applied reliability mode for heavy build: 720p and subtitles off.");
    }

    setRenderLoading(true);
    try {
      const response = await fetchJson<RenderVideoResponse>("/api/media/video/render", {
        method: "POST",
        body: JSON.stringify({
          videoId: result?.id,
          scenes,
          aspectRatio,
          quality: effectiveQuality,
          includeSubtitles: effectiveIncludeSubtitles,
          voice,
          speed,
          speechLeadInSec,
          speechTailSec,
          musicTrack,
          voiceVolume,
          musicVolume,
        }),
      });

      setRenderedUrl(response.outputUrl);
      toast.success("Video rendered successfully.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video rendering failed.");
    } finally {
      setRenderLoading(false);
    }
  };

  const autoFillSceneImage = async (scene: VideoSceneItem) => {
    const query = scene.caption.trim() || topic.trim() || "business technology";
    const orientation = aspectRatio === "9:16" ? "portrait" : aspectRatio === "1:1" ? "square" : "landscape";

    setAssetLoadingScene(scene.sceneNumber);
    try {
      const response = await fetchJson<AssetSearchResponse>("/api/media/video/assets/search", {
        method: "POST",
        body: JSON.stringify({
          query,
          orientation,
          perPage: 4,
        }),
      });

      if (!response.items.length) {
        toast.error("No stock assets found. Add image URL manually.");
        return;
      }

      updateScene(scene.sceneNumber, { image: response.items[0].sourceUrl });
      toast.success(`Scene ${scene.sceneNumber} image set from ${response.items[0].provider}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Asset search failed.");
    } finally {
      setAssetLoadingScene(null);
    }
  };

  const generateSceneImage = async (scene: VideoSceneItem) => {
    const promptText = scene.caption.trim() || scene.voiceover.trim() || topic.trim() || "business marketing visual";
    const orientation = aspectRatio === "9:16" ? "portrait" : aspectRatio === "1:1" ? "square" : "landscape";

    setAssetLoadingScene(scene.sceneNumber);
    try {
      const response = await fetchJson<AssetGenerateResponse>("/api/media/video/assets/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: promptText,
          orientation,
        }),
      });

      updateScene(scene.sceneNumber, { image: response.imageUrl });
      toast.success(`Scene ${scene.sceneNumber} generated with ${response.provider}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image generation failed.");
    } finally {
      setAssetLoadingScene(null);
    }
  };

  const previewSceneVoice = async (scene: VideoSceneItem) => {
    const inputText = (scene.voiceover || scene.caption || topic).trim();
    if (!inputText) {
      toast.error("Add scene voiceover or caption first.");
      return;
    }

    setVoicePreviewLoadingScene(scene.sceneNumber);
    try {
      const response = await fetchJson<SceneVoicePreviewResponse>("/api/media/voice/generate", {
        method: "POST",
        body: JSON.stringify({
          title: `Scene ${scene.sceneNumber} Preview`,
          inputText,
          voice,
          speed,
        }),
      });

      if (!response.outputUrl) {
        throw new Error("Voice preview did not return audio.");
      }

      setSceneVoicePreview((prev) => ({ ...prev, [scene.sceneNumber]: response.outputUrl as string }));
      toast.success(`Scene ${scene.sceneNumber} voice preview ready.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Voice preview failed.");
    } finally {
      setVoicePreviewLoadingScene(null);
    }
  };

  const previewSceneVideo = async (scene: VideoSceneItem) => {
    setSceneVideoPreviewLoadingScene(scene.sceneNumber);
    try {
      const response = await fetchJson<RenderVideoResponse>("/api/media/video/render", {
        method: "POST",
        body: JSON.stringify({
          scenes: [
            {
              sceneNumber: 1,
              duration: scene.duration,
              caption: scene.caption,
              voiceover: scene.voiceover,
              image: scene.image,
              transition: "cut",
            },
          ],
          aspectRatio,
          quality,
          includeSubtitles,
          voice,
          speed,
          speechLeadInSec,
          speechTailSec,
          musicTrack,
          voiceVolume,
          musicVolume,
        }),
      });

      setSceneVideoPreview((prev) => ({ ...prev, [scene.sceneNumber]: response.outputUrl }));
      toast.success(`Scene ${scene.sceneNumber} preview is ready.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scene preview failed.");
    } finally {
      setSceneVideoPreviewLoadingScene(null);
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <section className="panel animate-float-in overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xl">▶</div>
            <div>
              <h1 className="display-font text-3xl font-semibold text-white">Video Studio</h1>
              <p className="text-sm text-amber-100/70">Generate production-ready video storyboards and scene plans</p>
            </div>
          </div>
          <button
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            onClick={() => {
              if (!editablePlan.trim()) {
                toast.error("No video plan to download.");
                return;
              }
              const blob = new Blob([editablePlan], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${(title || "video-plan").replace(/\s+/g, "-").toLowerCase()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download Plan
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-3 text-sm">
          {[
            { key: "create", label: "Create" },
            { key: "my-videos", label: "My Videos" },
            { key: "templates", label: "Templates" },
            { key: "history", label: "History" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as StudioTab)}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeTab === tab.key ? "bg-amber-500/20 text-amber-200" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-1.5 text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {activeTab === "create" && (
          <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-semibold">Generate Video Plan</h2>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title (optional)"
                className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
              />
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Video topic"
                className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
              />
              <input
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="Target audience"
                className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
              />

              <div className="grid gap-2 sm:grid-cols-3">
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value as VideoStyle)}
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                >
                  <option value="cinematic">Cinematic</option>
                  <option value="social">Social</option>
                  <option value="explainer">Explainer</option>
                  <option value="product">Product</option>
                </select>
                <select
                  value={aspectRatio}
                  onChange={(event) => setAspectRatio(event.target.value as VideoAspectRatio)}
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                </select>
                <input
                  type="number"
                  min={15}
                  max={300}
                  step={5}
                  value={durationSec}
                  onChange={(event) => setDurationSec(Number(event.target.value))}
                  className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                />
              </div>

              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={9}
                placeholder="Describe pacing, visuals, tone, CTA, and key message"
                className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
              />

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={includeVoiceover}
                  onChange={(event) => setIncludeVoiceover(event.target.checked)}
                />
                Include voiceover lines
              </label>

              <button
                onClick={() => void generate()}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Video Plan"}
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Output</h2>
                {result ? <span className="text-xs text-amber-200">{result.sceneCount} scenes</span> : null}
              </div>
              <textarea
                value={editablePlan}
                onChange={(event) => setEditablePlan(event.target.value)}
                rows={20}
                placeholder="Generated video plan appears here"
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={async () => {
                  if (!editablePlan.trim()) {
                    toast.error("Nothing to copy.");
                    return;
                  }
                  await navigator.clipboard.writeText(editablePlan);
                  toast.success("Copied to clipboard.");
                }}
                className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
              >
                Copy Output
              </button>

              {renderedUrl ? (
                <div className="space-y-2 rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-100">Rendered MP4 is ready.</p>
                  <video controls className="w-full rounded-lg" src={renderedUrl} />
                  <a className="block rounded-lg border border-emerald-300/30 px-3 py-2 text-center text-sm text-emerald-100 hover:bg-emerald-500/20" href={renderedUrl} target="_blank" rel="noreferrer">
                    Open / Download MP4
                  </a>
                </div>
              ) : null}
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Scene Timeline</h2>
                <button onClick={addScene} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">Add Scene</button>
              </div>

              <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-2">
                {scenes.map((scene) => (
                  <button
                    key={scene.sceneNumber}
                    onClick={() => setActiveSceneTab(scene.sceneNumber)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition ${
                      activeSceneTab === scene.sceneNumber
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Scene {scene.sceneNumber}
                  </button>
                ))}
                <button
                  onClick={() => setActiveSceneTab("build")}
                  className={`ml-auto rounded-lg px-3 py-1.5 text-xs transition ${
                    activeSceneTab === "build" ? "bg-emerald-500/20 text-emerald-100" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Final Build
                </button>
              </div>

              {activeSceneTab !== "build" ? (() => {
                const scene = scenes.find((item) => item.sceneNumber === activeSceneTab) ?? scenes[0];
                if (!scene) {
                  return null;
                }

                const scenePreviewSrc = getScenePreviewSrc(scene.image);

                return (
                  <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold">Scene {scene.sceneNumber}</p>
                      <button
                        onClick={() => removeScene(scene.sceneNumber)}
                        className="rounded border border-rose-300/30 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/10"
                        disabled={scenes.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-4">
                      <input
                        value={scene.caption}
                        onChange={(event) => updateScene(scene.sceneNumber, { caption: event.target.value })}
                        placeholder="Caption"
                        className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                      />
                      <input
                        value={scene.image}
                        onChange={(event) => updateScene(scene.sceneNumber, { image: event.target.value })}
                        placeholder="Image URL or local path"
                        className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                      />
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={scene.duration}
                        onChange={(event) => updateScene(scene.sceneNumber, { duration: Number(event.target.value) || 6 })}
                        placeholder="Duration"
                        className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                      />
                      <select
                        value={scene.transition}
                        onChange={(event) => updateScene(scene.sceneNumber, { transition: event.target.value as VideoSceneItem["transition"] })}
                        className="rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                      >
                        <option value="cut">Transition: Cut</option>
                        <option value="fade">Transition: Fade</option>
                        <option value="crossfade">Transition: Crossfade</option>
                        <option value="slideleft">Transition: Slide Left</option>
                        <option value="slideright">Transition: Slide Right</option>
                        <option value="zoomin">Transition: Zoom In</option>
                        <option value="zoomout">Transition: Zoom Out</option>
                        <option value="flash">Transition: Flash</option>
                      </select>
                    </div>

                    <textarea
                      value={scene.voiceover}
                      onChange={(event) => updateScene(scene.sceneNumber, { voiceover: event.target.value })}
                      rows={2}
                      placeholder="Voiceover"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm outline-none"
                    />

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => void previewSceneVideo(scene)}
                        disabled={sceneVideoPreviewLoadingScene === scene.sceneNumber}
                        className="rounded border border-amber-300/30 px-2 py-1 text-xs text-amber-100 hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        {sceneVideoPreviewLoadingScene === scene.sceneNumber ? "Rendering Preview..." : "Preview Scene (Slide+Voice+Music)"}
                      </button>
                      <button
                        onClick={() => void previewSceneVoice(scene)}
                        disabled={voicePreviewLoadingScene === scene.sceneNumber}
                        className="rounded border border-emerald-300/30 px-2 py-1 text-xs text-emerald-100 hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        {voicePreviewLoadingScene === scene.sceneNumber ? "Creating Voice..." : "Preview Voice"}
                      </button>
                      <button
                        onClick={() => void generateSceneImage(scene)}
                        disabled={assetLoadingScene === scene.sceneNumber}
                        className="rounded border border-violet-300/30 px-2 py-1 text-xs text-violet-100 hover:bg-violet-500/10 disabled:opacity-50"
                      >
                        {assetLoadingScene === scene.sceneNumber ? "Generating..." : "Generate Image (Gemini)"}
                      </button>
                      <button
                        onClick={() => void autoFillSceneImage(scene)}
                        disabled={assetLoadingScene === scene.sceneNumber}
                        className="rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10 disabled:opacity-50"
                      >
                        {assetLoadingScene === scene.sceneNumber ? "Searching..." : "Auto Image (Pexels/Pixabay)"}
                      </button>
                      {scene.image ? <span className="truncate text-xs text-slate-400">{scene.image}</span> : null}
                    </div>

                    {scenePreviewSrc ? (
                      <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">Image Preview</p>
                        <img
                          src={scenePreviewSrc}
                          alt={`Scene ${scene.sceneNumber} preview`}
                          className="max-h-44 w-full rounded-md object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : scene.image ? (
                      <p className="mt-2 text-xs text-amber-200/80">
                        Preview unavailable for this value. Use a full URL, /media path, or data:image payload.
                      </p>
                    ) : null}

                    {sceneVoicePreview[scene.sceneNumber] ? (
                      <div className="mt-2 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-emerald-100/80">Voice Preview</p>
                        <audio controls className="w-full" src={sceneVoicePreview[scene.sceneNumber]} />
                      </div>
                    ) : null}

                    {sceneVideoPreview[scene.sceneNumber] ? (
                      <div className="mt-2 rounded-lg border border-amber-300/20 bg-amber-500/10 p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-amber-100/80">Scene Preview (Slide + Voice + Music)</p>
                        <video controls className="w-full rounded-md" src={sceneVideoPreview[scene.sceneNumber]} />
                      </div>
                    ) : null}
                  </div>
                );
              })() : null}

              {activeSceneTab === "build" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-sm font-semibold">Background Music</p>
                  <div className="mt-2 space-y-2 text-sm text-slate-200">
                    {(["none", "corporate", "ambient", "motivational", "upbeat"] as VideoMusicTrack[]).map((track) => (
                      <label key={track} className="flex items-center gap-2">
                        <input type="radio" checked={musicTrack === track} onChange={() => setMusicTrack(track)} />
                        <span className="capitalize">{track}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-sm font-semibold">Audio Mix</p>
                  <label className="mt-2 block text-xs text-slate-400">Voice volume ({voiceVolume}%)</label>
                  <input type="range" min={0} max={100} value={voiceVolume} onChange={(event) => setVoiceVolume(Number(event.target.value))} className="w-full" />
                  <label className="mt-2 block text-xs text-slate-400">Music volume ({musicVolume}%)</label>
                  <input type="range" min={0} max={100} value={musicVolume} onChange={(event) => setMusicVolume(Number(event.target.value))} className="w-full" />
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-sm font-semibold">Export</p>
                  <div className="mt-2 grid gap-2 text-sm">
                    <select value={quality} onChange={(event) => setQuality(event.target.value as "1080p" | "720p")} className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5">
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                    </select>
                    <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as VideoAspectRatio)} className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5">
                      <option value="16:9">Landscape (16:9)</option>
                      <option value="9:16">Portrait (9:16)</option>
                      <option value="1:1">Square (1:1)</option>
                    </select>
                    <select value={voice} onChange={(event) => setVoice(event.target.value as VoiceType)} className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5">
                      <option value="alloy">alloy</option>
                      <option value="ash">ash</option>
                      <option value="ballad">ballad</option>
                      <option value="coral">coral</option>
                      <option value="echo">echo</option>
                      <option value="sage">sage</option>
                      <option value="shimmer">shimmer</option>
                    </select>
                    <input type="number" min={0.5} max={2} step={0.1} value={speed} onChange={(event) => setSpeed(Number(event.target.value) || 1)} className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5" />
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={speechLeadInSec}
                      onChange={(event) => setSpeechLeadInSec(Math.max(0, Number(event.target.value) || 0))}
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                      title="Speech start delay (seconds)"
                    />
                    <input
                      type="number"
                      min={0}
                      max={8}
                      step={0.1}
                      value={speechTailSec}
                      onChange={(event) => setSpeechTailSec(Math.max(0, Number(event.target.value) || 0))}
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                      title="Slide hold after speech (seconds)"
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={includeSubtitles} onChange={(event) => setIncludeSubtitles(event.target.checked)} /> Burn subtitles</label>
                    <p className="text-[11px] text-slate-400">Timing: voice starts after lead-in, and slide remains after speech tail for smoother transitions.</p>
                  </div>
                </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                    <p className="text-sm font-semibold">Generated Image Provider</p>
                    <p className="mt-1 text-xs text-amber-200/80">Gemini is enabled for generated scene images.</p>
                  </div>

                  <button
                    onClick={() => void renderVideo()}
                    disabled={renderLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
                  >
                    {renderLoading ? "Rendering Video..." : "Generate Video"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === "my-videos" && (
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Total Videos</p>
              <p className="mt-2 text-3xl font-semibold">{stats.totalVideosGenerated}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Most Used Style</p>
              <p className="mt-2 text-3xl font-semibold capitalize">{stats.mostUsedStyle}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Recent (7d)</p>
              <p className="mt-2 text-3xl font-semibold">{stats.recentVideos}</p>
            </div>

            <div className="sm:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">Style Breakdown</h3>
              {styleDistribution.length === 0 ? (
                <p className="text-sm text-slate-400">No video plans generated yet.</p>
              ) : (
                <div className="space-y-2">
                  {styleDistribution.map((row) => (
                    <div key={row.name} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-300">{row.name}</span>
                      <span className="font-semibold text-white">{row.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid gap-3 px-5 pb-5 md:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-amber-200/80">{template.style} • {template.aspectRatio}</p>
                <h3 className="mt-1 text-lg font-semibold">{template.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{template.topic}</p>
                <button
                  onClick={() => applyTemplate(template)}
                  className="mt-4 w-full rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3 px-5 pb-5">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setHistoryFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  historyFilter === "all" ? "bg-amber-500/20 text-amber-200" : "text-slate-300 hover:bg-white/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHistoryFilter("favorites")}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  historyFilter === "favorites"
                    ? "bg-amber-500/20 text-amber-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                Favorites
              </button>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">No records found.</div>
            ) : (
              filteredHistory.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-xs text-slate-400">
                        {format(new Date(item.createdAt), "PP p")} • {item.style} • {item.sceneCount} scenes • {item.aspectRatio}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => void toggleFavorite(item)}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                      >
                        {item.isFavorite ? "Unfavorite" : "Favorite"}
                      </button>
                      <button
                        onClick={() => void duplicateVideo(item.id)}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => void removeVideo(item.id)}
                        className="rounded-lg border border-rose-300/20 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200">
                    {item.outputText}
                  </pre>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
