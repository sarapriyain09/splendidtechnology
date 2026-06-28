export type AiMediaStudio = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
};

export const aiMediaStudios: AiMediaStudio[] = [
  {
    slug: "voice-studio",
    title: "Voice Studio",
    description: "Generate natural AI voiceovers in multiple tones and languages for your content.",
    icon: "🎙️",
  },
  {
    slug: "script-studio",
    title: "Script Studio",
    description: "Create polished scripts for videos, podcasts, product demos, and social campaigns.",
    icon: "✍️",
  },
  {
    slug: "presentation-studio",
    title: "Presentation Studio",
    description: "Build presentation outlines and slide-ready narrative structures in minutes.",
    icon: "📊",
  },
  {
    slug: "podcast-studio",
    title: "Podcast Studio",
    description: "Plan episodes, generate show formats, and prepare AI-assisted podcast workflows.",
    icon: "🎧",
  },
  {
    slug: "subtitle-studio",
    title: "Subtitle Studio",
    description: "Create timed captions and multilingual subtitles to improve accessibility and reach.",
    icon: "💬",
  },
  {
    slug: "video-studio",
    title: "Video Studio",
    description: "Turn scripts into branded video drafts with scene suggestions and AI editing support.",
    icon: "🎬",
  },
  {
    slug: "background-music-studio",
    title: "Background Music Studio",
    description: "Generate royalty-safe background music tailored to your campaign mood and format.",
    icon: "🎵",
  },
  {
    slug: "avatar-studio",
    title: "Avatar Studio",
    description: "Create AI avatars for explainers, sales messages, onboarding, and support content.",
    icon: "🧑‍💻",
  },
];

export function getAiMediaStudioBySlug(slug: string) {
  return aiMediaStudios.find((studio) => studio.slug === slug);
}
