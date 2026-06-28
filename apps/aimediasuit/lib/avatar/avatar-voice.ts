import { VoiceProviderFactory } from "@/lib/providers/voice-provider-factory";
import { saveAudioFile } from "@/lib/storage/audio-storage";
import type { VoiceType } from "@/types/media";

type ResolveAvatarVoiceInput = {
  script: string;
  voiceAudioUrl: string;
  voice?: VoiceType;
  speed?: number;
};

export async function resolveAvatarVoiceAudioUrl(input: ResolveAvatarVoiceInput) {
  const trimmedVoiceAudioUrl = input.voiceAudioUrl.trim();
  if (trimmedVoiceAudioUrl) {
    return trimmedVoiceAudioUrl;
  }

  const provider = VoiceProviderFactory.resolve();
  const mp3Bytes = await provider.generateSpeechMp3(input.script, input.voice ?? "alloy", input.speed ?? 1);
  const saved = await saveAudioFile(mp3Bytes);
  return saved.urlPath;
}