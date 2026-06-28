export const voiceList = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer"] as const;

export type VoiceType = (typeof voiceList)[number];

export type GenerationStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type AIProvider = "openai" | "ollama" | "fallback";

export interface AIGenerationMeta {
  provider: AIProvider;
  model: string;
}

export interface GenerateVoicePayload {
  title?: string;
  inputText: string;
  voice: VoiceType;
  speed: number;
}

export interface VoiceHistoryItem {
  id: string;
  title: string;
  voice: VoiceType;
  duration: number | null;
  outputUrl: string | null;
  status: GenerationStatus;
  createdAt: string;
}

export interface VoiceStatistics {
  totalAudioGenerated: number;
  totalMinutesGenerated: number;
  mostUsedVoice: string;
  recentFiles: number;
}

export const scriptGoalList = ["social", "ad", "youtube", "email", "sales"] as const;
export const scriptToneList = ["professional", "friendly", "bold", "educational", "storytelling"] as const;
export const scriptLengthList = ["short", "medium", "long"] as const;

export type ScriptGoal = (typeof scriptGoalList)[number];
export type ScriptTone = (typeof scriptToneList)[number];
export type ScriptLength = (typeof scriptLengthList)[number];

export interface GenerateScriptPayload {
  title?: string;
  goal: ScriptGoal;
  tone: ScriptTone;
  length: ScriptLength;
  audience: string;
  prompt: string;
  callToAction?: string;
}

export interface ScriptHistoryItem {
  id: string;
  title: string;
  goal: ScriptGoal;
  tone: ScriptTone;
  length: ScriptLength;
  audience: string;
  prompt: string;
  outputText: string;
  callToAction: string | null;
  isFavorite: boolean;
  status: GenerationStatus;
  createdAt: string;
}

export interface ScriptGenerateResponse {
  id: string;
  title: string;
  prompt: string;
  script: string;
  outputText: string;
  generatedAt: string;
  createdAt: string;
  status: GenerationStatus | "COMPLETED";
  isFavorite: boolean;
  meta: {
    goal: ScriptGoal;
    tone: ScriptTone;
    length: ScriptLength;
    audience: string;
    callToAction: string | null;
    ai: AIGenerationMeta;
  };
}

export interface ScriptStatistics {
  totalScriptsGenerated: number;
  mostUsedGoal: string;
  recentScripts: number;
}

export const podcastFormatList = ["interview", "solo", "panel", "storytelling"] as const;
export const podcastToneList = ["professional", "conversational", "energetic", "educational"] as const;
export const podcastLengthList = ["short", "medium", "long"] as const;

export type PodcastFormat = (typeof podcastFormatList)[number];
export type PodcastTone = (typeof podcastToneList)[number];
export type PodcastLength = (typeof podcastLengthList)[number];

export interface GeneratePodcastPayload {
  title?: string;
  topic: string;
  audience: string;
  format: PodcastFormat;
  tone: PodcastTone;
  length: PodcastLength;
  hosts?: string;
  outline?: string;
  prompt: string;
  synthesizeAudio?: boolean;
}

export interface PodcastSegment {
  speaker: string;
  voice: VoiceType;
  text: string;
  outputUrl: string | null;
  duration: number;
}

export interface PodcastHistoryItem {
  id: string;
  title: string;
  topic: string;
  audience: string;
  format: PodcastFormat;
  tone: PodcastTone;
  length: PodcastLength;
  hosts: string[];
  outline: string;
  prompt: string;
  script: string;
  outputUrl: string | null;
  duration: number | null;
  segmentCount: number;
  segments: PodcastSegment[];
  isFavorite: boolean;
  status: GenerationStatus;
  createdAt: string;
}

export interface PodcastGenerateResponse {
  id: string;
  title: string;
  topic: string;
  audience: string;
  format: PodcastFormat;
  tone: PodcastTone;
  length: PodcastLength;
  hosts: string[];
  outline: string;
  prompt: string;
  script: string;
  outputUrl: string | null;
  duration: number | null;
  segmentCount: number;
  segments: PodcastSegment[];
  isFavorite: boolean;
  status: GenerationStatus | "COMPLETED";
  createdAt: string;
  generatedAt: string;
  ai: AIGenerationMeta;
}

export interface PodcastStatistics {
  totalEpisodesGenerated: number;
  mostUsedFormat: string;
  recentEpisodes: number;
}

