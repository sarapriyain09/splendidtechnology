"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AIChatLayout } from "@/components/ai-chat/AIChatLayout";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { ChatSidebar } from "@/components/ai-chat/ChatSidebar";
import { GenerationToolbar } from "@/components/ai-chat/GenerationToolbar";
import { HistoryDrawer } from "@/components/ai-chat/HistoryDrawer";
import { PromptInput } from "@/components/ai-chat/PromptInput";
import { SettingsPanel } from "@/components/ai-chat/SettingsPanel";
import type { ChatMessageModel, ConversationModel, GenerationPhase, StudioType } from "@/components/ai-chat/types";
import type { VoiceHistoryItem, VoiceStatistics, VoiceType } from "@/types/media";

type Props = {
  initialHistory: VoiceHistoryItem[];
  initialStats: VoiceStatistics;
};

const STORAGE_KEY = "aimedia-voice-conversations-v1";

const templates = [
  { id: "product", label: "Product Launch Voice-over", prompt: "Create a professional voice-over for this product launch." },
  { id: "onboarding", label: "Onboarding Message", prompt: "Create a warm onboarding voice message for new customers." },
  { id: "webinar", label: "Webinar Intro", prompt: "Generate a polished voice intro for an AI webinar." },
];

const studioOptions: Array<{ value: StudioType; label: string; href: string }> = [
  { value: "voice", label: "Voice Studio", href: "/dashboard/voice-studio" },
  { value: "script", label: "Script Studio", href: "/dashboard/script-studio" },
  { value: "presentation", label: "Presentation Studio", href: "/dashboard/presentation-studio" },
  { value: "podcast", label: "Podcast Studio", href: "/dashboard/podcast-studio" },
  { value: "subtitle", label: "Subtitle Studio", href: "/dashboard/subtitle-studio" },
  { value: "video", label: "Video Studio", href: "/dashboard/video-studio" },
  { value: "background-music", label: "Background Music Studio", href: "/dashboard/background-music-studio" },
  { value: "avatar", label: "Avatar Studio", href: "/dashboard/avatar-studio" },
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

  return (await response.json()) as T;
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function createMessage(partial: Omit<ChatMessageModel, "id" | "createdAt">): ChatMessageModel {
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function VoiceStudioClient({ initialHistory, initialStats }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState<VoiceType>("alloy");
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState(initialHistory);
  const [stats, setStats] = useState(initialStats);
  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [phase, setPhase] = useState<GenerationPhase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  useEffect(() => {
    const prefill = searchParams.get("prefill");
    if (prefill) {
      setPrompt(prefill);
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConversationModel[];
        setConversations(parsed);
        setActiveConversationId(parsed[0]?.id ?? null);
        return;
      }
    } catch {
      // Ignore parse failures and start fresh.
    }

    const seedConversation: ConversationModel = {
      id: createId(),
      title: "Voice-over Session",
      studio: "voice",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [
        createMessage({
          role: "assistant",
          type: "assistant",
          content: "Welcome to Voice Studio. Ask me to generate a professional voice-over and I will guide you conversationally.",
        }),
      ],
    };

    setConversations([seedConversation]);
    setActiveConversationId(seedConversation.id);
  }, []);

  useEffect(() => {
    if (conversations.length === 0) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  async function refreshAll() {
    const [newHistory, newStats] = await Promise.all([
      fetchJson<VoiceHistoryItem[]>("/api/media/voice/history"),
      fetchJson<VoiceStatistics>("/api/media/voice/statistics"),
    ]);

    setHistory(newHistory);
    setStats(newStats);
  }

  function updateConversation(conversationId: string, updater: (conversation: ConversationModel) => ConversationModel) {
    setConversations((prev) => prev.map((item) => (item.id === conversationId ? updater(item) : item)));
  }

  function createConversation() {
    const next: ConversationModel = {
      id: createId(),
      title: "New Voice Chat",
      studio: "voice",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [
        createMessage({
          role: "assistant",
          type: "assistant",
          content: "Sure. Please paste your script or describe the product, and I will generate a voice preview.",
        }),
      ],
    };
    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(next.id);
  }

  function ensureConversationId() {
    if (activeConversationId) {
      return activeConversationId;
    }
    const id = createId();
    const next: ConversationModel = {
      id,
      title: "New Voice Chat",
      studio: "voice",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(id);
    return id;
  }

  async function submitPrompt() {
    const text = prompt.trim();
    if (!text) {
      toast.error("Enter a prompt first.");
      return;
    }
    if (text.length > 5000) {
      toast.error("Prompt exceeds 5000 characters.");
      return;
    }

    const conversationId = ensureConversationId();
    const userMessage = createMessage({ role: "user", type: "user", content: text });
    const statusMessage = createMessage({ role: "system", type: "generation-status", content: "Thinking...", phase: "thinking" });

    updateConversation(conversationId, (current) => ({
      ...current,
      title: current.messages.length ? current.title : text.slice(0, 48),
      updatedAt: new Date().toISOString(),
      messages: [...current.messages, userMessage, statusMessage],
    }));

    setPrompt("");
    setIsGenerating(true);
    setPhase("thinking");

    try {
      await wait(260);
      setPhase("generating");
      updateConversation(conversationId, (current) => ({
        ...current,
        messages: current.messages.map((msg) => (msg.id === statusMessage.id ? { ...msg, phase: "generating", content: "Generating..." } : msg)),
      }));

      const created = await fetchJson<VoiceHistoryItem>("/api/media/voice/generate", {
        method: "POST",
        body: JSON.stringify({
          title: text.slice(0, 80),
          inputText: text,
          voice,
          speed,
        }),
      });

      setPhase("rendering");
      updateConversation(conversationId, (current) => ({
        ...current,
        messages: current.messages.map((msg) => (msg.id === statusMessage.id ? { ...msg, phase: "rendering", content: "Rendering..." } : msg)),
      }));

      await wait(220);
      const audioUrl = created.outputUrl ? new URL(created.outputUrl, window.location.origin).toString() : "";
      const assistantMessage = createMessage({
        role: "assistant",
        type: "audio-output",
        content: "Done. I generated an audio preview. You can play, download, copy URL, or regenerate with adjustments.",
        asset: audioUrl
          ? {
              label: created.title,
              url: audioUrl,
              kind: "audio",
            }
          : undefined,
      });

      updateConversation(conversationId, (current) => ({
        ...current,
        updatedAt: new Date().toISOString(),
        messages: [...current.messages.filter((msg) => msg.id !== statusMessage.id), assistantMessage],
      }));

      await refreshAll();
      setPhase("completed");
      toast.success("Voice generated.");
    } catch (error) {
      updateConversation(conversationId, (current) => ({
        ...current,
        messages: current.messages.filter((msg) => msg.id !== statusMessage.id).concat(
          createMessage({
            role: "assistant",
            type: "assistant",
            content: error instanceof Error ? error.message : "Generation failed.",
          }),
        ),
      }));
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  function copyAssetUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  return (
    <div className="space-y-4 pb-24">
      <AIChatLayout
        topNav={
          <div className="flex flex-wrap items-center gap-3">
            <select
              value="voice"
              onChange={(event) => {
                const selected = studioOptions.find((item) => item.value === event.target.value);
                if (selected) {
                  router.push(selected.href);
                }
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {studioOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <div>
              <h1 className="text-lg font-semibold text-slate-800">AI Media Workspace</h1>
              <p className="text-xs text-slate-500">ChatGPT-style Voice Studio with generated assets in-thread</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">Audio: {stats.totalAudioGenerated}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">Voice: {stats.mostUsedVoice}</span>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 lg:hidden"
                onClick={() => setHistoryDrawerOpen(true)}
              >
                History
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 lg:hidden"
                onClick={() => setSettingsOpen((prev) => !prev)}
              >
                Settings
              </button>
            </div>
          </div>
        }
        leftSidebar={
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onCreateConversation={createConversation}
            templates={templates}
            onUseTemplate={(text) => setPrompt(text)}
            history={history}
          />
        }
        main={
          <div className="flex h-full min-h-0 flex-col">
            <GenerationToolbar
              statuses={[
                { label: "Thinking", active: phase === "thinking" },
                { label: "Generating", active: phase === "generating" },
                { label: "Uploading", active: phase === "uploading" },
                { label: "Rendering", active: phase === "rendering" },
                { label: "Completed", active: phase === "completed" },
              ]}
            />

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {activeConversation?.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopyAssetUrl={copyAssetUrl}
                  onRegenerate={() => {
                    const latestUserMessage = [...(activeConversation.messages ?? [])]
                      .reverse()
                      .find((item) => item.role === "user");
                    if (latestUserMessage) {
                      setPrompt(latestUserMessage.content);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        }
        rightSidebar={
          <SettingsPanel
            open={settingsOpen}
            onToggle={() => setSettingsOpen((prev) => !prev)}
            voice={voice}
            speed={speed}
            onVoiceChange={setVoice}
            onSpeedChange={setSpeed}
          />
        }
        promptBox={
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => {
              void submitPrompt();
            }}
            onAttach={(files) => {
              toast.success(`${files.length} file(s) selected.`);
            }}
            disabled={isGenerating}
          />
        }
      />

      <HistoryDrawer
        open={historyDrawerOpen}
        items={conversations}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
        onClose={() => setHistoryDrawerOpen(false)}
      />
    </div>
  );
}
