import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Header from "@/components/header/Header";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Prompt evaluation",
  description: "App to evaluate prompt enginering",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body

        >
        <Header />
        <main>
            {children}
        </main>

        </body>
        </html>
    );
}