export const presentationGoalList = ["pitch", "training", "webinar", "sales", "report"] as const;
export const presentationToneList = ["professional", "persuasive", "educational", "storytelling"] as const;
export const presentationLengthList = ["short", "medium", "long"] as const;

export type PresentationGoal = (typeof presentationGoalList)[number];
export type PresentationTone = (typeof presentationToneList)[number];
export type PresentationLength = (typeof presentationLengthList)[number];

export interface GeneratePresentationPayload {
  title?: string;
  goal: PresentationGoal;
  tone: PresentationTone;
  length: PresentationLength;
  audience: string;
  topic: string;
  prompt: string;
  includeSpeakerNotes?: boolean;
  visualStyle?: string;
  imagePrompt?: string;
  subtitleSourceLanguage?: string;
  subtitleTargetLanguages?: string[];
  voiceoverVoice?: VoiceType;
  voiceoverSpeed?: number;
}

export interface PresentationImageItem {
  id: string;
  url: string;
  prompt: string;
}

export interface PresentationSubtitleCue {
  startSec: number;
  endSec: number;
  text: string;
}

export interface PresentationVoiceoverMeta {
  voice: VoiceType;
  speed: number;
  outputUrl: string | null;
  durationSec: number;
  trimStartSec: number;
  trimEndSec: number;
  trimmedDurationSec: number;
}

export interface PresentationComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PresentationVersion {
  id: string;
  versionNumber: number;
  note: string | null;
  snapshotText: string;
  createdAt: string;
}

export interface PresentationHistoryItem {
  id: string;
  title: string;
  goal: PresentationGoal;
  tone: PresentationTone;
  length: PresentationLength;
  audience: string;
  topic: string;
  prompt: string;
  outputText: string;
  slideCount: number;
  includeSpeakerNotes: boolean;
  visualStyle: string | null;
  imagePrompt: string | null;
  images: PresentationImageItem[];
  subtitleSourceLanguage: string | null;
  subtitleTargetLanguages: string[];
  subtitleCues: PresentationSubtitleCue[];
  subtitleTranslations: Record<string, string[]>;
  voiceoverText: string | null;
  voiceover: PresentationVoiceoverMeta | null;
  isFavorite: boolean;
  status: GenerationStatus;
  createdAt: string;
}

export interface PresentationGenerateResponse {
  id: string;
  title: string;
  outputText: string;
  slideCount: number;
  includeSpeakerNotes: boolean;
  visualStyle: string | null;
  imagePrompt: string | null;
  images: PresentationImageItem[];
  subtitleSourceLanguage: string | null;
  subtitleTargetLanguages: string[];
  subtitleCues: PresentationSubtitleCue[];
  subtitleTranslations: Record<string, string[]>;
  voiceoverText: string | null;
  voiceover: PresentationVoiceoverMeta | null;
  isFavorite: boolean;
  status: GenerationStatus | "COMPLETED";
  createdAt: string;
  generatedAt: string;
  meta: {
    goal: PresentationGoal;
    tone: PresentationTone;
    length: PresentationLength;
    audience: string;
    topic: string;
    ai: AIGenerationMeta;
  };
}

export interface PresentationStatistics {
  totalDecksGenerated: number;
  mostUsedGoal: string;
  recentDecks: number;
}

export const subtitleFormatList = ["srt", "vtt", "captions"] as const;
export const subtitleToneList = ["verbatim", "readable", "engaging"] as const;

export type SubtitleFormat = (typeof subtitleFormatList)[number];
export type SubtitleTone = (typeof subtitleToneList)[number];

export interface GenerateSubtitlePayload {
  title?: string;
  topic: string;
  language: string;
  format: SubtitleFormat;
  tone: SubtitleTone;
  sourceText: string;
  includeTimestamps?: boolean;
}

export interface SubtitleHistoryItem {
  id: string;
  title: string;
  topic: string;
  language: string;
  format: SubtitleFormat;
  tone: SubtitleTone;
  sourceText: string;
  outputText: string;
  cueCount: number;
  includeTimestamps: boolean;
  isFavorite: boolean;
  status: GenerationStatus;
  createdAt: string;
}

export interface SubtitleGenerateResponse {
  id: string;
  title: string;
  outputText: string;
  cueCount: number;
  includeTimestamps: boolean;
  isFavorite: boolean;
  status: GenerationStatus | "COMPLETED";
  createdAt: string;
  generatedAt: string;
  meta: {
    topic: string;
    language: string;
    format: SubtitleFormat;
    tone: SubtitleTone;
    ai: AIGenerationMeta;
  };
}

