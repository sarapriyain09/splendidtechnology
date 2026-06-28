"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import type {
  AvatarCloneItem,
  AvatarAspectRatio,
  AvatarBackground,
  AvatarCloneProfilePayload,
  AvatarHistoryItem,
  AvatarLanguage,
  AvatarPreset,
  AvatarRenderMode,
  AvatarStatistics,
  CloneBackground,
  CloneCategory,
  CloneEmotion,
  CloneGender,
  CloneHistoryResponse,
  CloneProjectItem,
  VoiceCloneItem,
  VoiceType,
} from "@/types/media";

type StudioTab = "create" | "templates" | "clone-me" | "my-clones" | "history" | "settings";

type CloneWizardStep = 1 | 2 | 3 | 4 | 5;
type CloneCaptureMode = "pro" | "quick";

type GenerateAvatarResponse = AvatarHistoryItem & {
  generatedAt: string;
  meta: {
    phase: string;
    render: string;
  };
};

type Template = {
  id: string;
  title: string;
  script: string;
  preset: AvatarPreset;
  background: AvatarBackground;
  language: AvatarLanguage;
  aspectRatio: AvatarAspectRatio;
};

type CloneVideoMeta = {
  durationSec: number;
  durationMin: number;
  width: number;
  height: number;
  fps: number;
};

