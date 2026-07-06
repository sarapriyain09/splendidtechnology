import { AgentPlatformClient } from "@/src/services/agent-platform-client/client";

const client = new AgentPlatformClient();

export async function createMissionDraft(missionName: string) {
  return client.execute({
    tenantId: "tenant-demo",
    userId: "user-demo",
    role: "owner",
    sourceModule: "product-platform",
    correlationId: crypto.randomUUID(),
    action: "mission.create_draft",
    payload: {
      missionName,
    },
  });
}