export interface SubtitleStatistics {
  totalSubtitlesGenerated: number;
  mostUsedFormat: string;
  recentSubtitles: number;
}

export const videoStyleList = ["cinematic", "social", "explainer", "product"] as const;
export const videoAspectRatioList = ["16:9", "9:16", "1:1"] as const;

export type VideoStyle = (typeof videoStyleList)[number];
export type VideoAspectRatio = (typeof videoAspectRatioList)[number];

export type VideoMusicTrack = "none" | "corporate" | "motivational" | "ambient" | "upbeat" | "uploaded";
export type VideoTransition = "cut" | "fade" | "crossfade" | "slideleft" | "slideright" | "zoomin" | "zoomout" | "flash";

export interface VideoSceneItem {
  sceneNumber: number;
  duration: number;
  caption: string;
  voiceover: string;
  image: string;
  transition: VideoTransition;
  voiceVolume?: number;
  musicVolume?: number;
}

export interface RenderVideoPayload {
  videoId?: string;
  scenes: VideoSceneItem[];
  aspectRatio: VideoAspectRatio;
  quality: "1080p" | "720p";
  voice: VoiceType;
  speed: number;
  speechLeadInSec?: number;
  speechTailSec?: number;
  includeSubtitles: boolean;
  musicTrack: VideoMusicTrack;
  uploadedMusicUrl?: string;
  voiceVolume: number;
  musicVolume: number;
}

export interface GenerateVideoPayload {
  title?: string;
  topic: string;
  audience: string;
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
  prompt: string;
  includeVoiceover?: boolean;
}

export interface VideoHistoryItem {
  id: string;
  title: string;
  topic: string;
  audience: string;
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
  prompt: string;
  outputText: string;
  sceneCount: number;
  includeVoiceover: boolean;
  outputUrl: string | null;
  isFavorite: boolean;
  status: GenerationStatus;
  createdAt: string;
}

export interface VideoGenerateResponse {
  id: string;
  title: string;
  outputText: string;
  sceneCount: number;
  includeVoiceover: boolean;
  outputUrl: string | null;
  isFavorite: boolean;
  status: GenerationStatus | "COMPLETED";
  createdAt: string;
  generatedAt: string;
  meta: {
    topic: string;
    audience: string;
    style: VideoStyle;
    aspectRatio: VideoAspectRatio;
    durationSec: number;
    ai: AIGenerationMeta;
  };
}

export type OnePagerPlatform = "linkedin" | "facebook";
export type OnePagerContentLength = "short" | "medium" | "long";
export type OnePagerSizePreset =
  | "linkedin-square"
  | "linkedin-landscape"
  | "facebook-square"
  | "facebook-landscape"
  | "facebook-story";

export interface OnePagerSection {
  heading: string;
  text: string;
}

export interface OnePagerGenerateResponse {
  title: string;
  subtitle: string;
  intro: string;
  sections: OnePagerSection[];
  benefits: string[];
  ctaLabel: string;
  ctaText: string;
  imagePrompt: string;
  platform: OnePagerPlatform;
  contentLength: OnePagerContentLength;
  sizePreset: OnePagerSizePreset;
  imageUrl: string | null;
  generatedAt: string;
  ai: AIGenerationMeta;
}

export interface PresentationSubtitleTranslationResponse {
  transcript: string;
  sourceLanguage: string;
  cues: PresentationSubtitleCue[];
  translations: Record<string, string[]>;
  ai: AIGenerationMeta | null;
}

export interface VideoStatistics {
  totalVideosGenerated: number;
  mostUsedStyle: string;
  recentVideos: number;
}

export const backgroundMusicCategoryList = [
  "corporate",
  "motivational",
  "ambient",
  "podcast",
  "cinematic",
  "technology",
  "happy",
] as const;

export const backgroundMusicOutputFormatList = ["mp3"] as const;

export type BackgroundMusicCategory = (typeof backgroundMusicCategoryList)[number];
export type BackgroundMusicOutputFormat = (typeof backgroundMusicOutputFormatList)[number];

export interface GenerateBackgroundMusicPayload {
  title?: string;
  prompt: string;
  category: BackgroundMusicCategory;
  voiceAudioUrl?: string;
  musicVolume: number;
  voiceVolume: number;
  fadeInSec?: number;
  fadeOutSec?: number;
  loopMusic?: boolean;
  outputFormat?: BackgroundMusicOutputFormat;
}

