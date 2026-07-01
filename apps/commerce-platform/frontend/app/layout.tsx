import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velynxia Product Studio",
  description: "Product-first commerce operating platform for product development, commerce, operations, and business workflows",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
