"use client";

import { toPng } from "html-to-image";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { OnePagerGenerateResponse, OnePagerSection } from "@/types/media";

type SocialPlatform = "linkedin" | "facebook";
type ContentLength = "short" | "medium" | "long";
type SizePresetKey = OnePagerGenerateResponse["sizePreset"];

const sizePresets: Record<SizePresetKey, { label: string; platform: SocialPlatform; width: number; height: number }> = {
  "linkedin-square": { label: "LinkedIn Square (1080 x 1080)", platform: "linkedin", width: 1080, height: 1080 },
  "linkedin-landscape": { label: "LinkedIn Landscape (1200 x 627)", platform: "linkedin", width: 1200, height: 627 },
  "facebook-square": { label: "Facebook Square (1080 x 1080)", platform: "facebook", width: 1080, height: 1080 },
  "facebook-landscape": { label: "Facebook Landscape (1200 x 630)", platform: "facebook", width: 1200, height: 630 },
  "facebook-story": { label: "Facebook Story (1080 x 1920)", platform: "facebook", width: 1080, height: 1920 },
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({ error: "Request failed." }))) as { error?: string };
    throw new Error(data.error ?? "Request failed.");
  }

  return (await response.json()) as T;
}

const exampleSeed = {
  brandName: "Velynxia",
  productName: "AI Media Suite",
  audience: "SME founders, marketing teams, and agencies",
  offerSummary:
    "Create high-converting scripts, generate campaign visuals, and produce branded media assets from one workspace.",
  tone: "bold, premium, modern",
  callToAction: "Start Your Free Trial",
  keyPoints:
    "AI-powered creativity across script, image, and media workflows\nAutomate repetitive content operations\nScale output while keeping brand consistency",
  includeImage: true,
};

