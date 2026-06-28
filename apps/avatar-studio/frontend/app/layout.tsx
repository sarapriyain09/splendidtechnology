import "./globals.css";
import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Velynxia Avatar Studio",
  description: "Standalone AI avatar studio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-space)]`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
