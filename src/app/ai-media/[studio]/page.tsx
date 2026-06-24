import type { Metadata } from "next";
import Link from "next/link";
import { aiMediaStudios, getAiMediaStudioBySlug } from "@/lib/ai-media";

type StudioParams = { studio: string };

export const dynamic = "force-static";

export async function generateStaticParams() {
  return aiMediaStudios.map((studio) => ({ studio: studio.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StudioParams>;
}): Promise<Metadata> {
  const { studio } = await params;
  const selected = getAiMediaStudioBySlug(studio);

  if (!selected) {
    return {
      title: "AI Media Studio not found | Velynxia",
      alternates: { canonical: `/ai-media/${studio}` },
    };
  }

  return {
    title: { absolute: `${selected.title} | AI Media Suite | Velynxia` },
    description: selected.description,
    alternates: {
      canonical: `/ai-media/${selected.slug}`,
    },
  };
}

export default async function AiMediaStudioPage({
  params,
}: {
  params: Promise<StudioParams>;
}) {
  const { studio } = await params;
  const selected = getAiMediaStudioBySlug(studio);

  if (!selected) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0e1629]">Studio not found</h1>
        <p className="mt-3 text-sm text-[#4a5a7a]">The requested AI Media studio does not exist.</p>
        <div className="mt-6">
          <Link href="/ai-media" className="rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]">
            Back to AI Media Suite
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">AI Media Suite</p>
      <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold text-[#0e1629] sm:text-5xl">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6e5ff] bg-white text-xl" aria-hidden="true">
          {selected.icon}
        </span>
        <span>{selected.title}</span>
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[#44567a]">{selected.description}</p>

      <section className="mt-8 rounded-2xl border border-[#dce8ff] bg-[#f8fbff] p-6">
        <h2 className="text-xl font-bold text-[#13284d]">What you can do</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li className="rounded-lg border border-[#e0ebff] bg-white px-3 py-2 text-sm text-[#2a416d]">Generate content in minutes with guided workflows</li>
          <li className="rounded-lg border border-[#e0ebff] bg-white px-3 py-2 text-sm text-[#2a416d]">Keep branding consistent across all campaign assets</li>
          <li className="rounded-lg border border-[#e0ebff] bg-white px-3 py-2 text-sm text-[#2a416d]">Export outputs ready for marketing and sales channels</li>
          <li className="rounded-lg border border-[#e0ebff] bg-white px-3 py-2 text-sm text-[#2a416d]">Collaborate with teams from a single production workspace</li>
        </ul>
      </section>

      {selected.comingSoon ? (
        <section className="mt-8 rounded-2xl border border-[#ffd6a8] bg-[#fff7ef] p-6">
          <h2 className="text-xl font-bold text-[#713f00]">Coming Soon</h2>
          <p className="mt-3 text-sm leading-6 text-[#6e4a1c]">
            {selected.title} is currently in the rollout queue. Register interest to get priority access and launch updates.
          </p>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="rounded-md bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f56dd]">
          Book a Demo
        </Link>
        <Link href="/ai-media" className="rounded-md border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] hover:bg-[#f4f8ff]">
          Back to AI Media Suite
        </Link>
      </div>
    </main>
  );
}
