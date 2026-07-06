import { redirect } from "next/navigation";
import { getSession } from "@/common/auth";
import { AutomationShell } from "@/common/components";

export default async function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/app/login");

  return (
    <AutomationShell userName={session.user?.name} userEmail={session.user?.email}>
      {children}
    </AutomationShell>
  );
}
