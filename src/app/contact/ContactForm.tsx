"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
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
      setMessage("Thanks — we’ll get back to you shortly.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Name</span>
          <input
            name="name"
            required
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
            autoComplete="name"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
            autoComplete="email"
          />
        </label>
      </div>
      <label className="space-y-1">
        <span className="text-sm font-medium">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Send"}
        </button>
        {message ? (
          <p className="text-sm text-black/70" role={state === "error" ? "alert" : undefined}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
