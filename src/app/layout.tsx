import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
// import Header from "@/components/header/Header";

export const metadata: Metadata = {
  title: "Prompt evaluation",
  description: "App to evaluate prompt enginering",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
            {children}
        </body>
        </html>
    );
}
