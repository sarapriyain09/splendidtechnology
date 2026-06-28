"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("aimedia-theme");
    const theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("aimedia-theme", theme);
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(17, 24, 39, 0.08)",
        },
      }} />
    </SessionProvider>
  );
}
