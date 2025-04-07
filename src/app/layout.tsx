import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Prompt evaluation",
  description: "App to evaluate prompt enginering",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