type CloneGenerateResponse = {
  projectId: string;
  status: string;
  outputVideo: string | null;
  meta: {
    cloneName: string;
    voiceCloneName: string;
    background: string | null;
    music: string | null;
    subtitle: boolean;
    aspectRatio: string;
    emotion: string;
    sceneCount: number;
    scenesPerMinute: number;
    voicePreviewUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

function splitScriptForScenePreview(script: string, scenesPerMinute: number) {
  const clean = script.trim().replace(/\s+/g, " ");
  if (!clean) {
    return [] as string[];
  }

  const words = clean.split(" ");
  const estimatedMinutes = Math.max(words.length / 130, 0.2);
  const sceneCount = Math.max(1, Math.round(estimatedMinutes * scenesPerMinute));
  const chunkSize = Math.max(6, Math.ceil(words.length / sceneCount));
  const scenes: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    scenes.push(words.slice(i, i + chunkSize).join(" "));
  }

  return scenes;
}

type AvatarAssetUploadResponse = {
  url: string;
  kind: "audio" | "image";
  fileName: string;
  size: number;
};

const trainingStatusStages = [
  { label: "Uploading", matches: ["upload"] },
  { label: "Processing", matches: ["process"] },
  { label: "Training Face", matches: ["face"] },
  { label: "Training Voice", matches: ["voice"] },
  { label: "Ready", matches: ["ready", "completed", "done"] },
] as const;

const trainingActionChecklist = [
  { label: "Uploading media files", matches: ["upload"], stageIndex: 0 },
  { label: "Validating file format and duration", matches: ["valid", "duration", "check"], stageIndex: 1 },
  { label: "Preparing face training dataset", matches: ["prepare", "dataset", "photo", "frame"], stageIndex: 1 },
  { label: "Training face model", matches: ["face"], stageIndex: 2 },
  { label: "Extracting and normalizing voice sample", matches: ["extract", "audio", "voice"], stageIndex: 3 },
  { label: "Training voice model", matches: ["voice"], stageIndex: 3 },
  { label: "Finalizing clone profile", matches: ["final", "ready", "complete", "done"], stageIndex: 4 },
] as const;

function getStatusBadgeClass(status: AvatarHistoryItem["status"]) {
  if (status === "COMPLETED") {
    return "border-emerald-300/30 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "PROCESSING") {
    return "border-amber-300/30 bg-amber-500/10 text-amber-200";
  }

  if (status === "FAILED") {
    return "border-red-300/30 bg-red-500/10 text-red-200";
  }

  return "border-cyan-300/30 bg-cyan-500/10 text-cyan-200";
}

const presets: AvatarPreset[] = ["business-male", "business-female", "teacher", "trainer", "support"];
const backgrounds: AvatarBackground[] = ["office", "studio", "classroom", "home"];
const languages: AvatarLanguage[] = ["english", "tamil", "hindi", "spanish"];
const aspectRatios: AvatarAspectRatio[] = ["16:9", "9:16"];

const templates: Template[] = [
  {
    id: "biz-pitch",
    title: "Business Product Pitch",
    script:
      "Welcome to Velynxia AI Media Suite. Today I will walk you through how your team can generate campaign-ready media in minutes, not days.",
    preset: "business-female",
    background: "office",
    language: "english",
    aspectRatio: "16:9",
  },
  {
    id: "trainer-onboarding",
    title: "Onboarding Trainer",
    script:
      "In this session, we will complete account setup, workspace preferences, and your first AI-assisted content workflow in three easy steps.",
    preset: "trainer",
    background: "classroom",
    language: "english",
    aspectRatio: "16:9",
  },
  {
    id: "support-update",
    title: "Customer Support Update",
    script:
      "Hello and welcome. We have shipped performance improvements and new subtitle controls. Let us quickly cover what changed and what to try first.",
    preset: "support",
    background: "studio",
    language: "english",
    aspectRatio: "9:16",
  },
];

const cloneCaptureGuidance = [
  "Face center, neutral expression",
  "Turn slightly left (about 20 degrees)",
  "Turn slightly right (about 20 degrees)",
  "Look slightly up",
  "Look slightly down",
  "Smile naturally",
  "Relax face to neutral",
  "Chin slightly left",
  "Chin slightly right",
  "Face center, soft smile",
  "Turn left (about 35 degrees)",
  "Turn right (about 35 degrees)",
  "Look up with neutral face",
  "Look down with neutral face",
  "Mouth slightly open",
  "Close mouth and relax",
  "Face center, blink naturally",
  "Turn left and hold still",
  "Turn right and hold still",
  "Final front-facing neutral shot",
] as const;

type FrameValidation = {
  valid: boolean;
  reason: string;
};

function validateCaptureFrame(context: CanvasRenderingContext2D, width: number, height: number): FrameValidation {
  const sample = context.getImageData(0, 0, width, height).data;
  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let edgeEnergy = 0;
  let total = 0;

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const index = (y * width + x) * 4;
      const r = sample[index] ?? 0;
      const g = sample[index + 1] ?? 0;
      const b = sample[index + 2] ?? 0;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      luminanceSum += luma;
      luminanceSquaredSum += luma * luma;
      total += 1;

      if (x + 4 < width) {
        const right = (y * width + (x + 4)) * 4;
        const rr = sample[right] ?? 0;
        const rg = sample[right + 1] ?? 0;
        const rb = sample[right + 2] ?? 0;
        const rightLuma = 0.299 * rr + 0.587 * rg + 0.114 * rb;
        edgeEnergy += Math.abs(luma - rightLuma);
      }
    }
  }

  if (total === 0) {
    return { valid: false, reason: "Unable to read camera frame." };
  }

  const averageBrightness = luminanceSum / total;
  const variance = Math.max(luminanceSquaredSum / total - averageBrightness * averageBrightness, 0);
  const contrast = Math.sqrt(variance);
  const sharpness = edgeEnergy / total;

  if (averageBrightness < 45) {
    return { valid: false, reason: "Scene is too dark. Increase lighting." };
  }

  if (averageBrightness > 220) {
    return { valid: false, reason: "Scene is too bright. Reduce lighting." };
  }

  if (contrast < 16) {
    return { valid: false, reason: "Low contrast. Adjust distance or lighting." };
  }

  if (sharpness < 3.2) {
    return { valid: false, reason: "Image is blurry. Hold still for a second." };
  }

  return { valid: true, reason: "ok" };
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
    const bodyText = await response.text().catch(() => "");
    let message = "Request failed";

    if (bodyText) {
      try {
        const parsed = JSON.parse(bodyText) as { error?: string; message?: string };
        message = parsed.error ?? parsed.message ?? bodyText;
      } catch {
        message = bodyText;
      }
    }

    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function AvatarStudioClient() {
  const [activeTab, setActiveTab] = useState<StudioTab>("create");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [preset, setPreset] = useState<AvatarPreset>("business-male");
  const [background, setBackground] = useState<AvatarBackground>("studio");
  const [language, setLanguage] = useState<AvatarLanguage>("english");
  const [aspectRatio, setAspectRatio] = useState<AvatarAspectRatio>("16:9");
  const [voiceAudioUrl, setVoiceAudioUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [renderMode, setRenderMode] = useState<AvatarRenderMode>("sync");
  const [uploadingVoiceAsset, setUploadingVoiceAsset] = useState(false);
  const [uploadingBackgroundAsset, setUploadingBackgroundAsset] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateAvatarResponse | null>(null);
  const [history, setHistory] = useState<AvatarHistoryItem[]>([]);
  const [stats, setStats] = useState<AvatarStatistics>({
    totalAvatarsGenerated: 0,
    mostUsedPreset: "N/A",
    recentAvatars: 0,
  });

  const [cloneWizardStep, setCloneWizardStep] = useState<CloneWizardStep>(1);
  const [cloneCaptureMode, setCloneCaptureMode] = useState<CloneCaptureMode>("pro");
  const [clonePhotos, setClonePhotos] = useState<File[]>([]);
  const [clonePhotoPreviews, setClonePhotoPreviews] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(false);
  const [cloneName, setCloneName] = useState("");
  const [cloneLanguage, setCloneLanguage] = useState("english");
  const [cloneId, setCloneId] = useState<string | null>(null);
  const [cloneVideoMeta, setCloneVideoMeta] = useState<CloneVideoMeta | null>(null);
  const [cloneVideoUrl, setCloneVideoUrl] = useState<string | null>(null);
  const [trainingScriptText, setTrainingScriptText] = useState(
    "Please introduce yourself, keep a steady pace, and read naturally for at least one minute.",
  );
  const [trainingScriptTargetMin, setTrainingScriptTargetMin] = useState<number>(1);
  const [isRecordingTrainingVideo, setIsRecordingTrainingVideo] = useState(false);
  const [recordedTrainingVideoBlob, setRecordedTrainingVideoBlob] = useState<Blob | null>(null);
  const [recordedTrainingVideoUrl, setRecordedTrainingVideoUrl] = useState<string | null>(null);
  const [trainingVideoRecordingSec, setTrainingVideoRecordingSec] = useState(0);
  const [recordedTrainingVideoSec, setRecordedTrainingVideoSec] = useState(0);
  const [voiceCloneId, setVoiceCloneId] = useState<string | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [voiceDurationSec, setVoiceDurationSec] = useState<number>(0);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceBlob, setRecordedVoiceBlob] = useState<Blob | null>(null);
  const [voiceRecordingSec, setVoiceRecordingSec] = useState(0);
  const [recordedVoiceSec, setRecordedVoiceSec] = useState(0);
  const [trainingTimeline, setTrainingTimeline] = useState<string[]>([]);
  const [clones, setClones] = useState<AvatarCloneItem[]>([]);
  const [voiceClones, setVoiceClones] = useState<VoiceCloneItem[]>([]);
  const [cloneProjects, setCloneProjects] = useState<CloneProjectItem[]>([]);

  const [selectedCloneId, setSelectedCloneId] = useState("");
  const [selectedVoiceCloneId, setSelectedVoiceCloneId] = useState("");
  const [cloneScript, setCloneScript] = useState("");
  const [cloneEmotion, setCloneEmotion] = useState<CloneEmotion>("professional");
  const [cloneBackground, setCloneBackground] = useState<CloneBackground>("office");
  const [cloneMusic, setCloneMusic] = useState<"none" | "corporate" | "motivational" | "ambient" | "upbeat">("none");
  const [cloneSubtitle, setCloneSubtitle] = useState(true);
  const [cloneAspectRatio, setCloneAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [cloneScenesPerMinute, setCloneScenesPerMinute] = useState(4);
  const [cloneGenerateResult, setCloneGenerateResult] = useState<CloneGenerateResponse | null>(null);
  const [cloneGenerateError, setCloneGenerateError] = useState<string | null>(null);

  const [settingsVoice, setSettingsVoice] = useState<VoiceType>("alloy");
  const [settingsBackground, setSettingsBackground] = useState<CloneBackground>("office");
  const [settingsMusic, setSettingsMusic] = useState<"none" | "corporate" | "motivational" | "ambient" | "upbeat">("none");
  const [settingsIntro, setSettingsIntro] = useState("");
  const [settingsOutro, setSettingsOutro] = useState("");
  const [settingsLogo, setSettingsLogo] = useState("");

  const [loadingCloneTask, setLoadingCloneTask] = useState(false);
  const [requiresManualVoiceStep, setRequiresManualVoiceStep] = useState(false);
  const cloneCameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cloneCameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cloneCameraStreamRef = useRef<MediaStream | null>(null);
  const autoCaptureTimerRef = useRef<number | null>(null);
  const autoCaptureBusyRef = useRef(false);
  const clonePhotoCountRef = useRef(0);
  const trainingVideoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const trainingVideoRecorderRef = useRef<MediaRecorder | null>(null);
  const trainingVideoStreamRef = useRef<MediaStream | null>(null);
  const trainingVideoRecordTimeoutRef = useRef<number | null>(null);
  const trainingVideoRecordIntervalRef = useRef<number | null>(null);
  const trainingVideoRecordStartRef = useRef<number | null>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceRecordTimeoutRef = useRef<number | null>(null);
  const voiceRecordIntervalRef = useRef<number | null>(null);
  const voiceRecordStartRef = useRef<number | null>(null);
  const clonePhotoHardLimit = cloneCaptureMode === "quick" ? 2 : 50;
  const cloneAutoTarget = cloneCaptureMode === "quick" ? 2 : 20;
  const cloneCaptureProgressPercent = Math.min(100, Math.round((clonePhotos.length / cloneAutoTarget) * 100));

  const formatSeconds = (seconds: number) => {
    const total = Math.max(0, Math.floor(seconds));
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const attachCloneCameraStream = useCallback(async () => {
    const stream = cloneCameraStreamRef.current;
    const video = cloneCameraVideoRef.current;
    if (!stream || !video) {
      return;
    }

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    await video.play().catch(() => undefined);
  }, []);

  const stopCloneAutoCapture = useCallback(() => {
    if (autoCaptureTimerRef.current !== null) {
      window.clearInterval(autoCaptureTimerRef.current);
      autoCaptureTimerRef.current = null;
    }
    autoCaptureBusyRef.current = false;
    setAutoCaptureEnabled(false);
  }, []);

  const stopCloneCamera = useCallback(() => {
    stopCloneAutoCapture();
    const stream = cloneCameraStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      cloneCameraStreamRef.current = null;
    }

    if (cloneCameraVideoRef.current) {
      cloneCameraVideoRef.current.srcObject = null;
    }

    setCameraReady(false);
  }, [stopCloneAutoCapture]);

  useEffect(() => {
    if (!cameraReady) {
      return;
    }

    void attachCloneCameraStream();
  }, [attachCloneCameraStream, cameraReady]);

  useEffect(() => {
    clonePhotoCountRef.current = clonePhotos.length;
    const urls = clonePhotos.map((file) => URL.createObjectURL(file));
    setClonePhotoPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [clonePhotos]);

  useEffect(() => {
    setClonePhotos((prev) => (prev.length > clonePhotoHardLimit ? prev.slice(0, clonePhotoHardLimit) : prev));
    stopCloneAutoCapture();
  }, [clonePhotoHardLimit, stopCloneAutoCapture]);

  useEffect(() => {
    if (autoCaptureEnabled && clonePhotos.length >= cloneAutoTarget) {
      stopCloneAutoCapture();
      toast.success(
        cloneCaptureMode === "quick"
          ? "Quick preview set captured. Switch to Pro for training."
          : "20 valid photos captured. You can upload now.",
      );
    }
  }, [autoCaptureEnabled, cloneAutoTarget, cloneCaptureMode, clonePhotos.length, stopCloneAutoCapture]);

  useEffect(() => {
    if (activeTab !== "clone-me" || cloneWizardStep !== 1) {
      stopCloneCamera();
    }
  }, [activeTab, cloneWizardStep, stopCloneCamera]);

  useEffect(() => {
    return () => {
      stopCloneCamera();
      if (trainingVideoRecordTimeoutRef.current !== null) {
        window.clearTimeout(trainingVideoRecordTimeoutRef.current);
        trainingVideoRecordTimeoutRef.current = null;
      }
      if (trainingVideoRecordIntervalRef.current !== null) {
        window.clearInterval(trainingVideoRecordIntervalRef.current);
        trainingVideoRecordIntervalRef.current = null;
      }
      if (voiceRecordTimeoutRef.current !== null) {
        window.clearTimeout(voiceRecordTimeoutRef.current);
        voiceRecordTimeoutRef.current = null;
      }
      if (voiceRecordIntervalRef.current !== null) {
        window.clearInterval(voiceRecordIntervalRef.current);
        voiceRecordIntervalRef.current = null;
      }
      const recorder = voiceRecorderRef.current;
      if (recorder && recorder.state === "recording") {
        recorder.stop();
      }
    };
  }, [stopCloneCamera]);

  useEffect(() => {
    if (!recordedTrainingVideoBlob) {
      setRecordedTrainingVideoUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(recordedTrainingVideoBlob);
    setRecordedTrainingVideoUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return url;
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [recordedTrainingVideoBlob]);

  useEffect(() => {
    if (cloneWizardStep !== 2 || activeTab !== "clone-me") {
      const stream = trainingVideoStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        trainingVideoStreamRef.current = null;
      }
      trainingVideoRecorderRef.current = null;
      setIsRecordingTrainingVideo(false);
      setTrainingVideoRecordingSec(0);
      trainingVideoRecordStartRef.current = null;
      if (trainingVideoRecordTimeoutRef.current !== null) {
        window.clearTimeout(trainingVideoRecordTimeoutRef.current);
        trainingVideoRecordTimeoutRef.current = null;
      }
      if (trainingVideoRecordIntervalRef.current !== null) {
        window.clearInterval(trainingVideoRecordIntervalRef.current);
        trainingVideoRecordIntervalRef.current = null;
      }
      if (trainingVideoPreviewRef.current) {
        trainingVideoPreviewRef.current.srcObject = null;
      }
    }
  }, [activeTab, cloneWizardStep]);

  const refreshAll = async () => {
    const [newHistory, newStats, cloneHistory] = await Promise.all([
      fetchJson<AvatarHistoryItem[]>("/api/media/avatar/history"),
      fetchJson<AvatarStatistics>("/api/media/avatar/statistics"),
      fetchJson<CloneHistoryResponse>("/api/media/clone/history"),
    ]);

    setHistory(newHistory);
    setStats(newStats);
    setClones(cloneHistory.clones);
    setVoiceClones(cloneHistory.voiceClones);
    setCloneProjects(cloneHistory.projects);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshAll();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("avatar-clone-settings");
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        voice?: VoiceType;
        background?: CloneBackground;
        music?: "none" | "corporate" | "motivational" | "ambient" | "upbeat";
        intro?: string;
        outro?: string;
        logo?: string;
      };
      if (parsed.voice) setSettingsVoice(parsed.voice);
      if (parsed.background) setSettingsBackground(parsed.background);
      if (parsed.music) setSettingsMusic(parsed.music);
      if (typeof parsed.intro === "string") setSettingsIntro(parsed.intro);
      if (typeof parsed.outro === "string") setSettingsOutro(parsed.outro);
      if (typeof parsed.logo === "string") setSettingsLogo(parsed.logo);
    } catch {
      // Ignore malformed local cache.
    }
  }, []);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return templates;
    }

    return templates.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.preset.toLowerCase().includes(q) ||
        item.script.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return history;
    }

    return history.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.preset.toLowerCase().includes(q) ||
        item.script.toLowerCase().includes(q)
      );
    });
  }, [history, search]);

  const filteredClones = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return clones;
    }

    return clones.filter((item) => {
      return item.name.toLowerCase().includes(q) || item.language.toLowerCase().includes(q);
    });
  }, [clones, search]);

  const activeTrainingStageIndex = useMemo(() => {
    if (trainingTimeline.length === 0) {
      return -1;
    }

    const merged = trainingTimeline.join(" ").toLowerCase();
    let index = -1;
    trainingStatusStages.forEach((stage, stageIndex) => {
      if (stage.matches.some((keyword) => merged.includes(keyword))) {
        index = Math.max(index, stageIndex);
      }
    });

    return index;
  }, [trainingTimeline]);

  const trainingStagePercent = activeTrainingStageIndex < 0
    ? 0
    : Math.round(((activeTrainingStageIndex + 1) / trainingStatusStages.length) * 100);

  const trainingMergedTimeline = useMemo(() => {
    if (trainingTimeline.length === 0) {
      return "";
    }

    return trainingTimeline.join(" ").toLowerCase();
  }, [trainingTimeline]);

  const activeChecklistIndex = useMemo(() => {
    let maxMatch = -1;
    trainingActionChecklist.forEach((item, index) => {
      if (item.matches.some((keyword) => trainingMergedTimeline.includes(keyword))) {
        maxMatch = Math.max(maxMatch, index);
      }
    });

    if (maxMatch >= 0) {
      return maxMatch;
    }

    if (activeTrainingStageIndex < 0) {
      return -1;
    }

    let fallback = -1;
    trainingActionChecklist.forEach((item, index) => {
      if (item.stageIndex <= activeTrainingStageIndex) {
        fallback = Math.max(fallback, index);
      }
    });
    return fallback;
  }, [activeTrainingStageIndex, trainingMergedTimeline]);

  const trainingScriptEstimatedMin = useMemo(() => {
    const words = trainingScriptText.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) {
      return 0;
    }

    // Typical clear reading pace for training samples.
    return words / 130;
  }, [trainingScriptText]);

  const finalCloneScript = useMemo(() => {
    return `${settingsIntro}\n${cloneScript}\n${settingsOutro}`.trim();
  }, [cloneScript, settingsIntro, settingsOutro]);

  const cloneScenePreview = useMemo(() => {
    return splitScriptForScenePreview(finalCloneScript, cloneScenesPerMinute);
  }, [finalCloneScript, cloneScenesPerMinute]);

  const voiceCloneById = useMemo(() => {
    return new Map(voiceClones.map((item) => [item.id, item]));
  }, [voiceClones]);

  const latestProjectByAvatarId = useMemo(() => {
    const sorted = [...cloneProjects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const map = new Map<string, CloneProjectItem>();

    for (const project of sorted) {
      if (!map.has(project.avatarCloneId)) {
        map.set(project.avatarCloneId, project);
      }
    }

    return map;
  }, [cloneProjects]);

  const presetDistribution = useMemo(() => {
    const counts = new Map<AvatarPreset, number>();
    history.forEach((item) => counts.set(item.preset, (counts.get(item.preset) ?? 0) + 1));

    return presets
      .map((name) => ({ name, count: counts.get(name) ?? 0 }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [history]);

  const applyTemplate = (template: Template) => {
    setTitle(template.title);
    setScript(template.script);
    setPreset(template.preset);
    setBackground(template.background);
    setLanguage(template.language);
    setAspectRatio(template.aspectRatio);
    setActiveTab("create");
    toast.success("Template loaded.");
  };

  const loadFromHistory = (item: AvatarHistoryItem) => {
    setTitle(item.title);
    setScript(item.script);
    setPreset(item.preset);
    setBackground(item.background);
    setLanguage(item.language);
    setAspectRatio(item.aspectRatio);
    setVoiceAudioUrl(item.voiceAudioUrl ?? "");
    setBackgroundImageUrl(item.backgroundImageUrl ?? "");
    setRenderMode(item.renderMode);
    setResult({
      ...item,
      generatedAt: item.createdAt,
      meta: {
        phase: "phase-2",
        render: item.outputUrl ? "ffmpeg-placeholder" : item.renderMode === "queue" ? "queued" : "failed",
      },
    });
    setActiveTab("create");
    toast.success("Loaded from history.");
  };

  const removeItem = async (id: string) => {
    try {
      await fetchJson<null>(`/api/media/avatar/${id}`, { method: "DELETE" });
      await refreshAll();
      toast.success("Avatar item deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const enqueueItem = async (id: string) => {
    try {
      await fetchJson<GenerateAvatarResponse>(`/api/media/avatar/${id}/enqueue`, {
        method: "POST",
      });
      await refreshAll();
      toast.success("Avatar job queued.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Queue failed.");
    }
  };

  const processItem = async (id: string) => {
    try {
      const processed = await fetchJson<GenerateAvatarResponse>(`/api/media/avatar/${id}/process`, {
        method: "POST",
      });
      setResult(processed);
      await refreshAll();
      toast.success(processed.status === "COMPLETED" ? "Avatar job processed." : "Avatar processing finished.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Process failed.");
    }
  };

  const generate = async () => {
    if (!script.trim()) {
      toast.error("Enter avatar script.");
      return;
    }

    setLoading(true);
    try {
      const generated = await fetchJson<GenerateAvatarResponse>("/api/media/avatar/generate", {
        method: "POST",
        body: JSON.stringify({
          title,
          script,
          preset,
          background,
          language,
          aspectRatio,
          voiceAudioUrl,
          backgroundImageUrl,
          renderMode,
        }),
      });

      setResult(generated);
      toast.success(renderMode === "queue" ? "Avatar job queued." : "Avatar video generated.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatarAsset = async (kind: "audio" | "image", file: File) => {
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);

    const response = await fetch("/api/media/avatar/assets/upload", {
      method: "POST",
      body: form,
    });

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    } & Partial<AvatarAssetUploadResponse>;

    if (!response.ok || !body.url) {
      throw new Error(body.error ?? "Upload failed.");
    }

    return body.url;
  };

  const handleVoiceFileSelected = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingVoiceAsset(true);
    try {
      const url = await uploadAvatarAsset("audio", file);
      setVoiceAudioUrl(url);
      toast.success("Voice audio uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Voice upload failed.");
    } finally {
      setUploadingVoiceAsset(false);
    }
  };

  const handleBackgroundFileSelected = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingBackgroundAsset(true);
    try {
      const url = await uploadAvatarAsset("image", file);
      setBackgroundImageUrl(url);
      toast.success("Background image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Background upload failed.");
    } finally {
      setUploadingBackgroundAsset(false);
    }
  };

  const onAddPhotos = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const accepted = Array.from(files).filter((file) => {
      const lower = file.name.toLowerCase();
      return file.type === "image/png" || file.type === "image/jpeg" || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg");
    });

    setClonePhotos((prev) => {
      const merged = [...prev, ...accepted].slice(0, clonePhotoHardLimit);
      return merged;
    });
  };

  const startCloneCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera capture is not supported in this browser.");
      return;
    }

    try {
      stopCloneCamera();
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      cloneCameraStreamRef.current = stream;
      await attachCloneCameraStream();

      setCameraReady(true);
      toast.success("Camera started. Follow the guidance prompts for 20 captures.");
    } catch {
      setCameraError("Unable to access camera. Check browser permissions.");
      setCameraReady(false);
    }
  };

  const captureClonePhoto = async (showValidationError = true) => {
    if (clonePhotoCountRef.current >= clonePhotoHardLimit) {
      if (showValidationError) {
        toast.error(`Maximum ${clonePhotoHardLimit} photos reached.`);
      }
      return false;
    }

    const video = cloneCameraVideoRef.current;
    const canvas = cloneCameraCanvasRef.current;
    if (!video || !canvas || !cameraReady) {
      if (showValidationError) {
        toast.error("Start camera first.");
      }
      return false;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      if (showValidationError) {
        toast.error("Unable to capture camera frame.");
      }
      return false;
    }

    context.drawImage(video, 0, 0, width, height);

    const validation = validateCaptureFrame(context, width, height);
    const isBlurValidation = validation.reason.toLowerCase().includes("blurry");
    const allowBlurFrame = isBlurValidation && (autoCaptureEnabled || cloneCaptureMode === "quick");

    if (!validation.valid && !allowBlurFrame) {
      if (showValidationError) {
        toast.error(validation.reason);
      }
      return false;
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      if (showValidationError) {
        toast.error("Capture failed. Please try again.");
      }
      return false;
    }

    const file = new File([blob], `clone-camera-${Date.now()}.jpg`, { type: "image/jpeg" });
    setClonePhotos((prev) => {
      const next = [...prev, file].slice(0, clonePhotoHardLimit);
      clonePhotoCountRef.current = next.length;
      return next;
    });
    return true;
  };

  const takeClonePhoto = async () => {
    if (cameraBusy) {
      return;
    }

    setCameraBusy(true);
    const captured = await captureClonePhoto(true);
    setCameraBusy(false);

    if (captured) {
      toast.success(`Photo captured (${clonePhotoCountRef.current}/${clonePhotoHardLimit}).`);
    }
  };

  const startCloneAutoCapture = async () => {
    if (!cameraReady) {
      await startCloneCamera();
    }

    if (!cloneCameraStreamRef.current) {
      return;
    }

    if (clonePhotoCountRef.current >= cloneAutoTarget) {
      toast.success(cloneCaptureMode === "quick" ? "Quick preview set is ready." : "You already have 20+ photos. Upload when ready.");
      return;
    }

    stopCloneAutoCapture();
    setAutoCaptureEnabled(true);

    autoCaptureTimerRef.current = window.setInterval(async () => {
      if (autoCaptureBusyRef.current) {
        return;
      }

      if (clonePhotoCountRef.current >= cloneAutoTarget) {
        stopCloneAutoCapture();
        return;
      }

      autoCaptureBusyRef.current = true;
      await captureClonePhoto(false);
      autoCaptureBusyRef.current = false;
    }, 1600);
  };

  const removePhoto = (index: number) => {
    setClonePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadClonePhotos = async () => {
    if (cloneCaptureMode === "quick") {
      toast.error("Quick mode is preview only. Switch to Pro mode (20-50 photos) to upload and train.");
      return;
    }

    if (clonePhotos.length < 20 || clonePhotos.length > 50) {
      toast.error("Upload between 20 and 50 photos.");
      return;
    }

    const form = new FormData();
    form.append("cloneName", cloneName);
    form.append("language", cloneLanguage);
    clonePhotos.forEach((file) => form.append("files", file));

    setLoadingCloneTask(true);
    try {
      setRequiresManualVoiceStep(false);
      const response = await fetch("/api/media/clone/photos", { method: "POST", body: form });
      const body = (await response.json()) as { error?: string; clone?: AvatarCloneItem };
      if (!response.ok || !body.clone) {
        throw new Error(body.error ?? "Failed to upload photos.");
      }

      setCloneId(body.clone.id);
      setCloneName(body.clone.name);
      setCloneLanguage(body.clone.language);
      setCloneWizardStep(2);
      toast.success("Photos uploaded.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoadingCloneTask(false);
    }
  };

  const uploadTrainingVideo = async (file: File) => {
    const form = new FormData();
    if (cloneId) {
      form.append("cloneId", cloneId);
    }
    form.append("cloneName", cloneName || "My Clone");
    form.append("language", cloneLanguage || "english");
    form.append("file", file);

    setLoadingCloneTask(true);
    try {
      setRequiresManualVoiceStep(false);
      const response = await fetch("/api/media/clone/video", { method: "POST", body: form });
      const body = (await response.json()) as { error?: string; cloneId?: string; trainingVideo?: string; media?: CloneVideoMeta; bootstrap?: { createdFromVideoOnly?: boolean; extractedPhotoCount?: number } };
      if (!response.ok || !body.trainingVideo || !body.media || !body.cloneId) {
        throw new Error(body.error ?? "Failed to upload training video.");
      }

      setCloneId(body.cloneId);
      setCloneVideoUrl(body.trainingVideo);
      setCloneVideoMeta(body.media);
      const voiceReady = await uploadVoiceClone(file, { autoFromVideo: true });
      setRequiresManualVoiceStep(!voiceReady);
      setCloneWizardStep(voiceReady ? 4 : 3);
      const bootstrapMessage = body.bootstrap?.createdFromVideoOnly
        ? ` Extracted ${body.bootstrap.extractedPhotoCount ?? 20} photos from video automatically.`
        : "";
      toast.success((voiceReady ? "Training video uploaded and voice extracted." : "Training video uploaded.") + bootstrapMessage);
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video upload failed.");
    } finally {
      setLoadingCloneTask(false);
    }
  };

  const generateTrainingScript = () => {
    const name = cloneName.trim() || "your clone";
    const targetWords = Math.max(120, trainingScriptTargetMin * 130);
    const sections = [
      `Hello, this is ${name}. I am recording this training script for avatar and voice cloning.`,
      "I will speak clearly and naturally with a steady pace, balanced pauses, and consistent pronunciation.",
      "Today I am describing how our team plans work, sets priorities, and delivers projects from idea to execution.",
      "In a typical week, we review goals, align timelines, assign responsibilities, and monitor quality at each stage.",
      "Clear communication is important for customer trust, so I explain progress in simple language with practical examples.",
      "When priorities change, we adapt quickly while keeping standards high and documenting decisions for future reference.",
      "This sample includes short and long sentences to provide varied rhythm, emphasis, and natural intonation.",
      "I will continue with a calm tone so the model can learn stable voice characteristics across different phrases.",
      "Our workflow combines planning, delivery, feedback, and improvement to create reliable and repeatable outcomes.",
      "Thank you for listening. I will continue reading to reach the target duration for high quality training.",
    ];

    const generatedParts: string[] = [];
    let words = 0;
    let sectionIndex = 0;
    while (words < targetWords) {
      const next = sections[sectionIndex % sections.length] ?? sections[0];
      generatedParts.push(next);
      words += next.split(/\s+/).filter(Boolean).length;
      sectionIndex += 1;
    }

    const generated = generatedParts.join("\n\n");
    setTrainingScriptText(generated);
    toast.success(`Training script generated for about ${trainingScriptTargetMin} minutes.`);
  };

  const startTrainingVideoRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Video recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      trainingVideoStreamRef.current = stream;
      if (trainingVideoPreviewRef.current) {
        trainingVideoPreviewRef.current.srcObject = stream;
        await trainingVideoPreviewRef.current.play().catch(() => undefined);
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      trainingVideoRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      trainingVideoRecordStartRef.current = Date.now();
      setTrainingVideoRecordingSec(0);
      setRecordedTrainingVideoSec(0);

      if (trainingVideoRecordIntervalRef.current !== null) {
        window.clearInterval(trainingVideoRecordIntervalRef.current);
      }
      trainingVideoRecordIntervalRef.current = window.setInterval(() => {
        const started = trainingVideoRecordStartRef.current;
        if (!started) {
          return;
        }
        setTrainingVideoRecordingSec(Math.floor((Date.now() - started) / 1000));
      }, 500);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (trainingVideoRecordIntervalRef.current !== null) {
          window.clearInterval(trainingVideoRecordIntervalRef.current);
          trainingVideoRecordIntervalRef.current = null;
        }
        if (trainingVideoRecordTimeoutRef.current !== null) {
          window.clearTimeout(trainingVideoRecordTimeoutRef.current);
          trainingVideoRecordTimeoutRef.current = null;
        }
        const started = trainingVideoRecordStartRef.current;
        if (started) {
          setRecordedTrainingVideoSec(Math.max(1, Math.floor((Date.now() - started) / 1000)));
        }
        trainingVideoRecordStartRef.current = null;
        setIsRecordingTrainingVideo(false);
        setTrainingVideoRecordingSec(0);
        stream.getTracks().forEach((track) => track.stop());
        trainingVideoStreamRef.current = null;
        if (trainingVideoPreviewRef.current) {
          trainingVideoPreviewRef.current.srcObject = null;
        }

        if (chunks.length === 0) {
          return;
        }

        setRecordedTrainingVideoBlob(new Blob(chunks, { type: "video/webm" }));
      };

      recorder.start(1000);
      setRecordedTrainingVideoBlob(null);
      setIsRecordingTrainingVideo(true);
      if (trainingVideoRecordTimeoutRef.current !== null) {
        window.clearTimeout(trainingVideoRecordTimeoutRef.current);
      }
      trainingVideoRecordTimeoutRef.current = window.setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 120_000);
      toast.success("Recording started. Read the script panel while looking at the camera.");
    } catch {
      if (trainingVideoRecordIntervalRef.current !== null) {
        window.clearInterval(trainingVideoRecordIntervalRef.current);
        trainingVideoRecordIntervalRef.current = null;
      }
      if (trainingVideoRecordTimeoutRef.current !== null) {
        window.clearTimeout(trainingVideoRecordTimeoutRef.current);
        trainingVideoRecordTimeoutRef.current = null;
      }
      trainingVideoRecordStartRef.current = null;
      setTrainingVideoRecordingSec(0);
      setIsRecordingTrainingVideo(false);
      toast.error("Unable to access camera/microphone.");
    }
  };

  const stopTrainingVideoRecording = () => {
    const recorder = trainingVideoRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      return;
    }
    recorder.stop();
  };

  const uploadRecordedTrainingVideo = async () => {
    if (!recordedTrainingVideoBlob) {
      toast.error("Record training video first.");
      return;
    }

    const file = new File([recordedTrainingVideoBlob], "training-video.webm", { type: "video/webm" });
    await uploadTrainingVideo(file);
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadClonePhoto = (file: File, index: number) => {
    const extension = file.type === "image/png" ? "png" : "jpg";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadBlob(file, `clone-photo-${index + 1}-${timestamp}.${extension}`);
  };

  const downloadAllClonePhotos = () => {
    if (clonePhotos.length === 0) {
      toast.error("No photos to save.");
      return;
    }

    clonePhotos.forEach((file, index) => {
      window.setTimeout(() => downloadClonePhoto(file, index), index * 120);
    });
    toast.success(`Saving ${clonePhotos.length} photos locally.`);
  };

  const uploadVoiceClone = async (file: File, options?: { autoFromVideo?: boolean }) => {
    const form = new FormData();
    form.append("name", cloneName || "My Voice Clone");
    form.append("language", cloneLanguage);
    form.append("file", file);

    try {
      const response = await fetch("/api/media/clone/voice", { method: "POST", body: form });
      const body = (await response.json()) as {
        error?: string;
        voiceClone?: VoiceCloneItem;
        player?: { url: string };
      };

      if (!response.ok || !body.voiceClone || !body.player) {
        throw new Error(body.error ?? "Failed to upload voice clone.");
      }

      setVoiceCloneId(body.voiceClone.id);
      setVoicePreviewUrl(body.player.url);
      setVoiceDurationSec(body.voiceClone.duration);
      setRequiresManualVoiceStep(false);
      if (!options?.autoFromVideo) {
        setCloneWizardStep(4);
        toast.success("Voice clone sample uploaded.");
      }
      await refreshAll();
      return true;
    } catch (error) {
      if (options?.autoFromVideo) {
        setRequiresManualVoiceStep(true);
        toast.error(
          error instanceof Error
            ? `Video uploaded, but auto voice extraction failed: ${error.message}`
            : "Video uploaded, but auto voice extraction failed.",
        );
      } else {
        toast.error(error instanceof Error ? error.message : "Voice upload failed.");
      }
      return false;
    }
  };

  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Microphone recording is not supported in this browser.");
      return;
    }

    try {
      if (voiceRecordTimeoutRef.current !== null) {
        window.clearTimeout(voiceRecordTimeoutRef.current);
        voiceRecordTimeoutRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      voiceRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      voiceRecordStartRef.current = Date.now();
      setVoiceRecordingSec(0);
      setRecordedVoiceSec(0);
      setIsRecordingVoice(true);

      if (voiceRecordIntervalRef.current !== null) {
        window.clearInterval(voiceRecordIntervalRef.current);
      }
      voiceRecordIntervalRef.current = window.setInterval(() => {
        const started = voiceRecordStartRef.current;
        if (!started) {
          return;
        }
        setVoiceRecordingSec(Math.floor((Date.now() - started) / 1000));
      }, 500);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (voiceRecordTimeoutRef.current !== null) {
          window.clearTimeout(voiceRecordTimeoutRef.current);
          voiceRecordTimeoutRef.current = null;
        }
        if (voiceRecordIntervalRef.current !== null) {
          window.clearInterval(voiceRecordIntervalRef.current);
          voiceRecordIntervalRef.current = null;
        }
        const started = voiceRecordStartRef.current;
        if (started) {
          setRecordedVoiceSec(Math.max(1, Math.floor((Date.now() - started) / 1000)));
        }
        voiceRecordStartRef.current = null;
        voiceRecorderRef.current = null;
        setIsRecordingVoice(false);
        setVoiceRecordingSec(0);
        stream.getTracks().forEach((track) => track.stop());
        if (chunks.length === 0) {
          return;
        }

        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedVoiceBlob(blob);
      };

      recorder.start();
      voiceRecordTimeoutRef.current = window.setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 120_000);
    } catch {
      if (voiceRecordIntervalRef.current !== null) {
        window.clearInterval(voiceRecordIntervalRef.current);
        voiceRecordIntervalRef.current = null;
      }
      voiceRecorderRef.current = null;
      voiceRecordStartRef.current = null;
      setVoiceRecordingSec(0);
      setIsRecordingVoice(false);
      toast.error("Unable to access microphone.");
    }
  };

  const stopVoiceRecording = () => {
    const recorder = voiceRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      return;
    }
    recorder.stop();
  };

  const uploadRecordedVoice = async () => {
    if (!recordedVoiceBlob) {
      toast.error("Record voice first.");
      return;
    }

    const file = new File([recordedVoiceBlob], "recorded-voice.webm", { type: "audio/webm" });
    setLoadingCloneTask(true);
    await uploadVoiceClone(file);
    setLoadingCloneTask(false);
  };

  const downloadRecordedTrainingVideo = () => {
    if (!recordedTrainingVideoBlob) {
      toast.error("Record video first.");
      return;
    }
    downloadBlob(recordedTrainingVideoBlob, `training-video-${Date.now()}.webm`);
  };

  const downloadRecordedVoice = () => {
    if (!recordedVoiceBlob) {
      toast.error("Record voice first.");
      return;
    }
    downloadBlob(recordedVoiceBlob, `voice-sample-${Date.now()}.webm`);
  };

  const trainClone = async () => {
    if (!cloneId || !voiceCloneId) {
      toast.error("Complete photo, video, and voice steps first.");
      return;
    }

    const payload: AvatarCloneProfilePayload & { avatarCloneId: string; voiceCloneId: string } = {
      avatarCloneId: cloneId,
      voiceCloneId,
      cloneName: cloneName || "My Clone",
      language: cloneLanguage || "english",
      accent: "",
      speakingSpeed: 1,
      gender: "other" as CloneGender,
      defaultBackground: settingsBackground,
      avatarCategory: "business" as CloneCategory,
    };

    setLoadingCloneTask(true);
    setCloneWizardStep(5);
    setTrainingTimeline(["Uploading..."]);
    try {
      const response = await fetchJson<{
        timeline: string[];
        avatarClone: AvatarCloneItem;
        voiceClone: VoiceCloneItem;
      }>("/api/media/clone/train", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const timeline = response.timeline.length > 0
        ? response.timeline
        : ["Uploading...", "Processing...", "Training Face...", "Training Voice...", "Ready"];

      setTrainingTimeline([]);
      for (const line of timeline) {
        setTrainingTimeline((prev) => [...prev, line]);
        // Avoid showing all stages as complete in a single frame.
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      }

      setSelectedCloneId(response.avatarClone.id);
      setSelectedVoiceCloneId(response.voiceClone.id);
      toast.success("Clone training completed.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Training failed.");
    } finally {
      setLoadingCloneTask(false);
    }
  };

  const generateCloneVideo = async () => {
    if (!selectedCloneId || !selectedVoiceCloneId || !cloneScript.trim()) {
      toast.error("Select clone, voice clone, and script.");
      return;
    }

    if (!cloneScenePreview.length) {
      toast.error("Script is empty.");
      return;
    }

    setLoadingCloneTask(true);
    setCloneGenerateError(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 180_000);
    try {
      const resultPayload = await fetchJson<CloneGenerateResponse>("/api/media/clone/generate", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({
          avatarCloneId: selectedCloneId,
          voiceCloneId: selectedVoiceCloneId,
          script: finalCloneScript,
          scenesPerMinute: cloneScenesPerMinute,
          emotion: cloneEmotion,
          background: cloneBackground,
          music: cloneMusic,
          subtitle: cloneSubtitle,
          aspectRatio: cloneAspectRatio,
        }),
      });

      setCloneGenerateResult(resultPayload);
      toast.success("Clone video generated.");
      await refreshAll();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        const message = "Generation is taking too long. Please refresh My Clones to check job status.";
        setCloneGenerateError(message);
        toast.error(message, { duration: 10000 });
      } else {
        const message = error instanceof Error ? error.message : "Clone generation failed.";
        setCloneGenerateError(message);
        toast.error(message, { duration: 10000 });
      }
    } finally {
      window.clearTimeout(timeout);
      setLoadingCloneTask(false);
    }
  };

  const deleteClone = async (id: string) => {
    try {
      const response = await fetch(`/api/media/clone/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({ error: "Delete failed." }))) as { error?: string };
        throw new Error(body.error ?? "Delete failed.");
      }

      toast.success("Clone deleted.");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const saveSettings = () => {
    localStorage.setItem(
      "avatar-clone-settings",
      JSON.stringify({
        voice: settingsVoice,
        background: settingsBackground,
        music: settingsMusic,
        intro: settingsIntro,
        outro: settingsOutro,
        logo: settingsLogo,
      }),
    );
    toast.success("Clone defaults saved.");
  };

  return (
    <div className="space-y-4 text-slate-100">
      <section className="panel animate-float-in overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xl">◉</div>
            <div>
              <h1 className="display-font text-3xl font-semibold text-white">Avatar Studio</h1>
              <p className="text-sm text-blue-100/70">Create talking presenter jobs from scripts and voice handoff context</p>
            </div>
          </div>
          <div className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">Phase 2</div>
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-3 text-sm">
          {[
            { key: "create", label: "Create" },
            { key: "templates", label: "Templates" },
            { key: "clone-me", label: "Clone Me" },
            { key: "my-clones", label: "My Clones" },
            { key: "history", label: "History" },
            { key: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as StudioTab)}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeTab === tab.key ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto w-full max-w-xs">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search templates/history..."
              className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/60"
            />
          </div>
        </div>

        {activeTab === "create" && (
          <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <label className="block text-sm text-slate-300">Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Weekly update presenter"
                className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
              />

              <label className="block text-sm text-slate-300">Script</label>
              <textarea
                value={script}
                onChange={(event) => setScript(event.target.value)}
                rows={7}
                placeholder="Enter the full presenter script..."
                className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Avatar preset</label>
                  <select
                    value={preset}
                    onChange={(event) => setPreset(event.target.value as AvatarPreset)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60"
                  >
                    {presets.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Background</label>
                  <select
                    value={background}
                    onChange={(event) => setBackground(event.target.value as AvatarBackground)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60"
                  >
                    {backgrounds.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Language</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as AvatarLanguage)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60"
                  >
                    {languages.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-300">Aspect ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(event) => setAspectRatio(event.target.value as AvatarAspectRatio)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60"
                  >
                    {aspectRatios.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Voice audio URL (optional)</label>
                  <input
                    value={voiceAudioUrl}
                    onChange={(event) => setVoiceAudioUrl(event.target.value)}
                    placeholder="/media/audio/2026/06/24/voice.mp3"
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/20">
                      Browse MP3
                      <input
                        type="file"
                        accept=".mp3,audio/mpeg"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          void handleVoiceFileSelected(file);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {uploadingVoiceAsset && <span className="text-xs text-cyan-200/90">Uploading...</span>}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Background image URL (optional)</label>
                  <input
                    value={backgroundImageUrl}
                    onChange={(event) => setBackgroundImageUrl(event.target.value)}
                    placeholder="https://example.com/background.jpg"
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/20">
                      Browse Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          void handleBackgroundFileSelected(file);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {uploadingBackgroundAsset && <span className="text-xs text-cyan-200/90">Uploading...</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-300">Render mode</label>
                <select
                  value={renderMode}
                  onChange={(event) => setRenderMode(event.target.value as AvatarRenderMode)}
                  className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60"
                >
                  <option value="sync">Sync render (attempt MP4 now)</option>
                  <option value="queue">Queue only (worker-ready)</option>
                </select>
              </div>

              <button
                onClick={generate}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Generating..." : "Generate Avatar"}
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <h2 className="text-base font-semibold text-white">Current Output</h2>
              {!result && <p className="text-sm text-slate-400">Generate an avatar job to preview metadata and queue state.</p>}

              {result && (
                <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-slate-300">
                  <p className="font-medium text-white">{result.title}</p>
                  <p>Preset: {result.preset}</p>
                  <p>Background: {result.background}</p>
                  <p>Language: {result.language}</p>
                  <p>Aspect ratio: {result.aspectRatio}</p>
                  <p>Render mode: {result.renderMode}</p>
                  <p>Estimated duration: {result.duration ?? "N/A"}s</p>
                  <p>
                    Status:{" "}
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide ${getStatusBadgeClass(result.status)}`}
                    >
                      {result.status}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">Render engine: {result.meta.render}</p>
                  {result.outputUrl && <video controls src={result.outputUrl} className="w-full rounded-lg" />}
                </div>
              )}

              <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3 text-xs text-slate-400">
                Phase 2 adds queue-ready jobs and FFmpeg placeholder output generation. Full lip-sync and animation engines are the next milestone.
              </div>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid gap-3 px-5 pb-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left transition hover:border-cyan-400/50 hover:bg-slate-900/40"
              >
                <p className="text-sm font-semibold text-white">{template.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-cyan-300/80">{template.preset}</p>
                <p className="mt-2 text-sm text-slate-300">{template.script}</p>
              </button>
            ))}
          </div>
        )}

        {activeTab === "clone-me" && (
          <div className="space-y-4 px-5 pb-5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCloneWizardStep(step as CloneWizardStep)}
                    className={`rounded-full border px-2 py-1 ${
                      cloneWizardStep === step
                        ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-200"
                        : "border-white/20 text-slate-300"
                    }`}
                  >
                    Step {step}
                  </button>
                ))}
              </div>

              {cloneWizardStep === 1 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-slate-900/40 p-2 text-xs">
                    <span className="text-slate-300">Capture Mode:</span>
                    <button
                      onClick={() => setCloneCaptureMode("pro")}
                      className={`rounded-full border px-2 py-1 ${
                        cloneCaptureMode === "pro"
                          ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
                          : "border-white/20 text-slate-300"
                      }`}
                    >
                      Pro Quality (20-50)
                    </button>
                    <button
                      onClick={() => setCloneCaptureMode("quick")}
                      className={`rounded-full border px-2 py-1 ${
                        cloneCaptureMode === "quick"
                          ? "border-amber-300/40 bg-amber-500/10 text-amber-200"
                          : "border-white/20 text-slate-300"
                      }`}
                    >
                      Quick Preview (1-2)
                    </button>
                  </div>

                  {cloneCaptureMode === "quick" ? (
                    <div className="rounded-lg border border-amber-300/25 bg-amber-500/10 p-2 text-xs text-amber-100">
                      Quick mode is preview only. Training/upload is disabled until you switch to Pro mode and capture at least 20 photos.
                    </div>
                  ) : null}

                  <h3 className="text-sm font-semibold text-white">Step 1: Capture or Upload Photos (20-50)</h3>
                  <div className="grid gap-3 rounded-xl border border-cyan-300/25 bg-cyan-500/5 p-3 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-2">
                      <div className="relative overflow-hidden rounded-lg border border-white/15 bg-slate-950/60">
                        <video ref={cloneCameraVideoRef} autoPlay muted playsInline className="h-56 w-full object-cover" />
                        {!cameraReady ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-sm text-slate-400">
                            Start camera to capture guided photos
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => void startCloneCamera()}
                          className="rounded-lg border border-cyan-300/25 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/10"
                        >
                          Start Camera
                        </button>
                        <button
                          onClick={stopCloneCamera}
                          className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
                        >
                          Stop Camera
                        </button>
                        <button
                          onClick={() => void takeClonePhoto()}
                          disabled={!cameraReady || cameraBusy || autoCaptureEnabled}
                          className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-50"
                        >
                          {cameraBusy ? "Capturing..." : "Capture One"}
                        </button>
                        <button
                          onClick={() => void startCloneAutoCapture()}
                          disabled={autoCaptureEnabled || clonePhotos.length >= cloneAutoTarget}
                          className="rounded-lg border border-emerald-300/25 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          {autoCaptureEnabled ? `Auto Capturing... ${clonePhotos.length}/${cloneAutoTarget}` : `Auto Capture to ${cloneAutoTarget}`}
                        </button>
                        <button
                          onClick={stopCloneAutoCapture}
                          disabled={!autoCaptureEnabled}
                          className="rounded-lg border border-amber-300/25 px-3 py-2 text-xs text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
                        >
                          Stop Auto
                        </button>
                      </div>

                      <div className="rounded-lg border border-emerald-300/20 bg-emerald-500/5 p-2 text-xs text-emerald-100">
                        <div className="mb-1 flex items-center justify-between">
                          <span>Capture progress</span>
                          <span>
                            {clonePhotos.length} / {cloneAutoTarget}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded bg-slate-900/70">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${cloneCaptureProgressPercent}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300">
                          {autoCaptureEnabled
                            ? "Auto capture is running. Keep your face centered and hold still."
                            : "Start auto capture to collect photos automatically."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-white/10 bg-slate-900/40 p-3 text-xs text-slate-300">
                      <p className="font-medium text-white">Guided Prompt</p>
                      <p className="text-cyan-200">
                        Shot {Math.min(clonePhotos.length + 1, cloneAutoTarget)} of {cloneAutoTarget}:{" "}
                        {cloneCaptureGuidance[Math.min(clonePhotos.length, cloneCaptureGuidance.length - 1)]}
                      </p>
                      <p className="text-slate-400">Keep face centered, remove sunglasses/masks, and hold still during auto capture.</p>
                      <p className="text-slate-400">Auto capture skips frames that are too dark, too bright, or blurry.</p>
                      {cameraError ? <p className="text-red-200">{cameraError}</p> : null}
                    </div>
                  </div>

                  <canvas ref={cloneCameraCanvasRef} className="hidden" />

                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      onAddPhotos(event.dataTransfer.files);
                    }}
                    className="rounded-xl border border-dashed border-cyan-300/25 bg-cyan-500/5 p-4 text-center text-sm text-slate-300"
                  >
                    Drag and drop JPG/PNG photos here
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="mt-3 block w-full text-xs text-slate-300"
                      onChange={(event) => onAddPhotos(event.target.files)}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{clonePhotos.length} / {clonePhotoHardLimit} photos selected</span>
                    <span>{cloneCaptureMode === "quick" ? "Preview only" : "Minimum 20 required"}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={downloadAllClonePhotos}
                        disabled={clonePhotos.length === 0}
                        className="rounded-lg border border-emerald-300/25 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        Save All Photos Locally
                      </button>
                      <button
                        onClick={() => {
                          stopCloneAutoCapture();
                          setClonePhotos([]);
                        }}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                      >
                        Clear Selected Photos
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6">
                    {clonePhotos.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative rounded-lg border border-white/15 bg-slate-900/60 p-1">
                        <img src={clonePhotoPreviews[index]} alt={file.name} className="h-20 w-full rounded object-cover" />
                        <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1">
                          <button
                            onClick={() => downloadClonePhoto(file, index)}
                            className="rounded border border-cyan-300/30 bg-cyan-500/20 px-1.5 py-0.5 text-[10px] text-cyan-100"
                          >
                            Save Photo
                          </button>
                          <button
                            onClick={() => removePhoto(index)}
                            className="rounded border border-red-300/30 bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => void uploadClonePhotos()}
                    disabled={loadingCloneTask || cloneCaptureMode === "quick"}
                    className="rounded-lg border border-cyan-300/25 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-60"
                  >
                    {loadingCloneTask ? "Uploading..." : cloneCaptureMode === "quick" ? "Upload Disabled in Quick Mode" : "Upload Photos"}
                  </button>
                </div>
              )}

              {cloneWizardStep === 2 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Step 2: Record Training Video (Camera + Script)</h3>
                  <p className="text-xs text-slate-400">
                    Record from laptop/mobile camera while reading script. This same video is also used to auto-create the voice clone.
                  </p>

                  <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-2 rounded-lg border border-white/15 bg-slate-900/40 p-3">
                      <video
                        ref={trainingVideoPreviewRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-56 w-full rounded-lg border border-white/10 bg-slate-950/70 object-cover"
                      />

                      {recordedTrainingVideoUrl ? (
                        <video controls src={recordedTrainingVideoUrl} className="h-40 w-full rounded-lg border border-white/10 object-cover" />
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => void startTrainingVideoRecording()}
                          disabled={isRecordingTrainingVideo}
                          className="rounded-lg border border-emerald-300/25 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          Start Recording
                        </button>
                        <button
                          onClick={stopTrainingVideoRecording}
                          disabled={!isRecordingTrainingVideo}
                          className="rounded-lg border border-amber-300/25 px-3 py-2 text-xs text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
                        >
                          Stop Recording
                        </button>
                        <button
                          onClick={() => void uploadRecordedTrainingVideo()}
                          disabled={!recordedTrainingVideoBlob || loadingCloneTask}
                          className="rounded-lg border border-cyan-300/25 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-50"
                        >
                          Use Recorded Video
                        </button>
                        <button
                          onClick={downloadRecordedTrainingVideo}
                          disabled={!recordedTrainingVideoBlob}
                          className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-50"
                        >
                          Save Video Locally
                        </button>
                      </div>

                      <div className="text-xs text-slate-400">
                        {isRecordingTrainingVideo
                          ? `Recording in progress... ${formatSeconds(trainingVideoRecordingSec)} / 02:00`
                          : "Tip: keep face centered and speak naturally for 1-2 minutes."}
                      </div>

                      {recordedTrainingVideoBlob ? (
                        <p className="text-xs text-slate-300">Recorded clip duration: {formatSeconds(recordedTrainingVideoSec)}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2 rounded-lg border border-white/15 bg-slate-900/40 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Reading Script</p>
                        <div className="flex items-center gap-2">
                          <select
                            value={trainingScriptTargetMin}
                            onChange={(event) => setTrainingScriptTargetMin(Number(event.target.value))}
                            className="rounded border border-white/20 bg-slate-950/60 px-2 py-1 text-[11px] text-slate-200"
                          >
                            {[1, 2].map((min) => (
                              <option key={min} value={min}>
                                {min} min
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={generateTrainingScript}
                            className="rounded border border-white/20 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10"
                          >
                            Generate Script
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={trainingScriptText}
                        onChange={(event) => setTrainingScriptText(event.target.value)}
                        rows={14}
                        className="w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-xs text-slate-200"
                        placeholder="Script appears here for side-by-side reading..."
                      />
                      <p className="text-[11px] text-slate-400">
                        Estimated reading time: {trainingScriptEstimatedMin.toFixed(1)} min (target: {trainingScriptTargetMin} min)
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">Or upload an existing training video:</p>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,.mp4,.webm"
                    className="block w-full text-sm text-slate-200"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadTrainingVideo(file);
                      }
                    }}
                  />
                  {cloneVideoMeta ? (
                    <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3 text-sm text-slate-300">
                      <p>Duration: {(cloneVideoMeta.durationSec / 60).toFixed(2)} min</p>
                      <p>Resolution: {cloneVideoMeta.width} x {cloneVideoMeta.height}</p>
                      <p>FPS: {cloneVideoMeta.fps.toFixed(2)}</p>
                      <p className="mt-1 text-xs text-slate-400">Recommended: 1-2 minutes</p>
                    </div>
                  ) : null}
                </div>
              )}

              {cloneWizardStep === 3 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Step 3: Voice Clone (Fallback or Optional Override)</h3>
                  <p className="text-xs text-slate-400">
                    Step 2 usually auto-creates voice from video. Use Step 3 if that fails, or use it anytime to manually replace voice.
                  </p>
                  {requiresManualVoiceStep ? (
                    <p className="text-xs text-amber-200">Auto voice extraction failed in Step 2. Please complete Step 3 manually.</p>
                  ) : (
                    <p className="text-xs text-cyan-200">Auto voice extraction already succeeded. Step 3 is optional.</p>
                  )}

                  <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Reading Script</p>
                      <div className="flex items-center gap-2 text-xs">
                        <label className="text-slate-400" htmlFor="voice-script-duration-select">Target</label>
                        <select
                          id="voice-script-duration-select"
                          value={trainingScriptTargetMin}
                          onChange={(event) => setTrainingScriptTargetMin(Number(event.target.value))}
                          className="rounded-md border border-white/20 bg-slate-950/80 px-2 py-1 text-slate-200"
                        >
                          {[1, 2].map((minutes) => (
                            <option key={minutes} value={minutes}>
                              {minutes} min
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={generateTrainingScript}
                          className="rounded-md border border-cyan-300/25 px-2 py-1 text-cyan-200 hover:bg-cyan-500/10"
                        >
                          Generate Script
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={trainingScriptText}
                      onChange={(event) => setTrainingScriptText(event.target.value)}
                      rows={8}
                      className="w-full rounded-lg border border-white/15 bg-slate-950/80 p-2 text-xs text-slate-100"
                      placeholder="Script appears here for voice fallback reading..."
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Estimated reading time: {trainingScriptEstimatedMin.toFixed(1)} min (target: {trainingScriptTargetMin} min)
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="audio/wav,audio/x-wav,audio/mpeg,video/mp4,video/webm,.wav,.mp3,.mp4,.webm"
                    className="block w-full text-sm text-slate-200"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setLoadingCloneTask(true);
                        void uploadVoiceClone(file).finally(() => setLoadingCloneTask(false));
                      }
                    }}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => void startVoiceRecording()}
                      disabled={isRecordingVoice}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
                    >
                      {isRecordingVoice ? `Recording... ${formatSeconds(voiceRecordingSec)} / 02:00` : "Record Microphone (up to 2 min)"}
                    </button>
                    <button
                      onClick={stopVoiceRecording}
                      disabled={!isRecordingVoice}
                      className="rounded-lg border border-amber-300/25 px-3 py-2 text-xs text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
                    >
                      Stop Recording
                    </button>
                    <button
                      onClick={() => void uploadRecordedVoice()}
                      className="rounded-lg border border-cyan-300/25 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/10"
                    >
                      Upload Recorded Clip
                    </button>
                    <button
                      onClick={downloadRecordedVoice}
                      disabled={!recordedVoiceBlob}
                      className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-50"
                    >
                      Save Audio Locally
                    </button>
                  </div>

                  {voicePreviewUrl ? (
                    <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3 text-sm text-slate-300">
                      <audio controls src={voicePreviewUrl} className="w-full" />
                      {recordedVoiceBlob ? <p className="mt-2 text-xs text-slate-300">Recorded clip duration: {formatSeconds(recordedVoiceSec)}</p> : null}
                      <p className="mt-2 text-xs text-slate-400">Uploaded duration: {(voiceDurationSec / 60).toFixed(2)} min</p>
                      <p className="mt-1 text-xs text-slate-400">Recommended voice sample duration: 1-2 minutes</p>
                    </div>
                  ) : null}
                </div>
              )}

              {cloneWizardStep === 4 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-slate-300">Clone Name</label>
                    <input
                      value={cloneName}
                      onChange={(event) => setCloneName(event.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-300">Language</label>
                    <input
                      value={cloneLanguage}
                      onChange={(event) => setCloneLanguage(event.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => void trainClone()}
                      disabled={loadingCloneTask}
                      className="rounded-lg border border-cyan-300/25 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-60"
                    >
                      {loadingCloneTask ? "Training..." : "Start Training"}
                    </button>
                  </div>
                </div>
              )}

              {cloneWizardStep === 5 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Step 5: Training Status</h3>
                  <div className="rounded-lg border border-cyan-300/20 bg-cyan-500/5 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-cyan-100">
                      <span>Stage Progress</span>
                      <span>{trainingStagePercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-slate-900/70">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${trainingStagePercent}%` }}
                      />
                    </div>
                    <div className="mt-2 grid gap-1 text-[11px] text-slate-300 sm:grid-cols-5">
                      {trainingStatusStages.map((stage, index) => {
                        const completed = index <= activeTrainingStageIndex;
                        return (
                          <div
                            key={stage.label}
                            className={`rounded border px-2 py-1 text-center ${
                              completed
                                ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-100"
                                : "border-white/15 bg-slate-900/50 text-slate-400"
                            }`}
                          >
                            {stage.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3 text-sm text-slate-300">
                    {trainingTimeline.length === 0 ? <p>No training timeline yet.</p> : null}
                    {trainingTimeline.map((line) => (
                      <p key={line} className="mb-1">{line}</p>
                    ))}
                  </div>

                  <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3 text-sm">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Detailed Action Checklist</p>
                    <div className="space-y-1">
                      {trainingActionChecklist.map((item, index) => {
                        const isTrainingComplete = activeTrainingStageIndex >= trainingStatusStages.length - 1;
                        const done = index < activeChecklistIndex || (isTrainingComplete && index === activeChecklistIndex);
                        const inProgress = index === activeChecklistIndex && activeTrainingStageIndex < trainingStatusStages.length - 1;
                        return (
                          <div
                            key={item.label}
                            className={`flex items-center justify-between rounded border px-2 py-1 text-xs ${
                              done
                                ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                                : inProgress
                                  ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                                  : "border-white/10 bg-slate-900/40 text-slate-400"
                            }`}
                          >
                            <span>{item.label}</span>
                            <span>{done ? "Done" : inProgress ? "In Progress" : "Pending"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white">Generate Clone Video</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={selectedCloneId}
                      onChange={(event) => setSelectedCloneId(event.target.value)}
                      className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm"
                    >
                      <option value="">Select Clone</option>
                      {clones
                        .filter((item) => item.status === "READY")
                        .map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <select
                      value={selectedVoiceCloneId}
                      onChange={(event) => setSelectedVoiceCloneId(event.target.value)}
                      className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm"
                    >
                      <option value="">Select Voice Clone</option>
                      {voiceClones
                        .filter((item) => item.status === "READY")
                        .map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                  </div>

                  <textarea
                    value={cloneScript}
                    onChange={(event) => setCloneScript(event.target.value)}
                    rows={5}
                    placeholder="Write script for generated presenter video..."
                    className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm"
                  />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <select value={cloneEmotion} onChange={(event) => setCloneEmotion(event.target.value as CloneEmotion)} className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                      {(["professional", "friendly", "happy", "serious", "excited", "confident", "calm"] as const).map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <select value={cloneBackground} onChange={(event) => setCloneBackground(event.target.value as CloneBackground)} className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                      {(["office", "studio", "conference-room", "home-office", "classroom", "ai-generated", "green-screen"] as const).map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <select value={cloneAspectRatio} onChange={(event) => setCloneAspectRatio(event.target.value as "16:9" | "9:16" | "1:1")} className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                      <option value="16:9">Landscape</option>
                      <option value="9:16">Portrait</option>
                      <option value="1:1">Square</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select value={cloneMusic} onChange={(event) => setCloneMusic(event.target.value as "none" | "corporate" | "motivational" | "ambient" | "upbeat")} className="rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                      <option value="none">No music</option>
                      <option value="corporate">Corporate</option>
                      <option value="motivational">Motivational</option>
                      <option value="ambient">Ambient</option>
                      <option value="upbeat">Upbeat</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={cloneSubtitle} onChange={(event) => setCloneSubtitle(event.target.checked)} />
                      Subtitle
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      Scenes/Min
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={cloneScenesPerMinute}
                        onChange={(event) => setCloneScenesPerMinute(Math.min(12, Math.max(1, Number(event.target.value) || 1)))}
                        className="w-20 rounded border border-white/20 bg-slate-900/60 px-2 py-1 text-sm"
                      />
                    </label>
                  </div>

                  <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3 text-xs text-slate-200">
                    <p className="mb-2 font-semibold text-slate-100">Scene Plan ({cloneScenePreview.length} scenes)</p>
                    <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                      {cloneScenePreview.map((sceneText, index) => (
                        <div key={`scene-${index + 1}`} className="rounded border border-white/10 bg-slate-950/40 p-2">
                          <p className="mb-1 text-[11px] font-semibold text-cyan-200">Scene {index + 1}</p>
                          <p className="text-slate-300">{sceneText}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => void generateCloneVideo()}
                    disabled={loadingCloneTask}
                    className="rounded-lg border border-emerald-300/25 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-60"
                  >
                    {loadingCloneTask ? "Generating..." : "Generate Video"}
                  </button>

                  {cloneGenerateError ? (
                    <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-xs text-red-100">
                      <p className="mb-2 font-semibold">Last Generate Error</p>
                      <p className="break-words text-red-100/90">{cloneGenerateError}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cloneGenerateError);
                            toast.success("Error copied");
                          }}
                          className="rounded border border-red-300/40 px-2 py-1 hover:bg-red-500/20"
                        >
                          Copy Error
                        </button>
                        <button
                          onClick={() => setCloneGenerateError(null)}
                          className="rounded border border-red-300/40 px-2 py-1 hover:bg-red-500/20"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {cloneGenerateResult?.outputVideo ? (
                    <div className="rounded-lg border border-white/15 bg-slate-900/50 p-3">
                      <video controls src={cloneGenerateResult.outputVideo} className="w-full rounded-lg" />
                      <p className="mt-2 text-xs text-slate-300">
                        Generated with {cloneGenerateResult.meta.sceneCount} scenes at {cloneGenerateResult.meta.scenesPerMinute} scenes/min.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                        <a href={cloneGenerateResult.outputVideo} target="_blank" rel="noreferrer" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">Download</a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cloneGenerateResult.outputVideo || "");
                            toast.success("Video URL copied");
                          }}
                          className="rounded border border-white/20 px-2 py-1 hover:bg-white/10"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-clones" && (
          <div className="space-y-3 px-5 pb-5">
            {filteredClones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/20 bg-slate-950/20 p-6 text-center text-sm text-slate-400">
                No clones yet.
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredClones.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  {(() => {
                    const latestProject = latestProjectByAvatarId.get(item.id);
                    const linkedVoice = latestProject ? voiceCloneById.get(latestProject.voiceCloneId) : null;
                    const linkedVoiceAudio = linkedVoice?.audioUrls?.[0] ?? null;

                    return (
                      <>
                  {item.previewImage ? (
                    <img src={item.previewImage} alt={item.name} className="h-32 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/20 text-sm text-slate-500">
                      No preview
                    </div>
                  )}
                  <p className="mt-3 text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.language}</p>
                  <p className="text-xs text-slate-400">{format(new Date(item.createdAt), "PP")}</p>
                  <p className="mt-1 text-xs text-cyan-200">{item.status}</p>

                  <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-slate-900/35 p-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Training Video</p>
                    {item.trainingVideo ? (
                      <video controls src={item.trainingVideo} className="w-full rounded-lg" />
                    ) : (
                      <p className="text-xs text-slate-500">No training video uploaded yet.</p>
                    )}
                  </div>

                  <div className="mt-2 space-y-2 rounded-lg border border-white/10 bg-slate-900/35 p-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Voice Sample</p>
                    {linkedVoiceAudio ? (
                      <audio controls src={linkedVoiceAudio} className="w-full" />
                    ) : (
                      <p className="text-xs text-slate-500">No linked voice sample found yet.</p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab("clone-me");
                        setCloneWizardStep(5);
                        setSelectedCloneId(item.id);
                      }}
                      className="rounded border border-emerald-300/25 px-2 py-1 text-emerald-200 hover:bg-emerald-500/10"
                    >
                      Generate Video
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("clone-me");
                        setCloneWizardStep(4);
                        setCloneId(item.id);
                        setCloneName(item.name);
                        setCloneLanguage(item.language);
                      }}
                      className="rounded border border-white/20 px-2 py-1 text-slate-200 hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void deleteClone(item.id)}
                      className="rounded border border-red-300/25 px-2 py-1 text-red-200 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>

            {cloneProjects.length > 0 ? (
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Recent Clone Projects</p>
                <div className="space-y-2 text-sm text-slate-300">
                  {cloneProjects.slice(0, 6).map((project) => (
                    <div key={project.id} className="rounded-lg border border-white/10 p-2">
                      <p className="line-clamp-2">{project.script}</p>
                      <p className="mt-1 text-xs text-slate-400">{project.status} - {format(new Date(project.createdAt), "PPpp")}</p>
                      {project.outputVideo ? <a href={project.outputVideo} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-cyan-200 hover:underline">Open MP4</a> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3 px-5 pb-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-400">Total avatars</p>
                <p className="text-2xl font-semibold text-white">{stats.totalAvatarsGenerated}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-400">Most used preset</p>
                <p className="text-2xl font-semibold text-white">{stats.mostUsedPreset}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs text-slate-400">Last 7 days</p>
                <p className="text-2xl font-semibold text-white">{stats.recentAvatars}</p>
              </div>
            </div>

            {presetDistribution.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm text-slate-300">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Preset Distribution</p>
                <div className="flex flex-wrap gap-2">
                  {presetDistribution.map((row) => (
                    <span key={row.name} className="rounded-full border border-white/15 px-2 py-1 text-xs">
                      {row.name}: {row.count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {filteredHistory.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/20 bg-slate-950/20 p-6 text-center text-sm text-slate-400">
                No avatar jobs yet.
              </div>
            )}

            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-cyan-300/80">{item.preset}</p>
                  <p className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${getStatusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-3">{item.script}</p>
                  <p className="mt-2 text-xs text-slate-500">{format(new Date(item.createdAt), "PPpp")}</p>
                </div>

                <div className="flex items-start gap-2">
                  <button
                    onClick={() => void enqueueItem(item.id)}
                    disabled={item.status === "PROCESSING"}
                    className="rounded-lg border border-cyan-300/25 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Enqueue
                  </button>
                  <button
                    onClick={() => void processItem(item.id)}
                    disabled={item.status === "PROCESSING"}
                    className="rounded-lg border border-emerald-300/25 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Process
                  </button>
                  <button
                    onClick={() => loadFromHistory(item)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => void removeItem(item.id)}
                    className="rounded-lg border border-red-300/25 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-3 px-5 pb-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-300">Default Voice</label>
                <select value={settingsVoice} onChange={(event) => setSettingsVoice(event.target.value as VoiceType)} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                  {(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer"] as const).map((voice) => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Default Background</label>
                <select value={settingsBackground} onChange={(event) => setSettingsBackground(event.target.value as CloneBackground)} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                  {(["office", "studio", "conference-room", "home-office", "classroom", "ai-generated", "green-screen"] as const).map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Default Music</label>
              <select value={settingsMusic} onChange={(event) => setSettingsMusic(event.target.value as "none" | "corporate" | "motivational" | "ambient" | "upbeat")} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm">
                <option value="none">None</option>
                <option value="corporate">Corporate</option>
                <option value="motivational">Motivational</option>
                <option value="ambient">Ambient</option>
                <option value="upbeat">Upbeat</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Default Intro</label>
              <textarea value={settingsIntro} onChange={(event) => setSettingsIntro(event.target.value)} rows={2} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Default Outro</label>
              <textarea value={settingsOutro} onChange={(event) => setSettingsOutro(event.target.value)} rows={2} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Default Logo URL</label>
              <input value={settingsLogo} onChange={(event) => setSettingsLogo(event.target.value)} className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-3 py-2 text-sm" />
            </div>

            <button onClick={saveSettings} className="rounded-lg border border-cyan-300/25 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10">
              Save Settings
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
