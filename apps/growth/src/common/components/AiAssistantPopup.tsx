"use client";

import { useEffect, useRef, useState } from "react";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What can the Velynxia platform do?",
  "Draft a follow-up email to a warm lead.",
  "Which app should I use to run an outreach campaign?",
];

export function AiAssistantPopup() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, open, loading]);

  async function send(question?: string) {
    const q = (question ?? prompt).trim();
    if (!q || loading) return;

    setError("");
    setPrompt("");
    const history = turns.map((t) => ({ role: t.role, content: t.content }));
    setTurns((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, history }),
      });
      const data = (await res.json().catch(() => ({}))) as { output?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Assistant request failed.");
      } else {
        setTurns((prev) => [...prev, { role: "assistant", content: data.output ?? "No response." }]);
      }
    } catch {
      setError("Assistant request failed.");
    }

    setLoading(false);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2f65c8] text-white shadow-lg transition-colors hover:bg-[#2b5cb8]"
          aria-label="Open AI assistant"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[24rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[#1d2f4f] bg-[#0f1d33] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1d2f4f] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2f65c8] text-xs font-bold text-white">V</div>
              <div>
                <p className="text-sm font-semibold text-[#edf3ff]">Velynxia Assistant</p>
                <p className="text-[11px] text-[#b8c8e6]">Growth Platform</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#8ea3c8] transition-colors hover:text-white"
              aria-label="Close assistant"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {turns.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-[#b8c8e6]">Ask me anything about your growth platform.</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-lg border border-[#2a4369] bg-[#132845] px-3 py-2 text-left text-xs text-[#dbe7ff] transition-colors hover:bg-[#173156]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {turns.map((turn, i) => (
              <div key={i} className={turn.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    turn.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[#2f65c8] px-3 py-2 text-sm text-white"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-[#2a4369] bg-[#132845] px-3 py-2 text-sm text-[#edf3ff]"
                  }
                >
                  {turn.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[#2a4369] bg-[#132845] px-3 py-2 text-sm text-[#b8c8e6]">
                  Thinking…
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</div>
            )}

            <div ref={endRef} />
          </div>

          <div className="border-t border-[#1d2f4f] p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={1}
                placeholder="Type a message…"
                className="max-h-28 flex-1 resize-none rounded-lg border border-[#2a4369] bg-[#132845] px-3 py-2 text-sm text-[#edf3ff] placeholder:text-[#6f86ad] focus:border-[#2f65c8] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !prompt.trim()}
                className="rounded-lg bg-[#2f65c8] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2b5cb8] disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
