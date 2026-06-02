"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const INDUSTRIES = [
  "Electrical",
  "Plumbing & Heating",
  "Accountancy",
  "Engineering",
  "Manufacturing",
  "Construction",
  "Consultancy",
  "Other",
];

const NEEDS_OPTIONS = [
  "Lead & contact management",
  "Sales pipeline tracking",
  "Quote generation",
  "Follow-up reminders",
  "Dashboard & reports",
  "Multi-user / team access",
];

const PLANS = [
  { value: "starter", label: "Starter — £9/mo" },
  { value: "professional", label: "Professional — £19/mo" },
  { value: "business", label: "Business — £49/mo" },
  { value: "launch-a", label: "Launch Offer A — £99 setup + £15/mo" },
  { value: "launch-b", label: "Launch Offer B — £149/year" },
  { value: "unsure", label: "Not sure yet" },
];

export function CrmDemoForm({ defaultPlan = "" }: { defaultPlan?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);

  function toggleNeed(need: string) {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }

  async function onSubmit(formData: FormData) {
    setState("submitting");
    setErrorMsg("");

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      business: String(formData.get("business") ?? "").trim(),
      industry: String(formData.get("industry") ?? "").trim(),
      plan: String(formData.get("plan") ?? "").trim(),
      currentProcess: String(formData.get("currentProcess") ?? "").trim(),
      needs,
    };

    try {
      const res = await fetch("/api/crm-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Unable to submit request.");
      }

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="text-4xl">✅</span>
        <h2 className="mt-4 text-xl font-bold text-[#0b1f3a]">Request received!</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          We&apos;ll set up your personalised demo on{" "}
          <span className="font-semibold text-green-700">crm.splendidtechnology.co.uk</span> and
          send your login details within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Full name <span className="text-red-500">*</span></span>
          <input
            name="name"
            required
            autoComplete="name"
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Work email <span className="text-red-500">*</span></span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          />
        </label>
      </div>

      {/* Business + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Business name <span className="text-red-500">*</span></span>
          <input
            name="business"
            required
            autoComplete="organization"
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Phone <span className="text-black/30 font-normal">(optional)</span></span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          />
        </label>
      </div>

      {/* Industry + Plan */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Industry <span className="text-red-500">*</span></span>
          <select
            name="industry"
            required
            defaultValue=""
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          >
            <option value="" disabled>Select your industry…</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[#0b1f3a]">Plan you&apos;re interested in</span>
          <select
            name="plan"
            defaultValue={defaultPlan || "unsure"}
            className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-green-500"
          >
            {PLANS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* What do you need */}
      <fieldset>
        <legend className="text-sm font-medium text-[#0b1f3a]">What do you need most? <span className="text-black/30 font-normal">(select all that apply)</span></legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {NEEDS_OPTIONS.map((need) => (
            <label key={need} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={needs.includes(need)}
                onChange={() => toggleNeed(need)}
                className="h-4 w-4 rounded border-black/20 accent-green-600"
              />
              <span className="text-sm text-black/70">{need}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Current process */}
      <label className="space-y-1 block">
        <span className="text-sm font-medium text-[#0b1f3a]">How do you currently manage leads & quotes? <span className="text-black/30 font-normal">(optional)</span></span>
        <textarea
          name="currentProcess"
          rows={4}
          placeholder="e.g. Spreadsheets, WhatsApp, paper quotes…"
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
        />
      </label>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-green-600 px-8 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Request My Demo"}
        </button>
        {state === "error" && errorMsg && (
          <p className="text-sm text-red-600" role="alert">{errorMsg}</p>
        )}
      </div>

      <p className="text-xs text-black/40">
        We&apos;ll set up your personalised demo account and email you login details within 1 business day. No payment required.
      </p>
    </form>
  );
}
