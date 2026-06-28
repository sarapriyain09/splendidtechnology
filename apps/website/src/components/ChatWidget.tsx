"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type ChatPayload = {
  name: string;
  email: string;
  message: string;
  pageUrl?: string;
};

function getPageUrl() {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const storageKey = "splendidtech.chat.identity.v1";
  const initialIdentity = useMemo(() => {
    if (typeof window === "undefined") return { name: "", email: "" };
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return { name: "", email: "" };
      const parsed = JSON.parse(raw) as { name?: string; email?: string };
      return {
        name: String(parsed?.name ?? ""),
        email: String(parsed?.email ?? ""),
      };
    } catch {
      return { name: "", email: "" };
    }
  }, []);

  const [name, setName] = useState(initialIdentity.name);
  const [email, setEmail] = useState(initialIdentity.email);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ name, email }));
    } catch {
      // ignore
    }
  }, [email, name]);

  async function submit() {
    setState("submitting");
    setStatusMessage("");

    const payload: ChatPayload = {
      name,
      email,
      message,
      pageUrl: getPageUrl(),
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Unable to send message.");
      }

      setState("success");
      setStatusMessage("Thanks — we’ll reply shortly.");
      setMessage("");
    } catch (error) {
      setState("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0b3d91] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d91]/30"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Chat with us
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Chat"
          className="fixed bottom-20 right-6 z-50 w-[min(360px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-black/10 bg-white"
        >
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <p className="text-sm font-semibold">Chat</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1 text-sm text-black/70 hover:bg-black/5"
              aria-label="Close chat"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-medium">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
                  autoComplete="name"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-xs font-medium">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={state === "submitting" || !message.trim()}
                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white disabled:opacity-60"
              >
                {state === "submitting" ? "Sending…" : "Send"}
              </button>
              {statusMessage ? (
                <p
                  className="text-xs text-black/70"
                  role={state === "error" ? "alert" : undefined}
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
