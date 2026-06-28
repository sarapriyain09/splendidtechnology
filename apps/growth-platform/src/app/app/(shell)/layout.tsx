import { redirect } from "next/navigation";
import { getSession } from "@/common/auth";
import { GrowthShell } from "@/common/components";

export default async function GrowthAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/app/login");

  return (
    <GrowthShell
      features={session.user?.features ?? []}
      userName={session.user?.name}
      userEmail={session.user?.email}
    >
      {children}
    </GrowthShell>
  );
}
