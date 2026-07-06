import { requireFeature } from "@/common/licensing";
import { redirect } from "next/navigation";

export default async function AutomationPage() {
  await requireFeature("AUTOMATION");

  redirect(process.env.NEXT_PUBLIC_AUTOMATION_URL ?? "https://automation.velynxia.com");
}
