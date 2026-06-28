"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { PromptBar } from "@/components/layout/prompt-bar";
import { RightPanel } from "@/components/layout/right-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { Workspace } from "@/components/workspace/workspace";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function StudioShell() {
  const { theme, setTheme } = useWorkspaceStore();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("avatar-studio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("avatar-studio-theme", theme);
  }, [theme]);

  return (
    <div className="studio-shell min-h-screen bg-[color:var(--page)] text-[color:var(--text)] transition-colors duration-200">
      <Header />
      <div className="flex min-h-[calc(100vh-64px-104px)]">
        <Sidebar />
        <section className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_20%_10%,var(--orb),transparent_35%),radial-gradient(circle_at_80%_20%,var(--orb-2),transparent_30%)]">
          <Workspace />
        </section>
        <RightPanel />
      </div>
      <PromptBar />
    </div>
  );
}
