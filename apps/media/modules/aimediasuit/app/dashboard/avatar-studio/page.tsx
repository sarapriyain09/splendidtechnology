import { AvatarStudioClient } from "@/components/avatar-studio/avatar-studio-client";

export default function AvatarStudioPage() {
  const isEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.ENABLE_AVATAR_STUDIO === "true";

  if (!isEnabled) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0f172a]/80 p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Avatar Studio</p>
        <h1 className="mt-2 text-2xl font-bold">Not Enabled In This Environment</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Avatar Studio is deployed but currently disabled for this environment.
          Set ENABLE_AVATAR_STUDIO=true to enable the feature rollout.
        </p>
      </div>
    );
  }

  return <AvatarStudioClient />;
}
