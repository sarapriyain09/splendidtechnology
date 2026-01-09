import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatButton } from "@/components/ChatButton";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Splendid Technology",
  description:
    "Custom web apps, e-commerce, automation, and AI integrations — from CodLearn prototypes to production-ready delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.variable} min-h-screen antialiased`}>
        <SiteHeader />
        <main className="w-full">{children}</main>
        <SiteFooter />
        <ChatButton
          phoneNumber={"+447721952967"}
          message={"Welcome to Splendid Technology, contact for any question?"}
        />
      </body>
    </html>
  );
}
