import type { Metadata } from "next";
import "./globals.scss";
import Background from '../components/background/background'
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Prompt evaluation",
  description: "App to evaluate prompt enginering",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body cz-shortcut-listen="true">
            <Background/>
            {children}
            <Toaster />
        </body>
        </html>
    );
}