export function OnePagerCreatorClient() {
  const [brandName, setBrandName] = useState(exampleSeed.brandName);
  const [productName, setProductName] = useState(exampleSeed.productName);
  const [audience, setAudience] = useState(exampleSeed.audience);
  const [offerSummary, setOfferSummary] = useState(exampleSeed.offerSummary);
  const [tone, setTone] = useState(exampleSeed.tone);
  const [callToAction, setCallToAction] = useState(exampleSeed.callToAction);
  const [keyPoints, setKeyPoints] = useState(exampleSeed.keyPoints);
  const [platform, setPlatform] = useState<SocialPlatform>("linkedin");
  const [contentLength, setContentLength] = useState<ContentLength>("medium");
  const [sizePreset, setSizePreset] = useState<SizePresetKey>("linkedin-square");
  const [includeImage, setIncludeImage] = useState(exampleSeed.includeImage);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [previewMode, setPreviewMode] = useState<"design" | "plain">("design");
  const [result, setResult] = useState<OnePagerGenerateResponse | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);

  const keyPointList = useMemo(
    () =>
      keyPoints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [keyPoints],
  );

  const availablePresets = useMemo(
    () =>
      (Object.entries(sizePresets) as Array<[SizePresetKey, (typeof sizePresets)[SizePresetKey]]>).filter(
        ([, preset]) => preset.platform === platform,
      ),
    [platform],
  );

  const selectedPreset = sizePresets[sizePreset];

  const plainTextOutput = useMemo(() => {
    if (!result) {
      return "";
    }

    const sections = result.sections.map((section) => `${section.heading}\n${section.text}`).join("\n\n");
    const benefits = result.benefits.map((benefit) => `- ${benefit}`).join("\n");

    return [
      result.title,
      result.subtitle,
      "",
      result.intro,
      "",
      sections,
      "",
      "Key Benefits",
      benefits,
      "",
      `${result.ctaLabel}: ${result.ctaText}`,
    ]
      .join("\n")
      .trim();
  }, [result]);

  const setPlatformWithPreset = (nextPlatform: SocialPlatform) => {
    setPlatform(nextPlatform);
    const firstPreset = (Object.entries(sizePresets) as Array<[SizePresetKey, (typeof sizePresets)[SizePresetKey]]>).find(
      ([, preset]) => preset.platform === nextPlatform,
    );
    if (firstPreset) {
      setSizePreset(firstPreset[0]);
    }
  };

  const createOnePager = async () => {
    setLoading(true);

    try {
      const payload = {
        brandName,
        productName,
        audience,
        offerSummary,
        tone,
        callToAction,
        keyPoints: keyPointList,
        platform,
        contentLength,
        sizePreset,
        includeImage,
      };

      const generated = await postJson<OnePagerGenerateResponse>("/api/media/one-pager/generate", payload);
      setResult(generated);
      toast.success(includeImage ? "One-pager and image generated." : "One-pager generated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate one-pager.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsImage = async () => {
    if (!result || !previewCardRef.current) {
      return;
    }

    setDownloading(true);
    try {
      const dataUrl = await toPng(previewCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        canvasWidth: selectedPreset.width,
        canvasHeight: selectedPreset.height,
        backgroundColor: "#04091d",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "one-pager"}-${platform}-${ts}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export image.";
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  const copyPlainText = async () => {
    if (!plainTextOutput) {
      return;
    }

    setCopying(true);
    try {
      await navigator.clipboard.writeText(plainTextOutput);
      toast.success("Plain text copied.");
    } catch {
      toast.error("Failed to copy plain text.");
    } finally {
      setCopying(false);
    }
  };

  const downloadPlainText = () => {
    if (!plainTextOutput) {
      return;
    }

    const blob = new Blob([plainTextOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "one-pager"}-${platform}-${ts}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded.");
  };

  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl p-6 md:p-7">
        <p className="display-font text-xs uppercase tracking-[0.18em] text-cyan-200/80">Marketing Lab</p>
        <h1 className="display-font mt-2 text-3xl text-white md:text-4xl">One Pager Creator</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
          Turn a simple brief into a polished one-page marketing content layout. Optionally generate a matching hero image in the same request.
        </p>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[1.05fr_1.35fr]">
        <div className="panel min-w-0 rounded-3xl p-5 md:p-6">
          <h2 className="display-font text-xl text-white">Brief</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Brand Name</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Product</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Target Audience</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Offer Summary</span>
              <textarea
                className="mt-1.5 h-24 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={offerSummary}
                onChange={(e) => setOfferSummary(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Tone</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Call To Action</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Platform</span>
                <select
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 focus:border-cyan-300/50"
                  value={platform}
                  onChange={(e) => setPlatformWithPreset(e.target.value as SocialPlatform)}
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Content Length</span>
                <select
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 focus:border-cyan-300/50"
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value as ContentLength)}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Post Size</span>
              <select
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 focus:border-cyan-300/50"
                value={sizePreset}
                onChange={(e) => setSizePreset(e.target.value as SizePresetKey)}
              >
                {availablePresets.map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Key Points (One Per Line)</span>
              <textarea
                className="mt-1.5 h-28 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={includeImage}
                onChange={(e) => setIncludeImage(e.target.checked)}
                className="h-4 w-4 accent-cyan-400"
              />
              Include hero image generation
            </label>

            <button
              onClick={createOnePager}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(76,92,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate One Pager"}
            </button>
          </div>
        </div>

        <div className="panel rounded-3xl p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="display-font text-xl text-white">Preview</h2>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-white/15 bg-white/5 p-1">
                <button
                  onClick={() => setPreviewMode("design")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    previewMode === "design" ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Design
                </button>
                <button
                  onClick={() => setPreviewMode("plain")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    previewMode === "plain" ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Plain Text
                </button>
              </div>

              {previewMode === "design" ? (
                <button
                  onClick={downloadAsImage}
                  disabled={!result || downloading}
                  className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloading ? "Downloading..." : "Download PNG"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPlainText}
                    disabled={!result || !plainTextOutput || copying}
                    className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copying ? "Copying..." : "Copy Text"}
                  </button>
                  <button
                    onClick={downloadPlainText}
                    disabled={!result || !plainTextOutput}
                    className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Download TXT
                  </button>
                </div>
              )}
            </div>
          </div>

          {!result ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">
              Generate your one-pager to preview structured content and optional image output.
            </div>
          ) : previewMode === "design" ? (
            <div className="mt-4 space-y-4 text-slate-100">
              <div className="max-h-[72vh] overflow-auto rounded-2xl border border-white/15 bg-black/20 p-3">
                <div
                  ref={previewCardRef}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#04091d] p-5"
                  style={{ width: `${selectedPreset.width}px`, height: `${selectedPreset.height}px` }}
                >
                  {result.imageUrl ? (
                    <div className="absolute inset-0 opacity-45">
                      <img src={result.imageUrl} alt="Generated marketing visual" className="h-full w-full object-cover" />
                    </div>
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-b from-[#04091d]/55 via-[#04091d]/78 to-[#04091d]/96" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">{result.title}</p>
                      <h3 className="display-font mt-1.5 text-4xl leading-tight text-white">{result.subtitle}</h3>
                      <p className="mt-3 text-base leading-relaxed text-slate-200">{result.intro}</p>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {result.sections.slice(0, 4).map((section) => (
                        <div key={section.heading} className="rounded-lg border border-white/15 bg-black/25 p-2.5">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-violet-200/80">{section.heading}</p>
                          <p className="mt-1 text-sm text-slate-200">{section.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <ul className="space-y-1 text-sm text-slate-200">
                        {result.benefits.slice(0, 4).map((benefit) => (
                          <li key={benefit}>• {benefit}</li>
                        ))}
                      </ul>

                      <div className="mt-3 rounded-lg bg-gradient-to-r from-violet-500/45 to-blue-500/45 p-3">
                        <p className="text-sm text-slate-100">{result.ctaText}</p>
                        <div className="mt-2 inline-flex rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-900">{result.ctaLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Preview is constrained for editing. Scroll inside the preview frame to see the full canvas.
              </p>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-400">
                <p>
                  Target: {result.platform} | Length: {result.contentLength} | Size: {selectedPreset.width} x {selectedPreset.height}
                </p>
                <p>Image Prompt: {result.imagePrompt || "Not requested"}</p>
                <p className="mt-1">
                  AI: {result.ai.provider} - {result.ai.model}
                </p>
                <p className="mt-1">Generated: {new Date(result.generatedAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/80">Plain Social Copy</p>
                <p className="mt-1 text-xs text-slate-400">Optimized for quick copy-paste into LinkedIn and Facebook.</p>
                <textarea
                  readOnly
                  value={plainTextOutput}
                  className="mt-3 h-[420px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-slate-100 outline-none"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-400">
                <p>Target: {result.platform} | Length: {result.contentLength}</p>
                <p className="mt-1">
                  AI: {result.ai.provider} - {result.ai.model}
                </p>
                <p className="mt-1">Generated: {new Date(result.generatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}