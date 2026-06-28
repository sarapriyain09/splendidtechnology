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
      setMessage("Thanks. We will review your request and reply with the recommended next step shortly.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <header>
        <h2 className="text-2xl font-bold text-[#0e1629]">Tell Us About Your Project</h2>
        <p className="mt-2 text-sm leading-6 text-[#4d5d80]">
          We will use this to shape your CRM and AI automation discovery conversation.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-[#1b2f56]">Name</span>
          <input
            name="name"
            required
            placeholder="Your full name"
            className="h-11 w-full rounded-xl border border-[#d2dff9] bg-white px-3 text-sm outline-none transition focus:border-[#1f6dff]"
            autoComplete="name"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-[#1b2f56]">Work Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="h-11 w-full rounded-xl border border-[#d2dff9] bg-white px-3 text-sm outline-none transition focus:border-[#1f6dff]"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-[#1b2f56]">What do you want to improve?</span>
        <textarea
          name="message"
          required
          rows={7}
          placeholder="Example: We need better lead follow-up, pipeline visibility, and automated reminders across email and SMS."
          className="w-full rounded-xl border border-[#d2dff9] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1f6dff]"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1f6dff] px-5 text-sm font-semibold text-white transition hover:bg-[#1147bf] disabled:opacity-60"
        >
          {state === "submitting" ? "Sending..." : "Request Discovery Call"}
        </button>
        {message ? (
          <p className="text-sm text-[#4d5d80]" role={state === "error" ? "alert" : undefined}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