export interface BackgroundMusicHistoryItem {
  id: string;
  title: string;
  prompt: string;
  category: BackgroundMusicCategory;
  voiceAudioUrl: string | null;
  outputUrl: string | null;
  duration: number | null;
  musicVolume: number;
  voiceVolume: number;
  fadeInSec: number;
  fadeOutSec: number;
  loopMusic: boolean;
  outputFormat: BackgroundMusicOutputFormat;
  status: GenerationStatus;
  createdAt: string;
}

export interface BackgroundMusicStatistics {
  totalTracksGenerated: number;
  mostUsedCategory: string;
  recentTracks: number;
}

export const avatarPresetList = ["business-male", "business-female", "teacher", "trainer", "support"] as const;
export const avatarBackgroundList = ["office", "studio", "classroom", "home"] as const;
export const avatarLanguageList = ["english", "tamil", "hindi", "spanish"] as const;
export const avatarAspectRatioList = ["16:9", "9:16"] as const;
export const avatarRenderModeList = ["queue", "sync"] as const;

export type AvatarPreset = (typeof avatarPresetList)[number];
export type AvatarBackground = (typeof avatarBackgroundList)[number];
export type AvatarLanguage = (typeof avatarLanguageList)[number];
export type AvatarAspectRatio = (typeof avatarAspectRatioList)[number];
export type AvatarRenderMode = (typeof avatarRenderModeList)[number];

export const cloneStatusList = ["UPLOADING", "PENDING", "PROCESSING", "TRAINING", "READY", "FAILED"] as const;
export const cloneCategoryList = ["business", "teacher", "trainer", "support", "influencer"] as const;
export const cloneGenderList = ["male", "female", "other"] as const;
export const cloneEmotionList = ["professional", "friendly", "happy", "serious", "excited", "confident", "calm"] as const;
export const cloneBackgroundList = [
  "office",
  "studio",
  "conference-room",
  "home-office",
  "classroom",
  "ai-generated",
  "green-screen",
] as const;

export type CloneStatus = (typeof cloneStatusList)[number];
export type CloneCategory = (typeof cloneCategoryList)[number];
export type CloneGender = (typeof cloneGenderList)[number];
export type CloneEmotion = (typeof cloneEmotionList)[number];
export type CloneBackground = (typeof cloneBackgroundList)[number];

export interface GenerateAvatarPayload {
  title?: string;
  script: string;
  preset: AvatarPreset;
  background: AvatarBackground;
  language: AvatarLanguage;
  aspectRatio: AvatarAspectRatio;
  voiceAudioUrl?: string;
  backgroundImageUrl?: string;
  renderMode?: AvatarRenderMode;
}

export interface AvatarHistoryItem {
  id: string;
  title: string;
  script: string;
  preset: AvatarPreset;
  background: AvatarBackground;
  language: AvatarLanguage;
  aspectRatio: AvatarAspectRatio;
  voiceAudioUrl: string | null;
  backgroundImageUrl: string | null;
  renderMode: AvatarRenderMode;
  outputUrl: string | null;
  duration: number | null;
  status: GenerationStatus;
  createdAt: string;
}

export interface AvatarStatistics {
  totalAvatarsGenerated: number;
  mostUsedPreset: string;
  recentAvatars: number;
}

export interface AvatarCloneProfilePayload {
  cloneName: string;
  language: string;
  accent?: string;
  speakingSpeed: number;
  gender: CloneGender;
  defaultBackground: CloneBackground;
  avatarCategory: CloneCategory;
}

export interface AvatarCloneItem {
  id: string;
  userId: string;
  name: string;
  status: CloneStatus;
  photoUrls: string[];
  photoCount: number;
  trainingVideo: string | null;
  previewImage: string | null;
  language: string;
  accent: string | null;
  speakingSpeed: number | null;
  gender: CloneGender | null;
  defaultBackground: CloneBackground | null;
  avatarCategory: CloneCategory | null;
  avatarModelPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceCloneItem {
  id: string;
  userId: string;
  name: string;
  status: CloneStatus;
  audioUrls: string[];
  duration: number;
  language: string;
  voiceModelPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CloneProjectItem {
  id: string;
  userId: string;
  avatarCloneId: string;
  voiceCloneId: string;
  script: string;
  background: string | null;
  music: string | null;
  subtitle: boolean;
  outputVideo: string | null;
  status: CloneStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CloneHistoryResponse {
  clones: AvatarCloneItem[];
  voiceClones: VoiceCloneItem[];
  projects: CloneProjectItem[];
}
