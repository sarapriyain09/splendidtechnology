"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AutomationShellProps {
  userName?: string | null;
  userEmail?: string | null;
  children: React.ReactNode;
}

export function AutomationShell({ userName, userEmail, children }: AutomationShellProps) {
  const pathname = usePathname();
  const active = pathname === "/app/automation" || pathname.startsWith("/app/automation/");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="flex w-60 flex-col border-r border-[#1d2f4f] bg-[#0f1d33]">
        <div className="border-b border-[#1d2f4f] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f65c8] text-sm font-bold text-white">V</div>
            <div>
              <p className="text-sm font-bold text-[#edf3ff]">Velynxia</p>
              <p className="text-xs text-[#b8c8e6]">Automation</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-3">
          <Link
            href="/app/automation"
            className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-[#10213d]"
                : "text-[#dbe7ff] hover:bg-[#173156] hover:text-white"
            }`}
          >
            Workflows
          </Link>
        </nav>

        <div className="border-t border-[#1d2f4f] px-3 py-4">
          <div className="rounded-md border border-[#2a4369] bg-[#132845] px-3 py-2">
            <p className="truncate text-xs font-medium text-[#edf3ff]">{userName ?? "User"}</p>
            <p className="truncate text-xs text-[#b8c8e6]">{userEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/app/login" })}
            className="mt-2 w-full py-1 text-xs font-medium text-[#c7d6f2] hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
