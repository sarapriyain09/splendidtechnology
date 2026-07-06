"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import type {
  VideoGenerateResponse,
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

type AssetImportResponse = {
  imageUrl: string;
  sourceUrl: string;
};

type MusicUploadResponse = {
  audioUrl: string;
  size: number;
  fileName: string;
};

type AssetUploadResponse = {
  imageUrl: string;
  size: number;
  mimeType: string;
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

const VIDEO_STUDIO_DRAFT_KEY = "aimedia-video-studio-draft-v1";
const VIDEO_STUDIO_SCENE_SNAPSHOT_KEY = "aimedia-video-scene-snapshot-v1";

type VideoStudioDraft = {
  title: string;
  topic: string;
  audience: string;
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
  prompt: string;
  includeVoiceover: boolean;
  scenes: VideoSceneItem[];
  editablePlan: string;
  musicTrack: VideoMusicTrack;
  uploadedMusicUrl: string;
  uploadedMusicName: string;
  musicVolume: number;
  voiceVolume: number;
  quality: "1080p" | "720p";
  includeSubtitles: boolean;
  voice: VoiceType;
  speed: number;
  speechLeadInSec: number;
  speechTailSec: number;
  includeThumbnailSlide: boolean;
  thumbnailTitle: string;
  thumbnailSubtitle: string;
  thumbnailDuration: number;
  includeThankYouSlide: boolean;
  thankYouTitle: string;
  thankYouNote: string;
  thankYouDuration: number;
  brandLogoDataUrl: string;
  brandLogoName: string;
};

type SceneSnapshotMap = Record<string, VideoSceneItem[]>;

function sanitizeSceneSnapshot(input: unknown): VideoSceneItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((scene, index) => {
      const item = scene as Partial<VideoSceneItem>;
      return {
        sceneNumber: index + 1,
        duration: typeof item.duration === "number" ? Math.max(1, Math.min(60, Math.floor(item.duration))) : 6,
        caption: typeof item.caption === "string" ? item.caption : "",
        voiceover: typeof item.voiceover === "string" ? item.voiceover : "",
        image: typeof item.image === "string" ? item.image : "",
        transition: item.transition ?? "cut",
        voiceVolume: typeof item.voiceVolume === "number" ? Math.max(0, Math.min(200, item.voiceVolume)) : 100,
        musicVolume: typeof item.musicVolume === "number" ? Math.max(0, Math.min(200, item.musicVolume)) : 100,
      };
    })
    .filter((scene) => Number.isFinite(scene.duration));
}

