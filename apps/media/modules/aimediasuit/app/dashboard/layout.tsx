import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 py-5 md:px-6 md:py-6">
      <main className="animate-float-in min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
