export type StudioType =
  | "voice"
  | "script"
  | "presentation"
  | "podcast"
  | "subtitle"
  | "video"
  | "background-music"
  | "avatar";

export type MessageRole = "user" | "assistant" | "system";

export type MessageType =
  | "user"
  | "assistant"
  | "system"
  | "generation-status"
  | "audio-output"
  | "video-output"
  | "image-output"
  | "presentation-output"
  | "podcast-output"
  | "subtitle-output";

export type GenerationPhase = "thinking" | "generating" | "uploading" | "rendering" | "completed";

export type ChatAsset = {
  label: string;
  url: string;
  kind: "audio" | "video" | "image" | "file";
};

export type ChatMessageModel = {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  createdAt: string;
  phase?: GenerationPhase;
  asset?: ChatAsset;
};

export type ConversationModel = {
  id: string;
  title: string;
  studio: StudioType;
  favorite: boolean;
  updatedAt: string;
  messages: ChatMessageModel[];
};
