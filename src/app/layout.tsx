import type { Metadata } from "next";
import "./globals.css";

import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Global Success AI - K-12 English Learning",
  description: "Play and learn English with AI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-nunito"
    >
      <body className="h-full overflow-hidden bg-page text-body font-bold">
        <div className="flex h-screen w-screen overflow-hidden">
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