function readSceneSnapshotMap(): SceneSnapshotMap {
  try {
    const raw = window.localStorage.getItem(VIDEO_STUDIO_SCENE_SNAPSHOT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const map: SceneSnapshotMap = {};
    Object.entries(parsed).forEach(([key, value]) => {
      map[key] = sanitizeSceneSnapshot(value);
    });
    return map;
  } catch {
    return {};
  }
}

function writeSceneSnapshot(videoId: string, scenes: VideoSceneItem[]) {
  try {
    const current = readSceneSnapshotMap();
    current[videoId] = sanitizeSceneSnapshot(scenes);
    window.localStorage.setItem(VIDEO_STUDIO_SCENE_SNAPSHOT_KEY, JSON.stringify(current));
  } catch {
    // Ignore local storage failures.
  }
}

function readSceneSnapshot(videoId: string): VideoSceneItem[] {
  const current = readSceneSnapshotMap();
  return sanitizeSceneSnapshot(current[videoId]);
}

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
    const normalized = raw
      .replace(/^[-*#>\s]+/, "")
      .replace(/^\*\*(.+)\*\*$/, "$1")
      .replace(/^__(.+)__$/, "$1");
    const sceneHeader = normalized.match(/^Scene\s*(\d+)\b\s*[:\-.]?/i);
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
        voiceVolume: 100,
        musicVolume: 100,
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
        voiceVolume: 100,
        musicVolume: 100,
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
      voiceVolume: 100,
      musicVolume: 100,
    },
  ]);
  const [activeSceneTab, setActiveSceneTab] = useState<number | "thumbnail" | "thankyou" | "build">(1);
  const [musicTrack, setMusicTrack] = useState<VideoMusicTrack>("corporate");
  const [uploadedMusicUrl, setUploadedMusicUrl] = useState("");
  const [uploadedMusicName, setUploadedMusicName] = useState("");
  const [musicUploadLoading, setMusicUploadLoading] = useState(false);
  const [musicVolume, setMusicVolume] = useState(55);
  const [voiceVolume, setVoiceVolume] = useState(100);
  const [quality, setQuality] = useState<"1080p" | "720p">("720p");
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [voice, setVoice] = useState<VoiceType>("alloy");
  const [speed, setSpeed] = useState(1);
  const [speechLeadInSec, setSpeechLeadInSec] = useState(0.35);
  const [speechTailSec, setSpeechTailSec] = useState(0.7);
  const [includeThumbnailSlide, setIncludeThumbnailSlide] = useState(true);
  const [thumbnailTitle, setThumbnailTitle] = useState("Your Video Title");
  const [thumbnailSubtitle, setThumbnailSubtitle] = useState("Presented by Velynxia");
  const [thumbnailDuration, setThumbnailDuration] = useState(4);
  const [includeThankYouSlide, setIncludeThankYouSlide] = useState(true);
  const [thankYouTitle, setThankYouTitle] = useState("Thank You");
  const [thankYouNote, setThankYouNote] = useState("Thank you for watching");
  const [thankYouDuration, setThankYouDuration] = useState(4);
  const [brandLogoDataUrl, setBrandLogoDataUrl] = useState("");
  const [brandLogoName, setBrandLogoName] = useState("");
  const [brandLogoLoading, setBrandLogoLoading] = useState(false);
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [assetLoadingScene, setAssetLoadingScene] = useState<number | null>(null);
  const [assetUploadLoadingScene, setAssetUploadLoadingScene] = useState<number | null>(null);
  const [voicePreviewLoadingScene, setVoicePreviewLoadingScene] = useState<number | null>(null);
  const [sceneVoicePreview, setSceneVoicePreview] = useState<Record<number, string>>({});
  const [sceneVideoPreviewLoadingScene, setSceneVideoPreviewLoadingScene] = useState<number | null>(null);
  const [sceneVideoPreview, setSceneVideoPreview] = useState<Record<number, string>>({});
  const [brandScenePreviewLoading, setBrandScenePreviewLoading] = useState<"thumbnail" | "thankyou" | null>(null);
  const [thumbnailScenePreviewUrl, setThumbnailScenePreviewUrl] = useState<string | null>(null);
  const [thankYouScenePreviewUrl, setThankYouScenePreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoGenerateResponse | null>(null);
  const [editablePlan, setEditablePlan] = useState("");
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [stats, setStats] = useState<VideoStatistics>({
    totalVideosGenerated: 0,
    mostUsedStyle: "N/A",
    recentVideos: 0,
  });

  const [isDraftHydrated, setIsDraftHydrated] = useState(false);

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
    try {
      const raw = window.localStorage.getItem(VIDEO_STUDIO_DRAFT_KEY);
      if (!raw) {
        setIsDraftHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<VideoStudioDraft>;

      if (typeof parsed.title === "string") setTitle(parsed.title);
      if (typeof parsed.topic === "string") setTopic(parsed.topic);
      if (typeof parsed.audience === "string") setAudience(parsed.audience);
      if (parsed.style) setStyle(parsed.style);
      if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
      if (typeof parsed.durationSec === "number") setDurationSec(parsed.durationSec);
      if (typeof parsed.prompt === "string") setPrompt(parsed.prompt);
      if (typeof parsed.includeVoiceover === "boolean") setIncludeVoiceover(parsed.includeVoiceover);
      if (typeof parsed.editablePlan === "string") setEditablePlan(parsed.editablePlan);
      if (parsed.musicTrack) setMusicTrack(parsed.musicTrack);
      if (typeof parsed.uploadedMusicUrl === "string") setUploadedMusicUrl(parsed.uploadedMusicUrl);
      if (typeof parsed.uploadedMusicName === "string") setUploadedMusicName(parsed.uploadedMusicName);
      if (typeof parsed.musicVolume === "number") setMusicVolume(parsed.musicVolume);
      if (typeof parsed.voiceVolume === "number") setVoiceVolume(parsed.voiceVolume);
      if (parsed.quality) setQuality(parsed.quality);
      if (typeof parsed.includeSubtitles === "boolean") setIncludeSubtitles(parsed.includeSubtitles);
      if (parsed.voice) setVoice(parsed.voice);
      if (typeof parsed.speed === "number") setSpeed(parsed.speed);
      if (typeof parsed.speechLeadInSec === "number") setSpeechLeadInSec(parsed.speechLeadInSec);
      if (typeof parsed.speechTailSec === "number") setSpeechTailSec(parsed.speechTailSec);
      if (typeof parsed.includeThumbnailSlide === "boolean") setIncludeThumbnailSlide(parsed.includeThumbnailSlide);
      if (typeof parsed.thumbnailTitle === "string") setThumbnailTitle(parsed.thumbnailTitle);
      if (typeof parsed.thumbnailSubtitle === "string") setThumbnailSubtitle(parsed.thumbnailSubtitle);
      if (typeof parsed.thumbnailDuration === "number") setThumbnailDuration(parsed.thumbnailDuration);
      if (typeof parsed.includeThankYouSlide === "boolean") setIncludeThankYouSlide(parsed.includeThankYouSlide);
      if (typeof parsed.thankYouTitle === "string") setThankYouTitle(parsed.thankYouTitle);
      if (typeof parsed.thankYouNote === "string") setThankYouNote(parsed.thankYouNote);
      if (typeof parsed.thankYouDuration === "number") setThankYouDuration(parsed.thankYouDuration);
      if (typeof parsed.brandLogoDataUrl === "string") setBrandLogoDataUrl(parsed.brandLogoDataUrl);
      if (typeof parsed.brandLogoName === "string") setBrandLogoName(parsed.brandLogoName);

      if (Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
        const sanitized = parsed.scenes
          .map((scene, index) => ({
            sceneNumber: index + 1,
            duration: typeof scene.duration === "number" ? Math.max(1, Math.min(60, Math.floor(scene.duration))) : 6,
            caption: typeof scene.caption === "string" ? scene.caption : "",
            voiceover: typeof scene.voiceover === "string" ? scene.voiceover : "",
            image: typeof scene.image === "string" ? scene.image : "",
            transition: scene.transition ?? "cut",
          }))
          .filter((scene) => Number.isFinite(scene.duration));

        if (sanitized.length > 0) {
          setScenes(sanitized);
          setActiveSceneTab(sanitized[0]?.sceneNumber ?? 1);
        }
      }
    } catch {
      // Ignore corrupt local draft and continue with defaults.
    } finally {
      setIsDraftHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isDraftHydrated) {
      return;
    }

    const draft: VideoStudioDraft = {
      title,
      topic,
      audience,
      style,
      aspectRatio,
      durationSec,
      prompt,
      includeVoiceover,
      scenes,
      editablePlan,
      musicTrack,
      uploadedMusicUrl,
      uploadedMusicName,
      musicVolume,
      voiceVolume,
      quality,
      includeSubtitles,
      voice,
      speed,
      speechLeadInSec,
      speechTailSec,
      includeThumbnailSlide,
      thumbnailTitle,
      thumbnailSubtitle,
      thumbnailDuration,
      includeThankYouSlide,
      thankYouTitle,
      thankYouNote,
      thankYouDuration,
      brandLogoDataUrl,
      brandLogoName,
    };

    try {
      window.localStorage.setItem(VIDEO_STUDIO_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage quota issues.
    }
  }, [
    isDraftHydrated,
    title,
    topic,
    audience,
    style,
    aspectRatio,
    durationSec,
    prompt,
    includeVoiceover,
    scenes,
    editablePlan,
    musicTrack,
    uploadedMusicUrl,
    uploadedMusicName,
    musicVolume,
    voiceVolume,
    quality,
    includeSubtitles,
    voice,
    speed,
    speechLeadInSec,
    speechTailSec,
    includeThumbnailSlide,
    thumbnailTitle,
    thumbnailSubtitle,
    thumbnailDuration,
    includeThankYouSlide,
    thankYouTitle,
    thankYouNote,
    thankYouDuration,
    brandLogoDataUrl,
    brandLogoName,
  ]);

  useEffect(() => {
    if (activeSceneTab === "build" || activeSceneTab === "thumbnail" || activeSceneTab === "thankyou") {
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
        voiceVolume: 100,
        musicVolume: 100,
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
    const parsedScenes = parseScenesFromPlan(item.outputText);
    const snapshotScenes = readSceneSnapshot(item.id);
    const mergedScenes =
      snapshotScenes.length > 0
        ? parsedScenes.map((scene) => {
            const saved = snapshotScenes.find((row) => row.sceneNumber === scene.sceneNumber);
            return saved
              ? {
                  ...scene,
                  duration: saved.duration || scene.duration,
                  image: saved.image || scene.image,
                  transition: saved.transition || scene.transition,
                }
              : scene;
          })
        : parsedScenes;

    setScenes(mergedScenes);
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
        ai: {
          provider: "fallback",
          model: "history",
        },
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
      const generated = await fetchJson<VideoGenerateResponse>("/api/media/video/generate", {
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
    const getEffectiveScenes = () => {
      const parsedFromPlan = editablePlan.trim() ? parseScenesFromPlan(editablePlan) : [];
      if (parsedFromPlan.length <= scenes.length) {
        return scenes;
      }

      // Keep user-selected image/duration/transition values where scene numbers match.
      const merged = parsedFromPlan.map((scene) => {
        const existing = scenes.find((item) => item.sceneNumber === scene.sceneNumber);
        if (!existing) {
          return scene;
        }

        return {
          ...scene,
          duration: existing.duration || scene.duration,
          image: existing.image || scene.image,
          transition: existing.transition || scene.transition,
          voiceVolume: existing.voiceVolume ?? scene.voiceVolume ?? 100,
          musicVolume: existing.musicVolume ?? scene.musicVolume ?? 100,
        };
      });

      toast(`Detected ${merged.length} scenes from plan. Using full scene list for render.`);
      return merged;
    };

    const baseScenes = getEffectiveScenes();

    const buildScenesForRender = async () => {
      const output: VideoSceneItem[] = [];

      if (includeThumbnailSlide) {
        const topCaption = [thumbnailTitle.trim(), thumbnailSubtitle.trim()].filter(Boolean).join("\n");
        const topImage = await composeBrandSlideImage(thumbnailTitle.trim(), thumbnailSubtitle.trim());
        output.push({
          sceneNumber: 1,
          duration: Math.max(2, thumbnailDuration || 4),
          caption: topCaption || "Welcome",
          voiceover: topCaption || "Welcome",
          image: topImage,
          transition: "fade",
          voiceVolume: 100,
          musicVolume: 100,
        });
      }

      for (const scene of baseScenes) {
        output.push({
          ...scene,
          sceneNumber: output.length + 1,
          voiceVolume: 100,
          musicVolume: 100,
        });
      }

      if (includeThankYouSlide) {
        const endCaption = [thankYouTitle.trim(), thankYouNote.trim()].filter(Boolean).join("\n");
        const endImage = await composeBrandSlideImage(thankYouTitle.trim(), thankYouNote.trim());
        output.push({
          sceneNumber: output.length + 1,
          duration: Math.max(2, thankYouDuration || 4),
          caption: endCaption || "Thank You",
          voiceover: endCaption || "Thank you",
          image: endImage,
          transition: "fade",
          voiceVolume: 100,
          musicVolume: 100,
        });
      }

      return output;
    };

    const localizeScenesForRender = async (inputScenes: VideoSceneItem[]) => {
      return await Promise.all(
        inputScenes.map(async (scene) => {
          const image = await localizeSceneImageForRender(scene.image);
          if (image === scene.image) {
            return scene;
          }

          return {
            ...scene,
            image,
          };
        }),
      );
    };

    const renderScenes = await buildScenesForRender();
    const renderPayloadScenes = await localizeScenesForRender(renderScenes);

    if (renderScenes.length === 0) {
      toast.error("Add at least one scene.");
      return;
    }

    if (musicTrack === "uploaded" && !uploadedMusicUrl.trim()) {
      toast.error("Upload an MP3 first for uploaded music.");
      return;
    }

    const isHeavyRender = renderScenes.length >= 8;
    const effectiveQuality = isHeavyRender && quality === "1080p" ? "720p" : quality;
    const effectiveIncludeSubtitles = includeSubtitles;
    const effectiveMusicTrack = getEffectiveMusicTrack();

    if (effectiveQuality !== quality) {
      toast("Applied reliability mode for heavy build: 720p (subtitles preserved).");
    }

    if (musicTrack === "none") {
      toast("Music was set to none. Auto-applied corporate track from scene 1.");
    }

    setRenderLoading(true);
    try {
      const response = await fetchJson<RenderVideoResponse>("/api/media/video/render", {
        method: "POST",
        body: JSON.stringify({
          videoId: result?.id,
          scenes: renderPayloadScenes,
          aspectRatio,
          quality: effectiveQuality,
          includeSubtitles: effectiveIncludeSubtitles,
          voice,
          speed,
          speechLeadInSec,
          speechTailSec,
          musicTrack: effectiveMusicTrack,
          uploadedMusicUrl,
          voiceVolume,
          musicVolume,
        }),
      });

      setRenderedUrl(response.outputUrl);
      if (result?.id) {
        writeSceneSnapshot(result.id, renderScenes);
      }
      toast.success("Video rendered successfully.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video rendering failed.");
    } finally {
      setRenderLoading(false);
    }
  };

  const handleBrandLogoSelection = async (file: File) => {
    const readFileAsDataUrl = async (selectedFile: File) => {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }
          reject(new Error("Could not read logo file."));
        };
        reader.onerror = () => reject(new Error("Failed to read logo file."));
        reader.readAsDataURL(selectedFile);
      });
    };

    setBrandLogoLoading(true);
    try {
      const maxBytes = 8 * 1024 * 1024;
      if (file.size > maxBytes) {
        throw new Error("Logo is too large. Please choose up to 8MB.");
      }
      const dataUrl = await readFileAsDataUrl(file);
      setBrandLogoDataUrl(dataUrl);
      setBrandLogoName(file.name || "logo");
      toast.success("Logo selected from local computer.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logo selection failed.");
    } finally {
      setBrandLogoLoading(false);
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

      const imported = await fetchJson<AssetImportResponse>("/api/media/video/assets/import", {
        method: "POST",
        body: JSON.stringify({ sourceUrl: response.items[0].sourceUrl }),
      });

      updateScene(scene.sceneNumber, { image: imported.imageUrl });
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

  const getEffectiveMusicTrack = () => {
    if (musicTrack !== "none") {
      return musicTrack;
    }

    return "corporate" as VideoMusicTrack;
  };

  const getSlideCanvasSize = () => {
    if (aspectRatio === "9:16") {
      return { width: 900, height: 1600 };
    }
    if (aspectRatio === "1:1") {
      return { width: 1200, height: 1200 };
    }
    return { width: 1600, height: 900 };
  };

  const loadImageElement = async (src: string) => {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load logo image."));
      image.src = src;
    });
  };

  const composeBrandSlideImage = async (headline: string, subline: string) => {
    const { width, height } = getSlideCanvasSize();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return brandLogoDataUrl || "/velynxia-Logo.png";
    }

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0b132b");
    gradient.addColorStop(1, "#132a4d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const logoSrc = brandLogoDataUrl || "/velynxia-Logo.png";
    try {
      const logo = await loadImageElement(logoSrc);
      const maxW = Math.round(width * 0.42);
      const maxH = Math.round(height * 0.34);
      const scale = Math.min(maxW / logo.width, maxH / logo.height, 1);
      const drawW = Math.max(1, Math.round(logo.width * scale));
      const drawH = Math.max(1, Math.round(logo.height * scale));
      const x = Math.round((width - drawW) / 2);
      const y = Math.round((height - drawH) / 2 - height * 0.03);
      ctx.drawImage(logo, x, y, drawW, drawH);
    } catch {
      // Continue with text-only slide when logo cannot be drawn.
    }

    const drawTextBlock = (text: string, y: number, size: number, color: string) => {
      if (!text.trim()) return;
      ctx.font = `700 ${size}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.trim(), width / 2, y);
    };

    drawTextBlock(headline, Math.round(height * 0.16), Math.round(width * 0.035), "#f8fafc");
    drawTextBlock(subline, Math.round(height * 0.84), Math.round(width * 0.022), "#dbeafe");

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const localizeSceneImageForRender = async (imageValue: string) => {
    const value = imageValue.trim();
    if (!value || value.startsWith("data:image/") || /^https?:\/\//i.test(value)) {
      return value;
    }

    if (!value.startsWith("/media/image/")) {
      return value;
    }

    try {
      const response = await fetch(value);
      if (!response.ok) {
        return value;
      }

      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }
          reject(new Error("Could not encode scene image."));
        };
        reader.onerror = () => reject(new Error("Could not read scene image."));
        reader.readAsDataURL(blob);
      });
    } catch {
      return value;
    }
  };

  const renderSingleScenePreview = async (scene: VideoSceneItem) => {
    const renderSafeScene: VideoSceneItem = {
      ...scene,
      image: await localizeSceneImageForRender(scene.image),
    };

    const effectiveMusicTrack = getEffectiveMusicTrack();

    const response = await fetchJson<RenderVideoResponse>("/api/media/video/render", {
      method: "POST",
      body: JSON.stringify({
        scenes: [
          {
            sceneNumber: 1,
            duration: Math.max(1, renderSafeScene.duration || 6),
            caption: renderSafeScene.caption,
            voiceover: renderSafeScene.voiceover,
            image: renderSafeScene.image,
            transition: "cut",
            voiceVolume: renderSafeScene.voiceVolume ?? 100,
            musicVolume: renderSafeScene.musicVolume ?? 100,
          },
        ],
        aspectRatio,
        quality,
        includeSubtitles,
        voice,
        speed,
        speechLeadInSec,
        speechTailSec,
        musicTrack: effectiveMusicTrack,
        uploadedMusicUrl,
        voiceVolume,
        musicVolume,
      }),
    });

    return response.outputUrl;
  };

  const previewSceneVideo = async (scene: VideoSceneItem) => {
    if (musicTrack === "uploaded" && !uploadedMusicUrl.trim()) {
      toast.error("Upload an MP3 first for uploaded music.");
      return;
    }

    setSceneVideoPreviewLoadingScene(scene.sceneNumber);
    try {
      const outputUrl = await renderSingleScenePreview(scene);
      setSceneVideoPreview((prev) => ({ ...prev, [scene.sceneNumber]: outputUrl }));
      toast.success(`Scene ${scene.sceneNumber} preview is ready.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scene preview failed.");
    } finally {
      setSceneVideoPreviewLoadingScene(null);
    }
  };

  const previewThumbnailScene = async () => {
    if (!includeThumbnailSlide) {
      toast.error("Enable Thumbnail First Slide first.");
      return;
    }

    setBrandScenePreviewLoading("thumbnail");
    try {
      const caption = [thumbnailTitle.trim(), thumbnailSubtitle.trim()].filter(Boolean).join("\n") || "Welcome";
      const image = await composeBrandSlideImage(thumbnailTitle.trim(), thumbnailSubtitle.trim());
      const outputUrl = await renderSingleScenePreview({
        sceneNumber: 1,
        duration: Math.max(2, thumbnailDuration || 4),
        caption,
        voiceover: caption,
        image,
        transition: "cut",
      });

      setThumbnailScenePreviewUrl(outputUrl);
      toast.success("Thumbnail scene preview ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thumbnail preview failed.");
    } finally {
      setBrandScenePreviewLoading(null);
    }
  };

  const previewThankYouScene = async () => {
    if (!includeThankYouSlide) {
      toast.error("Enable Thank You Last Slide first.");
      return;
    }

    setBrandScenePreviewLoading("thankyou");
    try {
      const caption = [thankYouTitle.trim(), thankYouNote.trim()].filter(Boolean).join("\n") || "Thank you";
      const image = await composeBrandSlideImage(thankYouTitle.trim(), thankYouNote.trim());
      const outputUrl = await renderSingleScenePreview({
        sceneNumber: 1,
        duration: Math.max(2, thankYouDuration || 4),
        caption,
        voiceover: caption,
        image,
        transition: "cut",
      });

      setThankYouScenePreviewUrl(outputUrl);
      toast.success("Thank you scene preview ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thank you preview failed.");
    } finally {
      setBrandScenePreviewLoading(null);
    }
  };

  const optimizeLocalImage = async (file: File) => {
    const maxDimension = 1600;
    const targetType = "image/jpeg";
    const targetQuality = 0.86;

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }
          reject(new Error("Could not read local image."));
        };
        reader.onerror = () => reject(new Error("Failed to read local image."));
        reader.readAsDataURL(file);
      });

      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not decode image."));
        img.src = dataUrl;
      });

      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return file;
      }

      ctx.drawImage(image, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((value) => resolve(value), targetType, targetQuality);
      });

      if (!blob) {
        return file;
      }

      return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: targetType });
    } catch {
      return file;
    }
  };

  const uploadLocalSceneImage = async (scene: VideoSceneItem, file: File) => {
    setAssetUploadLoadingScene(scene.sceneNumber);
    try {
      const optimized = await optimizeLocalImage(file);
      const formData = new FormData();
      formData.append("file", optimized, optimized.name || `scene-${scene.sceneNumber}.jpg`);

      const response = await fetch("/api/media/video/assets/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({ error: "Upload failed." }))) as { error?: string };
        throw new Error(err.error ?? "Upload failed.");
      }

      const payload = (await response.json()) as AssetUploadResponse;
      updateScene(scene.sceneNumber, { image: payload.imageUrl });
      toast.success(`Scene ${scene.sceneNumber} image uploaded (optimized).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setAssetUploadLoadingScene(null);
    }
  };

  const openSceneImageFromLocalDrive = async (scene: VideoSceneItem, file: File) => {
    setAssetUploadLoadingScene(scene.sceneNumber);
    try {
      const optimized = await optimizeLocalImage(file);

      // Prefer upload so render payload stays small and faster than sending large data URLs.
      try {
        const formData = new FormData();
        formData.append("file", optimized, optimized.name || `scene-${scene.sceneNumber}.jpg`);

        const uploadResponse = await fetch("/api/media/video/assets/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const payload = (await uploadResponse.json()) as AssetUploadResponse;
          updateScene(scene.sceneNumber, { image: payload.imageUrl });
          toast.success(`Scene ${scene.sceneNumber} image opened from local drive.`);
          return;
        }
      } catch {
        // Fallback to data URL below if upload endpoint is unavailable.
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }
          reject(new Error("Could not read local image."));
        };
        reader.onerror = () => reject(new Error("Failed to read local image."));
        reader.readAsDataURL(optimized);
      });

      updateScene(scene.sceneNumber, { image: dataUrl });
      toast.success(`Scene ${scene.sceneNumber} image loaded from local drive.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open local image.");
    } finally {
      setAssetUploadLoadingScene(null);
    }
  };

  const downloadSceneImage = async (scene: VideoSceneItem) => {
    const src = getScenePreviewSrc(scene.image);
    if (!src) {
      toast.error("No downloadable image available for this scene.");
      return;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error("Failed to fetch image for download.");
      }

      const blob = await response.blob();
      const extByMime: Record<string, string> = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
        "image/gif": "gif",
      };
      const ext = extByMime[blob.type] ?? "png";
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `scene-${scene.sceneNumber}-${Date.now()}.${ext}`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      toast.success(`Scene ${scene.sceneNumber} image saved.`);
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
      toast("Opened image in new tab for manual save.");
    }
  };

  const uploadMusicTrack = async (file: File) => {
    setMusicUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name || "uploaded-music.mp3");

      const response = await fetch("/api/media/video/music/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({ error: "Music upload failed." }))) as { error?: string };
        throw new Error(err.error ?? "Music upload failed.");
      }

      const payload = (await response.json()) as MusicUploadResponse;
      setUploadedMusicUrl(payload.audioUrl);
      setUploadedMusicName(payload.fileName || "uploaded-music.mp3");
      setMusicTrack("uploaded");
      toast.success("Music uploaded. Uploaded track selected.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Music upload failed.");
    } finally {
      setMusicUploadLoading(false);
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
                {result ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-200">{result.sceneCount} scenes</span>
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">
                      {result.meta.ai.provider} - {result.meta.ai.model}
                    </span>
                  </div>
                ) : null}
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
                <button
                  onClick={() => setActiveSceneTab("thumbnail")}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    activeSceneTab === "thumbnail"
                      ? "bg-amber-500/20 text-amber-100"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Thumbnail (First)
                </button>
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
                  onClick={() => setActiveSceneTab("thankyou")}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    activeSceneTab === "thankyou"
                      ? "bg-amber-500/20 text-amber-100"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Thank You (Last)
                </button>
                <button
                  onClick={() => setActiveSceneTab("build")}
                  className={`ml-auto rounded-lg px-3 py-1.5 text-xs transition ${
                    activeSceneTab === "build" ? "bg-emerald-500/20 text-emerald-100" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Final Build
                </button>
              </div>

              {activeSceneTab === "thumbnail" ? (
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Thumbnail Scene (First)</p>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeThumbnailSlide}
                        onChange={(event) => setIncludeThumbnailSlide(event.target.checked)}
                      />
                      Include in final video
                    </label>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <input
                      value={thumbnailTitle}
                      onChange={(event) => setThumbnailTitle(event.target.value)}
                      placeholder="Thumbnail heading"
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                    />
                    <input
                      value={thumbnailSubtitle}
                      onChange={(event) => setThumbnailSubtitle(event.target.value)}
                      placeholder="Thumbnail subheading"
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                    />
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={thumbnailDuration}
                      onChange={(event) => setThumbnailDuration(Math.max(2, Number(event.target.value) || 4))}
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                      title="Thumbnail duration (seconds)"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10">
                      {brandLogoLoading ? "Loading Logo..." : "Change Logo For Thumbnail/Thank You"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        disabled={brandLogoLoading}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void handleBrandLogoSelection(file);
                          }
                          event.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void previewThumbnailScene()}
                      disabled={brandScenePreviewLoading === "thumbnail"}
                      className="rounded border border-amber-300/30 px-2 py-1 text-xs text-amber-100 hover:bg-amber-500/10 disabled:opacity-50"
                    >
                      {brandScenePreviewLoading === "thumbnail" ? "Rendering Preview..." : "Preview Thumbnail Scene"}
                    </button>
                  </div>

                  {thumbnailScenePreviewUrl ? (
                    <div className="mt-2 rounded-lg border border-amber-300/20 bg-amber-500/10 p-2">
                      <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-amber-100/80">Thumbnail Scene Preview</p>
                      <video controls className="w-full rounded-md" src={thumbnailScenePreviewUrl} />
                      <a
                        className="mt-2 block rounded border border-amber-300/30 px-2 py-1 text-center text-xs text-amber-100 hover:bg-amber-500/20"
                        href={thumbnailScenePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="thumbnail-scene-preview.mp4"
                      >
                        Download Thumbnail Scene
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : activeSceneTab === "thankyou" ? (
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Thank You Scene (Last)</p>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeThankYouSlide}
                        onChange={(event) => setIncludeThankYouSlide(event.target.checked)}
                      />
                      Include in final video
                    </label>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <input
                      value={thankYouTitle}
                      onChange={(event) => setThankYouTitle(event.target.value)}
                      placeholder="Final scene heading"
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                    />
                    <input
                      value={thankYouNote}
                      onChange={(event) => setThankYouNote(event.target.value)}
                      placeholder="Final scene note"
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                    />
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={thankYouDuration}
                      onChange={(event) => setThankYouDuration(Math.max(2, Number(event.target.value) || 4))}
                      className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-sm"
                      title="Thank you duration (seconds)"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10">
                      {brandLogoLoading ? "Loading Logo..." : "Change Logo For Thumbnail/Thank You"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        disabled={brandLogoLoading}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void handleBrandLogoSelection(file);
                          }
                          event.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void previewThankYouScene()}
                      disabled={brandScenePreviewLoading === "thankyou"}
                      className="rounded border border-emerald-300/30 px-2 py-1 text-xs text-emerald-100 hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      {brandScenePreviewLoading === "thankyou" ? "Rendering Preview..." : "Preview Thank You Scene"}
                    </button>
                  </div>

                  {thankYouScenePreviewUrl ? (
                    <div className="mt-2 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-2">
                      <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-emerald-100/80">Thank You Scene Preview</p>
                      <video controls className="w-full rounded-md" src={thankYouScenePreviewUrl} />
                      <a
                        className="mt-2 block rounded border border-emerald-300/30 px-2 py-1 text-center text-xs text-emerald-100 hover:bg-emerald-500/20"
                        href={thankYouScenePreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="thank-you-scene-preview.mp4"
                      >
                        Download Thank You Scene
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : activeSceneTab !== "build" ? (() => {
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

                    <div className="mb-3 rounded-lg border border-white/10 bg-slate-900/50 p-2">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-300">Scene Music</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        <select
                          value={musicTrack}
                          onChange={(event) => setMusicTrack(event.target.value as VideoMusicTrack)}
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5 text-xs"
                        >
                          <option value="none">No music (auto uses corporate in render)</option>
                          <option value="corporate">Corporate</option>
                          <option value="ambient">Ambient</option>
                          <option value="motivational">Motivational</option>
                          <option value="upbeat">Upbeat</option>
                          <option value="uploaded">Uploaded MP3</option>
                        </select>
                        <label className="inline-flex cursor-pointer items-center justify-center rounded border border-indigo-300/30 px-2 py-1.5 text-xs text-indigo-100 hover:bg-indigo-500/10">
                          {musicUploadLoading ? "Uploading MP3..." : "Upload Music (MP3)"}
                          <input
                            type="file"
                            accept="audio/mpeg,.mp3"
                            className="hidden"
                            disabled={musicUploadLoading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                void uploadMusicTrack(file);
                              }
                              event.target.value = "";
                            }}
                          />
                        </label>
                        <div className="text-xs text-slate-300">
                          Track: <span className="font-semibold capitalize">{musicTrack}</span>
                        </div>
                      </div>
                      {uploadedMusicUrl ? (
                        <div className="mt-2 rounded border border-indigo-300/20 bg-indigo-500/10 p-2">
                          <p className="truncate text-xs text-indigo-100">Using: {uploadedMusicName || "uploaded-music.mp3"}</p>
                          <audio controls className="mt-1 w-full" src={uploadedMusicUrl} />
                        </div>
                      ) : null}
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

                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <div className="rounded border border-white/10 bg-slate-900/40 p-2">
                        <label className="block text-xs text-slate-300">Scene Voice Volume ({Math.round(scene.voiceVolume ?? 100)}%)</label>
                        <input
                          type="range"
                          min={0}
                          max={200}
                          value={scene.voiceVolume ?? 100}
                          onChange={(event) => updateScene(scene.sceneNumber, { voiceVolume: Number(event.target.value) })}
                          className="mt-1 w-full"
                        />
                      </div>
                      <div className="rounded border border-white/10 bg-slate-900/40 p-2">
                        <label className="block text-xs text-slate-300">Scene Music Volume ({Math.round(scene.musicVolume ?? 100)}%)</label>
                        <input
                          type="range"
                          min={0}
                          max={200}
                          value={scene.musicVolume ?? 100}
                          onChange={(event) => updateScene(scene.sceneNumber, { musicVolume: Number(event.target.value) })}
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>

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
                        disabled={assetLoadingScene === scene.sceneNumber || assetUploadLoadingScene === scene.sceneNumber}
                        className="rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10 disabled:opacity-50"
                      >
                        {assetLoadingScene === scene.sceneNumber ? "Searching..." : "Auto Image (Pexels/Pixabay)"}
                      </button>
                      <label className="cursor-pointer rounded border border-lime-300/30 px-2 py-1 text-xs text-lime-100 hover:bg-lime-500/10">
                        {assetUploadLoadingScene === scene.sceneNumber ? "Opening..." : "Open From Local Drive"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          disabled={assetUploadLoadingScene === scene.sceneNumber}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void openSceneImageFromLocalDrive(scene, file);
                            }
                            event.target.value = "";
                          }}
                        />
                      </label>
                      <label className="cursor-pointer rounded border border-indigo-300/30 px-2 py-1 text-xs text-indigo-100 hover:bg-indigo-500/10">
                        {assetUploadLoadingScene === scene.sceneNumber ? "Uploading..." : "Browse + Upload Image"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          disabled={assetUploadLoadingScene === scene.sceneNumber}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void uploadLocalSceneImage(scene, file);
                            }
                            event.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        onClick={() => void downloadSceneImage(scene)}
                        disabled={!scene.image}
                        className="rounded border border-fuchsia-300/30 px-2 py-1 text-xs text-fuchsia-100 hover:bg-fuchsia-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Save Image Locally
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
                        <a
                          className="mt-2 block rounded border border-emerald-300/30 px-2 py-1 text-center text-xs text-emerald-100 hover:bg-emerald-500/20"
                          href={sceneVoicePreview[scene.sceneNumber]}
                          target="_blank"
                          rel="noreferrer"
                          download={`scene-${scene.sceneNumber}-voice.mp3`}
                        >
                          Download Voice Preview
                        </a>
                      </div>
                    ) : null}

                    {sceneVideoPreview[scene.sceneNumber] ? (
                      <div className="mt-2 rounded-lg border border-amber-300/20 bg-amber-500/10 p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-amber-100/80">Scene Preview (Slide + Voice + Music)</p>
                        <video controls className="w-full rounded-md" src={sceneVideoPreview[scene.sceneNumber]} />
                        <a
                          className="mt-2 block rounded border border-amber-300/30 px-2 py-1 text-center text-xs text-amber-100 hover:bg-amber-500/20"
                          href={sceneVideoPreview[scene.sceneNumber]}
                          target="_blank"
                          rel="noreferrer"
                          download={`scene-${scene.sceneNumber}-preview.mp4`}
                        >
                          Download Scene Preview
                        </a>
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
                    {(["none", "corporate", "ambient", "motivational", "upbeat", "uploaded"] as VideoMusicTrack[]).map((track) => (
                      <label key={track} className="flex items-center gap-2">
                        <input type="radio" checked={musicTrack === track} onChange={() => setMusicTrack(track)} />
                        <span className="capitalize">{track}</span>
                      </label>
                    ))}
                    <label className="mt-2 inline-flex cursor-pointer items-center rounded border border-indigo-300/30 px-2 py-1 text-xs text-indigo-100 hover:bg-indigo-500/10">
                      {musicUploadLoading ? "Uploading MP3..." : "Upload Music (MP3)"}
                      <input
                        type="file"
                        accept="audio/mpeg,.mp3"
                        className="hidden"
                        disabled={musicUploadLoading}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void uploadMusicTrack(file);
                          }
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {uploadedMusicUrl ? (
                      <div className="rounded border border-indigo-300/20 bg-indigo-500/10 p-2 text-xs text-indigo-100">
                        <p className="truncate">Using: {uploadedMusicName || "uploaded-music.mp3"}</p>
                        <audio controls className="mt-2 w-full" src={uploadedMusicUrl} />
                      </div>
                    ) : null}
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

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3 md:col-span-2">
                      <p className="text-sm font-semibold">Brand Logo (Local File)</p>
                      <p className="mt-1 text-xs text-slate-400">Used in the middle of Thumbnail and Thank You slides.</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10">
                          {brandLogoLoading ? "Loading Logo..." : "Select Logo From Local Computer"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="hidden"
                            disabled={brandLogoLoading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                void handleBrandLogoSelection(file);
                              }
                              event.target.value = "";
                            }}
                          />
                        </label>
                        {brandLogoDataUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBrandLogoDataUrl("");
                              setBrandLogoName("");
                            }}
                            className="rounded border border-rose-300/30 px-2 py-1 text-xs text-rose-100 hover:bg-rose-500/10"
                          >
                            Remove Logo
                          </button>
                        ) : null}
                        <span className="text-xs text-slate-300">{brandLogoName || "Using default Velynxia logo"}</span>
                      </div>
                      {brandLogoDataUrl ? (
                        <div className="mt-2 rounded border border-white/10 bg-black/20 p-2">
                          <img src={brandLogoDataUrl} alt="Brand logo preview" className="mx-auto max-h-24 rounded-md object-contain" />
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={includeThumbnailSlide}
                          onChange={(event) => setIncludeThumbnailSlide(event.target.checked)}
                        />
                        Thumbnail First Slide
                      </label>
                      <div className="grid gap-2 text-sm">
                        <input
                          value={thumbnailTitle}
                          onChange={(event) => setThumbnailTitle(event.target.value)}
                          placeholder="Thumbnail heading"
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                        />
                        <input
                          value={thumbnailSubtitle}
                          onChange={(event) => setThumbnailSubtitle(event.target.value)}
                          placeholder="Thumbnail subheading"
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                        />
                        <input
                          type="number"
                          min={2}
                          max={12}
                          value={thumbnailDuration}
                          onChange={(event) => setThumbnailDuration(Math.max(2, Number(event.target.value) || 4))}
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                          title="Thumbnail duration (seconds)"
                        />
                        <button
                          type="button"
                          onClick={() => void previewThumbnailScene()}
                          disabled={brandScenePreviewLoading === "thumbnail"}
                          className="rounded border border-cyan-300/30 px-2 py-1.5 text-xs text-cyan-100 hover:bg-cyan-500/10 disabled:opacity-50"
                        >
                          {brandScenePreviewLoading === "thumbnail" ? "Rendering..." : "Preview Thumbnail Scene"}
                        </button>
                        {thumbnailScenePreviewUrl ? (
                          <a
                            className="rounded border border-cyan-300/30 px-2 py-1.5 text-center text-xs text-cyan-100 hover:bg-cyan-500/20"
                            href={thumbnailScenePreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            download="thumbnail-scene-preview.mp4"
                          >
                            Download Thumbnail Scene
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={includeThankYouSlide}
                          onChange={(event) => setIncludeThankYouSlide(event.target.checked)}
                        />
                        Thank You Last Slide
                      </label>
                      <div className="grid gap-2 text-sm">
                        <input
                          value={thankYouTitle}
                          onChange={(event) => setThankYouTitle(event.target.value)}
                          placeholder="Final slide heading"
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                        />
                        <input
                          value={thankYouNote}
                          onChange={(event) => setThankYouNote(event.target.value)}
                          placeholder="Final slide note"
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                        />
                        <input
                          type="number"
                          min={2}
                          max={12}
                          value={thankYouDuration}
                          onChange={(event) => setThankYouDuration(Math.max(2, Number(event.target.value) || 4))}
                          className="rounded border border-white/15 bg-slate-900/70 px-2 py-1.5"
                          title="Thank you slide duration (seconds)"
                        />
                        <button
                          type="button"
                          onClick={() => void previewThankYouScene()}
                          disabled={brandScenePreviewLoading === "thankyou"}
                          className="rounded border border-emerald-300/30 px-2 py-1.5 text-xs text-emerald-100 hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          {brandScenePreviewLoading === "thankyou" ? "Rendering..." : "Preview Thank You Scene"}
                        </button>
                        {thankYouScenePreviewUrl ? (
                          <a
                            className="rounded border border-emerald-300/30 px-2 py-1.5 text-center text-xs text-emerald-100 hover:bg-emerald-500/20"
                            href={thankYouScenePreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            download="thank-you-scene-preview.mp4"
                          >
                            Download Thank You Scene
                          </a>
                        ) : null}
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
