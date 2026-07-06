"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { visibleNavItems } from "@/common/navigation/growth-nav";
import { AiAssistantPopup } from "./AiAssistantPopup";

interface GrowthShellProps {
  features: string[];
  userName?: string | null;
  userEmail?: string | null;
  children: React.ReactNode;
}

export function GrowthShell({
  features,
  userName,
  userEmail,
  children,
}: GrowthShellProps) {
  const pathname = usePathname();
  const items = visibleNavItems(features);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue with next-auth sign out fallback.
    }

    try {
      await signOut({
        redirect: false,
      });
    } catch {
      // Cookie clear above is enough for server-side guards.
    }

    window.location.href = "/app/login?logout=1";
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="flex w-60 flex-col border-r border-[#1d2f4f] bg-[#0f1d33]">
        <div className="border-b border-[#1d2f4f] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f65c8] text-sm font-bold text-white shadow-sm">V</div>
            <div>
              <p className="text-sm font-bold leading-tight text-[#edf3ff]">Velynxia</p>
              <p className="text-xs text-[#b8c8e6]">Growth Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-3">
          {items.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-[#dbe7ff] transition-colors hover:bg-[#173156] hover:text-white"
                >
                  {item.label}
                  <span className="text-xs text-[#8ea3c8]">↗</span>
                </a>
              );
            }
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-[#10213d] shadow-sm"
                    : "text-[#dbe7ff] hover:bg-[#173156] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#1d2f4f] px-3 py-4">
          <div className="rounded-md border border-[#2a4369] bg-[#132845] px-3 py-2">
            <p className="truncate text-xs font-medium text-[#edf3ff]">{userName ?? "User"}</p>
            <p className="truncate text-xs text-[#b8c8e6]">{userEmail}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 w-full py-1 text-xs font-medium text-[#c7d6f2] transition-colors hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <AiAssistantPopup />
    </div>
  );
}
