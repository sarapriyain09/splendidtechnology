import { notFound } from "next/navigation";

import { AppShell } from "@/src/components/app-shell";
import { MissionGrid } from "@/src/components/mission-grid";
import { ModuleWorkspace } from "@/src/components/module-workspace";
import { AI_MISSIONS } from "@/src/modules/ai/missions";
import { getModuleBySlug } from "@/src/modules/navigation/items";

type ModulePageProps = {
  params: Promise<{ module: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const moduleConfig = getModuleBySlug(module);

  if (!moduleConfig) {
    notFound();
  }

  const href = `/${moduleConfig.slug}`;

  if (moduleConfig.slug === "missions") {
    return (
      <AppShell title={moduleConfig.label} activeHref={href}>
        <MissionGrid missions={AI_MISSIONS} />
      </AppShell>
    );
  }

  return (
    <AppShell title={moduleConfig.label} activeHref={href}>
      <ModuleWorkspace module={moduleConfig} />
    </AppShell>
  );
}
