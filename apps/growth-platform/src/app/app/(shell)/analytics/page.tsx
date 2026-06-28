import { requireFeature } from "@/common/licensing";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  await requireFeature("ANALYTICS");

  redirect(process.env.NEXT_PUBLIC_ANALYTICS_URL ?? "https://analytics.velynxia.com");
}
