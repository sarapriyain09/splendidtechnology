"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { AIChatLayout } from "@/components/ai-chat/AIChatLayout";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { ChatSidebar } from "@/components/ai-chat/ChatSidebar";
import { GenerationToolbar } from "@/components/ai-chat/GenerationToolbar";
import { HistoryDrawer } from "@/components/ai-chat/HistoryDrawer";
import { PromptInput } from "@/components/ai-chat/PromptInput";
import type { ChatMessageModel, ConversationModel, GenerationPhase, StudioType } from "@/components/ai-chat/types";
import type { ScriptGenerateResponse, ScriptGoal, ScriptHistoryItem, ScriptLength, ScriptStatistics, ScriptTone } from "@/types/media";

const STORAGE_KEY = "aimedia-script-conversations-v1";

type ScriptSettings = {
  goal: ScriptGoal;
  tone: ScriptTone;
  length: ScriptLength;
  audience: string;
  callToAction: string;
};

const templates = [
  { id: "social-launch", label: "Social Launch", prompt: "Create a short social launch script for our AI media product." },
  { id: "sales-outreach", label: "Sales Outreach", prompt: "Write a professional sales outreach script for SaaS decision makers." },
  { id: "youtube-intro", label: "YouTube Intro", prompt: "Create an engaging YouTube intro script for small business owners." },
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

function toPlainTextDownloadFileName(title: string) {
  return `${title.replace(/\s+/g, "-").toLowerCase() || "script"}.txt`;
}

export function ScriptStudioClient() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<ScriptSettings>({
    goal: "social",
    tone: "professional",
    length: "medium",
    audience: "",
    callToAction: "",
  });

  const [history, setHistory] = useState<ScriptHistoryItem[]>([]);
  const [stats, setStats] = useState<ScriptStatistics>({
    totalScriptsGenerated: 0,
    mostUsedGoal: "N/A",
    recentScripts: 0,
  });

  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [phase, setPhase] = useState<GenerationPhase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "favorites">("all");

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  useEffect(() => {
    void refreshAll();
  }, []);

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
      // Ignore parse failures and start clean.
    }

    const initial: ConversationModel = {
      id: createId(),
      title: "Script Session",
      studio: "script",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [
        createMessage({
          role: "assistant",
          type: "assistant",
          content: "Tell me your topic and audience, and I will generate a high-converting script you can refine in chat.",
        }),
      ],
    };

    setConversations([initial]);
    setActiveConversationId(initial.id);
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "favorites") {
      return history.filter((item) => item.isFavorite);
    }
    return history;
  }, [history, historyFilter]);

  async function refreshAll() {
    const [newHistory, newStats] = await Promise.all([
      fetchJson<ScriptHistoryItem[]>("/api/media/script/history"),
      fetchJson<ScriptStatistics>("/api/media/script/statistics"),
    ]);
    setHistory(newHistory);
    setStats(newStats);
  }

  function updateConversation(conversationId: string, updater: (conversation: ConversationModel) => ConversationModel) {
    setConversations((prev) => prev.map((item) => (item.id === conversationId ? updater(item) : item)));
  }

  function ensureConversationId() {
    if (activeConversationId) {
      return activeConversationId;
    }

    const id = createId();
    const next: ConversationModel = {
      id,
      title: "New Script Chat",
      studio: "script",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(id);
    return id;
  }

  function createConversation() {
    const next: ConversationModel = {
      id: createId(),
      title: "New Script Chat",
      studio: "script",
      favorite: false,
      updatedAt: new Date().toISOString(),
      messages: [
        createMessage({
          role: "assistant",
          type: "assistant",
          content: "Ready. Share your campaign objective and I will draft your script.",
        }),
      ],
    };
    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(next.id);
  }

  async function submitPrompt() {
    const text = prompt.trim();
    if (!text) {
      toast.error("Enter a prompt first.");
      return;
    }

    if (!settings.audience.trim()) {
      toast.error("Add target audience in settings.");
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
      await wait(250);
      setPhase("generating");
      updateConversation(conversationId, (current) => ({
        ...current,
        messages: current.messages.map((msg) => (msg.id === statusMessage.id ? { ...msg, phase: "generating", content: "Generating..." } : msg)),
      }));

      const generated = await fetchJson<ScriptGenerateResponse>("/api/media/script/generate", {
        method: "POST",
        body: JSON.stringify({
          title: text.slice(0, 120),
          goal: settings.goal,
          tone: settings.tone,
          length: settings.length,
          audience: settings.audience,
          prompt: text,
          callToAction: settings.callToAction || undefined,
        }),
      });

      setPhase("rendering");
      updateConversation(conversationId, (current) => ({
        ...current,
        messages: current.messages.map((msg) => (msg.id === statusMessage.id ? { ...msg, phase: "rendering", content: "Rendering..." } : msg)),
      }));

      await wait(210);

      const scriptText = generated.script || generated.outputText;
      const assistantMessage = createMessage({
        role: "assistant",
        type: "assistant",
        content: `${scriptText}\n\nMeta: ${generated.meta.goal} | ${generated.meta.tone} | ${generated.meta.length}`,
+      });
+
+      const exportMessage = createMessage({
+        role: "assistant",
+        type: "subtitle-output",
+        content: "Script generated. Use actions to download text, send to Voice Studio, or regenerate.",
+        asset: {
+          label: generated.title,
+          url: `data:text/plain;charset=utf-8,${encodeURIComponent(scriptText)}`,
+          kind: "file",
+        },
       });

       updateConversation(conversationId, (current) => ({
         ...current,
         updatedAt: new Date().toISOString(),
-        messages: [...current.messages.filter((msg) => msg.id !== statusMessage.id), assistantMessage],
+        messages: [...current.messages.filter((msg) => msg.id !== statusMessage.id), assistantMessage, exportMessage],
       }));

       await refreshAll();
       setPhase("completed");
       toast.success("Script generated.");
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

   async function toggleFavorite(item: ScriptHistoryItem) {
     try {
       await fetchJson<{ id: string; isFavorite: boolean }>(`/api/media/script/${item.id}`, {
         method: "PATCH",
         body: JSON.stringify({ isFavorite: !item.isFavorite }),
       });
       await refreshAll();
       toast.success(item.isFavorite ? "Removed from favorites." : "Marked as favorite.");
     } catch (error) {
       toast.error(error instanceof Error ? error.message : "Favorite update failed.");
     }
   }

   async function removeScript(id: string) {
     try {
       await fetchJson<null>(`/api/media/script/${id}`, { method: "DELETE" });
       await refreshAll();
       toast.success("Script deleted.");
     } catch (error) {
       toast.error(error instanceof Error ? error.message : "Delete failed.");
     }
   }

   async function duplicateScript(id: string) {
     try {
       await fetchJson<{ id: string }>(`/api/media/script/${id}`, {
         method: "POST",
         body: JSON.stringify({ action: "duplicate" }),
       });
       await refreshAll();
       toast.success("Script duplicated.");
     } catch (error) {
       toast.error(error instanceof Error ? error.message : "Duplicate failed.");
     }
   }

   function loadFromHistory(item: ScriptHistoryItem) {
     setSettings((prev) => ({
       ...prev,
       goal: item.goal,
       tone: item.tone,
       length: item.length,
       audience: item.audience,
       callToAction: item.callToAction ?? "",
     }));

     const conversationId = ensureConversationId();
     const loadedMessage = createMessage({
       role: "assistant",
       type: "assistant",
       content: `${item.outputText}\n\nLoaded from history (${format(new Date(item.createdAt), "MMM d, h:mm a")}).`,
     });

     updateConversation(conversationId, (current) => ({
       ...current,
       updatedAt: new Date().toISOString(),
       messages: [...current.messages, loadedMessage],
     }));

     toast.success("Script loaded into conversation.");
   }

   function sendLatestToVoiceStudio() {
     const latestAssistant = [...(activeConversation?.messages ?? [])].reverse().find((item) => item.role === "assistant" && item.type === "assistant");
     if (!latestAssistant) {
       toast.error("No script output available yet.");
       return;
     }

     const params = new URLSearchParams({
       prefill: latestAssistant.content,
       title: "Script Voiceover",
     });

     router.push(`/dashboard/voice-studio?${params.toString()}`);
   }

   function copyAssetUrl(url: string) {
     navigator.clipboard.writeText(url);
     toast.success("Asset URL copied");
   }

   return (
     <div className="space-y-4 pb-24">
       <AIChatLayout
         topNav={
           <div className="flex flex-wrap items-center gap-3">
             <select
               value="script"
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
               <p className="text-xs text-slate-500">ChatGPT-style Script Studio with reusable generation threads</p>
             </div>

             <div className="ml-auto flex items-center gap-2">
               <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs text-cyan-700">Scripts: {stats.totalScriptsGenerated}</span>
               <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">Top Goal: {stats.mostUsedGoal}</span>
               <button
                 type="button"
                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
                 onClick={sendLatestToVoiceStudio}
               >
                 Send to Voice
               </button>
               <button
                 type="button"
                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 lg:hidden"
                 onClick={() => setHistoryDrawerOpen(true)}
               >
                 History
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
             history={[]}
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

             <div className="border-t border-slate-200 p-3">
               <div className="mb-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                 <label className="text-xs text-slate-600">
                   Goal
                   <select
                     className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700"
                     value={settings.goal}
                     onChange={(event) => setSettings((prev) => ({ ...prev, goal: event.target.value as ScriptGoal }))}
                   >
                     <option value="social">social</option>
                     <option value="ad">ad</option>
                     <option value="youtube">youtube</option>
                     <option value="email">email</option>
                     <option value="sales">sales</option>
                   </select>
                 </label>

                 <label className="text-xs text-slate-600">
                   Tone
                   <select
                     className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700"
                     value={settings.tone}
                     onChange={(event) => setSettings((prev) => ({ ...prev, tone: event.target.value as ScriptTone }))}
                   >
                     <option value="professional">professional</option>
                     <option value="friendly">friendly</option>
                     <option value="bold">bold</option>
                     <option value="educational">educational</option>
                     <option value="storytelling">storytelling</option>
                   </select>
                 </label>

                 <label className="text-xs text-slate-600">
                   Length
                   <select
                     className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700"
                     value={settings.length}
                     onChange={(event) => setSettings((prev) => ({ ...prev, length: event.target.value as ScriptLength }))}
                   >
                     <option value="short">short</option>
                     <option value="medium">medium</option>
                     <option value="long">long</option>
                   </select>
                 </label>

                 <label className="text-xs text-slate-600">
                   Audience
                   <input
                     className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700"
                     placeholder="B2B SaaS founders"
                     value={settings.audience}
                     onChange={(event) => setSettings((prev) => ({ ...prev, audience: event.target.value }))}
                   />
                 </label>
               </div>

               <label className="mb-2 block text-xs text-slate-600">
                 Call To Action
                 <input
                   className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700"
                   placeholder="Book a demo"
                   value={settings.callToAction}
                   onChange={(event) => setSettings((prev) => ({ ...prev, callToAction: event.target.value }))}
                 />
               </label>
             </div>
           </div>
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

       <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
         <div className="mb-3 flex items-center justify-between">
           <h2 className="text-sm font-semibold text-slate-800">Script History Actions</h2>
           <div className="flex gap-2 text-xs">
             <button
               type="button"
               className={`rounded-lg border px-2 py-1 ${historyFilter === "all" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}
               onClick={() => setHistoryFilter("all")}
             >
               All
             </button>
             <button
               type="button"
               className={`rounded-lg border px-2 py-1 ${historyFilter === "favorites" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600"}`}
               onClick={() => setHistoryFilter("favorites")}
             >
               Favorites
             </button>
           </div>
         </div>

         <div className="space-y-2">
           {filteredHistory.slice(0, 12).map((item) => (
             <div key={item.id} className="grid gap-2 rounded-xl border border-slate-200 px-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
               <div className="min-w-0">
                 <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                 <p className="text-xs text-slate-500">{item.goal} | {item.tone} | {item.length} | {format(new Date(item.createdAt), "MMM d, h:mm a")}</p>
               </div>

               <div className="flex flex-wrap gap-2 text-xs">
                 <button
                   type="button"
                   className="rounded-lg border border-slate-200 px-2 py-1 text-slate-700"
                   onClick={() => loadFromHistory(item)}
                 >
                   Load
                 </button>
                 <button
                   type="button"
                   className="rounded-lg border border-slate-200 px-2 py-1 text-slate-700"
                   onClick={() => {
                     const blob = new Blob([item.outputText], { type: "text/plain;charset=utf-8" });
                     const url = URL.createObjectURL(blob);
                     const a = document.createElement("a");
                     a.href = url;
                     a.download = toPlainTextDownloadFileName(item.title);
                     a.click();
                     URL.revokeObjectURL(url);
                   }}
                 >
                   TXT
                 </button>
                 <button
                   type="button"
                   className="rounded-lg border border-slate-200 px-2 py-1 text-slate-700"
                   onClick={() => {
                     const params = new URLSearchParams({
                       prefill: item.outputText,
                       title: item.title,
                     });
                     router.push(`/dashboard/voice-studio?${params.toString()}`);
                   }}
                 >
                   To Voice
                 </button>
                 <button
                   type="button"
                   className="rounded-lg border border-amber-200 px-2 py-1 text-amber-700"
                   onClick={() => {
                     void toggleFavorite(item);
                   }}
                 >
                   {item.isFavorite ? "Unfavorite" : "Favorite"}
                 </button>
                 <button
                   type="button"
                   className="rounded-lg border border-slate-200 px-2 py-1 text-slate-700"
                   onClick={() => {
                     void duplicateScript(item.id);
                   }}
                 >
                   Duplicate
                 </button>
                 <button
                   type="button"
                   className="rounded-lg border border-rose-200 px-2 py-1 text-rose-700"
                   onClick={() => {
                     void removeScript(item.id);
                   }}
                 >
                   Delete
                 </button>
               </div>
             </div>
           ))}

           {filteredHistory.length === 0 ? <p className="text-sm text-slate-500">No script history yet.</p> : null}
         </div>
       </section>

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
