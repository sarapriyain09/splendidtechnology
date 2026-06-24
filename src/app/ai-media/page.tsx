import type { Metadata } from "next";
import Link from "next/link";
import { aiMediaStudios } from "@/lib/ai-media";

export const metadata: Metadata = {
  title: { absolute: "AI Media Suite | Velynxia" },
  description:
    "Create scripts, voiceovers, presentations, podcasts, subtitles, videos, music and AI avatars from one platform.",
  alternates: {
    canonical: "/ai-media",
  },
};

export default function AiMediaPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-[#dce8ff] bg-[radial-gradient(circle_at_8%_8%,#d8e7ff_0%,#f8fbff_58%,#ffffff_100%)] px-6 py-10 shadow-[0_18px_42px_rgba(16,39,88,0.12)] sm:px-10 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Velynxia Platform Pillar</p>
        <h1 className="mt-2 text-4xl font-bold text-[#0e1629] sm:text-5xl">AI Media Suite</h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[#44567a]">
          Create scripts, voiceovers, presentations, podcasts, subtitles, videos, music and AI avatars from one platform.
        </p>
        <p className="mt-5 max-w-4xl text-sm leading-6 text-[#4a5a7a]">
          AI Media Suite is the second pillar of Velynxia alongside the Growth Platform, giving teams one place to produce content and activate campaigns faster.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/demo" className="rounded-md bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f56dd]">
            Book a Demo
          </Link>
          <Link href="/" className="rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]">
            View Growth Platform
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0e1629] sm:text-3xl">Studios</h2>
            <p className="mt-2 text-sm leading-6 text-[#4a5a7a]">Choose a studio to explore capabilities and planned release tracks.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {aiMediaStudios.map((studio) => (
            <article
              key={studio.slug}
              className="flex flex-col rounded-2xl border border-[#dce8ff] bg-[linear-gradient(165deg,#ffffff_0%,#f4f9ff_100%)] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d6e5ff] bg-white text-lg" aria-hidden="true">
                  {studio.icon}
                </span>
                {studio.comingSoon ? (
                  <span className="rounded-full border border-[#ffd8b0] bg-[#fff4e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a85a1a]">
                    Coming Soon
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#122443]">{studio.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#425375]">{studio.description}</p>
              <div className="mt-5">
                <Link
                  href={`/ai-media/${studio.slug}`}
                  className="inline-flex items-center rounded-md border border-[#cfe0ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c4d87] transition hover:bg-[#f4f8ff]"
                >
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
