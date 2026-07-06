import { redirect } from "next/navigation";
import { getSession } from "@/common/auth";
import { AnalyticsShell } from "@/common/components";

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/app/login");

  return (
    <AnalyticsShell userName={session.user?.name} userEmail={session.user?.email}>
      {children}
    </AnalyticsShell>
  );
}
